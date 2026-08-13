import Link from "next/link";
import { profil } from "@/data/profil";

const LIENS = [
  { href: "/#realisations", label: "réalisations" },
  { href: "/skills", label: "skills" },
  { href: "/#approche", label: "approche", secondaire: true },
];

export default function Header() {
  return (
    <header className="entete sticky top-0 z-50 border-b">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-6 py-4">
        <Link href="/" className="flex flex-col leading-tight">
          <span className="display text-lg text-ink">{profil.nom}</span>
          {/* Pas de `uppercase` : la marque s'écrit BMGconsulting, en un mot. */}
          <span className="mt-1 font-mono text-[10px] tracking-[0.18em] text-faint">
            {profil.structure}
          </span>
        </Link>

        <nav className="flex items-center gap-5 text-sm sm:gap-7">
          {LIENS.map((lien, i) => (
            <Link
              key={lien.href}
              href={lien.href}
              className={`group items-baseline gap-1.5 text-muted transition-colors hover:text-accent ${
                lien.secondaire ? "hidden sm:flex" : "flex"
              }`}
            >
              <span className="font-mono text-[10px] text-faint transition-colors group-hover:text-accent">
                {String(i + 1).padStart(2, "0")}
              </span>
              {lien.label}
            </Link>
          ))}
          <a
            href={`mailto:${profil.email}`}
            className="rounded-full border border-line px-4 py-1.5 text-ink transition-colors hover:border-accent hover:text-accent"
          >
            Me contacter
          </a>
        </nav>
      </div>
    </header>
  );
}
