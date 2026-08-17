// =============================================================================
// Kaelia — Programme de Formation Word generator (v1)
// =============================================================================
// Usage : node generate_programme.js "/path/to/output.docx"
// =============================================================================
//
// Réutilise l'identité visuelle Kaelia (cf. kaelia-word). Conserve à l'identique :
//  - la cover : pavé aubergine + K/KAELIA (image cover-banner.png) + pavé
//    indigo « PROGRAMME DE FORMATION »
//  - les sections « Organisation de la formation » et « Évaluation de la
//    formation » (texte FIXE).
//
// Le reste (objectifs pédagogiques, modules) est rempli dynamiquement via
// DOC_DATA ci-dessous.
// =============================================================================

const fs = require("fs");
const path = require("path");
const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, ImageRun,
  Header, Footer, AlignmentType, BorderStyle, WidthType, ShadingType,
  VerticalAlign, PageNumber, PageBreak, LineRuleType, HeadingLevel,
  HorizontalPositionRelativeFrom, VerticalPositionRelativeFrom, TextWrappingType,
} = require("docx");

const SKILL_PATH = __dirname.replace(/\/scripts$/, "");

// ========== KAELIA TOKENS ==========
const KAELIA_VIOLET      = "5A226A";
const KAELIA_VIOLET_DEEP = "3F1349";
const KAELIA_VIOLET_SOFT = "CB6CE6";
const KAELIA_AUBERGINE   = "360A42";
const KAELIA_INDIGO_PILL = "120031";   // pavé "PROGRAMME DE FORMATION"
const INK                = "111111";
const GRAPHITE           = "2A2A2A";
const GREY               = "6E6E6E";
const PAPER              = "FBFAF8";
const CREAM              = "F7F5F2";
const LAVENDER           = "F1E8F5";
const WHITE              = "FFFFFF";
const HAIRLINE           = "E5E1DD";
const BADGE_GREY         = "EDEAE5";   // badge fond gris clair pour titres de section module
const SEP                = "  ·  ";    // séparateur de remplacement pour les em-dashes

// Montserrat + Inter sont des Google Fonts → rendues correctement après conversion
// en Google Doc. Century Gothic n'existe pas côté Google → remplacé par Montserrat.
const FONT_DISPLAY = "Montserrat";
const FONT_BODY    = "Inter";
const FONT_PILL    = "Montserrat"; // pavé cover (avant : Century Gothic, non dispo Google Docs)

// Largeurs de contenu (DXA) — indispensables : les tables en % cassent à la
// conversion Google Doc. Cover = A4 marges 1,5 cm → 18 cm ; Corps = marges 2 cm → 17 cm.
const COVER_W = Math.round(18 * 567); // 10206
const BODY_W  = Math.round(17 * 567); // 9639

// ========== TYPE SCALE ==========
const SZ = {
  pill:    32,    // 16pt — texte du pavé PROGRAMME DE FORMATION (display)
  h1:      32,    // 16pt — titre de module / section
  h2:      26,    // 13pt — sous-titre dans module
  h3:      24,    // 12pt — sous-bloc contenu
  lede:    22,    // 11pt
  body:    22,    // 11pt
  small:   20,    // 10pt
  eyebrow: 16,    // 8pt
  footer:  14,    // 7pt
  pillBig: 32,    // 16pt centré dans le pavé indigo
};
const SPACING = { tight: 252, snug: 288, normal: 360, relaxed: 408 };
const TRACK_EYEBROW  = 60;
const TRACK_DISPLAY  = -10;
const TRACK_WORDMARK = 24;

