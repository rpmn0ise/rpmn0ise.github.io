---
title: "Retour de Force — Plateforme privée de mods BeamNG"
description: "Plateforme privée et curatée de mods pour BeamNG.drive. Accès restreint par code Discord, mode invité avec liens chiffrés côté client, 80+ mods indexés — entièrement statique sous Eleventy."
date: 2026-03-20
domain: simulation
order: 1
status: en-cours
year: 2026
tech:
  - Eleventy (11ty)
  - GitHub Pages
  - GitHub Actions
  - JavaScript vanilla
  - Markdown / YAML
demo: "https://rpmn0ise.github.io/retour-de-force/"
github: "https://github.com/rpmn0ise/retour-de-force"
access: "privé — code Discord requis"
log:
  - date: "20 mars 2026"
    note: "Lancement — architecture Eleventy + GitHub Actions, premier catalogue de mods"
    done: true
  - date: "avril 2026"
    note: "Ajout recherche/filtres JS vanilla sur index JSON, zéro latence côté client"
    done: true
  - date: "mai 2026"
    note: "Chiffrement des liens en mode invité — montrer sans ouvrir"
    done: true
nextSteps:
  - "Tags par mod (style de conduite, compatibilité version)"
  - "Historique des versions par fiche"
  - "Notifications Discord via webhook"
draft: false
---

## Origine

Le nom vient du volant à retour de force (Force Feedback) utilisé au moment de la conception. L'idée est née d'un constat simple : il n'existait aucun endroit propre et fiable pour centraliser les mods BeamNG testés au sein de la communauté FR. Les sources sont éparpillées sur des forums, des fils Discord, des liens Mega qui meurent après 48h, des packs non vérifiés. Trop de bruit, pas assez de signal.

Retour de Force est né pour régler ça — une plateforme fermée et curatée, pensée pour une communauté restreinte qui sait ce qu'elle cherche.

---

## Un site délibérément privé

> **Retour de Force n'est pas public — et c'est un choix.**

L'accès complet est réservé aux membres du cercle privé. Le code d'accès est distribué manuellement sur le serveur Discord : pas d'inscription, pas de formulaire, pas de compte à créer. Soit tu as le code, soit tu n'entres pas.

Cette décision n'est pas une contrainte technique — c'est un parti pris de design. Un catalogue de mods curatés perd tout son sens s'il est accessible sans filtrage. La sélectivité de l'accès est le miroir de la sélectivité du contenu : chaque mod présent a été testé, vérifié, jugé digne d'y figurer.

---

## Mode invité — voir sans pouvoir télécharger

Pour les visiteurs arrivant sans code, un **mode invité** est disponible. Il permet d'explorer le catalogue dans sa quasi-totalité, mais avec une restriction centrale et intentionnelle : **les liens de téléchargement sont chiffrés et inaccessibles**.

En mode invité, voici ce qui est disponible :

- **Navigation complète** du catalogue — fiches, photos, métadonnées
- **Recherche et filtres** pleinement fonctionnels
- **Lecture intégrale** de chaque fiche mod

En revanche, ce qui reste verrouillé :

- **Les liens de téléchargement** — encodés côté client, illisibles sans authentification valide

Les liens pointent vers les sources externes (Mega, etc.) mais sont obfusqués au moment du rendu JavaScript, en fonction de l'état d'authentification détecté localement. Un visiteur non authentifié voit qu'un mod existe, peut lire sa fiche complète et ses captures — mais le lien reste une chaîne opaque, inutilisable.

C'est une frontière volontaire : **montrer ce qu'il y a derrière la porte, sans l'ouvrir**.

> Note : cette protection côté client n'est pas infaillible face à un adversaire déterminé et technique. Elle est conçue pour décourager l'accès non invité et protéger les sources, pas pour garantir une sécurité absolue.

---

## Architecture technique

Tout repose sur Eleventy avec GitHub Pages. Pas de base de données, pas de serveur, pas de backend — une contrainte forte qui a dicté toutes les décisions techniques du projet.

Chaque mod est un fichier Markdown avec un frontmatter YAML standardisé :

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

Eleventy compile l'ensemble en HTML statique. GitHub Actions détecte chaque push sur `main`, lance le build et déploie automatiquement. Cycle complet en moins de 2 minutes.

---

## Ce qui est non-trivial dans un contexte 100% statique

L'absence totale de backend oblige à résoudre côté client des problèmes qu'on délègue habituellement au serveur.

**Recherche et filtres** — recherche instantanée par titre, auteur et catégorie, tri par date, filtres multi-critères — tournent entièrement en JavaScript vanilla sur un index JSON généré à la compilation par Eleventy. Aucune requête serveur, zéro latence.

**Page Nouveautés** — mods ajoutés dans les 7 derniers jours, avec mise en avant du dernier ajout — calculée statiquement à chaque build. Elle se met à jour dès qu'un nouveau fichier `.md` est committé.

**Chiffrement des liens** — obfuscation côté client au moment du rendu, conditionnée à l'état d'authentification local. Protection délibérément simple mais efficace pour l'usage cible.

---

## Outil de soumission interne

La page `/soumettre` est l'un des morceaux les plus utiles du projet. C'est un formulaire qui génère le fichier `.md` complet prêt à commit, avec :

- Prévisualisation Markdown en temps réel du rendu final
- Import en masse d'URLs Imgur pour la galerie photos
- Validation des champs obligatoires
- Bouton "Copier" pour sortir le fichier prêt à coller dans le repo

Résultat : ajouter un mod ne demande pas de toucher au code. N'importe quel membre de confiance peut préparer une fiche, la copier et ouvrir une PR.

---

## Fonctionnalités

| Domaine | Détail |
|---|---|
| Catalogue | 80+ mods — Véhicule, Map, Config, Utilitaire |
| Recherche | Instantanée + filtres multi-critères + tri par date |
| Fiches | Détaillées, galerie multi-photos |
| Nouveautés | Page dédiée, 7 derniers jours |
| Stats | Compteurs du catalogue en temps réel |
| Soumission | Outil interne avec prévisualisation live |
| Langue | Support FR / EN |
| Accès | Code Discord requis — mode invité avec liens chiffrés |
| CI/CD | GitHub Actions — déploiement auto à chaque push |

---

## Prochaines étapes

- Tags par mod (style de conduite, compatibilité version BeamNG)
- Historique des versions par fiche
- Notifications Discord automatiques via webhook GitHub Actions à chaque nouveau mod
- Page contributeurs
