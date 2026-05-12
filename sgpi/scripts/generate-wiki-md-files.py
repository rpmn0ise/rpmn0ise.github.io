#!/usr/bin/env python3
"""
Générateur automatique des 14 fichiers .md wiki SGPI
À partir de la structure complète fournie
"""
from pathlib import Path

# Structure complète du wiki
WIKI_STRUCTURE = {
    "confidentialite": {
        "name": "🔒 Confidentialité & Sécurité",
        "sections": {
            "Adblocking": [
                "Filtres & Extensions : Adblock, uBlock, filtres personnalisés",
                "DNS Adblocking : NextDNS, Pi-hole, alternatives Linux/Mac/Windows",
                "Mobile : Android/iOS adblockers, apps et guides"
            ],
            "VPN & Proxy": [
                "VPN Servers : OpenVPN, WireGuard, serveurs privés",
                "VPN Clients : Windows, Linux, Mac, Android, iOS",
                "Proxy : HTTP/SOCKS, sites proxy, anti-censure"
            ],
            "Antivirus / Anti-Malware": [
                "Scanners de fichiers : Malwarebytes, ClamAV",
                "Vérification sites web : VirusTotal, URL scan"
            ],
            "Vie privée": [
                "Navigateur & extension privacy : Tor, Brave, Firefox privacy",
                "Emails & messageries chiffrées : ProtonMail, Signal, Tutanota",
                "Gestion mots de passe & 2FA : KeePass, Bitwarden"
            ],
            "Réseau & Sécurité": [
                "Firewall / Wi-Fi sécurisé",
                "Surveillance réseau, intrusion detection"
            ],
            "Surveillance & traçage": [
                "Tracking & fingerprinting : solutions anti-tracking",
                "Monitoring fuites de données"
            ]
        }
    },
    "ia": {
        "name": "🤖 Intelligence Artificielle",
        "sections": {
            "Chatbots & IA conversationnelle": [
                "Officiels : ChatGPT, Claude, Bard",
                "Multi-modèles : plateformes regroupant plusieurs IA",
                "Local Frontends : LLaMA, MPT, installation locale",
                "RP & Roleplay : bots spécialisés pour scénarios"
            ],
            "Génération de contenu": [
                "Texte & Code : assistants, prompts, corrections",
                "Image : Stable Diffusion, MidJourney, restauration d'images",
                "Vidéo : génération, animation IA",
                "Audio : TTS, voix clone, séparation de pistes"
            ],
            "Outils IA": [
                "Prompts & Index : banques de prompts, tutoriels",
                "Writing Tools : correcteurs, assistants d'écriture",
                "Coding Tools : complétion code, IDE extensions"
            ],
            "Index & Benchmarks": [
                "Benchmarks spécialisés : NLP, code, multimédia",
                "Comparateurs & classement IA"
            ],
            "Machine Learning": [
                "Frameworks : TensorFlow, PyTorch, datasets, notebooks",
                "Tutoriels & ressources formation"
            ],
            "Applications spécialisées": [
                "IA musicale, design, dev, gaming"
            ]
        }
    },
    "films": {
        "name": "🎬 Films & Séries",
        "sections": {
            "Streaming Sites": [
                "Multi-serveur & embeds",
                "Gratuit avec pubs"
            ],
            "Téléchargement / DDL": [
                "Films, séries, anime, éducatif"
            ],
            "Torrenting": [
                "Torrents publics & privés, trackers spécifiques"
            ],
            "Streaming spécialisé": [
                "Anime, cartoons, drama, classiques, archives"
            ],
            "Live TV & Sports": [
                "Live TV, Live Sports, replays, IPTV",
                "Apps Android/iOS"
            ],
            "Smart TV & mobiles": [
                "Android TV, Firestick, iOS streaming apps"
            ],
            "Tracking / Bases de données": [
                "Suivi séries, recommandations, calendrier"
            ],
            "Sous-titres & outils vidéo": [
                "Download de sous-titres, lecteurs, guides"
            ]
        }
    },
    "musique": {
        "name": "🎵 Musique",
        "sections": {
            "Streaming Audio": [
                "Apps & sites spécialisés",
                "Genre spécifique"
            ],
            "Podcasts & Radio": [
                "Streaming podcasts, radio internet, lofi"
            ],
            "Téléchargement / DDL": [
                "Audio direct, ripping, bots Telegram, sites spécialisés"
            ],
            "Torrenting Audio": [
                "Torrents albums, compils"
            ],
            "Royalty Free & Soundtracks": [
                "Musique libre, bandes son jeux/films"
            ],
            "Outils Audio": [
                "Lecteurs, serveurs, éditeurs, plugins, métadonnées, analyse spectrale"
            ]
        }
    },
    "jeux": {
        "name": "🎮 Jeux Vidéo",
        "sections": {
            "Téléchargement & DDL": [
                "Repacks, Linux/Mac/Windows, cracks"
            ],
            "Emulation / ROMs": [
                "Consoles, ROMs, émulateurs navigateur",
                "Homebrew & outils"
            ],
            "Jeux Retro / Abandonware": [
                "Ports, remakes, revival projects"
            ],
            "Browser / Indie Games": [
                "Multi-jeux, RPG, shooters, simulations"
            ],
            "Tabletop / Puzzle": [
                "Échecs, cartes, Rubik's cube, D&D, crosswords"
            ],
            "Outils Gaming": [
                "Launchers, mods, optimisations, trackers, Minecraft tools"
            ]
        }
    },
    "livres": {
        "name": "📚 Livres, BD & Mangas",
        "sections": {
            "Ebooks": [
                "PDF, Calibre, lecteurs"
            ],
            "Audiobooks": [
                "Streaming, DDL, apps et outils"
            ],
            "Manga & Comics": [
                "BD, mangas, light novels, fanfiction"
            ],
            "Documents & Éducation": [
                "Manuels, STEM, histoire, académique, culturels"
            ],
            "Bases & Tracking": [
                "Recommandations, catalogues"
            ],
            "Sites et Apps utiles": [
                "Lecture en ligne, archives"
            ]
        }
    },
    "ddl": {
        "name": "📥 Téléchargement Direct",
        "sections": {
            "Sites DDL": [
                "Films, séries, jeux, musique, ebooks"
            ],
            "Gestionnaires / Débrideurs": [
                "Outils premium free, extensions"
            ],
            "Usenet": [
                "Indexers, providers, downloaders"
            ],
            "Logiciels / FOSS": [
                "Freeware, Linux, Mac, Windows"
            ],
            "Outils de recherche": [
                "Annuaires, moteurs, extensions"
            ]
        }
    },
    "torrents": {
        "name": "🌊 Torrents",
        "sections": {
            "Sites Torrent": [
                "Films, séries, musique, anime, jeux, éducatif"
            ],
            "Clients Torrent": [
                "qBittorrent, streaming, remote, Android/iOS"
            ],
            "Trackers privés & publics": [
                "Contenu spécifique"
            ],
            "Index / Bases de données": [
                "Suivi releases, recommandations"
            ],
            "Outils & Apps": [
                "Automation, scripts, extensions"
            ]
        }
    },
    "education": {
        "name": "🎓 Éducation & Formation",
        "sections": {
            "Cours & MOOCs": [
                "Streaming, DDL, spécialisations"
            ],
            "Science / Math / Tech": [
                "Physique, chimie, biologie, ingénierie, programmation"
            ],
            "Langues": [
                "Apprentissage, échanges, européens, asiatiques, sign languages"
            ],
            "Développement / IT": [
                "Tutoriels, web dev, dev logiciels, data science, cybersecurity"
            ],
            "Jeux éducatifs / learning": [
                "Chess, Rubik's cube, D&D"
            ],
            "Outils éducatifs": [
                "Dictionnaires, encyclopédies, calculatrices, wiki tools"
            ]
        }
    },
    "mobile": {
        "name": "📱 Mobile",
        "sections": {
            "Android": [
                "APKs moddés/FOSS, optimisation, personnalisation, root, camera, audio, streaming, lecture"
            ],
            "iOS": [
                "Apps, jailbreak, sideload, adblocking, streaming, audio, lecture"
            ],
            "Émulation mobile": [
                "Android sur Windows/Linux, emulateurs Android"
            ],
            "Apps & Utilitaires": [
                "Messageries, productivité, notifications, météo, localisation"
            ],
            "Mobile Torrenting": [
                "Apps Android/iOS pour torrents"
            ],
            "Mobile Gaming": [
                "Launchers, mods, optimisation"
            ]
        }
    },
    "os": {
        "name": "💻 Systèmes d'exploitation",
        "sections": {
            "Windows": [
                "ISOs, activation, réparation, updates"
            ],
            "Linux": [
                "Distributions, guides, apps, CLI, personnalisation"
            ],
            "macOS": [
                "Apps, outils, adblocking/privacy, system tweaks"
            ],
            "Raspberry Pi & Unix-like": [
                "Serveurs, projets DIY, ricing"
            ],
            "Hackintosh / Multi-OS": [
                "Installation, dual boot, compatibilité"
            ]
        }
    },
    "logiciels": {
        "name": "🛠️ Logiciels & Outils",
        "sections": {
            "Bureautique & Textes": [
                "Suites office, éditeurs, mindmapping, collaboration"
            ],
            "Audio / Vidéo / Image": [
                "Édition, création, conversion, visualisation, serveurs"
            ],
            "Développement": [
                "IDEs, toolkits, dev web, game dev, programming languages"
            ],
            "Internet / Réseaux": [
                "Navigateurs, sécurité, OSINT, messageries, email, RSS"
            ],
            "Gaming Tools": [
                "Mods, launchers, optimisations, Steam/Epic, homebrew"
            ],
            "Système & Hardware": [
                "Monitors, GPU, CLI, virtualisation, hardware monitoring"
            ]
        }
    },
    "web": {
        "name": "🌐 Web & Création",
        "sections": {
            "Web Tools": [
                "SEO, scraping, archiving, search tools, paywall bypass"
            ],
            "Social Media": [
                "Telegram, Discord, Reddit, YouTube, Twitch, Instagram, Twitter/X, Mastodon, Peertube"
            ],
            "Text & Fonts": [
                "Éditeurs, markdown, LaTeX, Unicode, générateurs"
            ],
            "Images / Vidéos": [
                "Création, retouche, 3D, animation, ressources design"
            ],
            "Audio / Music": [
                "Création, plugins, synthèse, édition"
            ],
            "Web Dev & Hosting": [
                "Front-end, back-end, CMS, hébergement, API, benchmark"
            ]
        }
    },
    "divers": {
        "name": "🔧 Divers",
        "sections": {
            "Non Français": [
                "Ressources étrangères"
            ],
            "Lifestyle": [
                "Recettes, boissons, voyage, navigation, météo"
            ],
            "Santé & Bien-être": [
                "Santé mentale, physique, nutrition, exercices, detox"
            ],
            "Finance & Carrière": [
                "Jobs, portfolios, crypto, startups, collaborations"
            ],
            "Shopping / Free Stuff": [
                "Jeux gratuits, électronique, apps, suivi prix"
            ],
            "Fun / Sites utiles": [
                "Forums, images/videos, webcams, sites interactifs"
            ]
        }
    }
}

