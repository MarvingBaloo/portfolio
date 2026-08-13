"use client";

import { useEffect, useRef } from "react";

// Grille des pistes : tout est aligné dessus, c'est ce qui donne l'allure
// « circuit imprimé » plutôt que « courbes organiques ».
const PAS = 26;
const RAYON_COUDE = 8;
const TRACES = 22;
const SEGMENTS_MIN = 5;
const SEGMENTS_MAX = 13;

const IMPULSIONS = 18;
const VITESSE_MIN = 40; // px/s
const VITESSE_MAX = 92;
const TRAINEE = 115;

// La piste reste un filigrane ; c'est le courant qui se voit.
const OPACITE_PISTE = 0.055;
const OPACITE_PASTILLE = 0.11;
const OPACITE_IMPULSION = 0.9;
const HALO_TETE = 9;

const DPR_MAX = 2;

/** Générateur déterministe : le même circuit d'un rendu à l'autre. */
function aleatoire(graine) {
  let etat = graine >>> 0;
  return () => {
    etat = (etat * 1664525 + 1013904223) >>> 0;
    return etat / 4294967296;
  };
}

function versRgb(couleur) {
  const c = couleur.trim();
  if (c.startsWith("#")) {
    const n = c.length === 4
      ? c.slice(1).split("").map((v) => v + v).join("")
      : c.slice(1);
    const e = parseInt(n, 16);
    return [(e >> 16) & 255, (e >> 8) & 255, e & 255];
  }
  const m = c.match(/-?\d+(\.\d+)?/g);
  return m ? m.slice(0, 3).map(Number) : [255, 255, 255];
}

const rgba = ([r, v, b], a) => `rgba(${r}, ${v}, ${b}, ${a})`;

/**
 * Trace un chemin en angles droits sur la grille, comme une piste de circuit.
 * Renvoie les sommets ; les coudes sont arrondis au tracé.
 */
function construireTrace(rnd, largeur, hauteur) {
  const colonnes = Math.floor(largeur / PAS);
  const lignes = Math.floor(hauteur / PAS);
  let x = Math.floor(rnd() * colonnes);
  let y = Math.floor(rnd() * lignes);

  let horizontal = rnd() < 0.5;
  let sens = rnd() < 0.5 ? 1 : -1;

  const sommets = [{ x: x * PAS, y: y * PAS }];
  const nb = SEGMENTS_MIN + Math.floor(rnd() * (SEGMENTS_MAX - SEGMENTS_MIN));

  for (let i = 0; i < nb; i++) {
    const longueur = 2 + Math.floor(rnd() * 6);
    if (horizontal) x += sens * longueur;
    else y += sens * longueur;

    // Rebond sur les bords plutôt que sortie du cadre : les pistes restent
    // dans l'image et le circuit paraît continu.
    if (x < 0 || x > colonnes) {
      x = Math.max(0, Math.min(colonnes, x));
      sens *= -1;
    }
    if (y < 0 || y > lignes) {
      y = Math.max(0, Math.min(lignes, y));
      sens *= -1;
    }

    sommets.push({ x: x * PAS, y: y * PAS });
    horizontal = !horizontal;
    if (rnd() < 0.5) sens *= -1;
  }

  return sommets.filter(
    (p, i, t) => i === 0 || p.x !== t[i - 1].x || p.y !== t[i - 1].y,
  );
}

function longueurs(sommets) {
  const cumul = [0];
  for (let i = 1; i < sommets.length; i++) {
    const dx = sommets[i].x - sommets[i - 1].x;
    const dy = sommets[i].y - sommets[i - 1].y;
    cumul.push(cumul[i - 1] + Math.hypot(dx, dy));
  }
  return cumul;
}

