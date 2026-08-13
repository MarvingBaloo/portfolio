/**
 * Cadre de carte partagé : contour translucide + carte intérieure.
 * `halo` n'a d'effet que sous un ancêtre porteur de la classe `group` — il est
 * donc réservé aux cartes cliquables.
 */
export default function Carte({ children, className = "", halo = false }) {
  return (
    <div className="carte-cadre">
      <div className={`carte ${className}`}>
        {halo ? <span aria-hidden="true" className="carte-halo" /> : null}
        {children}
      </div>
    </div>
  );
}
