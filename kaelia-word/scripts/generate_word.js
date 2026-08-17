// =============================================================================
// Kaelia — Word generator (v4) — base editorial v2 + tables + cover logo bottom
// =============================================================================
// Usage : node generate_word.js "/path/to/output.docx"
// =============================================================================

const fs = require("fs");
const path = require("path");
const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, ImageRun,
  Header, Footer, AlignmentType, BorderStyle, WidthType, ShadingType,
  VerticalAlign, PageNumber, PageBreak, TabStopType, LineRuleType,
  TableLayoutType,
} = require("docx");

// Largeur utile du corps (A4 21cm - marges 2×2.5cm), en twips. Sert de largeur
// fixe aux tableaux mono-cellule pour survivre à la conversion Google Docs.
const CONTENT_W = 9071;

const SKILL_PATH = __dirname.replace(/\/scripts$/, "");

// ========== KAELIA TOKENS ==========
const KAELIA_VIOLET      = "5A226A";
const KAELIA_VIOLET_DEEP = "3F1349";
const KAELIA_VIOLET_SOFT = "CB6CE6";
const KAELIA_AUBERGINE   = "360A42";
const INK                = "111111";
const GRAPHITE           = "2A2A2A";
const GREY               = "6E6E6E";
const GREY_2             = "9A9A9A";
const PAPER              = "FBFAF8";
const CREAM              = "F7F5F2";
const LAVENDER           = "F1E8F5";    // light tint for alternating table rows
const WHITE              = "FFFFFF";

const FONT_DISPLAY = "Montserrat";
const FONT_BODY    = "Inter";

// ========== TYPE SCALE (v2 restrained, no oversized titles) ==========
const SZ = {
  cover:   64,    // 32pt — cover hero
  h1:      44,    // 22pt
  h2:      32,    // 16pt
  h3:      26,    // 13pt
  lede:    24,    // 12pt
  body:    22,    // 11pt
  small:   20,    // 10pt
  eyebrow: 16,    // 8pt
  footer:  16,    // 8pt
};
const SPACING = { tight: 252, snug: 288, normal: 360, relaxed: 408 };
const TRACK_EYEBROW = 60;
const TRACK_DISPLAY = -10;
const TRACK_WORDMARK = 24;

