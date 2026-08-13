import fs from "node:fs";
import path from "node:path";

/**
 * Lit largeur/hauteur dans l'en-tête IHDR d'un PNG : les 8 premiers octets sont
 * la signature, puis la longueur et le type du chunk, puis les deux entiers
 * 32 bits. Évite de recopier les dimensions dans les données — elles resteraient
 * à maintenir à la main à chaque nouvelle capture.
 */
function dimensionsPng(chemin) {
  let fd;
  try {
    fd = fs.openSync(chemin, "r");
    const tampon = Buffer.alloc(24);
    const lus = fs.readSync(fd, tampon, 0, 24, 0);
    if (lus < 24 || tampon.toString("ascii", 12, 16) !== "IHDR") return null;
    return { largeur: tampon.readUInt32BE(16), hauteur: tampon.readUInt32BE(20) };
  } catch {
    return null;
  } finally {
    if (fd !== undefined) fs.closeSync(fd);
  }
}

/**
 * Un visuel déclaré dans les données n'est affiché que si le fichier existe
 * réellement dans /public. Les captures peuvent donc être déposées une par une
 * sans jamais casser le rendu ni le build. Les dimensions sont jointes au
 * passage pour que l'image soit rendue à son ratio exact, sans recadrage.
 */
export function visuelsDisponibles(visuels = []) {
  return visuels.flatMap((v) => {
    const chemin = path.join(process.cwd(), "public", v.src);
    if (!fs.existsSync(chemin)) return [];
    return [{ ...v, ...(dimensionsPng(chemin) ?? {}) }];
  });
}
