import Image from "next/image";
import Fenetre from "@/components/Fenetre";
import Reveal from "@/components/Reveal";

export default function Galerie({ visuels, slug }) {
  if (!visuels.length) return null;

  return (
    <section className="mx-auto max-w-3xl px-6 pb-16">
      <h2 className="font-mono text-xs uppercase tracking-[0.18em] text-faint">
        Aperçus
      </h2>

      <div className="mt-8 space-y-14">
        {visuels.map((v) => (
          <Reveal key={v.src} as="figure">
            <Fenetre
              titre={`${slug} — ${v.src.split("/").pop()}`}
              className={v.format === "mobile" ? "mx-auto max-w-75" : ""}
            >
              <Image
                src={v.src}
                alt={v.legende}
                width={v.format === "mobile" ? 390 : 1440}
                height={v.format === "mobile" ? 844 : 900}
                sizes={
                  v.format === "mobile"
                    ? "300px"
                    : "(max-width: 768px) 100vw, 768px"
                }
                className="h-auto w-full"
              />
            </Fenetre>
            <figcaption className="mt-3 text-sm leading-relaxed text-faint">
              {v.legende}
            </figcaption>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
