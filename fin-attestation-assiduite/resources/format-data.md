# Format des données — fin-attestation-assiduite

Le script charge un `data.js` qui exporte `module.exports = { DATA: {...} }`.

```javascript
module.exports = {
  DATA: {
    org: {
      name: "KAELIA",
      lines: [
        "198 rue des amis de l'industrie, 42590 Neulise",
        "SIRET 000 000 000 00000 · Déclaration d'activité 00 00 00000 00",
        "Organisme certifié Qualiopi",
      ],
      footer: "KAELIA · forma'coach · organisme certifié Qualiopi",
      docTitle: "Attestation d'assiduité",
    },
    stagiaire: {
      nom: "Jean Dupont",
      entreprise: "Dupont Conseil (EI)",
      siret: "111 111 111 00011",
    },
    formation: {
      intitule: "Intégrer l'intelligence artificielle dans son activité", // EXACT, identique au reste du dossier
      dates: "du 12 au 13 mai 2026",
      duree: "14 heures",        // toujours en heures
      modalite: "présentiel",     // présentiel | distanciel | mixte
      lieu: "Lyon (69)",
      formateur: "Mathis Guillemois",
    },
    signature: { lieu: "Neulise", date: "le 14 mai 2026" },
  },
};
```

## Notes
- `org` : les vraies coordonnées Kaelia (SIRET, NDA, Qualiopi) sont à renseigner — placeholders dans l'exemple. Source de vérité : fiche Kaelia / company.json.
- `formation.intitule` : doit être **strictement identique** au titre utilisé sur le formulaire AGEFICE, la convention et le programme.
- `formation.duree` : en heures (AGEFICE raisonne en heures : 70h présentiel / 85h distanciel pour le plafond).
