---
title: "pacman : nettoyer le cache sans tout casser"
description: "Garder les 2 dernières versions des paquets pour pouvoir rollback, supprimer le reste."
date: 2025-01-05
domain: systemes
tags:
  - arch
  - pacman
  - cli
---

Par défaut `pacman` garde toutes les versions téléchargées dans `/var/cache/pacman/pkg/`. Ça prend de la place.

Supprimer tout sauf les 2 dernières versions de chaque paquet (permet de rollback si besoin) :

```bash
paccache -rk2
```

Supprimer uniquement les paquets désinstallés :

```bash
paccache -ruk0
```

Automatiser avec un hook pacman — créer `/etc/pacman.d/hooks/clean-cache.hook` :

```ini
[Trigger]
Operation = Upgrade
Operation = Install
Operation = Remove
Type = Package
Target = *

[Action]
Description = Nettoyage du cache pacman...
When = PostTransaction
Exec = /usr/bin/paccache -rk2
```

`paccache` vient du paquet `pacman-contrib` :

```bash
sudo pacman -S pacman-contrib
```