// =============================================================================
// DOC_DATA — à remplir par le skill
// =============================================================================
const DOC_DATA = {
  meta: {
    reference:         "FRIA20260527",
    theme:             "Intelligence artificielle générative",
    formation:         "Intégrer l'IA générative dans ses pratiques professionnelles - parcours complet pour managers et collaborateurs",
    format:            "Mixte (présentiel + distanciel)",
    duree:             "20 heures de formation",
    tarif:             "4 800 € HT",
    contact:           "contact@kaelia-formacoach.com",
    referent:          "Karine WEIL",
    profils:           "Managers, chefs de projet et collaborateurs souhaitant intégrer l'IA générative dans leurs pratiques quotidiennes, quel que soit leur métier.",
    formateurs:        "Killian Guillemois",
    prerequis:         "Aucun préalable technique requis. Une aisance de base avec un navigateur web et la suite bureautique suffit. La curiosité pour les outils numériques est un atout.",
  },

  objectifs: [
    "Comprendre ce qu'est l'IA générative, son fonctionnement et ses limites actuelles",
    "Identifier les cas d'usage à forte valeur pour son métier et ceux à écarter",
    "Maîtriser les principaux outils du marché (ChatGPT, Claude, Gemini, Copilot, Mistral)",
    "Rédiger des prompts efficaces et reproductibles selon les bonnes pratiques du prompt engineering",
    "Appliquer le cadre RGPD, le règlement européen IA Act et les règles internes de confidentialité",
    "Construire un plan d'intégration de l'IA dans son équipe avec des indicateurs de suivi simples",
  ],

  modules: [
    {
      titre:    "Module 1  ·  Comprendre l'IA générative : fondamentaux et enjeux",
      duree:    "4 heures",
      objectifs: [
        "Comprendre l'histoire, le fonctionnement et la logique des grands modèles de langage",
        "Distinguer IA générative, IA prédictive et automatisation classique",
        "Identifier les limites structurelles (hallucinations, biais, fraîcheur des données)",
        "Se positionner face aux enjeux économiques et sociétaux du secteur",
      ],
      contenu: [
        {
          titre: "Comment fonctionne un modèle de langage",
          bullets: [
            "Tokenisation, prédiction du mot suivant, taille de contexte : les notions à connaître",
            "Différence entraînement et inférence : ce que le modèle a appris, ce qu'il peut générer",
            "Panorama des familles de modèles : GPT, Claude, Gemini, Llama, Mistral, et leurs spécificités",
          ],
        },
        {
          titre: "Forces et limites de l'IA générative",
          bullets: [
            "Tâches où elle excelle : rédaction, synthèse, reformulation, traduction, idéation",
            "Tâches où elle échoue : calcul exact, faits récents non sourcés, raisonnement complexe long",
            "Hallucinations : pourquoi elles arrivent, comment les détecter, comment les limiter",
          ],
        },
        {
          titre: "L'écosystème en 2026",
          bullets: [
            "Acteurs majeurs : OpenAI, Anthropic, Google DeepMind, Mistral, Meta",
            "Modèles ouverts vs propriétaires : implications coût, souveraineté, déploiement",
            "Tendances clés : agents autonomes, multimodalité, IA on-device",
          ],
        },
      ],
      evaluation: [
        "Quiz de positionnement en fin de module sur les fondamentaux",
        "Tour de table : chaque participant cite un cas d'usage IA observé dans son entreprise",
      ],
    },
    {
      titre:    "Module 2  ·  Maîtriser les outils du marché",
      duree:    "4 heures",
      objectifs: [
        "Prendre en main les principaux assistants conversationnels grand public",
        "Identifier la solution adaptée à chaque type de tâche",
        "Utiliser les fonctionnalités avancées : projets, documents joints, recherche web, vision",
        "Évaluer le coût d'usage et les options d'abonnement pour son équipe",
      ],
      contenu: [
        {
          titre: "Les assistants conversationnels",
          bullets: [
            "ChatGPT, Claude, Gemini, Le Chat (Mistral), Copilot : forces et faiblesses comparées",
            "Modèles raisonnement vs modèles rapides : quand utiliser lequel",
            "Travail sur fichiers : PDF, Word, Excel, images, captures d'écran",
          ],
        },
        {
          titre: "Les outils intégrés au poste de travail",
          bullets: [
            "Microsoft 365 Copilot dans Outlook, Word, Excel, Teams",
            "Google Workspace avec Gemini dans Gmail, Docs, Sheets, Meet",
            "Notion AI, Slack AI, Linear AI : l'IA dans les outils de collaboration",
          ],
        },
        {
          titre: "Au-delà du texte",
          bullets: [
            "Image : DALL-E, Midjourney, Adobe Firefly pour la communication et le marketing",
            "Voix et vidéo : ElevenLabs, Descript, HeyGen pour les supports de formation",
            "Code et analyse : Claude Code, Cursor, GitHub Copilot pour les équipes techniques",
          ],
        },
      ],
      evaluation: [
        "Atelier pratique en binôme : réaliser la même tâche métier sur trois outils différents et comparer",
        "Grille de comparaison à compléter individuellement",
      ],
    },
    {
      titre:    "Module 3  ·  Prompt engineering : écrire pour obtenir le bon résultat",
      duree:    "4 heures",
      objectifs: [
        "Structurer un prompt selon les bonnes pratiques (contexte, rôle, tâche, contraintes, format)",
        "Itérer efficacement quand la première réponse n'est pas satisfaisante",
        "Construire une bibliothèque de prompts réutilisables pour son équipe",
        "Utiliser les techniques avancées : few-shot, chain-of-thought, decomposition",
      ],
      contenu: [
        {
          titre: "Anatomie d'un prompt efficace",
          bullets: [
            "Les cinq briques : contexte, rôle, tâche, contraintes, format de sortie attendu",
            "L'importance de l'exemple : un seul exemple bien choisi vaut dix instructions",
            "Préciser ce qu'on ne veut pas : interdictions, ton à éviter, longueur maximale",
          ],
        },
        {
          titre: "Techniques avancées",
          bullets: [
            "Few-shot : fournir 2 à 3 exemples pour cadrer le style attendu",
            "Chain-of-thought : demander au modèle de raisonner étape par étape",
            "Décomposition : découper une tâche complexe en plusieurs prompts enchaînés",
          ],
        },
        {
          titre: "Industrialiser ses prompts",
          bullets: [
            "Modèles de prompts versionnés et partagés au sein de l'équipe",
            "Variables et placeholders : créer un prompt paramétrable pour chaque collaborateur",
            "Documentation et tests : comment valider qu'un prompt fonctionne sur dix cas réels",
          ],
        },
        {
          titre: "Cas d'usage métier",
          bullets: [
            "Rédaction : email, compte-rendu, note de synthèse, fiche projet",
            "Analyse : relecture de contrat, synthèse de transcription, comparaison de propositions",
            "Idéation : brainstorming structuré, génération d'angles, pré-cadrage stratégique",
          ],
        },
      ],
      evaluation: [
        "Atelier pratique : chaque participant rédige trois prompts métier et les teste",
        "Revue collective : présentation d'un prompt et amélioration en groupe",
      ],
    },
    {
      titre:    "Module 4  ·  Cadre légal, données, éthique",
      duree:    "4 heures",
      objectifs: [
        "Comprendre le cadre du règlement européen IA Act et le calendrier d'entrée en vigueur",
        "Appliquer le RGPD aux données personnelles transmises à un outil d'IA",
        "Identifier les risques de confidentialité, propriété intellectuelle et droit d'auteur",
        "Adopter une charte d'usage interne adaptée à l'organisation",
      ],
      contenu: [
        {
          titre: "Le règlement européen IA Act",
          bullets: [
            "Classification des systèmes IA par niveau de risque : interdit, haut risque, transparence, minimal",
            "Calendrier 2024-2026 : entrée en vigueur progressive des obligations",
            "Ce que cela change concrètement pour l'usage en entreprise",
          ],
        },
        {
          titre: "RGPD et IA générative",
          bullets: [
            "Ce qu'on ne saisit jamais dans un prompt : données personnelles, secret industriel, code source confidentiel",
            "Comprendre l'utilisation des conversations pour l'entraînement et savoir la désactiver",
            "Différence entre version grand public et version entreprise (compte pro, instance dédiée)",
          ],
        },
        {
          titre: "Propriété intellectuelle et éthique",
          bullets: [
            "Statut juridique d'un contenu généré par IA en France et en Europe",
            "Risques de plagiat involontaire et bonnes pratiques de vérification",
            "Transparence : quand et comment indiquer qu'un contenu a été produit avec l'aide d'une IA",
          ],
        },
        {
          titre: "Construire une charte interne",
          bullets: [
            "Les sept points clés à formaliser : outils autorisés, données interdites, mention obligatoire, formation",
            "Articulation avec le règlement intérieur et la politique sécurité existants",
            "Rôle du référent IA dans l'entreprise : missions et profil",
          ],
        },
      ],
      evaluation: [
        "Étude de cas : analyser trois situations métier et identifier les risques juridiques",
        "Atelier en sous-groupe : ébauche de charte interne adaptée à l'organisation",
      ],
    },
    {
      titre:    "Module 5  ·  Construire son plan d'intégration IA",
      duree:    "4 heures",
      objectifs: [
        "Cartographier les processus de son équipe et identifier les opportunités d'IA",
        "Prioriser les cas d'usage par valeur attendue et faisabilité",
        "Définir des indicateurs de suivi pour mesurer l'impact réel",
        "Co-construire un plan d'action sur six mois adapté à l'équipe",
      ],
      contenu: [
        {
          titre: "Cartographier ses processus",
          bullets: [
            "Identifier les tâches répétitives, à forte volumétrie ou consommatrices de temps",
            "Distinguer ce qui doit rester humain, ce qui peut être assisté, ce qui peut être automatisé",
            "Évaluer la disponibilité et la qualité des données nécessaires",
          ],
        },
        {
          titre: "Prioriser les cas d'usage",
          bullets: [
            "Matrice valeur attendue x faisabilité : positionner chaque cas d'usage identifié",
            "Quick-wins à 30 jours, expérimentations à 3 mois, projets structurants à 6 mois",
            "Estimer le retour sur investissement : temps gagné, qualité améliorée, coût évité",
          ],
        },
        {
          titre: "Mesurer l'impact",
          bullets: [
            "Indicateurs simples : temps gagné par tâche, nombre de collaborateurs équipés, taux d'adoption",
            "Indicateurs qualitatifs : satisfaction des équipes, qualité perçue des livrables, charge mentale",
            "Routine de suivi mensuelle : qui mesure, qui décide, qui ajuste",
          ],
        },
        {
          titre: "Clôture et engagement",
          bullets: [
            "Présentation par chaque participant de son plan d'action personnel sur 90 jours",
            "Mise en place d'un référent IA au sein de l'équipe : rôle, missions, outils de suivi",
            "Évaluation finale des acquis et remise des attestations de formation",
          ],
        },
      ],
      evaluation: [
        "Plan d'action individuel sur 90 jours formalisé sur une page (livrable personnel)",
        "Présentation orale courte de son plan devant le groupe et feedback collectif",
        "Questionnaire de satisfaction et d'évaluation des acquis en fin de formation",
      ],
    },
  ],
};

