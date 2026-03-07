#!/usr/bin/env python3
"""
Blog Generator - Markdown to HTML
Convertit posts markdown en HTML avec template
"""
import os
import sys
import re
from pathlib import Path
from datetime import datetime

print("📝 BLOG GENERATOR - Markdown to HTML")

if len(sys.argv) < 2:
    print("Usage: python3 blog-generator.py post.md")
    sys.exit(1)

md_file = Path(sys.argv[1])
if not md_file.exists():
    print(f"❌ Error: {md_file} not found")
    sys.exit(1)

# Lire markdown
content = md_file.read_text(encoding='utf-8')

# Parser frontmatter YAML
frontmatter = {}
if content.startswith('---'):
    parts = content.split('---', 2)
    fm_lines = parts[1].strip().split('\n')
    for line in fm_lines:
        if ':' in line:
            key, val = line.split(':', 1)
            frontmatter[key.strip()] = val.strip()
    content = parts[2].strip()

# Convertir markdown basique en HTML
html = content

# Headers
html = re.sub(r'^# (.+)$', r'<h1>\1</h1>', html, flags=re.MULTILINE)
html = re.sub(r'^## (.+)$', r'<h2>\1</h2>', html, flags=re.MULTILINE)
html = re.sub(r'^### (.+)$', r'<h3>\1</h3>', html, flags=re.MULTILINE)

# Bold, italic
html = re.sub(r'\*\*(.+?)\*\*', r'<strong>\1</strong>', html)
html = re.sub(r'\*(.+?)\*', r'<em>\1</em>', html)

# Links
html = re.sub(r'\[(.+?)\]\((.+?)\)', r'<a href="\2">\1</a>', html)

# Lists
html = re.sub(r'^- (.+)$', r'<li>\1</li>', html, flags=re.MULTILINE)
lines = html.split('\n')
in_list = False
new_lines = []
for line in lines:
    if '<li>' in line:
        if not in_list:
            new_lines.append('<ul>')
            in_list = True
        new_lines.append(line)
    else:
        if in_list:
            new_lines.append('</ul>')
            in_list = False
        new_lines.append(line)
if in_list:
    new_lines.append('</ul>')
html = '\n'.join(new_lines)

# Paragraphes
html = html.replace('\n\n', '</p><p>')
if not html.startswith('<'):
    html = '<p>' + html + '</p>'

# Charger template
template_path = Path(__file__).parent.parent / 'blog-templates' / 'post-template.html'
if template_path.exists():
    template = template_path.read_text(encoding='utf-8')
    print(f"✅ Template loaded: {template_path}")
else:
    # Template minimal si pas trouvé
    template = """<!DOCTYPE html>
<html><head>
<title>{{TITLE}}</title>
<style>body{max-width:800px;margin:50px auto;font-family:sans-serif;line-height:1.6;}</style>
</head><body>
<h1>{{TITLE}}</h1>
<div style="color:#666;margin-bottom:30px;">{{DATE}}</div>
{{CONTENT}}
</body></html>"""
    print("⚠️ Template not found, using minimal template")

# Remplir template
output = template
output = output.replace('{{TITLE}}', frontmatter.get('title', 'Blog Post'))
output = output.replace('{{DATE}}', frontmatter.get('date', datetime.now().strftime('%Y-%m-%d')))
output = output.replace('{{CONTENT}}', html)
output = output.replace('{{CATEGORIES}}', frontmatter.get('categories', ''))
output = output.replace('{{TAGS}}', frontmatter.get('tags', ''))
output = output.replace('{{COVER}}', frontmatter.get('cover', ''))

# Sauvegarder HTML
html_file = md_file.with_suffix('.html')
html_file.write_text(output, encoding='utf-8')

print(f"✅ Generated: {html_file}")
print("\n📄 Next steps:")
print(f"1. Review: {html_file}")
print("2. Deploy your blog!")
