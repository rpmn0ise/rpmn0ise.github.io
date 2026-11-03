# Site personnel

Site statique fait avec [Eleventy](https://www.11ty.dev/) 3, en français. Pas de backend, pas de base de données, aucun service externe obligatoire (seul l'indicateur d'écoute en contacte, et il est facultatif : voir « Musique »). Hébergement prévu : Cloudflare Pages.

> **À faire avant la mise en ligne** (voir « Avant la mise en ligne ») : `url` du site, nom définitif, contenus d'exemple à relire, marqueurs `[À CONFIRMER]`.

## Commandes

```bash
npm install        # une seule fois (Node 20 ou plus, 22 recommandé : voir .node-version)
npm run dev        # serveur local avec rechargement ; les brouillons (draft: true) sont visibles
npm run build      # génère le site dans _site/ ; les brouillons sont exclus
```

## Où se trouve quoi

```
eleventy.config.js        configuration : collections, filtres, validation des champs, listes de tâches
src/
  contenu/
    journal/              1 fichier .md par article ou note   → /journal/<nom-du-fichier>/
    projets/              1 fichier .md par projet            → /projets/<nom-du-fichier>/
    pages/                pages libres : a-propos, contact → /<nom-du-fichier>/
  donnees/
    site.json             titre, description, url, e-mail, menu, liens du pied de page, phrase d'accueil (`accroche`)
    musique.json          compte Last.fm, lien SoundCloud, sélection de morceaux
    maintenant.json       lignes « En ce moment » de l'accueil (écoute, joue à, travaille sur)
  gabarits/               modèles HTML : base, article, projet, page, deux listes
  public/                 copié tel quel à la racine du site :
    css/style.css         toute la mise en forme (variables de couleur en tête de fichier)
    js/theme.js           bascule clair/sombre
    js/musique.js         indicateur d'écoute Last.fm (accueil et page Musique)
    images/               images du site
    _headers              en-têtes de sécurité
  index.njk journal.njk projets.njk musique.njk tags.njk  pages générées
  404.njk feed.njk sitemap.njk robots.txt.njk            pages techniques
docs/modeles/             modèles à copier : article.md, projet.md
docs/prompts/             prompts ChatGPT qui génèrent un article ou un projet avec le bon frontmatter
```

Conventions : le **nom du fichier devient l'URL** (minuscules, sans accent, tirets). Les noms de champs sont ceux de la section suivante. Rien n'est dupliqué : titre et menu dans `site.json`, couleurs dans les variables du CSS.

## Procédures

### Ajouter un article ou une note

0. Variante : coller `docs/prompts/prompt-article.md` dans ChatGPT avec tes notes, il renvoie le fichier complet.
1. Copier `docs/modeles/article.md` dans `src/contenu/journal/` et le renommer (ex. `mon-sujet.md` → `/journal/mon-sujet/`).
2. Remplir `title` et `date` (les seuls champs obligatoires) ; `description` et `tags` sont facultatifs.
3. Écrire en Markdown. Une **note** est un article avec le tag `note`.
4. `npm run dev` pour vérifier. `draft: true` le garde invisible en production.

Les tags utilisés au moins 2 fois sont listés sur la page Journal ; chaque tag a sa page `/tags/<tag>/`.

### Ajouter un projet

0. Variante : coller `docs/prompts/prompt-projet.md` dans ChatGPT avec ce que tu sais du projet.
1. Copier `docs/modeles/projet.md` dans `src/contenu/projets/`.
2. `title` et `description` sont obligatoires. Facultatifs : `status` (`en-cours`, `termine`, `en-pause`, `abandonne`), `year`, `tech`, `github`, `demo`.
3. `featured: true` l'affiche sur l'accueil (3 projets maximum, les plus récents).

### Modifier les informations personnelles et les liens

- Titre du site, description, adresse du site, e-mail, menu, phrase d'accueil (`accroche`) : `src/donnees/site.json`.
- Liens du pied de page (GitHub, YouTube, SoundCloud…) : `liens` dans `site.json`. Liste de la page Contact : `src/contenu/pages/contact.md`.
- Pages À propos et Contact : fichiers Markdown de `src/contenu/pages/`.

### Images

Placer le fichier dans `src/public/images/` (compressé avant, cible environ 100 Ko, de préférence en WebP) et l'appeler avec `/images/nom.webp`. Pour éviter les décalages de mise en page, écrire `<img src="/images/nom.webp" alt="description" width="800" height="450">` plutôt que la syntaxe Markdown, qui ne permet pas d'indiquer les dimensions.

### Listes de tâches

`- [x] fait` et `- [ ] à faire` sont affichées avec ✓ et ☐ dans tous les fichiers Markdown.

## Design

Monochrome, une seule couleur d'accent (bleu), beaucoup d'espace. Polices auto-hébergées (licence OFL, voir `src/public/fonts/LICENCES.txt`) : Instrument Serif pour le nom et les titres de page, Bricolage Grotesque pour les titres de section et de projet, Instrument Sans pour le texte, Geist Mono pour les petites mentions. Tout se règle dans les variables en tête de `style.css`. Menu : Projets, Journal, Musique, À propos, Contact. L'accueil montre le nom en grand, la phrase d'accueil, la zone « En ce moment », les projets `featured` et les 3 derniers articles.

## Musique et « En ce moment »

**Indicateur d'écoute.** Spotify envoie ses écoutes à Last.fm ; le navigateur du visiteur interroge l'API publique de Last.fm (`user.getRecentTracks`) toutes les 30 secondes tant que l'onglet est visible. S'affichent : « En écoute » avec le titre, ou « Dernière écoute · il y a X min », et sur la page Musique les 8 écoutes précédentes. Le délai dépend de Spotify et de Last.fm (de quelques secondes à quelques minutes), et un morceau en pause peut rester « en écoute » un moment.

- Réglages : `src/donnees/musique.json` (`utilisateur`, `cle`, `profil`). La clé d'API est lisible dans le code de la page, c'est normal pour une clé en lecture seule ; ne jamais y mettre le « shared secret » de Last.fm. En cas d'abus, la régénérer sur Last.fm et la remplacer ici.
- **Pochettes** (Last.fm donne une image générique pour les écoutes Spotify, ignorée) : 1) Cover Art Archive, grâce à l'identifiant d'album fourni par Last.fm ; 2) sinon recherche iTunes, acceptée seulement si l'artiste et le titre correspondent ; 3) sinon une tuile typographique avec l'initiale de l'artiste.
- **Si Last.fm ne répond pas** : l'indicateur reste masqué sur l'accueil (ou affiche la ligne `ecoute` de `maintenant.json` si elle est remplie) et la page Musique affiche « Rien à afficher pour l'instant ». Le reste du site n'est pas touché. Sans JavaScript, même comportement.
- **Vie privée** : l'adresse IP du visiteur est visible de Last.fm, et pour les pochettes de archive.org (Cover Art Archive) et d'Apple (iTunes). Aucun cookie. Pour tout désactiver, retirer `avecMusique: true` dans `src/index.njk` et `src/musique.njk`.

