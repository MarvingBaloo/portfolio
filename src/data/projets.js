export const projets = [
  {
    slug: "cafe-verde",
    nom: "Café Verdé",
    secteur: "Restauration",
    statut: "En production",
    couleur: "#3f9e5a",
    resume:
      "Caisse et commande en ligne pour un restaurant : du terminal de paiement à l'écran cuisine.",
    accroche:
      "Un système de caisse qui pilote un terminal de paiement physique, sépare les additions, gère la fidélité et sort une comptabilité juste.",
    metriques: [
      { valeur: "35 000", label: "lignes de code" },
      { valeur: "240", label: "commits" },
      { valeur: "4", label: "canaux de vente" },
    ],
    probleme:
      "Le restaurant jonglait entre une caisse incapable de séparer une addition, des commandes en ligne déconnectées de la cuisine, un programme de fidélité tenu à la main et une TVA reconstituée en fin de mois dans un tableur. Chaque canal de vente avait sa propre vérité, et aucune ne se recoupait.",
    solution: [
      "Caisse en trois temps — client, commande, encaissement — avec composition guidée des salades et sélection des plats chauds.",
      "Pilotage server-driven d'un terminal de paiement Stripe Terminal : le montant part du serveur et s'affiche sur le TPE, il n'est jamais ressaisi à la main.",
      "Séparation d'addition : une seule commande en base, un tableau de paiements partiels, chaque part imprimée sur son propre ticket.",
      "Encaissement multi-moyens dans une même transaction — espèces, carte, titres-restaurant, ou combinaison des trois.",
      "Programme de fidélité avec taux de conversion points ⇄ euros centralisé, et validation du solde avant toute écriture.",
      "Temps réel caisse ↔ cuisine par websocket : envoi des tickets, changement de statut, mise en attente découplée de l'envoi en production.",
      "Authentification par SMS à usage unique ou par email, rôles portés par des custom claims qui font autorité côté serveur.",
      "Tickets imprimés au format 80 mm, doublés d'un envoi email et SMS transactionnel.",
    ],
    defis: [
      {
        titre: "Le terminal de paiement piloté par le serveur",
        texte:
          "Faire afficher un montant sur un TPE physique depuis l'application impose de traiter le terminal comme un périphérique distant asynchrone : le serveur crée l'intention de paiement, la pousse au lecteur, puis suit son cycle de vie jusqu'à la confirmation. Aucune saisie manuelle, donc aucune erreur de montant possible.",
      },
      {
        titre: "Une comptabilité qui tombe juste",
        texte:
          "La TVA porte sur des prix affichés TTC, avec des remises qui s'appliquent au panier et non à la ligne. La ventilation se fait au prorata du net encaissé, sous l'invariant somme des HT plus somme des TVA égale net. Le chiffre d'affaires ne compte que les commandes réellement réglées, remboursements déduits.",
      },
      {
        titre: "Un même ticket rendu par trois chemins",
        texte:
          "Le ticket imprimé, l'email de confirmation et le SMS dérivaient silencieusement parce qu'ils construisaient chacun leur panier. Ils partagent désormais un constructeur unique — un correctif appliqué à un endroit se propage aux trois canaux.",
      },
    ],
    stack: [
      "React 19",
      "Vite",
      "Tailwind CSS",
      "Express",
      "Firebase Auth",
      "Firestore",
      "Socket.io",
      "Stripe Terminal",
      "Cloud Run",
      "Vercel",
    ],
    visuels: [
      {
        src: "/screens/cafe-verde/01-caisse-commande.png",
        legende:
          "Caisse — étape de composition : le wizard guide la sélection base, protéine, garniture et sauce, en appliquant les limites propres à chaque formule.",
      },
      {
        src: "/screens/cafe-verde/02-caisse-split.png",
        legende:
          "Séparation d'addition : une commande unique, plusieurs paiements partiels, chacun imprimé sur son propre ticket.",
      },
      {
        src: "/screens/cafe-verde/03-cuisine.png",
        legende:
          "Écran cuisine alimenté en temps réel : la mise en attente d'un ticket est découplée de son envoi en production.",
      },
      {
        src: "/screens/cafe-verde/04-client-mobile.png",
        legende: "Commande en ligne côté client.",
        format: "mobile",
      },
    ],
  },

  {
    slug: "youmoov-flex",
    nom: "Youmoov Flex",
    secteur: "Mobilité",
    statut: "En production",
    couleur: "#3b7dd8",
    resume:
      "Plateforme SaaS multi-tenant de gestion de courses, avec portefeuille interne et dispatch automatique.",
    accroche:
      "Cinq rôles, plusieurs entreprises cloisonnées sur une même base, et de l'argent qui circule entre elles.",
    metriques: [
      { valeur: "6 500", label: "lignes de code" },
      { valeur: "5", label: "rôles distincts" },
      { valeur: "42", label: "commits" },
    ],
    probleme:
      "Des entreprises organisaient le transport de leurs bénéficiaires par téléphone. Aucune trace des courses, aucun suivi de ce qui était dû aux chauffeurs, et une entreprise ne devait évidemment jamais voir les données d'une autre.",
    solution: [
      "Cinq espaces distincts — bénéficiaire, chauffeur, entreprise, sous-responsable, administrateur — avec leurs permissions propres.",
      "Isolation multi-tenant par identifiant de société porté sur l'utilisateur, appliquée sans exception à toute requête non-administrateur.",
      "Dispatch automatique : à la validation d'une demande, tous les chauffeurs éligibles sont notifiés ; le premier qui accepte remporte la course.",
      "Portefeuille interne par utilisateur et registre de retraits séparé pour la traçabilité des versements aux chauffeurs.",
      "Grille tarifaire réglementaire paramétrable — prise en charge, course minimum et quatre tarifs kilométriques selon jour/nuit et aller simple ou aller-retour — assortie d'une marge de service ajustable par l'administrateur.",
      "Cartographie et calcul de distance à vol d'oiseau pour l'estimation du prix.",
      "Notifications avec alerte visuelle au-delà de vingt-quatre heures sans chauffeur, et assignation manuelle de secours.",
    ],
    defis: [
      {
        titre: "Deux chauffeurs, une seule course",
        texte:
          "Le dispatch au premier arrivé est une course critique classique. La résolution passe par une mise à jour conditionnelle atomique : on ne modifie la course que si elle est encore en attente et sans chauffeur. Si le nombre de lignes affectées est nul, c'est qu'un autre a gagné — pas de verrou applicatif, pas de double attribution.",
      },
      {
        titre: "Durcissement des mutations serveur",
        texte:
          "Un audit a révélé trois vulnérabilités critiques : un prix transmis par le client et accepté tel quel, un changement de statut sans vérification d'appartenance, et une création de rôle sans liste blanche. La correction a donné cinq règles désormais appliquées à toute mutation sensible du projet.",
      },
      {
        titre: "Opérations financières atomiques",
        texte:
          "Débiter un portefeuille, créditer un chauffeur et enregistrer la course sont trois écritures qui doivent réussir ou échouer ensemble. Toutes passent par une transaction de base de données — jamais de succès partiel laissant un solde incohérent.",
      },
    ],
    stack: [
      "Next.js 16",
      "Server Actions",
      "React 19",
      "Prisma 7",
      "PostgreSQL",
      "NextAuth v5",
      "Tailwind CSS 4",
      "Leaflet",
      "Vercel",
    ],
    visuels: [
      {
        src: "/screens/youmoov-flex/01-demande-course.png",
        legende:
          "Espace bénéficiaire : suivi cartographique du trajet en cours, budget alloué et demandes en attente. Données de démonstration.",
      },
      {
        src: "/screens/youmoov-flex/02-entreprise-courses.png",
        legende:
          "Espace entreprise : courses en attente d'acceptation, avec l'alerte déclenchée au-delà de vingt-quatre heures sans chauffeur et l'assignation manuelle de secours. Cloisonné par société.",
      },
      {
        src: "/screens/youmoov-flex/03-chauffeur.png",
        legende:
          "Espace chauffeur : les courses disponibles arrivent par notification, la première acceptation remporte la course.",
      },
      {
        src: "/screens/youmoov-flex/04-admin.png",
        legende:
          "Back-office administrateur : grille tarifaire réglementaire et marge de service, avec la ventilation entre part chauffeur et revenu de la plateforme.",
      },
    ],
  },

  {
    slug: "reservation-evenementiel",
    nom: "Plateforme de réservation événementielle",
    secteur: "Événementiel",
    statut: "Livré",
    couleur: "#8b5cf6",
    resume:
      "Réservation et paiement de lieux de réception, du devis en ligne au contrat généré.",
    accroche:
      "Un tunnel complet : disponibilités, options, acompte, contrat PDF et tableau de bord propriétaire.",
    metriques: [
      { valeur: "9 300", label: "lignes de code" },
      { valeur: "52", label: "commits" },
      { valeur: "9", label: "modèles de données" },
    ],
    probleme:
      "Les réservations arrivaient par email et par téléphone. Les disponibilités vivaient dans un agenda partagé, les acomptes dans un tableur, les contrats étaient retapés à chaque fois. Le risque de double réservation était permanent et le suivi commercial inexistant.",
    solution: [
      "Catalogue de lieux avec options tarifées configurables.",
      "Calendrier de disponibilités et dates bloquées manuellement, source de vérité unique côté serveur.",
      "Réservation en ligne avec encaissement d'acompte et suivi du solde restant dû.",
      "Génération automatique des contrats et documents en PDF, regroupés en archive téléchargeable.",
      "Emails transactionnels à chaque étape — demande, confirmation, rappel d'échéance.",
      "Tableau de bord propriétaire avec indicateurs graphiques du remplissage et du chiffre d'affaires.",
      "Journal d'activité horodaté sur les actions sensibles, pour retracer qui a modifié quoi.",
    ],
    defis: [
      {
        titre: "Garantir l'absence de double réservation",
        texte:
          "Une disponibilité affichée n'est pas une disponibilité réservée. La vérification est refaite côté serveur au moment de l'encaissement, contre les réservations confirmées et les dates bloquées, jamais contre l'état lu par le navigateur quelques minutes plus tôt.",
      },
      {
        titre: "Le document comme livrable",
        texte:
          "Le contrat n'est pas un rendu HTML imprimé : c'est un PDF généré côté serveur à partir des données de la réservation, avec tableau récapitulatif des options. Il est archivé, versionné dans le journal d'activité, et rejoignable depuis l'espace client.",
      },
      {
        titre: "Traçabilité",
        texte:
          "Sur un flux qui engage contractuellement, savoir qui a annulé, qui a modifié un montant et à quel moment n'est pas optionnel. Chaque action sensible écrit une entrée immuable, ce qui a permis de trancher des litiges de planning sans discussion.",
      },
    ],
    stack: [
      "Next.js 16",
      "Prisma",
      "PostgreSQL",
      "Supabase",
      "Stripe",
      "jsPDF",
      "Resend",
      "Recharts",
      "Tailwind CSS 4",
    ],
    visuels: [
      {
        src: "/screens/reservation-evenementiel/01-calendrier.png",
        legende:
          "Calendrier de disponibilités : réservations confirmées et dates bloquées manuellement, revérifiées côté serveur au moment de l'encaissement.",
      },
      {
        src: "/screens/reservation-evenementiel/02-dashboard.png",
        legende:
          "Tableau de bord propriétaire : remplissage et chiffre d'affaires, adossés à un journal d'activité horodaté.",
      },
    ],
  },

  {
    slug: "serveur-mcp",
    nom: "Serveur MCP d'infrastructure",
    secteur: "Outillage IA",
    statut: "En production",
    couleur: "#d97a1f",
    resume:
      "64 outils exposés à un assistant IA pour piloter une infrastructure auto-hébergée, avec validation humaine des actions sensibles.",
    accroche:
      "Donner des mains à un agent sur de l'infrastructure réelle — et lui poser des garde-fous.",
    metriques: [
      { valeur: "5 780", label: "lignes de code" },
      { valeur: "64", label: "outils MCP" },
      { valeur: "12", label: "états de diagnostic" },
    ],
    probleme:
      "Quatre services auto-hébergés exposent chacun leur API, et leurs états se contredisent : l'un annonce un échec, l'autre un blocage à l'import, et seul un troisième sait qu'une ressource ne sera jamais retentée. Aucun ne répond seul à la question « est-ce que ça fonctionne vraiment ? ». Brancher un agent IA là-dessus demandait deux choses : une couche de corrélation, et un frein.",
    solution: [
      "Soixante-quatre outils MCP typés, exposés en transport HTTP authentifié par jeton.",
      "Moteur de diagnostic rendant un verdict unique parmi douze états, obtenu en croisant quatre sources, accompagné de ses preuves et des actions possibles.",
      "Validation humaine des actions sensibles : l'agent demande l'autorisation, la requête est poussée au navigateur en flux serveur, l'utilisateur tranche, avec expiration à trois minutes et sessions isolées.",
      "Cache mensuel persistant, préchauffage automatique et revalidation sélective — conçu autour d'un quota d'API tiers de mille appels par jour.",
      "Dégradation gracieuse : la panne d'un service annexe ne coûte que la donnée qu'il fournit, jamais la réponse entière.",
      "Tableau de bord web en JavaScript sans framework, alimenté par le même flux serveur.",
      "Conteneurisation avec sonde de santé HTTP et assistant en ligne de commande embarqué, authentifié par abonnement plutôt que par clé facturée.",
    ],
    defis: [
      {
        titre: "Corréler des sources qui se contredisent",
        texte:
          "Le cœur du projet n'est pas l'exposition d'API, c'est la modélisation. Répondre honnêtement à « est-ce que ça descend ? » exige d'interroger quatre services, de comprendre pourquoi aucun ne suffit, et de rendre un état unique et défendable. Douze états typés, chacun avec ses preuves et ses remédiations.",
      },
      {
        titre: "Sécurité agentique : l'humain dans la boucle",
        texte:
          "Un agent autonome sur de l'infrastructure a besoin d'un frein explicite. Les outils hors liste autorisée déclenchent une demande d'approbation transmise en temps réel à l'interface ; l'appel reste suspendu jusqu'au clic ou à l'expiration. C'est le garde-fou qui rend l'automatisation acceptable.",
      },
      {
        titre: "Concevoir sous contrainte de quota",
        texte:
          "Une API tierce limitée à mille appels quotidiens interdit de recalculer naïvement. Le cache est mensuel, persisté sur volume monté pour survivre aux reconstructions du conteneur, préchauffé en tâche de fond, et ne revalide que ce qui bouge réellement.",
      },
    ],
    stack: [
      "Python 3.13",
      "FastMCP",
      "httpx",
      "Pydantic",
      "Starlette",
      "SQLite",
      "Docker",
      "Server-Sent Events",
    ],
    visuels: [
      {
        src: "/screens/serveur-mcp/02-validation.png",
        legende:
          "Validation humaine : l'agent réclame une action hors liste autorisée, l'appel reste suspendu jusqu'à l'arbitrage de l'utilisateur ou son expiration.",
      },
      {
        src: "/screens/serveur-mcp/01-dashboard.png",
        legende:
          "Moteur de diagnostic : chaque téléchargement reçoit un état unique — bloqué, abandonné, import impossible — assorti de sa cause et de la correction applicable. Libellés anonymisés.",
      },
    ],
  },
];

export function getProjet(slug) {
  return projets.find((p) => p.slug === slug);
}
