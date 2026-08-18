# Architecture — portfolio BMG Consulting

Site vitrine statique. Next.js 16 (App Router), JavaScript sans TypeScript,
Tailwind 4, GSAP + Lenis. Aucune base de données, aucun CMS, aucune
bibliothèque de composants.

Dernière mise à jour : 2026-08-14.

---

## 1. Décisions structurantes

### Pas de base de données : les données sont du code
Tout le contenu vit dans `src/data/` en modules JS exportant des objets
littéraux (`profil`, `projets`, `domaines`, `certifications`). Conséquences
assumées :

- le site est **entièrement pré-rendu** (`○ Static` / `● SSG` au build) ;
- modifier un contenu est un commit, pas une écriture en base ;
- aucune couche de validation n'est nécessaire — il n'existe pas d'entrée
  utilisateur.

C'est le bon compromis pour un site de quatre projets qui change quelques fois
par an. Le jour où le contenu doit changer sans redéploiement, c'est cette
décision-là qu'il faudra rouvrir, pas le reste.

### Les visuels sont vérifiés sur disque, pas déclarés de confiance
`src/lib/visuels.js` tourne côté serveur au build. Pour chaque visuel déclaré
dans les données :

1. il vérifie que le fichier existe réellement dans `public/` — un visuel
   déclaré mais absent est **silencieusement omis**, jamais une image cassée ;
2. il lit largeur et hauteur directement dans l'en-tête **IHDR** du PNG.

Le second point évite de recopier les dimensions à la main dans les données, où
elles divergeraient à la première capture remplacée. Les captures peuvent donc
être déposées une par une sans jamais casser le rendu ni le build.

### Thème : variables CSS et préférence système, sans bascule
`globals.css` définit un jeu de variables sur `:root`, redéfini sous
`@media (prefers-color-scheme: dark)`, puis exposé à Tailwind via
`@theme inline`. **Il n'y a pas de bouton de thème** — donc pas d'état à
persister, pas de `data-theme`, pas de flash au chargement.

Corollaire à respecter dans tout nouveau composant : dessiner en
`currentColor` et en `var(--…)`, jamais en couleur littérale. Les deux thèmes
suivent alors sans code supplémentaire.

---

## 2. Architecture du défilement

C'est la partie la plus dense du projet. Trois briques qui doivent rester
cohérentes.

### `ScrollLisse` — Lenis, monté une fois dans le layout
Inertie de défilement sur toute la page. Deux points non négociables :

- `lenis.on("scroll", ScrollTrigger.update)` — sans ce branchement,
  ScrollTrigger continue de lire le défilement natif et toutes les révélations
  se déclenchent à côté de ce qui est affiché ;
- `scroll-behavior: smooth` est **volontairement absent** du CSS : il entre en
  conflit direct avec l'inertie pilotée en JS.

### `lib/scroll.js` — un point d'entrée unique
`scrollVers(cible)` passe par Lenis quand il est monté, et retombe sur
`scrollIntoView` sinon (mouvement réduit, ou avant montage). `DECALAGE_ENTETE`
compense la hauteur du header collant — sans lui, un panneau amené « en haut du
viewport » passe dessous.

**Ne jamais appeler `lenis.scrollTo` ni `scrollIntoView` directement** depuis un
composant : tout passe par cette fonction.

### Page d'accueil : deux panneaux plein écran
`src/app/page.js` n'est pas une page qui défile, c'est **deux panneaux** de
`calc(100svh - 4.75rem)` :

1. `#hero` — la scène + le bloc de texte, seuls ;
2. `#cartes` — le `Rouleau`, qui contient projets, approche et skills.

`SautPanneau` capture la molette tant que l'accueil occupe l'écran, pour
basculer d'un panneau entier à l'autre au lieu de s'arrêter entre les deux.

### `Rouleau` — carrousel cylindrique
Les cartes sont posées sur la surface d'un cylindre (`ANGLE`, `RAYON`), pas
simplement décalées puis inclinées : c'est ce qui produit la rotation autour
d'un axe. Points d'architecture :

