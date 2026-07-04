---
title: "SFS FR — Communauté francophone Spaceflight Simulator"
description: "Communauté Discord francophone dédiée à Spaceflight Simulator, adossée à un site vitrine statique (tutos, FAQ, présentation) — entièrement statique sous Eleventy, hébergé sur Cloudflare Pages."
date: 2026-07-04
order: 2
status: actif
year: 2026
tech:
  - Eleventy (11ty)
  - Nunjucks
  - Cloudflare Pages
  - JavaScript vanilla
  - Markdown / YAML
demo: "https://sfs-fr.pages.dev/"
discord: "https://discord.gg/D8cGZQB7Hs"
github: "https://github.com/rpmn0ise/sfs-fr"
draft: false
---

## Origine

Le constat de départ est simple : Spaceflight Simulator n'a quasiment aucune présence francophone organisée. Les communautés existantes sont anglophones, ou orientées RP quand un espace FR se dessine. Aucun endroit centralisé pour l'entraide, le partage de blueprints ou l'apprentissage du jeu en français.

SFS FR est né pour combler ce vide — un espace ouvert, pensé dès le départ pour l'entraide et la discussion, plutôt qu'une simple duplication du serveur officiel anglophone.

---

## Un projet délibérément ouvert

> **SFS FR n'a ni whitelist, ni friction d'accès — et c'est un choix.**

Contrairement à d'autres projets fermés et curatés, ici l'objectif est l'inverse : abaisser au maximum la barrière d'entrée pour une communauté naissante. Pas de code d'accès, pas de validation manuelle, pas de filtrage. N'importe qui peut rejoindre le Discord ou consulter le site librement.

Ce choix reflète la phase du projet : une communauté qui démarre de zéro a besoin de croître avant de pouvoir se permettre une quelconque sélectivité. La priorité est la visibilité et l'accessibilité, pas le contrôle.

---

## Deux briques complémentaires

Le projet repose sur deux composants distincts mais liés :

**Le serveur Discord** — le cœur vivant de la communauté : discussion générale, entraide technique, partage de blueprints, suivi de l'actualité SFS2, rôles auto-attribuables (plateforme, notifications).

**Le site vitrine** (`sfs-fr.pages.dev`) — une façade statique, pensée pour :
- Donner une image plus sérieuse au projet lors du recrutement (Disboard, Reddit, forums)
- Être indexable par les moteurs de recherche, contrairement à un serveur Discord invisible pour Google
- Héberger une base de tutos pérenne, plus lisible qu'un salon Discord qui scroll
- Centraliser une FAQ générale (jeu + serveur) accessible sans avoir à rejoindre le Discord au préalable

---

## Architecture technique

Le site repose sur Eleventy, déployé sur Cloudflare Pages. Aucune base de données, aucun backend — un site 100% statique généré à la compilation.

Chaque tuto est un fichier Markdown avec un frontmatter YAML standardisé :

```yaml
title: "Réussir sa mise en orbite"
categorie: orbite
date: 2026-07-01
description: "..."
```

La FAQ (jeu + serveur) est centralisée dans un fichier de données unique (`src/_data/faq.yaml`), organisé par sections, et rendue en accordéon via un peu de JavaScript vanilla — aucune dépendance externe.

Build via `eleventy`, sortie dans `_site`, déploiement automatique à chaque push sur Cloudflare Pages.

---

## Ce qui est non-trivial dans un contexte 100% statique

**FAQ en accordéon** — repose sur un simple toggle JS vanilla, sans framework, branché sur une collection de données Markdown/YAML éditable sans toucher au code.

**Collection de tutos** — générée automatiquement par Eleventy depuis un dossier `/src/tutos/*.md`, triée par date, avec filtrage par catégorie (orbite, atterrissage, optimisation, modding) géré en CSS/JS léger.

**Identité visuelle cohérente entre Discord et site** — même palette (bleu nuit `#0B1230`, orange `#F5821F`), même logo, mêmes codes visuels sur les embeds Discord, la bannière serveur et le site, pour une image de marque unifiée dès le lancement.

---

## Fonctionnalités

| Domaine | Détail |
|---|---|
| Serveur Discord | Entraide, partage de blueprints, discussion générale, suivi SFS2 |
| Rôles | Auto-attribuables (plateforme, notifications SFS2) |
| Site vitrine | Accueil, Tutos, FAQ, À propos |
| Tutos | Collection Markdown, triée par date, filtrable par catégorie |
| FAQ | Jeu + serveur, format accordéon, données centralisées en YAML |
| Accès | Totalement ouvert — aucune whitelist, aucune friction |
| Déploiement | Cloudflare Pages — build et déploiement auto à chaque push |
| Identité | Palette et logo partagés entre Discord et site |

---

## Prochaines étapes

- Étoffer la base de tutos (transferts orbitaux, missions interplanétaires, optimisation avancée)
- Ajouter une page dédiée au suivi de l'actualité SFS2 sur le site, en miroir du salon Discord
- Explorer une galerie de blueprints sur le site, alimentée par les partages du salon `#bp-sharing`
- Référencement naturel (SEO) une fois le contenu tutos suffisamment fourni
