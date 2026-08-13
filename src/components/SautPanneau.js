"use client";

import { useEffect } from "react";
import { scrollVers } from "@/lib/scroll";

/**
 * Enchaîne le panneau d'accueil vers celui des cartes. La molette est capturée
 * tant que l'accueil occupe l'écran, pour basculer d'un panneau entier à
 * l'autre au lieu de s'arrêter à mi-chemin entre les deux.
 */
export default function SautPanneau({ cible = "#cartes", libelle }) {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let verrou = false;

    const surMolette = (e) => {
      if (e.deltaY <= 0) return;
      if (window.scrollY > window.innerHeight * 0.4) return;

      e.preventDefault();
      e.stopPropagation();
      if (verrou) return;
      verrou = true;
      scrollVers(cible);
      setTimeout(() => {
        verrou = false;
      }, 1000);
    };

    window.addEventListener("wheel", surMolette, {
      passive: false,
      capture: true,
    });
    return () =>
      window.removeEventListener("wheel", surMolette, { capture: true });
  }, [cible]);

  return (
    <button
      type="button"
      onClick={() => scrollVers(cible)}
      className="group flex flex-col items-center gap-2 font-mono text-[11px] uppercase tracking-[0.18em] text-faint transition-colors hover:text-accent"
    >
      {libelle}
      <span
        aria-hidden="true"
        className="text-base transition-transform group-hover:translate-y-1"
      >
        ↓
      </span>
    </button>
  );
}
