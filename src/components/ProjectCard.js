import Link from "next/link";
import Image from "next/image";
import Carte from "@/components/Carte";
import Fenetre from "@/components/Fenetre";
import Compteur from "@/components/Compteur";
import FlecheCarte from "@/components/FlecheCarte";

export default function ProjectCard({ projet, index, couverture }) {
  return (
    <Link
      href={`/projets/${projet.slug}`}
      className="group block"
      style={{ "--couleur-projet": projet.couleur }}
    >
      <Carte
        halo
        className="carte-centree px-8 py-9 sm:px-10 sm:py-10"
      >
        <div className="relative flex items-start justify-between gap-6">
          <div className="flex items-center gap-3 font-mono text-xs">
            <span className="text-accent">
              {String(index + 1).padStart(2, "0")}
            </span>
            <span className="uppercase tracking-[0.14em] text-faint">
              {projet.secteur}
            </span>
          </div>
          <FlecheCarte />
        </div>

        {/* Deux colonnes : le texte à gauche, la capture à droite. En pile, la
            carte dépassait la hauteur d'un écran une fois dans le rouleau. */}
        <div className="relative mt-7 grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.25fr)] lg:items-center lg:gap-10">
          <div>
            <div className="flex flex-wrap items-baseline gap-x-4 gap-y-2">
              <h3 className="display text-3xl text-ink transition-colors group-hover:text-accent sm:text-4xl">
                {projet.nom}
              </h3>
              <span className="rounded-full bg-accent-soft px-2.5 py-0.5 font-mono text-[11px] text-accent">
                {projet.statut}
              </span>
            </div>

            <p className="mt-3 leading-relaxed text-muted">{projet.resume}</p>

            <p className="mt-3 font-mono text-[11px] uppercase tracking-[0.14em] text-faint">
              {projet.role}
            </p>

            <div className="mt-6 flex flex-wrap gap-x-7 gap-y-3">
              {projet.metriques.map((m) => (
                <div key={m.label}>
                  <Compteur
                    valeur={m.valeur}
                    className="block font-mono text-lg text-ink"
                  />
                  <div className="mt-0.5 font-mono text-[11px] text-faint">
                    {m.label}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-5 flex flex-wrap gap-2">
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

          {/* Rendu au ratio exact de la capture : entière, sans recadrage. */}
          {couverture ? (
            <Fenetre titre={projet.slug}>
              <Image
                src={couverture.src}
                alt={couverture.legende}
                width={couverture.largeur ?? 1600}
                height={couverture.hauteur ?? 1000}
                sizes="(max-width: 1024px) 100vw, 520px"
                className="h-auto w-full"
              />
            </Fenetre>
          ) : null}
        </div>
      </Carte>
    </Link>
  );
}
