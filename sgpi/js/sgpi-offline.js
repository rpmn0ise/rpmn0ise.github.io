/**
 * SGPI Offline Package Generator
 * Permet de télécharger wiki + tutos en markdown
 */

class SGPIOfflinePackage {
    constructor() {
        this.files = [];
        this.ready = false;
    }
    
    async generate() {
        console.log('📦 Generating offline package...');
        
        const zip = await this.createZip();
        this.downloadZip(zip);
    }
    
    async createZip() {
        // Import JSZip dynamically
        if (!window.JSZip) {
            await this.loadJSZip();
        }
        
        const zip = new JSZip();
        
        // README
        zip.file('README.md', this.generateReadme());
        
        // Wiki sources
        const wikiFolder = zip.folder('wiki/sources');
        await this.addWikiSources(wikiFolder);
        
        // Tutos sources  
        const tutosFolder = zip.folder('tutos/sources');
        await this.addTutoSources(tutosFolder);
        
        // Scripts
        const scriptsFolder = zip.folder('scripts');
        scriptsFolder.file('generate-wiki.py', this.getGenerateWikiScript());
        scriptsFolder.file('generate-tutos.py', this.getGenerateTutosScript());
        
        // Index HTML
        zip.file('index.html', this.generateIndexHTML());
        
        return zip;
    }
    
