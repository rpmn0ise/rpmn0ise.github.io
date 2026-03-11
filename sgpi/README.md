# 🎮 SGPI V2 - Package Complet

## 🚀 CE QUE TU AS

Un **site complet SGPI v2** avec design underground gaming, friendly mais pro !

### ✅ Fichiers Inclus
```
sgpi-v2/
├── index.html              ✅ Landing page complète
├── acces.html              ✅ Accès Discord (4 étapes)
├── css/
│   └── sgpi-style.css      ✅ CSS complet underground
├── js/
│   └── sgpi.js             ✅ Dark mode + interactions
├── wiki/
│   └── index.html          🔨 À COMPLÉTER (structure fournie)
├── pages/
│   ├── projets.html        🔨 À CRÉER
│   └── about.html          🔨 À CRÉER
└── assets/
    └── (tes images)
```

---

## ⚡ INSTALLATION RAPIDE

### 1. Copier dans ton repo

```bash
# Dans ton repo rpmn0ise.github.io
cd rpmn0ise.github.io

# Copier TOUT le dossier sgpi-v2 vers sgpi/
cp -r ../sgpi-v2/* sgpi/
```

### 2. Modifier le lien Discord

**CRITIQUE :** Change le lien Discord dans `acces.html`

Cherche et remplace **partout** :
```
https://discord.gg/CHANGE_MOI_MANUELLEMENT
```

Par ton vrai lien Discord (ex: `https://discord.gg/tonserveur123`)

**Fichiers à modifier :**
- `acces.html` (ligne ~181 et ~210)

### 3. Ajouter un logo (optionnel)

Place ton logo dans `assets/logo-sgpi-v2.png` (40x40px recommandé)

### 4. Test local

```bash
python -m http.server 8000
```

Teste :
- http://localhost:8000/sgpi/
- http://localhost:8000/sgpi/acces.html
- http://localhost:8000/sgpi/wiki/

### 5. Deploy

```bash
git add .
git commit -m "🎮 SGPI v2 - Complete remake"
git push
```

---

## 🎨 FEATURES

### Landing Page (index.html)
- ✅ Design underground cool (neon vert/cyan/rose)
- ✅ Présentation SGPI friendly mais pro
- ✅ 3 sections principales (Qui, Quoi, Rejoindre)
- ✅ Aperçu catégories wiki
- ✅ Règles courtes
- ✅ CTA Discord visible
- ✅ Dark/Light mode toggle

### Page Accès (acces.html)
- ✅ **Step 1 :** Captcha hCaptcha (anti-bot)
- ✅ **Step 2 :** Question "Pourquoi rejoindre ?" (20-500 chars)
- ✅ **Step 3 :** Règles à accepter (checkbox)
- ✅ **Step 4 :** Lien Discord révélé + bouton copier
- ✅ Workflow smooth sans backend
- ✅ Tout en JavaScript vanilla

