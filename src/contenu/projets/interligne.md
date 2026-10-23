---
title: "Interligne"
description: "Fanzine francophone d'actualités et de découvertes : articles rédigés par IA, sujets choisis et vérifiés par moi, sources et fiabilité affichées."
status: en-cours
year: 2026
tech:
  - Eleventy
  - Markdown
  - Nunjucks
  - HTML et CSS
  - JavaScript
  - Node.js
  - GitHub
  - Cloudflare Pages
demo: https://interligne.pages.dev
---

Interligne est un fanzine personnel en français. Il publie des articles sur des sujets variés (sciences, informatique, intelligence artificielle, jeux vidéo) que je choisis parce qu'ils m'ont surpris, qu'ils m'intéressent ou qu'ils sont nouveaux.

Les textes sont rédigés par une IA, à partir de sources que je lui fournis. Je choisis les sujets, je vérifie le contenu en le comparant aux sources, j'écris mon avis et je publie. Chaque article affiche ses sources et un niveau de fiabilité.

## Pourquoi

Je voulais une publication à moi, avec une vraie liberté de sujets, sans me limiter à un seul thème. L'idée vient du site d'un professeur de NSI, Mon petit informaticien. Je voulais aussi utiliser une IA pour écrire sans lui laisser les décisions éditoriales, et le dire clairement aux lecteurs.

## Ce que j'y fais

- Je choisis les sujets et je rassemble les sources, en cherchant d'abord l'origine de l'information.
- Je donne le texte de ces sources à l'IA, qui rédige l'article.
- Je vérifie les chiffres, les dates, les noms et les citations dans les sources.
- J'écris moi-même l'avis qui accompagne chaque article.
- J'ai conçu le fonctionnement du site et sa mise en page. [À CONFIRMER : préciser la part de l'IA dans l'écriture du code du site]

## Comment ça marche

Le site est statique : il n'a ni serveur ni base de données. Eleventy génère les pages à partir de fichiers Markdown, un par article, avec un en-tête YAML qui contient le titre, la date, les sources, le niveau de fiabilité et la date de vérification.

Un article passe par cinq statuts : idée, brouillon, à vérifier, validé, publié. Le site n'affiche que les articles publiés. Un script écrit en Node.js bloque la publication si un article publié n'a pas de source, de niveau de fiabilité ou de date de vérification.

Le niveau de fiabilité est solide, partiel ou fragile. Un article fragile affiche un avertissement en tête de page. Les corrections apportées après publication sont datées et réunies sur une page dédiée.

Le site propose aussi un flux RSS, un plan de site et un thème clair ou sombre, automatique ou choisi à la main. Les polices sont hébergées avec le site.

## Où en est le projet

Le site est en ligne depuis octobre 2026. Je publie environ un article par semaine, et je continue d'ajuster la méthode et la mise en page au fil des articles. Le code est dans un dépôt privé.

## Liens

- [Le site](https://interligne.pages.dev/)
- [La démarche éditoriale](https://interligne.pages.dev/demarche/)
- [Les corrections](https://interligne.pages.dev/corrections/)
- [Le flux RSS](https://interligne.pages.dev/feed.xml)