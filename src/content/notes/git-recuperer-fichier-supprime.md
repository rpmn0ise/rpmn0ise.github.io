---
title: "Git : récupérer un fichier supprimé dans une branche"
description: "Commande rapide pour retrouver et restaurer un fichier supprimé dans l'historique Git."
date: 2024-03-01
domain: creation-numerique
tags:
  - git
  - cli
  - tips
---

Trouver le commit où le fichier a été supprimé :

```bash
git log --all --full-history -- "chemin/vers/fichier.js"
```

Restaurer le fichier depuis le commit parent :

```bash
git checkout <hash>^ -- "chemin/vers/fichier.js"
```

L'accent circonflexe `^` signifie "parent de ce commit", donc le commit juste **avant** la suppression.
