// =============================================================================
// fin-attestation-presence — Attestation de présence ET de règlement (FIFPL)
// Document exigé par le FIF-PL en fin de formation pour débloquer le remboursement.
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
    docTitle: "Attestation de présence et de règlement",
  },
  professionnel: { nom: "Maître Claire Martin", profession: "Avocate", siret: "222 222 222 00022" },
  formation: {
    intitule: "Intelligence artificielle et outils numériques pour le cabinet",
    dates: "du 3 au 4 juin 2026",
    duree: "14 heures",
    modalite: "présentiel",
    lieu: "Paris (75)",
  },
  reglement: { montant: "600 €", moyen: "virement", dateReglement: "le 4 juin 2026" },
  signature: { lieu: "Neulise", date: "le 5 juin 2026" },
};

function build(d) {
  const c = [];
  c.push(...K.letterhead(d.org));
  c.push(K.eyebrow("FIF-PL · Attestation de présence et de règlement"));
  c.push(K.title("Attestation de présence et de règlement"));

  c.push(K.body(
    `Je soussigné, représentant légal de l'organisme de formation **${d.org.name}**, atteste que ` +
    `**${d.professionnel.nom}** (${d.professionnel.profession}) a suivi la formation ci-dessous ` +
    `dans son intégralité, et s'est acquitté du règlement correspondant.`
  ));

  c.push(K.h2("Formation suivie"));
  c.push(K.fieldsTable([
    ["Intitulé", d.formation.intitule],
    ["Bénéficiaire", d.professionnel.nom],
    ["SIRET", d.professionnel.siret || "—"],
    ["Dates", d.formation.dates],
    ["Durée totale", d.formation.duree],
    ["Modalité", d.formation.modalite],
    ["Lieu", d.formation.lieu || "—"],
  ]));

  c.push(K.h2("Règlement"));
  c.push(K.fieldsTable([
    ["Montant réglé", d.reglement.montant],
    ["Moyen de paiement", d.reglement.moyen],
    ["Date de règlement", d.reglement.dateReglement],
  ]));

  c.push(K.body("La présente attestation est établie pour servir et valoir ce que de droit auprès du FIF-PL, en vue du remboursement de la formation."));

  c.push(K.emptyP(160, 0));
  c.push(new Paragraph({ children: [new TextRun({ text: `Fait à ${d.signature.lieu}, ${d.signature.date}.`, font: K.tokens.FONT_BODY, size: K.tokens.SZ.body, color: K.tokens.GRAPHITE })] }));
  c.push(K.emptyP(160, 0));
  c.push(K.signatureBlock(
    { heading: "Pour l'organisme (signature et cachet)", lines: [d.org.name] },
    { heading: "Le bénéficiaire", lines: [d.professionnel.nom] }
  ));
  return K.buildAdminDoc(c, d.org);
}

async function main() {
  const outPath = process.argv[2] || path.join(process.cwd(), "attestation-presence.docx");
  const dataPath = process.argv[3];
  let data = DATA;
  if (dataPath) { const r = path.resolve(dataPath); delete require.cache[r]; const m = require(r); data = m.DATA || m.default || m; }
  await K.writeDoc(build(data), outPath);
}
main().catch(e => { console.error("Erreur :", e); process.exit(1); });
