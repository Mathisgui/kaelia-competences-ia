# Exemple de contenu DOC_DATA

Voici la structure attendue pour générer un document Kaelia type rapport / livret / programme.

```js
const DOC_DATA = {
  meta: {
    title: "Programme de formation IA",
    subtitle: "Maîtrisez l'intelligence artificielle dans votre métier.",
    eyebrow: "PROGRAMME · 2026",
    date: "Juin 2026",
  },
  preambule: {
    eyebrow: "PRÉAMBULE",
    title: "Pourquoi ce programme.",
    body: [
      "Premier paragraphe court (3–4 lignes max).",
      "Deuxième paragraphe — toujours en vous, jamais en tu.",
    ],
  },
  sections: [
    {
      eyebrow: "MODULE 01",
      title: "Comprendre l'IA générative.",
      paragraphs: [ "..." ],
      bullets: [
        "Premier point — phrase courte.",
        "Deuxième point — verbe concret.",
        "Troisième point — rythme de trois.",
      ],
      callout: { title: "À retenir.", body: "..." },
    },
    {
      eyebrow: "MODULE 02",
      title: "Mettre en pratique.",
      paragraphs: [ "..." ],
      kpis: [
        { value: "+24", label: "Heures de formation" },
        { value: "+8", label: "Cas pratiques" },
        { value: "100%", label: "Distanciel ou présentiel" },
      ],
      quote: {
        text: "Citation forte du fondateur ou d'un participant.",
        author: "Killian Guillemois, co-fondateur",
      },
    },
  ],
  contact: {
    eyebrow: "CONTACT",
    title: "Discutons-en.",
    body: "Une première rencontre permet de cadrer les besoins.",
    lines: [
      "Adresse : 12 rue de la Formation, 75001 Paris",
      "Tél : 01 23 45 67 89",
      "Site : kaelia.fr",
    ],
  },
};
```

## Règles éditoriales

- **Paragraphes ≤ 4 lignes.** Si plus long, scinder en deux.
- **Bullets ≤ 5 items, idéalement 3.** Rythme ternaire = signature Kaelia.
- **Pas d'emoji.** Jamais. Préférer un mot ("Adresse :", "Tél :").
- **Pas de point d'exclamation.** Voix déclarative.
- **Vous, jamais tu.** Et tisser nous-vous : "Nous vous accompagnons…".
- **Domaines en minuscules** : juridique, numérique, ia.
- **Préfixe `+` sur les KPI** : `+300`, `+60%`, `4,9/5`.
- **Verbes concrets** : Performons, Maîtrisez, Boostez, Pilotez, Construisez.

## Types de documents pris en charge

- Rapport (analyse, bilan, état des lieux)
- Livret / fascicule pédagogique
- Programme de formation
- Mémo / note interne
- Compte-rendu de mission
- Charte / engagement
- Fiche pratique / méthodologie
- Document éditorial premium client
