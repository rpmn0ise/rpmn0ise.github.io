---
title: "LIBRAW"
description: "Annuaire FR ultra-sélectif d'outils et guides pour utilisateurs tech — streaming, download, privacy, émulation, vérifiés manuellement."
date: 2026-05-21
order: 3
status: actif
year: 2026
tech:
  - Eleventy 3
  - Nunjucks
  - Markdown
  - CSS custom
  - JavaScript vanilla
  - Cloudflare Pages
github: "https://github.com/rpmn0ise/LIBRAW"
demo: "https://libraw.pages.dev"
draft: false
---

## Pourquoi ce projet existe

Les annuaires de ressources pirate/tech en français sont soit morts, soit gonflés à l'air avec 300 liens dont la moitié ne fonctionne plus, soit monétisés avec de l'affiliation déguisée. LIBRAW est une réponse directe à ça : une liste courte, vérifiée manuellement, sans sponsor, sans pub, sans bullshit.

L'idée de départ : un endroit où envoyer quelqu'un qui me demande "comment télécharger X" ou "c'est quoi un bon VPN" sans avoir à réécrire la même réponse à chaque fois.

## Ce que ça fait

Le site regroupe deux types de contenu :

- **Ressources** — fiches d'outils et de sites classés par catégorie (streaming, download, outils, privacy, émulation), avec niveau de difficulté, date de vérification et lien vers un guide si il existe
- **Guides** — tutoriels pratiques associés aux ressources : config uBlock, torrent débutant, stack *arr complète, émulation Switch...

Chaque ressource a un badge de vérification avec date. Si c'est vieux ou mort, ça sort.

## Choix techniques

**Eleventy** plutôt qu'un CMS ou un framework : génération statique, zéro base de données, déploiement immédiat sur Cloudflare Pages à chaque push. Le contenu est entièrement en fichiers Markdown avec frontmatter YAML — éditable depuis n'importe quel éditeur, versionné proprement avec Git.

**Pas de framework CSS ni JS.** Le CSS est écrit à la main, le JS vanilla gère la recherche live côté client (filtrage sur titre, description, catégorie, niveau) et le TOC dynamique des guides via `IntersectionObserver`. Aucune dépendance frontend, aucun bundle, temps de chargement quasi nul.

**Nunjucks** pour les templates : macros réutilisables pour les cartes ressources, layouts séparés par type de page (home, guide, catégorie). La config Eleventy centralise les collections, filtres et shortcodes — tout est lisible en un seul fichier.

Le tout tourne sur Cloudflare Pages : build automatique sur push, CDN mondial, certificat TLS inclus, domaine custom. Coût : 0€.

## État

- [x] Structure Eleventy + Nunjucks
- [x] Collections ressources par catégorie
- [x] Système de fiches avec vérification manuelle
- [x] Guides avec TOC dynamique
- [x] Recherche et filtres côté client
- [x] Déploiement Cloudflare Pages
- [ ] Recherche full-text sur le contenu des guides
- [ ] Flux RSS pour les nouveaux guides
- [ ] Page "dernières vérifications" — timeline des màj
