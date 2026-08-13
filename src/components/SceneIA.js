"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffetIsomorphe } from "@/lib/animation";

gsap.registerPlugin(ScrollTrigger);

// Scène en trait : l'humain arrive de la gauche, la machine de la droite,
// ils se serrent la main puis repartent ensemble vers la droite.
// Tout est dessiné en `currentColor` pour suivre le thème clair/sombre.

const SOL = 212;

// Amplitudes du cycle de marche, réutilisées pour repositionner les membres
// avant de relancer le cycle (sinon les jambes sautent d'un coup à la reprise).
const AMPL_JAMBE = 22;
const AMPL_BRAS = 16;

// Pose d'arrêt : campé sur ses jambes. À rotation 0 les deux jambes et le bras
// arrière se superposent au torse et la silhouette se réduit à un bâton.
const ARRET_JAMBE = 9;
const ARRET_BRAS = 5;

// Grossissement de la scène autour du point de contact au sol : le viewBox est
// large (900) pour laisser la place à l'approche, les personnages y seraient
// sinon minuscules.
const ECHELLE = 1.4;

// Positions d'arrêt : les deux mains se rejoignent exactement au centre (x=450).
// La demi-longueur du bras vaut 48, d'où l'écartement.
const REPOS_HUMAIN = -48;
const REPOS_ROBOT = 48;

// Distances et durées dérivées de l'échelle : en dur, changer ECHELLE laissait
// les personnages marcher plusieurs secondes hors cadre à chaque bout.
const HORS_CHAMP = Math.round(450 / ECHELLE) + 40;
const VITESSE = 120; // unités/s, calée sur l'amplitude des jambes (glissement des pieds)

// Repères de la timeline, en secondes. Chaînés pour rester lisibles si l'un bouge.
const T_DEBUT = 0.5;
const DUREE_APPROCHE = (HORS_CHAMP - REPOS_ROBOT) / VITESSE;
const T_ARRET = T_DEBUT + DUREE_APPROCHE;
const T_TENDRE = T_ARRET + 0.15;
const T_POIGNEE = T_TENDRE + 0.65;
const T_RELACHE = T_POIGNEE + 1.2;
const T_PREPOSE = T_RELACHE + 0.4;
const T_DEPART = T_PREPOSE + 0.2;
const DUREE_DEPART = (HORS_CHAMP + REPOS_ROBOT) / VITESSE;
const T_SORTIE = T_DEPART + DUREE_DEPART - 0.4;

// Légende posée sous chaque silhouette. C'est elle qui fait basculer la lecture
// du dessin approximatif vers le schéma assumé — le trait ne prétend plus être
// un dessin, il désigne. Placée hors du groupe de contenu pour ne pas suivre le
// ballant de la marche, ni le miroir appliqué à la machine.
// `fill` et `stroke` sont réécrits : le groupe parent trace en `stroke` seul,
// un texte y serait détouré sans remplissage.
function Etiquette({ texte }) {
  return (
    <text
      data-etiquette
      x="0"
      y="234"
      textAnchor="middle"
      className="font-mono"
      fill="currentColor"
      stroke="none"
      fontSize="11"
      letterSpacing="2"
    >
      {texte}
    </text>
  );
}

function Humain() {
  return (
    <g data-humain transform={`translate(${REPOS_HUMAIN},0)`}>
      <Etiquette texte="HUMAIN" />
      <g data-h-contenu>
        <circle cx="0" cy="98" r="15" />
        <line x1="0" y1="113" x2="0" y2="156" />
        <g data-h-bras-arr transform="translate(0,122)">
          <line x1="0" y1="0" x2="0" y2="42" />
          <circle cx="0" cy="42" r="4.5" fill="currentColor" />
        </g>
        <g data-h-jambe-a transform="translate(0,156)">
          <line x1="0" y1="0" x2="0" y2="56" />
        </g>
        <g data-h-jambe-b transform="translate(0,156)">
          <line x1="0" y1="0" x2="0" y2="56" />
        </g>
        <g data-h-bras-av transform="translate(0,122)">
          <line x1="0" y1="0" x2="0" y2="48" />
          <circle data-h-main cx="0" cy="48" r="4.5" fill="currentColor" />
        </g>
      </g>
    </g>
  );
}

