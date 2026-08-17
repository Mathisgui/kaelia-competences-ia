// =============================================================================
// fin-saisie-en-ligne-akto — Fiche "Remplissage de la demande en ligne AKTO"
// Word listant TOUS les champs de la demande de prise en charge AKTO (Mon Espace /
// DPEC), avec la valeur à copier/coller. Champs réels du formulaire officiel AKTO.
// Usage : NODE_PATH=/opt/homebrew/lib/node_modules node generate.js "<out>.docx" "<data>.js"
// =============================================================================

const path = require("path");
const K = require("./kaelia_doc.js");

// Constantes organisme Kaelia (valeurs fixes pour la saisie AKTO)
const KAELIA_OF = {
  raisonSociale: "KAELIA (SAS)",
  siret: "953 672 235 00017",
  nda: "84420407442",
  adresse: "198 rue des amis de l'industrie",
  ville: "42590 Neulise",
  contact: "Karine Weil",
  courriel: "contact@kaelia-formacoach.com",
  telephone: "07 63 77 31 38",
};

const DATA = {
  meta: { dispositif: "Plan de développement des compétences", portail: "Mon Espace AKTO — monespace.akto.fr" },
  of: KAELIA_OF,
  entreprise: {
    raisonSociale: "[Raison sociale entreprise bénéficiaire]",
    siret: "[SIRET entreprise]",
    nace: "[Code NACE / APE]",
    adresse: "[Adresse]",
    cp: "[CP]",
    ville: "[Ville]",
    contact: "[Personne à contacter]",
    telephone: "[Téléphone]",
    courriel: "[Courriel]",
  },
  action: {
    intitule: "Intégrer l'IA générative dans ses pratiques professionnelles",
    interne: "Non", // "Ou formation interne" : Oui/Non
    dateDebut: "08/12/2026",
    dateFin: "09/12/2026",
    nbJours: "2",
    nbHeures: "14",
  },
  couts: {
    coutPedagogique: "2 400,00 € HT",
    fraisPrevisionnels: "0,00 €",
    dontSalaires: "0,00 €",
    repasHebergement: "0,00 €",
    transport: "0,00 €",
  },
  stagiaires: [
    { nomUsage: "[Nom d'usage]", nomNaissance: "[Nom de naissance]", prenom: "[Prénom]", dateNaissance: "[JJ/MM/AAAA]", sexe: "[M/F]", secu: "[N° sécurité sociale]", qualification: "[Qualification]", niveau: "[Niveau de formation]", typeContrat: "[CDI/CDD/...]" },
  ],
  handicap: { concerne: "Non", noms: "" },
  signataire: { nomPrenom: "Karine Weil", qualite: "Co-fondatrice", raisonSociale: "[Entreprise signataire]", adresse: "[Adresse]", ville: "[Ville]", courriel: "[Courriel]" },
};