def generate_md_file(file_id, data):
    """Génère un fichier .md pour une catégorie"""
    
    md_content = f"# {data['name']}\n\n"
    
    for section, items in data['sections'].items():
        md_content += f"## {section}\n\n"
        for item in items:
            # Extrait le titre (avant :)
            title = item.split(':')[0].strip()
            md_content += f"### {title}\n\n"
            # Ajoute 3 liens exemple
            md_content += f"- [Ressource 1](#) - Description à compléter\n"
            md_content += f"- [Ressource 2](#) - Description à compléter\n"
            md_content += f"- [Ressource 3](#) - Description à compléter\n"
            md_content += "\n"
        md_content += "\n"
    
    return md_content

def main():
    """Génère tous les fichiers .md dans wiki/sources/"""
    
    output_dir = Path('wiki/sources')
    output_dir.mkdir(parents=True, exist_ok=True)
    
    print("🚀 Génération des fichiers .md wiki SGPI...\n")
    
    for file_id, data in WIKI_STRUCTURE.items():
        filename = f"{file_id}.md"
        filepath = output_dir / filename
        
        content = generate_md_file(file_id, data)
        filepath.write_text(content, encoding='utf-8')
        
        print(f"✅ {filename:20} → {data['name']}")
    
    print(f"\n🎉 {len(WIKI_STRUCTURE)} fichiers générés dans {output_dir}/")
    print("\n📝 Prochaines étapes :")
    print("1. Édite les fichiers .md pour ajouter les vrais liens")
    print("2. Lance : python3 scripts/update-wiki.py wiki/sources/FICHIER.md")
    print("3. Les pages HTML seront générées dans wiki/categories/")

if __name__ == "__main__":
    main()