// Le sens du robot est posé uniquement en JS : un `scale(-1,1)` dans le markup
// serait relu par GSAP comme scaleX:-1 et se combinerait au sien — miroir annulé.
function Machine() {
  return (
    <g data-robot transform={`translate(${REPOS_ROBOT},0)`}>
      <Etiquette texte="IA" />
      <g data-r-contenu>
        {/* Bras arrière en premier, et caisson opaque : sinon il traverse
            visiblement le torse ajouré au lieu de passer derrière. */}
        <g data-r-bras-arr transform="translate(0,122)">
          <line x1="0" y1="0" x2="0" y2="40" />
          <rect x="-4.5" y="35.5" width="9" height="9" rx="2" fill="currentColor" />
        </g>
        <line x1="0" y1="62" x2="0" y2="74" />
        <circle cx="0" cy="58" r="4" className="text-accent" fill="currentColor" />
        <rect x="-17" y="74" width="34" height="30" rx="9" fill="var(--canvas)" />
        <circle cx="-7" cy="89" r="2.6" className="text-accent" fill="currentColor" />
        <circle cx="7" cy="89" r="2.6" className="text-accent" fill="currentColor" />
        <rect
          x="-15"
          y="110"
          width="30"
          height="46"
          rx="8"
          fill="var(--canvas)"
        />
        <g data-r-jambe-a transform="translate(0,156)">
          <line x1="0" y1="0" x2="0" y2="56" />
        </g>
        <g data-r-jambe-b transform="translate(0,156)">
          <line x1="0" y1="0" x2="0" y2="56" />
        </g>
        <g data-r-bras-av transform="translate(0,122)">
          <line x1="0" y1="0" x2="0" y2="48" />
          <rect data-r-main x="-4.5" y="43.5" width="9" height="9" rx="2" fill="currentColor" />
        </g>
      </g>
    </g>
  );
}

