// Deux registres distincts :
// - `domaines`  : compétences éprouvées en production, chacune adossée à un projet.
// - `certifications` : parcours certifiés et vérifiables publiquement.

export const domaines = [
  {
    nom: "Applications web & produit",
    resume:
      "Concevoir et livrer l'application complète, du modèle de données à l'écran.",
    skills: [
      {
        nom: "Next.js 16 — App Router, Server Actions",
        preuve: "Youmoov Flex, plateforme de réservation",
        application:
          "SaaS métier, back-offices, plateformes B2B, sites transactionnels",
      },
      {
        nom: "React 19 — SPA temps réel",
        preuve: "Café Verdé",
        application:
          "Interfaces de caisse, outils terrain, tableaux de bord opérationnels",
      },
      {
        nom: "Tailwind CSS 3 et 4",
        preuve: "Les quatre projets",
        application:
          "Systèmes visuels cohérents sans dépendance à une librairie de composants",
      },
      {
        nom: "Internationalisation et thèmes clair/sombre",
        preuve: "Café Verdé, vitrine produit bilingue",
        application: "Produits multi-marchés, marques à forte exigence visuelle",
      },
    ],
  },
  {
    nom: "Paiement & encaissement",
    resume:
      "Faire circuler de l'argent réel, en ligne comme au comptoir, sans écart de caisse.",
    skills: [
      {
        nom: "Stripe Terminal piloté par le serveur",
        preuve: "Café Verdé",
        application:
          "Commerce physique, restauration, click & collect, points de vente",
      },
      {
        nom: "Paiement en ligne et acomptes",
        preuve: "Plateforme de réservation, commande en ligne",
        application: "Réservation, e-commerce, prestations à acompte",
      },
      {
        nom: "Encaissement multi-moyens et séparation d'addition",
        preuve: "Café Verdé",
        application: "Restauration, retail, tout point de vente physique",
      },
      {
        nom: "Comptabilité applicative — TVA, remises, remboursements",
        preuve: "Café Verdé",
        application:
          "Tout produit dont le chiffre d'affaires doit être justifiable",
      },
    ],
  },
  {
    nom: "Architecture & sécurité applicative",
    resume:
      "Ce qui sépare un prototype d'un système qui tient sous charge et sous audit.",
    skills: [
      {
        nom: "Isolation multi-tenant",
        preuve: "Youmoov Flex",
        application:
          "SaaS B2B, gestion de flotte, plateformes à clients cloisonnés",
      },
      {
        nom: "Durcissement des mutations serveur",
        preuve: "Youmoov Flex — cinq règles issues d'un audit de vulnérabilités",
        application:
          "Toute application manipulant des montants, des rôles ou des droits",
      },
      {
        nom: "Concurrence et atomicité transactionnelle",
        preuve: "Youmoov Flex — dispatch au premier arrivé, portefeuille interne",
        application:
          "Réservation, files d'attente, attribution de ressources rares",
      },
      {
        nom: "Authentification multi-rôles",
        preuve: "NextAuth v5 sur Flex, Firebase Auth sur Café Verdé",
        application:
          "Produits à rôles différenciés, connexion par SMS ou par email",
      },
    ],
  },
  {
    nom: "Données & intégration",
    resume:
      "Modéliser, réconcilier et faire circuler la donnée entre systèmes hétérogènes.",
    skills: [
      {
        nom: "Modélisation relationnelle — PostgreSQL, Prisma",
        preuve: "Quatre schémas en production, jusqu'à vingt-cinq modèles",
        application: "Tout produit métier, migration depuis un tableur ou un legacy",
      },
      {
        nom: "Modélisation NoSQL — Firestore",
        preuve: "Café Verdé — arbres de catégories récursifs",
        application: "Applications temps réel, catalogues hiérarchiques",
      },
      {
        nom: "Réconciliation multi-sources",
        preuve: "Serveur MCP — quatre APIs contradictoires, un verdict unique",
        application: "Supervision, agrégation d'API, tableaux de bord consolidés",
      },
      {
        nom: "Cache, quotas et dégradation gracieuse",
        preuve: "Serveur MCP — mille appels par jour maximum",
        application: "Toute intégration tierce facturée à l'appel",
      },
      {
        nom: "ETL batch en Python — pandas, SQLite",
        preuve: "Outil de veille d'offres",
        application: "Collecte automatisée, reporting périodique, alerting",
      },
    ],
  },
  {
    nom: "IA & systèmes agentiques",
    resume:
      "Donner des capacités d'action à un modèle, et l'encadrer.",
    skills: [
      {
        nom: "Protocole MCP — serveurs d'outils",
        preuve: "Serveur MCP — soixante-quatre outils typés",
        application:
          "Exposer un système d'information à un assistant, automatisation métier",
      },
      {
        nom: "Sécurité agentique — validation humaine",
        preuve: "Serveur MCP — approbation temps réel avec expiration",
        application:
          "Toute automatisation dont une erreur coûte cher ou est irréversible",
      },
      {
        nom: "Orchestration multi-agent",
        preuve: "Orchestrateur interne — modèle architecte et modèle exécutant",
        application: "Délégation de tâches longues, industrialisation du développement",
      },
      {
        nom: "Recherche sémantique et embeddings",
        preuve: "Orchestrateur interne — base d'apprentissage continu",
        application: "RAG, base de connaissances interrogeable, recherche interne",
      },
    ],
  },
  {
    nom: "Infrastructure & déploiement",
    resume: "Mettre en production et garder la main dessus.",
    skills: [
      {
        nom: "Docker et Docker Compose",
        preuve: "Serveur MCP — sonde de santé, volumes persistants",
        application: "Services auto-hébergés, environnements reproductibles",
      },
      {
        nom: "Google Cloud Run",
        preuve: "Backend Café Verdé",
        application: "API conteneurisées à mise à l'échelle automatique",
      },
      {
        nom: "Vercel",
        preuve: "L'ensemble des fronts",
        application: "Déploiement continu, prévisualisations par branche",
      },
      {
        nom: "Réseau privé Tailscale",
        preuve: "Pilotage d'un serveur distant depuis le poste de travail",
        application: "Accès sécurisé à des services non exposés publiquement",
      },
    ],
  },
];

