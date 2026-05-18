---
title: "Car audio build — Focus sur l'infrabass"
description: "Conception et installation d'un système car audio orienté grave profond : choix du subwoofer, design de l'enceinte, amplification et tuning à l'oreille + mesures REW."
date: 2024-11-20
order: 3
status: actif
year: 2024
tech:
  - WinISD (simulation)
  - REW (Room EQ Wizard)
  - DSP Alpine
  - Menuiserie MDF
---

## Objectif

Reproduction propre et linéaire entre 20 et 80 Hz dans un habitacle de berline compacte. Pas du SPL pur — de la qualité sur la plage infrasonique avec une réserve de niveau suffisante pour le rebassed.

## Matériel retenu

Après simulation sur WinISD avec plusieurs configurations :

- **Subwoofer** : 12" avec Fs bas (< 28 Hz) et Xmax confortable
- **Enceinte** : bass-reflex 45L accordé à 25 Hz
- **Amplification** : monoblock classe D, 500W RMS sur 4Ω
- **DSP** : traitement actif pour le crossover et la correction de réponse

Le choix du bass-reflex sur du close est motivé par le rendement en dessous de 30 Hz — l'enceinte close aurait demandé beaucoup plus de puissance pour le même niveau.

## Design de l'enceinte

Volume simulé : 45L net (après déduction du volume du woofer et du port).

Port : circulaire 100mm de diamètre, longueur calculée par WinISD pour un accord à 25 Hz.

Matériau : MDF 19mm, renforts internes pour éviter les résonances de panneau.

## Tuning

Processus en cours — mesures avec REW + micro de mesure pour identifier les modes de résonance de l'habitacle et appliquer les corrections EQ appropriées.

La bosse classique autour de 60-80 Hz dans les habitacles compacts est un problème de modes de salle (habitacle), pas d'amplification.

## État

- [x] Simulation et choix du matériel
- [x] Construction de l'enceinte
- [x] Installation et câblage
- [ ] Mesures REW et calibration DSP
- [ ] Documentation finale avec courbes de réponse
