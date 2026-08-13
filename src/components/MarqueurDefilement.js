"use client";

import { useEffect } from "react";

/**
 * Marque la racine dès que la page a quitté le haut. Sert au header, qui reste
 * transparent tant qu'on est en tête de page pour laisser voir le fond animé,
 * et ne prend son fond opaque qu'une fois du contenu passé dessous.
 *
 * Un attribut sur `<html>` plutôt qu'un état React : le header reste un
 * composant serveur et rien ne se re-rend au défilement.
 */
export default function MarqueurDefilement({ seuil = 8 }) {
  useEffect(() => {
    const racine = document.documentElement;

    const majuscule = () => {
      if (window.scrollY > seuil) racine.setAttribute("data-defile", "");
      else racine.removeAttribute("data-defile");
    };

    majuscule();
    window.addEventListener("scroll", majuscule, { passive: true });
    return () => {
      window.removeEventListener("scroll", majuscule);
      racine.removeAttribute("data-defile");
    };
  }, [seuil]);

  return null;
}