export const certifications = [
  {
    titre: "IBM Data Engineering",
    organisme: "IBM · Coursera",
    date: "Novembre 2025",
    volume: "16 cours",
    url: "https://coursera.org/verify/professional-cert/7WWFLH36RI34",
    resume:
      "Parcours professionnel complet : bases relationnelles et administration, entrepôts de données, ETL et pipelines, NoSQL, traitement distribué et restitution décisionnelle, conclu par un projet de bout en bout.",
    couvre: [
      "SQL & bases relationnelles",
      "Administration de bases (DBA)",
      "ETL & pipelines de données",
      "Apache Airflow",
      "Apache Kafka",
      "Data Warehouse",
      "NoSQL",
      "Apache Spark",
      "Hadoop",
      "Machine learning avec Spark",
      "Linux & shell scripting",
      "BI — Cognos, Looker",
      "Python pour la donnée",
    ],
  },
  {
    titre: "IBM Data Science",
    organisme: "IBM · Coursera",
    date: "Octobre 2025",
    volume: "12 cours",
    url: "https://coursera.org/verify/professional-cert/HO4AM5STHV3X",
    resume:
      "Méthodologie de la science des données, outillage, analyse et visualisation, modélisation par apprentissage automatique, avec un projet final appliqué.",
    couvre: [
      "Méthodologie data science",
      "Python — pandas, NumPy",
      "SQL pour l'analyse",
      "Analyse de données",
      "Visualisation de données",
      "Machine learning",
      "IA générative appliquée",
    ],
  },
];
