# Idées de premiers contenus (avec les questions à remplir)

Mode d'emploi, en 3 étapes :

1. Choisis une idée ci-dessous.
2. Ouvre le prompt de base indiqué (`prompt-note.md` ou `prompt-article.md`), copie tout ce qui est sous la ligne dans ChatGPT.
3. À la place de « Mes idées pour cette note/cet article », colle le bloc de l'idée avec **tes réponses** aux questions. Les réponses courtes et en vrac suffisent. Si tu ne sais pas, écris « ne sais pas » : l'IA mettra `[À CONFIRMER]`.

Les prompts de base interdisent déjà d'inventer. Garde les réponses vraies, même modestes : c'est ce qui rend les textes personnels.

Place le fichier obtenu dans `src/contenu/journal/`. Un article de journal déjà présent : « Pourquoi ce site, et pourquoi de zéro » (exemple de ton).

---

## 1. Produire de la hard music avec un casque et des enceintes home cinéma

Base : `prompt-note.md` · tags : `note`, `fl-studio`, `musique` · fichier : `produire-avec-peu-de-materiel.md`

```
Sujet : produire sans matériel de studio.
Questions à remplir :
- Depuis quand je produis, et pourquoi FL Studio ?
- Comment je mixe au casque (Soundcore Life Q30), et comment je vérifie avec les enceintes Samsung HT-Z120 et d'autres enceintes ?
- Qui me donne son avis sur mes sons, et comment ça m'aide ?
- Une erreur ou une surprise que j'ai eue en mixant (le sub, les kicks, les aigus…) :
- Ce que je ferais en premier si j'avais un peu de budget :
```

## 2. Pourquoi j'ai créé Hard Music FR

Base : `prompt-article.md` · tags : `projet`, `hard-music` · fichier : `pourquoi-hard-music-fr.md`

```
Sujet : l'histoire de la communauté Discord Hard Music FR, racontée à la première personne (sans refaire la page projet).
Questions à remplir :
- Qu'est-ce qui m'a donné envie de la créer (début août 2026) ?
- Quel a été le moment le plus dur ou le plus drôle depuis le lancement ?
- Ce que j'ai appris à accueillir les membres un par un :
- Ce que je referais autrement :
- Ce que j'aimerais pour la suite (sans promesse) :
```

## 3. Comment j'ai construit ce site

Base : `prompt-article.md` · tags : `site`, `eleventy` · fichier : `comment-ce-site-est-construit.md`

```
Sujet : les choix techniques de ce site, expliqués simplement.
Faits à utiliser tels quels : site statique Eleventy, Markdown, hébergé sur Cloudflare Pages, thème clair et sombre, en français, aucune base de données. L'indicateur d'écoute vient de l'API Last.fm appelée depuis le navigateur, sans serveur. Les pochettes sont récupérées depuis plusieurs sources. La citation de l'accueil est tirée au hasard dans un fichier JSON. La page 404 affiche un message au hasard.
Questions à remplir :
- Pourquoi je voulais un site simple à maintenir :
- Ce qui m'a le plus surpris ou posé problème :
- Ce que l'IA m'a aidé à faire, et ce que j'ai décidé moi-même :
```

## 4. Ma façon de jouer à BeamNG

Base : `prompt-note.md` · tags : `note`, `beamng`, `jeux-video` · fichier : `ma-facon-de-jouer-a-beamng.md`

```
Sujet : réaliste, balade, drift, derby : comment je passe de l'un à l'autre dans BeamNG.
Questions à remplir :
- Ce qui me plaît le plus dans chaque mode (réaliste, balade, drift, derby) :
- Avec quoi je joue (volant Logitech G29, clavier ou manette) et pourquoi :
- Un moment de jeu dont je me souviens :
- Le rapport avec Retour de Force :
```

## 5. Mon projet car audio : où j'en suis

Base : `prompt-note.md` · tags : `note`, `car-audio`, `audio` · fichier : `projet-car-audio.md`

```
Sujet : un projet pas encore commencé, raconté honnêtement. Ne rien dire sur ma voiture.
Questions à remplir :
- Pourquoi un rendu équilibré avec de bonnes basses :
- Ce que j'ai déjà appris en me renseignant (notions, termes, pièges) :
- Comment j'économise, et quelle est la première étape :
- Ce que je veux comprendre avant d'acheter :
```

## 6. Les morceaux hard music du moment

Base : `prompt-note.md` · tags : `note`, `musique`, `hard-music` · fichier : `morceaux-du-moment.md`

```
Sujet : 3 à 5 morceaux que j'écoute en boucle en ce moment, avec ce que j'y entends (kicks, tempo, structure, drop).
Pour chaque morceau : titre, artiste, ce qui m'accroche, une phrase honnête (ce que j'aime moins ou ce qui m'a surpris).
Lien vers la playlist : https://open.spotify.com/playlist/7CqRoiaINCWw4tU3Pp2sFO
```

---

## Ordre conseillé

1. **Idée 3** : les faits sont déjà connus, elle présente le site.
2. **Idée 1** : ton sujet le plus personnel.
3. **Idée 6** : courte, facile, elle relie le journal à la page Musique.
4. Puis 2, 4 et 5 quand tu as de quoi raconter.

Avant de publier, relis chaque texte : les faits doivent être vrais, le ton doit être le tien, et aucune info privée (voiture, adresse) ne doit apparaître. Le build refuse un article sans titre ou sans date, et masque ceux marqués `draft: true`.
