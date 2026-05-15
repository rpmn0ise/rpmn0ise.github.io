---
title: "CSS moderne : les fonctionnalités que j'utilise en 2024"
description: "Container queries, cascade layers, :has(), color-mix()... Le CSS natif n'a jamais été aussi puissant. Tour d'horizon des fonctionnalités qui changent ma façon de coder."
date: 2024-02-08
tags:
  - post
  - css
  - frontend
  - web
---

Le CSS natif a fait des bonds de géant ces deux dernières années. Voici les fonctionnalités que j'utilise réellement en production.

## Container Queries

Fini de dépendre de la taille du viewport pour les composants. Avec les container queries, un composant répond à la taille de **son conteneur** :

```css
.card-wrapper {
  container-type: inline-size;
  container-name: card;
}

@container card (min-width: 400px) {
  .card {
    display: grid;
    grid-template-columns: 200px 1fr;
  }
}
```

C'est révolutionnaire pour les Design Systems.

## La pseudo-classe :has()

Le "parent selector" tant attendu est là :

```css
/* Form valide = champ vert */
.form:has(input:valid) .submit-btn {
  background: green;
}

/* Card avec image = layout différent */
.card:has(img) {
  grid-template-rows: auto 1fr;
}
```

Support : tous les navigateurs modernes depuis 2023.

## Cascade Layers

Les `@layer` permettent de contrôler la cascade CSS sans jouer sur la spécificité :

```css
@layer reset, base, components, utilities;

@layer reset {
  * { box-sizing: border-box; margin: 0; }
}

@layer utilities {
  .sr-only { /* ... */ }
}
```

Les styles dans `utilities` auront toujours la priorité sur `components`, indépendamment de la spécificité.

## color-mix()

Manipuler les couleurs nativement :

```css
:root {
  --accent: #58a6ff;
  --accent-subtle: color-mix(in oklch, var(--accent) 15%, transparent);
  --accent-hover: color-mix(in oklch, var(--accent) 120%, black);
}
```

## Conclusion

Ces fonctionnalités sont toutes disponibles dans les navigateurs modernes (Chrome, Firefox, Safari). Il n'y a plus vraiment de raison d'éviter le CSS natif pour les nouveaux projets.
