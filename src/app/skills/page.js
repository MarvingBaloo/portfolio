import { domaines, certifications } from "@/data/competences";

export const metadata = {
  title: "Skills",
  description:
    "Compétences éprouvées en production et parcours certifiés, avec pour chacune le projet qui l'atteste et les contextes où elle s'applique.",
};

export default function CompetencesPage() {
  return (
    <>
      <section className="mx-auto max-w-5xl px-6 pb-16 pt-16 sm:pt-24">
        <p className="text-xs uppercase tracking-[0.2em] text-accent">Skills</p>
        <h1 className="display mt-6 max-w-3xl text-4xl leading-[1.1] text-ink sm:text-5xl">
          Chaque compétence, le projet qui l&apos;atteste, et là où elle sert.
        </h1>
        <p className="mt-8 max-w-2xl text-lg leading-relaxed text-muted">
          Deux registres, volontairement séparés : ce qui tourne en production
          chez de vrais utilisateurs, et ce qui vient d&apos;un parcours certifié
          vérifiable.
        </p>
      </section>

      <section className="border-t border-line">
        <div className="mx-auto max-w-5xl px-6 py-16">
          <h2 className="text-xs uppercase tracking-[0.2em] text-faint">
            Éprouvé en production
          </h2>

          <div className="mt-12 space-y-16">
            {domaines.map((domaine) => (
              <div key={domaine.nom}>
                <div className="max-w-2xl">
                  <h3 className="display text-2xl text-ink sm:text-3xl">
                    {domaine.nom}
                  </h3>
                  <p className="mt-2 text-muted">{domaine.resume}</p>
                </div>

                <div className="mt-8 grid gap-px overflow-hidden rounded-lg border border-line bg-line sm:grid-cols-2">
                  {domaine.skills.map((s) => (
                    <div key={s.nom} className="bg-surface p-6">
                      <h4 className="font-semibold text-ink">{s.nom}</h4>

                      <dl className="mt-4 space-y-3 text-sm">
                        <div>
                          <dt className="text-xs uppercase tracking-[0.14em] text-faint">
                            Éprouvé sur
                          </dt>
                          <dd className="mt-1 text-muted">{s.preuve}</dd>
                        </div>
                        <div>
                          <dt className="text-xs uppercase tracking-[0.14em] text-faint">
                            Applicable à
                          </dt>
                          <dd className="mt-1 text-muted">{s.application}</dd>
                        </div>
                      </dl>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-line bg-surface">
        <div className="mx-auto max-w-5xl px-6 py-16">
          <h2 className="text-xs uppercase tracking-[0.2em] text-faint">
            Certifié
          </h2>
          <p className="mt-6 max-w-2xl text-muted">
            Parcours professionnels IBM, vérifiables publiquement par leur
            identifiant de certificat.
          </p>

          <div className="mt-12 space-y-12">
            {certifications.map((c) => (
              <article
                key={c.titre}
                className="border-t border-line pt-8 first:border-t-0 first:pt-0"
              >
                <div className="flex flex-wrap items-baseline gap-x-4 gap-y-2">
                  <h3 className="display text-2xl text-ink sm:text-3xl">
                    {c.titre}
                  </h3>
                  <span className="rounded-full bg-accent-soft px-2.5 py-0.5 text-xs text-accent">
                    {c.volume}
                  </span>
                </div>

                <p className="mt-2 text-sm text-faint">
                  {c.organisme} — {c.date}
                </p>

                <p className="mt-4 max-w-2xl leading-relaxed text-muted">
                  {c.resume}
                </p>

                <div className="mt-6 flex flex-wrap gap-2">
                  {c.couvre.map((t) => (
                    <span
                      key={t}
                      className="border border-line px-2.5 py-1 text-xs text-muted"
                    >
                      {t}
                    </span>
                  ))}
                </div>

                <a
                  href={c.url}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-6 inline-block text-sm text-accent underline decoration-line underline-offset-4 transition-colors hover:decoration-accent"
                >
                  Vérifier le certificat ↗
                </a>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
