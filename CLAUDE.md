# CLAUDE.md — portfolio BMG Consulting

Site vitrine de Marving GUSTAVE / BMGconsulting. Statique, pré-rendu, déployé
sur Vercel au push sur `main`.

Lire `ARCHITECTURE.md` avant toute intervention sur le défilement, le rouleau ou
une animation. Ce fichier-ci donne le contexte et les règles de travail.

Dernière mise à jour : 2026-08-14.

---

## Stack

| | |
|---|---|
| Framework | Next.js 16.3 (App Router), JavaScript — **pas de TypeScript** |
| UI | React 19, Tailwind CSS 4. **Aucune bibliothèque de composants** |
| Animation | GSAP 3 + ScrollTrigger, Lenis pour l'inertie de défilement |
| Données | Modules JS statiques dans `src/data/`. Pas de base, pas de CMS |
| Déploiement | Vercel, sur push `main` |

```bash
npm run dev     # localhost:3000
npm run build   # doit passer avant tout commit
npm run lint
```

---

## Carte des fichiers

```
src/app/
  layout.js              ScrollLisse · FondCircuits · MarqueurDefilement · Header · Footer
  page.js                accueil — deux panneaux plein écran (#hero, #cartes)
  projets/[slug]/page.js fiche projet, SSG
  skills/page.js
  globals.css            variables de thème, classes de scène, rouleau, header

src/components/
  Rouleau.js             carrousel cylindrique — le fichier le plus dense
  SceneIA.js             scène animée humain + IA du héros
  FondCircuits.js        fond canvas, pistes gravées + impulsions
  ScrollLisse.js         Lenis, monté une fois
  SautPanneau.js         enchaînement panneau 1 → panneau 2
  MarqueurDefilement.js  pose data-defile sur <html> pour le header
  Carte, Fenetre, Galerie, ProjectCard, Compteur, Reveal, HeroIntro
  Header, Footer, MenuMobile
  TerminalHero.js        ⚠ orphelin, importé nulle part

src/data/                profil.js · projets.js · competences.js
src/lib/                 scroll.js · animation.js · visuels.js
```

---

## Conventions du projet

**Tout est nommé en français** — variables, fonctions, attributs `data-*`,
composants. `racine`, `cible`, `etiquettes`, `data-etiquette`, `scrollVers`.
S'y conformer, y compris dans du code neuf.

**Commentaires : uniquement le WHY non évident.** Le code de ce dépôt commente
les pièges, pas le fonctionnement. Un commentaire qui paraphrase la ligne
suivante est à supprimer.

**Dessiner en `currentColor` et `var(--…)`.** Jamais de couleur littérale : il
n'y a pas de bascule de thème, les deux modes suivent les variables.

**Le contenu est visible par défaut, l'animation est un supplément.** État
initial posé en JS seulement. Sans JavaScript, la page reste lisible.

**`prefers-reduced-motion` vérifié dans chaque composant animé.** Le bloc
`@media` de `globals.css` ne couvre que le CSS.

**Conventional Commits**, en français.

---

## Pièges rencontrés sur ce dépôt

Chacun a coûté du temps au moins une fois.

**`Carte` ne transmet pas les props.** Sa signature est
`({ children, className, halo })`, sans spread. Un `data-*` posé dessus
disparaît **sans erreur ni warning**. Poser l'attribut sur un `<div>` englobant.

**Un enfant `repeat: -1` rend infinie la durée d'une timeline GSAP.**
`progress()` n'atteint alors jamais 1. Sortir les boucles infinies dans une
timeline séparée jouée par callback.

**Ne pas subordonner le démarrage d'une animation à `ScrollTrigger.isActive`
au montage.** La mesure est prise avant stabilisation du layout ; si elle tombe
à faux, la timeline reste en pause et plus rien ne la relance. Démarrer sans
condition, laisser à ScrollTrigger le seul rôle de suspendre hors champ.

**Dans un SVG, `mix-blend-mode` sans support opaque ne fait rien** — le fond
d'un `<svg>` est transparent. Et une `opacity < 1` posée sur un **groupe**
l'isole et annule le blend de ses enfants : poser l'opacité par élément.

**Un « ça ne marche pas » qui ne reproduit pas partout : vérifier d'abord que
le serveur dev sert le code écrit.** Un `next dev` périmé a déjà fait passer un
bug pour une incompatibilité Safari, et coûté quatre allers-retours.

---

## Intentions éditoriales

Le `<h1>` de l'accueil porte une **prise de position** (`profil.position`), pas
une description de métier : *« L'IA ne remplace pas l'ingénieur. Elle change ce
qu'un ingénieur seul peut livrer. »* L'accroche production est passée en
sous-titre.

C'est délibéré : le message central de BMGconsulting est **l'alliance humain +
IA**, et il doit être écrit noir sur blanc, pas seulement suggéré par la scène
animée. `SceneIA` le symbolise (silhouettes étiquetées `HUMAIN` et `IA`,
légende `$ humain + ia`), le titre l'énonce.

**Registre du site** : factuel, technique, anti-hype. Les textes parlent de
production, de concurrence, de sécurité, de comptabilité. Éviter le vocabulaire
promotionnel.

---

## À savoir avant de proposer une animation

Le rendu graphique de ce site est **schématique** : traits, silhouettes,
diagrammes, monospace. Ce registre est un choix, et c'est aussi la limite du
faisable en écrivant des tracés SVG à la main.

Une tentative d'animation illustrée « façon studio d'animation » a été menée
puis entièrement retirée : le code était juste, mais la qualité dépendait d'une
compétence d'illustration hors de portée du code. **Si une demande dépend d'un
dessin, produire l'échantillon visuel seul et le faire valider avant de
construire quoi que ce soit autour.**

Reste ouvert : brancher `TerminalHero` pour *démontrer* la collaboration
humain / agent — une session où l'humain décide et l'agent exécute — plutôt que
de l'illustrer.
