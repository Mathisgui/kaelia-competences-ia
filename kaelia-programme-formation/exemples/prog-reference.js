// Version « Claude » du programme FRS260320-29, produite avec le MÊME script
// que celle d'Hermès (scripts/generate_programme.js). Seul le contenu change :
// c'est ce qui permet de dire si l'écart vient du skill ou de son application.
const DOC_DATA = {
  meta: {
    reference:  "FRS260320",
    theme:      "Intelligence artificielle générative",
    formation:  "Améliorer l'efficacité de sa TPE à l'aide de l'IA - RS7311",
    format:     "Présentiel",
    duree:      "21 heures de formation",
    tarif:      "1 650 € HT",
    contact:    "contact@kaelia-formacoach.com",
    referent:   "Karine WEIL",
    profils:    "Dirigeants de TPE, artisans, commerçants et professionnels indépendants qui gèrent seuls ou à deux l'ensemble de leur activité et cherchent à dégager du temps sur les tâches administratives et commerciales.",
    formateurs: "Mathis Guillemois",
    prerequis:  "Aucun prérequis technique. Savoir utiliser un ordinateur et un navigateur web suffit. Les stagiaires viennent avec leurs propres cas d'usage professionnels.",
  },

  objectifs: [
    "Identifier, dans sa propre activité, les tâches qui gagnent à être assistées par l'IA et celles qui doivent rester humaines",
    "Rédiger des instructions (prompts) qui produisent un résultat directement exploitable, sans retouche lourde",
    "Produire ses contenus commerciaux et administratifs courants avec l'IA : devis, relances, publications, réponses clients",
    "Exploiter un document long (contrat, appel d'offres, compte rendu) pour en extraire l'information utile en quelques minutes",
    "Mettre en place deux automatisations simples sur des tâches répétitives de son quotidien",
    "Appliquer les règles de confidentialité et le cadre RGPD à l'usage quotidien de l'IA dans une TPE",
    "Formaliser un plan d'intégration à 90 jours assorti d'indicateurs de temps gagné",
  ],

  modules: [
    {
      titre: "Module 1  ·  Cadrer l'usage de l'IA dans sa TPE",
      duree: "4 heures",
      objectifs: [
        "Comprendre en langage clair ce que fait un modèle de langage, sans jargon technique",
        "Distinguer ce que l'IA fait bien, mal, et ce qu'elle ne doit pas faire dans une TPE",
        "Cartographier ses propres tâches et repérer celles à fort potentiel de gain de temps",
        "Choisir les deux ou trois outils adaptés à son activité plutôt que de tous les essayer",
      ],
      contenu: [
        {
          titre: "Ce qu'est réellement l'IA générative",
          bullets: [
            "Le principe en une phrase : un modèle qui prédit la suite d'un texte à partir de ce qu'il a lu",
            "Pourquoi elle se trompe avec aplomb : hallucinations, absence de sources, données arrêtées à une date",
            "Ce qu'elle ne remplace pas : la décision, la relation client, la responsabilité juridique",
          ],
        },
        {
          titre: "Choisir ses outils sans s'éparpiller",
          bullets: [
            "Panorama comparé : ChatGPT, Claude, Gemini, Le Chat — ce qui les distingue concrètement",
            "Gratuit ou payant : ce que change l'abonnement sur la qualité, les limites et la confidentialité",
            "Critère de choix pour une TPE : un outil principal, un outil de secours, pas davantage",
          ],
        },
        {
          titre: "Cartographier son activité",
          bullets: [
            "Lister ses tâches de la semaine et les classer en quatre familles : rédiger, chercher, analyser, répéter",
            "Repérer les tâches chronophages à faible valeur ajoutée : les premières candidates",
            "Identifier les tâches à ne jamais déléguer à l'IA dans son métier",
          ],
        },
      ],
      evaluation: [
        "Cartographie personnelle des tâches, avec trois cas d'usage priorisés et justifiés",
        "Quiz de vérification des acquis sur les capacités et limites de l'IA",
      ],
    },
    {
      titre: "Module 2  ·  Obtenir un résultat exploitable : l'art du prompt",
      duree: "4 heures",
      objectifs: [
        "Structurer une demande pour obtenir un résultat utilisable dès le premier essai",
        "Corriger un résultat décevant par itération plutôt que de tout recommencer",
        "Constituer sa bibliothèque de prompts réutilisables adaptée à son activité",
      ],
      contenu: [
        {
          titre: "La structure d'une bonne instruction",
          bullets: [
            "Les quatre éléments qui font la différence : le rôle, le contexte, la tâche, le format attendu",
            "Donner un exemple du résultat voulu : la technique qui change tout",
            "Fixer les contraintes : longueur, ton, vocabulaire métier, ce qu'il ne faut pas dire",
          ],
        },
        {
          titre: "Itérer au lieu de recommencer",
          bullets: [
            "Corriger par le dialogue : « reformule plus court », « garde le ton mais change l'angle »",
            "Faire critiquer le résultat par l'IA elle-même avant de l'utiliser",
            "Reconnaître le moment où il faut repartir de zéro plutôt que d'insister",
          ],
        },
        {
          titre: "Sa bibliothèque de prompts",
          bullets: [
            "Transformer un prompt qui a marché en modèle réutilisable avec des variables",
            "Organiser ses prompts par tâche récurrente : relance, devis, publication, réponse client",
            "Atelier : chaque stagiaire construit cinq prompts sur ses propres tâches",
          ],
        },
      ],
      evaluation: [
        "Bibliothèque personnelle de cinq prompts opérationnels, testés en séance",
        "Exercice comparatif : même demande avant et après structuration, écart commenté",
      ],
    },
    {
      titre: "Module 3  ·  Produire ses contenus commerciaux et administratifs",
      duree: "5 heures",
      objectifs: [
        "Rédiger devis, relances et réponses clients en gardant sa propre voix",
        "Alimenter sa communication (site, réseaux, newsletter) sans y passer ses soirées",
        "Adapter un même contenu à plusieurs canaux sans le réécrire",
      ],
      contenu: [
        {
          titre: "L'écrit commercial du quotidien",
          bullets: [
            "Devis et propositions : structurer l'argumentaire à partir de notes brutes",
            "Relances impayés et relances commerciales : trouver le ton juste, ni mou ni agressif",
            "Réponses clients délicates : préparer un brouillon que l'on garde toujours la main pour valider",
          ],
        },
        {
          titre: "Garder sa voix",
          bullets: [
            "Faire analyser ses propres écrits pour en extraire son style et le réutiliser",
            "Les marqueurs d'un texte « écrit par IA » et comment les éliminer",
            "Pourquoi la relecture humaine reste non négociable avant tout envoi client",
          ],
        },
        {
          titre: "Communication et visibilité",
          bullets: [
            "Décliner une idée en publication réseaux, article de site et message de newsletter",
            "Construire un mois de publications en une séance de travail",
            "Générer des visuels simples et connaître les limites d'usage commercial",
          ],
        },
      ],
      evaluation: [
        "Production réelle : un devis, une relance et trois publications sur l'activité du stagiaire",
        "Grille de relecture appliquée à ses propres productions",
      ],
    },
    {
      titre: "Module 4  ·  Analyser ses documents et automatiser le répétitif",
      duree: "4 heures",
      objectifs: [
        "Extraire l'information utile d'un document long en quelques minutes",
        "Exploiter ses données chiffrées sans être à l'aise avec les tableurs",
        "Mettre en place deux automatisations simples et sans code",
      ],
      contenu: [
        {
          titre: "Faire parler un document",
          bullets: [
            "Contrats, conditions générales, appels d'offres : repérer les points de vigilance",
            "Comptes rendus et notes de réunion : produire un relevé de décisions exploitable",
            "Vérifier une réponse plutôt que la croire : la règle du recoupement",
          ],
        },
        {
          titre: "Ses chiffres sans tableur",
          bullets: [
            "Interroger un export comptable ou commercial en langage courant",
            "Construire un tableau de suivi simple et le faire évoluer",
            "Les limites du calcul par IA : ce qu'il faut toujours revérifier soi-même",
          ],
        },
        {
          titre: "Automatiser deux tâches",
          bullets: [
            "Repérer une tâche vraiment automatisable : répétitive, à règles stables, sans jugement",
            "Mise en place accompagnée de deux automatisations sur les cas des stagiaires",
            "Prévoir la panne : que se passe-t-il quand l'automatisation s'arrête",
          ],
        },
      ],
      evaluation: [
        "Deux automatisations fonctionnelles mises en place sur l'activité du stagiaire",
        "Analyse commentée d'un document réel apporté par le stagiaire",
      ],
    },
    {
      titre: "Module 5  ·  Sécuriser ses usages et passer à l'échelle",
      duree: "4 heures",
      objectifs: [
        "Savoir ce qui ne doit jamais être saisi dans un outil d'IA",
        "Appliquer le cadre RGPD à l'échelle d'une TPE, sans surcharge administrative",
        "Formaliser un plan d'intégration à 90 jours mesurable",
      ],
      contenu: [
        {
          titre: "Confidentialité au quotidien",
          bullets: [
            "La liste de ce qui ne se saisit jamais : données personnelles, bancaires, secrets commerciaux, données clients identifiantes",
            "Désactiver l'entraînement sur ses conversations : où cliquer, sur chaque outil",
            "Anonymiser un document avant de le soumettre : méthode en trois gestes",
          ],
        },
        {
          titre: "Le cadre légal à l'échelle d'une TPE",
          bullets: [
            "Les obligations RGPD qui concernent réellement une structure de moins de dix personnes",
            "À qui appartient un contenu produit par IA et ce que cela implique pour ses supports commerciaux",
            "Transparence vis-à-vis du client : quand le dire, comment le formuler",
          ],
        },
        {
          titre: "Son plan à 90 jours",
          bullets: [
            "Séquencer : ce qu'on met en place à 30, 60 et 90 jours, en commençant petit",
            "Choisir deux indicateurs simples : heures gagnées par semaine, délai de réponse client",
            "Prévoir le point d'étape et la remise en question du plan",
          ],
        },
      ],
      evaluation: [
        "Plan d'intégration à 90 jours formalisé, chiffré et présenté au groupe",
        "Évaluation finale des acquis sur l'ensemble du parcours",
      ],
    },
  ],
};

module.exports = { DOC_DATA };
