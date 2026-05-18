---
title: "Retour de Force — Plateforme de mods BeamNG"
description: "Plateforme privée de curation et référencement de mods pour BeamNG.drive. 80+ mods indexés, accès restreint via Discord, zéro hébergement de fichiers, entièrement en Eleventy statique."
date: 2026-03-20
order: 1
status: actif
year: 2026
tech:
  - Eleventy (11ty)
  - GitHub Pages
  - GitHub Actions
  - Markdown / YAML
  - JavaScript vanilla
demo: "https://rpmn0ise.github.io/retour-de-force/"
github: "https://github.com/rpmn0ise/retour-de-force"
draft: false
---

## Origine

Le nom vient du volant à retour de force (Force Feedback) utilisé pendant la conception. L'idée de base : il n'existait pas d'endroit propre et fiable pour centraliser les mods BeamNG testés au sein de la communauté FR. Les sources sont éparpillées — forums, Discord, liens Mega qui meurent, packs non vérifiés.

Retour de Force est né pour régler ça.

## Ce que c'est concrètement

Une plateforme de **curation sélective** : chaque mod est testé et validé manuellement avant d'être indexé. Le site ne stocke aucun fichier — il référence et redirige vers les sources existantes. Les liens de téléchargement sont chiffrés côté client.

L'accès est restreint à une communauté privée via un code partagé sur Discord. Pas d'inscription, pas de compte — juste un code.

## Stack et architecture

Tout repose sur Eleventy avec GitHub Pages. Chaque mod est un fichier Markdown avec un frontmatter YAML standardisé :

```yaml
layout: layouts/mod.njk
title: "Nissan Skyline R32 GTR"
game: beamng
category: "Véhicule"
author: "Royal Renderings"
version: "1.1"
date: 2026-05-14
image: "https://i.imgur.com/..."
download: "..."
source: "Mega"
description: "..."
```

GitHub Actions détecte chaque push sur `main`, lance le build Eleventy et déploie automatiquement. Le cycle complet dure moins de 2 minutes.

## Fonctionnalités

**Catalogue** — 80+ mods indexés, filtrables par catégorie (Véhicule, Map, Config, Utilitaire), triables par date. Recherche instantanée côté client.

**Nouveautés** — page dédiée aux mods ajoutés dans les 7 derniers jours, avec mise en avant du dernier ajout.

**Fiches détaillées** — galerie photos par mod (support multi-images depuis Imgur), métadonnées complètes (auteur, version, source, date de mise à jour).

**Outil de soumission interne** (`/soumettre`) — formulaire qui génère le fichier Markdown avec prévisualisation live du rendu. Permet d'ajouter un mod sans toucher au code.

**Stats** — tableau de bord du catalogue (répartition par catégorie, volume, activité récente).

**Multilingue** — support FR/EN.

## Ce qui rend le projet non-trivial

La contrainte principale : tout doit être statique. Pas de base de données, pas de serveur, pas de backend. La recherche, les filtres, le tri, la galerie, la page nouveautés — tout tourne en JavaScript vanilla côté client sur des données générées à la compilation par Eleventy.

L'outil de soumission est particulièrement intéressant : il génère un fichier `.md` complet prêt à commit, avec prévisualisation Markdown en temps réel, import en masse d'URLs Imgur et validation des champs. Tout ça sans framework, sans backend.

## Ce qui vient ensuite

- Système de tags par mod (style de conduite, compatibilité version BeamNG)
- Historique des versions par mod
- Page contributeurs
- Notifications Discord automatiques à chaque nouveau mod via webhook GitHub Actions
