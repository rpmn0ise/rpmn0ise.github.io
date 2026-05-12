#!/usr/bin/env python3
"""Générateur page Tutos SGPI"""

tutos = {
    "🎮 Jeux Vidéo": [
        ("BeamNG.drive - Mods & Setup", "Installation mods, configuration optimale, setup FFB"),
        ("Assetto Corsa - CSP & SOL", "Content Manager, Custom Shaders Patch, SOL weather"),
        ("Minecraft - Serveurs & Mods", "Créer serveur, installer mods/shaders, optimisation"),
        ("Emulation Complète", "RetroArch setup, PCSX2, Dolphin, Yuzu, configuration"),
        ("Optimisation Gaming FPS", "Overclocking GPU, tweaks Windows, réduire latence"),
        ("Steam Family Sharing Tricks", "Partage jeux, regional pricing, refunds"),
        ("Modding avec Nexus Mods", "Installation Vortex/MO2, résolution conflits"),
    ],
    "🔓 Zone Grise": [
        ("Activer Windows 10/11", "KMS activator, scripts PowerShell, maintenance"),
        ("Activer Office 365", "Méthodes activation, troubleshooting, updates"),
        ("Crack Adobe CC 2024", "Photoshop, Premiere Pro, After Effects, Illustrator"),
        ("Spotify Premium Modded", "APK Android, desktop modded, alternatives"),
        ("Bypass Paywalls Presse", "NYT, Medium, Le Monde, extensions navigateur"),
        ("Download Cours Premium", "Udemy, Skillshare, MasterClass, methods"),
        ("IPTV Setup Complet", "M3u playlists, EPG setup, meilleures apps"),
        ("Real-Debrid Guide", "Setup, intégration Kodi/Stremio, troubleshooting"),
        ("Crack AutoCAD & MATLAB", "Installation, activation, versions stables"),
    ],
    "💻 Système & Outils": [
        ("Clé USB Bootable Multi-OS", "Ventoy, Rufus, multiple ISOs sur une clé"),
        ("Installer Linux Dual-Boot", "Ubuntu/Arch/Manjaro avec Windows, GRUB"),
        ("Partitionnement Avancé", "GParted, fdisk, resize sans perte données"),
        ("Réparer Windows Complet", "SFC, DISM, safe mode, recovery"),
        ("Debloat Windows 11", "Scripts, services inutiles, registry tweaks"),
        ("Backup & Clonage Disque", "Clonezilla, Macrium Reflect, rsync Linux"),
        ("Virtualisation VirtualBox", "Install VM, USB passthrough, snapshots"),
    ],
    "🔒 Sécurité & Vie Privée": [
        ("Setup VPN Personnel", "OpenVPN, WireGuard, VPS configuration"),
        ("Tor Browser & Bridges", "Installation, obfs4, snowflake bridges"),
        ("Chiffrement VeraCrypt", "Créer volumes chiffrés, hidden volumes"),
        ("Password Manager Bitwarden", "Setup, auto-fill, 2FA integration"),
        ("2FA avec Hardware Keys", "YubiKey, FIDO2, setup services"),
        ("OPSEC Guide Pratique", "Bonnes pratiques, erreurs à éviter"),
        ("Anonymat Multi-Layer", "VPN → Tor, fingerprinting protection"),
    ],
    "🌐 Web & Réseau": [
        ("Héberger Site GitHub Pages", "Setup repo, custom domain, HTTPS"),
        ("Acheter Domaine & DNS", "Namecheap, Cloudflare DNS, configuration"),
        ("Self-Hosting Nginx", "Install serveur web, reverse proxy, SSL"),
        ("Raspberry Pi Media Server", "Plex/Jellyfin, Pi-hole, VPN server"),
        ("Web Scraping Python", "BeautifulSoup, Selenium, légalité"),
        ("Automatisation IFTTT", "Webhooks, intégrations, scripts"),
    ],
    "📱 Mobile": [
        ("Root Android Magisk", "Unlock bootloader, install Magisk, modules"),
        ("Jailbreak iOS Actuel", "Méthodes 2026, tweaks Cydia/Sileo"),
        ("APK Modded Sources Sûres", "Mobilism, APKMirror, vérification"),
        ("Sideload iOS AltStore", "Installation, refresh apps, certificats"),
        ("Debloat Smartphone ADB", "Scripts, apps system à supprimer"),
    ],
    "🎨 Création & Productivité": [
        ("DaVinci Resolve Basics", "Montage vidéo, color grading, export"),
        ("Photoshop Techniques Pro", "Masques, calques, retouche portrait"),
        ("Traitement Audio Audacity", "Noise reduction, compression, EQ"),
        ("Blender 3D Introduction", "Modélisation, textures, render"),
        ("Streaming OBS Setup", "Scenes, sources, overlays, stream key"),
    ],
    "🤖 IA & Automation": [
        ("ChatGPT Prompts Efficaces", "Engineering, exemples, use cases"),
        ("Stable Diffusion Local", "Installation, modèles, LoRA, upscaling"),
        ("Voice Clone & TTS", "Eleven Labs, Coqui, local solutions"),
        ("Python Scripts Automation", "File management, web tasks, scheduling"),
    ],
    "💾 Data & Stockage": [
        ("Plex Media Server Setup", "Installation, bibliothèques, metadata"),
        ("Torrenting Sécurisé", "qBittorrent + VPN, port forwarding, ratio"),
        ("Cloud Sync Rclone", "Google Drive, MEGA, chiffrement"),
        ("Recovery Données Perdues", "TestDisk, PhotoRec, méthodes"),
    ],
}

