#!/usr/bin/env python3
"""
Générateur Wiki SGPI - Structure complète
"""

wiki_structure = {
    "🔒 Confidentialité & Sécurité": {
        "Adblocking": ["Filtres & Extensions", "DNS Adblocking", "Mobile"],
        "VPN & Proxy": ["VPN Servers", "VPN Clients", "Proxy"],
        "Antivirus / Anti-Malware": ["Scanners de fichiers", "Vérification sites web"],
        "Vie privée": ["Navigateur & extensions", "Emails & messageries", "Gestion mots de passe & 2FA"],
        "Réseau & Sécurité": ["Firewall / Wi-Fi", "Surveillance réseau"],
        "Surveillance & traçage": ["Tracking & fingerprinting", "Monitoring fuites"]
    },
    "🤖 Intelligence Artificielle": {
        "Chatbots & IA conversationnelle": ["Officiels", "Multi-modèles", "Local Frontends", "RP & Roleplay"],
        "Génération de contenu": ["Texte & Code", "Image", "Vidéo", "Audio"],
        "Outils IA": ["Prompts & Index", "Writing Tools", "Coding Tools"],
        "Index & Benchmarks": ["Benchmarks", "Comparateurs"],
        "Machine Learning": ["Frameworks", "Tutoriels"],
        "Applications spécialisées": ["Musique", "Design", "Dev", "Gaming"]
    },
    "🎬 Films & Séries": {
        "Streaming Sites": ["Multi-serveur", "Gratuit avec pubs"],
        "Téléchargement / DDL": ["Films", "Séries", "Anime", "Éducatif"],
        "Torrenting": ["Publics", "Privés"],
        "Streaming spécialisé": ["Anime", "Cartoons", "Drama", "Classiques"],
        "Live TV & Sports": ["Live TV", "Sports", "IPTV"],
        "Smart TV & mobiles": ["Android TV", "Firestick", "iOS"],
        "Tracking / Bases": ["Suivi séries", "Recommandations"],
        "Sous-titres & outils": ["Sous-titres", "Lecteurs", "Guides"]
    },
    "🎵 Musique": {
        "Streaming Audio": ["Apps", "Genre spécifique"],
        "Podcasts & Radio": ["Streaming podcasts", "Radio internet", "Lofi"],
        "Téléchargement / DDL": ["Audio direct", "Ripping", "Bots Telegram"],
        "Torrenting Audio": ["Torrents albums"],
        "Royalty Free & Soundtracks": ["Musique libre", "Bandes son"],
        "Outils Audio": ["Lecteurs", "Serveurs", "Éditeurs", "Plugins"]
    },
    "🎮 Jeux Vidéo": {
        "Téléchargement & DDL": ["Repacks", "Linux/Mac/Windows", "Cracks"],
        "Emulation / ROMs": ["Consoles", "ROMs", "Émulateurs", "Homebrew"],
        "Jeux Retro": ["Ports", "Remakes", "Revival"],
        "Browser / Indie": ["Multi-jeux", "RPG", "Shooters", "Simulations"],
        "Tabletop / Puzzle": ["Échecs", "Cartes", "D&D", "Crosswords"],
        "Outils Gaming": ["Launchers", "Mods", "Optimisations", "Minecraft"]
    },
    "📚 Livres, BD & Mangas": {
        "Ebooks": ["PDF", "Calibre", "Lecteurs"],
        "Audiobooks": ["Streaming", "DDL", "Apps"],
        "Manga & Comics": ["BD", "Mangas", "Light novels", "Fanfiction"],
        "Documents & Éducation": ["Manuels", "STEM", "Histoire", "Académique"],
        "Bases & Tracking": ["Recommandations", "Catalogues"],
        "Sites et Apps": ["Lecture en ligne", "Archives"]
    },
    "📥 Téléchargement Direct": {
        "Sites DDL": ["Films", "Séries", "Jeux", "Musique", "Ebooks"],
        "Gestionnaires / Débrideurs": ["Outils premium", "Extensions"],
        "Usenet": ["Indexers", "Providers", "Downloaders"],
        "Logiciels / FOSS": ["Freeware", "Linux", "Mac", "Windows"],
        "Outils de recherche": ["Annuaires", "Moteurs", "Extensions"]
    },
    "🌊 Torrents": {
        "Sites Torrent": ["Films", "Séries", "Musique", "Anime", "Jeux"],
        "Clients Torrent": ["qBittorrent", "Streaming", "Remote", "Mobile"],
        "Trackers": ["Privés", "Publics"],
        "Index / Bases": ["Suivi releases", "Recommandations"],
        "Outils & Apps": ["Automation", "Scripts", "Extensions"]
    },
    "🎓 Éducation & Formation": {
        "Cours & MOOCs": ["Streaming", "DDL", "Spécialisations"],
        "Science / Math / Tech": ["Physique", "Chimie", "Biologie", "Programmation"],
        "Langues": ["Apprentissage", "Européens", "Asiatiques"],
        "Développement / IT": ["Web dev", "Data science", "Cybersecurity"],
        "Jeux éducatifs": ["Chess", "Rubik's", "D&D"],
        "Outils éducatifs": ["Dictionnaires", "Encyclopédies", "Calculatrices"]
    },
    "📱 Mobile": {
        "Android": ["APKs", "Optimisation", "Root", "Camera", "Streaming"],
        "iOS": ["Apps", "Jailbreak", "Sideload", "Adblocking"],
        "Émulation mobile": ["Android sur PC", "Emulateurs"],
        "Apps & Utilitaires": ["Messageries", "Productivité", "Météo"],
        "Mobile Torrenting": ["Apps Android/iOS"],
        "Mobile Gaming": ["Launchers", "Mods", "Optimisation"]
    },
    "💻 Systèmes d'exploitation": {
        "Windows": ["ISOs", "Activation", "Réparation", "Updates"],
        "Linux": ["Distributions", "Guides", "Apps", "CLI"],
        "macOS": ["Apps", "Outils", "System tweaks"],
        "Raspberry Pi & Unix": ["Serveurs", "Projets DIY"],
        "Hackintosh / Multi-OS": ["Installation", "Dual boot"]
    },
    "🛠️ Logiciels & Outils": {
        "Bureautique & Textes": ["Office", "Éditeurs", "Mindmapping"],
        "Audio / Vidéo / Image": ["Édition", "Création", "Conversion"],
        "Développement": ["IDEs", "Toolkits", "Web dev", "Game dev"],
        "Internet / Réseaux": ["Navigateurs", "Sécurité", "OSINT"],
        "Gaming Tools": ["Mods", "Launchers", "Optimisations"],
        "Système & Hardware": ["Monitors", "GPU", "CLI", "Virtualisation"]
    },
    "🌐 Web & Création": {
        "Web Tools": ["SEO", "Scraping", "Archiving", "Paywall bypass"],
        "Social Media": ["Telegram", "Discord", "Reddit", "YouTube"],
        "Text & Fonts": ["Éditeurs", "Markdown", "LaTeX", "Unicode"],
        "Images / Vidéos": ["Création", "Retouche", "3D", "Animation"],
        "Audio / Music": ["Création", "Plugins", "Synthèse"],
        "Web Dev & Hosting": ["Front-end", "Back-end", "CMS", "API"]
    },
    "🔧 Divers": {
        "Non Français": ["Ressources étrangères"],
        "Lifestyle": ["Recettes", "Voyage", "Météo"],
        "Santé & Bien-être": ["Santé mentale", "Physique", "Nutrition"],
        "Finance & Carrière": ["Jobs", "Crypto", "Startups"],
        "Shopping / Free": ["Jeux gratuits", "Deals", "Suivi prix"],
        "Fun / Sites utiles": ["Forums", "Webcams", "Sites interactifs"]
    }
}

