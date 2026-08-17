# Compétences IA Kaelia — fichiers techniques

Scripts, gabarits et ressources graphiques des compétences IA de
[Kaelia](https://kaelia-formacoach.com), organisme de formation (NDA 84420407442).

**Les règles vivent dans Notion.** Ce dépôt ne contient que ce qu'une IA ne peut pas
recopier utilement : du code, des polices, des images et des formulaires PDF.

## Pourquoi ce dépôt existe

Ces fichiers étaient recopiés dans Notion et dans Google Drive. Une IA devait donc les
**lire puis les réécrire** à chaque usage — lent, coûteux en jetons, et impossible pour
une police ou un PNG. Ici, elle les obtient d'un seul geste, sans authentification :

```bash
git clone https://github.com/Mathisgui/kaelia-competences-ia.git
```

Un seul fichier, sans cloner :

```bash
curl -sO https://raw.githubusercontent.com/Mathisgui/kaelia-competences-ia/main/fin-convention/scripts/generate.js
```

## Principe de rangement

Chaque dossier est **autonome et exécutable tel quel**. Les générateurs résolvent leurs
ressources par `__dirname` (`assets/`, `./kaelia_doc.js`) : c'est pourquoi `kaelia_doc.js`
et les logos sont volontairement présents en plusieurs exemplaires plutôt que factorisés.
Déplacer un de ces fichiers casse le script.

> ⚠️ `kaelia_doc.js` est **identique** dans les 7 générateurs `fin-*`. Toute correction
> doit être reportée dans les 7, sinon ils divergent.

## Contenu

### Génération de documents Word (`docx`)

| Dossier | Produit |
|---|---|
| `fin-convention/` | Convention de formation |
| `fin-devis/` | Détail du coût pédagogique |
| `fin-emargement/` | Feuille d'émargement |
| `fin-attestation-presence/` | Attestation de présence et de règlement |
| `fin-attestation-assiduite/` | Attestation d'assiduité |
| `fin-autodiagnostic-fafcea/` | Autodiagnostic FAFCEA |
| `fin-saisie-en-ligne-akto/` | Préparation de la saisie AKTO |
| `kaelia-word/` | Document Word générique (charte Kaelia) |
| `kaelia-programme-formation/` | Programme de formation |

```bash
cd fin-convention/scripts
npm install docx          # dépendance unique
node generate.js data.js  # data.js n'est jamais versionné
```

`kaelia-programme-formation` a son propre `package.json` (`npm install` puis
`node generate_programme.js`), ses assets et `exemples/prog-reference.js` — le jeu de
données de **référence**, à lire avant d'écrire un programme : il fixe le niveau attendu.
`make_pill.py` (pavé arrondi) demande Pillow. La police Montserrat étant **variable**,
la graisse se sélectionne par `set_variation_by_name("Bold")`, sans quoi le rendu sort en Thin.

### Proposition commerciale (HTML → PDF)

`proposition-kaelia/` — `build_proposition.py`, gabarit `template.html` + `style.css`,
logos. Le jeu de données de référence n'est pas publié : il porte un client réel.

### Logos

`logos/` — les 4 logos Kaelia et leurs usages. Les générateurs embarquent leur propre
copie dans `assets/` (résolution par `__dirname`).

### Formulaires de financement (PDF AcroForm)

| Dossier | Contenu |
|---|---|
| `kaelia-financement/` | `fill_pdf.py`, field-map AGEFICE, **gabarit AGEFICE 2025** |
| `fin-formulaire-agefice/` | Même outillage, côté compétence Claude |
| `fin-formulaire-fafcea/` | field-map FAFCEA |

```bash
pip install pypdf
python3 scripts/fill_pdf.py data.json    # data.json n'est jamais versionné
```

Le gabarit vierge est dans `kaelia-financement/templates/`.

## Ce qui n'est délibérément pas ici

- **Les règles et procédures métier** — elles vivent dans Notion, qui en est la source.
  Ce dépôt ne contient aucun `SKILL.md`.
- **Les secrets** — jetons, clés d'API, chemins de webhooks, adresses d'infrastructure.
- **Toute donnée client.** Les jeux d'exemple sont fictifs. Un `data.json` réel contient
  noms, dates de naissance et SIRET : il est exclu par `.gitignore` et doit le rester.

## Licence

Les scripts sont publiés pour être réutilisés et adaptés. Les logos, la charte graphique
et les gabarits de formulaires restent la propriété de leurs titulaires respectifs.
