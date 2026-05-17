---
title: "BeamNG : recharger un mod sans relancer le jeu"
description: "Raccourci pour itérer rapidement sur un mod sans passer par le menu principal à chaque fois."
date: 2025-02-01
tags:
  - beamng
  - modding
  - tips
---

Pendant le développement d'un mod BeamNG, relancer le jeu à chaque modification est une perte de temps.

## Recharger les assets en live

```
Ctrl + L   → recharge les mods sans quitter la session
F5         → recharge la scène actuelle
```

Pour recharger uniquement le véhicule sélectionné :

```
Ctrl + R   → respawn du véhicule (recharge les valeurs du jbeam)
```

## Workflow de modding efficace

1. Ouvrir le fichier `.jbeam` dans un éditeur (VS Code + extension JSON)
2. Modifier le paramètre (ex: raideur d'un ressort de suspension)
3. `Ctrl + R` dans BeamNG
4. Observer le comportement
5. Répéter

## Valider le JSON avant de recharger

Les erreurs JSON dans un `.jbeam` crashent silencieusement le chargement du véhicule. Valider d'abord :

```bash
python3 -m json.tool mon_fichier.jbeam > /dev/null
```

Si pas d'output = JSON valide. BeamNG utilise un JSON légèrement étendu (commentaires `//` autorisés) donc certains validateurs rejetteront des fichiers valides pour BeamNG — utiliser le validateur Python plutôt qu'un service en ligne.