def generate_wiki_html():
    html = """<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>SGPI Wiki - Ressources Complètes</title>
    <link rel="stylesheet" href="../css/sgpi-style.css">
    <style>
        .wiki-category {
            background: var(--bg-card);
            border: 1px solid var(--border-color);
            border-radius: var(--radius-lg);
            padding: var(--spacing-lg);
            margin-bottom: var(--spacing-lg);
        }
        .wiki-category h2 {
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: var(--spacing-sm);
            border-radius: var(--radius-sm);
            transition: all 0.3s ease;
        }
        .wiki-category h2:hover {
            background: rgba(0, 255, 136, 0.1);
        }
        .collapse-icon {
            transition: transform 0.3s ease;
            font-size: 0.8em;
        }
        .collapsed .collapse-icon {
            transform: rotate(0deg);
        }
        .expanded .collapse-icon {
            transform: rotate(90deg);
        }
        .wiki-subcategories {
            margin-top: var(--spacing-md);
            margin-left: var(--spacing-lg);
        }
        .wiki-subcategories h3 {
            color: var(--neon-cyan);
            font-size: 1.2rem;
            margin-top: var(--spacing-md);
            margin-bottom: var(--spacing-sm);
        }
        .wiki-subcategories ul {
            list-style: none;
            padding-left: var(--spacing-md);
        }
        .wiki-subcategories li {
            margin: var(--spacing-xs) 0;
            padding-left: var(--spacing-md);
            border-left: 2px solid var(--border-color);
            transition: all 0.3s ease;
        }
        .wiki-subcategories li:hover {
            border-color: var(--neon-green);
            padding-left: var(--spacing-lg);
        }
        .search-box {
            margin-bottom: var(--spacing-xl);
        }
        .search-box input {
            width: 100%;
            max-width: 600px;
            padding: var(--spacing-md);
            font-size: 1.1rem;
            border: 2px solid var(--border-color);
            border-radius: var(--radius-lg);
            background: var(--bg-secondary);
            color: var(--text-primary);
            transition: all 0.3s ease;
        }
        .search-box input:focus {
            border-color: var(--neon-green);
            box-shadow: var(--glow-green);
        }
    </style>
</head>
<body>

<header>
    <div class="header-content">
        <div class="logo">
            <a href="../index.html"><h1>SGPI</h1></a>
        </div>
        <nav>
            <ul>
                <li><a href="../index.html">Accueil</a></li>
                <li><a href="index.html" class="active">Wiki</a></li>
                <li><a href="../pages/tutos.html">Tutos</a></li>
                <li><a href="../pages/projets.html">Projets</a></li>
                <li><a href="../pages/about.html">À propos</a></li>
                <li><a href="../acces.html" class="btn btn-primary">Join Discord</a></li>
                <li><button id="theme-toggle" class="theme-toggle">☀️</button></li>
            </ul>
        </nav>
    </div>
</header>

<section class="hero">
    <h1>📚 SGPI Wiki</h1>
    <p class="tagline">Ressources, liens et guides de la communauté</p>
</section>

<main class="container">

<div class="card mb-lg">
    <p style="font-size: 1.1rem;">
        Bienvenue sur le <strong>Wiki SGPI</strong>. Plus de <strong>150+ ressources</strong> organisées 
        en <strong>14 catégories</strong>. Tout le contenu est maintenu par la communauté.
    </p>
    <p class="text-muted">
        💡 <strong>Astuce :</strong> Utilise la recherche ou Ctrl+F pour trouver rapidement ce que tu cherches.
    </p>
</div>

<div class="search-box text-center mb-xl">
    <input type="text" 
           id="wiki-search" 
           placeholder="🔍 Rechercher dans le wiki..."
           autocomplete="off">
</div>

<div id="wiki-content">
"""
    
    for category, subcats in wiki_structure.items():
        cat_id = category.replace(' ', '-').replace('&', '').lower()
        html += f"""
<div class="wiki-category expanded">
    <h2 onclick="toggleWikiCategory('{cat_id}')">
        <span>{category}</span>
        <span class="collapse-icon">▶</span>
    </h2>
    <div id="{cat_id}" class="wiki-subcategories">
"""
        
        for subcat, items in subcats.items():
            html += f"        <h3>{subcat}</h3>\n        <ul>\n"
            for item in items:
                html += f"            <li>{item} → <a href='#'>À remplir</a></li>\n"
            html += "        </ul>\n"
        
        html += "    </div>\n</div>\n\n"
    
    html += """
</div>

<div class="card mt-xl" style="background: rgba(0,212,255,0.05); border-color: var(--info);">
    <h3 style="color: var(--info);">ℹ️ Comment contribuer ?</h3>
    <p>
        Tu as des ressources à partager ? Propose-les sur Discord dans <strong>#wiki-suggestions</strong> !
    </p>
    <p>
        Les admins mettent à jour le wiki régulièrement avec les meilleures suggestions.
    </p>
</div>

</main>

<footer>
    <p>&copy; 2026 SGPI - Communauté Tech Underground</p>
    <p class="text-muted">
        📚 150+ ressources • 25+ tutos • 🟢 Discord actif
    </p>
</footer>

<script src="../js/sgpi.js"></script>
<script>
// Toggle catégories
function toggleWikiCategory(id) {
    const content = document.getElementById(id);
    const parent = content.parentElement;
    
    if (content.style.display === 'none') {
        content.style.display = 'block';
        parent.classList.add('expanded');
        parent.classList.remove('collapsed');
    } else {
        content.style.display = 'none';
        parent.classList.add('collapsed');
        parent.classList.remove('expanded');
    }
}

// Search wiki
document.getElementById('wiki-search').addEventListener('input', function(e) {
    const query = e.target.value.toLowerCase();
    const categories = document.querySelectorAll('.wiki-category');
    
    if (!query) {
        categories.forEach(cat => cat.style.display = 'block');
        return;
    }
    
    categories.forEach(cat => {
        const text = cat.textContent.toLowerCase();
        cat.style.display = text.includes(query) ? 'block' : 'none';
    });
});
</script>

</body>
</html>
"""
    
    return html

if __name__ == "__main__":
    html = generate_wiki_html()
    with open('/home/claude/sgpi-final/wiki/index.html', 'w', encoding='utf-8') as f:
        f.write(html)
    print("✅ Wiki généré : wiki/index.html")
