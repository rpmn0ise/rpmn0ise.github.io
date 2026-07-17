# RPMN0ISE — Digital Laboratory

Site personnel construit avec [Eleventy v3](https://www.11ty.dev/) — pensé comme un laboratoire numérique personnel : articles, notes, projets et expérimentations, organisés en 5 domaines et mélangés chronologiquement dans un flux unique (« Le Labo »).

Ce n'est ni un portfolio classique, ni un blog, ni un dashboard.

## ✨ Fonctionnalités

- **Le Labo** (`/blog/`) — flux unifié articles + notes + projets, filtrable par domaine et par type, recherche locale
- **5 domaines** (`/domaines/<id>/`) — Systèmes, Création numérique, Ingénierie, Simulation, Culture — seule source chromatique du site
- **Projets** avec fiches détaillées : nomenclature, journal d'expérimentation (timeline), prochaines étapes
- **Notes** — fragments techniques rapides
- **Panneau de navigation** plein écran (overlay), accessible au clavier, avec comptage par domaine en temps réel
- **Page À propos**
- RSS/Atom (`/feed.xml`) + Sitemap XML (`/sitemap.xml`)
- SEO complet (meta, Open Graph, JSON-LD)
- Syntax highlighting + bouton copier le code
- Temps de lecture automatique
- Système de brouillons (drafts)
- Ligne d'état fonctionnelle dans le header (« dernière trace : il y a N jours »), calculée dynamiquement
- Aucune animation décorative, aucun glow — esprit carnet de laboratoire
- Compatible GitHub Pages / Netlify / Cloudflare Pages

---

## 🚀 Installation

### Prérequis

- Node.js ≥ 18
- npm ≥ 9

### Démarrer

```bash
git clone https://github.com/rpmn0ise/rpmn0ise.github.io.git
cd rpmn0ise.github.io
npm install
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
rpmn0ise.github.io/
│
├── eleventy.config.js        # Configuration Eleventy (plugins, collections, filtres)
├── package.json
├── netlify.toml
├── .github/workflows/        # CI/CD GitHub Actions
├── docs/prompt_contenu.md    # Prompt de génération de contenu (frontmatter, domaines, ton)
│
└── src/
    │
    ├── _data/
    │   ├── site.json         # ⭐ Config principale (nom, URL, auteur, réseaux, "now")
    │   ├── domains.json       # ⭐ Source unique des 5 domaines (id, label, couleur, description)
    │   └── env.js
    │
    ├── _includes/
    │   ├── layouts/
    │   │   ├── base.njk      # Shell HTML unique (head, header, nav-panel, footer, scripts)
    │   │   ├── page.njk      # Pages statiques (about, setup...)
    │   │   ├── post.njk      # Article OU note (layout fusionné)
    │   │   ├── project.njk   # Fiche projet (nomenclature, timeline, prochaines étapes)
    │   │   └── rebass.njk    # Page Rebass (grille de morceaux)
    │   │
    │   └── components/
    │       ├── header.njk       # Nom du site + ligne d'état + déclencheur du panneau
    │       ├── nav-panel.njk    # Panneau de navigation plein écran (domaines + liens)
    │       ├── footer.njk
    │       ├── entry-card.njk   # Fiche d'entrée unique — article, note OU projet
    │       ├── domain-pill.njk  # Pastille de domaine (lit domains.json)
    │       ├── status-tag.njk   # Étiquette EN COURS / STABLE / ARCHIVÉ
    │       ├── margin-note.njk  # Note de marge (post__margin)
    │       ├── timeline.njk     # Journal d'expérimentation vertical
    │       └── pagination.njk
    │
    ├── assets/
    │   ├── css/
    │   │   ├── main.css      # Point d'entrée — importe les 5 fichiers ci-dessous, dans l'ordre
    │   │   ├── tokens.css    # Source unique de vérité : couleurs, typo, espacements
    │   │   ├── base.css      # Reset + éléments HTML natifs
    │   │   ├── layout.css    # Header, footer, nav-panel, sections, boutons
    │   │   ├── components.css # entry-card, domain-pill, status-tag, timeline, filtres...
    │   │   └── prose.css     # Typographie de lecture longue
    │   ├── js/
    │   │   ├── nav-panel.js  # Ouverture/fermeture du panneau, focus trap, Échap
    │   │   └── main.js       # Recherche, filtres, barre de lecture, copier le code
    │   └── images/
    │
    ├── content/               # ⭐ Tout le contenu Markdown
    │   ├── blog/               # Articles de fond — blog.json fixe layout/permalink/tags
    │   ├── notes/               # Fragments techniques courts
    │   └── projects/            # Projets, avec nomenclature/log/nextSteps
    │
    └── pages/
        ├── blog.njk           # /blog/ — "Le Labo", flux unifié paginé + filtres + recherche
        ├── domains.njk         # /domaines/<id>/ — une fiche par domaine (pagination sur domains.json)
        ├── tags.njk            # /tags/<tag>/ — pages de tags (articles + notes)
        ├── projects.njk        # /projects/ — index projets
        ├── notes.njk           # /notes/ — index notes
        ├── about.md            # À propos (sections marquées par domaine)
        ├── setup.md
        ├── rebass.md
        ├── 404.njk
        ├── sitemap.njk         # sitemap.xml
        └── feed.njk            # feed.xml (RSS/Atom)
```

---

## ✍️ Publier du contenu

Voir `docs/prompt_contenu.md` pour le prompt complet de génération (frontmatter exact, ton, structure). Résumé :

### Nouvel article de blog

`src/content/blog/mon-article.md` :

```markdown
---
title: "Mon article"
description: "Un résumé en une ou deux phrases."
date: 2026-04-01
domain: systemes          # obligatoire — voir src/_data/domains.json
tags:
  - post
  - javascript
featured: false
draft: false
annotations:                # optionnel — notes de marge
  - "Une remarque courte et dense"
---

Votre contenu en Markdown...
```

**URL générée** : `/blog/mon-article/` (slug dérivé du nom de fichier).

### Nouveau projet

`src/content/projects/mon-projet.md` :

```markdown
---
title: "Nom du projet"
description: "Ce que fait le projet en une phrase."
date: 2026-04-01
domain: ingenierie
order: 1
status: en-cours           # en-cours | stable | archive
year: 2026
tech:
  - TypeScript
  - React
github: "https://github.com/..."
demo: "https://..."
log:                         # optionnel — journal d'expérimentation
  - date: "avril 2026"
    note: "Ce qui a été fait"
    done: true
nextSteps:                   # optionnel
  - "Prochaine étape"
draft: false
---

Description longue en Markdown...
```

### Nouvelle note

`src/content/notes/ma-note.md` :

```markdown
---
title: "Titre court"
description: "En une phrase."
date: 2026-04-01
domain: systemes
tags:
  - git
  - tips
---

Contenu court et direct.
```

---

## ⚙️ Configuration principale

`src/_data/site.json` — nom, URL, auteur, réseaux sociaux, navigation, et le champ `now.current` (ligne d'état de la homepage, à mettre à jour manuellement).

`src/_data/domains.json` — les 5 domaines. Toute modification (ajout, renommage, couleur) se répercute automatiquement sur le panneau de navigation, la homepage et les pages `/domaines/<id>/`.

---

## 🎨 Personnalisation du design

Le design system est entièrement en CSS Custom Properties, une seule source de vérité : `src/assets/css/tokens.css`.

```css
:root {
  --accent-primary: #YOUR_COLOR;
  --accent-hover:   #YOUR_HOVER;
}
```

Les couleurs de domaine se changent uniquement dans `src/_data/domains.json` (champ `color`).

---

## 🔧 Fonctionnalités avancées

### Shortcodes disponibles dans le Markdown

```markdown
{% callout "info" %}Un message informatif.{% endcallout %}
{% callout "warning" %}Attention à ceci.{% endcallout %}
{% callout "error" %}Erreur critique.{% endcallout %}

{% image "/assets/images/mon-image.jpg", "Texte alternatif", "Légende optionnelle" %}

© {% year %}
```

### Filtres Nunjucks disponibles

| Filtre | Usage |
|---|---|
| `readableDate` | Formate une date (`date \| readableDate`) |
| `htmlDateString` | Format ISO pour `<time>` |
| `isoDate` | ISO 8601 complet (RSS/JSON-LD) |
| `limit` | Tronque un tableau |
| `slugify` | Crée un slug |
| `readingTime` | Temps de lecture (`content \| readingTime`) |
| `timeAgo` | « il y a N jours » (`date \| timeAgo`) |
| `domainInfo` | Lookup domaine (`domainId \| domainInfo`) |
| `relatedEntries` | Entrées liées, domaine + tags (`page \| relatedEntries(collections.entries)`) |
| `previousEntry` / `nextEntry` | Navigation chronologique (`page \| nextEntry(collections.entries)`) |

### Collections disponibles

| Collection | Contenu |
|---|---|
| `collections.posts` | Articles de blog |
| `collections.notes` | Notes rapides |
| `collections.projects` | Projets (triés par `order`) |
| `collections.entries` | ⭐ Fusion articles + notes + projets, triée par date — le flux du labo |
| `collections.domainStats` | Les 5 domaines enrichis des comptages réels (`articles`, `notes`, `projects`, `total`, `pct`) |
| `collections.tagList` | Liste de tous les tags uniques (articles + notes) |

---

## 🚢 Déploiement

### GitHub Pages (actuel)

Le workflow `.github/workflows/deploy.yml` est déjà configuré. Push sur `main` → déploiement automatique.

### Netlify

1. Pushez sur GitHub
2. Connectez le repo sur [netlify.com](https://netlify.com) — `netlify.toml` est déjà présent
3. Déploiement automatique à chaque push sur `main`

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
| `markdown-it` / `markdown-it-anchor` / `markdown-it-attrs` | Parser Markdown + ancres + attributs |
| `luxon` | Manipulation et formatage de dates |
| `html-minifier-terser` | Minification HTML en production |

> Le temps de lecture (`readingTime`) est un filtre maison, pas un plugin — voir `eleventy.config.js`.

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
