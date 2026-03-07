#!/usr/bin/env python3
"""
Auto Page Generator - Gaming UI
Génère toutes les pages manquantes avec design complet
"""

import os
from pathlib import Path

print("🎮 AUTO PAGE GENERATOR - Gaming UI")
print("=" * 60)

# Get site directory
site_dir = input("📁 Chemin vers ton site (ex: ./rpmn0ise.github.io): ").strip()
if not site_dir:
    site_dir = "."

site_path = Path(site_dir).resolve()
print(f"✅ Génération dans: {site_path}\n")

# CSS inline complet
CSS = """
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;700&family=Orbitron:wght@400;700;900&display=swap');
* { margin: 0; padding: 0; box-sizing: border-box; }
body { font-family: 'Inter', sans-serif; background: #2e3440; color: #eceff4; line-height: 1.6; }
.container { max-width: 1200px; margin: 0 auto; padding: 80px 20px; }
nav { background: rgba(59, 66, 82, 0.95); padding: 15px 30px; border-bottom: 1px solid rgba(136, 192, 208, 0.3); position: sticky; top: 0; z-index: 100; backdrop-filter: blur(10px); }
nav ul { list-style: none; display: flex; gap: 25px; flex-wrap: wrap; align-items: center; }
nav a { color: #eceff4; text-decoration: none; transition: all 0.3s; padding: 5px 0; position: relative; }
nav a:hover { color: #88c0d0; }
nav a.logo { font-family: 'Orbitron', sans-serif; font-weight: 700; letter-spacing: 2px; font-size: 1.2rem; }
.page-title { font-family: 'Orbitron', sans-serif; font-size: clamp(2.5rem, 5vw, 4rem); text-transform: uppercase; margin-bottom: 20px; background: linear-gradient(135deg, #88c0d0, #5e81ac); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
.page-subtitle { font-size: 1.2rem; color: #d8dee9; margin-bottom: 50px; }
.section { margin: 60px 0; }
.section-title { font-family: 'Orbitron', sans-serif; font-size: 2rem; text-transform: uppercase; margin-bottom: 30px; display: flex; align-items: center; gap: 15px; }
.card { background: rgba(59, 66, 82, 0.7); padding: 30px; border-radius: 15px; border: 1px solid rgba(136, 192, 208, 0.3); margin-bottom: 20px; transition: all 0.3s; }
.card:hover { border-color: #88c0d0; box-shadow: 0 8px 25px rgba(0,0,0,0.4); transform: translateY(-5px); }
.grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 25px; }
footer { background: #3b4252; padding: 40px 20px; text-align: center; margin-top: 100px; border-top: 1px solid rgba(136, 192, 208, 0.3); }
footer p { color: #d8dee9; font-size: 0.95rem; }
@media (max-width: 768px) { nav ul { flex-direction: column; gap: 15px; } }
"""

# Navigation commune
NAV = """
<nav>
    <ul>
        <li><a href="/" class="logo">RPMN0ISE</a></li>
        <li><a href="/">Hub</a></li>
        <li><a href="/about">About</a></li>
        <li><a href="/gaming">Gaming</a></li>
        <li><a href="/setup">Setup</a></li>
        <li><a href="/media">Media</a></li>
        <li><a href="/projects">Projects</a></li>
        <li><a href="/blog">Blog</a></li>
        <li><a href="/contact">Contact</a></li>
    </ul>
</nav>
"""

FOOTER = """
<footer>
    <p>© 2026 RPMN0ISE • Built with passion for gaming, tech & audio</p>
    <p style="margin-top: 10px; font-size: 0.85rem; opacity: 0.7;">Powered by Nord Theme × Gaming UI</p>
</footer>
"""

