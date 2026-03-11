# 🚀 SGPI V2 FINAL - Guide Installation Complet

## ✅ CONTENU DU PACKAGE

```
sgpi-v2-FINAL/
├── index.html              ✅ Landing + widget Discord
├── acces.html              ✅ Accès Discord (CAPTCHA FIXÉ!)
├── css/sgpi-style.css      ✅ CSS complet
├── js/sgpi-final.js        ✅ JS avec fix + search
├── wiki/
│   ├── index.html          ✅ Wiki complet (14 catégories)
│   └── tutos.html          ✅ Page tutos
├── pages/
│   ├── projets.html        ✅ Projets
│   └── about.html          ✅ À propos
├── scripts/
│   ├── md-to-html.py       ✅ Convertisseur MD→HTML
│   └── generate-wiki.py    ✅ Générateur wiki
├── bot-discord/
│   ├── bot.py              ✅ Bot Discord simple
│   └── README.md           ✅ Guide bot
└── README.md + INSTALL.md  ✅ Ce fichier
```

---

## ⚡ INSTALLATION RAPIDE (5 min)

### 1. Extract
```bash
unzip sgpi-v2-FINAL.zip
cd sgpi-v2-FINAL
```

### 2. Copie dans ton site
```bash
# Dans rpmn0ise.github.io
cp -r * ../rpmn0ise.github.io/sgpi/
```

### 3. **CRITIQUE** - Change liens Discord

**Dans `acces.html` :**
Cherche (2 endroits) :
```
https://discord.gg/CHANGE_MOI_MANUELLEMENT
```
Remplace par ton lien Discord

**Dans `index.html` :**
Cherche :
```
https://discord.com/widget?id=TON_SERVER_ID
```
Remplace TON_SERVER_ID par l'ID de ton serveur

### 4. Test local
```bash
python -m http.server 8000
```

Teste :
- http://localhost:8000/sgpi/ (homepage)
- http://localhost:8000/sgpi/acces.html (workflow)
- http://localhost:8000/sgpi/wiki/ (wiki complet)
- Essaye le captcha (doit fonctionner!)

### 5. Deploy
```bash
git add .
git commit -m "🎮 SGPI v2 FINAL complete"
git push
```

---

## 🐛 FIX CAPTCHA

Le bug captcha est **FIXÉ** dans `js/sgpi-final.js` !

**Ce qui a été corrigé :**
```javascript
window.onCaptchaSuccess = function(token) {
    const nextBtn = document.getElementById('captcha-next');
    nextBtn.disabled = false;           // ✅ Active bouton
    nextBtn.classList.remove('btn-disabled');
    nextBtn.classList.add('btn-primary');
    nextBtn.style.cursor = 'pointer';   // ✅ Curseur normal
    nextBtn.style.opacity = '1';
};
```

**Test :** Résous le captcha, le bouton devient cliquable !

---

## 📚 UTILISER LE WIKI

### Structure
Le wiki est **complet** avec 14 catégories :
1. 🔒 Confidentialité & Sécurité
2. 🤖 Intelligence Artificielle
3. 🎬 Films & Séries
4. 🎵 Musique
5. 🎮 Jeux Vidéo
6. 📚 Livres, BD & Mangas
7. 📥 Téléchargement Direct
8. 🌐 Torrents
9. 🎓 Éducation
10. 📱 Mobile
11. 💻 OS
12. 🛠️ Logiciels
13. 🌐 Web & Création
14. 🔧 Divers

### Ajouter des liens
Les liens sont des **placeholders** actuellement.

**Pour ajouter tes liens :**
1. Édite `wiki/index.html`
2. Cherche la catégorie
3. Remplace `<span class="wiki-link">• Item</span>` par :
   ```html
   <a href="URL_ICI" class="wiki-link" target="_blank">• Nom ressource</a>
   ```

**Ou utilise le script MD→HTML (voir section suivante)**

---

## 🔧 SCRIPT MD→HTML

