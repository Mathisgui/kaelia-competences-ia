# Format de données — proposition-kaelia

Schéma complet du JSON/dict d'entrée pour `build_proposition.py`.

## Structure globale

```json
{
  "mode": "phases",     // "phases" (défaut) ou "options"
  "meta": { ... },
  "client": { ... },
  "contexte": { ... },
  "probleme": [ "..." ],
  "phases": [ { ... } ],
  "recap": { ... },     // optionnel — auto-généré sinon
  "close": { ... }
}
```

## mode

- `"phases"` (défaut) — parcours séquentiel. Labels "PHASE 1", "PHASE 2". Récap additionne et affiche un Total.
- `"options"` — alternatives budgétaires. Labels "OPTION A", "OPTION B", "OPTION C". Récap liste les options sans somme (le client choisit).

**Quand utiliser `options`** : quand le devis propose plusieurs niveaux d'engagement selon le budget. Chaque option est autoportante.

**Quand utiliser `phases`** : quand la livraison est séquentielle et le client valide phase par phase.

## meta

```json
{
  "date_label": "Avril 2026",
  "title_line_1": "Systèmes IA",
  "title_line_2": "sur mesure.",
  "tagline": "Un écosystème IA structuré pour [client]. Architecture, automatisation et production commerciale.",
  "phases_lead": "Trois phases, livrées dans l'ordre. Validation à chaque étape."
}
```

- `title_line_1` — affiché en blanc gras
- `title_line_2` — affiché en lavande, police plus légère
- `tagline` — italique sous le titre
- `phases_lead` — intro de la section "Notre proposition" (optionnel, défaut fourni)
- `hide_phase_prices` (bool, optionnel) — `true` masque la colonne « Prix » des tableaux, les prix par ligne et les totaux de phase/option. Le `recap` reste affiché : c'est le seul endroit où le montant apparaît. À utiliser pour un client non-technique qui ne doit pas arbitrer ligne par ligne.

## client

```json
{
  "name": "Camille Dupont",
  "company": "EXEMPLE CONSEIL",
  "activity": "Conseil en investissement immobilier B2B"
}
```

## contexte

```json
{
  "lead": "Résumé en une phrase de la situation client.",
  "info": [
    { "label": "CA actuel",     "value": "~200 k€ HT" },
    { "label": "Objectif CA",   "value": "300 k€ HT" },
    { "label": "Volume quotidien", "value": "+30 emails, 3h d'appels" },
    { "label": "Réseau",        "value": "800 – 1 000 investisseurs actifs" }
  ],
  "body": [
    "Premier paragraphe de contexte...",
    "Deuxième paragraphe..."
  ],
  "quote": "Citation directe du client (optionnel)."
}
```

- `info` — cartes KPI en grid 2 colonnes. 2-6 items idéal.
- `body` — paragraphes dans le bloc "Ce que nous avons identifié"
- `quote` — callout stylisé avec guillemets (optionnel)

## probleme

```json
["Problème 1...", "Problème 2...", "Problème 3..."]
```

Ou une string unique. Affiché dans un bloc "Le problème à résoudre".

## phases

Liste de phases. Chaque phase :

```json
{
  "title": "Socle CRM & Data",
  "sub": "Priorité #1 de votre brief — le socle de tout",
  "intro": "Tant que la donnée n'est pas propre...",
  "systems": [
    {
      "name": "CRM intelligent Notion",
      "desc": "Architecture complète : bases Contacts, Actifs...",
      "price": 2800
    }
  ]
}
```

- `title` — titre court (≤ 30 caractères idéal pour ne pas wrap)
- `sub` — sous-titre / priorité / contexte (optionnel)
- `intro` — paragraphe italique au-dessus de la table
- `systems[].price` — nombre. Formaté auto en "2 800 €"
- `systems[].offert` — bool. `true` → la ligne affiche un badge « Offert » à la place du prix et compte 0 € dans le total. Équivaut à `"price": "offert"`.
- `total` / `total_label` — calculés automatiquement si absents (les lignes offertes valent 0)

### Ligne offerte (OBLIGATOIRE — au moins une par devis)

**Chaque devis doit contenir au moins une ligne `offert: true`** : un petit plus offert au client (sentiment de cadeau), pas un système entier passé en gratuit. Le prix chiffré du reste ne bouge pas.

- Choisir un freebie **pertinent selon le client** (ex : « Support & ajustements » offert 1 mois, un agent secondaire en bonus, un guide d'usage personnalisé, une heure de prise en main).
- La ligne se met dans la table des systèmes comme les autres, avec `offert: true`.
- Jamais faire passer un système central du devis en offert : c'est un extra, pas une remise déguisée sur le cœur de l'offre.

```json
{
  "name": "Support & ajustements",
  "desc": "1 mois de support et de réglages après livraison.",
  "offert": true
}
```

## recap (optionnel)

```json
{
  "rows": [
    { "label": "Phase 1 — Socle CRM & Data",      "value": 5400 },
    { "label": "Phase 2 — Production Commerciale", "value": 3500 },
    { "label": "Phase 3 — Prospection & Relances", "value": 3100 },
    { "label": "Remise package (3 phases)",        "value": "−10 %" },
    { "label": "Total package",                    "value": 10800, "highlight": true }
  ]
}
```

- Si absent, auto-généré : une ligne par phase + total
- `value` accepte nombre (formaté en EUR) ou string libre
- `highlight: true` → ligne en gros + bordure top blanche

## close

```json
{
  "headline": "On construit,<br>vous gardez la main.",
  "sub": "Chaque système est validé phase par phase.",
  "contacts": [
    { "label": "Responsable", "value": "Mathis Guillemois" },
    { "label": "Email",       "value": "contact@kaelia-formacoach.com" },
    { "label": "Téléphone",   "value": "07 63 77 31 38" },
    { "label": "Site",        "value": "www.kaelia-formacoach.com" }
  ]
}
```

- `headline` — accepte `<br>` pour retour ligne
- `contacts` — si absent, contacts Mathis par défaut

## Exemple complet

Un jeu de données de référence complet existe côté Drive (il porte des informations client réelles : il n'est pas publié ici).
