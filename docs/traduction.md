# Traduire et mettre à jour les contenus (FR → EN)

Ce document explique tout le fonctionnement de la version anglaise : où sont les fichiers, comment traduire un nouveau contenu, quoi faire quand tu modifies un texte français, comment savoir ce qui manque, et le prompt à donner à Claude. Le résumé technique est aussi dans le `README.md` (section « Français et anglais »).

**Principe** : le site est en français par défaut (`/`) et en anglais (`/en/`). Les deux versions sont indépendantes. Rien n'est traduit automatiquement : tu écris en français, tu fais traduire par Claude (copier-coller, hors du site), tu relis, tu enregistres. Aucune API, aucune clé, aucun service externe.

---

## 1. Les 30 secondes qui suffisent

**Nouveau contenu** (article, projet, page) :

```bash
# 1. écris le contenu en français (comme avant)
# 2. prépare la traduction
npm run traductions -- preparer nom-du-fichier-francais
# 3. colle le fichier créé (traductions/a-traduire/nom-du-fichier-francais.md) dans Claude
# 4. enregistre sa réponse dans src/contenu/en/<type>/<slug-anglais>.md   (type : journal, projets ou pages)
# 5. relis et corrige, puis valide
npm run traductions -- valider nom-du-fichier-francais
```

**Tu as modifié un texte français déjà traduit** :

```bash
npm run traductions             # il apparaît « OBSOLÈTE »
npm run traductions -- preparer nom-du-fichier-francais   # inclut la version anglaise actuelle
# colle dans Claude, remplace le fichier anglais par la réponse, relis
npm run traductions -- valider nom-du-fichier-francais
```

