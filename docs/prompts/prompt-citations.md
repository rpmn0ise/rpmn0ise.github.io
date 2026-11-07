# Prompt IA : générer 100 citations pour l'accueil

À coller dans ChatGPT ou Claude (de préférence avec la recherche web activée). L'IA répond en 4 lots de 25. Tu colles ensuite les 4 tableaux JSON dans `src/donnees/citations.json` (un seul tableau `[ … ]`, une virgule entre le dernier élément d'un lot et le premier du suivant).

**Avant de publier, fais vérifier chaque citation** : les IA inventent des attributions avec aplomb. Apporte-moi le fichier et je vérifie chaque citation par recherche, en te signalant celles qui sont douteuses.

---

Tu m'aides à préparer 100 citations en français pour la page d'accueil de mon site personnel (pseudo : rpmn0ise). Une citation s'affiche au hasard à chaque chargement de la page, sous mon nom, en grand, avec son auteur et sa source.

## Ce que tu dois produire

Réponds en **4 lots de 25 citations**. Fais uniquement le lot 1 maintenant ; je te dirai « suite » pour chaque lot suivant. Pour chaque lot, réponds avec **un seul bloc de code JSON**, rien avant, rien après.

Répartition sur les 100 (indicative) :
- 20 de philosophie, de morale ou d'esprit, auteurs classiques (Montaigne, Pascal, La Rochefoucauld, Voltaire, Camus, etc.).
- 20 de littérature et de poésie (Hugo, Baudelaire, Rimbaud, Prévert, etc.).
- 15 d'humour, de répliques ou de phrases drôles dont l'auteur est certain.
- 15 sur la création, le travail, l'apprentissage, la persévérance.
- 10 de sciences et de techniques (Pasteur, Curie, Poincaré, Turing, etc.).
- 10 sur la musique, le son, la culture électronique (artistes, compositeurs, écrits sur la musique).
- 10 de cinéma, de séries ou de jeux vidéo francophones (répliques courtes et célèbres).

## Format exact

```json
[
  {
    "texte": "Je pense, donc je suis.",
    "auteur": "René Descartes",
    "source": "Discours de la méthode, 1637"
  }
]
```

- `texte` : la citation seule, sans guillemets autour. **140 caractères maximum**, de préférence moins de 110.
- `auteur` : prénom et nom, ou le nom connu de la personne (ou du personnage et de l'œuvre pour une réplique).
- `source` : l'œuvre (titre, et année si tu la connais avec certitude). Pour une traduction, écris « trad. » avec le traducteur si tu le connais.
- JSON strictement valide : guillemets doubles, pas de virgule finale, pas de commentaire, UTF-8.
- Apostrophe droite (`'`) comme dans le reste du site. Un espace normal avant `:`, `;`, `!` et `?` (le site met l'espace insécable lui-même).

## Règles de fiabilité (les plus importantes)

1. **Zéro invention.** N'inclus une citation que si tu es certain de l'auteur, de la formulation exacte et de l'œuvre d'origine. Si tu hésites sur un mot, une date ou la source, **ne la mets pas** et choisis-en une autre.
2. **Pas de citations apocryphes** : ni les phrases « attribuées à » sans source (Einstein, Churchill, Gandhi, Mark Twain, Confucius…), ni les formules célèbres mal attribuées (par exemple « Je ne suis pas d'accord avec ce que vous dites, mais je me battrai pour que vous ayez le droit de le dire », qui n'est pas de Voltaire).
3. **Pas de citation tirée d'un livre de développement personnel, d'un site de « citations inspirantes » ou d'un réseau social** sans œuvre d'origine identifiable.
4. Si tu as accès au web, **vérifie chaque citation** dans une source fiable (le texte de l'œuvre, Wikisource, Gallica, Wikiquote avec référence précise) avant de l'inclure.
5. **Paroles de chansons** : maximum 5 sur les 100, un seul vers court, exact au mot près, avec l'artiste et le titre. Si tu n'es pas sûr à 100 % des paroles, ne la mets pas.
6. **Droits** : privilégie les auteurs du domaine public (mort depuis plus de 70 ans) pour au moins les deux tiers. Pour les autres, reste sur des extraits courts.
7. Langue : français d'origine, ou traduction française établie et identifiable. Pas de citation anglaise.
8. Pas plus de **3 citations par auteur** sur l'ensemble. Évite les doublons et les citations déjà données dans un lot précédent.
9. Pas de propos haineux, de citation d'un auteur dont l'usage serait polémique sans raison, ni de contenu politique partisan.

## Ton

Je cherche un mélange : des phrases qui font réfléchir, d'autres qui font sourire, certaines qui donnent envie de créer ou de s'entêter. Pas de clichés motivationnels, pas de phrase creuse.

Commence par le lot 1 (25 citations).
