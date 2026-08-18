"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { useEffetIsomorphe } from "@/lib/animation";
import { DECALAGE_ENTETE, scrollVers } from "@/lib/scroll";

// Angle entre deux cartes sur le cylindre, et rayon exprimé en hauteurs de
// cadre : les cartes sont posées sur la surface d'un cylindre, pas simplement
// décalées puis inclinées — c'est ce qui donne la rotation autour d'un axe.
const ANGLE = 44;
const RAYON = 1.5;

// Une carte voisine atteint l'opacité nulle exactement à un cran d'écart : au
// repos on ne voit que la carte active, et c'est uniquement pendant la rotation
// qu'elles se croisent — visibles, donc déformation lisible, sans jamais rester
// affichées derrière.
const FONDU = 1;
const PORTEE = 1.02;

// Marge entre le bord du cadre et les cartes : laisse la place à l'inclinaison
// avant que le rognage n'intervienne.
const MARGE_CADRE = 36;

// Franchissement de carte. Le premier pas d'une impulsion part vite ; les
// suivants, à l'intérieur d'un même geste, sont soumis à trois conditions.
const SEUIL_MOLETTE = 30;
const FIN_IMPULSION_MS = 140;
const COOLDOWN_MS = 260;
const SEUIL_REPRISE = 120;
// Part du pic d'amplitude du geste en dessous de laquelle on considère qu'on
// n'a plus affaire qu'à de l'inertie. C'est le discriminant : la queue d'inertie
// d'une impulsion décroît, un geste entretenu se maintient près de son pic.
const PART_PIC = 0.6;

// Le rouleau ne joue pas un tween par cran : il glisse en continu vers la carte
// visée. Un tween à durée fixe décélère jusqu'à l'arrêt avant que le cran
// suivant ne reparte, et se voit redémarré s'il arrive en cours de route — d'où
// une impression de saccade en enchaînant. Ici, changer de cible ne fait que
// déplacer la cible : le mouvement, lui, n'est jamais interrompu.
const LISSAGE = 0.14;
const ARRIVEE = 0.0008;
// Distance au bout de laquelle on décide si le geste appartient au rouleau ou
// au défilement de la page. Court volontairement : au-delà, le navigateur a
// déjà engagé son propre panoramique et annule le pointeur.
const SEUIL_AXE = 4;
// Part de carte à parcourir pour valider un changement au relâchement. Un
// arrondi simple exigeait la moitié d'une carte, soit presque toute la largeur
// de l'écran au pouce.
const SEUIL_VALIDATION = 0.25;
const ALIGNEMENT = 90; // tolérance pour considérer le panneau aligné à l'écran

// Résistance au bord : il faut deux impulsions distinctes pour quitter le
// panneau. Compter des impulsions plutôt qu'une quantité de molette rend le
// seuil identique à la souris et au trackpad, qui n'émettent pas du tout les
// mêmes deltas.
const IMPULSIONS_SORTIE = 2;
const DEPASSEMENT_MAX = 34;
// Fenêtre pendant laquelle les impulsions au bord se cumulent. À 700 ms elle
// était trop courte : deux poussées franches, séparées par le temps de relever
// les doigts, retombaient à zéro entre les deux.
const REPOS_BORD_MS = 1200;

// En dessous de cette largeur le rouleau bascule sur un axe vertical : on
// balaie de gauche à droite. Sur un écran étroit, le doigt qui monte doit
// rendre la page au défilement — sinon le pied de page est inatteignable, et le
// même geste voudrait dire deux choses.
const REQUETE_HORIZONTAL = "(max-width: 1023px)";

