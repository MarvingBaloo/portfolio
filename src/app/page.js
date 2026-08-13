import Link from "next/link";
import { profil, approche } from "@/data/profil";
import { domaines, certifications } from "@/data/competences";
import { projets } from "@/data/projets";
import { visuelsDisponibles } from "@/lib/visuels";
import ProjectCard from "@/components/ProjectCard";
import TerminalHero from "@/components/TerminalHero";
import Reveal from "@/components/Reveal";

export default function Home() {
  return (
    <>
      <section className="relative overflow-hidden">
        <div aria-hidden="true" className="lueur" />

        <div className="mx-auto grid max-w-5xl items-center gap-14 px-6 pb-24 pt-16 sm:pt-24 lg:grid-cols-[1fr_28rem]">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.18em] text-accent">
              {profil.role} — {profil.structure}
            </p>
            <h1 className="display mt-6 text-4xl text-ink sm:text-5xl">
              {profil.accroche}
            </h1>
            <p className="mt-7 max-w-xl leading-relaxed text-muted">
              {profil.intro}
            </p>

            <div className="mt-9 flex flex-wrap gap-x-4 gap-y-3 text-sm">
              <a
                href="#realisations"
                className="rounded-full bg-ink px-5 py-2.5 text-canvas transition-transform hover:-translate-y-0.5"
              >
                Voir les réalisations
              </a>
              <a
                href={`mailto:${profil.email}`}
                className="rounded-full border border-line px-5 py-2.5 text-ink transition-colors hover:border-accent hover:text-accent"
              >
                {profil.email}
              </a>
            </div>
          </div>

          <TerminalHero />
        </div>
      </section>

      <section id="realisations" className="mx-auto max-w-5xl px-6 pb-24">
        <div className="mb-4 flex items-baseline justify-between">
          <h2 className="font-mono text-xs uppercase tracking-[0.18em] text-faint">
            Réalisations
          </h2>
          <span className="font-mono text-xs text-faint">
            {String(projets.length).padStart(2, "0")} projets
          </span>
        </div>

        {projets.map((projet, i) => {
          const dispo = visuelsDisponibles(projet.visuels);
          const couverture =
            dispo.find((v) => v.format !== "mobile") ?? dispo[0] ?? null;
          return (
            <ProjectCard
              key={projet.slug}
              projet={projet}
              index={i}
              couverture={couverture}
            />
          );
        })}
        <div className="rule" />
      </section>

      <section id="approche" className="border-t border-line bg-surface">
        <div className="mx-auto max-w-5xl px-6 py-24">
          <h2 className="font-mono text-xs uppercase tracking-[0.18em] text-faint">
            Approche technique
          </h2>
          <p className="display mt-6 max-w-2xl text-3xl text-ink sm:text-4xl">
            Ce qui distingue un prototype d&apos;un système qui tient.
          </p>

          <Reveal
            selecteur="[data-bloc]"
            className="mt-14 grid gap-x-12 gap-y-12 md:grid-cols-2"
          >
            {approche.map((bloc) => (
              <div key={bloc.titre} data-bloc>
                <h3 className="text-base font-semibold text-ink">
                  {bloc.titre}
                </h3>
                <p className="mt-3 leading-relaxed text-muted">{bloc.texte}</p>
              </div>
            ))}
          </Reveal>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-6 py-24">
        <h2 className="font-mono text-xs uppercase tracking-[0.18em] text-faint">
          Skills
        </h2>

        <p className="display mt-6 max-w-2xl text-3xl text-ink sm:text-4xl">
          Six domaines éprouvés en production, deux parcours certifiés.
        </p>

        <Reveal selecteur="[data-puce]" decalage={0.05} className="mt-10 flex flex-wrap gap-2">
          {domaines.map((d) => (
            <span
              key={d.nom}
              data-puce
              className="border border-line px-3 py-1.5 text-sm text-muted"
            >
              {d.nom}
            </span>
          ))}
          {certifications.map((c) => (
            <span
              key={c.titre}
              data-puce
              className="bg-accent-soft px-3 py-1.5 text-sm text-accent"
            >
              {c.titre}
            </span>
          ))}
        </Reveal>

        <Link
          href="/skills"
          className="group mt-10 inline-block text-sm text-accent"
        >
          Voir le détail, projet par projet
          <span className="ml-1 inline-block transition-transform group-hover:translate-x-1">
            →
          </span>
        </Link>
      </section>
    </>
  );
}
