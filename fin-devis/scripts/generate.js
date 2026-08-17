// =============================================================================
// fin-devis — Devis / détail du coût pédagogique (tous financeurs, requis AKTO hors-catalogue)
// Usage : NODE_PATH=/opt/homebrew/lib/node_modules node generate.js "<out>.docx" "<data>.js"
// =============================================================================

const path = require("path");
const K = require("./kaelia_doc.js");
const { Paragraph, TextRun } = require("docx");

const DATA = {
  org: {
    name: "KAELIA",
    lines: ["198 rue des amis de l'industrie, 42590 Neulise", "SIRET 953 672 235 00017 · NDA 84420407442 · Qualiopi"],
    footer: "KAELIA · forma'coach · organisme certifié Qualiopi",
    docTitle: "Devis — coût pédagogique",
  },
  numero: "DV-2026-0001",
  client: { raisonSociale: "KAELIA (SAS)", contact: "Killian Guillemois", adresse: "198 rue des amis de l'industrie, 42590 Neulise", siret: "953 672 235 00017" },
  formation: { intitule: "Intégrer l'IA générative dans ses pratiques professionnelles", dates: "du 8 au 9 décembre 2026", duree: "14 heures", modalite: "présentiel", effectif: "1 participant" },
  // lignes du devis : [désignation, quantité, prix unitaire HT, total HT]
  lignes: [
    ["Action de formation — coût pédagogique", "14 h", "171,43 €", "2 400,00 €"],
  ],
  totaux: { totalHT: "2 400,00 €", tva: "Exonération de TVA (art. 261-4-4° a du CGI)", totalTTC: "2 400,00 €" },
  conditions: "Devis valable 30 jours. Prise en charge visée : OPCO AKTO (formation hors catalogue, dépôt MyGestion avant démarrage).",
  signature: { lieu: "Neulise", date: "le 20 novembre 2026" },
};

function build(d) {
  const c = [];
  c.push(...K.letterhead(d.org));
  c.push(new Paragraph({ children: [new TextRun({ text: `Devis n° ${d.numero}`, font: K.tokens.FONT_BODY, size: K.tokens.SZ.small, color: K.tokens.GREY })] }));
  c.push(K.title("Devis — coût pédagogique"));

  c.push(K.h2("Client"));
  c.push(K.fieldsTable([
    ["Raison sociale", d.client.raisonSociale],
    ["Contact", d.client.contact || "—"],
    ["Adresse", d.client.adresse || "—"],
    ["SIRET", d.client.siret || "—"],
  ]));

  c.push(K.h2("Formation"));
  c.push(K.fieldsTable([
    ["Intitulé", d.formation.intitule],
    ["Dates", d.formation.dates],
    ["Durée", d.formation.duree],
    ["Modalité", d.formation.modalite],
    ["Effectif", d.formation.effectif || "—"],
  ]));

  c.push(K.h2("Détail du coût pédagogique (HT)"));
  c.push(K.dataTable(["Désignation", "Quantité", "PU HT", "Total HT"], d.lignes, { columnWidths: [4400, 1600, 1700, 1800] }));

  c.push(K.fieldsTable([
    ["Total HT", d.totaux.totalHT],
    ["TVA", d.totaux.tva],
    ["Total TTC", d.totaux.totalTTC],
  ]));

  c.push(K.body(d.conditions));
  c.push(K.emptyP(160, 0));
  c.push(new Paragraph({ children: [new TextRun({ text: `Fait à ${d.signature.lieu}, ${d.signature.date}.`, font: K.tokens.FONT_BODY, size: K.tokens.SZ.body, color: K.tokens.GRAPHITE })] }));
  c.push(K.emptyP(120, 0));
  c.push(K.signatureBlock(
    { heading: "Pour l'organisme de formation", lines: [d.org.name] },
    { heading: "Bon pour accord (client)", lines: [d.client.contact || d.client.raisonSociale] }
  ));
  return K.buildAdminDoc(c, d.org);
}

async function main() {
  const outPath = process.argv[2] || path.join(process.cwd(), "devis.docx");
  const dataPath = process.argv[3];
  let data = DATA;
  if (dataPath) { const r = path.resolve(dataPath); delete require.cache[r]; const m = require(r); data = m.DATA || m.default || m; }
  await K.writeDoc(build(data), outPath);
}
main().catch(e => { console.error("Erreur :", e); process.exit(1); });
