"use client";

import { useRef } from "react";
import gsap from "gsap";
import { TEMPO, useEffetIsomorphe } from "@/lib/animation";

// Les enfants marqués [data-hero] entrent en cascade au montage. Le contenu est
// visible par défaut : sans JS ou en mouvement réduit, rien n'est masqué.
export default function HeroIntro({ children, className = "" }) {
  const ref = useRef(null);

  useEffetIsomorphe(() => {
    const noeud = ref.current;
    if (!noeud) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const cibles = Array.from(noeud.querySelectorAll("[data-hero]"));
    if (!cibles.length) return;

    const ctx = gsap.context(() => {
      gsap.set(cibles, { autoAlpha: 0, y: 14 });
      gsap.to(cibles, {
        autoAlpha: 1,
        y: 0,
        duration: 0.75,
        ease: "power2.out",
        stagger: 0.09,
        delay: TEMPO.texte,
      });
    }, noeud);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
