#!/usr/bin/env python3
"""Génère l'image de partage (1200x630) et l'icône Apple (180x180).

Usage : python3 outils/generer-og.py
Dépendances : pip install pillow fonttools
Écrit : src/public/images/og-defaut.png et src/public/apple-touch-icon.png
À relancer seulement si tu changes le nom, la description ou les couleurs.
"""
import json, tempfile
from pathlib import Path
from fontTools.ttLib import TTFont
from PIL import Image, ImageDraw, ImageFont

RACINE = Path(__file__).resolve().parent.parent
POLICES = RACINE / "src/public/fonts"
SITE = json.loads((RACINE / "src/donnees/site.json").read_text(encoding="utf-8"))
FOND, TEXTE, DISCRET, ACCENT = "#141416", "#f6f6f7", "#a6a6ae", "#ff6a1a"

tmp = Path(tempfile.mkdtemp())
def police(nom, taille):
    f = TTFont(POLICES / nom); f.flavor = None
    sortie = tmp / (nom + ".ttf"); f.save(sortie)
    return ImageFont.truetype(str(sortie), taille)

# --- Image de partage ---
L, H = 1200, 630
img = Image.new("RGB", (L, H), FOND)
d = ImageDraw.Draw(img)
d.rectangle([80, 96, 152, 102], fill=ACCENT)
nom = police("bricolage-700.woff", 200)
x, y = 74, 140
for morceau, couleur in zip(SITE["titre"].partition("0"), (TEXTE, ACCENT, TEXTE)):
    d.text((x, y), morceau, font=nom, fill=couleur)
    x += d.textlength(morceau, font=nom) - 6
desc = police("instrument-sans-400.woff", 40)
d.text((80, 420), SITE["description"], font=desc, fill=DISCRET)
mono = police("geist-mono-400.woff", 28)
d.text((80, 540), "projets  ·  musique  ·  jeux  ·  notes", font=mono, fill=ACCENT)
(RACINE / "src/public/images").mkdir(parents=True, exist_ok=True)
img.save(RACINE / "src/public/images/og-defaut.png", optimize=True)

# --- Icône Apple (même dessin que favicon.svg, en 4x puis réduit) ---
N = 720
ic = Image.new("RGB", (N, N), "#f4f4f5")
di = ImageDraw.Draw(ic)
s = N / 32
di.ellipse([(16 - 6.5) * s, (16 - 9) * s, (16 + 6.5) * s, (16 + 9) * s], outline="#0a0a0b", width=round(3 * s))
di.line([(11.5 * s, 22.5 * s), (20.5 * s, 9.5 * s)], fill="#0a0a0b", width=round(3 * s))
ic.resize((180, 180), Image.LANCZOS).save(RACINE / "src/public/apple-touch-icon.png", optimize=True)
print("ok")