export default function Rouleau({ cartes, panneauPrecedent, className = "" }) {
  const racineRef = useRef(null);
  const cadreRef = useRef(null);
  const elementsRef = useRef([]);
  const etatRef = useRef({ position: 0 });
  const depassementRef = useRef({ valeur: 0 });
  const mesuresRef = useRef({ etendue: 0, rayon: 0, horizontal: false });
  const cacheRef = useRef([]);
  const cibleRef = useRef(0);
  const boucleActiveRef = useRef(false);
  const [actif, setActif] = useState(0);
  const [horizontal, setHorizontal] = useState(false);

  const nombre = cartes.length;

  // Tout ce qui déclenche un calcul de mise en page est fait ici, une fois par
  // montage et par redimensionnement — jamais dans la boucle d'animation.
  const mesurer = useCallback(() => {
    const cadre = cadreRef.current;
    if (!cadre) return;
    const enHorizontal = window.matchMedia(REQUETE_HORIZONTAL).matches;

    // `etendue` est la dimension le long de laquelle les cartes défilent :
    // la hauteur en vertical, la largeur en horizontal. Tout le reste du
    // calcul est identique, seul l'axe change.
    const brut = enHorizontal ? cadre.clientWidth : cadre.clientHeight;
    const etendue = Math.max(200, (brut || 1) - MARGE_CADRE);
    mesuresRef.current = {
      etendue,
      rayon: etendue * RAYON,
      horizontal: enHorizontal,
    };

    elementsRef.current.forEach((el) => {
      if (!el) return;
      if (enHorizontal) {
        el.style.width = `${etendue}px`;
        el.style.height = "";
      } else {
        el.style.width = "";
        el.style.height = `${etendue}px`;
      }
    });
  }, []);

  /**
   * Boucle de rendu. Écriture directe de `transform` et `opacity` : ce sont les
   * deux seules propriétés que le compositeur traite sans recalcul de mise en
   * page. Tout le reste (display, z-index, inert) n'est touché qu'au changement
   * de valeur, et le flou de profondeur a été retiré — repasser un flou sur des
   * cartes de cette taille à chaque image était la cause des à-coups.
   */
  const rendre = useCallback(() => {
    const { etendue, rayon, horizontal: enH } = mesuresRef.current;
    if (!etendue) return;

    const cadre = cadreRef.current;
    if (cadre) {
      const d = depassementRef.current.valeur.toFixed(2);
      cadre.style.transform = enH
        ? `translate3d(${d}px, 0, 0)`
        : `translate3d(0, ${d}px, 0)`;
    }

    const position = etatRef.current.position;

    elementsRef.current.forEach((el, i) => {
      if (!el) return;
      const cache = (cacheRef.current[i] ??= {});
      const ecart = i - position;
      const distance = Math.abs(ecart);
      const horsPortee = distance > PORTEE;

      // `inert` est réglé avant le retour anticipé : sinon une carte sortie de
      // portée conserve sa dernière valeur et reste focusable au clavier et
      // lue par un lecteur d'écran alors qu'elle est masquée.
      const inerte = horsPortee || distance > 0.5;
      if (cache.inert !== inerte) {
        el.inert = inerte;
        cache.inert = inerte;
      }

      const display = horsPortee ? "none" : "block";
      if (cache.display !== display) {
        el.style.display = display;
        cache.display = display;
      }
      if (horsPortee) return;

      const rad = (ecart * ANGLE * Math.PI) / 180;
      const long = rayon * Math.sin(rad) - etendue / 2;
      const z = rayon * Math.cos(rad) - rayon;
      const angle = (enH ? ecart : -ecart) * ANGLE;

      el.style.transform = enH
        ? `translate3d(${long.toFixed(2)}px, 0, ${z.toFixed(2)}px) rotateY(${angle.toFixed(2)}deg)`
        : `translate3d(0, ${long.toFixed(2)}px, ${z.toFixed(2)}px) rotateX(${angle.toFixed(2)}deg)`;
      el.style.opacity = Math.max(0, 1 - distance * FONDU).toFixed(3);

      const plan = Math.round(100 - distance * 10);
      if (cache.plan !== plan) {
        el.style.zIndex = plan;
        cache.plan = plan;
      }
    });
  }, []);

  // Expression de fonction nommée : `boucle` se retire lui-même du ticker, et
  // le nom interne référence la fonction elle-même — un `const boucle` extérieur
  // serait lu avant sa propre initialisation.
  const boucle = useCallback(function boucle() {
    const etat = etatRef.current;
    const ecart = cibleRef.current - etat.position;

    if (Math.abs(ecart) < ARRIVEE) {
      etat.position = cibleRef.current;
      rendre();
      gsap.ticker.remove(boucle);
      boucleActiveRef.current = false;
      return;
    }

    // Lissage exponentiel corrigé de la cadence réelle : la course reste
    // identique à 60 comme à 120 Hz.
    etat.position += ecart * (1 - (1 - LISSAGE) ** gsap.ticker.deltaRatio());
    rendre();
  }, [rendre]);

  const suivreCible = useCallback(() => {
    if (boucleActiveRef.current) return;
    boucleActiveRef.current = true;
    gsap.ticker.add(boucle);
  }, [boucle]);

  const figerSurPosition = useCallback(() => {
    cibleRef.current = etatRef.current.position;
    if (!boucleActiveRef.current) return;
    gsap.ticker.remove(boucle);
    boucleActiveRef.current = false;
  }, [boucle]);

  /** Ramène une carte à sa première ligne. */
  const remonterCarte = useCallback((i) => {
    const interne = elementsRef.current[i]?.querySelector(".carte");
    if (interne && interne.scrollTop !== 0) interne.scrollTop = 0;
  }, []);

  const aller = useCallback(
    (cible) => {
      const n = Math.max(0, Math.min(nombre - 1, cible));

      // Une carte qui entre se présente toujours par le haut. Sans ça elle
      // garde le défilement interne laissé lors de son dernier passage. On ne
      // touche pas au cas où l'on revient sur la carte courante — un balayage
      // trop court ne doit pas faire perdre sa lecture.
      if (n !== cibleRef.current) remonterCarte(n);

      setActif(n);
      cibleRef.current = n;
      suivreCible();
    },
    [nombre, remonterCarte, suivreCible],
  );

  useEffect(() => () => gsap.ticker.remove(boucle), [boucle]);

  // Le rouleau ne prend la main que lorsque son panneau occupe l'écran.
  const estAligne = useCallback(() => {
    const section = cadreRef.current?.closest("section");
    if (!section) return false;
    return (
      Math.abs(section.getBoundingClientRect().top - DECALAGE_ENTETE) <
      ALIGNEMENT
    );
  }, []);

  useEffetIsomorphe(() => {
    const depuisAncre = window.location.hash
      ? cartes.findIndex((c) => `#${c.id}` === window.location.hash)
      : -1;
    if (depuisAncre > 0) {
      etatRef.current.position = depuisAncre;
      cibleRef.current = depuisAncre;
      setActif(depuisAncre);
    }

    const requete = window.matchMedia(REQUETE_HORIZONTAL);
    setHorizontal(requete.matches);

    mesurer();
    rendre();

    const surRedimensionnement = () => {
      mesurer();
      rendre();
    };
    const surOrientation = () => {
      setHorizontal(requete.matches);
      mesurer();
      rendre();
    };

    window.addEventListener("resize", surRedimensionnement);
    requete.addEventListener("change", surOrientation);
    return () => {
      window.removeEventListener("resize", surRedimensionnement);
      requete.removeEventListener("change", surOrientation);
    };
  }, [cartes, mesurer, rendre]);

  // Le passage en horizontal déplace la navigation sous le rouleau, ce qui
  // élargit le cadre. `mesurer` appelé dans l'effet qui change l'orientation
  // lirait l'ancienne largeur : il faut remesurer une fois le rendu appliqué.
  useEffetIsomorphe(() => {
    mesurer();
    rendre();
  }, [horizontal, mesurer, rendre]);

  // Molette et trackpad. L'écouteur est posé sur le rouleau lui-même, pas sur
  // le panneau : hors du rouleau, la molette n'est jamais interceptée et c'est
  // la page qui défile normalement.
  useEffect(() => {
    const racine = racineRef.current;
    const section = racine?.closest("section");
    if (!racine || !section) return;

    let cumul = 0; // depuis le début de l'impulsion, avant le premier pas
    let cumulDepuisPas = 0; // depuis le dernier pas franchi
    let pic = 0; // plus grande amplitude vue dans l'impulsion en cours
    let dernierPas = 0;
    let enImpulsion = false;
    let premierPasFait = false;
    let impulsionsBord = 0;
    let verrouPanneau = false;
    let finImpulsion;
    let minuteurBord;
    let rebond;

    /** Le geste est considéré terminé après FIN_IMPULSION_MS sans événement. */
    const marquerImpulsion = (ampleur) => {
      const nouvelle = !enImpulsion;
      enImpulsion = true;
      if (nouvelle) {
        cumul = 0;
        cumulDepuisPas = 0;
        pic = 0;
        premierPasFait = false;
      }
      pic = Math.max(pic, ampleur);
      clearTimeout(finImpulsion);
      finImpulsion = setTimeout(() => {
        enImpulsion = false;
      }, FIN_IMPULSION_MS);
      return nouvelle;
    };

    /**
     * Un pas est-il autorisé ? Le premier d'une impulsion ne demande qu'un seuil
     * bas, pour rester réactif. Les suivants exigent en plus un délai, une
     * distance, et une amplitude encore proche du pic du geste — c'est cette
     * dernière condition qui laisse enchaîner un scroll entretenu tout en
     * refusant la queue d'inertie, qui elle s'éteint.
     */
    const pasAutorise = (ampleur, maintenant) => {
      if (!premierPasFait) return Math.abs(cumul) >= SEUIL_MOLETTE;
      return (
        maintenant - dernierPas >= COOLDOWN_MS &&
        ampleur >= pic * PART_PIC &&
        Math.abs(cumulDepuisPas) >= SEUIL_REPRISE
      );
    };

    const consommerPas = (maintenant) => {
      premierPasFait = true;
      dernierPas = maintenant;
      cumul = 0;
      cumulDepuisPas = 0;
    };

    const relacherBord = () => {
      impulsionsBord = 0;
      rebond?.kill();
      rebond = gsap.to(depassementRef.current, {
        valeur: 0,
        duration: 0.45,
        ease: "power2.out",
        onUpdate: rendre,
      });
    };

    const quitterPanneau = (cible) => {
      if (verrouPanneau || !cible) return;
      verrouPanneau = true;
      relacherBord();
      scrollVers(cible);
      setTimeout(() => {
        verrouPanneau = false;
      }, 1100);
    };

    const surMolette = (e) => {
      // En horizontal la molette n'est jamais captée : le doigt et la molette
      // servent au défilement vertical de la page, les cartes se changent au
      // balayage, aux flèches ou aux pastilles.
      if (mesuresRef.current.horizontal) return;

      // Le panneau a pu être laissé de travers en défilant à côté du rouleau.
      // Sous le curseur, le rouleau doit répondre : on le remet d'abord en
      // place, plutôt que de rester sourd.
      if (!estAligne()) {
        e.preventDefault();
        e.stopPropagation();
        quitterPanneau("#cartes");
        return;
      }

      // Le rouleau garde la main sur toute la molette tant que son panneau est
      // à l'écran : la page ne doit jamais dériver pendant qu'on parcourt les
      // cartes.
      e.preventDefault();
      e.stopPropagation();

      const ampleur = Math.abs(e.deltaY);
      const maintenant = e.timeStamp || performance.now();
      marquerImpulsion(ampleur);
      cumul += e.deltaY;
      cumulDepuisPas += e.deltaY;

      const versLeBas = e.deltaY > 0;
      const indice = Math.round(etatRef.current.position);
      const enBout =
        (versLeBas && indice >= nombre - 1) || (!versLeBas && indice <= 0);

      if (enBout) {
        clearTimeout(minuteurBord);
        minuteurBord = setTimeout(relacherBord, REPOS_BORD_MS);

        if (pasAutorise(ampleur, maintenant)) {
          impulsionsBord += 1;
          consommerPas(maintenant);
        }

        // Débattement élastique : signale la résistance dès la première
        // sollicitation, et se remplit à mesure qu'on insiste.
        rebond?.kill();
        depassementRef.current.valeur =
          (versLeBas ? -1 : 1) *
          DEPASSEMENT_MAX *
          Math.min(1, impulsionsBord / IMPULSIONS_SORTIE);
        rendre();

        if (impulsionsBord >= IMPULSIONS_SORTIE) {
          quitterPanneau(versLeBas ? "#pied" : panneauPrecedent);
        }
        return;
      }

      impulsionsBord = 0;
      if (!pasAutorise(ampleur, maintenant)) return;

      aller(indice + Math.sign(e.deltaY));
      consommerPas(maintenant);
    };

    // Seule intervention hors du rouleau : absorber la molette pendant un
    // changement de panneau. Sans ça les crans qui suivent le déclenchement
    // font dérailler le déplacement et on s'arrête entre deux panneaux.
    const surMoletteFenetre = (e) => {
      if (!verrouPanneau) return;
      e.preventDefault();
      e.stopPropagation();
    };

    racine.addEventListener("wheel", surMolette, { passive: false });
    window.addEventListener("wheel", surMoletteFenetre, {
      passive: false,
      capture: true,
    });

    return () => {
      clearTimeout(finImpulsion);
      clearTimeout(minuteurBord);
      rebond?.kill();
      racine.removeEventListener("wheel", surMolette);
      window.removeEventListener("wheel", surMoletteFenetre, { capture: true });
    };
  }, [aller, estAligne, nombre, panneauPrecedent, rendre]);

  // Glisser à la souris ou au doigt
  useEffect(() => {
    const cadre = cadreRef.current;
    if (!cadre) return;
    let depart = null;
    let departX = 0;
    let departY = 0;
    let positionDepart = 0;
    let aGlisse = false;
    let axe = null; // null tant qu'indécis, puis "rouleau" ou "page"

    // Le long de l'axe du rouleau : vertical sur grand écran, horizontal sinon.
    const surAxe = (e) => (mesuresRef.current.horizontal ? e.clientX : e.clientY);

    const surAppui = (e) => {
      if (e.button !== undefined && e.button !== 0) return;
      depart = surAxe(e);
      departX = e.clientX;
      departY = e.clientY;
      positionDepart = etatRef.current.position;
      aGlisse = false;
      axe = null;

      // Les voisines apparaissent progressivement pendant le glissé : on les
      // remonte dès l'appui, sinon on les voit défiler à mi-hauteur avant de
      // se recaler au relâchement.
      const courante = Math.round(positionDepart);
      elementsRef.current.forEach((_, i) => {
        if (i !== courante) remonterCarte(i);
      });

      // Le glissé prend la main sur le lissage en cours.
      figerSurPosition();
    };

    const surDeplacement = (e) => {
      if (depart === null) return;
      const dx = e.clientX - departX;
      const dy = e.clientY - departY;

      // Verrouillage d'axe dès les premiers pixels. Sans lui, un balayage
      // légèrement oblique était réclamé par le défilement natif, qui annulait
      // le pointeur en cours de route — d'où l'impression de devoir s'y
      // reprendre à plusieurs fois.
      if (!axe) {
        if (Math.max(Math.abs(dx), Math.abs(dy)) < SEUIL_AXE) return;
        const long = mesuresRef.current.horizontal ? dx : dy;
        const travers = mesuresRef.current.horizontal ? dy : dx;
        axe = Math.abs(long) >= Math.abs(travers) ? "rouleau" : "page";
        if (axe === "page") {
          depart = null; // le geste revient à la page
          return;
        }
      }

      aGlisse = true;
      // En horizontal le pas suit la largeur d'une carte : le doigt déplace le
      // rouleau d'autant qu'il parcourt de carte.
      const m = mesuresRef.current;
      const pas = (m.horizontal ? m.etendue : m.rayon * (ANGLE / 57.3)) || 1;
      etatRef.current.position = Math.max(
        -0.5,
        Math.min(nombre - 0.5, positionDepart - (surAxe(e) - depart) / pas),
      );
      rendre();
    };

    // `touch-action` seul ne suffit pas : une fois le geste attribué au
    // rouleau, il faut retenir le panoramique natif, sinon le navigateur
    // continue de faire défiler et finit par annuler le pointeur. Écouteur non
    // passif, c'est la condition pour que `preventDefault` soit pris en compte.
    const surToucheDeplacement = (e) => {
      if (axe === "rouleau" && e.cancelable) e.preventDefault();
    };

    const surRelache = () => {
      axe = null;
      if (depart === null) return;
      depart = null;
      if (!aGlisse) return;

      // Au-delà d'une demi-carte on arrondit à la plus proche ; en deçà, un
      // quart suffit à valider le cran suivant, sinon on revient en place.
      const parcouru = etatRef.current.position - positionDepart;
      const ampleur = Math.abs(parcouru);
      if (ampleur >= 0.5) aller(Math.round(etatRef.current.position));
      else if (ampleur >= SEUIL_VALIDATION)
        aller(positionDepart + Math.sign(parcouru));
      else aller(positionDepart);
    };

    // Un glissé qui se termine sur une carte-lien ne doit pas naviguer.
    const surClic = (e) => {
      if (!aGlisse) return;
      e.preventDefault();
      e.stopPropagation();
      aGlisse = false;
    };

    cadre.addEventListener("pointerdown", surAppui);
    window.addEventListener("pointermove", surDeplacement);
    window.addEventListener("pointerup", surRelache);
    window.addEventListener("pointercancel", surRelache);
    cadre.addEventListener("touchmove", surToucheDeplacement, { passive: false });
    cadre.addEventListener("click", surClic, true);

    return () => {
      cadre.removeEventListener("pointerdown", surAppui);
      window.removeEventListener("pointermove", surDeplacement);
      window.removeEventListener("pointerup", surRelache);
      window.removeEventListener("pointercancel", surRelache);
      cadre.removeEventListener("touchmove", surToucheDeplacement);
      cadre.removeEventListener("click", surClic, true);
    };
  }, [aller, figerSurPosition, nombre, remonterCarte, rendre]);

  // Clavier
  useEffect(() => {
    const surTouche = (e) => {
      const cible = e.target;
      if (
        cible instanceof HTMLElement &&
        (cible.isContentEditable ||
          ["INPUT", "TEXTAREA", "SELECT"].includes(cible.tagName))
      ) {
        return;
      }
      if (!estAligne()) return;

      const indice = Math.round(etatRef.current.position);
      const enH = mesuresRef.current.horizontal;
      const touches = {
        ArrowRight: indice + 1,
        ArrowLeft: indice - 1,
        PageDown: indice + 1,
        PageUp: indice - 1,
        Home: 0,
        End: nombre - 1,
        // Les flèches verticales ne pilotent le rouleau que lorsqu'il tourne
        // sur cet axe ; en horizontal elles restent au défilement de la page.
        ...(enH ? {} : { ArrowDown: indice + 1, ArrowUp: indice - 1 }),
      };
      if (!(e.key in touches)) return;
      e.preventDefault();

      if (touches[e.key] < 0) {
        if (enH) return;
        scrollVers(panneauPrecedent);
        return;
      }
      if (touches[e.key] > nombre - 1) {
        if (enH) return;
        scrollVers("#pied");
        return;
      }
      aller(touches[e.key]);
    };

    window.addEventListener("keydown", surTouche);
    return () => window.removeEventListener("keydown", surTouche);
  }, [aller, estAligne, nombre, panneauPrecedent]);

  // Les ancres du header désignent des cartes : il faut amener le panneau à
  // l'écran puis tourner le rouleau, au lieu de faire défiler jusqu'à elles.
  useEffect(() => {
    const surClic = (e) => {
      if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey) return;
      const lien = e.target.closest("a[href]");
      if (!lien) return;
      const url = new URL(lien.href, window.location.href);
      if (url.pathname !== window.location.pathname || !url.hash) return;
      const i = cartes.findIndex((c) => `#${c.id}` === url.hash);
      if (i === -1) return;
      // Pas de `stopPropagation` ici : il empêcherait aussi le `onClick` des
      // composants en aval — le menu repliable ne se refermait plus. Next
      // vérifie `defaultPrevented` avant de naviguer, `preventDefault` suffit.
      e.preventDefault();
      scrollVers("#cartes");
      aller(i);
      window.history.pushState(null, "", url.hash);
    };
    document.addEventListener("click", surClic, true);
    return () => document.removeEventListener("click", surClic, true);
  }, [aller, cartes]);

  // En horizontal la navigation passe sous le rouleau, en ligne : sur un écran
  // étroit, la colonne latérale était réduite à 16 px et ses cibles à 7 px.
  return (
    <div
      ref={racineRef}
      className={`relative flex min-h-0 ${
        horizontal ? "flex-col" : "items-stretch"
      } ${className}`}
    >
      <div
        ref={cadreRef}
        data-rouleau
        className={`rouleau flex-1 ${horizontal ? "rouleau--horizontal" : ""}`}
      >
        {cartes.map((carte, i) => (
          <div
            key={carte.id}
            id={carte.id}
            ref={(el) => {
              elementsRef.current[i] = el;
            }}
            className="rouleau-carte"
          >
            {carte.contenu}
          </div>
        ))}
      </div>

      <nav
        aria-label="Navigation entre les cartes"
        className={
          horizontal
            ? "mt-2 flex shrink-0 items-center justify-center gap-1"
            : "ml-4 flex shrink-0 flex-col items-center justify-center gap-3 sm:ml-6"
        }
      >
        <button
          type="button"
          onClick={() => aller(actif - 1)}
          disabled={actif === 0}
          aria-label="Carte précédente"
          className="rouleau-fleche"
        >
          {horizontal ? "←" : "↑"}
        </button>

        {cartes.map((carte, i) => (
          <button
            key={carte.id}
            type="button"
            onClick={() => aller(i)}
            aria-label={carte.titre}
            aria-current={i === actif ? "true" : undefined}
            className={`rouleau-pastille ${i === actif ? "est-active" : ""}`}
          />
        ))}

        <button
          type="button"
          onClick={() => aller(actif + 1)}
          disabled={actif === nombre - 1}
          aria-label="Carte suivante"
          className="rouleau-fleche"
        >
          {horizontal ? "→" : "↓"}
        </button>
      </nav>
    </div>
  );
}