**« En ce moment » (accueil).** `src/donnees/maintenant.json` : `ecoute` (ligne de secours, facultative), `joue`, `travaille`. Une ligne vide n'est pas affichée ; si tout est vide et que Last.fm ne répond pas, la zone disparaît.

**Sélection de morceaux** (page Musique, masquée tant qu'elle est vide). Ajouter dans `selection` de `musique.json` :

```json
{ "artiste": "Nom de l'artiste", "titre": "Titre du morceau", "note": "Une phrase sur pourquoi il compte.", "url": "https://…" }
```

`note` et `url` sont facultatifs.

**SoundCloud** : simple lien, adresse dans `musique.json` (`soundcloud`).

## Thème clair et sombre

Les couleurs sont des variables CSS au début de `style.css` (palette sombre par défaut, palette claire via `data-theme="light"`). Un petit script dans `<head>` applique au premier passage le thème du système, puis le bouton du menu bascule et mémorise le choix dans `localStorage` (aucun cookie). Sans JavaScript, le site reste en sombre.

## Déploiement sur Cloudflare Pages

1. Pousser le dépôt sur GitHub ou GitLab.
2. Cloudflare → Workers & Pages → créer un projet Pages → connecter le dépôt.
3. Commande de build : `npm run build`. Dossier de sortie : `_site`.
4. Variable d'environnement : `NODE_VERSION` = `22`.
5. Après chaque `git push`, le site se reconstruit tout seul.


## Avant la mise en ligne

- [ ] Remplacer `url` dans `src/donnees/site.json` (le build prévient tant que c'est `example.com`) : il sert au sitemap, au flux RSS et aux liens canoniques.
- [ ] Décider du nom définitif du site (`titre` dans `site.json`, provisoirement `rpmn0ise`).
- [ ] Résoudre les marqueurs `[À CONFIRMER]` encore visibles dans `projets/interligne.md` et `projets/collection-hot-wheels.md` (recherche : `grep -rn "À CONFIRMER" src/contenu`).
- [ ] Relire les articles d'exemple (`journal/pourquoi-ce-site.md`, `journal/aide-memoire-mise-en-forme.md`) : les garder, les réécrire ou les supprimer.
- [ ] Vérifier l'e-mail (`site.json`) et les liens GitHub / YouTube (`contact.md`), repris de l'ancien site.
- [ ] Après le premier déploiement, ouvrir `/musique/` avec la console du navigateur ouverte : l'appel à Last.fm n'a pas pu être testé contre le vrai service (voir « Tests »).
- [ ] Remplir `maintenant.json` (`joue`, `travaille`) et la sélection de `musique.json`, ou laisser vide.

## Tests effectués

- `npm run build` exécuté (Eleventy 3.1.7) : 20 fichiers générés sans erreur, avec l'avertissement attendu sur `url`.
- `musique.js` testé dans Chromium (Playwright) avec de **fausses réponses** de Last.fm, de Cover Art Archive et d'iTunes, y compris ton exemple de réponse : écoute en cours, pause, pochette trouvée, repli iTunes, tuile typographique, erreur de l'API, réseau coupé. Aucune erreur JavaScript. Affichage vérifié à 1 280 px et 360 px, sans débordement horizontal.
- Menu : une seule ligne de 360 à 1 280 px ; à 320 px, il passe sur deux lignes.
- Vérifications faites sur la version précédente du design (pas refaites ensuite) : contraste texte/fond d'au moins 5,5:1 dans les deux thèmes, ordre de tabulation, thème mémorisé après rechargement.

**Non vérifié** : l'appel réel à Last.fm depuis un navigateur (accès réseau impossible depuis mon environnement ; l'API est conçue pour être appelée ainsi, mais c'est le premier point à contrôler en ligne), le déploiement Cloudflare Pages, les performances mesurées (Lighthouse).

## Limites connues

- Pas de recherche ni de pagination (25 entrées : inutile pour l'instant).
- Les images ne sont pas optimisées automatiquement.
- Le contact se fait par `mailto:` (l'adresse est visible dans la page).
- Peu d'articles : 2 articles d'exemple à relire ou remplacer.
- Sur l'accueil, seuls les projets avec `featured: true` apparaissent (actuellement un seul).
- L'indicateur d'écoute dépend de Last.fm et de la liaison Spotify : s'ils tombent, l'indicateur disparaît.
