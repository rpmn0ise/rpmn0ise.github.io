---
title: "BeamNG.drive n'est pas un jeu, c'est un laboratoire"
description: "Pourquoi je considère BeamNG comme une plateforme d'expérimentation physique sérieuse, et ce que j'y ai appris sur les systèmes mécaniques que je n'aurais pas appris autrement."
date: 2025-01-10
domain: simulation
tags:
  - post
  - simulation
  - beamng
  - physique
featured: true
---

La plupart des gens voient BeamNG.drive comme le jeu où les voitures se crashent de façon réaliste. C'est techniquement vrai et complètement à côté de l'essentiel.

## Ce que le moteur fait réellement

BeamNG utilise un moteur de physique **soft-body** en temps réel. Chaque véhicule est modélisé comme un réseau de nœuds (masses ponctuelles) reliés par des poutres (ressorts/amortisseurs). Il n'y a pas de hitbox rigide, pas de mesh de collision simplifié — chaque déformation est le résultat direct de la simulation des forces appliquées à chaque nœud individuellement.

Ce qui veut dire que quand une voiture s'écrase contre un mur à 80 km/h, le simulateur ne joue pas une animation de crash pré-calculée. Il résout des milliers d'équations différentielles en temps réel pour déterminer comment chaque partie de la carrosserie se déforme sous la contrainte.

C'est fondamentalement différent de tout ce qu'Assetto Corsa, iRacing ou Forza proposent.

## Ce que j'ai appris sur la suspension

En moddant des véhicules, j'ai dû comprendre les paramètres réels de suspension pour que les comportements soient cohérents :

- **Spring rate** (raideur du ressort) : trop rigide = rebonds non amorties, trop souple = roulis excessif
- **Damper** (amortisseur) : le ratio bump/rebound change complètement le comportement en virage
- **Anti-roll bar** : son interaction avec le différentiel sur les transferts de charge latéraux

J'aurais pu lire ça dans un manuel de mécanique auto. Mais le voir en temps réel, modifier un paramètre et observer immédiatement la conséquence sur le comportement du véhicule — c'est une autre forme de compréhension.

## Le modding comme reverse engineering

Créer un mod dans BeamNG, c'est écrire des fichiers JSON qui décrivent la topologie physique du véhicule. Chaque poutre a une résistance à la tension, une résistance à la compression, un seuil de rupture. Chaque nœud a une masse, une position.

```json
{
  "nodes": [
    ["id", "posX", "posY", "posZ"],
    ["chassis_fr", -0.72, 1.45, 0.32],
    ["chassis_fl",  0.72, 1.45, 0.32]
  ],
  "beams": [
    ["id1", "id2", {"spring": 4500000, "damp": 15000, "deform": 85000}],
    ["chassis_fr", "chassis_fl", {}]
  ]
}
```

C'est du génie civil appliqué à une Japonaise des années 90.

## La limite de la simulation

Ce serait malhonnête de ne pas mentionner ce que BeamNG ne fait pas bien : la dynamique des pneus à haute vitesse reste approximative comparée à des simulateurs dédiés comme Assetto Corsa Competizione. Le modèle thermique des freins est simplifié. Et le comportement aérodynamique est quasi absent sur les véhicules de série.

C'est un outil d'apprentissage sur la structure et la mécanique, pas un outil de préparation à la compétition.

## Pourquoi je continue d'y passer du temps

Parce que c'est l'un des rares softwares qui me permet de **formuler une hypothèse, la tester immédiatement, et observer le résultat** dans un système physique complexe — sans avoir de voiture, d'atelier, ou de budget pour casser du métal réel.

C'est ça, un laboratoire.
