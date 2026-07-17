---
title: "CSS : variables locales dans les composants"
description: "Utiliser les custom properties CSS comme interface de configuration d'un composant, sans modifier son CSS interne."
date: 2024-03-10
domain: creation-numerique
tags:
  - css
  - tips
  - design-system
---

Exposer des variables CSS comme API publique d'un composant :

```css
/* Composant : définit des valeurs par défaut */
.button {
  --btn-bg:      var(--color-primary, #3b82f6);
  --btn-color:   var(--color-on-primary, white);
  --btn-radius:  var(--radius, 6px);
  --btn-padding: 0.5em 1.25em;

  background:    var(--btn-bg);
  color:         var(--btn-color);
  border-radius: var(--btn-radius);
  padding:       var(--btn-padding);
}
```

```css
/* Utilisation : override sans toucher au composant */
.my-special-button {
  --btn-bg: #ef4444;
  --btn-radius: 999px;
}
```

```html
<!-- Ou inline -->
<button class="button" style="--btn-bg: purple; --btn-padding: 1em 2em;">
  Bouton custom
</button>
```

C'est ce que fait shadcn/ui, Radix, et la plupart des Design Systems modernes.
