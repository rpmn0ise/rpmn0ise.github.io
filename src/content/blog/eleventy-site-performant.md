---
title: "Construire un site performant avec Eleventy"
description: "Retour d'expérience sur la migration d'un site WordPress vers Eleventy : gains de performance, simplicité de déploiement et liberté totale sur l'architecture."
date: 2024-03-15
updated: 2024-03-20
tags:
  - post
  - eleventy
  - performance
  - web
featured: true
image: /assets/images/posts/eleventy-cover.jpg
imageAlt: "Logo Eleventy sur fond sombre"
---

Après des années sur WordPress, j'ai migré ce site vers **Eleventy**. Voici pourquoi, comment, et ce que j'en pense six mois après.

## Le problème avec WordPress

WordPress est fantastique pour beaucoup de cas d'usage, mais pour un blog personnel il apporte une complexité injustifiée :

- Base de données à maintenir
- Plugins à mettre à jour
- Sécurité à surveiller
- Temps de réponse serveur variable
- Coût d'hébergement

Un site personnel n'a pas besoin de tout ça.

## Pourquoi Eleventy ?

J'ai évalué plusieurs options : Hugo, Jekyll, Astro, Next.js. Eleventy a gagné pour ces raisons :

1. **Zéro JavaScript envoyé au client par défaut** — ce que je mets dans le JS c'est moi qui le décide
2. **Flexibilité des templates** — Nunjucks, Liquid, Markdown, HTML, JavaScript... peu importe
3. **Collections puissantes** — le système de collections couvre 95% des besoins
4. **Communauté active** — docs excellentes, plugins bien maintenus

{% callout "info" %}
Eleventy v3 est sorti en octobre 2024 avec le support ESM natif. Ce site tourne en v3.
{% endcallout %}

## La structure choisie

```
src/
├── _data/          # Données globales (JSON, JS)
├── _includes/      # Layouts et composants
│   ├── layouts/    # Gabarits de page
│   └── components/ # Morceaux réutilisables
├── assets/         # CSS, JS, images
└── content/        # Le contenu Markdown
    ├── blog/
    ├── projects/
    └── notes/
```

Cette séparation `content/` vs `assets/` vs `_includes/` rend le projet très lisible.

## Performances obtenues

Les résultats Lighthouse après optimisation :

| Métrique | Score |
|---|---|
| Performance | 99 |
| Accessibilité | 100 |
| SEO | 100 |
| Bonnes pratiques | 100 |

Le site pèse **moins de 20 KB** (CSS + JS minifiés, sans images).

## Ce qui manque

Soyons honnêtes, Eleventy n'est pas parfait :

- Pas d'optimisation d'images native (contrairement à Astro)
- Rebuild complet à chaque changement (hot reload partiel)
- Courbe d'apprentissage pour les collections

Mais ces limitations sont acceptables pour un site personnel.

## Conclusion

Si vous voulez un site rapide, maintenable, hébergeable gratuitement sur Netlify ou GitHub Pages, **Eleventy est un excellent choix**. Le contenu reste en Markdown, le code reste sous contrôle, et vous ne dépendez d'aucune plateforme propriétaire.

Toutes les sources de ce site sont disponibles sur [GitHub](https://github.com/votrenom/site).
