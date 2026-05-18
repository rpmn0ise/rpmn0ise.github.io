---
title: "Reddit Base64 Decoder — Userscript"
description: "Un userscript qui détecte et décode automatiquement les chaînes Base64 sur Reddit, en remplaçant le texte encodé par du contenu lisible directement dans la page."
date: 2025-01-01
order: 1
status: actif
year: 2025
tech:
  - JavaScript
  - Userscript
  - MutationObserver
  - Violentmonkey
github: "https://github.com/rpmn0ise/reddit-base64-decoder"
demo: "https://github.com/rpmn0ise/reddit-base64-decoder/raw/refs/heads/main/reddit-base64-decoder.user.js"
---

## Pourquoi ce projet existe

Sur certains subreddits, les liens et textes sont partagés encodés en Base64 — parfois pour contourner des filtres automatiques, parfois par convention communautaire. Le problème : décoder manuellement à chaque fois via un outil externe est une friction inutile.

Ce userscript élimine cette friction : il détecte, décode et remplace le texte encodé directement dans la page, sans action de l'utilisateur.

Avant :

```
aHR0cHM6Ly9tb2RzZmlyZS5jb20vOXRlOFc3NTRMdWs3Q0JU
```

Après (automatiquement, dans la page) :

```
https://modsfire.com/9te8W754Luk7CBT
```

Et si le résultat décodé est une URL, elle devient un lien cliquable.

## Ce que le script fait techniquement

La détection repose sur une regex qui cible les chaînes correspondant au format Base64 valide (caractères `A-Z`, `a-z`, `0-9`, `+`, `/`, padding `=`) au-dessus d'une longueur minimale pour éviter les faux positifs sur des mots courts qui seraient accidentellement valides en Base64.

```javascript
const BASE64_REGEX = /\b([A-Za-z0-9+/]{20,}={0,2})\b/g;
```

Le remplacement utilise `atob()` natif du navigateur. Si le décodage produit une URL valide, le texte est remplacé par un `<a href="...">` cliquable.

Le point le plus intéressant techniquement : Reddit charge son contenu de façon dynamique (React). Un simple script qui tourne à la fin du chargement de la page manquerait tous les posts/commentaires chargés après le scroll. La solution est un **MutationObserver** qui surveille les modifications du DOM et applique le décodage sur chaque nouveau nœud inséré.

```javascript
const observer = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    mutation.addedNodes.forEach((node) => {
      if (node.nodeType === Node.ELEMENT_NODE) {
        decodeBase64InElement(node);
      }
    });
  });
});

observer.observe(document.body, { childList: true, subtree: true });
```

## Installation

Nécessite **Violentmonkey** ou **Tampermonkey** (extensions navigateur de gestion de userscripts).

👉 [Installer le script](https://github.com/rpmn0ise/reddit-base64-decoder/raw/refs/heads/main/reddit-base64-decoder.user.js) — cliquer ouvre directement le dialogue d'installation dans Violentmonkey.

## Ce que j'aurais fait différemment

La regex de détection génère encore quelques faux positifs sur des identifiants alphanumériques longs (IDs de commits Git, tokens, etc.) qui sont techniquement décodables en Base64 mais ne sont pas du Base64 intentionnel. Un heuristique sur le résultat décodé (vérifier que le contenu est de l'UTF-8 lisible) réduirait ce bruit.

C'est dans la liste des améliorations.
