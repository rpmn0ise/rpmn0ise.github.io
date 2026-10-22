# Site personnel

Site statique fait avec [Eleventy](https://www.11ty.dev/) 3, en français. Pas de backend, pas de base de données, pas de service externe. Hébergement prévu : Cloudflare Pages.

> **À faire avant la mise en ligne** (voir la fin de ce fichier) : premier `npm run build` réel, `url` du site, nom définitif, phrase d'accueil.

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
    site.json             titre, description, url, e-mail, menu, phrase d'accueil (`accroche`)
  gabarits/               modèles HTML : base, article, projet, page, deux listes
  public/                 copié tel quel à la racine du site :
    css/style.css         toute la mise en forme (variables de couleur en tête de fichier)
    js/theme.js           bascule clair/sombre (26 lignes)
    images/               images du site
    _headers              en-têtes de sécurité
  index.njk journal.njk projets.njk tags.njk             pages générées
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
- Liens externes (GitHub, YouTube…) : directement dans `src/contenu/pages/contact.md`.
- Pages À propos et Contact : fichiers Markdown de `src/contenu/pages/`.

### Images

Placer le fichier dans `src/public/images/` (compressé avant, cible environ 100 Ko, de préférence en WebP) et l'appeler avec `/images/nom.webp`. Pour éviter les décalages de mise en page, écrire `<img src="/images/nom.webp" alt="description" width="800" height="450">` plutôt que la syntaxe Markdown, qui ne permet pas d'indiquer les dimensions.

### Listes de tâches

`- [x] fait` et `- [ ] à faire` sont affichées avec ✓ et ☐ dans tous les fichiers Markdown.

## Design

Monochrome, une seule couleur d'accent (bleu), beaucoup d'espace. Polices auto-hébergées (licence OFL, voir `src/public/fonts/LICENCES.txt`) : Instrument Serif pour le nom et les titres de page, Bricolage Grotesque pour les titres de section et de projet, Instrument Sans pour le texte, Geist Mono pour les petites mentions. Tout se règle dans les variables en tête de `style.css`. Menu : Projets, Journal, À propos, Contact. L'accueil montre le nom en grand, la phrase d'accueil, les projets `featured` et les 3 derniers articles.

## Thème clair et sombre

Les couleurs sont des variables CSS au début de `style.css` (une palette claire, deux fois la palette sombre : préférence système et choix manuel). Sans JavaScript, le site suit le thème du système. Avec JavaScript, le bouton du menu bascule et mémorise le choix dans `localStorage` (aucun cookie).

## Déploiement sur Cloudflare Pages

1. Pousser le dépôt sur GitHub ou GitLab.
2. Cloudflare → Workers & Pages → créer un projet Pages → connecter le dépôt.
3. Commande de build : `npm run build`. Dossier de sortie : `_site`.
4. Variable d'environnement : `NODE_VERSION` = `22`.
5. Après chaque `git push`, le site se reconstruit tout seul.


## Avant la mise en ligne

- [ ] Lancer un premier `npm install && npm run build` et corriger les éventuelles erreurs (voir « Tests »).
- [ ] Remplacer `url` dans `src/donnees/site.json` (le build prévient tant que c'est `example.com`) : il sert au sitemap, au flux RSS et aux liens canoniques.
- [ ] Décider du nom définitif du site (`titre` dans `site.json`, provisoirement `rpmn0ise`).
- [ ] Renseigner `accroche` dans `site.json` : phrase d'accueil, non affichée tant qu'elle est vide.
- [ ] Vérifier l'e-mail (`site.json`) et les liens GitHub / YouTube (`contact.md`), repris de l'ancien site.
- [ ] Relire la page À propos (texte fourni par ChatGPT, liens internes ajoutés) et les **exemples** : `projets/retour-de-force.md`, `hard-music-fr.md`, `interligne.md` (champs à compléter, marqués en italique), `journal/pourquoi-ce-site.md`, `journal/aide-memoire-mise-en-forme.md`. Les compléter, les remplacer ou les supprimer.
- [ ] Vérifier la phrase d'accueil (`accroche` dans `src/donnees/site.json`).

## Tests effectués

Eleventy n'a pas pu être installé dans l'environnement de développement (accès au registre npm refusé) : **`npm run build` n'a jamais été exécuté**. Le reste a été vérifié avec un banc d'essai jetable (gabarits rendus avec Jinja2, très proche de Nunjucks, puis Chromium via Playwright), qui n'est pas dans le dépôt.

| Contrôle | Résultat |
|---|---|
| Rendu complet avec du contenu de test (hors dépôt) : liens internes, un `h1` par page, métadonnées | conformes |
| Un seul `h1` par page, titres et descriptions uniques, `alt` et dimensions des images | conformes |
| Débordement horizontal, 99 pages à 360 px et 1 280 px | aucun |
| Ressources locales (CSS, JS, images) | toutes chargées |
| Thème : bascule, mémorisation après rechargement, rendu sans JavaScript | conformes |
| Clavier : ordre de tabulation, lien « Aller au contenu » | conformes |
| Contraste texte/fond, deux thèmes | au moins 5,5:1 (seuil WCAG AA : 4,5:1) |
| Règle markdown-it des listes de tâches | testée avec le vrai markdown-it |
| Syntaxe de la config, du script et des JSON | valide |

Non vérifié : le build Eleventy lui-même (collections, flux RSS, sitemap, pages de tags, validation), la coloration du code produite par le plugin, le déploiement Cloudflare Pages, les performances mesurées (Lighthouse). Poids : CSS 10 Ko (2,8 Ko compressé), JS 1 Ko, images 108 Ko au total.

## Limites connues

- Pas de recherche ni de pagination (25 entrées : inutile pour l'instant).
- Les images ne sont pas optimisées automatiquement.
- Le contact se fait par `mailto:` (l'adresse est visible dans la page).
- Le site contient peu de contenu : 3 projets et 2 articles d'exemple, à relire ou remplacer. Ils ne reprennent que ce que tu as dit de toi ; année et statut ne sont renseignés que pour Retour de Force et Hard Music FR.
