// =============================================================================
// fin-convention — Convention de formation professionnelle (générique, tous financeurs)
// Usage : NODE_PATH=/opt/homebrew/lib/node_modules node generate.js "<out>.docx" "<data>.js"
// =============================================================================

const path = require("path");
const K = require("./kaelia_doc.js");
const { Paragraph, TextRun } = require("docx");

const DATA = {
  org: {
    name: "KAELIA",
    lines: ["198 rue des amis de l'industrie, 42590 Neulise", "SIRET 953 672 235 00017 · NDA 84420407442 · Qualiopi", "Représenté par Karine Weil, co-fondatrice"],
    footer: "KAELIA · forma'coach · organisme certifié Qualiopi",
    docTitle: "Convention de formation professionnelle",
  },
  beneficiaire: {
    raisonSociale: "Dupont Conseil (EI)",
    representant: "Jean Dupont",
    adresse: "10 rue de la République, 69001 Lyon",
    siret: "111 111 111 00011",
  },
  formation: {
    intitule: "Intégrer l'intelligence artificielle dans son activité",
    objectifs: [
      "Comprendre les usages métiers de l'IA générative.",
      "Construire ses premiers automatismes et prompts utiles.",
      "Intégrer l'IA dans son organisation quotidienne en toute conformité.",
    ],
    dates: "du 12 au 13 mai 2026",
    duree: "14 heures",
    modalite: "présentiel",
    lieu: "Lyon (69)",
    effectif: "1 participant",
    formateur: "Mathis Guillemois",
  },
  financement: {
    prixHT: "1 800 €",
    financeur: "AGEFICE",
    modalite: "Prise en charge dans le cadre du dispositif AGEFICE, sous réserve d'acceptation du dossier.",
  },
  signature: { lieu: "Neulise", date: "le 5 mai 2026" },
};

function build(d) {
  const c = [];
  c.push(...K.letterhead(d.org));
  c.push(K.eyebrow("Convention · Formation professionnelle"));
  c.push(K.title("Convention de formation professionnelle"));
  c.push(K.body("Établie en application des articles L.6353-1 et suivants du Code du travail, entre les soussignés :"));

  c.push(K.h2("Entre les parties"));
  c.push(K.fieldsTable([
    ["Organisme de formation", `${d.org.name} — ${d.org.lines[0]}`],
    ["Bénéficiaire", d.beneficiaire.raisonSociale],
    ["Représenté par", d.beneficiaire.representant],
    ["Adresse", d.beneficiaire.adresse],
    ["SIRET", d.beneficiaire.siret || "—"],
  ]));

  c.push(K.h2("Article 1 — Objet et nature de l'action"));
  c.push(K.body(`L'organisme organise l'action de formation suivante : **${d.formation.intitule}**, action de formation au sens de l'article L.6313-1 du Code du travail.`));
  for (const o of d.formation.objectifs) c.push(K.bullet(o));

  c.push(K.h2("Article 2 — Modalités, durée et lieu"));
  c.push(K.fieldsTable([
    ["Intitulé", d.formation.intitule],
    ["Dates", d.formation.dates],
    ["Durée totale", d.formation.duree],
    ["Modalité", d.formation.modalite],
    ["Lieu", d.formation.lieu || "—"],
    ["Effectif", d.formation.effectif || "—"],
    ["Formateur", d.formation.formateur || "—"],
  ]));

  c.push(K.h2("Article 3 — Prix et financement"));
  c.push(K.fieldsTable([
    ["Prix de la formation", `${d.financement.prixHT} HT`],
    ["Financeur visé", d.financement.financeur || "—"],
    ["Modalité de prise en charge", d.financement.modalite || "—"],
  ]));

  c.push(K.h2("Article 4 — Dispositions"));
  c.push(K.body("En cas de renoncement par le bénéficiaire avant le démarrage, d'abandon en cours, ou de réalisation partielle, les modalités prévues par la réglementation et le règlement intérieur de l'organisme s'appliquent. L'organisme délivre une attestation de fin de formation et la feuille d'émargement."));

  c.push(K.emptyP(160, 0));
  c.push(new Paragraph({ children: [new TextRun({ text: `Fait à ${d.signature.lieu}, ${d.signature.date}, en deux exemplaires.`, font: K.tokens.FONT_BODY, size: K.tokens.SZ.body, color: K.tokens.GRAPHITE })] }));
  c.push(K.emptyP(160, 0));
  c.push(K.signatureBlock(
    { heading: "Pour l'organisme de formation", lines: [d.org.name] },
    { heading: "Pour le bénéficiaire", lines: [d.beneficiaire.representant] }
  ));
  return K.buildAdminDoc(c, d.org);
}

async function main() {
  const outPath = process.argv[2] || path.join(process.cwd(), "convention-formation.docx");
  const dataPath = process.argv[3];
  let data = DATA;
  if (dataPath) { const r = path.resolve(dataPath); delete require.cache[r]; const m = require(r); data = m.DATA || m.default || m; }
  await K.writeDoc(build(data), outPath);
}
main().catch(e => { console.error("Erreur :", e); process.exit(1); });
