#!/usr/bin/env python3
"""
Script de Correction des Bugs Gaming UI
Applique les correctifs automatiquement
"""

import os
import re
from pathlib import Path

print("🐛 CORRECTIF BUGS - Gaming UI")
print("=" * 50)

SITE_ROOT = input("📁 Chemin vers ton site (ex: ./rpmn0ise.github.io): ").strip()

if not os.path.exists(SITE_ROOT):
    print(f"❌ Erreur: {SITE_ROOT} introuvable")
    exit(1)

print("\n🔧 Application des correctifs...")

# 1. Ajouter fix-bugs.css à tous les HTML
html_files = []
for root, dirs, files in os.walk(SITE_ROOT):
    dirs[:] = [d for d in dirs if not d.startswith('.')]
    for file in files:
        if file.endswith('.html'):
            html_files.append(os.path.join(root, file))

fixed_count = 0

for filepath in html_files:
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    original = content
    
    # Fix 1: Ajouter fix-bugs.css si pas déjà présent
    if 'fix-bugs.css' not in content and '<link rel="stylesheet"' in content:
        # Ajouter après le dernier CSS
        content = re.sub(
            r'(<link rel="stylesheet" href="[^"]+">)(?!.*<link rel="stylesheet")',
            r'\1\n    <link rel="stylesheet" href="/css/fix-bugs.css">',
            content,
            flags=re.DOTALL
        )
    
    # Fix 2: Corriger le logo "> RPMN0ISE"
    content = re.sub(
        r'<a[^>]*class="nav-logo"[^>]*>\s*>\s*RPMN0ISE\s*</a>',
        '<a href="/" class="nav-logo">RPMN0ISE</a>',
        content
    )
    content = re.sub(
        r'<div[^>]*class="nav-logo"[^>]*>\s*>\s*RPMN0ISE\s*</div>',
        '<a href="/" class="nav-logo">RPMN0ISE</a>',
        content
    )
    
    # Fix 3: S'assurer que nav-container existe
    if '<nav class="navbar">' in content and 'nav-container' not in content:
        content = content.replace(
            '<nav class="navbar">',
            '<nav class="navbar">\n    <div class="nav-container">'
        )
        content = re.sub(
            r'</nav>',
            '    </div>\n</nav>',
            content,
            count=1
        )
    
    # Fix 4: Convertir .sidebar left en .sidebar
    content = content.replace('class="sidebar left"', 'class="sidebar"')
    content = content.replace('class="sidebar right"', 'class="sidebar"')
    
    # Fix 5: Ajouter data-glitch au logo si manquant
    content = re.sub(
        r'<a([^>]*class="nav-logo"[^>]*)>',
        r'<a\1 data-glitch>',
        content
    )
    if 'data-glitch data-glitch' in content:
        content = content.replace('data-glitch data-glitch', 'data-glitch')
    
    # Sauvegarder si modifié
    if content != original:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        rel_path = os.path.relpath(filepath, SITE_ROOT)
        print(f"✅ {rel_path}")
        fixed_count += 1

print("\n" + "=" * 50)
print(f"✅ {fixed_count} fichiers corrigés")
print("\n🎯 PROCHAINES ÉTAPES:")
print("1. Copie fix-bugs.css dans /css/")
print("2. Teste ton site")
print("3. Commit et push")
print("\n✨ Correction terminée !")
