import fs from "node:fs";
import path from "node:path";

/**
 * Un visuel déclaré dans les données n'est affiché que si le fichier existe
 * réellement dans /public. Les captures peuvent donc être déposées une par une
 * sans jamais casser le rendu ni le build.
 */
export function visuelsDisponibles(visuels = []) {
  return visuels.filter((v) =>
    fs.existsSync(path.join(process.cwd(), "public", v.src)),
  );
}
