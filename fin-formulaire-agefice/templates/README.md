# templates/ — formulaire officiel AGEFICE

✓ **Présent** : `AGEFICE-Demande-de-prise-en-charge-2025-Editable.pdf` (91 champs AcroForm éditables).

Le field-map réel est dans `../resources/field-map.json` (testé). Remplissage : voir `../SKILL.md`.

Si l'AGEFICE publie une nouvelle version :
1. Remplacer le PDF ici.
2. `.claude/skills/.venv-fin/bin/python ../scripts/fill_pdf.py --inspect <nouveau>.pdf`
3. Ajuster `../resources/field-map.json` si des noms de champs ont changé.
