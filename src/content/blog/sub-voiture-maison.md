---
title: "Installer un subwoofer de voiture à la maison"
description: "Alimentation, ampli, caisson, réglages — tout ce qu'il faut pour faire tourner un sub auto chez soi."
date: 2026-05-20
tags:
  - post
  - audio
  - diy
  - car-audio
featured: false
draft: false
---

Utiliser un sub de voiture à la maison, c'est une excellente idée si tu veux de l'infrabass propre pour pas cher. Les subs auto sont conçus pour tenir la pression, souvent bien plus capables que leurs équivalents hi-fi au même prix. Le truc c'est que tout tourne en 12V — donc il faut adapter l'alimentation et la chaîne de signal.

## L'alimentation 12V

C'est le point central. Un sub voiture ne se branche pas directement sur le secteur.

### Option 1 : alimentation ATX récupérée (recommandé)

Une vieille alim de PC fait très bien le job. 500W minimum, 700W+ si ton ampli est gourmand.

Pour forcer le démarrage sans PC :

```bash
# Court-circuiter le fil vert (PS_ON, pin 16) avec n'importe quel fil noir (GND)
# Un trombone ou un bout de fil suffit
```

Les rails 12V jaunes = ta puissance. Les noirs = masse. C'est tout.

Avantage : cheap, souvent dispo en récup, protection intégrée contre les surcharges.

Inconvénient : peut introduire un léger bruit de fond (ripple) — soignable avec un condensateur sur la ligne 12V.

### Option 2 : alimentation de labo 12V

Plus propre électriquement, réglable, avec affichage courant/tension. Utile pour le debug. Mais ça coûte plus cher pour le même résultat final.

---

## L'ampli

Un ampli voiture mono classe D, c'est l'outil le plus adapté. Il accepte du 12V directement et pilote un sub sans transformer.

### Ce qu'il faut regarder

| Critère | Pourquoi |
|---|---|
| Classe D mono | Efficace, peu de chaleur, pensé pour les basses |
| Subsonic filter réglable | Indispensable pour descendre bas sans cramer le sub |
| Low pass filter (LPF) | Pour ne laisser passer que les basses |
| Impédance supportée | 2Ω ou 1Ω si tu veux câbler plusieurs subs |

### Modèles sérieux à des prix corrects

- **Skar Audio RP-1500.1D** — bon rapport puissance/prix, subsonic à 15 Hz
- **Sundown SFB-2000** — pour ceux qui veulent aller loin en infrabass
- **Rockford Fosgate T1500-1bdCP** — qualité build premium, filtre très propre
- Budget serré : **Crunch PX-1000.1** — ça fait le job pour commencer

### Connexion signal

Depuis un PC ou un téléphone :

```
Jack 3.5mm stéréo → adaptateur RCA → entrée RCA de l'ampli
```

Certains amplis ont une entrée haut-parleur (speaker level input) — pratique si ta source n'a pas de sortie RCA.

---

## Le caisson

C'est souvent là que tout se joue. Un bon sub dans un mauvais caisson, ça donne un résultat médiocre.

### Bass-reflex ou clos ?

- **Clos** : son précis, contrôlé, descend moins bas mais plus proprement. Facile à construire.
- **Bass-reflex** : descend plus bas, plus efficace, mais l'accord doit être calculé pour le sub utilisé. C'est ce qu'utilise Sinewave.

Pour du 20-30 Hz comme dans la vidéo → **bass-reflex accordé bas**, volume généreux (60-100L selon le sub).

### Simuler avant de construire

WinISD (Windows/Wine) permet de simuler le comportement du sub dans différents volumes et accords avant de couper le MDF. À utiliser systématiquement.

### Matériaux

- **MDF 19mm** pour les parois — dense, pas de résonance parasite
- Colle à bois + vis — double assemblage
- Joint mousse ou silicone sur toutes les jointures — l'étanchéité est critique

---

## Réglages de l'ampli

Une fois tout branché :

1. **Gain** : commence à zéro, monte doucement jusqu'à ce que la source soit à 80% du volume max sans distorsion
2. **LPF** : 80 Hz pour un sub dédié infrabass, 100 Hz si tu n'as pas d'autres enceintes
3. **Subsonic filter** : règle 5 Hz en dessous de la fréquence d'accord du caisson (ex : accord à 25 Hz → subsonic à 20 Hz)
4. **Bass boost** : laisser à 0 dB — ça sature facilement et ça sert à rien si le caisson est bien conçu

---

## Ce que j'aurais fait différemment

- Pas sauter l'étape WinISD. Construire un caisson à l'œil sans simuler c'est du gâchis de MDF.
- Soigner la masse dès le départ. Un mauvais ground = buzz constant et prise de tête.
- Prévoir un fusible sur le +12V proche de l'alim. Pas négociable.

---

## Schéma récapitulatif

```
[Source audio — PC/téléphone]
         ↓ Jack 3.5 → RCA
     [Ampli mono 12V]
         ↓ câble HP
     [Subwoofer dans caisson]
         ↑
[Alim ATX 12V — fil vert ponté sur masse]
```

Pas besoin d'être électronicien. Avec une alim ATX récupérée et un ampli d'entrée de gamme sérieux, tu peux avoir quelque chose qui joue proprement en dessous de 30 Hz pour moins de 150€.