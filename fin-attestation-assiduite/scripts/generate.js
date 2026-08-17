// =============================================================================
// fin-attestation-assiduite — Attestation d'assiduité (AGEFICE)
// Usage : NODE_PATH=/opt/homebrew/lib/node_modules \
//   node generate.js "/chemin/sortie.docx" "/chemin/data.js"
// Sans data.js → utilise DATA d'exemple ci-dessous.
// =============================================================================

const path = require("path");
const K = require("./kaelia_doc.js");
const { Paragraph, TextRun } = require("docx");

// ---- Données d'exemple (remplacées par data.js) ----
const DATA = {
  org: {
    name: "KAELIA",
    lines: ["198 rue des amis de l'industrie, 42590 Neulise", "SIRET 953 672 235 00017 · NDA 84420407442", "Organisme certifié Qualiopi"],
    footer: "KAELIA · forma'coach · organisme certifié Qualiopi",
    docTitle: "Attestation d'assiduité",
  },
  stagiaire: { nom: "Jean Dupont", entreprise: "Dupont Conseil (EI)", siret: "111 111 111 00011" },
  formation: {
    intitule: "Intégrer l'intelligence artificielle dans son activité",
    dates: "du 12 au 13 mai 2026",
    duree: "14 heures",
    modalite: "présentiel",
    lieu: "Lyon (69)",
    formateur: "Mathis Guillemois",
  },
  signature: { lieu: "Neulise", date: "le 14 mai 2026" },
};

function build(d) {
  const c = [];
  c.push(...K.letterhead(d.org));
  c.push(K.eyebrow("AGEFICE · Attestation d'assiduité"));
  c.push(K.title("Attestation d'assiduité"));

  c.push(K.body(
    `Je soussigné, représentant légal de l'organisme de formation **${d.org.name}**, atteste que ` +
    `**${d.stagiaire.nom}**, de l'entreprise **${d.stagiaire.entreprise}**, a suivi avec assiduité ` +
    `la formation décrite ci-dessous, dans sa totalité.`
  ));

  c.push(K.h2("Détail de la formation"));
  c.push(K.fieldsTable([
    ["Intitulé de la formation", d.formation.intitule],
    ["Bénéficiaire", d.stagiaire.nom],
    ["Entreprise", d.stagiaire.entreprise],
    ["SIRET", d.stagiaire.siret || "—"],
    ["Dates", d.formation.dates],
    ["Durée totale", d.formation.duree],
    ["Modalité", d.formation.modalite],
    ["Lieu", d.formation.lieu || "—"],
    ["Formateur", d.formation.formateur || "—"],
  ]));

  c.push(K.body(
    `Le bénéficiaire a été présent à l'intégralité des séquences pédagogiques pour une durée totale de ` +
    `**${d.formation.duree}**. La présente attestation est établie pour servir et valoir ce que de droit, ` +
    `notamment auprès de l'AGEFICE.`
  ));

  c.push(K.emptyP(200, 0));
  c.push(new Paragraph({ children: [new TextRun({ text: `Fait à ${d.signature.lieu}, ${d.signature.date}.`, font: K.tokens.FONT_BODY, size: K.tokens.SZ.body, color: K.tokens.GRAPHITE })] }));
  c.push(K.emptyP(160, 0));
  c.push(K.signatureBlock(
    { heading: "Pour l'organisme de formation", lines: [d.org.name] },
    { heading: "Le bénéficiaire", lines: [d.stagiaire.nom] }
  ));

  return K.buildAdminDoc(c, d.org);
}

async function main() {
  const outPath = process.argv[2] || path.join(process.cwd(), "attestation-assiduite.docx");
  const dataPath = process.argv[3];
  let data = DATA;
  if (dataPath) {
    const resolved = path.resolve(dataPath);
    delete require.cache[resolved];
    const mod = require(resolved);
    data = mod.DATA || mod.default || mod;
  }
  await K.writeDoc(build(data), outPath);
}

main().catch(err => { console.error("Erreur :", err); process.exit(1); });
