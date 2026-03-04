#!/usr/bin/env python3
"""
Gaming UI Migration Script
Convertit automatiquement toutes les pages HTML vers le nouveau thème Gaming UI
"""

import os
import re
from pathlib import Path
import shutil
from datetime import datetime

print("🎮 GAMING UI - Migration Script")
print("=" * 50)

# Configuration
SITE_ROOT = input("📁 Chemin vers rpmn0ise.github.io (ex: ./rpmn0ise.github.io): ").strip()

if not os.path.exists(SITE_ROOT):
    print(f"❌ Erreur: Le dossier {SITE_ROOT} n'existe pas")
    exit(1)

# Créer un backup
backup_dir = f"{SITE_ROOT}_backup_{datetime.now().strftime('%Y%m%d_%H%M%S')}"
print(f"\n📦 Création backup: {backup_dir}")
shutil.copytree(SITE_ROOT, backup_dir)
print("✅ Backup créé")

# Fichiers à migrer
html_files = []
for root, dirs, files in os.walk(SITE_ROOT):
    # Ignorer .git et autres
    dirs[:] = [d for d in dirs if not d.startswith('.')]
    for file in files:
        if file.endswith('.html'):
            html_files.append(os.path.join(root, file))

print(f"\n📄 {len(html_files)} fichiers HTML trouvés")

# Patterns de remplacement
OLD_CSS = r'<link rel="stylesheet" href="/css/style\.css">'
NEW_CSS = '''<link rel="stylesheet" href="/css/theme-config.css">
    <link rel="stylesheet" href="/css/style-gaming.css">'''

OLD_NAVBAR = r'<nav class="navbar">\s*<div class="nav-logo">RPMN0ISE</div>'
NEW_NAVBAR = '''<nav class="navbar">
    <div class="nav-container">
        <a href="/" class="nav-logo" data-glitch>RPMN0ISE</a>'''

OLD_NAV_LINKS_START = r'<ul class="nav-links">'
NEW_NAV_LINKS = '''<ul class="nav-links">
            <li><a href="/rpmn0ise/home.html">Home</a></li>
            <li><a href="/rpmn0ise/audio/index.html">Audio</a></li>
            <li><a href="/rpmn0ise/gaming/index.html">Gaming</a></li>
            <li><a href="/rpmn0ise/hacking/index.html">Hacking</a></li>
            <li><a href="/rpmn0ise/music/index.html">Music</a></li>
            <li><a href="/sgpi">SGPI</a></li>
            <li><a href="/rpmn0ise/hardware/index.html">Hardware</a></li>
        </ul>
        
        <button class="nav-toggle" aria-label="Toggle menu">
            <span></span>
            <span></span>
            <span></span>
        </button>
    </div>'''

OLD_FOOTER = r'<footer>\s*<p>© 2026 – RPMN0ISE</p>\s*</footer>'
NEW_FOOTER = '''<footer>
    <p>© 2026 RPMN0ISE • Built with passion for tech and gaming</p>
    <p style="margin-top: var(--spacing-sm); font-size: var(--font-size-xs);">
        Powered by <span style="color: var(--accent-primary);">Nord Theme</span>
    </p>
</footer>'''

# Ajouter gaming-ui.js avant </body>
GAMING_JS = '''
<!-- Gaming UI Script -->
<script src="/js/gaming-ui.js"></script>
</body>'''

# Fonctions de migration
def migrate_file(filepath):
    """Migre un fichier HTML vers Gaming UI"""
    
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    original_content = content
    
    # 1. Remplacer le CSS
    content = re.sub(OLD_CSS, NEW_CSS, content)
    
    # 2. Migrer la navbar
    content = re.sub(OLD_NAVBAR, NEW_NAVBAR, content, flags=re.DOTALL)
    
    # 3. Ajouter le hamburger menu si nav-links existe
    if '<ul class="nav-links">' in content and '<button class="nav-toggle"' not in content:
        # Extraire les liens existants
        nav_match = re.search(r'<ul class="nav-links">(.*?)</ul>', content, re.DOTALL)
        if nav_match:
            # Remplacer par la nouvelle structure
            content = re.sub(
                r'<ul class="nav-links">.*?</ul>',
                NEW_NAV_LINKS,
                content,
                flags=re.DOTALL,
                count=1
            )
    
    # 4. Migrer le footer
    content = re.sub(OLD_FOOTER, NEW_FOOTER, content, flags=re.DOTALL)
    
    # 5. Ajouter gaming-ui.js si pas déjà présent
    if '/js/gaming-ui.js' not in content:
        content = content.replace('</body>', GAMING_JS)
    
    # 6. Convertir les classes de layout
    # .sidebar left → sidebar-gaming
    content = content.replace('class="sidebar left"', 'class="sidebar-gaming"')
    content = content.replace('class="sidebar right"', 'class="sidebar-gaming"')
    
    # 7. Convertir les blocks en cards
    content = content.replace('class="block"', 'class="card"')
    
    # 8. Ajouter nav-container si manquant
    if 'nav-container' not in content and '<nav class="navbar">' in content:
        content = content.replace(
            '<nav class="navbar">',
            '<nav class="navbar">\n    <div class="nav-container">'
        )
        # Fermer nav-container avant </nav>
        content = content.replace('</nav>', '    </div>\n</nav>')
    
    # Sauvegarder si modifié
    if content != original_content:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        return True
    return False

# Migration
print("\n🔄 Migration en cours...\n")
migrated = 0
skipped = 0

for filepath in html_files:
    rel_path = os.path.relpath(filepath, SITE_ROOT)
    
    try:
        if migrate_file(filepath):
            print(f"✅ {rel_path}")
            migrated += 1
        else:
            print(f"⏭️  {rel_path} (déjà à jour)")
            skipped += 1
    except Exception as e:
        print(f"❌ {rel_path}: {e}")

# Résumé
print("\n" + "=" * 50)
print("📊 RÉSUMÉ DE LA MIGRATION")
print("=" * 50)
print(f"✅ Fichiers migrés: {migrated}")
print(f"⏭️  Fichiers skipped: {skipped}")
print(f"📁 Backup: {backup_dir}")
print("\n🎯 PROCHAINES ÉTAPES:")
print("1. Teste ton site localement (python3 -m http.server)")
print("2. Vérifie que tout fonctionne")
print("3. Si OK, commit et push")
print("4. Si problème, restaure depuis le backup")
print("\n✨ Migration terminée !")
