let instance = null;

// Hauteur du header collant. Sans ce décalage, un panneau amené « en haut du
// viewport » passe sous le header et laisse dépasser le panneau suivant.
export const DECALAGE_ENTETE = 76;

export function definirScroll(lenis) {
  instance = lenis;
}

/**
 * Défilement piloté vers une cible. Passe par Lenis quand il est actif pour
 * garder l'inertie, et retombe sur le défilement natif sinon (mouvement réduit,
 * ou avant que le composant de scroll ne soit monté).
 */
export function scrollVers(cible, options = {}) {
  if (instance) {
    instance.scrollTo(cible, {
      duration: 0.9,
      offset: -DECALAGE_ENTETE,
      // `lock` empêche la molette résiduelle de dérailler le déplacement en
      // cours : sans lui, on s'arrête entre deux panneaux.
      lock: true,
      ...options,
    });
    return;
  }
  const el =
    typeof cible === "string" ? document.querySelector(cible) : cible;
  el?.scrollIntoView({ behavior: "smooth", block: "start" });
}
