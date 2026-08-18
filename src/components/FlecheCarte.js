/**
 * Repère « cette carte mène quelque part », posé en haut à droite de chaque
 * carte cliquable. Le mouvement au survol dépend d'un ancêtre `group`.
 */
export default function FlecheCarte() {
  return (
    <span
      aria-hidden="true"
      className="text-xl leading-none text-faint transition-all duration-300 group-hover:translate-x-1 group-hover:text-accent"
    >
      →
    </span>
  );
}
