---
title: "Émuler la Nintendo Switch en 2026 — Ryujinx fork"
description: "Installation et configuration d'un émulateur Switch (fork communautaire de Ryujinx) pour faire tourner les jeux Switch sur PC."
date: 2026-05-18
domain: simulation
tags:
  - gaming
  - émulation
  - switch
  - tips
draft: false
---

> Nintendo a fait retirer Yuzu et Ryujinx officiels. Les forks communautaires prennent le relais — même base de code, développement continu.

## Quel émulateur en 2026

- **Ryujinx fork (Ryubing / Greenland)** — le plus actif, compatibilité excellente
- **Suyu** — fork de Yuzu, moins maintenu

Utiliser le fork Ryujinx. Les releases sont sur GitHub.

## Prérequis

- GPU avec support Vulkan (recommandé) ou OpenGL
- 16 Go RAM minimum pour les gros titres
- Les fichiers `prod.keys` et `title.keys` issus d'une Switch modifiée (obligatoires)
- Les ROMs au format `.nsp` ou `.xci`

## Installation

**1. Télécharger l'émulateur**

Depuis la page GitHub du fork, télécharger la dernière release — un `.zip` portable, pas d'installation requise.

**2. Placer les keys**

Copier `prod.keys` et `title.keys` dans :

```
%APPDATA%\Ryujinx\system\        (Windows)
~/.config/Ryujinx/system/        (Linux)
```

Sans ces fichiers, aucun jeu ne se lance.

**3. Installer le firmware**

Options → Install Firmware → Install from XCI/ZIP. Le firmware Switch se trouve sur [FMHY](https://fmhy.net) dans la section émulation.

**4. Ajouter les ROMs**

Options → Settings → General → Game Directories. Pointer vers le dossier contenant les `.nsp` / `.xci`.

## Configuration recommandée

```
Graphics Backend : Vulkan
Resolution Scale : 2x (si GPU solide) ou 1x
Aspect Ratio : 16:9
VSync : activé
```

Pour les jeux exigeants (Tears of the Kingdom, etc.) activer le shader cache et laisser tourner quelques minutes au lancement — les shaders compilent en temps réel la première fois.

## Trouver les ROMs

[FMHY](https://fmhy.net) → section Gaming → Switch ROMs. Privilégier les sources avec checksums vérifiés.

## Performances typiques

| Jeu | FPS moyen | Notes |
|---|---|---|
| Mario Kart 8 Deluxe | 60 stable | Parfait |
| Zelda TotK | 30-45 | Quelques drops en open world |
| Pokemon Scarlet | 25-35 | Jeu peu optimisé même sur Switch réelle |
| Metroid Dread | 60 stable | Excellent |
