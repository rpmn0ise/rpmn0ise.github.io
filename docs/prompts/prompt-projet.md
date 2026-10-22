# Prompt ChatGPT : générer une page projet

Copie tout ce qui est sous la ligne, colle-le dans ChatGPT, puis ajoute ce que tu sais du projet à la fin (à la place de la dernière section).

Place le fichier obtenu dans `src/contenu/projets/`, nommé `nom-du-projet.md` (voir « Nom du fichier »).

---

Tu m'aides à écrire la page d'un projet pour mon site personnel (pseudo : rpmn0ise, toujours en minuscules). Le site est statique, en français, et chaque projet est un fichier Markdown avec un en-tête (frontmatter) YAML.

## Ce que tu dois produire

Un seul bloc de code Markdown, prêt à coller dans un fichier `.md`, et rien d'autre autour (pas d'introduction, pas de commentaire après le bloc). Si une information manque, pose-moi la question avant d'écrire.

## Frontmatter exact

```yaml
---
title: "Nom du projet"
description: "Une phrase qui dit ce que c'est, 160 caractères maximum."
status: en-cours
year: 2026
tech:
  - Technologie 1
  - Technologie 2
github: https://github.com/utilisateur/depot
demo: https://exemple.fr
featured: true
---
```

Règles du frontmatter :
- `title` (obligatoire) : le nom du projet, entre guillemets doubles.
- `description` (obligatoire) : une phrase factuelle, 160 caractères maximum. Elle apparaît dans la liste des projets.
- `status` : exactement l'une de ces valeurs : `en-cours`, `termine`, `en-pause`, `abandonne`.
- `year` : l'année de début ou de réalisation, en nombre, sans guillemets.
- `tech` : liste des technologies ou outils réellement utilisés.
- `github` et `demo` : URL complètes commençant par `https://`.
- `featured: true` : seulement si je dis que le projet doit apparaître sur l'accueil (3 maximum au total).
- `draft: true` : seulement si je demande un brouillon.
- Supprime toute ligne dont tu n'as pas la valeur : ne laisse aucun champ vide ni aucune valeur inventée.
- Aucun autre champ.

## Structure du texte

- Ne mets jamais de titre de niveau 1 (`#`) : le titre vient du champ `title`.
- Commence par un ou deux paragraphes qui disent ce qu'est le projet et ce que j'y fais.
- Puis, seulement selon ce que je te donne, des sections `##` parmi : `## Pourquoi`, `## Ce que j'y fais`, `## Comment ça marche`, `## Où en est le projet`, `## Liens`.
- Les listes sont courtes. Les blocs de code s'écrivent avec trois accents graves et le langage.
- Les images s'écrivent en HTML avec dimensions : `<img src="/images/fichier.jpg" alt="Description utile" width="1200" height="800">`.

## Ton

- Première personne, français, direct et simple.
- Pas de ton marketing, pas d'adjectifs creux (« innovant », « révolutionnaire »), pas d'emoji.

## Interdit

- N'invente aucun fait, chiffre, date, fonctionnalité, lien ou statistique. Utilise uniquement ce que je te donne.
- Si un détail est nécessaire mais manquant, écris `[À CONFIRMER : ce qu'il faut préciser]` à l'endroit concerné.

## Nom du fichier (à me rappeler en une ligne avant le bloc)

Minuscules, sans accents, mots séparés par des tirets, extension `.md` : par exemple `retour-de-force.md`. L'adresse sera `/projets/retour-de-force/`.

## Ce que je sais du projet

(Écris ici : nom, ce que c'est, ce que tu y fais, technologies, état d'avancement, liens, année.)
