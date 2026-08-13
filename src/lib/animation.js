import { useEffect, useLayoutEffect } from "react";

// Cadence partagée du héros : la colonne texte et le terminal jouent deux
// timelines distinctes, ces repères les gardent synchronisées.
export const TEMPO = {
  cadre: 0.1,
  texte: 0.3,
  frappe: 0.95,
};

// L'état initial doit être posé avant le premier paint, sinon le contenu rendu
// côté serveur (nécessaire au fonctionnement sans JS) flashe en entier.
export const useEffetIsomorphe =
  typeof window === "undefined" ? useEffect : useLayoutEffect;
