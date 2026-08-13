"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

export default function MenuMobile({ liens, email }) {
  const [ouvert, setOuvert] = useState(false);
  const panneauRef = useRef(null);
  const boutonRef = useRef(null);

  useEffect(() => {
    if (!ouvert) return;

    const surTouche = (e) => {
      if (e.key === "Escape") {
        setOuvert(false);
        boutonRef.current?.focus();
      }
    };
    // Un clic dans le panneau ou sur le bouton ne doit pas le refermer avant
    // que le lien n'ait été suivi.
    const surClicExterieur = (e) => {
      if (panneauRef.current?.contains(e.target)) return;
      if (boutonRef.current?.contains(e.target)) return;
      setOuvert(false);
    };

    document.addEventListener("keydown", surTouche);
    document.addEventListener("pointerdown", surClicExterieur);
    return () => {
      document.removeEventListener("keydown", surTouche);
      document.removeEventListener("pointerdown", surClicExterieur);
    };
  }, [ouvert]);

  return (
    <div className="md:hidden">
      <button
        ref={boutonRef}
        type="button"
        onClick={() => setOuvert((v) => !v)}
        aria-expanded={ouvert}
        aria-controls="menu-mobile"
        aria-label={ouvert ? "Fermer le menu" : "Ouvrir le menu"}
        className="menu-bouton"
      >
        <span className={`menu-barre ${ouvert ? "est-ouvert" : ""}`} />
        <span className={`menu-barre ${ouvert ? "est-ouvert" : ""}`} />
      </button>

      {ouvert ? (
        <div
          id="menu-mobile"
          ref={panneauRef}
          className="menu-panneau absolute inset-x-0 top-full border-b border-line px-6 pb-6 pt-2"
        >
          <nav className="flex flex-col">
            {liens.map((lien, i) => (
              <Link
                key={lien.href}
                href={lien.href}
                onClick={() => setOuvert(false)}
                className="flex items-baseline gap-3 border-t border-line py-3.5 text-base text-ink"
              >
                <span className="font-mono text-[10px] text-faint">
                  {String(i + 1).padStart(2, "0")}
                </span>
                {lien.label}
              </Link>
            ))}
            <a
              href={`mailto:${email}`}
              onClick={() => setOuvert(false)}
              className="mt-5 rounded-full bg-ink px-5 py-3 text-center text-sm text-canvas"
            >
              Me contacter
            </a>
          </nav>
        </div>
      ) : null}
    </div>
  );
}
