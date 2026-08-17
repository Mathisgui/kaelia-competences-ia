// =============================================================================
// fin-emargement — Feuille d'émargement (générique, tous financeurs)
// Grille de présence par demi-journée, signature stagiaire + formateur.
// Usage : NODE_PATH=/opt/homebrew/lib/node_modules node generate.js "<out>.docx" "<data>.js"
// =============================================================================

const path = require("path");
const K = require("./kaelia_doc.js");

const DATA = {
  org: {
    name: "KAELIA",
    lines: ["198 rue des amis de l'industrie, 42590 Neulise", "SIRET 953 672 235 00017 · NDA 84420407442 · Qualiopi"],
    footer: "KAELIA · forma'coach · organisme certifié Qualiopi",
    docTitle: "Feuille d'émargement",
  },
  formation: {
    intitule: "Intégrer l'intelligence artificielle dans son activité",
    formateur: "Mathis Guillemois",
    lieu: "Lyon (69)",
  },
  // une ligne par stagiaire ; colonnes = demi-journées
  creneaux: ["12/05 matin", "12/05 après-midi", "13/05 matin", "13/05 après-midi"],
  stagiaires: [
    { nom: "Jean Dupont", entreprise: "Dupont Conseil (EI)" },
  ],
};

function build(d) {
  const c = [];
  c.push(...K.letterhead(d.org));
  c.push(K.eyebrow("Feuille d'émargement"));
  c.push(K.title("Feuille d'émargement"));
  c.push(K.fieldsTable([
    ["Formation", d.formation.intitule],
    ["Formateur", d.formation.formateur || "—"],
    ["Lieu", d.formation.lieu || "—"],
  ]));

  c.push(K.h2("Présences"));
  const header = ["Stagiaire", ...d.creneaux];
  const rows = d.stagiaires.map(s => [
    `${s.nom}\n${s.entreprise || ""}`.trim(),
    ...d.creneaux.map(() => ""),
  ]);
  // colonnes : 1 large pour le nom, le reste réparti
  const nameW = 2800;
  const rest = Math.round((9500 - nameW) / d.creneaux.length);
  c.push(K.dataTable(header, rows, { columnWidths: [nameW, ...d.creneaux.map(() => rest)] }));

  c.push(K.body("Chaque case est signée par le stagiaire à chaque demi-journée. Le formateur signe la dernière colonne ou en bas de feuille."));
  c.push(K.emptyP(200, 0));
  c.push(K.signatureBlock(
    { heading: "Le formateur", lines: [d.formation.formateur || ""] },
    { heading: "Pour l'organisme", lines: [d.org.name] }
  ));
  return K.buildAdminDoc(c, d.org);
}

async function main() {
  const outPath = process.argv[2] || path.join(process.cwd(), "feuille-emargement.docx");
  const dataPath = process.argv[3];
  let data = DATA;
  if (dataPath) { const r = path.resolve(dataPath); delete require.cache[r]; const m = require(r); data = m.DATA || m.default || m; }
  await K.writeDoc(build(data), outPath);
}
main().catch(e => { console.error("Erreur :", e); process.exit(1); });