// =============================================================================
// Helpers
// =============================================================================
const cm = (v) => Math.round(v * 567);
const NONE = { style: BorderStyle.NONE, size: 0, color: "FFFFFF" };
const noBorders = { top: NONE, bottom: NONE, left: NONE, right: NONE, insideHorizontal: NONE, insideVertical: NONE };

function emptyP(before = 0, after = 0) {
  return new Paragraph({ spacing: { before, after }, children: [new TextRun("")] });
}

function parseInline(text, opts = {}) {
  const size = opts.size || SZ.body;
  const color = opts.color || GRAPHITE;
  const runs = [];
  const re = /\*\*([^*]+)\*\*/g;
  let last = 0, m;
  while ((m = re.exec(text)) !== null) {
    if (m.index > last) runs.push(new TextRun({ text: text.slice(last, m.index), font: FONT_BODY, size, color }));
    runs.push(new TextRun({ text: m[1], font: FONT_BODY, size, color, bold: true }));
    last = m.index + m[0].length;
  }
  if (last < text.length) runs.push(new TextRun({ text: text.slice(last), font: FONT_BODY, size, color }));
  if (runs.length === 0) runs.push(new TextRun({ text, font: FONT_BODY, size, color }));
  return runs;
}

function eyebrow(text, opts = {}) {
  return new Paragraph({
    spacing: { before: opts.before ?? 200, after: opts.after ?? 60 },
    keepNext: true,  // eyebrow reste collé au titre qui suit
    children: [new TextRun({
      text: text.toUpperCase(),
      font: FONT_BODY, size: SZ.eyebrow,
      color: opts.color || GREY,
      characterSpacing: TRACK_EYEBROW,
    })],
  });
}

