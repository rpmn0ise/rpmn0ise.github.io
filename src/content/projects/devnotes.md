---
title: "DevNotes — Application de prise de notes"
description: "Une application minimaliste de prise de notes pour développeurs, avec support Markdown, syntax highlighting et export en PDF."
date: 2024-01-10
order: 1
status: actif
year: 2024
tech:
  - TypeScript
  - React
  - Node.js
  - SQLite
  - Vite
github: "https://github.com/votrenom/devnotes"
demo: "https://devnotes.votresite.fr"
---

## Contexte

J'avais besoin d'une application de notes légère, sans compte obligatoire, sans synchronisation cloud imposée, avec un bon support du Markdown et du code.

## Fonctionnalités

- **Éditeur Markdown** avec prévisualisation temps réel
- **Syntax highlighting** pour plus de 100 langages
- **Tags et recherche** full-text rapide
- **Export PDF** via l'API d'impression du navigateur
- **Stockage local** (SQLite via better-sqlite3)
- **Mode sombre** natif

## Architecture

```
src/
├── client/        # React app (Vite)
│   ├── components/
│   ├── hooks/
│   └── store/     # Zustand
└── server/        # API Express
    ├── routes/
    └── db/        # SQLite + Drizzle ORM
```

## Difficultés rencontrées

La synchronisation de l'état éditeur ↔ prévisualisation en temps réel avec de bonnes performances a été le principal défi. J'ai finalement utilisé un `debounce` de 150ms et une bibliothèque de diffing côté DOM pour éviter les re-renders complets.

## Prochaines étapes

- [ ] Synchronisation optionnelle via WebDAV
- [ ] Plugin Vim mode
- [ ] Application desktop (Electron ou Tauri)
