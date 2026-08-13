"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const formateur = new Intl.NumberFormat("fr-FR");

export default function Compteur({ valeur, className = "" }) {
  const ref = useRef(null);

  useEffect(() => {
    const noeud = ref.current;
    if (!noeud) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    // Les métriques non numériques (rares) restent affichées telles quelles.
    const cible = Number(String(valeur).replace(/[^\d]/g, ""));
    if (!Number.isFinite(cible) || cible === 0) return;

    const etat = { n: 0 };
    const ctx = gsap.context(() => {
      gsap.to(etat, {
        n: cible,
        duration: cible > 1000 ? 1.5 : 1.1,
        ease: "power2.out",
        // Sans ça le tween se rend à sa progression 0 dès sa création et
        // remplace la valeur par « 0 » tant qu'on n'a pas scrollé jusqu'à elle.
        immediateRender: false,
        scrollTrigger: { trigger: noeud, start: "top 92%", once: true },
        onUpdate: () => {
          noeud.textContent = formateur.format(Math.round(etat.n));
        },
        onComplete: () => {
          noeud.textContent = valeur;
        },
      });
    }, noeud);

    return () => ctx.revert();
  }, [valeur]);

  return (
    <span ref={ref} className={className}>
      {valeur}
    </span>
  );
}
