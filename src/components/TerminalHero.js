"use client";

import { useRef } from "react";
import gsap from "gsap";
import Fenetre from "@/components/Fenetre";
import { TEMPO, useEffetIsomorphe } from "@/lib/animation";

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

  useEffetIsomorphe(() => {
    const noeud = ref.current;
    if (!noeud) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const lignes = Array.from(noeud.querySelectorAll("[data-ligne]"));
    const invite = noeud.querySelector("[data-invite]");
    const curseur = noeud.querySelector("[data-curseur]");
    const pastilles = noeud.querySelectorAll(".fenetre-point");
    const socleCurseur = curseur.parentNode;

    const ctx = gsap.context(() => {
      gsap.set(noeud, { autoAlpha: 0, y: 12, scale: 0.985 });
      gsap.set([...lignes, invite], { autoAlpha: 0 });
      lignes.forEach((ligne) => {
        ligne.querySelector("[data-texte]").textContent = "";
      });
      curseur.classList.add("curseur-fixe");

      const tl = gsap.timeline({ delay: TEMPO.cadre });

      tl.to(noeud, {
        autoAlpha: 1,
        y: 0,
        scale: 1,
        duration: 0.7,
        ease: "power2.out",
      }).from(
        pastilles,
        {
          autoAlpha: 0,
          scale: 0.4,
          duration: 0.3,
          stagger: 0.07,
          ease: "back.out(2)",
        },
        "-=0.45",
      );

      lignes.forEach((ligne, i) => {
        const span = ligne.querySelector("[data-texte]");
        const complet = span.dataset.texte;
        const etat = { i: 0 };

        tl.set(ligne, { autoAlpha: 1 }, i === 0 ? TEMPO.frappe : ">")
          .call(() => ligne.appendChild(curseur), null, "<")
          .to(etat, {
            i: complet.length,
            duration: Math.min(0.9, 0.018 * complet.length),
            ease: "none",
            onUpdate: () => {
              span.textContent = complet.slice(0, Math.round(etat.i));
            },
          })
          .to({}, { duration: 0.12 });
      });

      tl.set(invite, { autoAlpha: 1 }).call(
        () => {
          socleCurseur.appendChild(curseur);
          curseur.classList.remove("curseur-fixe");
        },
        null,
        "<",
      );
    }, noeud);

    return () => {
      ctx.revert();
      curseur.classList.remove("curseur-fixe");
      socleCurseur.appendChild(curseur);
      lignes.forEach((ligne) => {
        const span = ligne.querySelector("[data-texte]");
        span.textContent = span.dataset.texte;
      });
    };
  }, []);

  return (
    <div ref={ref}>
      <Fenetre titre="~/bmg-consulting" className="w-full">
        <div className="overflow-x-auto px-5 py-5 font-mono text-[12px] leading-[1.9]">
          {LIGNES.map((ligne, i) => (
            <div key={i} data-ligne className="whitespace-pre">
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
          <div data-invite className="whitespace-pre">
            <span className="text-accent select-none">$ </span>
            <span data-curseur className="curseur" aria-hidden="true" />
          </div>
        </div>
      </Fenetre>
    </div>
  );
}