**Vérifier que tout est traduit** : `npm run traductions` (ou `npm run verifier`, qui échoue s'il reste quelque chose).

---

## 2. Où sont les fichiers

```
src/contenu/journal/<nom>.md        français   → /journal/<nom>/
src/contenu/projets/<nom>.md        français   → /projets/<nom>/
src/contenu/pages/<nom>.md          français   → /<nom>/
src/contenu/en/journal/<slug>.md    anglais    → /en/journal/<slug>/
src/contenu/en/projets/<slug>.md    anglais    → /en/projects/<slug>/
src/contenu/en/pages/<slug>.md      anglais    → /en/<slug>/
src/donnees/i18n.json               textes d'interface FR + EN
src/donnees/nomsTags.json           nom anglais des tags
src/donnees/citations.json          citations (champ « en » = traduction)
src/donnees/erreurs404.json         messages 404 (fr + en)
src/donnees/musique.json            notes de la sélection musicale (fr + en)
src/donnees/maintenant.json         « En ce moment » (fr + en)
docs/prompts/prompt-traduction.md   le prompt de traduction (copie en section 6)
outils/traductions.mjs              l'outil de suivi
traductions/a-traduire/             fichiers de travail créés par « preparer » (ignorés par Git)
```

Le **nom du fichier anglais est son adresse** : `how-this-site-is-built.md` donne `/en/journal/how-this-site-is-built/`. Tu peux donc traduire le nom (minuscules, sans accent, tirets). Les noms de projets restent identiques quand ce sont des noms propres (`retour-de-force`, `hard-music-fr`).

---

## 3. Comment les deux versions sont reliées : `translationKey`

Le français et l'anglais d'un même contenu portent la **même clé**, dans l'en-tête :

```yaml
# français : src/contenu/journal/projet-car-audio.md
translationKey: projet-car-audio     # facultatif : par défaut, c'est le nom du fichier français

# anglais : src/contenu/en/journal/car-audio-project.md
translationKey: projet-car-audio     # obligatoire : le build s'arrête sans cette ligne
```

- La clé sert au sélecteur **FR / EN**, aux balises `hreflang`, au sitemap et au suivi des traductions.
- **Ne renomme pas un fichier français sans prévenir la clé** : si le nom du fichier français change, sa clé par défaut change et le lien avec l'anglais est perdu. Dans ce cas, ajoute `translationKey: ancien-nom` dans le fichier français renommé (ou change la clé dans le fichier anglais).
- Une clé ne doit exister qu'une fois par langue : l'outil signale les doublons.
- Les pages d'interface (accueil, liste du journal, projets, musique, tags) sont reliées automatiquement, rien à faire.

---

## 4. Ce qui est traduit, et ce qui ne l'est pas

Dans l'en-tête d'un contenu anglais :

| Champ | Que faire |
|---|---|
| `title`, `description` | **Traduire** |
| `translationKey` | Copier celui du français (obligatoire) |
| `date` | Identique au français |
| `tags` | **Identiques** au français (ce sont des clés) ; le nom anglais est dans `nomsTags.json` |
| `status` (`en-cours`, `termine`…) | Identique (c'est une clé, affichée traduite : « in progress ») |
| `year`, `demo`, `github`, `featured` | Identiques |
| `tech` | Identique, sauf les mots français (« HTML et CSS » → « HTML and CSS ») |
| `draft` | Mets `draft: true` pour garder la traduction invisible en production |
| `sourceHash` | **Ne pas toucher** : écrit par `valider` |

Dans le texte :
- **Ne pas traduire** : les noms propres, les noms de projets (Retour de Force, Hard Music FR, Interligne…), ton pseudo `rpmn0ise`, les logiciels et le matériel, les genres musicaux, les termes techniques usuels, le code.
- **Liens internes** : ils doivent pointer vers l'anglais.

| Français | Anglais |
|---|---|
| `/projets/<nom>/` | `/en/projects/<slug-anglais>/` |
| `/journal/<nom>/` | `/en/journal/<slug-anglais>/` |
| `/musique/` | `/en/music/` |
| `/setup/` | `/en/setup/` |
| `/a-propos/` | `/en/about/` |
| `/contact/` | `/en/contact/` |

- Orthographe : anglais britannique (colour, favourite, organise). Ton : direct, simple, personnel, jamais « marketing ».

---

## 5. Les cas du quotidien

### 5.1 J'ajoute un nouveau contenu

1. Écris le contenu en français dans `src/contenu/<type>/<nom>.md`, avec l'en-tête habituel.
2. (Facultatif) Crée un squelette anglais en brouillon : `npm run traductions -- nouveau <nom> <slug-anglais>`. Il copie l'en-tête, ajoute `translationKey` et `draft: true`.
3. `npm run traductions -- preparer <nom>` : crée `traductions/a-traduire/<nom>.md` (consignes + source française).
4. Colle ce fichier dans Claude. Il répond avec le nom du fichier proposé et le Markdown anglais complet.
5. Enregistre la réponse dans `src/contenu/en/<type>/<slug-anglais>.md`.
6. Relis, corrige, retire `draft: true` s'il est présent, résous les `[À CONFIRMER]` éventuels.
7. `npm run traductions -- valider <nom>`.
8. `npm run build` : les deux pages existent, le sélecteur FR/EN les relie.

Tant qu'il n'y a pas de fichier anglais, **aucune page anglaise n'existe** et le sélecteur renvoie vers l'accueil anglais. Un contenu français nouveau n'est jamais considéré comme traduit.

### 5.2 Je modifie un contenu français déjà traduit

1. Modifie le français. Le suivi calcule une empreinte du **titre, de la description et du texte**. Dès que l'un d'eux change, `npm run traductions` affiche **OBSOLÈTE**.
2. `npm run traductions -- preparer <nom>` : le fichier de travail contient cette fois la **version anglaise actuelle**. Le prompt demande à Claude de ne modifier que ce qui a changé.
3. Remplace le fichier anglais par la réponse, relis.
4. `npm run traductions -- valider <nom>`.

Les changements qui **ne** déclenchent **pas** « obsolète » (ils ne sont pas traduits) : `date`, `tags`, `status`, `year`, `tech`, liens. Si tu les changes en français, reporte-les à la main dans le fichier anglais.

### 5.3 Je corrige une faute ou une virgule en français

Ça déclenche « obsolète » aussi. Si ça n'a pas d'effet sur le sens, corrige à la main la même chose en anglais (ou rien), puis `npm run traductions -- valider <nom>`, sans repasser par Claude.

### 5.4 Je corrige seulement l'anglais

Modifie le fichier anglais directement. Rien d'autre à faire : l'empreinte porte sur le français, pas sur l'anglais.

### 5.5 Je supprime ou je dépublie un contenu

- Supprime ou passe en `draft: true` la version française : la version anglaise est signalée « orpheline » (`?`). Supprime-la aussi, ou garde-la en `draft: true`.
- Pour dépublier seulement l'anglais : `draft: true` dans le fichier anglais. La page disparaît du build, le sélecteur renvoie vers l'accueil anglais.

### 5.6 J'ai un nouveau tag

1. Mets la **clé française** dans `tags:` des articles (français et anglais, identique).
2. Ajoute son nom anglais dans `src/donnees/nomsTags.json` : `"nouveau-tag": { "en": "new-tag" }`.
3. L'outil signale un tag sans nom anglais. Sans l'entrée, le tag s'affiche avec sa clé française.

### 5.7 Les textes courts (citations, 404, notes musicales, « En ce moment »)

Ils ont les deux langues dans le **même fichier** :

- `citations.json` : ajoute `"en": "traduction"` à chaque citation. La citation reste en français sur la page anglaise (originale, `lang="fr"`), avec la traduction dessous.
- `erreurs404.json` : `{ "fr": { "titre": "…", "texte": "…" }, "en": { "titre": "…", "texte": "…" } }`
- `musique.json` : les notes sont `{ "fr": "…", "en": "…" }`.
- `maintenant.json` : `travaille` et `setup.note` sont `{ "fr": "…", "en": "…" }`.

L'outil signale tout texte sans version anglaise (« donnée sans traduction »). Prompt rapide pour ces textes : section 6.2.

### 5.8 Je change un libellé d'interface (menu, bouton…)

Dans `src/donnees/i18n.json`, section `fr` **et** section `en` : garde les mêmes clés dans les deux. Les textes de la radio et de l'indicateur d'écoute sont dans `js` (même fichier). Évite d'écrire du texte en dur dans un modèle (`src/*.njk`, `src/gabarits/`).

---

## 6. Les prompts à donner à Claude

### 6.1 Traduire un contenu (article, projet, page)

`npm run traductions -- preparer <nom>` assemble automatiquement ce prompt avec la source française (et la version anglaise actuelle si elle existe). Tu n'as qu'à coller le fichier créé. Le prompt de base est dans `docs/prompts/prompt-traduction.md`, modifiable :

~~~~text
Tu es traducteur éditorial français → anglais pour le site personnel rpmn0ise.

## Consignes

- Traduis le contenu ci-dessous du français vers l'anglais. C'est une traduction éditoriale, pas mot à mot : le texte doit sonner naturel en anglais.
- Ton : direct, simple, personnel, sincère, avec un peu de sobriété. Phrases courtes. Pas de ton commercial ni de formules « marketing ». Pas de jargon professionnel inutile.
- Garde la première personne et la personnalité de l'auteur.
- Ne résume pas, ne supprime rien, n'ajoute rien, ne change pas le sens. Garde la même structure (titres, listes, ordre des paragraphes).
- Ne traduis pas : les noms propres, les noms de projets (Retour de Force, Hard Music FR, Interligne…), le pseudonyme rpmn0ise, les noms de logiciels et de matériel, les termes techniques usuels, le code, les noms de genres musicaux.
- Orthographe : anglais britannique (colour, favourite, organise).
- Traduis dans l'en-tête : `title` et `description`. Ne modifie pas `date`, `tags`, `status`, `year`, `tech` (sauf pour traduire les mots français comme « HTML et CSS » → « HTML and CSS »), `demo`, `featured`, ni `translationKey`.
- Les liens internes doivent pointer vers la version anglaise :
  `/projets/…` → `/en/projects/…`, `/journal/…` → `/en/journal/…`, `/musique/` → `/en/music/`,
  `/setup/` → `/en/setup/`, `/a-propos/` → `/en/about/`, `/contact/` → `/en/contact/`.
  Le slug d'un projet ou d'un article anglais est celui de son fichier anglais (propose-le dans le nom du fichier). Si tu ne connais pas le slug anglais d'une page, garde le lien français et signale-le.
- Si une « version anglaise actuelle » est fournie, c'est une mise à jour : garde cette traduction telle quelle et ne modifie que les passages dont la source française a changé (y compris `title` et `description` si besoin).
- Si un passage est ambigu ou ne se traduit pas bien, ne l'invente pas : traduis au plus près et ajoute `[À CONFIRMER : ce qui est ambigu]` à cet endroit.

## Réponse attendue

Renvoie uniquement le fichier Markdown anglais complet (en-tête compris, dans un seul bloc de code), prêt à être enregistré. Propose le nom du fichier (slug anglais en minuscules, séparé par des tirets) en première ligne, avant le bloc de code.
~~~~

### 6.2 Traduire des textes courts (citations, 404, notes)

À coller dans Claude, suivi du JSON à compléter :

~~~~text
Complète ce fichier JSON en ajoutant la traduction anglaise de chaque texte français.
- Anglais britannique, ton direct et naturel, pas de traduction littérale maladroite.
- Garde le sens, l'humour et le registre ; ne traduis pas les noms propres.
- Pour une citation, traduis seulement le texte (champ "en"), pas l'auteur ni la source.
- Garde exactement la même structure JSON, sans rien supprimer, et renvoie le JSON complet valide.
- Si une expression est intraduisible (jeu de mots, argot), traduis au plus près et signale-le après le JSON.
~~~~

---

## 7. Le suivi : lire le résultat de `npm run traductions`

```
✓ journal projet-car-audio     à jour
✗ journal pourquoi-ce-site     OBSOLÈTE (le français a changé)
✗ projets nouveau-projet       À TRADUIRE
✗ pages   setup                à valider (relire puis « valider »)
? journal ancien-article       version anglaise sans français correspondant
```

| État | Signification | Que faire |
|---|---|---|
| **à jour** | L'anglais correspond au français actuel | Rien |
| **À TRADUIRE** | Aucun fichier anglais | Section 5.1 |
| **OBSOLÈTE** | Le français a changé depuis la dernière validation | Section 5.2 |
| **à valider** | L'anglais existe mais n'a jamais été validé | Relire, puis `valider` |
| **brouillon** | L'anglais est en `draft: true` | Terminer, retirer `draft`, `valider` |
| **? orphelin** | Anglais sans français correspondant (clé différente ou français supprimé) | Vérifier `translationKey`, ou supprimer |
| **! doublon** | Deux fichiers avec la même clé dans une langue | Corriger la clé |

Commandes :

| Commande | Effet |
|---|---|
| `npm run traductions` | État de tout (aussi `... -- statut`) |
| `npm run verifier` | Idem, mais code d'erreur s'il reste quelque chose |
| `npm run traductions -- preparer <cle>` | Prépare le fichier à coller dans Claude |
| `npm run traductions -- nouveau <cle> <slug-anglais>` | Crée le squelette anglais en brouillon |
| `npm run traductions -- valider <cle>` | Marque la traduction à jour (écrit `sourceHash`) |
| `npm run traductions -- valider --tout` | Idem pour toutes les traductions existantes |

`<cle>` est la clé de traduction (par défaut le nom du fichier français sans `.md`). Le build (`npm run build`) affiche un **résumé d'une ligne** sur l'état des traductions, sans jamais échouer pour cela.

**Valider** signifie : « j'ai relu, l'anglais correspond au français tel qu'il est maintenant ». L'outil enregistre dans le fichier anglais une empreinte (`sourceHash: …`) du français. Ne valide qu'après relecture.

---

## 8. Ce que fait le site de ces fichiers

- Chaque page a ses `lang`, URL canonique et métadonnées de partage dans sa langue.
- Les balises `hreflang` (FR, EN, et `x-default` = français) n'apparaissent que si **les deux versions existent**. Le sitemap contient les liens entre versions.
- Le sélecteur **FR / EN** mène à la version correspondante, sinon à l'accueil de l'autre langue.
- Changer de langue ne coupe pas la radio : le site change le contenu sans recharger la page.
- Deux flux RSS : `/feed.xml` (français) et `/en/feed.xml` (anglais).
- La page 404 anglaise est `/en/404.html`.
- Aucune redirection automatique selon la langue du navigateur : le français reste la langue par défaut.

---

## 9. Dépannage

| Symptôme | Cause probable |
|---|---|
| Le build s'arrête : « champ(s) obligatoire(s) manquant(s) : translationKey » | Un fichier sous `src/contenu/en/` n'a pas de `translationKey` |
| Le sélecteur renvoie à l'accueil au lieu de la page jumelle | Les deux `translationKey` ne sont pas identiques, ou l'anglais est en `draft: true` |
| Pas de `hreflang` sur une page | Une seule version existe (normal), ou clés différentes |
| « OBSOLÈTE » juste après une validation | Le français a été modifié depuis (même une virgule) |
| « orphelin » après avoir renommé un fichier français | La clé par défaut a changé : ajoute `translationKey: ancien-nom` au français |
| Un tag s'affiche en français sur la version anglaise | Il manque dans `nomsTags.json` |
| `valider` refuse de continuer | Le fichier anglais contient encore `draft: true` |
| Le texte d'interface reste en français sur la version anglaise | Libellé en dur dans un modèle : le mettre dans `i18n.json` |
| Page anglaise qui renvoie vers une page française | Lien interne non traduit : voir le tableau de la section 4 |

---

## 10. Checklist avant de publier

- [ ] `npm run verifier` : aucune ligne rouge (ou tu sais pourquoi).
- [ ] Les liens internes des pages anglaises pointent vers `/en/…`.
- [ ] Aucun `[À CONFIRMER]` ni `draft: true` oublié (`grep -rn "À CONFIRMER" src/contenu/en`).
- [ ] `npm run build` sans erreur ; ouvre une page en FR et en EN, utilise le sélecteur.
- [ ] Pour une nouvelle page : vérifie qu'elle a un titre et une description dans les deux langues.
