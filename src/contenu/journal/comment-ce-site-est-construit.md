---
title: "Comment j'ai construit ce site"
date: 2026-11-11
description: "Eleventy, Markdown, Cloudflare Pages et un indicateur d'écoute sans serveur : les choix techniques de ce site, expliqués simplement."
tags:
  - site
  - eleventy
  - technique
---

Ce site est volontairement simple. Voici comment il est fait, et pourquoi.

## Pourquoi un site simple

J'ai plein d'autres projets qui me prennent du temps. Je ne voulais pas d'un site qui me demande de la maintenance : pas de base de données, pas de serveur à surveiller, pas de système d'administration. Juste des fichiers que je modifie, et un site qui se reconstruit.

## La base technique

- **Site statique** : toutes les pages sont générées à l'avance, puis servies telles quelles. Il n'y a aucune base de données.
- **Eleventy** : l'outil qui transforme mes fichiers en pages web. Je suis à l'aise avec Node.js et Eleventy, ce qui a pesé dans le choix.
- **Markdown** : les articles, les pages et les projets sont de simples fichiers texte avec un en-tête. Pour publier, j'ajoute un fichier.
- **Cloudflare Pages** : l'hébergement.
- **Thème clair et sombre**, qui suit le réglage de ton appareil, et un site pensé d'abord pour le mobile.
- **Français uniquement**, pour ne pas multiplier le travail.

## Un indicateur d'écoute sans serveur

La page [Musique](/musique/) affiche ce que j'écoute, avec un indicateur « en écoute ». Pour faire ça sans serveur, c'est le navigateur du visiteur qui interroge directement l'API de Last.fm, où mes écoutes sont enregistrées. Le site rafraîchit l'information toutes les 30 secondes quand l'onglet est visible.

Last.fm renvoie souvent une image générique à la place de la vraie pochette. Le site essaie donc plusieurs sources, dans l'ordre : l'image de Last.fm, puis Cover Art Archive, puis une recherche iTunes, et enfin une vignette typographique avec l'initiale du titre si rien n'a été trouvé. Le résultat est gardé en mémoire dans l'onglet pour ne pas refaire la recherche.

Une précision utile : quand je mets un titre en pause, il disparaît de l'indicateur. Ce n'est pas un bug du site, c'est Last.fm qui retire le titre en cours quand la lecture s'arrête. Un morceau n'est ajouté à l'historique qu'après la moitié du titre ou quatre minutes d'écoute.

## De petits détails

- **La citation de l'accueil** est tirée au hasard dans un fichier JSON à chaque chargement de la page. Le site vérifie le fichier à la construction et signale un problème comme un doublon.
- **La page 404** affiche un message au hasard à chaque visite.
- **L'aperçu de partage** (l'image et le texte qui s'affichent quand on colle un lien dans Discord) est réglé pour toutes les pages.

## Le rôle de l'IA

Ce site a été généré avec l'aide de Claude, une IA. Je tiens à le dire clairement : ça montre ma transparence, et j'assume cette confiance. Je savais ce que je voulais, la structure, le style, les règles de simplicité et de contenu, et tout s'est passé comme je le voulais.

## Ce qui reste à faire

Le site évolue au fil de mes idées. Ajouter une page, c'est ajouter un fichier. C'était exactement le but.
