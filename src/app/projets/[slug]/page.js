import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { projets, getProjet } from "@/data/projets";
import { visuelsDisponibles } from "@/lib/visuels";
import Galerie from "@/components/Galerie";
import Fenetre from "@/components/Fenetre";
import Compteur from "@/components/Compteur";
import Reveal from "@/components/Reveal";

export function generateStaticParams() {
  return projets.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const projet = getProjet(slug);
  if (!projet) return {};
  return { title: projet.nom, description: projet.resume };
}

export default async function ProjetPage({ params }) {
  const { slug } = await params;
  const projet = getProjet(slug);
  if (!projet) notFound();

  const index = projets.findIndex((p) => p.slug === slug);
  const suivant = projets[(index + 1) % projets.length];

  const dispo = visuelsDisponibles(projet.visuels);
  const couverture = dispo.find((v) => v.format !== "mobile") ?? dispo[0];
  const autresVisuels = dispo.filter((v) => v !== couverture);

  return (
    <article>
      <header className="mx-auto max-w-3xl px-6 pb-16 pt-16 sm:pt-24">
        <Link
          href="/#realisations"
          className="text-sm text-muted transition-colors hover:text-accent"
        >
          ← Toutes les réalisations
        </Link>

        <div className="mt-10 flex flex-wrap items-center gap-3 font-mono text-xs uppercase tracking-[0.16em] text-faint">
          <span>{projet.secteur}</span>
          <span className="text-line">/</span>
          <span className="text-accent">{projet.statut}</span>
        </div>

        <h1 className="display mt-4 text-4xl leading-tight text-ink sm:text-5xl">
          {projet.nom}
        </h1>
        <p className="mt-6 text-xl leading-relaxed text-muted">
          {projet.accroche}
        </p>

        <div className="mt-8 border-l-2 border-accent pl-6">
          <h2 className="font-mono text-xs uppercase tracking-[0.18em] text-faint">
            Mon rôle
          </h2>
          <p className="mt-3 leading-relaxed text-ink">{projet.perimetre}</p>
        </div>

        <div className="mt-10 flex flex-wrap gap-x-12 gap-y-4 border-y border-line py-6">
          {projet.metriques.map((m) => (
            <div key={m.label}>
              <Compteur
                valeur={m.valeur}
                className="block font-mono text-2xl text-ink"
              />
              <div className="mt-1 font-mono text-[11px] text-faint">
                {m.label}
              </div>
            </div>
          ))}
        </div>
      </header>

      {couverture ? (
        <figure className="mx-auto max-w-4xl px-6 pb-16">
          <Fenetre titre={`${projet.slug} — ${couverture.src.split("/").pop()}`}>
            <Image
              src={couverture.src}
              alt={couverture.legende}
              width={1440}
              height={900}
              priority
              sizes="(max-width: 896px) 100vw, 896px"
              className="h-auto w-full"
            />
          </Fenetre>
          <figcaption className="mt-3 text-sm leading-relaxed text-faint">
            {couverture.legende}
          </figcaption>
        </figure>
      ) : null}

      <section className="mx-auto max-w-3xl px-6 pb-16">
        <h2 className="font-mono text-xs uppercase tracking-[0.18em] text-faint">
          {projet.libelleContexte ?? "Le problème"}
        </h2>
        <p className="mt-5 text-lg leading-relaxed text-ink">
          {projet.probleme}
        </p>
      </section>

      <section className="border-y border-line bg-surface">
        <div className="mx-auto max-w-3xl px-6 py-16">
          <h2 className="font-mono text-xs uppercase tracking-[0.18em] text-faint">
            Ce que j&apos;ai livré
          </h2>
          <Reveal as="ul" selecteur="li" decalage={0.06} className="mt-6 space-y-4">
            {projet.solution.map((point) => (
              <li key={point} className="flex gap-4">
                <span
                  aria-hidden="true"
                  className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent"
                />
                <span className="leading-relaxed text-muted">{point}</span>
              </li>
            ))}
          </Reveal>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-6 py-16">
        <h2 className="font-mono text-xs uppercase tracking-[0.18em] text-faint">
          Les points durs
        </h2>
        <Reveal selecteur="[data-defi]" decalage={0.1} className="mt-8 space-y-10">
          {projet.defis.map((defi) => (
            <div key={defi.titre} data-defi className="border-l-2 border-accent pl-6">
              <h3 className="text-lg font-semibold text-ink">{defi.titre}</h3>
              <p className="mt-3 leading-relaxed text-muted">{defi.texte}</p>
            </div>
          ))}
        </Reveal>
      </section>

      <Galerie visuels={autresVisuels} slug={projet.slug} />

      <section className="mx-auto max-w-3xl px-6 pb-20">
        <h2 className="font-mono text-xs uppercase tracking-[0.18em] text-faint">Stack</h2>
        <div className="mt-6 flex flex-wrap gap-2">
          {projet.stack.map((t) => (
            <span
              key={t}
              className="border border-line px-3 py-1.5 text-sm text-muted"
            >
              {t}
            </span>
          ))}
        </div>
      </section>

      <nav className="border-t border-line">
        <Link
          href={`/projets/${suivant.slug}`}
          className="group mx-auto flex max-w-3xl items-baseline justify-between gap-6 px-6 py-10"
        >
          <span className="text-xs uppercase tracking-[0.16em] text-faint">
            Projet suivant
          </span>
          <span className="display text-2xl text-ink transition-colors group-hover:text-accent">
            {suivant.nom}
            <span className="ml-2 inline-block transition-transform group-hover:translate-x-1">
              →
            </span>
          </span>
        </Link>
      </nav>
    </article>
  );
}
