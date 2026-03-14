#!/usr/bin/env python3
"""
Script Auto-Update Wiki SGPI
Génère HTML depuis MD + met à jour tous les index
"""
import sys, re
from pathlib import Path

WIKI_CATEGORIES = {
    "confidentialite": "🔒 Confidentialité & Sécurité",
    "ia": "🤖 Intelligence Artificielle",
    "films": "🎬 Films & Séries",
    "musique": "🎵 Musique",
    "jeux": "🎮 Jeux Vidéo",
    "livres": "📚 Livres, BD & Mangas",
    "ddl": "📥 Téléchargement Direct",
    "torrents": "🌊 Torrents",
    "education": "🎓 Éducation & Formation",
    "mobile": "📱 Mobile",
    "os": "💻 Systèmes d'exploitation",
    "logiciels": "🛠️ Logiciels & Outils",
    "web": "🌐 Web & Création",
    "divers": "🔧 Divers"
}

def md_to_html_simple(md):
    """Convert MD to HTML (simple version pour wiki)"""
    html = md
    
    # Headers (ordre important : H3 avant H2)
    html = re.sub(r'^### (.+)$', r'<h3>\1</h3>', html, flags=re.M)
    html = re.sub(r'^## (.+)$', r'<h2>\1</h2>', html, flags=re.M)
    html = re.sub(r'^# (.+)$', r'<h1>\1</h1>', html, flags=re.M)
    
    # Bold
    html = re.sub(r'\*\*(.+?)\*\*', r'<strong>\1</strong>', html)
    
    # Links
    html = re.sub(r'\[(.+?)\]\((.+?)\)', r'<a href="\2" target="_blank" rel="noopener">\1</a>', html)
    
    # Process lists
    lines = html.split('\n')
    result = []
    in_ul = False
    
    for line in lines:
        if line.startswith('- '):
            if not in_ul:
                result.append('<ul class="resource-list">')
                in_ul = True
            content = line[2:]
            result.append(f'<li>{content}</li>')
        else:
            if in_ul:
                result.append('</ul>')
                in_ul = False
            result.append(line)
    
    if in_ul:
        result.append('</ul>')
    
    return '\n'.join(result)

def generate_category_page(category_id, md_file):
    """Generate category page HTML"""
    
    content = Path(md_file).read_text(encoding='utf-8')
    category_name = WIKI_CATEGORIES.get(category_id, category_id)
    
    html_content = md_to_html_simple(content)
    
    template = f'''<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>{category_name} - SGPI Wiki</title>
<link rel="stylesheet" href="../../css/sgpi-style.css">
<style>
.wiki-layout{{display:flex;gap:2rem;margin-top:2rem}}
.sidebar-left{{width:250px;flex-shrink:0;position:sticky;top:80px;height:fit-content;max-height:calc(100vh - 100px);overflow-y:auto;background:var(--bg-card);border:1px solid var(--border-color);border-radius:var(--radius-lg);padding:var(--spacing-lg)}}
.sidebar-left h3{{color:var(--neon-green);margin-bottom:1rem;font-size:1.1rem}}
.sidebar-left ul{{list-style:none;padding:0}}
.sidebar-left li{{margin:4px 0}}
.sidebar-left a{{display:block;padding:10px 12px;border-radius:6px;transition:all .3s;color:var(--text-secondary);font-size:0.95rem}}
.sidebar-left a:hover,.sidebar-left a.active{{background:rgba(0,255,136,0.1);color:var(--neon-green);transform:translateX(4px)}}
.wiki-main{{flex:1;min-width:0}}
.wiki-main h1{{color:var(--neon-green);margin-bottom:2rem}}
.wiki-main h2{{color:var(--neon-cyan);margin-top:2rem;margin-bottom:1rem;padding-bottom:0.5rem;border-bottom:2px solid var(--border-color)}}
.wiki-main h3{{color:var(--text-primary);font-size:1.15rem;margin-top:1.5rem;margin-bottom:0.75rem;font-weight:600}}
.resource-list{{list-style:none;padding:0;margin-left:1rem}}
.resource-list li{{padding:10px 12px;margin:6px 0;background:var(--bg-secondary);border-left:3px solid var(--border-color);border-radius:4px;transition:all .3s}}
.resource-list li:hover{{border-color:var(--neon-green);transform:translateX(4px);background:var(--bg-tertiary)}}
@media(max-width:1024px){{.wiki-layout{{flex-direction:column}}.sidebar-left{{width:100%;position:static;max-height:none}}}}
</style>
</head>
<body>

<header>
<div class="header-content">
<div class="logo"><a href="../../index.html"><h1>SGPI</h1></a></div>
<nav><ul>
<li><a href="../../index.html">Accueil</a></li>
<li><a href="../index.html" class="active">Wiki</a></li>
<li><a href="../../wiki/tutos.html">Tutos</a></li>
<li><a href="../../pages/projets.html">Projets</a></li>
<li><a href="../../pages/about.html">À propos</a></li>
<li><a href="../../acces.html" class="btn btn-primary">Discord</a></li>
<li><button id="theme-toggle" class="theme-toggle">☀️</button></li>
</ul></nav>
</div>
</header>

<main class="container">

<div class="breadcrumb" style="margin-bottom:1rem;color:var(--text-muted)">
<a href="../../index.html">Accueil</a> → <a href="../index.html">Wiki</a> → <strong>{category_name}</strong>
</div>

<div class="wiki-layout">

<aside class="sidebar-left">
<h3>📂 Catégories</h3>
<ul>
{"".join([f'<li><a href="{cid}.html" {"class=\\'active\\'" if cid == category_id else ""}>{cname}</a></li>' for cid, cname in WIKI_CATEGORIES.items()])}
</ul>
</aside>

<div class="wiki-main">
<div id="wiki-content">
{html_content}
</div>

<div class="card" style="margin-top:3rem;background:rgba(0,212,255,0.05);border-color:var(--info)">
<h3 style="color:var(--info)">💡 Contribuer</h3>
<p>Tu connais d'autres ressources ? Partage-les sur Discord dans <strong>#wiki-suggestions</strong> !</p>
</div>
</div>

</div>

</main>

<footer>
<p>&copy; 2026 SGPI</p>
<p style="color:var(--text-muted)">📚 150+ ressources • 60+ tutos • 🟢 Discord actif</p>
</footer>

<script src="../../js/sgpi.js"></script>
</body>
</html>'''
    
    return template

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python update-wiki.py fichier.md")
        print("Exemple: python update-wiki.py wiki/sources/confidentialite.md")
        sys.exit(1)
    
    md_file = Path(sys.argv[1])
    if not md_file.exists():
        print(f"❌ Fichier introuvable: {md_file}")
        sys.exit(1)
    
    # Déterminer catégorie depuis nom fichier
    stem = md_file.stem
    category_id = stem.split('-')[0] if '-' in stem else stem
    
    if category_id not in WIKI_CATEGORIES:
        print(f"❌ Catégorie inconnue: {category_id}")
        print(f"Catégories valides: {', '.join(WIKI_CATEGORIES.keys())}")
        sys.exit(1)
    
    # Générer HTML
    html = generate_category_page(category_id, md_file)
    
    # Sauvegarder
    output_file = Path('wiki/categories') / f'{category_id}.html'
    output_file.parent.mkdir(parents=True, exist_ok=True)
    output_file.write_text(html, encoding='utf-8')
    
    print(f"✅ Page wiki générée: {output_file}")
