# Site personnel Eleventy

Site personnel complet, rapide, maintenable — construit avec [Eleventy v3](https://www.11ty.dev/).

## ✨ Fonctionnalités

- **Blog** avec pagination, tags, recherche locale et articles liés
- **Projets / Portfolio** avec fiches détaillées
- **Ressources** — liens et outils favoris
- **Notes** — fragments techniques rapides
- **Page À propos**
- Dark mode (système + toggle manuel)
- RSS Feed + Sitemap XML
- SEO complet (meta, Open Graph, JSON-LD)
- Syntax highlighting pour le code
- Temps de lecture automatique
- Système de brouillons (drafts)
- Responsive mobile / desktop
- Animations discrètes
- Page 404 personnalisée
- Compatible GitHub Pages / Netlify / Cloudflare Pages
- Score Lighthouse > 95 en production

---

## 🚀 Installation

### Prérequis

- Node.js ≥ 18
- npm ≥ 9

### Démarrer

```bash
# Cloner
git clone https://github.com/votrenom/site.git
cd site

# Installer les dépendances
npm install

# Lancer le serveur de développement
npm run dev
```

Le site est disponible sur `http://localhost:8080` avec rechargement automatique.

### Build production

```bash
npm run build
# Le site généré est dans ./_site/
```

---

## 📁 Structure du projet

```
site/
│
├── eleventy.config.js        # Configuration Eleventy (plugins, collections, filtres)
├── package.json
├── netlify.toml              # Config Netlify (headers, redirects)
├── .github/workflows/        # CI/CD GitHub Actions
│
└── src/
    │
    ├── _data/                # Données globales
    │   ├── site.json         # ⭐ Config principale (nom, URL, réseaux sociaux...)
    │   └── env.js            # Variables d'environnement
    │
    ├── _includes/
    │   ├── layouts/          # Gabarits de page
    │   │   ├── base.njk      # Layout racine (head, header, footer, scripts)
    │   │   ├── home.njk      # Page d'accueil
    │   │   ├── post.njk      # Article de blog (avec articles liés, nav prev/next)
    │   │   ├── page.njk      # Pages statiques (about, etc.)
    │   │   └── project.njk   # Fiche projet
    │   │
    │   └── components/       # Composants réutilisables
    │       ├── header.njk    # Navigation + theme toggle + menu mobile
    │       ├── footer.njk    # Footer + liens sociaux
    │       ├── post-card.njk # Card article (grille)
    │       ├── project-card.njk # Card projet
    │       └── pagination.njk   # Pagination
    │
    ├── assets/
    │   ├── css/
    │   │   └── main.css      # Tout le CSS (design system, dark mode, composants)
    │   ├── js/
    │   │   └── main.js       # JS vanilla (theme, nav mobile, search, code copy)
    │   └── images/           # Images statiques
    │
    ├── content/              # ⭐ Tout le contenu Markdown
    │   ├── blog/             # Articles de blog
    │   │   ├── blog.json     # Defaults (layout, tags, permalink)
    │   │   └── *.md          # Vos articles
    │   ├── projects/         # Projets
    │   │   ├── projects.json
    │   │   └── *.md
    │   ├── resources/        # Ressources / liens
    │   │   ├── resources.json
    │   │   └── *.md
    │   └── notes/            # Notes rapides
    │       ├── notes.json
    │       └── *.md
    │
    └── pages/                # Pages fonctionnelles
        ├── blog.njk          # Index blog (pagination + search)
        ├── tags.njk          # Pages de tags (auto-générées)
        ├── projects.njk      # Index projets
        ├── resources.njk     # Index ressources
        ├── notes.njk         # Index notes
        ├── about.md          # À propos
        ├── 404.njk           # Page 404
        ├── sitemap.njk       # sitemap.xml
        └── feed.njk          # feed.xml (RSS/Atom)
```

---

## ✍️ Publier du contenu

### Nouvel article de blog

Créez `src/content/blog/mon-article.md` :

```markdown
---
title: "Mon article"
description: "Un résumé en une ou deux phrases."
date: 2024-04-01
tags:
  - post
  - javascript
  - web
featured: false          # true = affiché en home
draft: false             # true = invisible en production
image: /assets/images/posts/cover.jpg  # optionnel
imageAlt: "Description de l'image"
---

Votre contenu en Markdown...
```

**L'URL générée** : `/blog/mon-article/`

> Le `slug` est dérivé automatiquement du nom de fichier.

### Nouveau projet

Créez `src/content/projects/mon-projet.md` :

```markdown
---
title: "Nom du projet"
description: "Ce que fait le projet en une phrase."
date: 2024-04-01
order: 1               # Ordre d'affichage (1 = premier)
status: actif          # actif | terminé | pause | wip
year: 2024
tech:
  - TypeScript
  - React
  - PostgreSQL
github: "https://github.com/..."
demo: "https://..."
image: /assets/images/projects/cover.jpg
draft: false
---

Description longue en Markdown...
```

### Nouvelle ressource

Créez `src/content/resources/ma-ressource.md` :

```markdown
---
title: "Nom de la ressource"
description: "Ce que c'est en une phrase."
url: "https://..."         # Lien externe
icon: "🔧"                 # Emoji d'icône
tags:
  - outils
  - web
date: 2024-04-01
---
```

### Nouvelle note

Créez `src/content/notes/ma-note.md` :

```markdown
---
title: "Titre court"
description: "En une phrase."
date: 2024-04-01
tags:
  - git
  - tips
---

Contenu court et direct.
```

---

## ⚙️ Configuration principale

Tout se configure dans `src/_data/site.json` :

```json
{
  "title": "Votre Nom",
  "description": "Votre tagline",
  "url": "https://votresite.fr",
  "author": {
    "name": "Votre Nom",
    "email": "contact@votresite.fr",
    "bio": "Votre bio courte",
    "avatar": "/assets/images/avatar.jpg",
    "location": "France"
  },
  "social": {
    "github": "https://github.com/...",
    "twitter": "https://twitter.com/...",
    "linkedin": "https://linkedin.com/in/...",
    "rss": "/feed.xml"
  },
  "postsPerPage": 10
}
```

---

## 🎨 Personnalisation du design

Le design system est entièrement en CSS Custom Properties dans `src/assets/css/main.css`.

### Changer la couleur d'accent

```css
:root {
  --accent-primary: #YOUR_COLOR;   /* Couleur principale */
  --accent-hover:   #YOUR_HOVER;   /* Hover state */
  --accent-subtle:  rgba(..., 0.1); /* Fond léger */
}
```

### Changer la police

```css
:root {
  --font-sans: "Inter", system-ui, sans-serif;
}
```

Puis ajoutez le `<link>` Google Fonts dans `src/_includes/layouts/base.njk`.

---

## 🔧 Fonctionnalités avancées

### Shortcodes disponibles dans le Markdown

**Callout (bloc d'information)** :
```markdown
{% callout "info" %}
Un message informatif.
{% endcallout %}

{% callout "warning" %}
Attention à ceci.
{% endcallout %}

{% callout "danger" %}
Erreur critique.
{% endcallout %}

{% callout "success" %}
Tout va bien !
{% endcallout %}
```

**Image avec légende** :
```markdown
{% image "/assets/images/mon-image.jpg", "Texte alternatif", "Légende optionnelle" %}
```

**Année courante** :
```markdown
© {% year %}
```

### Filtres Nunjucks disponibles

| Filtre | Usage | Exemple |
|---|---|---|
| `readableDate` | Formate une date | `date \| readableDate` → "15 avril 2024" |
| `htmlDateString` | Format ISO pour `<time>` | `date \| htmlDateString` → "2024-04-15" |
| `isoDate` | ISO 8601 complet | Pour le RSS/JSON-LD |
| `limit` | Tronque un tableau | `posts \| limit(3)` |
| `slugify` | Crée un slug | `"Mon Titre" \| slugify` → "mon-titre" |
| `relatedPosts` | Articles liés | `page \| relatedPosts(collections.posts)` |
| `readingTime` | Temps de lecture | `content \| readingTime` |

### Collections disponibles

| Collection | Contenu |
|---|---|
| `collections.posts` | Articles de blog (hors drafts en prod) |
| `collections.projects` | Projets (triés par `order`) |
| `collections.resources` | Ressources |
| `collections.notes` | Notes rapides |
| `collections.tagList` | Liste de tous les tags uniques |
| `collections.featured` | 3 articles `featured: true` max |

---

## 🚢 Déploiement

### Netlify (recommandé)

1. Pushez sur GitHub
2. Connectez le repo sur [netlify.com](https://netlify.com)
3. Netlify détecte automatiquement `netlify.toml`
4. ✅ Déploiement automatique à chaque push sur `main`

### GitHub Pages

Le workflow `.github/workflows/deploy.yml` est inclus.

1. Activez GitHub Pages dans les Settings du repo (source : branche `gh-pages`)
2. Modifiez `cname:` dans le workflow avec votre domaine
3. Pushez sur `main` → déploiement automatique

### Cloudflare Pages

```
Build command : npm run build
Output directory : _site
Node.js version : 20
```

---

## 📦 Dépendances

| Package | Rôle |
|---|---|
| `@11ty/eleventy` | Générateur de site statique |
| `@11ty/eleventy-plugin-rss` | Génération du flux RSS/Atom |
| `@11ty/eleventy-plugin-syntaxhighlight` | Coloration syntaxique (Prism.js) |
| `@11ty/eleventy-navigation` | Navigation breadcrumb |
| `eleventy-plugin-reading-time` | Calcul du temps de lecture |
| `markdown-it` | Parser Markdown (remplace le défaut) |
| `markdown-it-anchor` | Ancres sur les titres (`#`) |
| `markdown-it-attrs` | Attributs CSS dans le Markdown (`{.class}`) |
| `luxon` | Manipulation et formatage de dates |
| `html-minifier-terser` | Minification HTML en production |

---

## 🛠️ Scripts

```bash
npm run dev      # Serveur local avec hot reload (port 8080)
npm run build    # Build production dans ./_site
npm run clean    # Supprime _site/ et .cache/
npm run debug    # Build avec logs Eleventy détaillés
```

---

## 📄 Licence

MIT — Utilisez, modifiez et distribuez librement.
