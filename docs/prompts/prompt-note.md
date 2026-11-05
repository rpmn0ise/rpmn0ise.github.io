# Prompt ChatGPT : générer une note courte (loisirs, coups de cœur, trouvailles)

Pour une note rapide sur un jeu, un morceau, un montage audio, un détail technique, un coup de cœur. Plus court et plus libre qu'un article. Copie tout ce qui est sous la ligne, colle-le dans ChatGPT, puis écris tes idées en vrac à la fin.

Place le fichier obtenu dans `src/contenu/journal/`, nommé `mon-sujet-en-minuscules.md`.

---

Tu m'aides à écrire une note courte pour mon site personnel (pseudo : rpmn0ise, toujours en minuscules). Le site est statique, en français, et les notes sont des fichiers Markdown avec un en-tête (frontmatter) YAML. Mes centres d'intérêt : hard music, jeux vidéo (surtout BeamNG.drive), systèmes audio (basses, car audio), développement web.

## Ce que tu dois produire

Un seul bloc de code Markdown, prêt à coller dans un fichier `.md`, et rien d'autre autour. Si une information manque pour écrire correctement, pose-moi la question avant d'écrire.

## Frontmatter exact

```yaml
---
title: "Titre de la note"
date: AAAA-MM-JJ
description: "Une phrase de 160 caractères maximum."
tags:
  - note
  - jeux-video
---
```

Règles :
- `title` (obligatoire) : entre guillemets doubles, concret, sans point final.
- `date` (obligatoire) : format `AAAA-MM-JJ`, sans guillemets. Utilise la date du jour si je ne la donne pas.
- `description` : une phrase, 160 caractères maximum.
- `tags` : toujours `note` en premier, puis 1 à 3 tags parmi cette liste quand ils conviennent : `musique`, `hard-music`, `fl-studio`, `jeux-video`, `beamng`, `audio`, `car-audio`, `site`. Si aucun ne convient, propose un nouveau tag en minuscules, sans accents, avec des tirets.
- Aucun autre champ, sauf `draft: true` si je demande un brouillon.

## Règles du texte

- Court : de 50 à 200 mots. Un ou deux paragraphes, pas plus de trois.
- Pas de titre de niveau 1 (`#`). Pas de sous-titres, sauf si la note dépasse vraiment 150 mots.
- Les listes et le code ne sont utilisés que si ça aide (une liste de réglages, une commande).
- Les liens internes commencent par `/` (ex. `/projets/retour-de-force/`).

## Ton

- Première personne, français, direct, ni solennel ni forcé. Un peu d'humour est bienvenu s'il vient de moi.
- Pas de ton marketing, pas de formules creuses, pas d'emoji.

## Interdit

- N'invente aucun fait, chiffre, date, nom de matériel, réglage ou anecdote. Utilise uniquement ce que je te donne.
- Si un détail est nécessaire mais manquant, écris `[À CONFIRMER : ce qu'il faut préciser]`.
- Pas de conclusion générique.

## Nom du fichier (à me rappeler en une ligne avant le bloc)

Minuscules, sans accents, tirets, extension `.md` : par exemple `mes-reglages-de-kick.md`. L'adresse sera `/journal/mes-reglages-de-kick/`.

## Mes idées pour cette note

(Écris ici tes notes en vrac.)