// =============================================================================
// DOC_DATA
// =============================================================================
const DOC_DATA = {
  meta: {
    cornerMark: "L'accompagnement qui donne du sens",
    eyebrow: "DOCUMENT · 2026",
    title: "Performons ensemble.",
    titleAccent: "Trouvons la formation qui vous ressemble.",
    date: "Mai 2026",
  },
  preambule: {
    eyebrow: "PRÉAMBULE",
    title: "Pourquoi ce document.",
    lede: "Kaelia accompagne les dirigeants, les PME et les porteurs de projets dans leurs transitions stratégiques.",
    body: [
      "Ce document synthétise notre méthode, nos domaines d'expertise et les engagements que nous prenons à vos côtés. Il pose le cadre d'une relation de confiance, structurée autour de trois principes simples.",
      "Nous croyons qu'une formation ne se résume pas à transmettre une compétence. Elle construit une trajectoire — la vôtre, celle de vos équipes, celle de votre organisation.",
    ],
  },
  sections: [
    {
      eyebrow: "CHAPITRE 01",
      title: "Notre méthode.",
      blocks: [
        { type: "p", text: "Nous écoutons d'abord. Nous comprenons votre contexte, vos contraintes, vos ambitions. Puis nous construisons un parcours qui vous ressemble — court ou long, individuel ou collectif, présentiel ou distanciel." },
        { type: "p", text: "Trois principes guident chaque accompagnement : Écoute, Confiance, Proximité. Trois valeurs simples qui structurent une relation durable." },
        { type: "bullets", items: [
          "Diagnostic personnalisé en amont.",
          "Parcours sur-mesure, jamais standardisé.",
          "Suivi post-formation pour ancrer les acquis.",
        ]},
        { type: "callout", title: "À retenir.", body: "La loi impose le mouvement, pas la direction. Kaelia vous aide à choisir la vôtre." },
      ],
    },
    {
      eyebrow: "CHAPITRE 02",
      title: "Nos domaines d'expertise.",
      blocks: [
        { type: "p", text: "Six domaines couvrent l'essentiel des enjeux d'une organisation moderne. Chacun est piloté par des experts certifiés, à jour des dernières évolutions réglementaires et technologiques." },
        { type: "table", header: ["Domaine", "Périmètre couvert"], rows: [
          ["juridique",            "droit social, contrats, conformité, RGPD"],
          ["rh/rse",               "management, transformation, impact, QVT"],
          ["stratégie d'entreprise", "pilotage, gouvernance, performance, vision"],
          ["numérique",            "outils, méthodes, productivité, automatisation"],
          ["ia",                   "usages métiers, gouvernance, formation des équipes"],
          ["sur-mesure",           "programmes conçus pour votre contexte"],
        ]},
      ],
    },
    {
      eyebrow: "CHAPITRE 03",
      title: "Les résultats parlent.",
      blocks: [
        { type: "p", text: "Depuis notre création, plus de 300 stagiaires nous ont confié leur montée en compétences. La progression mesurée à 6 mois témoigne de l'ancrage des acquis dans la pratique quotidienne." },
        { type: "kpis", items: [
          { value: "+300",  label: "Stagiaires formés" },
          { value: "+60%",  label: "Compétences acquises" },
          { value: "4,9/5", label: "Satisfaction" },
        ]},
        { type: "quote", text: "Une formation Kaelia, ce n'est pas un module à cocher : c'est un cap à tenir.", author: "Karine Weil, co-fondatrice" },
      ],
    },
  ],
  contact: {
    eyebrow: "CONTACT",
    title: "Discutons-en.",
    body: "Une première rencontre permet de cadrer les besoins, sans engagement.",
    lines: [
      ["Adresse", "198 rue des amis de l'industrie, 42590 Neulise"],
      ["Tél",     "01 23 45 67 89"],
      ["Site",    "kaelia-formacoach.com"],
      ["Email",   "contact@kaelia.fr"],
    ],
  },
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

// === Eyebrow ===
function eyebrow(text, opts = {}) {
  return new Paragraph({
    spacing: { before: opts.before ?? 200, after: opts.after ?? 60 },
    children: [new TextRun({
      text: text.toUpperCase(),
      font: FONT_BODY, size: SZ.eyebrow,
      color: opts.color || GREY,
      characterSpacing: TRACK_EYEBROW,
    })],
  });
}

// === Brand rule (violet 3pt × 1.6cm) ===
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

// === H1 (chapter title, paper) — rule above + INK title ===
function h1(text) {
  return [
    brandRule({ w: 1.6 }),
    new Paragraph({
      spacing: { before: 120, after: 200 },
      children: [new TextRun({
        text, font: FONT_DISPLAY, size: SZ.h1, color: INK, bold: true,
        characterSpacing: TRACK_DISPLAY,
      })],
    }),
  ];
}

// === H2 ===
function h2(text) {
  return new Paragraph({
    spacing: { before: 240, after: 100 },
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
  return new Paragraph({
    spacing: { before: 60, after: 140, line: SPACING.relaxed, lineRule: LineRuleType.AUTO },
    children: parseInline(text, { color: GRAPHITE }),
  });
}

function bullet(text) {
  return new Paragraph({
    spacing: { before: 40, after: 60, line: SPACING.normal, lineRule: LineRuleType.AUTO },
    indent: { left: 360 },
    children: [
      new TextRun({ text: "→  ", font: FONT_BODY, size: SZ.body, color: KAELIA_VIOLET, bold: true }),
      ...parseInline(text, { color: GRAPHITE }),
    ],
  });
}

// === Callout (cream + violet left bar) ===
function callout(opts) {
  const left = { style: BorderStyle.SINGLE, size: 32, color: KAELIA_VIOLET };
  return new Table({
    width: { size: CONTENT_W, type: WidthType.DXA },
    columnWidths: [CONTENT_W],
    layout: TableLayoutType.FIXED,
    borders: noBorders,
    rows: [new TableRow({
      children: [new TableCell({
        width: { size: CONTENT_W, type: WidthType.DXA },
        shading: { type: ShadingType.CLEAR, color: "auto", fill: CREAM },
        borders: { left, top: NONE, right: NONE, bottom: NONE },
        margins: { top: 240, bottom: 240, left: 360, right: 360 },
        children: [
          ...(opts.title ? [new Paragraph({ children: [new TextRun({
            text: opts.title, font: FONT_DISPLAY, size: SZ.h3, color: KAELIA_VIOLET, bold: true,
          })]})] : []),
          new Paragraph({
            spacing: { before: opts.title ? 80 : 0, line: SPACING.normal, lineRule: LineRuleType.AUTO },
            children: parseInline(opts.body, { color: GRAPHITE }),
          }),
        ],
      })],
    })],
  });
}

// === Pullquote ===
function pullquote(text, author) {
  const out = [
    new Paragraph({
      spacing: { before: 280, after: 80, line: SPACING.snug, lineRule: LineRuleType.AUTO },
      indent: { left: 480 },
      children: [
        new TextRun({ text: "« ", font: FONT_DISPLAY, size: 36, color: KAELIA_VIOLET_SOFT }),
        new TextRun({ text, font: FONT_DISPLAY, italics: true, size: 28, color: KAELIA_VIOLET }),
        new TextRun({ text: " »", font: FONT_DISPLAY, size: 36, color: KAELIA_VIOLET_SOFT }),
      ],
    }),
  ];
  if (author) {
    out.push(new Paragraph({
      spacing: { before: 40, after: 280 },
      indent: { left: 480 },
      children: [new TextRun({
        text: "— " + author, font: FONT_BODY, size: SZ.small,
        color: GREY, characterSpacing: 30,
      })],
    }));
  }
  return out;
}

// === KPI row (3 cream cards) ===
function kpiRow(kpis) {
  const cells = kpis.map(k => new TableCell({
    borders: noBorders,
    shading: { type: ShadingType.CLEAR, color: "auto", fill: CREAM },
    margins: { top: 320, bottom: 320, left: 160, right: 160 },
    verticalAlign: VerticalAlign.CENTER,
    children: [
      new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({
        text: k.value, font: FONT_DISPLAY, size: 56,
        bold: true, color: KAELIA_VIOLET, characterSpacing: -15,
      })]}),
      new Paragraph({
        alignment: AlignmentType.CENTER, spacing: { before: 60 },
        children: [new TextRun({
          text: k.label.toUpperCase(), font: FONT_BODY, size: SZ.eyebrow,
          color: GREY, characterSpacing: TRACK_EYEBROW,
        })],
      }),
    ],
  }));
  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: noBorders,
    columnWidths: [3000, 3000, 3000],
    rows: [new TableRow({ children: cells })],
  });
}