function brandRule(opts = {}) {
  const w = opts.w || 1.6;
  const color = opts.color || KAELIA_VIOLET;
  return new Table({
    width: { size: cm(w), type: WidthType.DXA },
    borders: noBorders,
    rows: [new TableRow({
      height: { value: 50, rule: "exact" },
      children: [new TableCell({
        width: { size: cm(w), type: WidthType.DXA },
        borders: { top: { style: BorderStyle.SINGLE, size: 24, color }, bottom: NONE, left: NONE, right: NONE },
        margins: { top: 0, bottom: 0, left: 0, right: 0 },
        children: [emptyP()],
      })],
    })],
  });
}

// Titre H1 — vrai style Heading (outline/navigation) + filet violet en bordure
// de paragraphe (les tables-filet rendent des cases vides en Google Doc).
function h1(text) {
  return [
    new Paragraph({
      heading: HeadingLevel.HEADING_1,
      spacing: { before: 200, after: 160 },
      keepNext: true,
      keepLines: true,
      border: { top: { style: BorderStyle.SINGLE, size: 18, color: KAELIA_VIOLET, space: 6 } },
      children: [new TextRun({
        text, font: FONT_DISPLAY, size: 44, color: INK, bold: true,
        characterSpacing: TRACK_DISPLAY,
      })],
    }),
  ];
}

// Titre de section module — badge gris pleine largeur, texte INK centré.
// cantSplit empêche le badge lui-même de se couper sur deux pages.
function sectionBadge(text) {
  return new Table({
    width: { size: BODY_W, type: WidthType.DXA },
    columnWidths: [BODY_W],
    borders: noBorders,
    rows: [new TableRow({
      cantSplit: true,
      height: { value: 600, rule: "exact" },
      children: [new TableCell({
        width: { size: BODY_W, type: WidthType.DXA },
        shading: { type: ShadingType.CLEAR, color: "auto", fill: BADGE_GREY },
        borders: noBorders,
        margins: { top: 140, bottom: 140, left: 240, right: 240 },
        verticalAlign: VerticalAlign.CENTER,
        children: [new Paragraph({
          alignment: AlignmentType.CENTER,
          keepNext: true,
          children: [new TextRun({
            text: text.toUpperCase(),
            font: FONT_DISPLAY, bold: true,
            size: 24, color: INK, // 12pt
            characterSpacing: 40,
          })],
        })],
      })],
    })],
  });
}

// Sous-bloc dans le contenu d'un module (anciennement h3) — violet, taille modérée.
// keepNext garantit que le sous-titre reste collé à la première puce.
function h3(text) {
  return new Paragraph({
    spacing: { before: 160, after: 60 },
    keepNext: true,
    keepLines: true,
    children: [new TextRun({
      text, font: FONT_DISPLAY, size: SZ.h2, color: KAELIA_VIOLET, bold: true,
    })],
  });
}

function lede(text) {
  return new Paragraph({
    spacing: { before: 80, after: 160, line: SPACING.normal, lineRule: LineRuleType.AUTO },
    children: [new TextRun({ text, font: FONT_BODY, size: SZ.lede, color: GRAPHITE })],
  });
}

function body(text) {
  // Interligne "normal" (pas "relaxed") : body() ne sert qu'aux textes fixes
  // Organisation/Évaluation — en relaxed, la page finale débordait et la devise
  // de clôture partait seule sur une page supplémentaire.
  return new Paragraph({
    spacing: { before: 60, after: 120, line: SPACING.normal, lineRule: LineRuleType.AUTO },
    children: parseInline(text, { color: GRAPHITE }),
  });
}

function bullet(text) {
  return new Paragraph({
    spacing: { before: 30, after: 50, line: SPACING.normal, lineRule: LineRuleType.AUTO },
    indent: { left: 360, hanging: 300 },  // hanging : les lignes qui bouclent s'alignent sous le texte, pas sous la flèche
    keepLines: true,  // une même puce ne se coupe pas entre deux pages
    children: [
      new TextRun({ text: "→  ", font: FONT_BODY, size: SZ.body, color: KAELIA_VIOLET, bold: true }),
      ...parseInline(text, { color: GRAPHITE }),
    ],
  });
}

