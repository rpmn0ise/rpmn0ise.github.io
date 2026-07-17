---
title: "WinISD : simuler une enceinte en 5 minutes"
description: "Workflow minimal pour simuler le comportement d'un subwoofer dans une enceinte close ou bass-reflex avant de couper du MDF."
date: 2025-01-18
domain: ingenierie
tags:
  - audio
  - diy
  - outils
---

**WinISD** (gratuit, Windows/Wine) est le logiciel de référence pour simuler des enceintes.

## Workflow minimal

1. Récupérer les paramètres Thiele-Small du woofer (fiche produit du fabricant)
2. Dans WinISD : New Project → entrer Fs, Qts, Vas, Xmax, Sd, Re
3. Choisir le type d'enceinte : Closed / Vented (bass-reflex)
4. Entrer le volume de la caisse (litres)
5. Observer la courbe de réponse en fréquence

## Ce qu'il faut regarder

- **La fréquence de coupure (-3dB)** : jusqu'où descend l'enceinte
- **La courbe Xmax** : à quel niveau le woofer atteint ses limites mécaniques
- **La courbe thermique** : puissance que la bobine peut absorber

## Pour le bass-reflex

Après avoir entré le volume, entrer aussi la fréquence d'accord de l'évent (Fb). WinISD calcule automatiquement les dimensions du port (diamètre + longueur).

En dessous de Fb, le woofer n'est plus chargé par l'évent — il faut un filtre passe-haut hardware pour protéger la bobine.

## Alternative en ligne

[**Speaker Workshop Online**](https://speakerworkshop.com) pour des simulations rapides sans installer quoi que ce soit.
