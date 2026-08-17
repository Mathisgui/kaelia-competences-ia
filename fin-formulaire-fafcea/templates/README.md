# templates/ — formulaire officiel FAFCEA

✓ Présent : `FAFCEA.pdf`.

## ⚠️ Limite technique : PDF plat (non éditable en AcroForm)
Inspection : **0 champ de formulaire**, 0 widget. Le `FAFCEA.pdf` est un PDF **plat** (libellés imprimés type "NOM*:", "Titre du stage*:", "N° déclaration d'activité*:"...), pas un formulaire à champs. `fill_pdf.py` ne peut donc PAS le remplir comme l'AGEFICE.

## Options
1. **Remplissage manuel** (le plus simple) : l'agent produit une fiche de données récap (nom, titre du stage, NDA Kaelia 84420407442, SIREN, durée en heures, dates, coût) à reporter à la main.
2. **Overlay texte** (si auto-remplissage voulu) : dessiner les valeurs aux coordonnées x,y par-dessus le PDF (reportlab + merge pypdf). Nécessite une calibration des coordonnées par libellé — à construire sur demande.
3. **Rappel métier** : le FAFCEA impose de toute façon que **l'artisan dépose lui-même** la demande en ligne via son compte CMA (code NAFA requis). Kaelia ne peut pas s'y substituer. L'auto-remplissage PDF est donc secondaire ici.

## Si une version éditable (AcroForm) sort un jour
Mêmes étapes que l'AGEFICE : `--inspect` puis `resources/field-map.json`.
