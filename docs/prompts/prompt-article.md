# Prompt ChatGPT : générer un article du journal

Copie tout ce qui est sous la ligne, colle-le dans ChatGPT, puis ajoute tes idées en vrac à la fin (à la place de la dernière section).

Place le fichier obtenu dans `src/contenu/journal/`, nommé `mon-titre-en-minuscules.md` (voir « Nom du fichier »).

---

Tu m'aides à écrire un article pour mon site personnel (pseudo : rpmn0ise, toujours en minuscules). Le site est statique, en français, et les articles sont des fichiers Markdown avec un en-tête (frontmatter) YAML.

## Ce que tu dois produire

Un seul bloc de code Markdown, prêt à coller dans un fichier `.md`, et rien d'autre autour (pas d'introduction, pas de commentaire après le bloc). Si une information manque, pose-moi la question avant d'écrire.

## Frontmatter exact

```yaml
---
title: "Titre de l'article"
date: AAAA-MM-JJ
description: "Une phrase de 160 caractères maximum, utilisée pour les moteurs de recherche et les aperçus."
tags:
  - tag-un
  - tag-deux
---
```

Règles du frontmatter :
- `title` (obligatoire) : entre guillemets doubles, sans point final.
- `date` (obligatoire) : format `AAAA-MM-JJ`, sans guillemets. Utilise la date du jour si je ne la donne pas.
- `description` (recommandé) : une phrase, 160 caractères maximum, entre guillemets doubles.
- `tags` (recommandé) : de 1 à 4, en minuscules, sans accents, mots séparés par des tirets (`hard-music`, `beamng`). Pour une note courte, utilise le tag `note`.
- Champs facultatifs, à n'ajouter que si je le demande : `image` (chemin du type `/images/fichier.jpg`) et `draft: true` (brouillon, non publié).
- Aucun autre champ.

## Règles du texte

- Ne mets jamais de titre de niveau 1 (`#`) : le titre vient du champ `title`.
- Découpe avec des titres `##`, et `###` si nécessaire. Pas de titre pour un texte très court.
- Pas de gras à outrance : seulement pour ce qui compte vraiment.
- Les blocs de code s'écrivent avec trois accents graves et le langage (```js, ```yaml, ```bash).
- Les images s'écrivent en HTML avec dimensions : `<img src="/images/fichier.jpg" alt="Description utile" width="1200" height="800">`.
- Les listes de tâches sont possibles : `- [x] fait`, `- [ ] à faire`.
- Les liens internes commencent par `/` (ex. `/projets/retour-de-force/`).

## Ton

- Écris à la première personne, en français, de façon directe et simple.
- Pas de ton marketing, pas de formules creuses, pas d'emoji.
- Phrases courtes, concrètes. Je préfère un détail précis à une généralité.

## Interdit

- N'invente aucun fait, chiffre, date, lien, citation ou anecdote. Utilise uniquement ce que je te donne.
- Si un détail est nécessaire mais manquant, écris `[À CONFIRMER : ce qu'il faut préciser]` à l'endroit concerné.
- Ne rajoute pas de conclusion générique ni d'appel à s'abonner.

## Nom du fichier (à me rappeler en une ligne avant le bloc)

Minuscules, sans accents, mots séparés par des tirets, extension `.md` : par exemple `mes-premiers-kicks.md`. L'adresse de l'article sera `/journal/mes-premiers-kicks/`.

## Mes idées pour cet article

(Écris ici tes notes en vrac : sujet, ce qui s'est passé, ce que tu en retiens, éventuellement la date.)
