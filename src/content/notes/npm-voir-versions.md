---
title: "npm : voir toutes les versions d'un paquet"
description: "Commandes utiles pour explorer les versions disponibles d'un paquet npm avant de l'installer."
date: 2024-02-14
tags:
  - npm
  - cli
  - tips
---

Lister toutes les versions publiées :

```bash
npm view <paquet> versions --json
```

Voir uniquement la dernière :

```bash
npm view <paquet> version
```

Voir les infos complètes (dépendances, dist-tags, etc.) :

```bash
npm view <paquet>
```

Installer une version spécifique :

```bash
npm install <paquet>@<version>
# ex: npm install react@18.2.0
```

Voir quelles versions sont installées localement :

```bash
npm list
npm list --depth=0   # sans les sous-dépendances
```
