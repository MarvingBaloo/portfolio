"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import Fenetre from "@/components/Fenetre";

// Lignes calibrées pour tenir sans débordement dans une colonne de 28rem.
const LIGNES = [
  { type: "cmd", texte: "whoami" },
  { type: "out", texte: "Marving GUSTAVE · full-stack" },
  { type: "cmd", texte: "stats --production" },
  { type: "out", texte: "4 systèmes · 56 580 lignes · 343 commits" },
  { type: "cmd", texte: "ls domaines/" },
  { type: "out", texte: "paiement    multi-tenant" },
  { type: "out", texte: "temps-réel  agents-ia" },
];

export default function TerminalHero() {
  const ref = useRef(null);

  useEffect(() => {
    const noeud = ref.current;
    if (!noeud) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const spans = Array.from(noeud.querySelectorAll("[data-texte]"));
    const curseur = noeud.querySelector("[data-curseur]");

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 0.35 });
      gsap.set(curseur, { autoAlpha: 0 });

      spans.forEach((span) => {
        const complet = span.dataset.texte;
        span.textContent = "";
        const etat = { i: 0 };
        tl.to(etat, {
          i: complet.length,
          duration: Math.min(0.9, 0.018 * complet.length),
          ease: "none",
          onUpdate: () => {
            span.textContent = complet.slice(0, Math.round(etat.i));
          },
        }).to({}, { duration: 0.12 });
      });

      tl.set(curseur, { autoAlpha: 1 });
    }, noeud);

    return () => ctx.revert();
  }, []);

  return (
    <Fenetre titre="~/bmg-consulting" className="w-full">
      <div
        ref={ref}
        className="overflow-x-auto px-5 py-5 font-mono text-[12px] leading-[1.9]"
      >
        {LIGNES.map((ligne, i) => (
          <div key={i} className="whitespace-pre">
            {ligne.type === "cmd" ? (
              <span className="text-accent select-none">$ </span>
            ) : (
              <span className="select-none"> </span>
            )}
            <span
              data-texte={ligne.texte}
              className={ligne.type === "cmd" ? "text-ink" : "text-muted"}
            >
              {ligne.texte}
            </span>
          </div>
        ))}
        <div className="whitespace-pre">
          <span className="text-accent select-none">$ </span>
          <span data-curseur className="curseur" aria-hidden="true" />
        </div>
      </div>
    </Fenetre>
  );
}