html_start = """<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>SGPI - Tutoriels Complets</title>
    <link rel="stylesheet" href="../css/sgpi-style.css">
    <style>
.tuto-category{background:var(--bg-card);border:1px solid var(--border-color);border-radius:var(--radius-lg);padding:var(--spacing-lg);margin-bottom:var(--spacing-xl)}
.tuto-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:var(--spacing-md);margin-top:var(--spacing-md)}
.tuto-card{background:var(--bg-secondary);border:1px solid var(--border-color);border-radius:var(--radius-md);padding:var(--spacing-md);transition:all .3s ease}
.tuto-card:hover{border-color:var(--neon-green);transform:translateY(-4px);box-shadow:0 8px 20px rgba(0,255,136,.2)}
.tuto-card h4{color:var(--neon-cyan);margin-bottom:var(--spacing-sm);font-size:1.1rem}
.tuto-card p{font-size:.9rem;color:var(--text-muted)}
.tuto-card .badge{display:inline-block;padding:4px 8px;border-radius:4px;font-size:.75rem;font-weight:600;margin-top:var(--spacing-sm)}
.badge-zone-grise{background:rgba(255,51,102,.2);color:#ff3366;border:1px solid #ff3366}
.badge-normal{background:rgba(0,255,136,.2);color:var(--neon-green);border:1px solid var(--neon-green)}
.disclaimer{background:rgba(255,51,102,.1);border:2px solid #ff3366;border-radius:var(--radius-lg);padding:var(--spacing-lg);margin-bottom:var(--spacing-xl)}
.disclaimer h3{color:#ff3366;margin-bottom:var(--spacing-md)}
    </style>
</head>
<body>

<header>
    <div class="header-content">
        <div class="logo"><a href="../index.html"><h1>SGPI</h1></a></div>
        <nav><ul>
            <li><a href="../index.html">Accueil</a></li>
            <li><a href="../wiki/index.html">Wiki</a></li>
            <li><a href="tutos.html" class="active">Tutos</a></li>
            <li><a href="projets.html">Projets</a></li>
            <li><a href="about.html">À propos</a></li>
            <li><a href="../acces.html" class="btn btn-primary">Join Discord</a></li>
            <li><button id="theme-toggle" class="theme-toggle">☀️</button></li>
        </ul></nav>
    </div>
</header>

<section class="hero">
    <h1>📖 Tutoriels SGPI</h1>
    <p class="tagline">Guides ultra-détaillés pour tout maîtriser</p>
</section>

<main class="container">

<div class="disclaimer">
    <h3>⚠️ DISCLAIMER IMPORTANT</h3>
    <p><strong>Certains tutos sont en "zone grise"</strong> - ils peuvent violer des CGU ou lois locales.</p>
    <ul style="line-height:1.8;margin-top:12px">
        <li>📚 <strong>À but éducatif uniquement</strong></li>
        <li>⚖️ <strong>Vous êtes seul responsable</strong> de vos actions</li>
        <li>🚫 <strong>La SGPI décline toute responsabilité</strong></li>
        <li>✅ <strong>Respectez les lois</strong> de votre pays</li>
    </ul>
    <p style="margin-top:12px;font-weight:600">Utilisez à vos risques et périls !</p>
</div>

<div class="card mb-lg">
    <p style="font-size:1.1rem">
        Plus de <strong>60+ tutoriels</strong> couvrant <strong>9 catégories</strong>. 
        Format ultra-détaillé avec screenshots, troubleshooting et FAQ.
    </p>
    <p class="text-muted">
        💡 Les tutos marqués <span class="badge badge-zone-grise">Zone Grise</span> nécessitent prudence.
    </p>
</div>

"""

html_end = """
<div class="card mt-xl" style="background:rgba(0,212,255,.05);border-color:var(--info)">
    <h3 style="color:var(--info)">ℹ️ Demander un tuto</h3>
    <p>Tu as besoin d'un tuto spécifique ? Demande-le sur Discord dans <strong>#tutos-demandes</strong> !</p>
</div>

</main>

<footer>
    <p>&copy; 2026 SGPI - Communauté Tech Underground</p>
    <p class="text-muted">📚 150+ ressources • 60+ tutos • 🟢 Discord actif</p>
</footer>

<script src="../js/sgpi.js"></script>
</body>
</html>
"""

categories_html = ""
for category, tuto_list in tutos.items():
    is_zone_grise = "Zone Grise" in category
    
    categories_html += f'<div class="tuto-category">\n<h2>{category}</h2>\n<div class="tuto-grid">\n'
    
    for title, desc in tuto_list:
        badge = "zone-grise" if is_zone_grise else "normal"
        badge_text = "Zone Grise" if is_zone_grise else "Normal"
        
        categories_html += f"""<div class="tuto-card">
<h4>{title}</h4>
<p>{desc}</p>
<span class="badge badge-{badge}">{badge_text}</span>
</div>
"""
    
    categories_html += '</div>\n</div>\n\n'

full_html = html_start + categories_html + html_end

with open('/home/claude/sgpi-final/pages/tutos.html', 'w', encoding='utf-8') as f:
    f.write(full_html)

print("✅ Page Tutos générée : pages/tutos.html")
