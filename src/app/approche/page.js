import Link from "next/link";
import { approche } from "@/data/profil";
import { getProjet } from "@/data/projets";

export const metadata = {
  title: "Approche technique",
  description:
    "Les règles que je m'impose sur un système en production — sécurité, concurrence, cloisonnement, outillage IA — et le projet qui atteste chacune.",
};

export default function ApprochePage() {
  return (
    <>
      <section className="mx-auto max-w-5xl px-6 pb-16 pt-16 sm:pt-24">
        <p className="text-xs uppercase tracking-[0.2em] text-accent">
          Approche technique
        </p>
        <h1 className="display mt-6 max-w-3xl text-4xl leading-[1.1] text-ink sm:text-5xl">
          Ce qui distingue un prototype d&apos;un système qui tient.
        </h1>
        <p className="mt-8 max-w-2xl text-lg leading-relaxed text-muted">
          Je conçois et j&apos;écris ces systèmes seul, de la base de données à
          la mise en production. Aucune règle ci-dessous ne vient d&apos;un
          manuel : chacune a été payée sur un projet réel, et le projet qui
          l&apos;atteste est nommé.
        </p>
      </section>

      {approche.map((bloc, i) => (
        <section
          key={bloc.slug}
          className="border-t border-line even:bg-surface"
        >
          <div className="mx-auto max-w-5xl px-6 py-16">
            <div className="flex items-baseline gap-4">
              <span className="font-mono text-xs text-accent">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h2 className="display text-2xl text-ink sm:text-3xl">
                {bloc.titre}
              </h2>
            </div>

            <p className="mt-6 max-w-2xl leading-relaxed text-ink">
              {bloc.texte}
            </p>
            <p className="mt-4 max-w-2xl leading-relaxed text-muted">
              {bloc.detail}
            </p>

            <div className="mt-10 grid gap-10 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)]">
              <div>
                <h3 className="font-mono text-xs uppercase tracking-[0.16em] text-faint">
                  Ce que je m&apos;impose
                </h3>
                <ul className="mt-5 space-y-3">
                  {bloc.regles.map((regle) => (
                    <li key={regle} className="flex gap-4">
                      <span
                        aria-hidden="true"
                        className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent"
                      />
                      <span className="leading-relaxed text-muted">
                        {regle}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="font-mono text-xs uppercase tracking-[0.16em] text-faint">
                  Éprouvé sur
                </h3>
                <div className="mt-5 space-y-3">
                  {bloc.preuves.map((preuve) => {
                    const projet = getProjet(preuve.slug);
                    if (!projet) return null;
                    return (
                      <Link
                        key={preuve.slug}
                        href={`/projets/${projet.slug}`}
                        className="group block border border-line p-5 transition-colors hover:border-accent"
                      >
                        <div className="flex items-baseline justify-between gap-4">
                          <span className="font-semibold text-ink transition-colors group-hover:text-accent">
                            {projet.nom}
                          </span>
                          <span
                            aria-hidden="true"
                            className="text-faint transition-all duration-300 group-hover:translate-x-1 group-hover:text-accent"
                          >
                            →
                          </span>
                        </div>
                        <p className="mt-2 text-sm leading-relaxed text-muted">
                          {preuve.texte}
                        </p>
                      </Link>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </section>
      ))}

      <section className="border-t border-line">
        <div className="mx-auto flex max-w-5xl flex-wrap items-baseline justify-between gap-6 px-6 py-14">
          <p className="max-w-lg leading-relaxed text-muted">
            Chaque règle est adossée à un projet en production. Le détail
            technique de chacun est sur sa fiche.
          </p>
          <Link
            href="/#realisations"
            className="group text-sm text-accent"
          >
            Voir les réalisations
            <span className="ml-1 inline-block transition-transform group-hover:translate-x-1">
              →
            </span>
          </Link>
        </div>
      </section>
    </>
  );
}
