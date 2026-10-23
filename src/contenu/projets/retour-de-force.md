---
title: "Retour de Force"
description: "Plateforme privée de mods BeamNG.drive testés à la main, avec une communauté Discord. Téléchargements accessibles après connexion Discord."
status: en-cours
year: 2026
tech:
  - Eleventy
  - Nunjucks
  - Markdown
  - JavaScript
  - CSS
  - Cloudflare Pages
  - Cloudflare Workers
  - GitHub Actions
  - OAuth Discord
  - Chiffrement AES-256-GCM
demo: https://retour-de-force.pages.dev/
featured: true
---

Retour de Force est un site qui référence des mods pour BeamNG.drive : véhicules, maps, scénarios et configs. Chaque mod est testé à la main avant d'être publié, et le site ne contient aucune publicité.

Je gère seul le site et le serveur Discord qui va avec. Le projet a été lancé le 20 mars 2026.

## Pourquoi

Les sites qui hébergent des mods sont remplis de publicités trompeuses et de faux boutons de téléchargement, et certains liens finissent par disparaître. Je voulais un endroit où l'on ne garde que ce qui fonctionne, avec une communauté restreinte et respectueuse.

## Ce que j'y fais

- Je développe et je maintiens le site.
- Je sélectionne et je teste les mods.
- Je gère le serveur Discord et sa modération.
- Je crée les visuels, comme les bannières des salons.

## Comment ça marche

- Le site est statique, généré avec Eleventy. Chaque mod est un fichier Markdown avec son en-tête (frontmatter).
- Il est hébergé sur Cloudflare Pages et consultable sans compte.
- Le site ne stocke aucun fichier de mod : les liens pointent vers des hébergeurs tiers, comme FileDitch.
- Pour télécharger, il faut se connecter avec Discord et avoir le rôle d'accès. Les liens sont chiffrés dans le code du site, et un Cloudflare Worker fournit le code de déchiffrement après la connexion.
- Un workflow GitHub Actions annonce automatiquement chaque nouveau mod sur le Discord.

## Où en est le projet

Le projet est en cours depuis son lancement le 20 mars 2026. Le catalogue évolue : j'ajoute de nouveaux mods après test et je prévois de trier les anciens.

## Liens

- [Le site](https://retour-de-force.pages.dev/)
- [Le serveur Discord](https://discord.gg/XZuxq9hpTb)