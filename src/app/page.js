import Link from "next/link";
import { profil, approche } from "@/data/profil";
import { domaines, certifications } from "@/data/competences";
import { projets } from "@/data/projets";
import { visuelsDisponibles } from "@/lib/visuels";
import Carte from "@/components/Carte";
import ProjectCard from "@/components/ProjectCard";
import SceneIA from "@/components/SceneIA";
import HeroIntro from "@/components/HeroIntro";
import Rouleau from "@/components/Rouleau";
import SautPanneau from "@/components/SautPanneau";

const HAUTEUR_PANNEAU = "h-[calc(100svh-4.75rem)]";

export default function Home() {
  const cartesProjets = projets.map((projet, i) => {
    const dispo = visuelsDisponibles(projet.visuels);
    const couverture =
      dispo.find((v) => v.format !== "mobile") ?? dispo[0] ?? null;
    return {
      // La première porte l'ancre « réalisations » du header.
      id: i === 0 ? "realisations" : projet.slug,
      titre: projet.nom,
      contenu: (
        <ProjectCard projet={projet} index={i} couverture={couverture} />
      ),
    };
  });

  const cartes = [
    ...cartesProjets,
    {
      id: "approche",
      titre: "Approche technique",
      contenu: (
        <Carte className="carte-centree px-8 py-8 sm:px-12 sm:py-9">
          <h2 className="font-mono text-xs uppercase tracking-[0.18em] text-faint">
            Approche technique
          </h2>
          <p className="display mt-4 max-w-2xl text-2xl text-ink sm:text-3xl">
            Ce qui distingue un prototype d&apos;un système qui tient.
          </p>

          <div className="mt-7 grid gap-x-12 gap-y-5 md:grid-cols-2">
            {approche.map((bloc) => (
              <div key={bloc.titre}>
                <h3 className="text-base font-semibold text-ink">
                  {bloc.titre}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">
                  {bloc.texte}
                </p>
              </div>
            ))}
          </div>
        </Carte>
      ),
    },
    {
      id: "skills",
      titre: "Skills",
      contenu: (
        <Carte className="carte-centree px-8 py-10 sm:px-12 sm:py-12">
          <h2 className="font-mono text-xs uppercase tracking-[0.18em] text-faint">
            Skills
          </h2>
          <p className="display mt-5 max-w-2xl text-3xl text-ink sm:text-4xl">
            Six domaines éprouvés en production, deux parcours certifiés.
          </p>

          <div className="mt-10 flex flex-wrap gap-2.5">
            {domaines.map((d) => (
              <span
                key={d.nom}
                className="border border-line px-4 py-2 text-sm text-muted"
              >
                {d.nom}
              </span>
            ))}
            {certifications.map((c) => (
              <span
                key={c.titre}
                className="bg-accent-soft px-4 py-2 text-sm text-accent"
              >
                {c.titre}
              </span>
            ))}
          </div>

          <Link
            href="/skills"
            className="group mt-10 inline-block text-sm text-accent"
          >
            Voir le détail, projet par projet
            <span className="ml-1 inline-block transition-transform group-hover:translate-x-1">
              →
            </span>
          </Link>
        </Carte>
      ),
    },
  ];

  return (
    <>
      {/* Panneau 1 — l'accueil occupe l'écran entier, seul. */}
      <section
        id="hero"
        className={`relative flex ${HAUTEUR_PANNEAU} flex-col items-center justify-center overflow-hidden px-6`}
      >
        <div aria-hidden="true" className="lueur" />

        <div className="mx-auto w-full max-w-2xl shrink-0">
          <SceneIA />
        </div>

        <HeroIntro className="mx-auto mt-6 w-full max-w-4xl">
          <Carte className="px-8 py-9 sm:px-10 sm:py-10">
            <p
              data-hero
              className="font-mono text-xs uppercase tracking-[0.18em] text-accent"
            >
              {profil.role} · {profil.roleSecondaire} —{" "}
              {/* La ligne est en capitales, la marque garde sa casse propre. */}
              <span className="normal-case">{profil.structure}</span>
            </p>
            <h1
              data-hero
              className="display mt-5 max-w-3xl text-2xl text-ink sm:text-3xl"
            >
              {profil.position}
            </h1>
            <p
              data-hero
              className="display-sous mt-4 max-w-2xl text-sm text-ink sm:text-base"
            >
              {profil.accroche}
            </p>

            <div
              data-hero
              className="mt-7 flex flex-wrap gap-x-4 gap-y-3 text-sm"
            >
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
          </Carte>
        </HeroIntro>

        <div className="mt-6 shrink-0">
          <SautPanneau cible="#cartes" libelle="Réalisations" />
        </div>
      </section>

      {/* Panneau 2 — le rouleau dispose de tout l'écran à son tour. */}
      <section
        id="cartes"
        className={`relative flex ${HAUTEUR_PANNEAU} flex-col overflow-hidden`}
      >
        <Rouleau
          cartes={cartes}
          panneauPrecedent="#hero"
          className="mx-auto w-full max-w-5xl flex-1 px-6 py-6"
        />
      </section>
    </>
  );
}
