---
title: "Le Labo du Jeu Vidéo — ce que j'en retiens"
description: "Retour de lecture sur le livre de Science Étonnante sur la physique et les mathématiques derrière les jeux vidéo. Ce qui m'a surpris, ce qui rejoint mes pratiques, ce qui m'a donné envie de creuser."
date: 2026-05-18
tags:
  - post
  - lecture
  - simulation
  - physique
  - beamng
featured: false
draft: false
---

Je suis tombé sur ce livre sans trop savoir ce que j'allais y trouver. Je connaissais la chaîne YouTube de Science Étonnante — vulgarisation scientifique sérieuse, bien documentée — mais un livre entier sur la physique des jeux vidéo, j'avais des doutes sur la profondeur.

J'avais tort.

## Ce que le livre couvre

Le Labo du Jeu Vidéo explore comment les jeux simulent (ou feignent de simuler) des phénomènes physiques réels — lumière, son, mouvement, collision, fluides. Pas d'un point de vue technique pur, mais en montrant l'écart entre ce qui se passe réellement dans le moteur et ce que le joueur perçoit.

C'est cet écart qui est fascinant. La plupart des "simulations" dans les jeux sont des approximations calculées pour *paraître* justes plutôt que pour *être* justes. Ça marche parce que notre cerveau comble les lacunes.

## Ce qui m'a directement parlé — BeamNG comme contre-exemple

Le chapitre sur la physique des véhicules est celui qui m'a le plus retenu, pour une raison évidente : je passe du temps dans BeamNG.

La majorité des jeux de voiture utilisent des modèles de physique de carrosserie **rigide** — le véhicule est un bloc indéformable avec des points de contact aux roues. C'est suffisant pour simuler la conduite, mais ça ne dit rien sur ce qui se passe quand la structure est soumise à des forces importantes.

BeamNG fait autre chose. Le modèle soft-body que j'utilise au quotidien — les nœuds, les poutres, les seuils de déformation — c'est exactement la distinction que le livre met en avant entre simulation et approximation. BeamNG est l'un des rares jeux grand public à résoudre les équations plutôt qu'à les contourner.

Lire l'explication théorique de ce que je manipule concrètement dans les fichiers JBeam a changé ma façon de voir les paramètres. Quand je règle un `deform` ou un `damp`, je ne tweak plus un chiffre — je fixe une propriété matérielle dans un système d'équations différentielles.

## Ce qui m'a surpris — le son

Je m'attendais à ce que le chapitre audio soit basique. Il ne l'est pas.

La partie sur la propagation sonore dans les jeux — comment les moteurs audio calculent (ou simulent) la réverbération, l'occlusion, l'effet Doppler — m'a rappelé des trucs que je connais du côté car audio mais que je n'avais jamais connectés à l'univers du jeu vidéo.

Un truc concret : la plupart des moteurs de jeu n'implémentent pas de vraie propagation d'onde sonore. Ils utilisent des systèmes de zones et de courbes d'atténuation précalculées. C'est pour ça que le son dans un couloir d'un FPS ne sonne jamais vraiment comme un couloir — les réflexions sont soit absentes soit stéréotypées.

FMOD et Wwise font mieux, mais même là c'est de l'approximation. La vraie acoustique géométrique en temps réel reste trop coûteuse.

## Ce que le livre ne couvre pas

La physique des fluides en temps réel — les simulations de eau, fumée, feu. C'est brièvement mentionné mais pas développé. C'est un sujet à part entière et je comprends le choix éditorial, mais c'est ce qui me manque le plus dans le livre.

Aussi : aucune mention de BeamNG, ce qui est dommage. C'est l'exemple parfait de ce que le livre décrit comme la direction vers laquelle la simulation physique peut aller.

## Pourquoi je le recommande

Pas parce que c'est un livre technique — il ne l'est pas vraiment, c'est de la vulgarisation accessible. Mais parce qu'il donne un cadre pour comprendre *pourquoi* les jeux fonctionnent comme ils fonctionnent, et *où* se situent les compromis entre fidélité physique et jouabilité.

Si tu utilises BeamNG pour autre chose que crasher des voitures, si tu t'intéresses à comment les sons se comportent dans l'espace, ou si tu te demandes pourquoi la lumière dans les jeux a toujours quelque chose d'un peu faux — ce livre répond à ces questions mieux que n'importe quel article que j'ai trouvé en ligne.
