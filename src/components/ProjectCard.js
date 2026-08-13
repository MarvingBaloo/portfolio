import Link from "next/link";
import Image from "next/image";
import Fenetre from "@/components/Fenetre";
import Compteur from "@/components/Compteur";
import Reveal from "@/components/Reveal";

export default function ProjectCard({ projet, index, couverture }) {
  return (
    <Reveal>
      <Link
        href={`/projets/${projet.slug}`}
        className="group block border-t border-line py-12 transition-colors hover:border-accent"
      >
        <div className="grid gap-6 md:grid-cols-[7rem_1fr]">
          <div className="flex flex-row gap-3 md:flex-col md:gap-1.5">
            <span className="font-mono text-xs text-accent">
              {String(index + 1).padStart(2, "0")}
            </span>
            <span className="font-mono text-xs uppercase tracking-[0.14em] text-faint">
              {projet.secteur}
            </span>
          </div>

          <div className="grid gap-8 lg:grid-cols-[1fr_20rem] lg:items-start">
            <div>
              <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
                <h3 className="display text-3xl text-ink transition-colors group-hover:text-accent sm:text-4xl">
                  {projet.nom}
                </h3>
                <span className="rounded-full bg-accent-soft px-2.5 py-0.5 font-mono text-[11px] text-accent">
                  {projet.statut}
                </span>
              </div>

              <p className="mt-3 max-w-2xl text-muted">{projet.resume}</p>

              <div className="mt-6 flex flex-wrap gap-x-8 gap-y-3">
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

              <span className="mt-7 inline-block text-sm text-accent">
                Lire l&apos;étude de cas
                <span className="ml-1 inline-block transition-transform group-hover:translate-x-1">
                  →
                </span>
              </span>
            </div>

            {couverture ? (
              <Fenetre titre={`${projet.slug}`}>
                <div className="relative aspect-16/10">
                  <Image
                    src={couverture.src}
                    alt={couverture.legende}
                    fill
                    sizes="(max-width: 1024px) 100vw, 320px"
                    className="object-cover object-top transition-transform duration-700 group-hover:scale-[1.04]"
                  />
                </div>
              </Fenetre>
            ) : null}
          </div>
        </div>
      </Link>
    </Reveal>
  );
}