// === Data table — violet header row + alternating white / lavender ===
function dataTable(headerCells, rows) {
  const headRow = new TableRow({
    tableHeader: true,
    children: headerCells.map(h => new TableCell({
      shading: { type: ShadingType.CLEAR, color: "auto", fill: KAELIA_VIOLET },
      borders: noBorders,
      margins: { top: 180, bottom: 180, left: 280, right: 200 },
      verticalAlign: VerticalAlign.CENTER,
      children: [new Paragraph({ children: [new TextRun({
        text: h, font: FONT_BODY, size: SZ.body, color: WHITE, bold: true,
        characterSpacing: 20,
      })]})],
    })),
  });
  const dataRows = rows.map((row, idx) => new TableRow({
    children: row.map((cell, ci) => new TableCell({
      shading: { type: ShadingType.CLEAR, color: "auto", fill: idx % 2 === 0 ? WHITE : LAVENDER },
      borders: {
        top: { style: BorderStyle.SINGLE, size: 2, color: "E5E1DD" },
        bottom: { style: BorderStyle.SINGLE, size: 2, color: "E5E1DD" },
        left: NONE, right: NONE,
      },
      margins: { top: 160, bottom: 160, left: 280, right: 200 },
      verticalAlign: VerticalAlign.CENTER,
      children: [new Paragraph({
        spacing: { line: SPACING.normal, lineRule: LineRuleType.AUTO },
        children: parseInline(cell, { color: ci === 0 ? INK : GRAPHITE }),
      })],
    })),
  }));
  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: noBorders,
    columnWidths: [3300, 6200],
    rows: [headRow, ...dataRows],
  });
}

// === Contact line "LABEL    value" ===
function contactLine(label, value) {
  return new Paragraph({
    spacing: { before: 60, after: 60, line: SPACING.normal, lineRule: LineRuleType.AUTO },
    children: [
      new TextRun({
        text: label.toUpperCase().padEnd(10, " "),
        font: FONT_BODY, size: SZ.eyebrow,
        color: GREY, characterSpacing: TRACK_EYEBROW,
      }),
      new TextRun({ text: "   " + value, font: FONT_BODY, size: SZ.body, color: INK }),
    ],
  });
}

