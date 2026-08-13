"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// Le contenu est rendu visible par défaut : l'état initial n'est posé qu'en JS,
// donc sans JavaScript ou en mouvement réduit la page reste entièrement lisible.
export default function Reveal({
  children,
  as: Tag = "div",
  selecteur,
  decalage = 0.08,
  y = 18,
  className = "",
}) {
  const ref = useRef(null);

  useEffect(() => {
    const noeud = ref.current;
    if (!noeud) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const cibles = selecteur
      ? Array.from(noeud.querySelectorAll(selecteur))
      : [noeud];
    if (!cibles.length) return;

    const ctx = gsap.context(() => {
      gsap.set(cibles, { opacity: 0, y });
      gsap.to(cibles, {
        opacity: 1,
        y: 0,
        duration: 0.7,
        ease: "power2.out",
        stagger: decalage,
        scrollTrigger: {
          trigger: noeud,
          start: "top 85%",
          once: true,
        },
      });
    }, noeud);

    return () => ctx.revert();
  }, [selecteur, decalage, y]);

  return (
    <Tag ref={ref} className={className}>
      {children}
    </Tag>
  );
}