**Workflow communautaire :**
1. Membre propose ressource sur Discord (#wiki-suggestions)
2. Admin édite fichier `.md` correspondant
3. Admin lance script : `python3 scripts/md-to-html.py fichier.md`
4. HTML généré automatiquement
5. Admin remplace page wiki

**Exemple :**
```bash
# Créer fichier MD
cat > vpn-resources.md << 'END'
## VPN & Proxy

### VPN Gratuits
* ProtonVPN - https://protonvpn.com
* Windscribe - https://windscribe.com

### VPN Payants
* Mullvad - https://mullvad.net
* IVPN - https://ivpn.net
END

# Convertir
python3 scripts/md-to-html.py vpn-resources.md

# Résultat: vpn-resources.html créé
```

---

## 🤖 BOT DISCORD

### Installation
```bash
cd bot-discord
pip install discord.py
```

### Configuration
Édite `bot.py` :
```python
TOKEN = "ton_bot_token"              # Token bot
CANDIDAT_ROLE_ID = 123456789         # ID rôle Candidat
MEMBRE_ROLE_ID = 987654321           # ID rôle Membre
```

**Récupérer IDs :**
1. Active Mode Développeur Discord (Settings → Advanced)
2. Clic-droit sur rôle → Copier l'ID

### Lancer
```bash
python3 bot.py
```

### Commandes
- `!wiki [recherche]` - Lien wiki
- `!promote @user` - Promouvoir Candidat → Membre (admin only)
- `!stats` - Stats serveur

### Features
- ✅ Auto-role Candidat quand quelqu'un rejoint
- ✅ Message bienvenue automatique
- ✅ Commandes simples

---

## 🔍 SEARCH WIKI

La **recherche client-side** est incluse !

**Utilisation :**
- Tape dans la barre de recherche
- Résultats filtrés en temps réel
- Pas besoin de backend !

**Code dans `js/sgpi-final.js` :**
```javascript
function searchWiki() {
    const query = document.getElementById('wiki-search').value.toLowerCase();
    // Filtre catégories et liens en temps réel
}
```

---

## 📊 WIDGET DISCORD

Le widget Discord est sur la **homepage** !

**Configuration :**
1. Active widget sur ton serveur Discord (Settings → Widget)
2. Récupère Server ID
3. Dans `index.html`, remplace :
   ```html
   https://discord.com/widget?id=TON_SERVER_ID
   ```

**Affiche :**
- Membres en ligne
- Channels
- Bouton Join

---

## 🎨 PERSONNALISATION

### Couleurs
Dans `css/sgpi-style.css` :
```css
:root {
    --neon-green: #00ff88;   /* Change ici */
    --neon-pink: #ff0088;
    --neon-cyan: #00d4ff;
}
```

### Logo
Place ton logo dans `assets/logo-sgpi.png` (40x40px)

### Textes
Modifie directement les fichiers HTML

---

## 📋 CHECKLIST

### Installation
- [ ] Package extrait
- [ ] Fichiers copiés dans sgpi/
- [ ] Lien Discord changé (acces.html)
- [ ] Server ID changé (index.html widget)
- [ ] Test local OK

### Bot Discord (optionnel)
- [ ] Bot créé sur Discord
- [ ] Token configuré
- [ ] IDs rôles configurés
- [ ] Bot lancé

### Personnalisation
- [ ] Liens wiki ajoutés
- [ ] Logo ajouté (optionnel)
- [ ] Couleurs ajustées (optionnel)

### Deploy
- [ ] Git commit
- [ ] Git push
- [ ] Site live vérifié
- [ ] Workflow captcha testé

---

## 🎯 RÉSULTAT FINAL

Tu auras :
- ✅ Site SGPI moderne underground
- ✅ Captcha qui marche !
- ✅ Wiki complet 14 catégories
- ✅ Page tutos avec disclaimer
- ✅ Pages projets & about
- ✅ Search wiki temps réel
- ✅ Widget Discord
- ✅ Bot Discord simple
- ✅ Script MD→HTML

---

**TOUT EST PRÊT ! Deploy et profite ! 🚀**