// =============================================================================
// COVER — v2 style restored: editorial paper, INK + violet italic accent,
// brand rule, eyebrow tracked. Logo + tagline kept at the BOTTOM (the bit
// the user liked from v3).
// =============================================================================
function coverChildren(meta) {
  const out = [];

  // Corner-mark grey tracked at the very top
  out.push(new Paragraph({
    spacing: { before: 0, after: 0 },
    children: [new TextRun({
      text: meta.cornerMark.toUpperCase(),
      font: FONT_BODY, size: SZ.eyebrow,
      color: GREY, characterSpacing: 80,
    })],
  }));

  // Vertical breathing (~5cm)
  out.push(emptyP(3000, 0));

  // Eyebrow violet tracked
  out.push(new Paragraph({
    spacing: { before: 0, after: 200 },
    children: [new TextRun({
      text: meta.eyebrow.toUpperCase(),
      font: FONT_BODY, size: SZ.eyebrow,
      color: KAELIA_VIOLET, characterSpacing: 80,
    })],
  }));

  // Title — 32pt INK
  out.push(new Paragraph({
    spacing: { before: 0, after: 80, line: SPACING.tight, lineRule: LineRuleType.AUTO },
    children: [new TextRun({
      text: meta.title, font: FONT_DISPLAY, size: SZ.cover,
      bold: true, color: INK, characterSpacing: -20,
    })],
  }));

  // Accent — italic violet 32pt
  out.push(new Paragraph({
    spacing: { before: 0, after: 280, line: SPACING.tight, lineRule: LineRuleType.AUTO },
    children: [new TextRun({
      text: meta.titleAccent, font: FONT_DISPLAY, italics: true,
      size: SZ.cover, color: KAELIA_VIOLET, characterSpacing: -20,
    })],
  }));

  // Brand rule violet 3pt × 1.6cm
  out.push(brandRule({ w: 1.6 }));

  // Date — tracked grey
  out.push(new Paragraph({
    spacing: { before: 280, after: 0 },
    children: [new TextRun({
      text: meta.date.toUpperCase(),
      font: FONT_BODY, size: SZ.eyebrow,
      color: GREY, characterSpacing: 80,
    })],
  }));

  // (Logo + tagline are rendered in the global footer — visible on every page.)
  return out;
}

