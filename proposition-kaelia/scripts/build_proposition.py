#!/usr/bin/env python3
"""
Génère une proposition d'accompagnement Kael'IA en PDF à partir d'un dict Python
ou d'un fichier JSON.

Usage CLI :
    python build_proposition.py data.json output.pdf

Usage programmatique :
    from build_proposition import build
    build(data, "output.pdf")
"""

from __future__ import annotations

import json
import sys
from pathlib import Path
from typing import Any

from jinja2 import Environment, FileSystemLoader, select_autoescape
from weasyprint import HTML, CSS

SKILL_DIR = Path(__file__).resolve().parent.parent
TEMPLATES_DIR = SKILL_DIR / "templates"
ASSETS_DIR = SKILL_DIR / "assets"


def _format_eur(value: Any) -> str:
    """Format 5400 -> '5 400 €'. Laisse les strings intacts."""
    if isinstance(value, str):
        return value
    try:
        n = int(round(float(value)))
        # Espace fine insécable entre milliers (narrow no-break space, U+202F)
        return f"{n:,} €".replace(",", "\u202f")
    except (TypeError, ValueError):
        return str(value)


def _normalize(data: dict) -> dict:
    """Calcule les totaux de phases si absents, formatte les prix, remplit les valeurs par défaut."""
    out = json.loads(json.dumps(data))  # deep copy

    # Meta defaults
    meta = out.setdefault("meta", {})
    meta.setdefault("date_label", "")
    meta.setdefault("title_line_1", "Systèmes IA")
    meta.setdefault("title_line_2", "sur mesure.")
    meta.setdefault("tagline", "Architecture, automatisation, intelligence. Pensés pour votre métier.")

    # Phases
    for phase in out.get("phases", []):
        # Systems: price formatting
        for sys in phase.get("systems", []):
            # Ligne "offert" : soit offert=true, soit price="offert" (insensible à la casse).
            price = sys.get("price")
            is_offert = bool(sys.get("offert")) or (
                isinstance(price, str) and price.strip().lower() in ("offert", "offerte", "gratuit", "0")
            )
            if is_offert:
                sys["offert"] = True
                sys["price"] = 0  # ne compte pas dans le total
                sys["price_label"] = "Offert"
            elif "price_label" not in sys:
                sys["price_label"] = _format_eur(sys.get("price", 0))

        # Phase total (les lignes offertes valent 0)
        if "total" not in phase:
            phase["total"] = sum(
                (s.get("price") or 0) for s in phase.get("systems", []) if isinstance(s.get("price"), (int, float))
            )
        if "total_label" not in phase:
            phase["total_label"] = _format_eur(phase["total"])

    # Recap — auto-generate if not provided
    mode = out.get("mode", "phases")
    letters = ["A", "B", "C", "D", "E", "F", "G", "H"]
    if "recap" not in out and out.get("phases"):
        rows = []
        if mode == "options":
            # Liste les options côte à côte, pas de somme
            for i, p in enumerate(out["phases"]):
                rows.append({
                    "label": f"Option {letters[i]} — {p.get('title','')}",
                    "value": p.get("total_label", ""),
                })
            out["recap"] = {"rows": rows}
        else:
            running_total = 0
            for i, p in enumerate(out["phases"], start=1):
                total = p.get("total", 0)
                running_total += total if isinstance(total, (int, float)) else 0
                rows.append({"label": f"Phase {i} — {p.get('title','')}", "value": p.get("total_label", "")})
            rows.append({"label": "Total", "value": _format_eur(running_total), "highlight": True})
            out["recap"] = {"rows": rows}
    elif "recap" in out and "rows" in out["recap"]:
        for r in out["recap"]["rows"]:
            if isinstance(r.get("value"), (int, float)):
                r["value"] = _format_eur(r["value"])

    # Close defaults
    close = out.setdefault("close", {})
    close.setdefault("contacts", [
        {"label": "Responsable", "value": "Mathis Guillemois"},
        {"label": "Email",       "value": "contact@kaelia-formacoach.com"},
        {"label": "Téléphone",   "value": "06 51 13 26 44"},
        {"label": "Site",        "value": "www.kaelia-ia.com"},
    ])

    return out


def build(data: dict, output_path: str | Path) -> Path:
    """Rend la proposition en PDF. Retourne le chemin du fichier généré."""
    env = Environment(
        loader=FileSystemLoader(str(TEMPLATES_DIR)),
        autoescape=select_autoescape(["html"]),
        trim_blocks=True,
        lstrip_blocks=True,
    )
    template = env.get_template("template.html")
    context = _normalize(data)
    html_str = template.render(**context)

    # base_url = templates dir so that "../assets/..." and "style.css" resolve
    HTML(string=html_str, base_url=str(TEMPLATES_DIR)).write_pdf(
        target=str(output_path),
        stylesheets=[CSS(filename=str(TEMPLATES_DIR / "style.css"))],
    )
    return Path(output_path)


def _main():
    if len(sys.argv) < 3:
        print("Usage: build_proposition.py <data.json> <output.pdf>", file=sys.stderr)
        sys.exit(2)
    data_path, out_path = sys.argv[1], sys.argv[2]
    data = json.loads(Path(data_path).read_text(encoding="utf-8"))
    result = build(data, out_path)
    print(f"OK -> {result}")


if __name__ == "__main__":
    _main()
