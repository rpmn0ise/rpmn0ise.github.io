#!/usr/bin/env python3
"""
MD → HTML Converter pour Wiki SGPI
Usage: python3 md-to-html.py fichier.md
"""
import sys, re
from pathlib import Path

if len(sys.argv) < 2:
    print("Usage: python3 md-to-html.py fichier.md")
    sys.exit(1)

md_file = Path(sys.argv[1])
if not md_file.exists():
    print(f"❌ Fichier introuvable: {md_file}")
    sys.exit(1)

content = md_file.read_text(encoding='utf-8')

# Conversion markdown basique
html = content
html = re.sub(r'^# (.+)$', r'<h2>\1</h2>', html, flags=re.M)
html = re.sub(r'^## (.+)$', r'<h3>\1</h3>', html, flags=re.M)
html = re.sub(r'\*\*(.+?)\*\*', r'<strong>\1</strong>', html)
html = re.sub(r'\*(.+?)\*', r'<em>\1</em>', html)
html = re.sub(r'\[(.+?)\]\((.+?)\)', r'<a href="\2">\1</a>', html)
html = re.sub(r'^- (.+)$', r'<li>\1</li>', html, flags=re.M)

# Wrap lists
lines = html.split('\n')
in_list = False
result = []
for line in lines:
    if '<li>' in line:
        if not in_list:
            result.append('<ul>')
            in_list = True
        result.append(line)
    else:
        if in_list:
            result.append('</ul>')
            in_list = False
        result.append(line)
if in_list:
    result.append('</ul>')

html = '\n'.join(result)
html = html.replace('\n\n', '</p><p>')
html = '<p>' + html + '</p>'

# Template
template = f"""<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8">
<title>SGPI Wiki</title>
<link rel="stylesheet" href="../../css/sgpi-style.css">
</head>
<body>
<header>
<div class="header-content">
<div class="logo"><a href="../../index.html"><h1>SGPI</h1></a></div>
<nav><ul>
<li><a href="../../index.html">Accueil</a></li>
<li><a href="../index.html">Wiki</a></li>
<li><a href="../../pages/tutos.html">Tutos</a></li>
<li><a href="../../acces.html" class="btn btn-primary">Discord</a></li>
<li><button id="theme-toggle" class="theme-toggle">☀️</button></li>
</ul></nav>
</div>
</header>
<main class="container">
{html}
</main>
<footer>
<p>&copy; 2026 SGPI</p>
</footer>
<script src="../../js/sgpi.js"></script>
</body>
</html>
"""

html_file = md_file.with_suffix('.html')
html_file.write_text(template, encoding='utf-8')
print(f"✅ Converti: {html_file}")