// =============================================================================
// COVER — pavé aubergine + image K/KAELIA + pavé indigo "PROGRAMME DE FORMATION"
// =============================================================================
// Bandeau cover — image flottante ancrée en position absolue au coin haut-gauche
// de la page. Ce mode garantit le vrai bord-à-bord (le flux paragraphe ne peut
// pas le faire à cause de l'espace réservé au header par défaut).
// L'image a un fond uniforme #120031 donc le bleed est invisible.
// Bandeau cover — image INLINE pleine largeur (avant : image flottante
// behindDocument, qui s'effondre/dérive à la conversion Google Doc).
function coverBanner() {
  const imgPath = path.join(SKILL_PATH, "assets/cover-banner.png");
  if (!fs.existsSync(imgPath)) return emptyP();
  // BORD À BORD : l'image fait la largeur TOTALE de la page (21 cm) et le
  // paragraphe déborde dans les marges par une indentation négative — sinon le
  // bandeau s'arrête à la zone de texte et un liseré blanc l'encadre.
  // RATIO : cover-banner.png fait 1536x512, soit exactement 3:1. L'ancien code
  // imposait 680x171 (ratio 3,98) et écrasait donc le logo de 25 % en hauteur.
  // ⚠️ `transformation` est en PIXELS à 96 dpi (pas en points) : 21 cm = 794 px.
  // Léger débordement (21,4 cm) + calage à GAUCHE : le centrage combiné à des
  // indentations négatives laissait un liseré blanc à gauche après conversion
  // Google Doc (le centrage y est recalculé dans la zone de texte). Ici le bord
  // gauche de l'image est posé à x = -0,2 cm, le surplus est rogné par la page.
  // ANCRAGE À LA PAGE (0,0) : posé dans le flux — même à l'intérieur du header —
  // Google Docs conserve quelques millimètres d'encart au-dessus. Ancré à la
  // PAGE, l'image se place au coin supérieur gauche absolu, hors de tout encart.
  const BLEED_W_PX = 809;                      // 21,4 cm
  const RATIO = 3;                             // 1536 / 512
  const EMU = (px) => Math.round(px * 9525);   // 1 px (96 dpi) = 9525 EMU
  return new Paragraph({
    spacing: { before: 0, after: 0, line: 1, lineRule: LineRuleType.EXACT },
    children: [new ImageRun({
      type: "png",
      data: fs.readFileSync(imgPath),
      transformation: { width: BLEED_W_PX, height: Math.round(BLEED_W_PX / RATIO) },
      floating: {
        horizontalPosition: { relative: HorizontalPositionRelativeFrom.PAGE, offset: EMU(-6) },
        verticalPosition:   { relative: VerticalPositionRelativeFrom.PAGE,   offset: 0 },
        allowOverlap: true,
        behindDocument: false,
        wrap: { type: TextWrappingType.NONE },
      },
      altText: { title: "Kaelia", description: "Bandeau Kaelia - Programme de formation", name: "cover-banner" },
    })],
  });
}

// Spacer paragraph that pushes content below the floating cover banner (~7.2cm).
function coverSpacer() {
  return new Paragraph({
    spacing: { before: 0, after: 0 },
    children: [new TextRun({ text: "", size: 2 })],
  });
}

// Pavé indigo "PROGRAMME DE FORMATION" — pleine largeur de la zone de contenu.
// IMAGE et non tableau : OOXML ne sait pas arrondir les coins d'une cellule
// (seules les formes DrawingML le peuvent, et elles ne survivent pas à la
// conversion Google Doc). Le PNG est fabriqué par `scripts/make_pill.py`
// (Montserrat Bold, fond #120031, rayon 3 mm) — le régénérer après toute
// modification de couleur, de libellé ou de rayon.
// Repli sur l'ancien tableau à coins droits si l'image manque.
function programmeFormationPill() {
  const pillPath = path.join(SKILL_PATH, "assets/pill-programme.png");
  if (fs.existsSync(pillPath)) {
    const W_PX = 680;                     // 18 cm à 96 dpi = largeur de contenu
    const RATIO = 2721 / 192;             // dimensions natives du PNG
    return new Paragraph({
      spacing: { before: 0, after: 0 },
      alignment: AlignmentType.CENTER,
      children: [new ImageRun({
        type: "png",
        data: fs.readFileSync(pillPath),
        transformation: { width: W_PX, height: Math.round(W_PX / RATIO) },
        altText: { title: "Programme de formation", description: "PROGRAMME DE FORMATION", name: "pill" },
      })],
    });
  }
  return new Table({
    width: { size: COVER_W, type: WidthType.DXA },
    columnWidths: [COVER_W],
    borders: noBorders,
    rows: [new TableRow({
      height: { value: 720, rule: "exact" },
      children: [new TableCell({
        width: { size: COVER_W, type: WidthType.DXA },
        shading: { type: ShadingType.CLEAR, color: "auto", fill: KAELIA_INDIGO_PILL },
        borders: noBorders,
        margins: { top: 200, bottom: 200, left: 200, right: 200 },
        verticalAlign: VerticalAlign.CENTER,
        children: [new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [new TextRun({
            text: "PROGRAMME DE FORMATION",
            font: FONT_PILL, bold: true,
            size: SZ.pillBig, color: WHITE,
            characterSpacing: 30,
          })],
        })],
      })],
    })],
  });
}

