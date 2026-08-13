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

export const approche = [
  {
    titre: "Sécurité applicative, pas décorative",
    texte:
      "Sur une plateforme financière, j'ai formalisé cinq règles de durcissement des Server Actions après avoir corrigé trois vulnérabilités critiques : jamais faire confiance à un montant venu du client, recalculer systématiquement côté serveur, vérifier l'appartenance de chaque ressource mutée, whitelister toute valeur d'énumération reçue, et encadrer la hiérarchie de création de rôles.",
  },
  {
    titre: "Concurrence et intégrité des données",
    texte:
      "Une course attribuée à deux chauffeurs, un acompte encaissé deux fois, des points de fidélité débités sur une addition séparée : ces bugs ne se voient pas en développement. Je les traite à la source — mise à jour conditionnelle atomique pour le premier arrivé, transactions de base de données pour toute opération financière, validation du solde avant écriture.",
  },
  {
    titre: "Isolation multi-tenant",
    texte:
      "Un identifiant de société porté par l'utilisateur sert de frontière à toute la plateforme. Aucune requête non-administrateur ne part sans ce filtre. C'est un pattern simple, appliqué sans exception, qui évite la fuite de données entre clients d'un SaaS.",
  },
  {
    titre: "Outillage IA et capitalisation",
    texte:
      "Au-delà du serveur MCP présenté ci-dessus, je maintiens un orchestrateur multi-agent en Python : un modèle architecte décide, un modèle exécutant applique, les sessions sont persistées et reprenables. Chaque session alimente une base d'apprentissage commune — erreurs rencontrées et patterns validés — relue au démarrage de la suivante.",
  },
];

