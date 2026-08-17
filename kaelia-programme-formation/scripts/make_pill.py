#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Fabrique `assets/pill-programme.png` : le pavé indigo « PROGRAMME DE FORMATION »
à COINS ARRONDIS.

Pourquoi une image : le pavé était une cellule de tableau, et OOXML/Word ne sait
pas arrondir les coins d'une cellule (seules les formes DrawingML le peuvent, et
elles ne survivent pas à la conversion Google Doc). Une image PNG à fond
transparent rend le même visuel partout, à l'identique.

Contrepartie assumée : le texte du pavé n'est plus sélectionnable. Il est fixe,
donc ça ne gêne ni la recherche ni la relecture du reste du document.

Régénérer après tout changement de couleur, de rayon ou de libellé :
    python3 scripts/make_pill.py
"""
import os
import urllib.request

from PIL import Image, ImageDraw, ImageFont

HERE = os.path.dirname(os.path.abspath(__file__))
SKILL = os.path.dirname(HERE)
ASSETS = os.path.join(SKILL, "assets")
FONT_DIR = os.path.join(ASSETS, "fonts")
FONT_PATH = os.path.join(FONT_DIR, "Montserrat.ttf")
FONT_URL = "https://github.com/google/fonts/raw/main/ofl/montserrat/Montserrat%5Bwght%5D.ttf"

TEXTE = "PROGRAMME DE FORMATION"
INDIGO = (0x12, 0x00, 0x31, 255)      # KAELIA_INDIGO_PILL du générateur
BLANC = (255, 255, 255, 255)

# Géométrie cible dans le document : 18 cm × 1,27 cm (largeur de contenu de la
# cover). Rendu à 4× pour rester net à l'impression, puis réduit par Word.
SCALE = 4
W_CM, H_CM = 18.0, 1.27
PX = lambda cm_: int(round(cm_ / 2.54 * 96 * SCALE))
W, H = PX(W_CM), PX(H_CM)
RAYON = PX(0.30)                       # 3 mm — arrondi net mais discret
TAILLE_TEXTE = int(round(16 / 72 * 96 * SCALE))   # 16 pt
INTERLETTRAGE = int(round(1.5 / 72 * 96 * SCALE))  # characterSpacing 30 = 1,5 pt


def police():
    if not os.path.exists(FONT_PATH):
        os.makedirs(FONT_DIR, exist_ok=True)
        urllib.request.urlretrieve(FONT_URL, FONT_PATH)
    f = ImageFont.truetype(FONT_PATH, TAILLE_TEXTE)
    try:
        f.set_variation_by_name("Bold")   # fichier variable : Thin par défaut
    except Exception:
        pass
    return f


def main():
    img = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    d = ImageDraw.Draw(img)
    d.rounded_rectangle([0, 0, W - 1, H - 1], radius=RAYON, fill=INDIGO)

    f = police()
    # interlettrage : PIL ne le gère pas, on dessine lettre par lettre
    largeurs = [d.textlength(c, font=f) for c in TEXTE]
    total = sum(largeurs) + INTERLETTRAGE * (len(TEXTE) - 1)
    haut, bas = f.getbbox(TEXTE)[1], f.getbbox(TEXTE)[3]
    x = (W - total) / 2
    y = (H - (bas - haut)) / 2 - haut
    for c, lg in zip(TEXTE, largeurs):
        d.text((x, y), c, font=f, fill=BLANC)
        x += lg + INTERLETTRAGE

    out = os.path.join(ASSETS, "pill-programme.png")
    img.save(out)
    print("pavé arrondi généré : %s (%d×%d px, rayon %d px)" % (out, W, H, RAYON))


if __name__ == "__main__":
    main()
