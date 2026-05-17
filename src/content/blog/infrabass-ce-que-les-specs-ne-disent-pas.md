---
title: "Infrabass : ce que les specs ne te disent pas"
description: "Fréquence de résonance, déplacement membranaire, puissance thermique — ce que j'ai appris en construisant mes premiers systèmes de grave et pourquoi le chiffre de puissance sur la boîte ne veut rien dire."
date: 2025-01-25
tags:
  - post
  - audio
  - bass
  - diy
---

Quand on commence dans le car audio ou le subwoofer DIY, on regarde les watts. C'est l'erreur que tout le monde fait, moi inclus.

## Le problème avec les watts

Un subwoofer à 1000W RMS ne produit pas deux fois plus de pression acoustique qu'un à 500W. La relation entre puissance électrique et SPL (Sound Pressure Level) est **logarithmique** : pour gagner 3 dB de pression, il faut doubler la puissance. Pour gagner 10 dB — ce qui est perçu comme "deux fois plus fort" — il faut multiplier la puissance par 10.

Concrètement : passer de 500W à 1000W te donne +3 dB. Passer de 500W à 5000W te donne +10 dB. La puissance a des rendements décroissants très rapides.

Ce qui compte réellement :

**L'efficacité (sensibilité)** — exprimée en dB/W/m. Un woofer à 90 dB/W/m alimenté avec 100W produit 110 dB à 1m. Un woofer à 85 dB/W/m a besoin de 316W pour le même résultat.

**Le déplacement (Xmax et Sd)** — la quantité d'air déplacée. Pour les basses fréquences, c'est ça qui fait la pression, pas la puissance. `Volume d'air = Sd × Xmax`. Un woofer avec un grand diamètre et un long débattement peut reproduire des infrasons avec moins de puissance qu'un petit woofer poussé à fond.

## Fréquence de résonance : pourquoi ça change tout

Chaque haut-parleur a une fréquence de résonance libre (Fs). En dessous de Fs, le haut-parleur ne joue plus — il consomme de l'énergie sans produire de pression utile, et chauffe.

Dans une enceinte close, Fs monte. Dans un bass-reflex accordé correctement, l'évent prend le relais autour de l'accord. Le choix du type d'enceinte dépend directement de ce que tu veux descendre en fréquence et de ce que le woofer peut physiquement faire.

J'ai appris ça en simulant des enceintes avec **WinISD** avant de couper du MDF. Simuler d'abord, construire ensuite — j'aurais économisé du bois et du temps si j'avais commencé par là.

## Ce que le rebassage révèle

Le rebassed (l'ajout de fréquences graves synthétiques sur des tracks US rap) est souvent méprisé dans les cercles audiophiles sérieux. Je comprends pourquoi, et je m'en fous.

Ce qui m'intéresse dans le rebassage c'est ce qu'il révèle sur le système : un sub qui joue proprement du 20 Hz rebassé sans distorsion visible, sans claquement mécanique, c'est un système qui a de la marge. C'est un test de stress.

Et honnêtement, 20 Hz à 110 dB dans un habitacle, c'est une expérience physique difficile à reproduire autrement.

## Ce que je ferais différemment

Si je recommençais : moins regarder les watts, plus regarder le `Vas`, le `Qts` et le `Fs`. Simuler avant de commander. Et accepter que le gain le plus important ne vient pas du subwoofer lui-même, mais de **la conception de l'enceinte et du placement dans l'espace**.

L'acoustique de salle (ou d'habitacle) annule ou amplifie les fréquences de façon qui dépasse souvent l'apport de n'importe quel upgrade hardware. C'est frustrant, mais c'est la réalité.