function build(d) {
  const c = [];
  c.push(...K.letterhead({ name: "KAELIA", lines: ["198 rue des amis de l'industrie, 42590 Neulise", "SIRET 953 672 235 00017 · NDA 84420407442 · Qualiopi"], footer: "KAELIA · forma'coach · aide à la saisie AKTO", docTitle: "Remplissage de la demande en ligne AKTO" }));
  c.push(K.title("Remplissage de la demande en ligne — AKTO"));
  c.push(K.body(`**Portail** : ${d.meta.portail}. **Dispositif** : ${d.meta.dispositif}. Ce document liste chaque champ de la demande de prise en charge AKTO et la valeur à **copier/coller**. Saisir avant le démarrage de l'action.`));

  c.push(K.h2("Organisme de formation (déjà connu — Kaelia)"));
  c.push(K.dataTable(["Champ AKTO", "Valeur à saisir"], [
    ["Raison sociale (OF)", d.of.raisonSociale],
    ["SIRET (OF)", d.of.siret],
    ["NDA", d.of.nda],
    ["Adresse (OF)", d.of.adresse],
    ["Ville (OF)", d.of.ville],
    ["Personne à contacter (OF)", d.of.contact],
    ["Courriel (OF)", d.of.courriel],
  ], { columnWidths: [4200, 5300] }));

  c.push(K.h2("Entreprise bénéficiaire"));
  c.push(K.dataTable(["Champ AKTO", "Valeur à saisir"], [
    ["Raison sociale", d.entreprise.raisonSociale],
    ["SIRET entreprise", d.entreprise.siret],
    ["NACE (code APE)", d.entreprise.nace],
    ["Adresse", d.entreprise.adresse],
    ["CP", d.entreprise.cp],
    ["Ville", d.entreprise.ville],
    ["Personne à contacter", d.entreprise.contact],
    ["Numéro de téléphone", d.entreprise.telephone],
    ["Courriel", d.entreprise.courriel],
  ], { columnWidths: [4200, 5300] }));

  c.push(K.h2("Action de formation"));
  c.push(K.dataTable(["Champ AKTO", "Valeur à saisir"], [
    ["Action de formation (intitulé)", d.action.intitule],
    ["Ou formation interne", d.action.interne],
    ["Date de début (le)", d.action.dateDebut],
    ["Date de fin (au)", d.action.dateFin],
    ["Durée estimée — nb jours", d.action.nbJours],
    ["Durée estimée — nb heures", d.action.nbHeures],
  ], { columnWidths: [4200, 5300] }));

  c.push(K.h2("Coûts"));
  c.push(K.dataTable(["Champ AKTO", "Valeur à saisir"], [
    ["Coût pédagogique (HT)", d.couts.coutPedagogique],
    ["Frais prévisionnels", d.couts.fraisPrevisionnels],
    ["Dont salaires", d.couts.dontSalaires],
    ["Repas / hébergement", d.couts.repasHebergement],
    ["Transport", d.couts.transport],
  ], { columnWidths: [4200, 5300] }));

  c.push(K.h2("Stagiaire(s)"));
  d.stagiaires.forEach((s, i) => {
    c.push(K.body(`**Stagiaire ${i + 1}**`));
    c.push(K.dataTable(["Champ AKTO", "Valeur à saisir"], [
      ["Nom d'usage", s.nomUsage],
      ["Nom de naissance", s.nomNaissance],
      ["Prénom", s.prenom],
      ["Date de naissance", s.dateNaissance],
      ["M/F", s.sexe],
      ["N° de sécurité sociale", s.secu],
      ["Qualification (1)", s.qualification],
      ["Niveau de formation (2)", s.niveau],
      ["Type de contrat (3)", s.typeContrat],
    ], { columnWidths: [4200, 5300] }));
  });

  c.push(K.h2("Situation de handicap"));
  c.push(K.dataTable(["Champ AKTO", "Valeur à saisir"], [
    ["Un ou plusieurs stagiaires en situation de handicap ?", d.handicap.concerne],
    ["Nom(s) concerné(s)", d.handicap.noms || "—"],
  ], { columnWidths: [4200, 5300] }));

  c.push(K.h2("Signataire de la demande"));
  c.push(K.dataTable(["Champ AKTO", "Valeur à saisir"], [
    ["Nom prénom", d.signataire.nomPrenom],
    ["Qualité", d.signataire.qualite],
    ["Raison sociale entreprise", d.signataire.raisonSociale],
    ["Adresse entreprise", d.signataire.adresse],
    ["Ville entreprise", d.signataire.ville],
    ["Courriel entreprise", d.signataire.courriel],
  ], { columnWidths: [4200, 5300] }));

  c.push(K.body("⚠️ Joindre dans Mon Espace : **convention signée**, **programme**, **devis HT**, **justificatifs OF** (NDA + Qualiopi). Le cas échéant, formuler la **demande de prise en charge de la rémunération** au dépôt."));
  return K.buildAdminDoc(c, { name: "KAELIA", footer: "KAELIA · forma'coach · aide à la saisie AKTO", docTitle: "Remplissage demande AKTO" });
}

async function main() {
  const outPath = process.argv[2] || path.join(process.cwd(), "remplissage-demande-akto.docx");
  const dataPath = process.argv[3];
  let data = DATA;
  if (dataPath) { const r = path.resolve(dataPath); delete require.cache[r]; const m = require(r); data = m.DATA || m.default || m; }
  await K.writeDoc(build(data), outPath);
}
main().catch(e => { console.error("Erreur :", e); process.exit(1); });
