// Données de démonstration pour la base de connaissances

export const mockInstructions = [
    {
      id: "inst-1",
      title: "Se connecter au WiFi",
      description: "Instructions pour se connecter au réseau WiFi de l'appartement",
      category: "wifi",
      steps: [
        "Recherchez le réseau 'Appartement-Centrum' dans la liste des réseaux disponibles",
        "Entrez le mot de passe 'Paris2024!'",
        "Votre appareil devrait se connecter automatiquement lors de vos prochaines visites",
        "En cas de problème de connexion, redémarrez la box internet en la débranchant pendant 10 secondes"
      ],
      tags: ["wifi", "internet", "box", "connexion", "réseau"],
      photos: [
        { 
          url: "/api/placeholder/800/600", 
          alt: "Box internet",
          caption: "Box internet située dans le salon" 
        }
      ],
      relatedInstructions: [
        { id: "inst-8", title: "Utiliser la smart TV" }
      ],
      status: "complete",
      updatedAt: "2024-03-01T12:00:00Z"
    },
    {
      id: "inst-2",
      title: "Utiliser le lave-vaisselle",
      description: "Comment faire fonctionner le lave-vaisselle et quels programmes utiliser",
      category: "appliance",
      steps: [
        "Ouvrez la porte et rangez la vaisselle selon les compartiments",
        "Ajoutez une pastille dans le compartiment prévu à cet effet (porte intérieure droite)",
        "Fermez la porte et sélectionnez le programme souhaité avec le bouton en haut à droite",
        "Le programme ECO est recommandé pour la plupart des lavages",
        "Appuyez sur le bouton de démarrage (bouton vert)"
      ],
      tags: ["électroménager", "cuisine", "lave-vaisselle", "vaisselle"],
      photos: [
        { 
          url: "/api/placeholder/800/600", 
          alt: "Lave-vaisselle", 
          caption: "Lave-vaisselle Bosch intégré" 
        },
        { 
          url: "/api/placeholder/800/600", 
          alt: "Compartiment pastille", 
          caption: "Emplacement pour la pastille de lavage" 
        }
      ],
      status: "complete",
      updatedAt: "2024-02-15T14:30:00Z"
    },
    {
      id: "inst-3",
      title: "Régler le chauffage",
      description: "Comment régler la température du chauffage dans chaque pièce",
      category: "utilities",
      steps: [
        "Chaque pièce dispose d'un thermostat numérique sur le radiateur",
        "Appuyez sur les boutons + ou - pour ajuster la température",
        "La température recommandée est de 20°C dans les pièces de vie et 18°C dans les chambres",
        "Le chauffage se met en veille automatiquement si les fenêtres sont ouvertes",
        "En cas de dysfonctionnement, contactez le propriétaire"
      ],
      tags: ["chauffage", "température", "radiateur", "thermostat"],
      photos: [
        { 
          url: "/api/placeholder/800/600", 
          alt: "Thermostat", 
          caption: "Exemple de thermostat de radiateur" 
        }
      ],
      status: "incomplete",
      updatedAt: "2024-01-20T10:15:00Z"
    },
    {
      id: "inst-4",
      title: "Utiliser la machine à laver",
      description: "Instructions pour l'utilisation de la machine à laver",
      category: "appliance",
      steps: [
        "Ouvrez la porte et chargez le linge sans surcharger le tambour",
        "Ajoutez la lessive dans le compartiment gauche du tiroir",
        "L'adoucissant va dans le compartiment droit (facultatif)",
        "Sélectionnez le programme approprié : coton 40° pour les vêtements normaux, délicat pour le linge fragile",
        "Appuyez sur le bouton 'Départ' pour lancer le cycle"
      ],
      tags: ["électroménager", "machine à laver", "lessive", "linge"],
      photos: [
        { 
          url: "/api/placeholder/800/600", 
          alt: "Machine à laver",
          caption: "Machine à laver Samsung dans la salle de bain" 
        },
        { 
          url: "/api/placeholder/800/600", 
          alt: "Tiroir à lessive",
          caption: "Positionnement de la lessive et de l'adoucissant" 
        }
      ],
      status: "complete",
      updatedAt: "2024-02-10T09:00:00Z"
    },
    {
      id: "inst-5",
      title: "Tri des déchets",
      description: "Consignes pour le tri sélectif et l'élimination des déchets",
      category: "rules",
      steps: [
        "Poubelle jaune : tous les emballages plastiques, métalliques et cartons",
        "Poubelle verte : verre (bouteilles, bocaux, etc.)",
        "Poubelle grise : déchets non recyclables",
        "Sortez les poubelles les mardis et vendredis soir",
        "Les encombrants doivent être déposés à la déchetterie municipale (adresse dans le livret d'accueil)"
      ],
      tags: ["poubelles", "tri", "recyclage", "déchets", "règles"],
      status: "complete",
      updatedAt: "2024-02-25T16:45:00Z"
    },
    {
      id: "inst-6",
      title: "Accès à la terrasse",
      description: "Règles d'utilisation de la terrasse commune sur le toit",
      category: "rules",
      steps: [
        "La terrasse est accessible de 9h à 22h tous les jours",
        "Utilisez votre clé d'appartement pour y accéder (porte au dernier étage)",
        "Respectez la tranquillité des autres résidents",
        "Aucun bruit après 21h",
        "Remportez vos déchets et nettoyez après votre passage"
      ],
      tags: ["terrasse", "commun", "règles", "accès", "toit"],
      photos: [
        { 
          url: "/api/placeholder/800/600", 
          alt: "Terrasse",
          caption: "Vue de la terrasse commune au dernier étage" 
        }
      ],
      status: "complete",
      updatedAt: "2023-12-12T11:30:00Z"
    },
    {
      id: "inst-7",
      title: "Que faire en cas de panne d'électricité",
      description: "Procédure à suivre en cas de coupure de courant",
      category: "emergency",
      steps: [
        "Vérifiez si la panne concerne tout l'immeuble ou seulement votre appartement",
        "Vérifiez le tableau électrique dans l'entrée et réarmez les disjoncteurs si nécessaire",
        "Si le problème persiste, contactez le gestionnaire de l'immeuble au 01 23 45 67 89",
        "En cas d'urgence électrique, appelez le service d'urgence au 09 72 67 50 XX"
      ],
      tags: ["électricité", "panne", "urgence", "disjoncteur"],
      photos: [
        { 
          url: "/api/placeholder/800/600", 
          alt: "Tableau électrique",
          caption: "Tableau électrique situé dans l'entrée" 
        }
      ],
      status: "complete",
      updatedAt: "2024-01-05T08:20:00Z"
    },
    {
      id: "inst-8",
      title: "Utiliser la smart TV",
      description: "Comment utiliser la télévision connectée et accéder aux applications",
      category: "entertainment",
      steps: [
        "Allumez la TV avec la télécommande principale (bouton rouge)",
        "Pour accéder aux chaînes TV, utilisez la télécommande du décodeur Orange",
        "Pour Netflix, Disney+ et autres applications, appuyez sur le bouton 'Home' de la télécommande TV",
        "Sélectionnez l'application souhaitée avec les flèches de navigation",
        "Vous pouvez diffuser du contenu depuis votre smartphone via Chromecast"
      ],
      tags: ["TV", "télévision", "Netflix", "streaming", "applications"],
      photos: [
        { 
          url: "/api/placeholder/800/600", 
          alt: "Smart TV",
          caption: "Télévision Samsung et décodeur Orange" 
        }
      ],
      relatedInstructions: [
        { id: "inst-1", title: "Se connecter au WiFi" }
      ],
      status: "complete",
      updatedAt: "2024-02-20T15:40:00Z"
    },
    {
      id: "inst-9",
      title: "Utiliser la douche italienne",
      description: "Fonctionnement de la douche à l'italienne et réglage de la température",
      category: "bathroom",
      steps: [
        "Tournez le bouton gauche pour régler la température (rouge = chaud, bleu = froid)",
        "Tournez le bouton droit pour régler le débit d'eau",
        "Pour activer la douchette à main, tirez sur le petit levier sous le robinet",
        "La température se stabilise après environ 10 secondes",
        "Veillez à bien essuyer le sol après utilisation pour éviter les glissades"
      ],
      tags: ["douche", "salle de bain", "eau", "température"],
      photos: [
        { 
          url: "/api/placeholder/800/600", 
          alt: "Commandes douche", 
          caption: "Boutons de réglage de température et de débit" 
        }
      ],
      status: "complete",
      updatedAt: "2024-02-17T17:30:00Z"
    },
    {
      id: "inst-10",
      title: "Accès au local à vélos",
      description: "Comment accéder au local à vélos sécurisé et règles d'utilisation",
      category: "rules",
      steps: [
        "Le local à vélos se trouve au sous-sol, accès par la porte à côté de l'ascenseur",
        "Utilisez la clé marquée 'vélo' sur votre trousseau",
        "Attachez toujours votre vélo aux supports prévus à cet effet",
        "Respectez les emplacements des autres résidents",
        "Signalez tout problème au gardien de l'immeuble"
      ],
      tags: ["vélo", "local", "accès", "sous-sol", "clé"],
      photos: [
        { 
          url: "/api/placeholder/800/600", 
          alt: "Local vélos", 
          caption: "Entrée du local à vélos au sous-sol" 
        }
      ],
      status: "complete",
      updatedAt: "2024-01-15T09:10:00Z"
    },
    {
      id: "inst-11",
      title: "Utiliser le four",
      description: "Instructions pour utiliser le four de la cuisine",
      category: "appliance",
      steps: [
        "Tournez le bouton de gauche pour sélectionner le mode de cuisson",
        "Réglez la température avec le bouton de droite",
        "Préchauffez toujours le four avant d'y placer vos plats",
        "Utilisez le mode 'Chaleur tournante' pour une cuisson homogène",
        "Pour le nettoyage, attendez que le four soit froid et utilisez un produit dégraissant"
      ],
      tags: ["four", "cuisine", "cuisson", "électroménager"],
      photos: [
        { 
          url: "/api/placeholder/800/600", 
          alt: "Four", 
          caption: "Four électrique de la cuisine" 
        }
      ],
      status: "incomplete",
      updatedAt: "2024-02-02T11:20:00Z"
    },
    {
      id: "inst-12",
      title: "Connexion au système audio",
      description: "Comment utiliser le système audio Bluetooth du salon",
      category: "entertainment",
      steps: [
        "Allumez l'enceinte avec le bouton sur le dessus",
        "Activez le Bluetooth sur votre appareil mobile",
        "Sélectionnez 'SoundSystem-Apartment' dans la liste des appareils",
        "Le code de jumelage est 0000 si demandé",
        "L'appareil se reconnectera automatiquement lors de votre prochaine utilisation"
      ],
      tags: ["audio", "bluetooth", "musique", "enceinte"],
      photos: [
        { 
          url: "/api/placeholder/800/600", 
          alt: "Système audio", 
          caption: "Enceinte Bluetooth du salon" 
        }
      ],
      relatedInstructions: [
        { id: "inst-8", title: "Utiliser la smart TV" }
      ],
      status: "complete",
      updatedAt: "2024-01-25T18:05:00Z"
    },
    {
      id: "inst-13",
      title: "Utiliser l'interphone",
      description: "Comment utiliser l'interphone et ouvrir la porte d'entrée de l'immeuble",
      category: "rules",
      steps: [
        "L'interphone sonne lorsqu'un visiteur appuie sur votre nom à l'entrée",
        "Décrochez le combiné pour parler avec le visiteur",
        "Appuyez sur le bouton avec l'icône de clé pour ouvrir la porte",
        "Pour les livreurs, vous pouvez leur indiquer de déposer les colis chez le gardien",
        "Le code d'entrée de l'immeuble est le A1543B"
      ],
      tags: ["interphone", "porte", "entrée", "visiteurs", "code"],
      photos: [
        { 
          url: "/api/placeholder/800/600", 
          alt: "Interphone", 
          caption: "Interphone mural dans l'entrée" 
        }
      ],
      status: "complete",
      updatedAt: "2023-12-20T14:15:00Z"
    },
    {
      id: "inst-14",
      title: "En cas de fuite d'eau",
      description: "Procédure à suivre en cas de fuite d'eau dans l'appartement",
      category: "emergency",
      steps: [
        "Fermez immédiatement le robinet d'arrivée d'eau général (sous l'évier de la cuisine)",
        "Coupez l'électricité dans la zone concernée si l'eau est proche de prises électriques",
        "Placez des serviettes pour absorber l'eau et limiter les dégâts",
        "Contactez le propriétaire au 06 XX XX XX XX",
        "En cas d'urgence majeure, appelez le plombier d'urgence au 01 XX XX XX XX"
      ],
      tags: ["urgence", "fuite", "eau", "plomberie", "dégât des eaux"],
      photos: [
        { 
          url: "/api/placeholder/800/600", 
          alt: "Robinet principal", 
          caption: "Robinet d'arrêt général sous l'évier" 
        }
      ],
      status: "complete",
      updatedAt: "2024-01-10T08:45:00Z"
    },
    {
      id: "inst-15",
      title: "Régler la ventilation de la salle de bain",
      description: "Comment utiliser et régler la ventilation mécanique contrôlée (VMC)",
      category: "bathroom",
      steps: [
        "La ventilation s'active automatiquement lorsque vous allumez la lumière",
        "Elle reste active pendant 15 minutes après extinction de la lumière",
        "Pour forcer la ventilation, appuyez sur l'interrupteur marqué 'VMC'",
        "Nettoyez la grille de ventilation tous les 3 mois pour garantir son efficacité",
        "Ne bloquez jamais la bouche d'aération"
      ],
      tags: ["ventilation", "VMC", "salle de bain", "humidité", "aération"],
      status: "incomplete",
      updatedAt: "2024-02-28T13:50:00Z"
    }
  ]; 