### CSS (sgpi-style.css)
- ✅ Underground gaming style
- ✅ Palette neon (vert #00ff88, cyan #00d4ff, rose #ff0088)
- ✅ Dark mode par défaut
- ✅ Light mode toggle
- ✅ Animations smooth
- ✅ Responsive mobile
- ✅ Glow effects
- ✅ Typography (Orbitron + Inter + JetBrains Mono)

### JavaScript (sgpi.js)
- ✅ Dark/Light mode (localStorage)
- ✅ Workflow accès Discord (4 steps)
- ✅ Captcha callbacks
- ✅ Form validation
- ✅ Copier lien Discord
- ✅ Smooth scroll
- ✅ Active nav links
- ✅ Console easter egg

---

## 📝 À COMPLÉTER

### 1. Wiki (wiki/index.html)

Le Wiki est **partiellement fait**. Tu dois ajouter tes 15 catégories :

**Structure fournie :**
```html
<div class="wiki-category">
    <h3 onclick="toggleCategory('cat-id')">
        🔒 <span>Nom Catégorie</span>
        <span class="collapse-icon">▶</span>
    </h3>
    <div id="cat-id" class="wiki-subcategories">
        <a href="categories/sous-cat.html">Sous-catégorie</a>
    </div>
</div>
```

**Tes catégories :**
1. 🔒 Confidentialité & Sécurité (6 sous-cats)
2. 🤖 Intelligence Artificielle (6 sous-cats)
3. 🎬 Films & Séries (8 sous-cats)
4. 🎵 Musique (6 sous-cats)
5. 🎮 Jeux Vidéo (6 sous-cats)
6. 📚 Livres, BD & Mangas (6 sous-cats)
7. ⬇️ Téléchargement Direct (5 sous-cats)
8. 🌐 Torrents (5 sous-cats)
9. 🎓 Éducation & Formation (6 sous-cats)
10. 📱 Mobile (6 sous-cats)
11. 💻 Systèmes d'exploitation (5 sous-cats)
12. 🛠️ Logiciels & Outils (6 sous-cats)
13. 🌐 Web & Création (6 sous-cats)
14. 🎯 Divers (6 sous-cats)

**Je peux te générer le HTML complet si tu veux !**

### 2. Projets (pages/projets.html)

**Template simple :**
```html
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>SGPI - Projets</title>
    <link rel="stylesheet" href="../css/sgpi-style.css">
</head>
<body>

[HEADER - copie depuis index.html]

<section class="hero">
    <h1>🚀 Projets SGPI</h1>
    <p class="tagline">Ce qu'on construit ensemble</p>
</section>

<main class="container">
    <div class="grid grid-2">
        <div class="card">
            <h3>📚 Wiki Communautaire</h3>
            <p>Plus de 15 catégories de ressources...</p>
            <a href="../wiki/" class="btn btn-secondary">Explorer →</a>
        </div>
        
        [AJOUTE TES PROJETS ICI]
    </div>
</main>

[FOOTER - copie depuis index.html]
[SCRIPTS]
</body>
</html>
```

### 3. À Propos (pages/about.html)

**Contenu suggéré :**
- Histoire SGPI
- Valeurs (partage, discrétion, qualité)
- L'équipe (optionnel)
- Stats (membres, articles wiki, etc.)

---

## 🔧 PERSONNALISATION

### Changer les couleurs

Dans `css/sgpi-style.css` :

```css
:root {
    --neon-green: #00ff88;   /* Change ici */
    --neon-pink: #ff0088;    /* Ou ici */
    --neon-cyan: #00d4ff;    /* Ou ici */
}
```

### Ajouter un logo

1. Crée un logo 40x40px
2. Sauvegarde dans `assets/logo-sgpi-v2.png`
3. Il s'affichera automatiquement

### Modifier les règles

Dans `acces.html`, section Step 3, modifie les `<li>` avec tes règles.

---

## 🐛 TROUBLESHOOTING

### Captcha ne marche pas

**Cause :** Site key invalide

**Solution :** Dans `acces.html`, change :
```html
data-sitekey="d0405860-4f9e-4fa4-b222-3f34132886f6"
```

Par ta propre clé hCaptcha (gratuit sur https://www.hcaptcha.com/)

### Dark mode ne fonctionne pas

**Cause :** JavaScript non chargé

**Solution :** Vérifie que `<script src="js/sgpi.js"></script>` est présent avant `</body>`

### Liens Discord cassés

**Cause :** Tu as oublié de changer `CHANGE_MOI_MANUELLEMENT`

**Solution :** Remplace partout dans `acces.html`

---

## 📋 CHECKLIST

### Installation
- [ ] Fichiers copiés dans `sgpi/`
- [ ] Lien Discord changé dans `acces.html`
- [ ] Logo ajouté (optionnel)
- [ ] Test local OK

### Personnalisation
- [ ] Couleurs ajustées (optionnel)
- [ ] Wiki complété avec catégories
- [ ] Pages projets + about créées
- [ ] Règles personnalisées

### Test
- [ ] Homepage fonctionne
- [ ] Dark/Light mode OK
- [ ] Page accès Discord workflow OK
- [ ] Captcha fonctionne
- [ ] Lien Discord correct
- [ ] Mobile responsive OK

### Deploy
- [ ] Git commit
- [ ] Git push
- [ ] Site live vérifié

---

## 🎯 RÉSULTAT ATTENDU

Après installation, tu auras :
- ✅ Landing page moderne underground
- ✅ Accès Discord simplifié (4 steps)
- ✅ Wiki structure prête
- ✅ Design cohérent
- ✅ Dark/Light mode
- ✅ 100% static (pas de backend)
- ✅ Friendly mais pro
- ✅ 4/10 élitisme (modéré)

---

## 💡 PROCHAINES ÉTAPES

1. **Complète le Wiki** avec tes catégories
2. **Crée pages Projets + About**
3. **Ajoute tes tutos zone grise** dans `wiki/tutos/`
4. **Personnalise** les couleurs si besoin
5. **Test** tout en local
6. **Deploy** et partage le lien !

---

## 📞 BESOIN D'AIDE ?

Si tu veux que je :
- Génère le HTML complet du Wiki avec toutes tes catégories
- Crée les pages Projets + About
- Ajoute des features (search, tags, etc.)

**Dis-moi et je t'aide ! 🚀**

---

**SGPI V2 PRÊT ! Design underground, friendly, moderne, sans backend ! ✨**

*Underground • Français • Zone grise assumée • Communauté quality*
