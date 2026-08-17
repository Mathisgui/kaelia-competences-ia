// =============================================================================
// kaelia_doc.js — primitives Kaelia pour documents ADMINISTRATIFS (financement)
// Lib compacte et self-contained (copiée dans chaque skill fin-* docx).
// Branding aligné sur kaelia-word (Design System officiel).
// Helpers : letterhead, title, eyebrow, body, fieldsTable, bullets, dataTable,
//           signatureBlock, footer, buildAdminDoc.
// =============================================================================

const fs = require("fs");
const path = require("path");
const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, ImageRun,
  Footer, AlignmentType, BorderStyle, WidthType, ShadingType, VerticalAlign,
  LineRuleType,
} = require("docx");

// ---- Tokens (DS Kaelia) ----
const KAELIA_VIOLET = "5A226A";
const KAELIA_AUBERGINE = "360A42";
const INK = "111111";
const GRAPHITE = "2A2A2A";
const GREY = "6E6E6E";
const PAPER = "FBFAF8";
const CREAM = "F7F5F2";
const HAIRLINE = "E5E1DD";
const WHITE = "FFFFFF";
const FONT_DISPLAY = "Montserrat";
const FONT_BODY = "Inter";

const SZ = { title: 40, h2: 30, lede: 24, body: 22, small: 20, eyebrow: 16, footer: 16 };
const SPACING = { tight: 252, snug: 288, normal: 360, relaxed: 408 };
const TRACK_EYEBROW = 60;

const cm = (v) => Math.round(v * 567);
const NONE = { style: BorderStyle.NONE, size: 0, color: WHITE };
const noBorders = { top: NONE, bottom: NONE, left: NONE, right: NONE, insideHorizontal: NONE, insideVertical: NONE };

// Default logo path (kaelia-word assets — single branding source). Override via opts.logoPath.
const DEFAULT_LOGO = path.resolve(__dirname, "../../kaelia-word/assets/logo-kaelia-color.png");

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

// ---- Letterhead : logo + organisme Kaelia (en-tête du document) ----
function letterhead(org, opts = {}) {
  const logoPath = opts.logoPath || DEFAULT_LOGO;
  const out = [];
  if (fs.existsSync(logoPath)) {
    out.push(new Paragraph({
      spacing: { before: 0, after: 120 },
      children: [new ImageRun({ data: fs.readFileSync(logoPath), transformation: { width: 120, height: 40 } })],
    }));
  }
  const lines = org.lines || [];
  out.push(new Paragraph({
    spacing: { before: 0, after: 40 },
    children: [new TextRun({ text: org.name || "Kaelia", font: FONT_DISPLAY, size: SZ.body, bold: true, color: INK })],
  }));
  for (const l of lines) {
    out.push(new Paragraph({
      spacing: { before: 0, after: 20, line: SPACING.normal, lineRule: LineRuleType.AUTO },
      children: [new TextRun({ text: l, font: FONT_BODY, size: SZ.small, color: GREY })],
    }));
  }
  out.push(brandRule());
  return out;
}

function brandRule(opts = {}) {
  const w = opts.w || 1.6;
  return new Table({
    width: { size: cm(w), type: WidthType.DXA },
    borders: noBorders,
    rows: [new TableRow({
      height: { value: 50, rule: "exact" },
      children: [new TableCell({
        width: { size: cm(w), type: WidthType.DXA },
        borders: { top: { style: BorderStyle.SINGLE, size: 24, color: KAELIA_VIOLET }, bottom: NONE, left: NONE, right: NONE },
        margins: { top: 0, bottom: 0, left: 0, right: 0 },
        children: [emptyP()],
      })],
    })],
  });
}

function eyebrow(text) {
  return new Paragraph({
    spacing: { before: 240, after: 60 },
    children: [new TextRun({ text: text.toUpperCase(), font: FONT_BODY, size: SZ.eyebrow, color: GREY, characterSpacing: TRACK_EYEBROW })],
  });
}

function title(text) {
  return new Paragraph({
    spacing: { before: 120, after: 200, line: SPACING.tight, lineRule: LineRuleType.AUTO },
    children: [new TextRun({ text, font: FONT_DISPLAY, size: SZ.title, bold: true, color: INK, characterSpacing: -10 })],
  });
}

function h2(text) {
  return new Paragraph({
    spacing: { before: 240, after: 100 },
    children: [new TextRun({ text, font: FONT_DISPLAY, size: SZ.h2, bold: true, color: KAELIA_VIOLET })],
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
    children: [new TextRun({ text: "→  ", font: FONT_BODY, size: SZ.body, color: KAELIA_VIOLET, bold: true }), ...parseInline(text, { color: GRAPHITE })],
  });
}

