---
title: "Iron Nest — Calculateur Balistique"
description: "Calculateur balistique externe pour IRON NEST: Heavy Turret Simulator. Saisie au pavé numérique, calcul instantané de l'élévation requise, zéro clic — conçu pour le deuxième écran pendant les opérations de combat."
date: 2026-06-01
order: 3
status: actif
year: 2026
tech:
  - HTML vanilla
  - JavaScript vanilla
  - CSS vanilla
github: "https://github.com/rpmn0ise/iron-nest-ballistic"
demo: "https://iron-nest-calculator.pages.dev/"
draft: false
---

## Le jeu : IRON NEST: Heavy Turret Simulator

**IRON NEST: Heavy Turret Simulator** est un simulateur d'artillerie dieselpunk développé par Nick Nieuwodt et Dominik Latos, attendu sur Steam pour le 3ème trimestre 2026 (démo disponible dès maintenant).

Le principe : vous êtes opérateur d'une tourelle de guerre colossale. Enfermé dans le métal, entouré de tuyauterie, d'engrenages et de mécanismes hydrauliques, vous recevez des coordonnées du Haut Commandement, les transcrivez sur votre carte tactique intégrée, calculez l'élévation requise via le calculateur balistique embarqué, orientez manuellement vos canons à la roue hydraulique — et ouvrez le feu.

Tout est diegétique. Pas d'interface superposée propre. Le calculateur balistique existe physiquement dans le cockpit de la tourelle : un cadran mécanique où vous tournez des roues graduées pour saisir la distance, sélectionner les charges propulsives et lire l'élévation calculée. L'immersion est totale. L'efficacité, moins.

## Pourquoi un outil externe

Le calculateur intégré à IRON NEST est une pièce maîtresse du réalisme du jeu — tourner les roues physiques dans le cockpit, aligner les graduations à la main, sentir la machine répondre. Mais en conditions de combat haute intensité, ce processus mécanique coûte des secondes qui font la différence entre un tir ajusté et une contre-batterie ennemie qui passe.

Ce calculateur externe ne remplace pas l'expérience du jeu — il la complète. Posé sur le deuxième écran pendant que l'action se déroule sur le principal, il absorbe la partie calcul pour que tu puisses te concentrer sur la coordination, la correction de tir et la survie de ta tourelle.

Tu saisis la distance et l'azimut au pavé numérique. Tu lis l'élévation. Tu tournes les roues dans le jeu. C'est tout.

## Logique mathématique

IRON NEST utilise une table de tir segmentée en **6 paliers de charges propulsives (P.C.)**, chacun couvrant une tranche de 5 km. Le jeu applique une interpolation linéaire dynamique entre des bornes kilométriques fixes.

Ce calculateur reproduit fidèlement cet algorithme :

1. **Sélection du palier** — `P.C. = Math.ceil(distance / 5)`
2. **Borne inférieure** — identification de la borne kilométrique enregistrée immédiatement inférieure à la position cible
3. **Calcul du delta** — écart exprimé en tranches de 10 mètres (0.01 km)
4. **Interpolation** — `élévation = base + (delta × coefficient_du_palier)`

Exemple concret pour une cible à 5.33 km : borne de base à 5.1 km (30.60°) + (23 tranches de 10 m × 0.06°) = **31.98°**. Concordance parfaite au centième de degré avec l'affichage du jeu.

## Fonctionnalités

**Zéro clic requis** — le calcul se déclenche à chaque frappe (`oninput`). Tu ne quittes jamais le clavier.

**Double thème tactique** — *Mode Bunker* (sombre, vert radar haute visibilité) pour les opérations de nuit, *Mode État-Major* (clair, finition carte rétro papier) pour la planification.

**Internationalisation** — bascule instantanée FR/EN sans rechargement, pour les équipages mixtes.

**Architecture légère** — un seul fichier `index.html` autonome, zéro dépendance externe, zéro framework. Tu l'ouvres dans le navigateur depuis [iron-nest-calculator.pages.dev](https://iron-nest-calculator.pages.dev/), tu glisses la fenêtre sur ton deuxième écran, c'est opérationnel.

## Usage en conditions réelles

1. Ouvrir [iron-nest-calculator.pages.dev](https://iron-nest-calculator.pages.dev/) dans le navigateur, glisser la fenêtre sur le deuxième écran
2. Recevoir les coordonnées cible depuis le Haut Commandement (carte tactique en jeu ou spotteurs)
3. Saisir la **distance** (km) et l'**azimut** (degrés) au pavé numérique dans le panneau gauche
4. Lire immédiatement dans le panneau droit : charges propulsives requises, élévation exacte du canon, azimut tourelle
5. Saisir ces valeurs dans le cockpit IRON NEST et ouvrir le feu

## Choix techniques

Le site est hébergé sur Cloudflare Pages — disponible instantanément depuis n'importe quel navigateur sans installation, sans `npm install`, sans build local. Un outil de combat doit être accessible en deux secondes, pas en dix minutes de setup.

L'interpolation est implémentée à la main depuis les données réelles de la table de tir du jeu, vérifiée cas par cas contre l'affichage en jeu. Le fichier pèse moins de 50 Ko et reste lisible par n'importe quel contributeur sans outillage particulier.
