// =============================================================================
// fin-autodiagnostic-fafcea — Trame d'autodiagnostic (FAFCEA parcours individualisé)
// Le client DOIT réaliser l'autodiagnostic avant de déposer la demande (le résultat
// lui est envoyé par mail). Ce skill produit la trame structurée à compléter.
// Usage : NODE_PATH=/opt/homebrew/lib/node_modules node generate.js "<out>.docx" "<data>.js"
// =============================================================================

const path = require("path");
const K = require("./kaelia_doc.js");

const DATA = {
  org: {
    name: "KAELIA",
    lines: ["198 rue des amis de l'industrie, 42590 Neulise", "SIRET 953 672 235 00017 · NDA 84420407442 · Qualiopi"],
    footer: "KAELIA · forma'coach · organisme certifié Qualiopi",
    docTitle: "Autodiagnostic — parcours individualisé FAFCEA",
  },
  artisan: { nom: "Paul Bernard", entreprise: "Atelier Bernard", nafa: "—", cma: "CMA Auvergne-Rhône-Alpes" },
  formation: { intitule: "Maîtriser l'IA pour piloter son atelier", domaines: ["Numérique / outils", "Gestion / pilotage"] },
  // 4 domaines FAFCEA — le parcours doit reprendre 2 items sur 4 (4h min par intitulé)
  axes: [
    ["Stratégie / développement", "Évaluer ses besoins de structuration et de croissance."],
    ["Gestion / pilotage", "Mesurer sa maîtrise des outils de gestion et de pilotage."],
    ["Numérique / communication", "Évaluer son usage des outils numériques et de communication."],
    ["Cœur de métier / technique", "Identifier les compétences techniques à renforcer."],
  ],
};

function build(d) {
  const c = [];
  c.push(...K.letterhead(d.org));
  c.push(K.eyebrow("FAFCEA · Autodiagnostic parcours individualisé"));
  c.push(K.title("Autodiagnostic"));
  c.push(K.body("Cette trame structure l'autodiagnostic préalable au dépôt d'une demande de **parcours individualisé** FAFCEA. Le parcours doit reprendre **2 items sur 4** domaines, à raison de **4 heures minimum par intitulé**."));

  c.push(K.fieldsTable([
    ["Artisan", d.artisan.nom],
    ["Entreprise", d.artisan.entreprise],
    ["Code NAFA", d.artisan.nafa || "—"],
    ["CMA de rattachement", d.artisan.cma || "—"],
    ["Formation envisagée", d.formation.intitule],
  ]));

  c.push(K.h2("Auto-évaluation par domaine"));
  c.push(K.dataTable(
    ["Domaine", "À évaluer", "Niveau (1-5)", "Priorité"],
    d.axes.map(a => [a[0], a[1], "", ""]),
    { columnWidths: [2600, 4100, 1400, 1400] }
  ));

  c.push(K.h2("Domaines retenus pour le parcours"));
  for (const dom of d.formation.domaines) c.push(K.bullet(dom));
  c.push(K.body("**Rappel** : Kaelia ne peut pas se substituer à l'artisan pour la demande en ligne (compte CMA, code NAFA requis). Cette trame est un support de préparation."));

  return K.buildAdminDoc(c, d.org);
}

async function main() {
  const outPath = process.argv[2] || path.join(process.cwd(), "autodiagnostic-fafcea.docx");
  const dataPath = process.argv[3];
  let data = DATA;
  if (dataPath) { const r = path.resolve(dataPath); delete require.cache[r]; const m = require(r); data = m.DATA || m.default || m; }
  await K.writeDoc(build(data), outPath);
}
main().catch(e => { console.error("Erreur :", e); process.exit(1); });
