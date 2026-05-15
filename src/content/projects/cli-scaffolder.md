---
title: "CLI Scaffolder — Générateur de projets"
description: "Un outil en ligne de commande pour scaffolder rapidement des projets Node.js, React et Eleventy avec une architecture opinionnée."
date: 2023-11-05
order: 2
status: terminé
year: 2023
tech:
  - Node.js
  - TypeScript
  - Commander.js
  - Inquirer.js
github: "https://github.com/votrenom/scaffolder"
---

## Motivé par la répétition

Je créais souvent les mêmes structures de projet en copiant-collant. J'ai automatisé ça avec un CLI interactif.

## Usage

```bash
npx @votrenom/scaffolder create mon-projet

? Quel type de projet ? (Use arrow keys)
❯ Eleventy (site statique)
  React + Vite (SPA)
  Node.js API (Express)
  Librairie NPM

? TypeScript ? Yes
? Linter (ESLint + Prettier) ? Yes
? Git init ? Yes

✓ Projet créé dans ./mon-projet
✓ Dépendances installées
✓ Git initialisé

cd mon-projet && npm run dev
```

## Ce que ça génère

Selon le choix, le CLI copie des templates depuis un répertoire versionné, substitue les variables (`{{projectName}}`, `{{author}}`), installe les dépendances et initialise git avec un premier commit propre.

## Leçons apprises

- `Inquirer.js` pour les prompts interactifs est excellent mais lourd — à remplacer par `@clack/prompts` pour les nouveaux projets
- La gestion des permissions de fichiers sur Windows vs Unix est un vrai casse-tête
- Toujours tester sur les trois OS depuis le début