export default function SceneIA() {
  const ref = useRef(null);

  useEffetIsomorphe(() => {
    const racine = ref.current;
    if (!racine) return;

    const q = (s) => racine.querySelector(s);
    const humain = q("[data-humain]");
    const robot = q("[data-robot]");
    const rContenu = q("[data-r-contenu]");
    const hContenu = q("[data-h-contenu]");

    const jambesAvant = [q("[data-h-jambe-a]"), q("[data-r-jambe-a]")];
    const jambesArriere = [q("[data-h-jambe-b]"), q("[data-r-jambe-b]")];
    const jambes = [...jambesAvant, ...jambesArriere];
    const brasArr = [q("[data-h-bras-arr]"), q("[data-r-bras-arr]")];
    const brasAv = [q("[data-h-bras-av]"), q("[data-r-bras-av]")];
    const etiquettes = Array.from(racine.querySelectorAll("[data-etiquette]"));

    const ctx = gsap.context(() => {
      // `svgOrigin` et pas `transformOrigin` : sur du SVG, GSAP mesure
      // transformOrigin depuis le coin de la bbox, alors que les pivots voulus
      // (épaule, hanche, axe du corps) sont des points du repère utilisateur.
      // La bbox d'un bras déborde de son axe à cause de la main — l'épaule
      // serait ratée de 4,5 unités, et le miroir du robot de 17.
      gsap.set(jambes, { svgOrigin: "0 156" });
      gsap.set([...brasArr, ...brasAv], { svgOrigin: "0 122" });
      gsap.set(rContenu, { svgOrigin: "0 0", scaleX: -1 });

      // Pose finale figée si l'utilisateur a demandé moins de mouvement.
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        gsap.set(humain, { x: REPOS_HUMAIN });
        gsap.set(robot, { x: REPOS_ROBOT });
        gsap.set(brasAv, { rotation: -90 });
        gsap.set(jambesAvant, { rotation: ARRET_JAMBE });
        gsap.set(jambesArriere, { rotation: -ARRET_JAMBE });
        gsap.set(brasArr, { rotation: -ARRET_BRAS });
        return;
      }

      // Les légendes n'apparaissent qu'à la rencontre. Masquées ici plutôt que
      // dans le markup : sans JS, ou en mouvement réduit, elles doivent rester
      // lisibles — c'est elles qui portent le sens de la scène.
      gsap.set(etiquettes, { autoAlpha: 0 });

      // Cycle de marche : jambes en opposition, bras en contre-balancier.
      const cycle = gsap.timeline({ repeat: -1, yoyo: true, paused: true });
      cycle
        .fromTo(
          jambesAvant,
          { rotation: -AMPL_JAMBE },
          { rotation: AMPL_JAMBE, duration: 0.36, ease: "sine.inOut" },
          0,
        )
        .fromTo(
          jambesArriere,
          { rotation: AMPL_JAMBE },
          { rotation: -AMPL_JAMBE, duration: 0.36, ease: "sine.inOut" },
          0,
        )
        .fromTo(
          brasArr,
          { rotation: AMPL_BRAS },
          { rotation: -AMPL_BRAS, duration: 0.36, ease: "sine.inOut" },
          0,
        )
        .fromTo(
          brasAv,
          { rotation: -AMPL_BRAS },
          { rotation: AMPL_BRAS, duration: 0.36, ease: "sine.inOut" },
          0,
        )
        .fromTo(
          [hContenu, rContenu],
          { y: 0 },
          { y: -2.5, duration: 0.18, ease: "sine.inOut", yoyo: true, repeat: 1 },
          0,
        );

      // `marche` mémorise si le cycle devrait tourner : quand la scène sort du
      // viewport on met tout en pause, et il faut savoir quoi reprendre au retour.
      let marche = false;
      const lancerMarche = () => {
        marche = true;
        cycle.play(0);
      };
      const arreterMarche = () => {
        marche = false;
        cycle.pause();
      };

      const tl = gsap.timeline({ repeat: -1, repeatDelay: 0.9, paused: true });

      tl.set(humain, { x: -HORS_CHAMP, autoAlpha: 1 })
        .set(robot, { x: HORS_CHAMP, autoAlpha: 1 }, 0)
        .set(rContenu, { scaleX: -1 }, 0)
        .set([...jambes, ...brasArr, ...brasAv], { rotation: 0 }, 0)
        .set(etiquettes, { autoAlpha: 0 }, 0)
        .add(lancerMarche, T_DEBUT)

        // 1. Approche, chacun depuis son bord
        .to(
          humain,
          { x: REPOS_HUMAIN, duration: DUREE_APPROCHE, ease: "none" },
          T_DEBUT,
        )
        .to(
          robot,
          { x: REPOS_ROBOT, duration: DUREE_APPROCHE, ease: "none" },
          T_DEBUT,
        )

        // 2. Arrêt net, campé sur ses jambes
        .add(arreterMarche, T_ARRET)
        .to(jambesAvant, { rotation: ARRET_JAMBE, duration: 0.3 }, T_ARRET)
        .to(jambesArriere, { rotation: -ARRET_JAMBE, duration: 0.3 }, T_ARRET)
        .to(brasArr, { rotation: -ARRET_BRAS, duration: 0.3 }, T_ARRET)

        // Les légendes se posent une fois les deux à l'arrêt, et s'effacent au
        // départ : elles nomment la rencontre, pas le déplacement.
        .to(etiquettes, { autoAlpha: 1, duration: 0.4 }, T_ARRET + 0.1)
        .to(etiquettes, { autoAlpha: 0, duration: 0.3 }, T_DEPART)

        // 3. Les deux tendent la main — elles se rejoignent au centre
        .to(
          brasAv,
          { rotation: -90, duration: 0.55, ease: "power2.out" },
          T_TENDRE,
        )

        // 4. Poignée de main : l'avant-bras pompe, le buste suit légèrement
        .to(
          brasAv,
          {
            rotation: -78,
            duration: 0.16,
            ease: "sine.inOut",
            yoyo: true,
            repeat: 5,
          },
          T_POIGNEE,
        )
        .to(
          [humain, robot],
          {
            y: -2,
            duration: 0.16,
            ease: "sine.inOut",
            yoyo: true,
            repeat: 5,
          },
          T_POIGNEE,
        )

        // 5. La machine se retourne, ils repartent ensemble
        .to(brasAv, { rotation: 0, duration: 0.4 }, T_RELACHE)
        .to(
          rContenu,
          { scaleX: 1, duration: 0.45, ease: "power2.inOut" },
          T_RELACHE + 0.1,
        )

        // Pré-pose sur la première image du cycle : évite le saut à la reprise
        .to(jambesAvant, { rotation: -AMPL_JAMBE, duration: 0.2 }, T_PREPOSE)
        .to(jambesArriere, { rotation: AMPL_JAMBE, duration: 0.2 }, T_PREPOSE)
        .to(brasArr, { rotation: AMPL_BRAS, duration: 0.2 }, T_PREPOSE)
        .to(brasAv, { rotation: -AMPL_BRAS, duration: 0.2 }, T_PREPOSE)

        .add(lancerMarche, T_DEPART)
        // Même distance parcourue pour les deux : ils gardent leur écartement.
        .to(
          humain,
          { x: HORS_CHAMP, duration: DUREE_DEPART, ease: "none" },
          T_DEPART,
        )
        .to(
          robot,
          {
            x: HORS_CHAMP + REPOS_ROBOT * 2,
            duration: DUREE_DEPART,
            ease: "none",
          },
          T_DEPART,
        )
        .to([humain, robot], { autoAlpha: 0, duration: 0.5 }, T_SORTIE)
        .add(arreterMarche, T_DEPART + DUREE_DEPART);

      // La boucle ne tourne que quand la scène est réellement à l'écran.
      const suspendre = () => {
        tl.pause();
        cycle.pause();
      };
      const reprendre = () => {
        tl.play();
        if (marche) cycle.play();
      };

      ScrollTrigger.create({
        trigger: racine,
        start: "top bottom",
        end: "bottom top",
        onToggle: (self) => (self.isActive ? reprendre() : suspendre()),
      });

      // Lancement inconditionnel. La scène est en haut de page, donc visible au
      // chargement : subordonner son démarrage à `isActive` la laissait figée
      // dès que la mesure de ScrollTrigger tombait à faux au montage, ce qui
      // dépend de l'état du layout à cet instant précis et varie d'un moteur à
      // l'autre. ScrollTrigger ne sert plus qu'à suspendre la boucle une fois
      // la scène sortie du champ.
      reprendre();
    }, racine);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={ref} className="relative w-full overflow-hidden">
      <svg
        viewBox="0 0 900 260"
        className="h-auto w-full text-ink"
        role="img"
        aria-label="Un humain et une IA se rejoignent, se serrent la main et repartent ensemble."
      >
        <line
          x1="0"
          y1={SOL}
          x2="900"
          y2={SOL}
          className="text-line"
          stroke="currentColor"
          strokeWidth="1"
          strokeDasharray="3 7"
        />
        <g
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          transform={`translate(450,${SOL}) scale(${ECHELLE}) translate(0,${-SOL})`}
        >
          <Humain />
          <Machine />
        </g>
      </svg>

      {/* Légende en vrai texte du DOM, pas en <text> SVG : elle est
          sélectionnable, indexable, et rendue avec la fonte du site. */}
      <p className="mt-3 text-center font-mono text-xs tracking-[0.14em] text-faint">
        <span className="text-accent">$</span> humain + ia
      </p>
    </div>
  );
}
