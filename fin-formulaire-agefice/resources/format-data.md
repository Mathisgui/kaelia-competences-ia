# Format des données — fin-formulaire-agefice

`data.json` consommé par `fill_pdf.py` (résolu via `field-map.json`).

```json
{
  "dirigeant": {
    "nomComplet": "Jean Dupont",
    "email": "jean.dupont@exemple.fr",
    "telephone": "06 00 00 00 00"
  },
  "entreprise": {
    "raisonSociale": "Dupont Conseil",
    "formeJuridique": "EI",
    "siret": "111 111 111 00011",
    "adresse": "10 rue de la République, 69001 Lyon"
  },
  "formation": {
    "intitule": "Intégrer l'intelligence artificielle dans son activité",
    "dates": "du 12 au 13 mai 2026",
    "dureeHeures": "14",
    "coutHT": "1800"
  },
  "organisme": { "nom": "KAELIA" },
  "rib": { "iban": "FR76 ...", "bic": "..." },
  "mandat": { "kaelia": "Oui" }
}
```

## Notes
- `formation.intitule` : **identique** à la convention, au programme et à l'attestation (règle AGEFICE).
- `mandat.kaelia` : la case au dos du formulaire autorise Kaelia à envoyer le dossier — cocher.
- Beaucoup de financeurs exigent une **signature manuscrite** : le PDF est pré-rempli, puis imprimé/signé par le dirigeant.
