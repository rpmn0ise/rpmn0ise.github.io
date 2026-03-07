#!/usr/bin/env python3
"""
CSS Unifier - FIXED VERSION
Applique le CSS unifié à TOUTES les pages
"""

import os
import re
from pathlib import Path

print("🎨 CSS UNIFICATION - FIXED VERSION")
print("=" * 60)

# Get site directory
site_dir = input("📁 Path to your site: ").strip()
if not site_dir:
    site_dir = "."

site_path = Path(site_dir).resolve()
print(f"✅ Working in: {site_path}\n")

# CSS link à ajouter
CSS_LINK = '<link rel="stylesheet" href="/assets/css/style-unified.css">'

# Trouver tous les HTML
html_files = []
for ext in ['*.html']:
    html_files.extend(site_path.rglob(ext))

# Filter out unwanted directories
html_files = [f for f in html_files if not any(
    skip in str(f) for skip in ['.git', 'node_modules', '_backup', 'backup']
)]

print(f"📄 Found {len(html_files)} HTML files\n")

modified = 0
skipped = 0

for html_file in html_files:
    try:
        # Lire le fichier
        with open(html_file, 'r', encoding='utf-8') as f:
            content = f.read()
        
        original = content
        
        # Check si déjà unifié
        if 'style-unified.css' in content:
            print(f"⏭️  {html_file.name} (already has unified CSS)")
            skipped += 1
            continue
        
        # Vérifier qu'il y a un <head>
        if '<head>' not in content.lower():
            print(f"⚠️  {html_file.name} (no <head> found, skipping)")
            skipped += 1
            continue
        
        # MÉTHODE 1: Ajouter AVANT </head>
        if '</head>' in content:
            # Ajouter juste avant </head>
            content = content.replace('</head>', f'    {CSS_LINK}\n</head>')
            print(f"✅ {html_file.relative_to(site_path)}")
            
            # Écrire le fichier modifié
            with open(html_file, 'w', encoding='utf-8') as f:
                f.write(content)
            
            modified += 1
        else:
            print(f"⚠️  {html_file.name} (no </head> found)")
            skipped += 1
            
    except Exception as e:
        print(f"❌ Error: {html_file.name} - {e}")

print("\n" + "=" * 60)
print(f"✅ Modified: {modified} files")
print(f"⏭️  Skipped: {skipped} files")
print("\n📋 NEXT STEPS:")
print("1. Verify assets/css/style-unified.css exists")
print("2. Test: python -m http.server 8000")
print("3. Check all pages have same style")
print("4. Deploy!")
print("\n✨ Done!")