// Info-table — version compacte pour tenir sur la page 1.
// Lignes condensées (top/bottom margins réduits), table 18cm centrée.
function infoTable(meta) {
  const lines = [
    ["Référence",              meta.reference],
    ["Thème",                  meta.theme],
    ["Formation",              meta.formation],
    ["Format de la formation", meta.format],
    ["Durée",                  meta.duree],
    ["Tarif",                  meta.tarif],
    ["Contact",                meta.contact],
    ["Référent pédagogique",   meta.referent],
    ["Profils des stagiaires", meta.profils],
    ["Formateurs",             meta.formateurs],
    ["Prérequis",              meta.prerequis],
    ["Délais d'accès",         meta.delais || "Inscription jusqu'à 11 jours ouvrés avant le démarrage, sous réserve des délais de prise en charge du financeur."],
    ["Accessibilité",          meta.accessibilite || "Formation accessible aux personnes en situation de handicap. Référent handicap : Karine WEIL — contact@kaelia-formacoach.com."],
  ];
  const rows = lines.map(([k, v]) => new TableRow({
    cantSplit: true,
    children: [
      new TableCell({
        width: { size: 3100, type: WidthType.DXA },
        shading: { type: ShadingType.CLEAR, color: "auto", fill: CREAM },
        borders: {
          top: { style: BorderStyle.SINGLE, size: 2, color: HAIRLINE },
          bottom: { style: BorderStyle.SINGLE, size: 2, color: HAIRLINE },
          left: NONE, right: NONE,
        },
        margins: { top: 90, bottom: 90, left: 260, right: 160 },
        verticalAlign: VerticalAlign.CENTER,
        children: [new Paragraph({
          spacing: { before: 0, after: 0, line: 250, lineRule: LineRuleType.AUTO },
          children: [new TextRun({
            text: k.toUpperCase(), font: FONT_BODY, size: SZ.eyebrow,
            color: KAELIA_VIOLET, bold: true, characterSpacing: TRACK_EYEBROW,
          })],
        })],
      }),
      new TableCell({
        width: { size: 7106, type: WidthType.DXA },
        borders: {
          top: { style: BorderStyle.SINGLE, size: 2, color: HAIRLINE },
          bottom: { style: BorderStyle.SINGLE, size: 2, color: HAIRLINE },
          left: NONE, right: NONE,
        },
        margins: { top: 90, bottom: 90, left: 320, right: 180 },
        verticalAlign: VerticalAlign.CENTER,
        children: [new Paragraph({
          spacing: { before: 0, after: 0, line: 250, lineRule: LineRuleType.AUTO },
          children: parseInline(v, { color: INK, size: SZ.body }), // 11pt
        })],
      }),
    ],
  }));
  return new Table({
    width: { size: COVER_W, type: WidthType.DXA },
    columnWidths: [3100, 7106],
    borders: noBorders,
    rows,
  });
}

// =============================================================================
// HEADER (pages corps) — petit logo couleur à gauche + KAELIA — Programme de Formation
// =============================================================================
function makeHeader() {
  const logoPath = path.join(SKILL_PATH, "assets/logo-kaelia-color.png");
  const hasLogo = fs.existsSync(logoPath);
  const leftChildren = hasLogo ? [new Paragraph({
    spacing: { before: 0, after: 0 },
    children: [new ImageRun({
      type: "png",
      data: fs.readFileSync(logoPath),
      transformation: { width: 22, height: 22 },
      altText: { title: "Kaelia", description: "Logo Kaelia", name: "logo" },
    })],
  })] : [emptyP()];
  const rightChildren = [new Paragraph({
    alignment: AlignmentType.RIGHT,
    spacing: { before: 80, after: 0 },
    children: [
      new TextRun({
        text: "KAELIA",
        font: FONT_DISPLAY, bold: true,
        size: SZ.eyebrow, color: KAELIA_VIOLET,
        characterSpacing: TRACK_WORDMARK,
      }),
      new TextRun({
        text: SEP + "Programme de Formation",
        font: FONT_BODY,
        size: SZ.eyebrow, color: GREY,
        characterSpacing: 30,
      }),
    ],
  })];
  return new Header({
    children: [
      new Table({
        width: { size: 9600, type: WidthType.DXA },
        borders: {
          ...noBorders,
          bottom: { style: BorderStyle.SINGLE, size: 6, color: KAELIA_VIOLET },
        },
        columnWidths: [1200, 8400],
        rows: [new TableRow({
          children: [
            new TableCell({
              width: { size: 1200, type: WidthType.DXA },
              borders: noBorders,
              margins: { top: 60, bottom: 80, left: 0, right: 0 },
              verticalAlign: VerticalAlign.CENTER,
              children: leftChildren,
            }),
            new TableCell({
              width: { size: 8400, type: WidthType.DXA },
              borders: noBorders,
              margins: { top: 60, bottom: 80, left: 0, right: 0 },
              verticalAlign: VerticalAlign.CENTER,
              children: rightChildren,
            }),
          ],
        })],
      }),
    ],
  });
}

