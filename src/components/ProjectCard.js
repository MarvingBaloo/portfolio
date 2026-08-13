import Link from "next/link";
import Image from "next/image";
import Carte from "@/components/Carte";
import Fenetre from "@/components/Fenetre";
import Compteur from "@/components/Compteur";
import Reveal from "@/components/Reveal";

export default function ProjectCard({ projet, index, couverture }) {
  return (
    <Reveal>
      <Link
        href={`/projets/${projet.slug}`}
        className="group block"
        style={{ "--couleur-projet": projet.couleur }}
      >
        <Carte halo>
          <div className="relative px-7 pt-7 sm:px-10 sm:pt-10">
            <div className="flex items-start justify-between gap-6">
              <div className="flex items-center gap-3 font-mono text-xs">
                <span className="text-accent">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="uppercase tracking-[0.14em] text-faint">
                  {projet.secteur}
                </span>
              </div>
              <span
                aria-hidden="true"
                className="text-xl leading-none text-faint transition-all duration-300 group-hover:translate-x-1 group-hover:text-accent"
              >
                →
              </span>
            </div>

            <div className="mt-6 flex flex-wrap items-baseline gap-x-4 gap-y-2">
              <h3 className="display text-3xl text-ink transition-colors group-hover:text-accent sm:text-4xl">
                {projet.nom}
              </h3>
              <span className="rounded-full bg-accent-soft px-2.5 py-0.5 font-mono text-[11px] text-accent">
                {projet.statut}
              </span>
            </div>

            <p className="mt-3 max-w-2xl leading-relaxed text-muted">
              {projet.resume}
            </p>

            <div className="mt-7 flex flex-wrap gap-x-8 gap-y-3">
              {projet.metriques.map((m) => (
                <div key={m.label}>
                  <Compteur
                    valeur={m.valeur}
                    className="block font-mono text-xl text-ink"
                  />
                  <div className="mt-0.5 font-mono text-[11px] text-faint">
                    {m.label}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 flex flex-wrap gap-2">
              {projet.stack.slice(0, 6).map((t) => (
                <span
                  key={t}
                  className="border border-line px-2 py-1 font-mono text-[11px] text-muted"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>

          {/* Rendu au ratio exact de la capture : la vignette est entière, sans
              recadrage ni rognage par le bas de la carte. */}
          {couverture ? (
            <div className="relative mt-9 px-7 pb-7 sm:px-10 sm:pb-10">
              <Fenetre titre={projet.slug}>
                <Image
                  src={couverture.src}
                  alt={couverture.legende}
                  width={couverture.largeur ?? 1600}
                  height={couverture.hauteur ?? 1000}
                  sizes="(max-width: 1024px) 100vw, 960px"
                  className="h-auto w-full"
                />
              </Fenetre>
            </div>
          ) : null}
        </Carte>
      </Link>
    </Reveal>
  );
}