// ---- Fields table : 2-col label / value (cream label, hairline rows) ----
function fieldsTable(rows) {
  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: noBorders,
    columnWidths: [3300, 6200],
    rows: rows.map(([label, value]) => new TableRow({
      children: [
        new TableCell({
          width: { size: 3300, type: WidthType.DXA },
          shading: { type: ShadingType.CLEAR, color: "auto", fill: CREAM },
          borders: { top: { style: BorderStyle.SINGLE, size: 2, color: HAIRLINE }, bottom: { style: BorderStyle.SINGLE, size: 2, color: HAIRLINE }, left: NONE, right: NONE },
          margins: { top: 140, bottom: 140, left: 200, right: 160 },
          verticalAlign: VerticalAlign.CENTER,
          children: [new Paragraph({ children: [new TextRun({ text: label, font: FONT_BODY, size: SZ.small, color: GREY })] })],
        }),
        new TableCell({
          width: { size: 6200, type: WidthType.DXA },
          borders: { top: { style: BorderStyle.SINGLE, size: 2, color: HAIRLINE }, bottom: { style: BorderStyle.SINGLE, size: 2, color: HAIRLINE }, left: NONE, right: NONE },
          margins: { top: 140, bottom: 140, left: 220, right: 160 },
          verticalAlign: VerticalAlign.CENTER,
          children: [new Paragraph({ children: parseInline(String(value ?? ""), { color: INK }) })],
        }),
      ],
    })),
  });
}

// ---- Data table : violet header + rows (used for émargement, planning) ----
function dataTable(headerCells, rows, opts = {}) {
  const widths = opts.columnWidths;
  const headRow = new TableRow({
    tableHeader: true,
    children: headerCells.map(h => new TableCell({
      shading: { type: ShadingType.CLEAR, color: "auto", fill: KAELIA_VIOLET },
      borders: noBorders,
      margins: { top: 140, bottom: 140, left: 160, right: 120 },
      verticalAlign: VerticalAlign.CENTER,
      children: [new Paragraph({ children: [new TextRun({ text: h, font: FONT_BODY, size: SZ.small, color: WHITE, bold: true })] })],
    })),
  });
  const dataRows = rows.map((row, idx) => new TableRow({
    children: row.map((cell) => new TableCell({
      shading: { type: ShadingType.CLEAR, color: "auto", fill: idx % 2 === 0 ? WHITE : "F1E8F5" },
      borders: { top: { style: BorderStyle.SINGLE, size: 2, color: HAIRLINE }, bottom: { style: BorderStyle.SINGLE, size: 2, color: HAIRLINE }, left: NONE, right: NONE },
      margins: { top: 200, bottom: 200, left: 160, right: 120 },
      verticalAlign: VerticalAlign.CENTER,
      children: [new Paragraph({ spacing: { line: SPACING.normal, lineRule: LineRuleType.AUTO }, children: parseInline(String(cell ?? ""), { color: GRAPHITE, size: SZ.small }) })],
    })),
  }));
  return new Table({ width: { size: 100, type: WidthType.PERCENTAGE }, borders: noBorders, columnWidths: widths, rows: [headRow, ...dataRows] });
}

// ---- Signature block : 2 columns (organisme / partie) ----
function signatureBlock(left, right) {
  const cell = (heading, lines) => new TableCell({
    width: { size: 4750, type: WidthType.DXA },
    borders: noBorders,
    margins: { top: 200, bottom: 0, left: 0, right: 240 },
    children: [
      new Paragraph({ spacing: { after: 60 }, children: [new TextRun({ text: heading, font: FONT_BODY, size: SZ.small, color: GREY })] }),
      ...lines.map(l => new Paragraph({ spacing: { after: 20 }, children: [new TextRun({ text: l, font: FONT_BODY, size: SZ.small, color: INK })] })),
      emptyP(360, 0),
      new Paragraph({ children: [new TextRun({ text: "Signature et cachet :", font: FONT_BODY, size: SZ.small, color: GREY })] }),
    ],
  });
  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: noBorders,
    columnWidths: [4750, 4750],
    rows: [new TableRow({ children: [cell(left.heading, left.lines || []), cell(right.heading, right.lines || [])] })],
  });
}

function makeFooter(org) {
  return new Footer({
    children: [new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [new TextRun({ text: (org && org.footer) || "KAELIA · forma'coach · organisme certifié Qualiopi", font: FONT_BODY, size: SZ.footer, color: GREY, characterSpacing: 24 })],
    })],
  });
}

// ---- buildAdminDoc : assemble une liste de children en doc Kaelia A4 paper ----
function buildAdminDoc(children, org = {}) {
  return new Document({
    creator: "Kaelia",
    title: org.docTitle || "Document Kaelia",
    styles: { default: { document: { run: { font: FONT_BODY, size: SZ.body, color: GRAPHITE } } } },
    sections: [{
      properties: { page: { size: { width: cm(21), height: cm(29.7) }, margin: { top: cm(2), bottom: cm(2), left: cm(2.2), right: cm(2.2) } } },
      footers: { default: makeFooter(org) },
      children,
    }],
  });
}

async function writeDoc(doc, outPath) {
  const buffer = await Packer.toBuffer(doc);
  fs.writeFileSync(outPath, buffer);
  console.log("Document Kaelia généré :", outPath);
}

module.exports = {
  // primitives
  letterhead, brandRule, eyebrow, title, h2, body, bullet, fieldsTable, dataTable,
  signatureBlock, makeFooter, emptyP, parseInline, buildAdminDoc, writeDoc,
  // tokens (si un skill veut composer du custom)
  tokens: { KAELIA_VIOLET, KAELIA_AUBERGINE, INK, GRAPHITE, GREY, PAPER, CREAM, HAIRLINE, WHITE, FONT_DISPLAY, FONT_BODY, SZ, SPACING },
};
