#!/usr/bin/env python3
"""
Script de Nettoyage home.html
Supprime les duplications et mal-positionnements
"""

import re
import os

print("🧹 NETTOYAGE HOME.HTML")
print("=" * 50)

# Chemin du fichier
home_path = input("📁 Chemin vers home.html (ex: ./rpmn0ise.github.io/rpmn0ise/home.html): ").strip()

if not os.path.exists(home_path):
    print(f"❌ Erreur: {home_path} introuvable")
    exit(1)

# Lire le fichier
with open(home_path, 'r', encoding='utf-8') as f:
    content = f.read()

original_content = content

print("\n🔧 Application des corrections...")

# Fix 1: Supprimer les navbars dupliquées
# Compter les navbars
navbar_count = content.count('<nav class="navbar">')
print(f"📊 Navbars trouvées: {navbar_count}")

if navbar_count > 1:
    print("🔧 Suppression des navbars dupliquées...")
    
    # Garde seulement la première navbar
    parts = content.split('<nav class="navbar">')
    
    # Reconstruit en gardant la première
    if len(parts) > 2:
        # Trouve la fin de la première navbar
        first_nav_end = parts[1].find('</nav>')
        if first_nav_end != -1:
            # Garde tout avant la première navbar + première navbar complète
            before_nav = parts[0]
            first_nav = parts[1][:first_nav_end + 6]  # +6 pour </nav>
            after_first_nav = parts[1][first_nav_end + 6:]
            
            # Supprime les autres navbars
            remaining = ''.join(parts[2:])
            # Enlève les balises </nav> excédentaires
            remaining = re.sub(r'</nav>\s*', '', remaining, count=navbar_count-1)
            
            content = before_nav + '<nav class="navbar">' + first_nav + after_first_nav + remaining
            
            print(f"✅ {navbar_count - 1} navbar(s) supprimée(s)")

# Fix 2: Déplacer le search box hors du body direct
# Cherche les input search qui sont directement dans body
search_pattern = r'<body[^>]*>.*?<input[^>]*type="search"[^>]*>.*?</body>'
if re.search(r'<body[^>]*>.*?<input[^>]*type="search"', content, re.DOTALL):
    print("🔧 Déplacement du search box...")
    
    # Trouve tous les inputs search hors des containers appropriés
    content = re.sub(
        r'(<body[^>]*>.*?)(<input[^>]*type="search"[^>]*>)(.*?</body>)',
        r'\1<!-- Search box moved to sidebar -->\3',
        content,
        flags=re.DOTALL
    )
    
    print("✅ Search box commenté (à ajouter manuellement dans sidebar)")

# Fix 3: Repositionner ChatBox si mal placé
if 'chatbox' in content.lower() or 'chat-box' in content.lower():
    print("🔧 Vérification ChatBox position...")
    
    # Cherche si ChatBox est avant footer
    if re.search(r'(chatbox|chat-box).*?<footer', content, re.DOTALL | re.IGNORECASE):
        print("✅ ChatBox bien positionnée avant footer")
    else:
        print("⚠️ ChatBox position à vérifier manuellement")

# Fix 4: Ajouter fix-home.css si pas présent
if 'fix-home.css' not in content:
    print("🔧 Ajout de fix-home.css...")
    
    # Cherche le dernier link CSS
    last_css = list(re.finditer(r'<link rel="stylesheet" href="[^"]+\.css">', content))
    
    if last_css:
        last_pos = last_css[-1].end()
        content = content[:last_pos] + '\n    <link rel="stylesheet" href="/css/fix-home.css">' + content[last_pos:]
        print("✅ fix-home.css ajouté")

# Fix 5: Nettoyer les espaces et sauts de ligne excessifs
content = re.sub(r'\n{3,}', '\n\n', content)

# Sauvegarder si modifié
if content != original_content:
    # Backup
    backup_path = home_path + '.backup'
    with open(backup_path, 'w', encoding='utf-8') as f:
        f.write(original_content)
    print(f"💾 Backup créé: {backup_path}")
    
    # Sauvegarder
    with open(home_path, 'w', encoding='utf-8') as f:
        f.write(content)
    
    print("\n" + "=" * 50)
    print("✅ home.html nettoyé et corrigé")
    print("\n🎯 ACTIONS MANUELLES REQUISES:")
    print("1. Copie fix-home.css dans /css/")
    print("2. Vérifie que le search box est bien placé")
    print("3. Vérifie que ChatBox est bien en bas à droite")
    print("4. Teste la page")
    
else:
    print("\n⏭️ Aucune modification nécessaire")

print("\n✨ Nettoyage terminé !")
