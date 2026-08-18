export const projets = [
  {
    slug: "cafe-verde",
    nom: "Café Verdé",
    secteur: "Restauration",
    statut: "En production",
    couleur: "#3f9e5a",
    resume:
      "Six applications sur une même base : boutique en ligne, caisse, écran cuisine, espace gérant, comptabilité et espace développeur.",
    accroche:
      "Tout ce dont un restaurant a besoin pour fonctionner une journée — du client qui compose sa salade sur son téléphone à la TVA du soir — écrit d'un seul tenant.",
    role: "Conception, développement et mise en production — seul.",
    perimetre:
      "36 000 lignes, une seule main. Le restaurant tourne dessus tous les jours de service. J'ai conçu et écrit l'intégralité : les douze collections de la base, l'API et ses dix validateurs, les six applications qui s'y branchent, la couche d'analytique, la conformité RGPD, puis la conteneurisation, le déploiement et l'exploitation. C'est moi qu'on appelle quand la caisse ne prend plus la carte un samedi midi.",
    metriques: [
      { valeur: "36 000", label: "lignes de code" },
      { valeur: "269", label: "commits" },
      { valeur: "6", label: "applications" },
    ],
    libelleContexte: "La demande",
    probleme:
      "Il n'y avait pas de système à réparer. Le client voulait un site complet, où tout se trouve au même endroit : commander en ligne, encaisser, envoyer en cuisine, tenir la fidélité, sortir la TVA — une seule application plutôt qu'un assemblage d'outils. Le projet est né comme un configurateur de salades et de bubble teas, puis a pris le périmètre entier du restaurant : plats chauds, petits déjeuners, goûters, caisse, comptabilité. La difficulté n'était donc pas de résoudre un problème existant, c'était de tenir cette centralisation à mesure qu'elle grandissait, sans laisser les six applications diverger les unes des autres.",
    solution: [
      "Boutique client : vitrine, carte organisée en arbre de catégories à profondeur libre, page de plat avec accompagnements et menu, panier, paiement carte avec 3-D Secure, ou règlement sur place.",
      "Configurateur de salade guidé par les limites de la formule, avec construction visuelle en direct, compteur de calories, suggestions de composition, retour haptique, et annulation-rétablissement des vingt derniers gestes.",
      "Espace client : suivi de commande en temps réel, historique, points de fidélité, création ou changement de mot de passe, envoi du ticket par email ou SMS.",
      "Conformité RGPD écrite dans le code : le client exporte lui-même ses données et supprime son compte, y compris son identité chez le fournisseur d'authentification.",
      "Caisse : parcours en trois temps, composition guidée de tous les articles, tickets ouverts mis de côté sans partir en cuisine, remise commerciale, points, quatre moyens de paiement combinables, et séparation d'addition en parts égales, à montant libre ou par article.",
      "Terminal de paiement Stripe piloté depuis le serveur : le montant part de l'application et s'affiche sur le lecteur, il n'est jamais ressaisi.",
      "Écran cuisine alimenté par websocket : minuteur et alerte de retard par ticket, regroupement des articles identiques, séparation des commandes en ligne et sur place, mise en attente découplée de l'envoi en production.",
      "Espace gérant : neuf onglets de catalogue — ingrédients, formules, menus, plats, produits, arbre de catégories, bubble teas, milkshakes — chacun avec recherche, tri, pagination, deux modes d'affichage, images compressées automatiquement et réorganisation par glisser-déposer.",
      "Espace finance : chiffre d'affaires net des remboursements, réconciliation du brut au net, ventilation TVA, répartition par moyen de paiement et par type, pourboires du terminal reconstitués depuis Stripe, export CSV, impression — le tout rechargé en temps réel.",
      "Moteur de TVA configurable : deux taux sur place et à emporter, surchargeables par produit ou par catégorie et hérités en remontant l'arbre, ventilés au prorata du net encaissé.",
      "Analytique comportementale maison : entonnoir de conversion, taux d'abandon, carte de chaleur des clics, profondeur de défilement, appareils, ingrédients les plus manipulés, visiteurs actifs, et flux d'activité en direct.",
      "Espace développeur : gestion de comptes de tous rôles, sauvegarde et restauration non destructive, et récupération d'un paiement resté autorisé chez Stripe.",
      "Authentification par SMS à usage unique ou par email, rôles portés par des revendications signées faisant autorité côté serveur, et un rôle développeur invisible des listes, des promotions et des statistiques.",
      "Ticket rendu à l'identique par quatre canaux : impression 80 mm, email, SMS et modale d'historique — avec pour chacun une variante sans le détail des articles.",
    ],
    defis: [
      {
        titre: "Un refus de carte n'est pas un échec de paiement",
        texte:
          "Le terminal redemande la carte avec saisie du code après un sans-contact refusé — un incident banal, fréquent par cumul de paiements. Ma boucle sortait sur cette erreur : écran d'échec, lecteur bloqué, et une autorisation orpheline à capturer à la main dans Stripe. J'ai reconstruit le suivi autour d'une règle — seul l'état du lecteur fait foi — puis traduit les dix-sept codes de refus en consignes pour la caissière, en les indexant sur le code et jamais sur le message, qui peut être reformulé par Stripe. Elle sait maintenant s'il faut attendre ou proposer un autre moyen. J'ai enfin fermé le trou restant : un paiement resté autorisé se retrouve, se capture et se reconstruit en commande depuis l'espace développeur.",
      },
      {
        titre: "Une part d'addition qui se ré-ouvre",
        texte:
          "Séparer une addition n'est pas répartir un total : quelqu'un commande un café après avoir payé. J'ai donc modélisé une part non comme « payée ou non » mais comme un dû assorti de l'historique de ses règlements. Un article attribué après coup rouvre la part, un article partagé se répartit sur toutes en gardant la trace de chaque quote-part, et chaque convive peut porter son propre client et ses propres points. À la validation, les règlements multiples d'une même part sont aplatis en autant d'écritures — la comptabilité, la fidélité par client et les remboursements Stripe n'ont ainsi rien à connaître de cette complexité.",
      },
      {
        titre: "Une TVA qui tombe juste au centime",
        texte:
          "Les prix sont affichés TTC, les remises portent sur le panier et non sur la ligne, et le taux peut être forcé sur un produit ou hérité d'une catégorie parente en remontant l'arbre. Je ventile au prorata du net encaissé, taux par taux, sous un invariant que je tiens : la somme des HT plus la somme des TVA égale exactement ce qui a été payé. Une commande antérieure à la mise en place de la TVA est recomposée à la volée depuis le catalogue actuel, et toutes les bornes de période sont ancrées au fuseau de la Guadeloupe — sans quoi la période glissait d'un jour en production.",
      },
      {
        titre: "Six applications, une seule vérité",
        texte:
          "Un article n'a pas la même forme selon qu'il arrive de la caisse ou de la boutique, et le même ticket doit se rendre à l'imprimante, en email, en SMS et dans l'historique. Chaque fois que j'ai laissé un chemin reconstruire sa propre version des données, elle a dérivé en silence — jamais avec une erreur, toujours avec un chiffre faux. J'en ai fait une règle : un constructeur unique par objet métier, et toute évolution se propage à tous les rendus ou elle n'est pas livrée.",
      },
      {
        titre: "Faire entendre une commande dans le bruit du service",
        texte:
          "Une commande arrivée du site doit s'entendre depuis la cuisine. Plutôt qu'embarquer un fichier son, je génère l'alarme en JavaScript : trois bips deux-tons en onde carrée, encodés à la main dans un fichier WAV, avec un fondu de cinq millisecondes qui supprime le claquement de début. La salve se répète toutes les dix secondes jusqu'à ce que la cuisine prenne la commande en charge, l'acquittement survit à un rechargement de page, et si le navigateur refuse de jouer le son, un diagnostic explique quoi faire plutôt que de laisser croire au silence.",
      },
      {
        titre: "Mesurer sans monter une usine",
        texte:
          "Je voulais l'entonnoir de conversion, le taux d'abandon et une carte de chaleur des clics sans service d'analytique tiers ni index composite à créer à la main pour chaque nouvelle question. J'ai posé la limite franchement : une seule requête filtrée sur le temps, toutes les agrégations en mémoire, et j'ai écrit dans le code le seuil au-delà duquel ce choix ne tient plus. Une décision bornée et documentée vaut mieux qu'une architecture prématurée.",
      },
    ],
    stack: [
      "React 19",
      "Vite",
      "Tailwind CSS",
      "Framer Motion",
      "Express",
      "Firebase Auth",
      "Firestore",
      "Firebase Storage",
      "Socket.io",
      "Stripe Terminal",
      "Brevo",
      "Docker",
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
      "Plateforme SaaS multi-tenant de transport d'entreprise : tarif réglementaire, dispatch automatique et portefeuille interne.",
    accroche:
      "Cinq rôles, plusieurs entreprises cloisonnées sur une même base, un tarif encadré par arrêté préfectoral, et de l'argent qui circule entre elles.",
    role: "Conception, développement et mise en production — seul.",
    perimetre:
      "Plateforme écrite seul de bout en bout : schéma de base, authentification, cinq espaces applicatifs, cloisonnement multi-tenant, moteur tarifaire réglementaire, planification des aller-retour, dispatch, portefeuille et retraits, cartographie temps réel, audit de sécurité et déploiement. Aucune ligne ne vient de quelqu'un d'autre.",
    metriques: [
      { valeur: "7 700", label: "lignes de code" },
      { valeur: "5", label: "rôles distincts" },
      { valeur: "43", label: "commits" },
    ],
    libelleContexte: "La demande",
    probleme:
      "Le client voulait un SaaS pour gérer la réservation des courses de ses bénéficiaires. Pas un outil interne : une plateforme où plusieurs entreprises coexistent sans jamais se voir, chacune avec ses bénéficiaires, ses chauffeurs et son budget. Trois exigences en découlaient dès le départ — un cloisonnement strict entre entreprises, un tarif conforme à l'arrêté préfectoral plutôt que fixé librement, et un circuit financier interne pour reverser aux chauffeurs ce qui leur revient.",
    solution: [
      "Cinq espaces distincts — bénéficiaire, chauffeur, entreprise, sous-responsable, administrateur — avec leurs permissions propres.",
      "Isolation multi-tenant par identifiant de société porté sur l'utilisateur, appliquée sans exception à toute requête non-administrateur.",
      "Grille tarifaire réglementaire paramétrable : prise en charge, course minimum et quatre tarifs kilométriques selon jour ou nuit et retour en charge ou à vide, avec calcul des jours fériés — Pâques comprise — et marge de service ajustable par l'administrateur.",
      "Réservation en aller-retour ou en aller simple, le retour créé automatiquement deux heures après l'aller, chaque trajet portant son propre tarif si le second bascule en horaire majoré.",
      "Planning des chauffeurs par fenêtre d'immobilisation, avec limite quotidienne d'aller-retour et garde-fou unique partagé par l'acceptation volontaire et l'assignation imposée.",
      "Préavis de réservation de deux jours ouvrés, week-ends et jours fériés fermés, contrôlés côté serveur et pas seulement dans le sélecteur de dates.",
      "Dispatch automatique : à la validation d'une demande, tous les chauffeurs éligibles sont notifiés ; le premier qui accepte remporte la course.",
      "Demande d'inscription séparée du compte : tant que l'entreprise n'a pas validé, aucun utilisateur n'existe en base et rien ne peut se connecter.",
      "Portefeuille interne par utilisateur et registre de retraits séparé pour la traçabilité des versements aux chauffeurs.",
      "Suivi cartographique du trajet en cours et position du chauffeur remontée en continu.",
      "Alerte au-delà de vingt-quatre heures sans chauffeur, déclenchée par une tâche planifiée, avec assignation manuelle de secours.",
    ],
    defis: [
      {
        titre: "Deux chauffeurs, une seule course",
        texte:
          "Le dispatch au premier arrivé est une course critique classique. Je l'ai résolue par une mise à jour conditionnelle atomique : je ne modifie la course que si elle est encore en attente et sans chauffeur. Si le nombre de lignes affectées est nul, c'est qu'un autre a gagné. Pas de verrou applicatif, pas de double attribution.",
      },
      {
        titre: "Un tarif qu'on ne choisit pas",
        texte:
          "Le prix n'est pas une décision commerciale, c'est un arrêté : prise en charge, course minimum, et quatre tarifs kilométriques selon l'heure, le jour et la nature du retour. J'ai sorti la grille du code pour la rendre modifiable quand l'arrêté change, gardé des valeurs de repli, et calculé les jours fériés mobiles plutôt que de les tenir dans une liste qui se périme chaque année. La marge de la plateforme s'ajoute par-dessus, séparée du tarif réglementaire jusque dans le schéma de base.",
      },
      {
        titre: "Une course qui immobilise une journée",
        texte:
          "Un aller-retour n'occupe pas le chauffeur deux fois vingt minutes : il le bloque de l'heure qui précède l'aller aux trois heures qui suivent le retour, parce qu'un rendez-vous déborde. J'ai persisté cette fenêtre sur la course et indexé la table dessus, ce qui ramène la détection de conflit à une seule requête — la même pour le chauffeur qui accepte et pour l'entreprise qui impose, afin qu'aucun des deux chemins ne contourne la règle.",
      },
      {
        titre: "Durcissement de mes propres mutations serveur",
        texte:
          "En auditant mon code, j'ai trouvé trois failles critiques que j'avais laissées passer : un prix transmis par le navigateur et accepté tel quel, un changement de statut sans vérifier que la course appartenait bien à l'appelant, et une création de rôle sans liste blanche. Je les ai corrigées, puis converties en cinq règles que j'applique désormais par défaut à toute mutation sensible plutôt que de les redécouvrir projet après projet.",
      },
    ],
    stack: [
      "Next.js 16",
      "Server Actions",
      "React 19",
      "Prisma 7",
      "PostgreSQL",
      "Neon",
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
    nom: "Réservation événementielle",
    secteur: "Collectivité",
    statut: "Livré",
    couleur: "#8b5cf6",
    resume:
      "Réservation en ligne des salles de réception d'une commune : disponibilités, dossier, paiement échelonné et validation par la mairie.",
    accroche:
      "Un dossier de mariage qui vivait dans un agenda papier, un tableur et une boîte mail, ramené à un tunnel unique.",
    role: "Conception, développement et mise en production — seul.",
    perimetre:
      "Application écrite seul de bout en bout : neuf modèles de données, authentification maison avec vérification d'email et réinitialisation de mot de passe, tunnel de réservation, paiements échelonnés, dépôt et distribution sécurisée des pièces justificatives, contrats en PDF, emails transactionnels, back-office de la mairie et mise en ligne. Aucune ligne ne vient de quelqu'un d'autre.",
    metriques: [
      { valeur: "9 400", label: "lignes de code" },
      { valeur: "52", label: "commits" },
      { valeur: "9", label: "modèles de données" },
    ],
    probleme:
      "Les demandes arrivaient par email et par téléphone. Les disponibilités vivaient dans un agenda partagé, les acomptes dans un tableur, les pièces justificatives dans des pièces jointes, et les contrats étaient retapés à chaque dossier. Le risque de double réservation était permanent, et personne ne pouvait dire qui avait validé quoi.",
    solution: [
      "Catalogue des salles avec options tarifées, et calendrier des disponibilités croisant les réservations en cours et les dates fermées manuellement par la mairie.",
      "Réservation en ligne avec acompte à la demande, puis paiements partiels et solde suivis dans un historique par dossier.",
      "Dépôt des pièces justificatives par le demandeur, stockées hors du serveur applicatif et redistribuées uniquement par lien signé à durée courte.",
      "Modification d'un dossier existant avec règlement du différentiel avant validation.",
      "Génération des contrats et documents en PDF, regroupés en archive téléchargeable pour l'agent qui instruit le dossier.",
      "Authentification maison : session signée en cookie, vérification d'adresse email par lien, réinitialisation de mot de passe à jeton expirant.",
      "Quatre rôles — demandeur, agent, administrateur, administrateur mairie — et protection des espaces par middleware.",
      "Emails transactionnels à chaque étape : acompte reçu, dossier validé, dossier refusé.",
      "Formulaire de contact protégé du spam par limitation à l'adresse IP.",
      "Tableau de bord avec indicateurs graphiques du remplissage et du chiffre d'affaires, et export des données.",
      "Journal horodaté, avec adresse IP, sur les suppressions et les modifications de compte.",
    ],
    defis: [
      {
        titre: "Une disponibilité affichée n'est pas une disponibilité réservée",
        texte:
          "Le calendrier vu par le navigateur date d'il y a quelques minutes, et deux familles peuvent viser la même date le même soir. Je refais donc la vérification côté serveur au moment de créer le dossier, contre les réservations non refusées et les dates fermées par la mairie, et je refuse la demande plutôt que de la laisser passer. Le calendrier oriente, il ne décide pas.",
      },
      {
        titre: "Des pièces d'identité qui ne doivent pas traîner sur un serveur web",
        texte:
          "Un dossier de mariage contient des papiers d'identité. Je ne les sers jamais depuis un dossier public : ils vivent dans un stockage privé, et chaque consultation passe par une route qui régénère un lien signé valable soixante secondes. Un lien recopié dans un email ou resté dans un historique de navigation ne vaut plus rien une minute plus tard.",
      },
      {
        titre: "Un contrat, pas une page imprimée",
        texte:
          "Je n'ai pas voulu d'un rendu HTML envoyé à l'imprimante. Le contrat est un PDF que je génère à partir des données du dossier, avec le récapitulatif des options retenues, et que l'agent récupère groupé en archive avec les pièces justificatives — un dossier complet en un téléchargement.",
      },
      {
        titre: "Un calendrier qui connaît ses jours fériés",
        texte:
          "Une commune ne marie pas un jour férié, et la liste n'est pas celle de la métropole : le 27 mai, jour de l'abolition de l'esclavage, en fait partie. La règle est appliquée à la création du dossier, pas seulement grisée dans le sélecteur de dates — une règle de fermeture qui ne vit que dans l'interface n'est pas une règle.",
      },
    ],
    stack: [
      "Next.js 16",
      "React 19",
      "Prisma",
      "PostgreSQL",
      "Supabase Storage",
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
      "76 outils exposés à un assistant IA pour piloter une infrastructure auto-hébergée, avec validation humaine des actions sensibles.",
    accroche:
      "Donner des mains à un agent sur de l'infrastructure réelle — et lui poser des garde-fous.",
    role: "Conception, développement et mise en production — seul.",
    perimetre:
      "Serveur écrit seul de bout en bout : les huit clients d'API tierces, les 76 outils exposés au modèle, le moteur de diagnostic, la couche d'approbation humaine, le suivi post-action, la stratégie de cache, le tableau de bord web, la conteneurisation et l'exploitation sur NAS. Aucune ligne ne vient de quelqu'un d'autre, et je le fais tourner en continu chez moi : c'est mon banc d'essai sur la sécurité agentique.",
    metriques: [
      { valeur: "6 345", label: "lignes de code" },
      { valeur: "76", label: "outils MCP" },
      { valeur: "12", label: "états de diagnostic" },
    ],
    probleme:
      "Huit services auto-hébergés exposent chacun leur API, et leurs états se contredisent : l'un annonce un échec, l'autre un blocage à l'import, et seul un troisième sait qu'une ressource ne sera jamais retentée. Aucun ne répond seul à la question « est-ce que ça fonctionne vraiment ? ». Brancher un agent IA là-dessus demandait deux choses : une couche de corrélation, et un frein.",
    solution: [
      "Soixante-seize outils typés, exposés en protocole MCP sur un transport HTTP authentifié par jeton.",
      "Un processus unique servant quatre surfaces sur un seul port : le protocole MCP, un second serveur MCP dédié aux approbations, une API REST et un tableau de bord web.",
      "Moteur de diagnostic rendant un verdict unique parmi douze états, obtenu en croisant quatre sources, accompagné de ses preuves et des actions possibles.",
      "Validation humaine des actions sensibles : l'agent demande l'autorisation, la requête est poussée au navigateur en flux serveur, l'utilisateur tranche, avec expiration et sessions isolées par onglet.",
      "Suivi autonome après action : un état persisté par téléchargement, rediagnostiqué à intervalles croissants, avec corrections appliquées sans demander la permission puisqu'il n'y a plus personne à qui demander.",
      "Projections qui réduisent les charges utiles avant de les rendre au modèle, sous un contrat borné qui garde le décompte total sans rapatrier la liste.",
      "Cache mensuel persistant à clé versionnée, préchauffage des douze mois glissants et revalidation sélective — conçu autour d'un quota d'API tierce de mille appels par jour.",
      "Tableau de bord en JavaScript sans framework : grille d'affiches, fiche détaillée, recherche catalogue, navigation clavier avec piège de focus.",
      "Dégradation asymétrique : la panne d'un service annexe appauvrit la réponse sans jamais la fausser, mais un outil dédié à ce service lève une erreur explicite.",
      "Conteneurisation avec sonde de santé et assistant en ligne de commande embarqué, authentifié par abonnement plutôt que par clé facturée.",
    ],
    defis: [
      {
        titre: "Corréler des sources qui se contredisent",
        texte:
          "Le cœur du projet n'est pas l'exposition d'API, c'est la modélisation. Pour répondre honnêtement à « est-ce que ça avance ? », j'ai dû interroger quatre services, comprendre pourquoi aucun ne suffit seul, et rendre un état unique et défendable. J'ai défini douze états typés, chacun avec ses preuves et ses remédiations, et j'ai fait cette corrélation une fois pour toutes plutôt que de la laisser au modèle.",
      },
      {
        titre: "Sécurité agentique : l'humain dans la boucle",
        texte:
          "Un agent autonome sur de l'infrastructure a besoin d'un frein explicite. Seuls les outils d'une liste sûre s'exécutent directement ; tout le reste déclenche une demande d'approbation poussée en temps réel à l'interface, et l'appel reste suspendu jusqu'au clic ou à l'expiration. C'est le garde-fou qui rend l'automatisation acceptable — et il m'a coûté de comprendre qu'un refus mal formé était silencieusement converti en erreur technique, donc en action bloquée sans que personne le sache.",
      },
      {
        titre: "Un seuil qui échoue sans rien dire",
        texte:
          "Certains réglages de qualité cherchaient un fichier meilleur que tout ce qu'ils savaient reconnaître — indéfiniment, sans le moindre avertissement. J'ai remplacé la lecture à l'œil par deux inégalités calculées depuis l'API : le seuil visé doit rester atteignable, le seuil d'exclusion doit être strictement supérieur à la pénalité qu'il prétend écarter. Onze réglages sur dix-sept étaient fautifs, dont les deux qui portaient les quatre cinquièmes du parc.",
      },
      {
        titre: "Vérifier une jointure sur tout le corpus, pas sur un exemple",
        texte:
          "Rapprocher deux catalogues qui ne partagent aucun identifiant se fait par replis successifs — et un repli trop permissif déclarait des épisodes vus à tort. J'en ai tiré une règle : un repli ne relâche qu'une contrainte, il en conserve toujours une discriminante. Et je ne valide plus une jointure sur un échantillon : je compare le compteur agrégé au décompte détaillé sur l'ensemble du corpus, puis j'explique chaque écart restant au lieu de l'arrondir.",
      },
      {
        titre: "Concevoir sous contrainte de quota",
        texte:
          "Une API tierce limitée à mille appels quotidiens interdit de recalculer naïvement. J'ai découpé le cache au mois, persisté sur volume monté pour survivre aux reconstructions du conteneur, préchauffé en tâche de fond, et je ne revalide que ce qui bouge encore. La clé est versionnée : un mois clos étant mis en cache sans expiration, un changement de format ne l'aurait jamais atteint.",
      },
    ],
    stack: [
      "Python 3.13",
      "FastMCP",
      "Starlette",
      "httpx",
      "Pydantic",
      "SQLite",
      "Server-Sent Events",
      "Docker",
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
