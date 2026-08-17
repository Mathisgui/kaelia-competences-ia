# Compétences IA Kaelia — fichiers techniques

Scripts, gabarits et ressources graphiques utilisés par les compétences IA de
[Kaelia](https://kaelia-formacoach.com), organisme de formation (NDA 84420407442).

**Les règles vivent dans Notion.** Ce dépôt ne contient que ce qu'une IA ne peut pas
recopier utilement : du code, des polices, des images et des formulaires PDF.

## Pourquoi ce dépôt existe

Ces fichiers étaient recopiés dans Notion et dans Google Drive. Une IA devait donc les
**lire puis les réécrire** à chaque usage — long, coûteux en jetons, et impossible pour
une police ou un PNG. Ici, elle les obtient d'un seul geste :

```bash
git clone https://github.com/Mathisgui/kaelia-competences-ia.git
```

Aucune authentification n'est requise.

## Contenu

### `kaelia-programme-formation/`
Génération d'un programme de formation au format `.docx`.

| Chemin | Rôle |
|---|---|
| `scripts/generate_programme.js` | Le générateur. Prend un objet `DOC_DATA`, produit le `.docx`. |
| `scripts/make_pill.py` | Fabrique le pavé « PROGRAMME DE FORMATION » à coins arrondis (PNG). |
| `exemples/prog-reference.js` | Jeu de données de **référence** : le niveau de qualité rédactionnelle attendu. À lire avant d'écrire un programme. |
| `assets/` | Bandeau de couverture, logos, pavé pré-généré, police Montserrat. |

```bash
cd kaelia-programme-formation/scripts
npm install          # dépendance : docx
node generate_programme.js
```

`make_pill.py` demande Pillow (`pip install pillow`). La police Montserrat étant
**variable**, la graisse se sélectionne par `set_variation_by_name("Bold")` — sans quoi
le rendu sort en Thin.

### `kaelia-financement/`
Remplissage des formulaires de demande de prise en charge.

| Chemin | Rôle |
|---|---|
| `scripts/fill_pdf.py` | Remplit un formulaire AcroForm à partir d'un `data.json`. |
| `references/field-map.json` | Correspondance champs PDF → chemins dans les données. |
| `references/data.example.json` | Exemple de données. **Fictif**, à l'exception de l'identité de l'organisme. |
| `templates/` | Gabarits vierges (AGEFICE 2025). |

```bash
pip install pypdf
python3 scripts/fill_pdf.py data.json          # data.json n'est jamais versionné
```

## Ce qui n'est délibérément pas ici

- **Les règles et procédures métier** — elles vivent dans Notion, qui en est la source.
- **Les secrets** — jetons, clés d'API, chemins de webhooks.
- **Toute donnée client.** Les jeux d'exemple sont fictifs. Un `data.json` réel contient
  des noms, dates de naissance et SIRET : il est exclu par `.gitignore`, et doit le rester.

## Licence

Les scripts sont publiés pour être réutilisés et adaptés. Les logos, la charte graphique
et les gabarits de formulaires restent la propriété de leurs titulaires respectifs.