/** Position sur la polyligne à une distance donnée du départ. */
function pointA(sommets, cumul, distance) {
  const total = cumul[cumul.length - 1];
  const d = Math.max(0, Math.min(total, distance));
  let i = 1;
  while (i < cumul.length - 1 && cumul[i] < d) i++;
  const part = (d - cumul[i - 1]) / (cumul[i] - cumul[i - 1] || 1);
  return {
    x: sommets[i - 1].x + (sommets[i].x - sommets[i - 1].x) * part,
    y: sommets[i - 1].y + (sommets[i].y - sommets[i - 1].y) * part,
    segment: i,
  };
}

export default function FondCircuits() {
  const statiqueRef = useRef(null);
  const animeRef = useRef(null);

  useEffect(() => {
    const cStatique = statiqueRef.current;
    const cAnime = animeRef.current;
    if (!cStatique || !cAnime) return;

    const ctxS = cStatique.getContext("2d");
    const ctxA = cAnime.getContext("2d");
    const reduit = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sombre = window.matchMedia("(prefers-color-scheme: dark)");

    let traces = [];
    let impulsions = [];
    let couleurs = { ink: [255, 255, 255], accent: [233, 161, 59] };
    let rafId = null;
    let dernier = 0;

    const lireCouleurs = () => {
      const s = getComputedStyle(document.documentElement);
      couleurs = {
        ink: versRgb(s.getPropertyValue("--ink")),
        accent: versRgb(s.getPropertyValue("--accent")),
      };
    };

    const graverPistes = (largeur, hauteur) => {
      ctxS.clearRect(0, 0, largeur, hauteur);
      ctxS.lineWidth = 1;
      ctxS.lineCap = "round";
      ctxS.strokeStyle = rgba(couleurs.ink, OPACITE_PISTE);

      traces.forEach(({ sommets }) => {
        ctxS.beginPath();
        ctxS.moveTo(sommets[0].x, sommets[0].y);
        for (let i = 1; i < sommets.length - 1; i++) {
          ctxS.arcTo(
            sommets[i].x,
            sommets[i].y,
            sommets[i + 1].x,
            sommets[i + 1].y,
            RAYON_COUDE,
          );
        }
        const fin = sommets[sommets.length - 1];
        ctxS.lineTo(fin.x, fin.y);
        ctxS.stroke();
      });

      // Pastilles de connexion aux extrémités : ce sont elles qui font lire
      // « circuit » plutôt que « lignes brisées ».
      ctxS.fillStyle = rgba(couleurs.ink, OPACITE_PASTILLE);
      traces.forEach(({ sommets }) => {
        [sommets[0], sommets[sommets.length - 1]].forEach((p) => {
          ctxS.beginPath();
          ctxS.arc(p.x, p.y, 2.2, 0, Math.PI * 2);
          ctxS.fill();
        });
      });
    };

    const semerImpulsions = (rnd) => {
      impulsions = Array.from({ length: IMPULSIONS }, () => {
        const t = Math.floor(rnd() * traces.length);
        return {
          trace: t,
          distance: rnd() * traces[t].total,
          vitesse: VITESSE_MIN + rnd() * (VITESSE_MAX - VITESSE_MIN),
        };
      });
    };

    const dimensionner = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, DPR_MAX);
      const largeur = window.innerWidth;
      const hauteur = window.innerHeight;

      [cStatique, cAnime].forEach((c) => {
        c.width = Math.round(largeur * dpr);
        c.height = Math.round(hauteur * dpr);
        c.style.width = `${largeur}px`;
        c.style.height = `${hauteur}px`;
      });
      ctxS.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctxA.setTransform(dpr, 0, 0, dpr, 0, 0);

      const rnd = aleatoire(20260813);
      traces = Array.from({ length: TRACES }, () => {
        const sommets = construireTrace(rnd, largeur, hauteur);
        const cumul = longueurs(sommets);
        return { sommets, cumul, total: cumul[cumul.length - 1] };
      }).filter((t) => t.total > 120);

      lireCouleurs();
      graverPistes(largeur, hauteur);
      semerImpulsions(rnd);
    };

    const dessinerImpulsion = (imp) => {
      const { sommets, cumul } = traces[imp.trace];
      const tete = pointA(sommets, cumul, imp.distance);
      const queue = pointA(sommets, cumul, imp.distance - TRAINEE);

      // La traînée suit les coudes : on reprend les sommets traversés au lieu
      // de tirer un segment droit entre queue et tête.
      const points = [{ x: queue.x, y: queue.y }];
      for (let i = queue.segment; i < tete.segment; i++) {
        points.push({ x: sommets[i].x, y: sommets[i].y });
      }
      points.push({ x: tete.x, y: tete.y });

      const grad = ctxA.createLinearGradient(queue.x, queue.y, tete.x, tete.y);
      grad.addColorStop(0, rgba(couleurs.accent, 0));
      grad.addColorStop(1, rgba(couleurs.accent, OPACITE_IMPULSION));

      ctxA.strokeStyle = grad;
      ctxA.lineWidth = 1.6;
      ctxA.lineCap = "round";
      ctxA.lineJoin = "round";
      ctxA.beginPath();
      ctxA.moveTo(points[0].x, points[0].y);
      points.slice(1).forEach((p) => ctxA.lineTo(p.x, p.y));
      ctxA.stroke();

      // Halo uniquement sur la tête : c'est ce qui fait lire « courant » et non
      // « trait orange ». Limité à un point par impulsion, le flou reste bon
      // marché.
      ctxA.shadowColor = rgba(couleurs.accent, 0.85);
      ctxA.shadowBlur = HALO_TETE;
      ctxA.fillStyle = rgba(couleurs.accent, 1);
      ctxA.beginPath();
      ctxA.arc(tete.x, tete.y, 2.2, 0, Math.PI * 2);
      ctxA.fill();
      ctxA.shadowBlur = 0;
    };

    const boucle = (temps) => {
      rafId = requestAnimationFrame(boucle);
      if (!dernier) dernier = temps;
      const dt = Math.min(0.05, (temps - dernier) / 1000);
      dernier = temps;

      ctxA.clearRect(0, 0, cAnime.width, cAnime.height);
      impulsions.forEach((imp) => {
        const total = traces[imp.trace].total;
        imp.distance += imp.vitesse * dt;
        if (imp.distance - TRAINEE > total) imp.distance = 0;
        dessinerImpulsion(imp);
      });
    };

    const demarrer = () => {
      if (rafId || reduit.matches) return;
      dernier = 0;
      rafId = requestAnimationFrame(boucle);
    };
    const arreter = () => {
      if (!rafId) return;
      cancelAnimationFrame(rafId);
      rafId = null;
    };

    let minuteurTaille;
    const surRedimensionnement = () => {
      clearTimeout(minuteurTaille);
      minuteurTaille = setTimeout(() => {
        dimensionner();
      }, 180);
    };

    // Rien ne tourne quand l'onglet est en arrière-plan.
    const surVisibilite = () => (document.hidden ? arreter() : demarrer());
    const surTheme = () => {
      lireCouleurs();
      graverPistes(window.innerWidth, window.innerHeight);
    };

    dimensionner();
    demarrer();

    window.addEventListener("resize", surRedimensionnement);
    document.addEventListener("visibilitychange", surVisibilite);
    sombre.addEventListener("change", surTheme);
    reduit.addEventListener("change", () => (reduit.matches ? arreter() : demarrer()));

    return () => {
      arreter();
      clearTimeout(minuteurTaille);
      window.removeEventListener("resize", surRedimensionnement);
      document.removeEventListener("visibilitychange", surVisibilite);
      sombre.removeEventListener("change", surTheme);
    };
  }, []);

  return (
    <div aria-hidden="true" className="fond-circuits">
      <canvas ref={statiqueRef} />
      <canvas ref={animeRef} />
    </div>
  );
}