// =============================================================================
// Page footer — 3-col table : logo (left) + tagline italic violet (center)
// + page number (right). Always present on every page, including cover.
// =============================================================================
function makeFooter(opts = {}) {
  const showPageNum = opts.showPageNum !== false;
  const brand = opts.brand || {};
  // Backward-compatible defaults: Kaelia branding unless a doc overrides it
  // (e.g. non-Kaelia deliverables via brand: { logoPath: null, tagline: "...", wordmark: "..." })
  const logoPath = brand.logoPath === null
    ? null
    : (brand.logoPath ? path.resolve(brand.logoPath) : path.join(SKILL_PATH, "assets/logo-kaelia-color.png"));
  const hasLogo = logoPath && fs.existsSync(logoPath);
  const tagline = brand.tagline !== undefined ? brand.tagline : "L'accompagnement qui donne du sens.";
  const wordmark = brand.wordmark !== undefined ? brand.wordmark : "KAELIA · forma'coach";

  // Left cell — logo (small, square 0.9 cm)
  const leftChildren = hasLogo ? [new Paragraph({
    spacing: { before: 0, after: 0 },
    children: [new ImageRun({
      data: fs.readFileSync(logoPath),
      transformation: { width: 34, height: 34 },
    })],
  })] : [new Paragraph({ children: [new TextRun("")] })];

  // Center cell — tagline
  const centerChildren = tagline ? [new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { before: 80, after: 0 },
    children: [new TextRun({
      text: tagline,
      font: FONT_DISPLAY, italics: true, size: SZ.small,
      color: KAELIA_VIOLET,
    })],
  })] : [new Paragraph({ children: [new TextRun("")] })];

  // Right cell — page number (or wordmark on cover)
  const rightChildren = [new Paragraph({
    alignment: AlignmentType.RIGHT,
    spacing: { before: 100, after: 0 },
    children: showPageNum
      ? [
          new TextRun({ children: [PageNumber.CURRENT], font: FONT_BODY, size: SZ.footer, color: GREY }),
          new TextRun({ text: " / ", font: FONT_BODY, size: SZ.footer, color: GREY }),
          new TextRun({ children: [PageNumber.TOTAL_PAGES], font: FONT_BODY, size: SZ.footer, color: GREY }),
        ]
      : [new TextRun({
          text: wordmark,
          font: FONT_BODY, size: SZ.footer, color: GREY,
          characterSpacing: TRACK_WORDMARK,
        })],
  })];

  return new Footer({
    children: [
      new Table({
        width: { size: 100, type: WidthType.PERCENTAGE },
        borders: noBorders,
        columnWidths: [2400, 4500, 2400],
        rows: [new TableRow({
          children: [
            new TableCell({
              width: { size: 2400, type: WidthType.DXA },
              borders: noBorders,
              margins: { top: 0, bottom: 0, left: 0, right: 0 },
              verticalAlign: VerticalAlign.CENTER,
              children: leftChildren,
            }),
            new TableCell({
              width: { size: 4500, type: WidthType.DXA },
              borders: noBorders,
              margins: { top: 0, bottom: 0, left: 0, right: 0 },
              verticalAlign: VerticalAlign.CENTER,
              children: centerChildren,
            }),
            new TableCell({
              width: { size: 2400, type: WidthType.DXA },
              borders: noBorders,
              margins: { top: 0, bottom: 0, left: 0, right: 0 },
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
// Render a content block
// =============================================================================
function renderBlock(b) {
  if (b.type === "h2")      return [h2(b.text)];
  if (b.type === "p")       return [body(b.text)];
  if (b.type === "bullets") return [emptyP(60, 0), ...b.items.map(bullet)];
  if (b.type === "callout") return [emptyP(200, 0), callout({ title: b.title, body: b.body })];
  if (b.type === "quote")   return pullquote(b.text, b.author);
  if (b.type === "kpis")    return [emptyP(240, 0), kpiRow(b.items), emptyP(120, 0)];
  if (b.type === "table")   return [emptyP(160, 0), dataTable(b.header, b.rows), emptyP(200, 0)];
  return [];
}

// =============================================================================
// Compose document
// =============================================================================
function buildDoc(data) {
  // Cover section (paper, no header, footer = logo+tagline only, no page number)
  const coverFooter = makeFooter({ showPageNum: false, brand: data.footer });
  const coverSection = {
    properties: {
      page: {
        size: { width: cm(21), height: cm(29.7) },
        margin: { top: cm(2.5), bottom: cm(2.5), left: cm(2.5), right: cm(2.5) },
      },
      // titlePage removed — we use a single footer for the cover (logo+tagline)
    },
    headers: { default: new Header({ children: [new Paragraph({ children: [new TextRun("")] })] }) },
    footers: { default: coverFooter },
    children: coverChildren(data.meta),
  };

  // Body section
  const body_ = [];

  // Preamble
  body_.push(eyebrow(data.preambule.eyebrow));
  body_.push(...h1(data.preambule.title));
  body_.push(lede(data.preambule.lede));
  for (const p of data.preambule.body) body_.push(body(p));

  // Chapters
  for (const sec of data.sections) {
    body_.push(emptyP(360, 0));
    body_.push(eyebrow(sec.eyebrow));
    body_.push(...h1(sec.title));
    for (const b of sec.blocks) body_.push(...renderBlock(b));
  }

  // Contact
  body_.push(new Paragraph({ children: [new PageBreak()] }));
  body_.push(eyebrow(data.contact.eyebrow));
  body_.push(...h1(data.contact.title));
  body_.push(body(data.contact.body));
  body_.push(emptyP(120, 0));
  for (const [k, v] of data.contact.lines) body_.push(contactLine(k, v));
  body_.push(emptyP(280, 0));
  const closingLine = data.contact.closingLine !== undefined
    ? data.contact.closingLine
    : "L'accompagnement qui donne du sens.";
  if (closingLine) {
    body_.push(new Paragraph({
      children: [new TextRun({
        text: closingLine,
        font: FONT_DISPLAY, italics: true, size: SZ.h2, color: KAELIA_VIOLET,
      })],
    }));
  }

  const bodySection = {
    properties: {
      page: {
        size: { width: cm(21), height: cm(29.7) },
        margin: { top: cm(2.5), bottom: cm(2.5), left: cm(2.5), right: cm(2.5) },
      },
    },
    footers: { default: makeFooter({ brand: data.footer }) },
    children: body_,
  };

  return new Document({
    creator: data.meta.creator || "Kaelia",
    title: data.meta.title,
    description: data.meta.titleAccent,
    styles: {
      default: {
        document: {
          run: { font: FONT_BODY, size: SZ.body, color: GRAPHITE },
        },
      },
    },
    sections: [coverSection, bodySection],
  });
}

async function main() {
  const outPath = process.argv[2] || path.join(process.cwd(), "kaelia-document.docx");
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
  console.log("Kaelia Word document généré :", outPath);
}

main().catch(err => { console.error("Erreur :", err); process.exit(1); });