// =============================================================================
// FOOTER — mentions légales SAS Kaelia (gris 7pt, centré)
// =============================================================================
function makeFooter() {
  return new Footer({
    children: [
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 0, after: 30 },
        children: [new TextRun({
          text: "SAS KAELIA  ·  198 rue des amis de l'industrie, 42590 NEULISE",
          font: FONT_BODY, size: SZ.footer, color: GREY,
        })],
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 0, after: 30 },
        children: [new TextRun({
          text: "N° SIRET 953 672 235 000 17  ·  N° TVA FR68953672235  ·  N° NDA 84420407442",
          font: FONT_BODY, size: SZ.footer, color: GREY,
        })],
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 0, after: 0 },
        children: [
          new TextRun({
            text: "contact@kaelia-formacoach.com  ·  ",
            font: FONT_BODY, size: SZ.footer, color: GREY,
          }),
          new TextRun({ children: [PageNumber.CURRENT], font: FONT_BODY, size: SZ.footer, color: GREY }),
          new TextRun({ text: " / ", font: FONT_BODY, size: SZ.footer, color: GREY }),
          new TextRun({ children: [PageNumber.TOTAL_PAGES], font: FONT_BODY, size: SZ.footer, color: GREY }),
        ],
      }),
    ],
  });
}

// =============================================================================
// TEXTES FIXES — Organisation & Évaluation de la formation (NE PAS MODIFIER)
// =============================================================================
const TEXTE_ORGANISATION = [
  "Kaelia accompagne les créateurs d'entreprise dans leur projet professionnel. Au-delà de les former, Kaelia souhaite proposer aux futurs dirigeants des solutions de financement pour leur projet de création d'entreprise.",
  "Les formations reposent sur l'interactivité entre formateurs et stagiaires. Les méthodes utilisées sont les suivantes : Recueil systématique des besoins pour garantir l'adaptation de l'intervention ; Mobilisation continue des stagiaires : brainstorming collectif, demande de retour d'expérience, résolution de cas concrets ; sondage en cours d'intervention ; mise en situation ; Approche opérationnelle : schéma, logigramme... ; Feedback à chaud : tour de table de clôture (validation de la réponse aux attentes).",
  "Accueil des stagiaires dans des locaux équipés (salle de réunion d'une capacité de 15 personnes, écran, paperboard, post-it..). En cas de formation à distance, l'accès aux classes virtuelles se fait via une plateforme mise à disposition des stagiaires. Les outils utilisés sont Google Meet (https://meet.google.com), Teams (https://www.microsoft.com/fr-fr/microsoft-teams/log-in) et Zoom (https://zoom.us/fr).",
];

const TEXTE_EVALUATION = [
  "À l'issue de la formation, Kaelia adresse aux stagiaires une évaluation (sous forme de quiz ou tout autre format adapté) ainsi qu'une enquête de satisfaction à compléter.",
  "Après la formation, Kaelia transmet aux apprenants les résultats obtenus, la correction de l'évaluation ainsi que le support de formation.",
  "Enfin, un an après la formation, Kaelia adresse un questionnaire de suivi aux apprenants afin de mesurer le degré de mise en application des connaissances acquises.",
];

