---
title: "Reddit Base64 Decoder"
description: "Userscript qui détecte et décode automatiquement le Base64 dans les posts et commentaires Reddit, avec rendu des URLs cliquables."
date: 2025-05-22
domain: creation-numerique
order: 1
status: en-cours
year: 2025
tech:
  - JavaScript
  - Tampermonkey
  - MutationObserver API
  - DOM TreeWalker
github: "https://github.com/rpmn0ise/reddit-base64-decoder"
install: "https://github.com/rpmn0ise/reddit-base64-decoder/raw/refs/heads/main/reddit-base64-decoder.user.js"
draft: false
---

[⬇ Installer le script](https://github.com/rpmn0ise/reddit-base64-decoder/raw/refs/heads/main/reddit-base64-decoder.user.js){.btn}

> Nécessite [Tampermonkey](https://www.tampermonkey.net/) ou [Violentmonkey](https://violentmonkey.github.io/).

## Pourquoi ce projet existe

Sur Reddit, certains posts — notamment dans des subs liés à la sécu, au modding ou au partage de configs — contiennent des chaînes Base64 en clair dans le texte. Pour lire le contenu, il faut copier, aller sur un décodeur en ligne, coller. Trois étapes inutiles.

Le deuxième problème : Reddit n'auto-linke pas toujours les URLs dans les commentaires. Du texte brut `https://...` qui ne clique pas, c'est du bruit.

Ce script règle les deux en une passe.

## Ce que ça fait

- Détecte les chaînes Base64 (≥ 16 chars, ratio alphanumérique correct) dans tous les nœuds texte
- Décode à la volée et affiche le résultat derrière un bouton toggle — rien ne s'impose visuellement si tu n'en veux pas
- Filtre les faux positifs : vérifie que le résultat décodé est lisible (≥ 60% de caractères imprimables)
- Transforme les URLs brutes en `<a>` cliquables, y compris dans le contenu décodé
- Fonctionne sur le nouveau Reddit (Shreddit), l'ancien (`old.reddit.com`) et les variantes mobile

## Aperçu (Before / After)

| Avant | Après |
| :---: | :---: |
| <img width="450" alt="Avant" src="https://github.com/user-attachments/assets/20507b43-4fe1-4137-b217-3c404f5ed035" /> | <img width="450" alt="Après 1" src="https://github.com/user-attachments/assets/b125ae51-0957-4f2d-b6ad-b656f2cbdf92" /><br><br><img width="450" alt="Après 2" src="https://github.com/user-attachments/assets/28cb0cb5-1867-45dd-9caa-9356fede65f0" /> |


## Choix techniques

**TreeWalker plutôt qu'un `querySelectorAll` sur le texte**  
Je marche sur les nœuds texte directement, c'est plus propre que d'aller parser le `innerHTML` en string et de tout réinjecter. Moins de risques de casser le DOM existant.

**MutationObserver + debounce à 400ms**  
Reddit charge le contenu dynamiquement (infinite scroll, ouverture de threads). Sans observer les mutations, le script ne tourne que sur le DOM initial et rate tout ce qui arrive après. Le debounce évite de tout reprocesser à chaque micro-mutation.

```javascript
const observer = new MutationObserver(mutations => {
  let hasNew = false;
  for (const mut of mutations) {
    for (const node of mut.addedNodes) {
      if (node.nodeType === Node.ELEMENT_NODE) { hasNew = true; break; }
    }
    if (hasNew) break;
  }
  if (!hasNew) return;
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(processAll, 400);
});
```

**Toggle au lieu d'un remplacement inline**  
Remplacer la chaîne Base64 brute par son décodé directement dans le texte, c'est perturbant à la lecture si le contexte original a de l'importance. Le bouton Afficher/Masquer laisse le choix.

**Filtre sur le décodé**  
`atob()` ne plante pas sur n'importe quoi — il accepte des chaînes qui donnent des résultats binaires illisibles. Le test du ratio de caractères imprimables coupe la majorité des faux positifs (IDs, hashes, tokens).

```javascript
function tryDecodeBase64(str) {
  try {
    const decoded = atob(str.padEnd(Math.ceil(str.length / 4) * 4, '='));
    let printable = 0;
    for (let i = 0; i < decoded.length; i++) {
      const c = decoded.charCodeAt(i);
      if ((c >= 32 && c <= 126) || c === 9 || c === 10 || c === 13) printable++;
    }
    if (printable / decoded.length < 0.6) return null;
    if (!/[a-zA-Z0-9 ]/.test(decoded)) return null;
    return decoded;
  } catch { return null; }
}
```

## État

- [x] Détection Base64 + décodage
- [x] Rendu URLs cliquables
- [x] Support nouveau Reddit / old Reddit
- [x] MutationObserver pour contenu dynamique
- [x] Filtre faux positifs
- [ ] Option pour décoder automatiquement sans toggle (paramètre en haut du script)
- [ ] Détecter le Base64 encodé en URL (`%2B`, `%2F`, `%3D`)
- [ ] Support des subreddits privés / Reddit Preview

## Ce que j'aurais fait différemment

Le sélecteur CSS pour cibler les zones de contenu Reddit est fragile — Reddit change ses noms de classes régulièrement. Un fallback sur `document.body` est en place mais c'est du rustine. La bonne approche serait de cibler des attributs `data-*` stables ou des rôles ARIA plutôt que des classes.

Le regex Base64 actuel peut encore rater des chaînes sans padding, ou en attraper trop dans certains contextes (ex : URLs en Base64url sans `+` ni `/`). À affiner si des faux positifs remontent.
