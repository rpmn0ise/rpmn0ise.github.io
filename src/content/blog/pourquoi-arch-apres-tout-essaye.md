---
title: "Pourquoi je suis resté sur Arch après avoir tout essayé"
description: "J'ai utilisé Ubuntu, Fedora, NixOS, Gentoo et une dizaine d'autres distributions. Voici pourquoi Arch (et CachyOS) est ce sur quoi j'ai fini par stabiliser, et ce que chaque distribution m'a appris."
date: 2025-02-08
domain: systemes
tags:
  - post
  - linux
  - arch
  - systèmes
---

Le distro hopping a mauvaise réputation. On le présente comme une procrastination déguisée en exploration. C'est parfois vrai. Dans mon cas, chaque changement de distribution a appris quelque chose de spécifique que je n'aurais pas appris autrement.

## Ce que chaque distribution enseigne

**Ubuntu / Debian** — la base. Les dépôts stables, le gestionnaire de paquets APT, l'écosystème qui fonctionne sans friction. Ce que ça enseigne : que "ça marche" n'est pas un critère suffisant si tu veux comprendre ce qui se passe en dessous.

**Fedora** — le packaging RPM, SELinux, et une philosophie de mise à jour différente. Fedora m'a appris à apprécier un système opinionné qui fait des choix cohérents. Je ne suis pas toujours d'accord avec ses choix, mais ils sont documentés et défendables.

**NixOS** — le concept de configuration déclarative et reproductible. Théoriquement génial. Pratiquement, la courbe d'apprentissage est brutale et le langage Nix est... particulier. Je comprends l'attrait, je ne suis pas prêt à habiter dedans.

**Gentoo** — compiler depuis les sources, comprendre les USE flags, attendre 6 heures qu'un navigateur compile. Ce que ça enseigne : comment le système est réellement assemblé, et pourquoi les distributions binaires sont un cadeau que tu n'apprécies qu'après les avoir perdues.

## Pourquoi Arch a gagné

Arch n'est pas la distribution la plus facile. Ce n'est pas non plus la plus performante par défaut, ni la plus stable au sens Debian du terme. Ce qui la distingue :

**L'AUR (Arch User Repository)** — l'accès à presque n'importe quel logiciel, maintenu par la communauté, dans un format cohérent. La longue traîne des logiciels que les dépôts officiels ne packagient pas devient accessible en quelques secondes.

**Le rolling release** — pas de migrations de version, pas de "Ubuntu 24.04 → 26.04". Les paquets sont mis à jour en continu. Ça demande de lire les news avant de faire `pacman -Syu` parfois, mais c'est un compromis acceptable.

**Le wiki** — l'Arch Wiki est la meilleure documentation Linux qui existe. Elle est utile même quand tu n'utilises pas Arch. C'est la référence que je consulte sur n'importe quelle distribution.

**La minimalisme de base** — Arch ne décide rien à ta place sur l'environnement de bureau, le display manager, le gestionnaire de son. Tu construis ce que tu veux. Ça prend plus de temps la première fois, mais tu sais exactement ce qui tourne sur ta machine.

## CachyOS : Arch avec des patches de performance

CachyOS est une distribution basée sur Arch qui shippe avec des patches kernel orientés performance (notamment le scheduler BORE et les patches EEVDF), des paquets recompilés avec des flags d'optimisation CPU, et une interface d'installation plus accessible.

Pour du gaming sous Linux ou n'importe quel workload latency-sensitive, la différence est mesurable. Je l'utilise sur ma machine principale, avec Arch vanilla dans des VMs pour les tests.

## Ce que le distro hopping m'a réellement appris

Pas vraiment quelle distribution est "la meilleure". Plutôt : comment les distributions font leurs choix, pourquoi le même logiciel se comporte différemment selon l'environnement, et que la majorité des problèmes Linux viennent de 3 sources : le kernel, les drivers (principalement GPU), et systemd dans ses interactions avec le reste.

Le distro hopping n'est pas une perte de temps si tu l'abordes avec une question précise à chaque fois. "Je veux comprendre comment NixOS gère les dépendances" est une bonne raison. "Je suis ennuyé" en est une moins bonne — même si elle est honnête.
