---
title: "SYS://CARD"
description: "Jeu de cartes navigateur sur l'informatique — collection, batailles PvP, boutique, tournois, backend serverless."
date: 2026-05-18
domain: creation-numerique
order: 1
status: en-cours
year: 2026
tech:
  - JavaScript Vanilla
  - HTML/CSS
  - Node.js
  - Vercel Serverless
  - MongoDB Atlas
  - Mongoose
  - JWT
  - GitHub Pages
github: "https://github.com/rpmn0ise/syscard"
demo: "https://rpmn0ise.github.io/syscard/"
draft: false
---

## Pourquoi ce projet existe

J'avais envie de construire un vrai jeu jouable en ligne, pas juste un front statique — avec des comptes utilisateurs, une base de données persistante, du PvP asynchrone. Le thème informatique s'est imposé naturellement : virus, daemons, distros, commandes CLI transformées en cartes de combat.

Le défi technique : faire tourner tout ça sans serveur dédié, en full serverless + GitHub Pages, avec un budget à zéro.

## Architecture

Le projet est découpé en deux repos distincts :

- **Frontend** (`syscard`) — HTML/CSS/JS vanilla hébergé sur GitHub Pages. Zéro framework, zéro bundler. Tout passe par des modules JS chargés dans le navigateur.
- **Backend** (`syscard-api`) — API REST serverless déployée sur Vercel, connectée à un cluster MongoDB Atlas.

```
rpmn0ise.github.io/syscard/   →   syscard-api.vercel.app/api/*   →   MongoDB Atlas
      (GitHub Pages)                  (Vercel Serverless)               (M0 free tier)
```

## Ce que le jeu contient

**Système de cartes**
- 800 cartes réparties en 5 raretés : Common, Uncommon, Rare, Epic, Legendary
- 8 familles thématiques : Virus, Daemon, Hacker, Protocol, Distro, Command, AI/Bot, Hardware
- Chaque carte a des stats (ATK, DEF, SPD) et des capacités passives

**Progression**
- Ouverture de packs (tokens ou coins)
- Système XP / niveaux
- Récompense quotidienne à la connexion
- Quêtes avec objectifs et récompenses

**Combat**
- PvE contre l'IA (3 difficultés : Rookie, Hacker, Elite)
- PvP asynchrone : création de room, rejoindre, soumettre un move, poll du résultat
- Système ELO pour les parties classées
- Tournois avec inscriptions et primes

**Économie**
- Coins et pack tokens séparés
- Boutique avec items rotatifs
- Système de trades entre joueurs (offre/demande par rareté)
- Dust pour recycler les cartes en double

**Backend**
- Auth JWT (register/login, 30 jours)
- Bonus daily automatique à chaque connexion
- Endpoints REST pour chaque feature : `/api/auth`, `/api/user`, `/api/packs`, `/api/shop`, `/api/trades`, `/api/quests`, `/api/tournament`
- CORS géré au niveau de chaque handler et dans `vercel.json`

## Choix techniques

**Pas de framework frontend** — le jeu est un SPA géré manuellement avec un système de screens custom (`screens.js`). Ça évite toute dépendance et le site tourne directement depuis GitHub Pages sans build step.

**Vercel Serverless** — chaque fichier dans `api/` devient une fonction indépendante. Pas de serveur à maintenir, scaling automatique, déploiement sur push. La limite de 10 fichiers JS sur le plan hobby a conditionné l'architecture : tout ce qui touche aux tournois et au PvP est regroupé dans un seul endpoint `/api/tournament` avec un champ `action` pour router.

**MongoDB Atlas M0** — tier gratuit suffisant pour un projet perso. Contrainte : le cluster se met en pause après 60 jours d'inactivité. Contourné avec un cron externe (cron-job.org) qui ping l'API toutes les deux semaines.

## Ce que j'aurais fait différemment

Le routing par `action` dans `/api/tournament` est un hack pour contourner la limite de fichiers Vercel — ça marche mais c'est pas propre. Avec un plan qui autorise plus de fonctions, chaque action aurait son propre endpoint.

Le frontend sans bundler c'est bien pour la simplicité, mais les fichiers JS sont devenus gros (`app.js` à 25k, `battle.js` à 25k). Un minimum de découpage en modules ES natifs aurait aidé à la lisibilité.
