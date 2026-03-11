#!/usr/bin/env python3
"""
Générateur Wiki SGPI - Crée le HTML complet du wiki
"""

# Structure complète du wiki
WIKI_STRUCTURE = {
    "🔒 Confidentialité & Sécurité": {
        "Adblocking": ["Filtres & Extensions", "DNS Adblocking", "Mobile"],
        "VPN & Proxy": ["VPN Servers", "VPN Clients", "Proxy"],
        "Antivirus / Anti-Malware": ["Scanners de fichiers", "Vérification sites web"],
        "Vie privée": ["Navigateur & extension privacy", "Emails & messageries chiffrées", "Gestion mots de passe & 2FA"],
        "Réseau & Sécurité": ["Firewall / Wi-Fi sécurisé", "Surveillance réseau"],
        "Surveillance & traçage": ["Tracking & fingerprinting", "Monitoring fuites de données"]
    },
    "🤖 Intelligence Artificielle": {
        "Chatbots & IA conversationnelle": ["Officiels", "Multi-modèles", "Local Frontends", "RP & Roleplay"],
        "Génération de contenu": ["Texte & Code", "Image", "Vidéo", "Audio"],
        "Outils IA": ["Prompts & Index", "Writing Tools", "Coding Tools"],
        "Index & Benchmarks": ["Benchmarks spécialisés", "Comparateurs & classement IA"],
        "Machine Learning": ["Frameworks", "Tutoriels & ressources"],
        "Applications spécialisées": ["IA musicale, design, dev, gaming"]
    },
    "🎬 Films & Séries": {
        "Streaming Sites": ["Multi-serveur & embeds", "Gratuit avec pubs"],
        "Téléchargement / DDL": ["Films, séries, anime, éducatif"],
        "Torrenting": ["Torrents publics & privés"],
        "Streaming spécialisé": ["Anime, cartoons, drama, classiques"],
        "Live TV & Sports": ["Live TV", "Live Sports", "IPTV"],
        "Smart TV & mobiles": ["Android TV", "Firestick", "iOS apps"],
        "Tracking / Bases": ["Suivi séries", "recommandations"],
        "Sous-titres & outils": ["Sous-titres", "Lecteurs", "Guides"]
    },
    "🎵 Musique": {
        "Streaming Audio": ["Apps & sites", "Genre spécifique"],
        "Podcasts & Radio": ["Podcasts", "Radio internet"],
        "Téléchargement / DDL": ["Audio direct", "Ripping"],
        "Torrenting Audio": ["Torrents albums"],
        "Royalty Free": ["Musique libre", "Soundtracks"],
        "Outils Audio": ["Lecteurs", "Éditeurs", "Plugins"]
    },
    "🎮 Jeux Vidéo": {
        "Téléchargement & DDL": ["Repacks", "Cracks"],
        "Emulation / ROMs": ["Consoles", "ROMs", "Émulateurs"],
        "Jeux Retro": ["Abandonware", "Ports", "Remakes"],
        "Browser / Indie": ["Multi-jeux", "RPG", "Shooters"],
        "Tabletop / Puzzle": ["Échecs", "Cartes", "D&D"],
        "Outils Gaming": ["Launchers", "Mods", "Minecraft tools"]
    },
    "📚 Livres, BD & Mangas": {
        "Ebooks": ["PDF", "Calibre", "Lecteurs"],
        "Audiobooks": ["Streaming", "DDL", "Apps"],
        "Manga & Comics": ["BD", "Mangas", "Fanfiction"],
        "Documents & Éducation": ["Manuels", "STEM", "Académique"],
        "Bases & Tracking": ["Recommandations", "Catalogues"],
        "Sites et Apps": ["Lecture en ligne", "Archives"]
    },
    "📥 Téléchargement Direct": {
        "Sites DDL": ["Films", "Séries", "Jeux", "Musique", "Ebooks"],
        "Gestionnaires": ["Outils premium free", "Extensions"],
        "Usenet": ["Indexers", "Providers"],
        "Logiciels / FOSS": ["Freeware", "Linux", "Windows"],
        "Outils de recherche": ["Annuaires", "Moteurs"]
    },
    "🌐 Torrents": {
        "Sites Torrent": ["Films", "Séries", "Anime", "Jeux"],
        "Clients Torrent": ["qBittorrent", "Streaming"],
        "Trackers": ["Privés", "Publics"],
        "Index": ["Suivi releases", "Recommandations"],
        "Outils & Apps": ["Automation", "Scripts"]
    },
    "🎓 Éducation & Formation": {
        "Cours & MOOCs": ["Streaming", "DDL", "Spécialisations"],
        "Science / Math / Tech": ["Physique", "Chimie", "Programmation"],
        "Langues": ["Apprentissage", "Européens", "Asiatiques"],
        "Développement / IT": ["Web dev", "Data science", "Cybersecurity"],
        "Jeux éducatifs": ["Chess", "D&D"],
        "Outils": ["Dictionnaires", "Encyclopédies", "Wiki tools"]
    },
    "📱 Mobile": {
        "Android": ["APKs moddés", "Root", "Personnalisation"],
        "iOS": ["Apps", "Jailbreak", "Sideload"],
        "Émulation mobile": ["Android sur PC", "Emulateurs"],
        "Apps & Utilitaires": ["Messageries", "Productivité"],
        "Mobile Torrenting": ["Apps torrents"],
        "Mobile Gaming": ["Launchers", "Mods"]
    },
    "💻 Systèmes d'exploitation": {
        "Windows": ["ISOs", "Activation", "Updates"],
        "Linux": ["Distributions", "Apps", "CLI"],
        "macOS": ["Apps", "Outils", "Tweaks"],
        "Raspberry Pi": ["Serveurs", "Projets DIY"],
        "Hackintosh": ["Installation", "Dual boot"]
    },
    "🛠️ Logiciels & Outils": {
        "Bureautique": ["Suites office", "Éditeurs"],
        "Audio / Vidéo / Image": ["Édition", "Création"],
        "Développement": ["IDEs", "Toolkits"],
        "Internet": ["Navigateurs", "Messageries"],
        "Gaming Tools": ["Mods", "Optimisations"],
        "Système": ["Monitors", "Virtualisation"]
    },
    "🌐 Web & Création": {
        "Web Tools": ["SEO", "Scraping", "Paywall bypass"],
        "Social Media": ["Telegram", "Discord", "Reddit"],
        "Text & Fonts": ["Éditeurs", "Markdown", "Unicode"],
        "Images / Vidéos": ["Création", "3D", "Animation"],
        "Audio / Music": ["Plugins", "Édition"],
        "Web Dev": ["Front-end", "Back-end", "CMS"]
    },
    "🔧 Divers": {
        "Non Français": ["Ressources étrangères"],
        "Lifestyle": ["Recettes", "Voyage"],
        "Santé": ["Santé mentale", "Nutrition"],
        "Finance": ["Jobs", "Crypto"],
        "Shopping": ["Jeux gratuits", "Deals"],
        "Fun": ["Forums", "Sites interactifs"]
    }
}

