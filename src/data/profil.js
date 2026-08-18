export const profil = {
  nom: "Marving GUSTAVE",
  role: "Développeur full-stack",
  roleSecondaire: "Data Engineer",
  structure: "BMGconsulting",
  // Titre de la page d'accueil : la prise de position vient avant le métier.
  // `accroche` reste, mais en sous-titre.
  position:
    "L'IA ne remplace pas l'ingénieur. Elle change ce qu'un ingénieur seul peut livrer.",
  accroche:
    "Je conçois et je livre des applications métier qui tiennent en production.",
  intro:
    "Des systèmes qui encaissent de l'argent, coordonnent des équipes sur le terrain et pilotent de l'infrastructure. Pas des maquettes : du logiciel qui tourne, avec ses contraintes de concurrence, de sécurité et de comptabilité.",
  email: "gustavemarving@gmail.com",
  github: "https://github.com/MarvingBaloo",
  githubLabel: "github.com/MarvingBaloo",
};

// Chaque bloc sert deux endroits : `titre` + `texte` alimentent la carte du
// rouleau, `regles` et `preuve` la page /approche. Une preuve pointe toujours
// un projet réel — un principe sans projet qui l'atteste n'entre pas ici.
export const approche = [
  {
    slug: "securite",
    titre: "Sécurité applicative, pas décorative",
    texte:
      "Sur une plateforme financière, j'ai formalisé cinq règles de durcissement des Server Actions après avoir corrigé trois vulnérabilités critiques : jamais faire confiance à un montant venu du client, recalculer systématiquement côté serveur, vérifier l'appartenance de chaque ressource mutée, whitelister toute valeur d'énumération reçue, et encadrer la hiérarchie de création de rôles.",
    detail:
      "Les trois failles n'étaient pas des oublis exotiques : un prix accepté tel quel depuis le navigateur, un changement de statut sans vérifier que la ressource appartenait bien à l'appelant, une création de rôle sans liste blanche. Je les ai trouvées en auditant mon propre code, corrigées, puis converties en règles que j'applique désormais par défaut plutôt que de les redécouvrir projet après projet.",
    regles: [
      "Aucun montant venu du client n'est utilisé tel quel — il est recalculé côté serveur à partir du barème.",
      "Toute mutation vérifie que la ressource appartient à l'appelant avant d'écrire.",
      "Toute valeur d'énumération reçue passe par une liste blanche explicite.",
      "La création de rôles est encadrée par une hiérarchie : un rôle ne peut pas en créer un plus puissant que lui.",
      "Les actions sensibles d'un agent automatisé restent suspendues jusqu'à un arbitrage humain.",
    ],
    preuves: [
      { slug: "youmoov-flex", texte: "les cinq règles y sont nées, appliquées à toutes les Server Actions" },
      { slug: "serveur-mcp", texte: "approbation humaine obligatoire hors liste autorisée, avec expiration" },
    ],
  },
  {
    slug: "concurrence",
    titre: "Concurrence et intégrité des données",
    texte:
      "Une course attribuée à deux chauffeurs, un acompte encaissé deux fois, des points de fidélité débités sur une addition séparée : ces bugs ne se voient pas en développement. Je les traite à la source — mise à jour conditionnelle atomique pour le premier arrivé, transactions de base de données pour toute opération financière, validation du solde avant écriture.",
    detail:
      "Ce sont des bugs qui ne se reproduisent pas à la demande : ils demandent deux utilisateurs au même instant, ce qui n'arrive jamais sur un poste de développement et tout le temps en production. Je ne compte donc pas sur les tests pour les attraper, je rends l'état incohérent impossible à écrire.",
    regles: [
      "Le premier arrivé se règle par une mise à jour conditionnelle atomique, pas par un verrou applicatif : si zéro ligne est affectée, un autre a gagné.",
      "Toute opération financière — débit, crédit, écriture de la trace — tient dans une seule transaction : elle réussit entièrement ou pas du tout.",
      "Un solde est validé au moment de l'écriture, jamais sur la valeur lue par le navigateur quelques minutes plus tôt.",
      "Une disponibilité affichée est revérifiée côté serveur à l'encaissement.",
    ],
    preuves: [
      { slug: "youmoov-flex", texte: "dispatch au premier arrivé, portefeuilles en transaction" },
      { slug: "cafe-verde", texte: "additions séparées et fidélité, sans double débit" },
      { slug: "reservation-evenementiel", texte: "aucune double réservation possible sur un créneau" },
    ],
  },
  {
    slug: "multi-tenant",
    titre: "Isolation multi-tenant",
    texte:
      "Un identifiant de société porté par l'utilisateur sert de frontière à toute la plateforme. Aucune requête non-administrateur ne part sans ce filtre. C'est un pattern simple, appliqué sans exception, qui évite la fuite de données entre clients d'un SaaS.",
    detail:
      "La difficulté d'un multi-tenant n'est pas de concevoir le cloisonnement, c'est de ne jamais l'oublier — une seule requête écrite sans le filtre suffit à exposer les données d'un client à un autre. D'où la règle sans exception : le filtre n'est pas une option de la requête, c'est sa condition d'existence.",
    regles: [
      "L'identifiant de société est porté par l'utilisateur et fait autorité côté serveur, jamais côté client.",
      "Aucune requête d'un rôle non-administrateur ne part sans ce filtre — sans exception ni cas particulier.",
      "Les rôles sont portés par des revendications signées, vérifiées à chaque appel.",
    ],
    preuves: [
      { slug: "youmoov-flex", texte: "cinq rôles, plusieurs entreprises cloisonnées sur une même base" },
      { slug: "cafe-verde", texte: "rôles en revendications personnalisées, vérifiés côté serveur" },
    ],
  },
  {
    slug: "outillage-ia",
    titre: "Outillage IA et capitalisation",
    texte:
      "Au-delà du serveur MCP présenté ci-dessus, je maintiens un orchestrateur multi-agent en Python : un modèle architecte décide, un modèle exécutant applique, les sessions sont persistées et reprenables. Chaque session alimente une base d'apprentissage commune — erreurs rencontrées et patterns validés — relue au démarrage de la suivante.",
    detail:
      "C'est la mise en pratique de la position affichée en page d'accueil : l'IA ne remplace pas l'ingénieur, elle étend ce qu'un ingénieur seul peut livrer. L'architecture le dit littéralement — la décision reste à l'architecte, l'exécution est déléguée, et rien de sensible ne part sans arbitrage humain.",
    regles: [
      "La décision d'architecture reste humaine ; l'agent exécute une consigne déjà tranchée.",
      "Les sessions sont persistées et reprenables — une exécution longue n'est jamais un aller simple.",
      "Chaque session écrit ses erreurs et ses patterns validés dans une base relue au démarrage de la suivante.",
      "Sur de l'infrastructure réelle, tout ce qui sort de la liste autorisée demande une validation explicite.",
    ],
    preuves: [
      { slug: "serveur-mcp", texte: "76 outils exposés à un agent, avec frein humain" },
    ],
  },
];