- **Boucle de rendu propre, sur `gsap.ticker`.** Pas de tween par cran : la
  position glisse en continu vers une cible. Changer de cible ne fait que
  déplacer la cible, le mouvement n'est jamais interrompu — un tween à durée
  fixe décélérerait jusqu'à l'arrêt entre deux crans, d'où des saccades.
- **Seules `transform` et `opacity` sont écrites par image.** Ce sont les deux
  propriétés que le compositeur traite sans recalcul de mise en page. `display`,
  `z-index` et `inert` sont mis en cache et n'écrivent qu'au changement de
  valeur. Un flou de profondeur a été retiré pour cette raison.
- **Toute mesure est faite hors boucle**, dans `mesurer()`, au montage et au
  redimensionnement.
- **Deux axes.** Sous 1024 px le rouleau bascule sur un axe vertical : on
  balaie horizontalement, et le doigt vertical rend la page au défilement —
  sinon le pied de page devient inatteignable.
- **Résistance au bord** : deux impulsions distinctes sont nécessaires pour
  quitter le panneau. Compter des *impulsions* et non une quantité de molette
  rend le seuil identique à la souris et au trackpad, qui n'émettent pas du tout
  les mêmes deltas.

### `FondCircuits` — deux canvas superposés
Fixe derrière toute la page. Le premier canvas porte les pistes, **gravées une
seule fois** ; le second ne reçoit que les impulsions et est le seul redessiné à
chaque image. Générateur pseudo-aléatoire **déterministe** (graine fixe) : le
même circuit d'un rendu à l'autre.

S'arrête quand l'onglet passe en arrière-plan, et ne démarre pas du tout en
mouvement réduit.

---

## 3. Conventions d'animation

Elles sont respectées par tous les composants animés — `SceneIA`, `Reveal`,
`Compteur`, `HeroIntro`, `TerminalHero`. Toute nouvelle animation doit s'y
conformer.

**Le contenu est visible par défaut.** L'état initial n'est posé qu'en JS. Sans
JavaScript, ou en mouvement réduit, la page reste entièrement lisible. C'est la
raison pour laquelle on écrit `gsap.set(cibles, { opacity: 0 })` dans l'effet
plutôt qu'une classe cachée dans le markup.

**`prefers-reduced-motion` est vérifié dans chaque composant animé**, en tête
d'effet, avec sortie anticipée ou pose finale figée. Le bloc `@media` de
`globals.css` ne couvre que les animations CSS — GSAP est du JS, il n'est pas
concerné.

**`gsap.context()` systématique**, avec `ctx.revert()` en nettoyage. C'est ce
qui rend les composants sûrs au démontage et en mode strict de React.

**`useEffetIsomorphe`** (`src/lib/animation.js`) vaut `useLayoutEffect` côté
client et `useEffect` côté serveur : l'état initial est posé avant le premier
paint, sinon le contenu rendu côté serveur apparaît en entier puis disparaît.

**Sur du SVG, `svgOrigin` et non `transformOrigin`.** Le second est mesuré
depuis le coin de la bbox, qui déborde de l'axe voulu.

**Ne jamais retourner un groupe SVG par `scale(-1,1)` dans le markup** s'il est
animé par GSAP : le miroir se recombine avec celui de GSAP et s'annule.

---

## 4. Rendu et déploiement

| | |
|---|---|
| Rendu | Tout statique. `generateStaticParams` sur `/projets/[slug]` |
| Alias | `@/*` → `./src/*` (`jsconfig.json`) |
| Police | JetBrains Mono via `next/font/google`, exposée en `--font-mono-var` |
| Images | `next/image`, rendues au ratio exact lu dans le PNG |
| Hébergement | Vercel, déploiement sur push `main` |

`next.config.mjs` est vide : aucune configuration particulière n'est nécessaire,
et c'est un signe de santé — le jour où il se remplit, il faudra savoir pourquoi.

---

## 5. Ce qui est en place mais non branché

- **`TerminalHero`** — composant complet et fonctionnel, importé nulle part. Il
  était prévu pour démontrer la collaboration humain / agent par une session de
  terminal jouée. Décision reportée.
- **`public/scene/`** — 4,4 Mo de lavis à l'encre générés pour une animation de
  héros abandonnée. Référencés par aucun code, conservés dans l'historique git.
