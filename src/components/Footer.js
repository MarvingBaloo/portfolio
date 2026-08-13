import { profil } from "@/data/profil";

export default function Footer() {
  return (
    <footer id="contact" className="border-t border-line">
      <div className="mx-auto max-w-5xl px-6 py-16">
        <h2 className="display text-3xl text-ink sm:text-4xl">
          Un projet à cadrer ?
        </h2>
        <p className="mt-4 max-w-xl text-muted">
          Décrivez-moi le problème métier. Je reviens vers vous avec une lecture
          technique et une estimation de faisabilité.
        </p>

        <div className="mt-8 flex flex-wrap gap-x-8 gap-y-3 text-sm">
          <a
            href={`mailto:${profil.email}`}
            className="text-ink underline decoration-line underline-offset-4 transition-colors hover:text-accent hover:decoration-accent"
          >
            {profil.email}
          </a>
          <a
            href={profil.github}
            target="_blank"
            rel="noreferrer"
            className="text-ink underline decoration-line underline-offset-4 transition-colors hover:text-accent hover:decoration-accent"
          >
            {profil.githubLabel}
          </a>
        </div>

        <p className="mt-12 text-xs text-faint">
          © {new Date().getFullYear()} {profil.nom} — {profil.structure}
        </p>
      </div>
    </footer>
  );
}
