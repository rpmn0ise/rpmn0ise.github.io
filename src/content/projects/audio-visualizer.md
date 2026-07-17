---
title: "Audio Visualizer"
description: "Visualiseur audio temps réel en Next.js, Web Audio API et Canvas 2D. Fichier local ou micro, plusieurs modes de rendu, déployé en statique sur Cloudflare Pages."
date: 2026-05-24
domain: creation-numerique
order: 2
status: en-cours
year: 2026
tech:
  - Next.js 14 (App Router)
  - TypeScript
  - Web Audio API
  - Canvas 2D
  - Cloudflare Pages
  - GitHub Actions
github: "https://github.com/rpmn0ise/audio-visualizer"
demo: "https://audio-visualizer-3qb.pages.dev/"
draft: false
---

## Pourquoi ce projet existe

J'avais envie de visualiser du signal audio dans le navigateur, sans dépendances tierces pour la partie rendu. Web Audio API + Canvas 2D natifs, c'est largement suffisant. Le but était aussi de comprendre comment fonctionne un pipeline audio dans le DOM : `AudioContext`, `AnalyserNode`, FFT, et comment accrocher tout ça à une boucle de rendu à 60 fps sans que React s'en mêle.

## Fonctionnalités

- **Sources audio** : upload local (drag & drop) ou entrée micro
- **Modes de visualisation** : Spectrum Bars · Waveform · Bass Pulse · Combined
- **Palettes** : Cyan · Violet · Amber · Green
- **Thèmes** : Dark · Ultra Dark
- **Plein écran** avec masquage automatique des contrôles
- **Level meters** Bass / Mid / High en temps réel
- Responsive mobile/desktop

## Architecture

### Hook `useAudioAnalyzer`

C'est le cœur du projet. Il contient la machine à états du graphe Web Audio : `AudioContext`, `AnalyserNode` et `GainNode` sont dans des refs — zéro re-render React de ce côté. Seuls les scalaires de bandes de fréquence et l'état de lecture passent dans le state React, cadencés à 60 fps via `setInterval`.

La boucle canvas est ainsi complètement indépendante de la réconciliation React. C'était l'objectif principal : ne pas subir les re-renders pour quelque chose qui tourne à 60 fps en continu.

```typescript
// Exemple simplifié
const analyserRef = useRef<AnalyserNode | null>(null);
const dataArray = useRef<Uint8Array>(new Uint8Array(FFT_SIZE / 2));

const tick = () => {
  analyserRef.current?.getByteFrequencyData(dataArray.current);
  // extraction bass/mid/high depuis dataArray
};
```

### Pattern Strategy pour les renderers

Chaque mode de visualisation est une classe qui implémente `VisualizerRenderer.draw(ctx, data)`. Changer de mode = swapper l'instance, sans ré-initialiser la boucle canvas.

```typescript
// lib/renderers/index.ts
export function createRenderer(mode: VisualizationMode): VisualizerRenderer {
  switch (mode) {
    case 'bars':     return new BarsRenderer();
    case 'waveform': return new WaveformRenderer();
    case 'circle':   return new CircleRenderer();
    case 'combined': return new CombinedRenderer();
  }
}
```

Simple, extensible. Ajouter un nouveau mode = créer une classe, l'enregistrer dans la factory.

### Canvas DPR-aware

Le canvas est dimensionné en multipliant par `devicePixelRatio` pour éviter le flou sur les écrans Retina. Le contexte 2D est pré-scalé, donc tous les appels de dessin travaillent en pixels CSS logiques.

```typescript
const dpr = window.devicePixelRatio || 1;
canvas.width = width * dpr;
canvas.height = height * dpr;
ctx.scale(dpr, dpr);
```

### Export statique

`next.config.js` est configuré avec `output: 'export'`. Le build produit un dossier `/out` pur, sans code serveur. Compatible avec n'importe quel CDN — ici Cloudflare Pages, mais ça passe aussi sur GitHub Pages ou S3 sans modification.

## Structure du projet

```
src/
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
├── components/
│   ├── AudioPlayer/
│   ├── VisualizerCanvas/
│   └── ControlsPanel/
├── hooks/
│   └── useAudioAnalyzer.ts
├── lib/
│   ├── colors.ts
│   └── renderers/
│       ├── BarsRenderer.ts
│       ├── WaveformRenderer.ts
│       ├── CircleRenderer.ts
│       ├── CombinedRenderer.ts
│       └── index.ts
└── types/
    └── index.ts
```

## Déploiement

**Git integration (recommandé)**
1. Push sur GitHub
2. Cloudflare Pages → New project → Connect to Git
3. Build command : `npm run build`
4. Output directory : `out`

**GitHub Actions (CI/CD automatique)**
Secrets à ajouter dans le repo :
- `CLOUDFLARE_API_TOKEN` — token avec permission Pages edit
- `CLOUDFLARE_ACCOUNT_ID` — ID du compte Cloudflare

Chaque push sur `main` déclenche le build et le déploiement.

## État actuel

- [x] Pipeline Web Audio fonctionnel (fichier + micro)
- [x] 4 modes de visualisation
- [x] 4 palettes de couleurs
- [x] Level meters bass/mid/high
- [x] Fullscreen + auto-hide controls
- [x] CI/CD Cloudflare Pages via GitHub Actions
- [ ] Enregistrement/export vidéo du canvas
- [ ] Visualisation sur plusieurs canaux (stéréo L/R séparés)
- [ ] Mode "réactif" paramétrable (seuils, sensibilité) sans recompiler

## Ce que j'aurais fait différemment

Le `setInterval` à 60 fps pour synchroniser le state React avec la boucle canvas — c'est fonctionnel mais pas propre. Idéalement, un `useReducer` avec dispatch depuis `requestAnimationFrame` et une stratégie de batching explicite. Ça éviterait le couplage temporel artificiel entre les deux boucles.

TypeScript strict dès le départ, c'était la bonne décision. Les types sur les données de l'`AnalyserNode` (`Uint8Array` vs `Float32Array` selon la méthode) sauvent pas mal de debugs silencieux.