// =============================================================================
// Compose document
// =============================================================================
function buildDoc(data) {
  // ---------- COVER SECTION ----------
  // L'image cover-banner.png est positionnée en flottant absolu (0,0 page)
  // dans le premier paragraphe → vrai bord-à-bord. Le top margin (~7.5cm)
  // laisse la place pour ce bandeau. Le reste du contenu (pill + table) suit
  // dans le flux normal et a tout l'espace de la page pour respirer.
  const coverChildren = [
    programmeFormationPill(),   // le bandeau est DANS le header (cf. ci-dessous)
    emptyP(120, 0),
    infoTable(data.meta),
  ];
  const coverSection = {
    properties: {
      page: {
        size: { width: cm(21), height: cm(29.7) },
        // Le bandeau vit dans le HEADER : rien ne peut donc s'insérer au-dessus.
        // La marge haute doit laisser passer sa hauteur (7,14 cm) + un filet.
        margin: { top: cm(7.4), bottom: cm(1.0), left: cm(1.5), right: cm(1.5), header: 0, footer: cm(0.7) },
      },
      // Le bandeau ne doit exister QUE sur la première page : sans titlePage,
      // le header (donc le bandeau) se répétait sur la page de débordement
      // quand le tableau d'infos ne tenait pas sur la page de garde.
      titlePage: true,
    },
    // BANDEAU DANS LE HEADER — dernier recours après trois tentatives dans le
    // corps : Google Docs impose une hauteur minimale à sa zone d'en-tête, qui
    // laissait toujours un liseré blanc en haut. Dans le header, l'image est le
    // tout premier élément rendu de la page : il n'y a plus rien au-dessus.
    headers: {
      first: new Header({ children: [coverBanner()] }),
      default: new Header({ children: [emptyP()] }),
    },
    footers: { first: makeFooter(), default: makeFooter() },
    children: coverChildren,
  };

  // ---------- BODY SECTION ----------
  const body_ = [];

  // Objectifs pédagogiques
  body_.push(eyebrow("OBJECTIFS PÉDAGOGIQUES"));
  body_.push(...h1("À l'issue de la formation."));
  // Accroche : par défaut une phrase passe-partout, qui se voyait comme telle sur
  // les programmes livrés. Renseigner `meta.accroche` pour dire ce que le
  // stagiaire saura FAIRE concrètement — c'est la première chose que lit le client.
  body_.push(lede(
    data.meta.accroche ||
    `Les stagiaires sauront mettre en pratique les compétences ciblées par cette formation${
      data.meta.duree ? ` de ${String(data.meta.duree).replace(/ de formation$/, "")}` : ""
    }.`
  ));
  for (const o of data.objectifs) body_.push(bullet(o));

  // Modules — flow naturel, pas de page break forcé (évite les pages quasi-vides).
  // Une grosse marge avant chaque module assure une séparation visuelle nette.
  let firstModule = true;
  for (const mod of data.modules) {
    body_.push(emptyP(firstModule ? 400 : 600, 0));
    firstModule = false;
    body_.push(eyebrow("MODULE"));
    body_.push(...h1(mod.titre));
    body_.push(new Paragraph({
      spacing: { before: 0, after: 200 },
      children: [
        new TextRun({
          text: "DURÉE  ",
          font: FONT_BODY, size: SZ.eyebrow,
          color: GREY, characterSpacing: TRACK_EYEBROW,
        }),
        new TextRun({
          text: mod.duree,
          font: FONT_BODY, size: SZ.body, color: INK, bold: true,
        }),
      ],
    }));

    // Objectifs du module — badge gris centré
    body_.push(emptyP(160, 0));
    body_.push(sectionBadge("Objectifs du module"));
    body_.push(emptyP(80, 0));
    for (const o of mod.objectifs) body_.push(bullet(o));

    // Contenu — badge gris centré
    body_.push(emptyP(200, 0));
    body_.push(sectionBadge("Contenu"));
    body_.push(emptyP(80, 0));
    for (const sub of mod.contenu) {
      body_.push(h3(sub.titre));
      for (const b of sub.bullets) body_.push(bullet(b));
    }

    // Modalités d'évaluation — badge gris centré
    body_.push(emptyP(200, 0));
    body_.push(sectionBadge("Modalités d'évaluation"));
    body_.push(emptyP(80, 0));
    for (const e of mod.evaluation) body_.push(bullet(e));
  }

  // Organisation de la formation (FIXE)
  body_.push(new Paragraph({ children: [new PageBreak()] }));
  body_.push(eyebrow("ORGANISATION"));
  body_.push(...h1("Organisation de la formation."));
  for (const p of TEXTE_ORGANISATION) body_.push(body(p));

  // Évaluation de la formation (FIXE)
  body_.push(emptyP(180, 0));
  body_.push(eyebrow("ÉVALUATION"));
  body_.push(...h1("Évaluation de la formation."));
  for (const p of TEXTE_EVALUATION) body_.push(body(p));

  // Closer — spacing réduit + keepLines : la devise doit rester sur la même
  // page que la section Évaluation, jamais seule sur une page de plus.
  body_.push(emptyP(240, 0));
  body_.push(new Paragraph({
    alignment: AlignmentType.CENTER,
    keepLines: true,
    children: [new TextRun({
      text: "L'accompagnement qui donne du sens.",
      font: FONT_DISPLAY, italics: true, size: SZ.h1, color: KAELIA_VIOLET,
    })],
  }));

  const bodySection = {
    properties: {
      page: {
        size: { width: cm(21), height: cm(29.7) },
        margin: { top: cm(2.2), bottom: cm(2.0), left: cm(2.0), right: cm(2.0) },
      },
    },
    headers: { default: makeHeader() },
    footers: { default: makeFooter() },
    children: body_,
  };

  return new Document({
    creator: "Kaelia",
    title: `Programme de Formation · ${data.meta.theme}`,
    description: data.meta.formation,
    styles: {
      default: {
        document: {
          run: { font: FONT_BODY, size: SZ.body, color: GRAPHITE },
        },
      },
      paragraphStyles: [
        { id: "Heading1", name: "Heading 1", basedOn: "Normal", next: "Normal", quickFormat: true,
          run: { font: FONT_DISPLAY, size: 44, bold: true, color: INK },
          paragraph: { spacing: { before: 200, after: 160 }, outlineLevel: 0 } },
        { id: "Heading2", name: "Heading 2", basedOn: "Normal", next: "Normal", quickFormat: true,
          run: { font: FONT_DISPLAY, size: SZ.h2, bold: true, color: KAELIA_VIOLET },
          paragraph: { spacing: { before: 160, after: 60 }, outlineLevel: 1 } },
      ],
    },
    sections: [coverSection, bodySection],
  });
}

async function main() {
  const outPath = process.argv[2] || path.join(process.cwd(), "kaelia-programme.docx");
  const dataPath = process.argv[3];
  let data = DOC_DATA;
  if (dataPath) {
    const resolved = path.resolve(dataPath);
    delete require.cache[resolved];
    const mod = require(resolved);
    data = mod.DOC_DATA || mod.default || mod;
  }
  const doc = buildDoc(data);
  const buffer = await Packer.toBuffer(doc);
  fs.writeFileSync(outPath, buffer);
  console.log("Programme de formation Kaelia généré :", outPath);
}

main().catch(err => { console.error("Erreur :", err); process.exit(1); });