# Générer HTML
html = """<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>SGPI Wiki - Ressources Complètes</title>
<link rel="stylesheet" href="../css/sgpi-style.css">
<style>
.search-box{background:var(--bg-card);padding:20px;border-radius:var(--radius-lg);margin-bottom:30px;border:2px solid var(--neon-green)}
.search-box input{width:100%;padding:12px;font-size:1.1rem;margin-bottom:10px}
.wiki-category{margin-bottom:30px}
.wiki-category h2{cursor:pointer;padding:15px;background:var(--bg-secondary);border-radius:var(--radius-md);border:1px solid var(--border-color);display:flex;justify-content:space-between;align-items:center}
.wiki-category h2:hover{border-color:var(--neon-green);background:rgba(0,255,136,0.1)}
.wiki-subcategory{margin:15px 0 15px 30px}
.wiki-subcategory h3{font-size:1.3rem;margin-bottom:10px;color:var(--neon-cyan)}
.wiki-links{margin-left:20px;line-height:2}
.wiki-link{color:var(--text-secondary);padding:4px 0;display:block}
.wiki-link:hover{color:var(--neon-green);padding-left:10px}
.collapse-icon{color:var(--neon-green);font-size:1.2rem}
</style>
</head>
<body>

<header>
<div class="header-content">
<div class="logo"><a href="../index.html"><h1>SGPI</h1></a></div>
<nav><ul>
<li><a href="../index.html">Accueil</a></li>
<li><a href="index.html" class="active">Wiki</a></li>
<li><a href="tutos.html">Tutos</a></li>
<li><a href="../pages/projets.html">Projets</a></li>
<li><a href="../pages/about.html">À propos</a></li>
<li><a href="../acces.html" class="btn btn-primary">Join Discord</a></li>
<li><button id="theme-toggle" class="theme-toggle">☀️</button></li>
</ul></nav>
</div>
</header>

<section class="hero">
<h1>📚 SGPI Wiki</h1>
<p class="tagline">Ressources tech complètes</p>
</section>

<main class="container">

<div class="search-box">
<input type="text" id="wiki-search" placeholder="🔍 Rechercher dans le wiki..." oninput="searchWiki()">
<p id="search-results" class="text-muted"></p>
</div>

<div class="card mb-lg">
<p><strong>Le Wiki SGPI</strong> centralise des ressources tech organisées par catégories. Tout le contenu est maintenu par la communauté.</p>
<p class="text-muted">💡 Utilise la recherche ci-dessus ou explore les catégories. Clique sur une catégorie pour la déplier.</p>
<p class="text-warning">⚠️ <strong>Les liens sont ajoutés progressivement.</strong> Propose tes ressources sur Discord !</p>
</div>

"""

cat_id = 0
for category, subcats in WIKI_STRUCTURE.items():
    cat_id += 1
    html += f"""
<div class="wiki-category">
<h2 onclick="toggleCategory('cat-{cat_id}')">
<span>{category}</span>
<span class="collapse-icon">▶</span>
</h2>
<div id="cat-{cat_id}" style="display:none;">
"""
    for subcat, items in subcats.items():
        html += f"""
<div class="wiki-subcategory">
<h3>{subcat}</h3>
<div class="wiki-links">
"""
        for item in items:
            html += f'<span class="wiki-link">• {item}</span>\n'
        html += "</div></div>\n"
    html += "</div></div>\n"

html += """
</main>

<footer>
<p>&copy; 2026 SGPI</p>
<p class="text-muted"><a href="../index.html">Accueil</a> • <a href="../pages/about.html">À propos</a></p>
</footer>

<script src="../js/sgpi-final.js"></script>
</body>
</html>
"""

# Sauvegarder
with open('/home/claude/sgpi-v2-FINAL/wiki/index.html', 'w', encoding='utf-8') as f:
    f.write(html)

print("✅ Wiki HTML généré :", len(html), "caractères")
