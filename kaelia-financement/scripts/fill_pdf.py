#!/usr/bin/env python3
"""
fill_pdf.py — remplit un PDF de formulaire à champs (AcroForm) à partir d'un field-map.

Générique : sert pour AGEFICE et FAFCEA (même code, template + field-map différents).

Usage :
  # 1) Inspecter les champs du PDF officiel (pour construire le field-map)
  python3 fill_pdf.py --inspect templates/<formulaire>.pdf

  # 2) Remplir
  python3 fill_pdf.py templates/<formulaire>.pdf field-map.json data.json sortie.pdf

field-map.json : { "<nom_champ_pdf>": "<cle.dans.data>", ... }  (clé pointée → chemin dans data)
data.json      : les données client/formation (voir references/format-data.md)

Dépend de pypdf. Si absent : `pip3 install pypdf` OU utiliser le skill `pdf` intégré.
"""
import json
import sys


def _need_pypdf():
    try:
        import pypdf  # noqa
        return __import__("pypdf")
    except Exception:
        sys.exit(
            "pypdf manquant. Installer avec `pip3 install pypdf`, "
            "ou utiliser le skill `pdf` intégré pour le form-fill."
        )


def inspect(path):
    pypdf = _need_pypdf()
    reader = pypdf.PdfReader(path)
    fields = reader.get_fields() or {}
    if not fields:
        print("Aucun champ AcroForm détecté. Le PDF n'est peut-être pas éditable "
              "(scan/plat) → overlay texte requis (voir skill `pdf`).")
        return
    print(f"{len(fields)} champ(s) détecté(s) :")
    for name, f in fields.items():
        ftype = f.get("/FT", "?")
        print(f"  - {name}  [{ftype}]")


def _resolve(data, dotted):
    cur = data
    for part in str(dotted).split("."):
        if isinstance(cur, dict) and part in cur:
            cur = cur[part]
        else:
            return ""
    return "" if cur is None else str(cur)


def fill(template, field_map_path, data_path, out_path):
    pypdf = _need_pypdf()
    with open(field_map_path, encoding="utf-8") as fh:
        field_map = json.load(fh)
    with open(data_path, encoding="utf-8") as fh:
        data = json.load(fh)

    checkbox_map = field_map.pop("_checkboxes", {}) or {}
    checkbox_map = {k: v for k, v in checkbox_map.items() if not k.startswith("_")}

    # champs texte
    values = {
        pdf_field: _resolve(data, key)
        for pdf_field, key in field_map.items()
        if not pdf_field.startswith("_")
    }

    reader = pypdf.PdfReader(template)

    # cases à cocher : lire l'état "coché" réel depuis les appearance states (/AP /N)
    def on_states_from_annots(rdr):
        out = {}
        for page in rdr.pages:
            for a in (page.get("/Annots") or []):
                o = a.get_object()
                name = o.get("/T")
                ap = o.get("/AP")
                if name is None or ap is None or "/N" not in ap:
                    continue
                states = [s for s in ap["/N"].keys() if s not in ("/Off",)]
                if states:
                    out[str(name)] = states[0]  # ex. "/Oui", "/Yes", "/1"
        return out

    def truthy(v):
        return str(v).strip().lower() in ("1", "true", "oui", "yes", "x", "on")

    cb_states = on_states_from_annots(reader)
    for pdf_field, key in checkbox_map.items():
        if not truthy(_resolve(data, key)):
            continue
        values[pdf_field] = cb_states.get(pdf_field, "/Yes")  # garde le slash (NameObject)

    writer = pypdf.PdfWriter()
    writer.append(reader)
    for page in writer.pages:
        writer.update_page_form_field_values(page, values, auto_regenerate=False)
    # rendre les valeurs visibles dans tous les lecteurs
    try:
        writer.set_need_appearances_writer(True)
    except Exception:
        pass
    with open(out_path, "wb") as fh:
        writer.write(fh)
    n_txt = sum(1 for k in values if k not in checkbox_map)
    n_chk = sum(1 for k in values if k in checkbox_map)
    print(f"Formulaire rempli : {out_path}  ({n_txt} champs texte, {n_chk} cases cochées)")


def main(argv):
    if len(argv) >= 3 and argv[1] == "--inspect":
        return inspect(argv[2])
    if len(argv) == 5:
        return fill(argv[1], argv[2], argv[3], argv[4])
    print(__doc__)
    sys.exit(1)


if __name__ == "__main__":
    main(sys.argv)