# Templates de pages
PAGES = {
    "about/index.html": {
        "title": "About Me",
        "content": """
        <h1 class="page-title">👤 ABOUT ME</h1>
        <p class="page-subtitle">Who I am, my journey, and what drives my passions</p>
        
        <div class="section">
            <div class="card">
                <h2 class="section-title">🎯 WHO I AM</h2>
                <p style="font-size: 1.1rem; line-height: 1.8;">
                    Hey! I'm RPMN0ISE, a gaming and tech enthusiast passionate about exploring 
                    the intersection of technology, audio, and digital experiences.
                </p>
                <p style="margin-top: 20px; color: #d8dee9;">
                    📍 Location: [Your Location]<br>
                    🎂 Age: [Your Age]<br>
                    💼 Currently: [Studies/Job]<br>
                    🎮 Favorite Game: BeamNG.drive
                </p>
            </div>
        </div>
        
        <div class="section">
            <h2 class="section-title">💡 PASSIONS</h2>
            <div class="grid">
                <div class="card">
                    <div style="font-size: 3rem; margin-bottom: 15px;">🎮</div>
                    <h3 style="font-family: 'Orbitron', sans-serif; margin-bottom: 10px;">GAMING</h3>
                    <p style="color: #d8dee9;">Simulation, strategy, and immersive experiences</p>
                </div>
                <div class="card">
                    <div style="font-size: 3rem; margin-bottom: 15px;">💻</div>
                    <h3 style="font-family: 'Orbitron', sans-serif; margin-bottom: 10px;">TECH</h3>
                    <p style="color: #d8dee9;">Linux, coding, system optimization</p>
                </div>
                <div class="card">
                    <div style="font-size: 3rem; margin-bottom: 15px;">🎵</div>
                    <h3 style="font-family: 'Orbitron', sans-serif; margin-bottom: 10px;">AUDIO</h3>
                    <p style="color: #d8dee9;">High-fidelity sound and audio engineering</p>
                </div>
            </div>
        </div>
        
        <div class="section">
            <div class="card">
                <h2 class="section-title">🚀 MY JOURNEY</h2>
                <div style="border-left: 3px solid #88c0d0; padding-left: 30px; margin-top: 30px;">
                    <div style="margin-bottom: 30px;">
                        <div style="color: #88c0d0; font-weight: 600;">2025</div>
                        <p>Started this website, deep dive into web development</p>
                    </div>
                    <div style="margin-bottom: 30px;">
                        <div style="color: #88c0d0; font-weight: 600;">2024</div>
                        <p>Explored audio engineering and setup optimization</p>
                    </div>
                    <div style="margin-bottom: 30px;">
                        <div style="color: #88c0d0; font-weight: 600;">2023</div>
                        <p>Discovered Linux and open-source world</p>
                    </div>
                    <div>
                        <div style="color: #88c0d0; font-weight: 600;">Earlier</div>
                        <p>Started gaming seriously, built first PC</p>
                    </div>
                </div>
            </div>
        </div>
        """
    },
    
    "gaming/index.html": {
        "title": "Gaming Hub",
        "content": """
        <h1 class="page-title">🎮 GAMING HUB</h1>
        <p class="page-subtitle">Games, stats, reviews, and gameplay highlights</p>
        
        <div class="section">
            <h2 class="section-title">📊 STATS</h2>
            <div class="grid">
                <div class="card" style="text-align: center;">
                    <div style="font-size: 3rem; color: #88c0d0; font-family: 'Orbitron', sans-serif; font-weight: 700;">500+</div>
                    <div style="color: #d8dee9;">Total Hours</div>
                </div>
                <div class="card" style="text-align: center;">
                    <div style="font-size: 3rem; color: #88c0d0; font-family: 'Orbitron', sans-serif; font-weight: 700;">50+</div>
                    <div style="color: #d8dee9;">Games Played</div>
                </div>
                <div class="card" style="text-align: center;">
                    <div style="font-size: 3rem; color: #88c0d0; font-family: 'Orbitron', sans-serif; font-weight: 700;">20+</div>
                    <div style="color: #d8dee9;">Completed</div>
                </div>
            </div>
        </div>
        
        <div class="section">
            <h2 class="section-title">⭐ FEATURED GAMES</h2>
            <div class="grid">
                <div class="card">
                    <h3 style="font-family: 'Orbitron', sans-serif; margin-bottom: 10px;">BeamNG.drive</h3>
                    <p style="color: #88c0d0; margin-bottom: 10px;">⭐⭐⭐⭐⭐</p>
                    <p style="color: #d8dee9;">234 hours • Simulation</p>
                    <p style="margin-top: 15px;">Realistic vehicle physics and crash simulation</p>
                </div>
                <div class="card">
                    <h3 style="font-family: 'Orbitron', sans-serif; margin-bottom: 10px;">[Your Game]</h3>
                    <p style="color: #88c0d0; margin-bottom: 10px;">⭐⭐⭐⭐</p>
                    <p style="color: #d8dee9;">120 hours • [Genre]</p>
                    <p style="margin-top: 15px;">Add your favorite games here</p>
                </div>
            </div>
        </div>
        
        <div class="section">
            <div class="card">
                <h2 class="section-title">🎯 CURRENTLY PLAYING</h2>
                <p style="font-size: 1.2rem; margin-bottom: 10px;"><strong>BeamNG.drive</strong></p>
                <p style="color: #d8dee9;">Last played: 2 hours ago</p>
            </div>
        </div>
        """
    },
    
    "setup/index.html": {
        "title": "My Setup",
        "content": """
        <h1 class="page-title">💻 MY SETUP</h1>
        <p class="page-subtitle">Hardware, software, and workspace showcase</p>
        
        <div class="section">
            <h2 class="section-title">🖥️ HARDWARE</h2>
            <div class="card">
                <h3 style="font-family: 'Orbitron', sans-serif; margin-bottom: 20px;">PC SPECS</h3>
                <div style="display: grid; gap: 15px;">
                    <div><strong style="color: #88c0d0;">CPU:</strong> [Your CPU]</div>
                    <div><strong style="color: #88c0d0;">GPU:</strong> [Your GPU]</div>
                    <div><strong style="color: #88c0d0;">RAM:</strong> [Your RAM]</div>
                    <div><strong style="color: #88c0d0;">Storage:</strong> [Your Storage]</div>
                    <div><strong style="color: #88c0d0;">Motherboard:</strong> [Your MB]</div>
                </div>
            </div>
            
            <div class="card" style="margin-top: 20px;">
                <h3 style="font-family: 'Orbitron', sans-serif; margin-bottom: 20px;">PERIPHERALS</h3>
                <div style="display: grid; gap: 15px;">
                    <div><strong style="color: #88c0d0;">Keyboard:</strong> [Your Keyboard]</div>
                    <div><strong style="color: #88c0d0;">Mouse:</strong> [Your Mouse]</div>
                    <div><strong style="color: #88c0d0;">Headset:</strong> [Your Headset]</div>
                    <div><strong style="color: #88c0d0;">Monitor:</strong> [Your Monitor]</div>
                </div>
            </div>
        </div>
        
        <div class="section">
            <h2 class="section-title">⚙️ SOFTWARE</h2>
            <div class="card">
                <h3 style="font-family: 'Orbitron', sans-serif; margin-bottom: 20px;">SYSTEM</h3>
                <div style="display: grid; gap: 15px;">
                    <div><strong style="color: #88c0d0;">OS:</strong> Arch Linux (or your OS)</div>
                    <div><strong style="color: #88c0d0;">DE/WM:</strong> [Your Desktop Environment]</div>
                    <div><strong style="color: #88c0d0;">Terminal:</strong> [Your Terminal]</div>
                    <div><strong style="color: #88c0d0;">Editor:</strong> [Your Editor]</div>
                </div>
            </div>
        </div>
        """
    },
    
    "media/index.html": {
        "title": "Media",
        "content": """
        <h1 class="page-title">🎬 MEDIA</h1>
        <p class="page-subtitle">Movies, TV shows, music, and playlists I love</p>
        
        <div class="section">
            <h2 class="section-title">🎬 MOVIES & TV SHOWS</h2>
            <div class="grid">
                <div class="card">
                    <h3 style="font-family: 'Orbitron', sans-serif; margin-bottom: 10px;">[Movie Title]</h3>
                    <p style="color: #88c0d0; margin-bottom: 10px;">⭐⭐⭐⭐⭐</p>
                    <p style="color: #d8dee9;">Year: [Year] • Genre: [Genre]</p>
                    <p style="margin-top: 15px;">Your review or thoughts here</p>
                </div>
                <div class="card">
                    <h3 style="font-family: 'Orbitron', sans-serif; margin-bottom: 10px;">[TV Show]</h3>
                    <p style="color: #88c0d0; margin-bottom: 10px;">⭐⭐⭐⭐</p>
                    <p style="color: #d8dee9;">Status: Watching</p>
                    <p style="margin-top: 15px;">Add your favorite shows</p>
                </div>
            </div>
        </div>
        
        <div class="section">
            <h2 class="section-title">🎵 MUSIC</h2>
            <div class="card">
                <h3 style="font-family: 'Orbitron', sans-serif; margin-bottom: 20px;">FAVORITE ARTISTS</h3>
                <div style="display: grid; gap: 10px;">
                    <div>• [Artist 1]</div>
                    <div>• [Artist 2]</div>
                    <div>• [Artist 3]</div>
                </div>
            </div>
            
            <div class="card" style="margin-top: 20px;">
                <h3 style="font-family: 'Orbitron', sans-serif; margin-bottom: 20px;">SPOTIFY PLAYLISTS</h3>
                <p style="color: #d8dee9;">Add your Spotify playlist embeds here</p>
            </div>
        </div>
        """
    },
    
    "projects/index.html": {
        "title": "Projects",
        "content": """
        <h1 class="page-title">🚀 PROJECTS</h1>
        <p class="page-subtitle">What I build, code, and create</p>
        
        <div class="section">
            <div class="grid">
                <div class="card">
                    <h3 style="font-family: 'Orbitron', sans-serif; margin-bottom: 10px;">Personal Website</h3>
                    <p style="color: #88c0d0; margin-bottom: 15px;">Status: In Progress</p>
                    <p>This website! Built with HTML, CSS, and JavaScript. Features Nord Theme and Gaming UI.</p>
                    <div style="margin-top: 20px;">
                        <a href="https://github.com/rpmn0ise" style="color: #88c0d0; text-decoration: none;">View on GitHub →</a>
                    </div>
                </div>
                
                <div class="card">
                    <h3 style="font-family: 'Orbitron', sans-serif; margin-bottom: 10px;">[Your Project]</h3>
                    <p style="color: #88c0d0; margin-bottom: 15px;">Tech: [Technologies]</p>
                    <p>Add your projects here with descriptions</p>
                </div>
            </div>
        </div>
        
        <div class="section">
            <div class="card">
                <h2 class="section-title">💻 SKILLS</h2>
                <div style="display: flex; gap: 10px; flex-wrap: wrap; margin-top: 20px;">
                    <span style="background: rgba(136, 192, 208, 0.2); padding: 8px 16px; border-radius: 20px; color: #88c0d0;">Linux</span>
                    <span style="background: rgba(136, 192, 208, 0.2); padding: 8px 16px; border-radius: 20px; color: #88c0d0;">Python</span>
                    <span style="background: rgba(136, 192, 208, 0.2); padding: 8px 16px; border-radius: 20px; color: #88c0d0;">HTML/CSS</span>
                    <span style="background: rgba(136, 192, 208, 0.2); padding: 8px 16px; border-radius: 20px; color: #88c0d0;">JavaScript</span>
                </div>
            </div>
        </div>
        """
    },
    
    "blog/index.html": {
        "title": "Blog",
        "content": """
        <h1 class="page-title">📝 BLOG</h1>
        <p class="page-subtitle">Updates, reviews, thoughts, and tutorials</p>
        
        <div class="section">
            <div class="card">
                <div style="color: #88c0d0; font-size: 0.9rem; margin-bottom: 10px;">2026-03-06</div>
                <h3 style="font-family: 'Orbitron', sans-serif; font-size: 1.8rem; margin-bottom: 15px;">Welcome to My Blog</h3>
                <p style="color: #d8dee9; margin-bottom: 20px;">First post on my new website! More content coming soon...</p>
                <a href="#" style="color: #88c0d0; text-decoration: none;">Read more →</a>
            </div>
            
            <div class="card">
                <div style="color: #88c0d0; font-size: 0.9rem; margin-bottom: 10px;">2026-03-05</div>
                <h3 style="font-family: 'Orbitron', sans-serif; font-size: 1.8rem; margin-bottom: 15px;">BeamNG Physics Review</h3>
                <p style="color: #d8dee9; margin-bottom: 20px;">Deep dive into the realistic physics simulation...</p>
                <a href="#" style="color: #88c0d0; text-decoration: none;">Read more →</a>
            </div>
        </div>
        """
    },
    
    "contact/index.html": {
        "title": "Contact",
        "content": """
        <h1 class="page-title">📞 CONTACT</h1>
        <p class="page-subtitle">Get in touch and connect with me</p>
        
        <div class="section">
            <div class="grid">
                <a href="https://github.com/rpmn0ise" target="_blank" class="card" style="text-decoration: none; color: #eceff4;">
                    <div style="font-size: 3rem; margin-bottom: 15px;">🐙</div>
                    <h3 style="font-family: 'Orbitron', sans-serif; margin-bottom: 10px;">GITHUB</h3>
                    <p style="color: #d8dee9;">@rpmn0ise</p>
                </a>
                
                <a href="https://steamcommunity.com/id/TherockyRPM/" target="_blank" class="card" style="text-decoration: none; color: #eceff4;">
                    <div style="font-size: 3rem; margin-bottom: 15px;">🎮</div>
                    <h3 style="font-family: 'Orbitron', sans-serif; margin-bottom: 10px;">STEAM</h3>
                    <p style="color: #d8dee9;">TherockyRPM</p>
                </a>
                
                <a href="https://instagram.com/rpmn0ise" target="_blank" class="card" style="text-decoration: none; color: #eceff4;">
                    <div style="font-size: 3rem; margin-bottom: 15px;">📸</div>
                    <h3 style="font-family: 'Orbitron', sans-serif; margin-bottom: 10px;">INSTAGRAM</h3>
                    <p style="color: #d8dee9;">@rpmn0ise</p>
                </a>
                
                <a href="https://reddit.com/user/rpmn0ise" target="_blank" class="card" style="text-decoration: none; color: #eceff4;">
                    <div style="font-size: 3rem; margin-bottom: 15px;">🤖</div>
                    <h3 style="font-family: 'Orbitron', sans-serif; margin-bottom: 10px;">REDDIT</h3>
                    <p style="color: #d8dee9;">u/rpmn0ise</p>
                </a>
                
                <div class="card">
                    <div style="font-size: 3rem; margin-bottom: 15px;">💬</div>
                    <h3 style="font-family: 'Orbitron', sans-serif; margin-bottom: 10px;">DISCORD</h3>
                    <p style="color: #d8dee9;">rpmn0ise</p>
                </div>
            </div>
        </div>
        """
    },
    
    "stats/index.html": {
        "title": "Stats",
        "content": """
        <h1 class="page-title">📊 STATS</h1>
        <p class="page-subtitle">Gaming, coding, and personal achievements</p>
        
        <div class="section">
            <h2 class="section-title">🎮 GAMING STATS</h2>
            <div class="grid">
                <div class="card" style="text-align: center;">
                    <div style="font-size: 3rem; color: #88c0d0; font-family: 'Orbitron', sans-serif; font-weight: 700;">500+</div>
                    <div style="color: #d8dee9;">Total Hours</div>
                </div>
                <div class="card" style="text-align: center;">
                    <div style="font-size: 3rem; color: #88c0d0; font-family: 'Orbitron', sans-serif; font-weight: 700;">50+</div>
                    <div style="color: #d8dee9;">Games Played</div>
                </div>
                <div class="card" style="text-align: center;">
                    <div style="font-size: 3rem; color: #88c0d0; font-family: 'Orbitron', sans-serif; font-weight: 700;">456</div>
                    <div style="color: #d8dee9;">Achievements</div>
                </div>
            </div>
        </div>
        
        <div class="section">
            <h2 class="section-title">💻 CODING STATS</h2>
            <div class="card">
                <p style="font-size: 1.1rem; margin-bottom: 10px;"><strong>GitHub Activity</strong></p>
                <p style="color: #d8dee9;">Connect your GitHub for live stats</p>
            </div>
        </div>
        """
    }
}

# Générer toutes les pages
count = 0
for page_path, data in PAGES.items():
    full_path = site_path / page_path
    full_path.parent.mkdir(parents=True, exist_ok=True)
    
    html = f"""<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{data['title']} - RPMN0ISE</title>
    <style>{CSS}</style>
</head>
<body>
{NAV}
<div class="container">
{data['content']}
</div>
{FOOTER}
</body>
</html>"""
    
    with open(full_path, 'w', encoding='utf-8') as f:
        f.write(html)
    
    print(f"✅ {page_path}")
    count += 1

print("\n" + "=" * 60)
print(f"✅ {count} pages générées avec succès !")
print("\n🎯 PAGES CRÉÉES:")
print("  • about/index.html")
print("  • gaming/index.html")
print("  • setup/index.html")
print("  • media/index.html")
print("  • projects/index.html")
print("  • blog/index.html")
print("  • contact/index.html")
print("  • stats/index.html")
print("\n🚀 PROCHAINES ÉTAPES:")
print("1. Teste: python3 -m http.server 8000")
print("2. Visite chaque page")
print("3. Remplis ton contenu personnel")
print("4. Deploy !")
print("\n✨ Génération terminée !")