    async loadJSZip() {
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = 'https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js';
            script.onload = resolve;
            script.onerror = reject;
            document.head.appendChild(script);
        });
    }
    
    async addWikiSources(folder) {
        const categories = [
            'confidentialite', 'ia', 'films', 'musique', 
            'jeux', 'livres', 'ddl', 'torrents',
            'education', 'mobile', 'os', 'logiciels',
            'web', 'divers'
        ];
        
        for (const cat of categories) {
            try {
                const response = await fetch(`/sgpi/wiki/sources/${cat}.md`);
                if (response.ok) {
                    const content = await response.text();
                    folder.file(`${cat}.md`, content);
                }
            } catch (e) {
                console.warn(`Could not fetch ${cat}.md:`, e);
                // Add placeholder
                folder.file(`${cat}.md`, `# ${cat}\n\nContenu à ajouter...`);
            }
        }
    }
    
    async addTutoSources(folder) {
        // Placeholder - à adapter selon tes tutos
        folder.file('example-tuto.md', this.getExampleTuto());
    }
    
    generateReadme() {
        return `# SGPI Offline Package

## 📦 Contenu

Ce package contient :
- \`wiki/sources/\` - 14 fichiers markdown du wiki
- \`tutos/sources/\` - Tutoriels en markdown
- \`scripts/\` - Scripts Python pour générer HTML
- \`index.html\` - Page d'accueil offline

## 🚀 Utilisation

### Option 1 : Lecture Markdown
Les fichiers \`.md\` sont dans \`wiki/sources/\` et \`tutos/sources/\`
Ouvre-les avec n'importe quel éditeur markdown.

### Option 2 : Génération HTML
\`\`\`bash
# Wiki
python scripts/generate-wiki.py wiki/sources/confidentialite.md

# Tutos
python scripts/generate-tutos.py tutos/sources/example-tuto.md
\`\`\`

### Option 3 : Serveur local
\`\`\`bash
python -m http.server 8000
# Visite http://localhost:8000
\`\`\`

## 📝 Format Markdown

Les fichiers suivent ce format :

\`\`\`markdown
# Titre Catégorie

## Section

### Sous-section
- [Ressource 1](url) - Description
- [Ressource 2](url) - Description
\`\`\`

## ⚠️ Disclaimer

Contenu à but éducatif uniquement.
L'utilisateur est seul responsable de ses actions.

---

**SGPI Underground** | Version ${new Date().toISOString().split('T')[0]}
`;
    }
    
    getGenerateWikiScript() {
        return `#!/usr/bin/env python3
"""
Script de génération HTML depuis Markdown
Usage: python generate-wiki.py fichier.md
"""
import sys, re
from pathlib import Path

def md_to_html(md):
    html = md
    html = re.sub(r'^### (.+)$', r'<h3>\\1</h3>', html, flags=re.M)
    html = re.sub(r'^## (.+)$', r'<h2>\\1</h2>', html, flags=re.M)
    html = re.sub(r'^# (.+)$', r'<h1>\\1</h1>', html, flags=re.M)
    html = re.sub(r'\\[(.+?)\\]\\((.+?)\\)', r'<a href="\\2">\\1</a>', html)
    
    lines = html.split('\\n')
    result = []
    in_ul = False
    
    for line in lines:
        if line.startswith('- '):
            if not in_ul:
                result.append('<ul>')
                in_ul = True
            result.append(f'<li>{line[2:]}</li>')
        else:
            if in_ul:
                result.append('</ul>')
                in_ul = False
            result.append(line)
    
    if in_ul:
        result.append('</ul>')
    
    return '\\n'.join(result)

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python generate-wiki.py fichier.md")
        sys.exit(1)
    
    md_file = Path(sys.argv[1])
    content = md_file.read_text(encoding='utf-8')
    html_content = md_to_html(content)
    
    output = f"""<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>SGPI Wiki Offline</title>
    <style>
        body {{ font-family: sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; }}
        h1 {{ color: #00ff88; }}
        h2 {{ color: #00d4ff; border-bottom: 1px solid #ddd; }}
        a {{ color: #00ff88; }}
    </style>
</head>
<body>
    {html_content}
</body>
</html>"""
    
    output_file = md_file.with_suffix('.html')
    output_file.write_text(output, encoding='utf-8')
    print(f"✅ Generated: {output_file}")
`;
    }
    
    getGenerateTutosScript() {
        return `#!/usr/bin/env python3
# Même principe que generate-wiki.py
# Adapter selon format de tes tutos
`;
    }
    
    getExampleTuto() {
        return `# Exemple Tutoriel

## Description
Tutoriel exemple en markdown

## Prérequis
- Item 1
- Item 2

## Étapes
### Étape 1
Description...

### Étape 2
Description...
`;
    }
    
    generateIndexHTML() {
        return `<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>SGPI Offline</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: 'Courier New', monospace;
            background: #000;
            color: #00ff88;
            padding: 2rem;
        }
        .container { max-width: 800px; margin: 0 auto; }
        h1 { font-size: 3rem; margin-bottom: 1rem; text-align: center; }
        .tagline { text-align: center; color: #00d4ff; margin-bottom: 3rem; }
        .section { 
            background: #111; 
            border: 1px solid #00ff88; 
            border-radius: 8px; 
            padding: 2rem;
            margin-bottom: 2rem;
        }
        h2 { color: #00d4ff; margin-bottom: 1rem; }
        ul { list-style: none; padding-left: 1rem; }
        li { margin: 0.5rem 0; }
        a { color: #00ff88; text-decoration: none; }
        a:hover { text-decoration: underline; }
        .disclaimer {
            background: #330000;
            border: 1px solid #ff3366;
            padding: 1rem;
            border-radius: 4px;
            margin-top: 2rem;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>SGPI</h1>
        <p class="tagline">Offline Package - Version ${new Date().toISOString().split('T')[0]}</p>
        
        <div class="section">
            <h2>📚 Wiki (Markdown)</h2>
            <ul>
                <li><a href="wiki/sources/confidentialite.md">Confidentialité & Sécurité</a></li>
                <li><a href="wiki/sources/ia.md">Intelligence Artificielle</a></li>
                <li><a href="wiki/sources/films.md">Films & Séries</a></li>
                <!-- Ajouter autres catégories -->
            </ul>
        </div>
        
        <div class="section">
            <h2>📖 Tutoriels</h2>
            <ul>
                <li><a href="tutos/sources/example-tuto.md">Exemple Tutoriel</a></li>
            </ul>
        </div>
        
        <div class="section">
            <h2>🛠️ Scripts</h2>
            <p>Génère HTML depuis Markdown :</p>
            <pre style="background: #000; padding: 1rem; border-radius: 4px; margin-top: 1rem;">
python scripts/generate-wiki.py wiki/sources/FICHIER.md
            </pre>
        </div>
        
        <div class="disclaimer">
            <strong>⚠️ Disclaimer</strong><br>
            Contenu à but éducatif uniquement. L'utilisateur est seul responsable de ses actions.
        </div>
    </div>
</body>
</html>`;
    }
    
    async downloadZip(zip) {
        const blob = await zip.generateAsync({ type: 'blob' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = `sgpi-offline-${Date.now()}.zip`;
        a.click();
        
        URL.revokeObjectURL(url);
        
        console.log('✅ Download started!');
    }
}

// Export for use in terminal or buttons
window.sgpiOffline = new SGPIOfflinePackage();

// Button trigger function
window.downloadOfflinePackage = function() {
    console.log('📦 Preparing offline package...');
    window.sgpiOffline.generate();
};
