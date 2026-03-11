# 🎮 SGPI V2 FINAL - PACKAGE COMPLET

## ✅ CONTENU DU PACKAGE

```
sgpi-final/
├── index.html              ✅ Landing page
├── acces.html              ✅ Accès Discord (FIX captcha + Webhook)
├── css/
│   └── sgpi-style.css      ✅ CSS complet
├── js/
│   └── sgpi.js             ✅ Dark mode + interactions
├── wiki/
│   └── index.html          ✅ Wiki COMPLET (14 catégories, 150+ ressources)
├── pages/
│   ├── tutos.html          ✅ 60+ tutos (9 catégories)
│   ├── projets.html        ✅ Projets SGPI
│   └── about.html          ✅ À propos complet
├── scripts/
│   ├── generate-wiki.py    ✅ Générateur wiki
│   ├── generate-tutos.py   ✅ Générateur tutos
│   └── md-to-html.py       ✅ Convertisseur MD→HTML
└── docs/
    ├── README.md           📖 Ce fichier
    └── GUIDE-DISCORD.md    📖 Guide Discord complet
```

---

## ⚡ INSTALLATION (5 min)

### 1. Extract
```bash
unzip sgpi-final.zip
cd sgpi-final
```

### 2. Copie dans ton site
```bash
cd ../rpmn0ise.github.io
cp -r ../sgpi-final/* sgpi/
```

### 3. **CRITIQUE** - Configure

#### A) Lien Discord
Ouvre `sgpi/acces.html` et remplace (2 endroits) :
```
CHANGE_MOI_MANUELLEMENT
```
Par ton lien Discord réel.

#### B) Webhook Discord
Dans `acces.html` ligne ~143 :
```javascript
const webhookUrl = 'https://discord.com/api/webhooks/TON_ID/TON_TOKEN';
```

Créer webhook :
1. Discord → #postulations → Intégrations → Webhooks
2. Copier URL → Coller dans code

### 4. Test
```bash
python -m http.server 8000
```

Teste :
- http://localhost:8000/sgpi/
- http://localhost:8000/sgpi/acces.html
- http://localhost:8000/sgpi/wiki/
- http://localhost:8000/sgpi/pages/tutos.html

### 5. Deploy
```bash
git add .
git commit -m "🎮 SGPI v2 Final - Tout est prêt !"
git push
```

---

## 🎯 FEATURES COMPLÈTES

### ✅ Wiki (14 Catégories)
- 🔒 Confidentialité & Sécurité
- 🤖 Intelligence Artificielle
- 🎬 Films & Séries
- 🎵 Musique
- 🎮 Jeux Vidéo
- 📚 Livres & Mangas
- 📥 Téléchargement Direct
- 🌊 Torrents
- 🎓 Éducation
- 📱 Mobile
- 💻 OS
- 🛠️ Logiciels
- 🌐 Web & Création
- 🔧 Divers

**Total : 150+ ressources organisées**

**Search client-side intégrée !**

---

### ✅ Tutos (60+ Guides)

**9 Catégories :**
1. 🎮 Jeux Vidéo (BeamNG, AC, Minecraft, Emulation...)
2. 🔓 Zone Grise (Windows, Office, Adobe, Spotify, Bypass...)
3. 💻 Système & Outils (USB bootable, Linux, VM...)
4. 🔒 Sécurité (VPN, Tor, Chiffrement, 2FA, OPSEC...)
5. 🌐 Web & Réseau (Hébergement, Pi, Scraping...)
6. 📱 Mobile (Root, Jailbreak, APK, Sideload...)
7. 🎨 Création (Vidéo, Photo, Audio, 3D, Streaming...)
8. 🤖 IA & Auto (ChatGPT, Stable Diffusion, Scripts...)
9. 💾 Data (Plex, Torrenting, Cloud, Recovery...)

**Format ultra-détaillé avec disclaimer gros !**

---

### ✅ Page Accès Discord

**Workflow :**
1. Captcha hCaptcha ✅ (BUG FIXÉ !)
2. Question "Pourquoi rejoindre ?" (20-500 chars)
   → Envoyé via Webhook Discord
3. Lien Discord révélé
4. Info question base64 affichée

**Sur Discord :**
- Membership Screening : "Adresse site en base64 ?"
- Réponse : `aHR0cHM6Ly9ycG1uMGlzZS5naXRodWIuaW8vc2dwaS8=`
- Si correct → Rôle Candidat 🟢

---

### ✅ Structure Discord

```
🏠 ACCUEIL
├─ #bienvenue, #règles, #annonces, #infos-utiles

💬 GÉNÉRAL
├─ #général (Candidat écriture), #hors-sujet, #bot-commandes

📚 WIKI & RESSOURCES
├─ #wiki-suggestions, #wiki-updates, #partage-ressources

🔧 ZONE GRISE & TUTOS
├─ #zone-grise-discussion, #tutos-demandes, #entraide-technique

🎮 GAMING & TECH
├─ #gaming-général, #tech-discussion, #audio-musique

🗂️ FORUMS (7 forums par catégories)

🔴 ADMIN
├─ #postulations (webhook), #stats, #modération, #admin-chat
```

**Rôles :**
- 🟢 Candidat : Lecture + #général
- 🔵 Membre : Accès complet (manuel)
- 🔴 Admin : Gestion totale

---

### ✅ Autres Pages

**Projets :**
- Grid cards
- Wiki, Tutos, Site v2, Tools (prévu), Archive (prévu)

**About :**
- Histoire SGPI
- Mission & Valeurs
- Stats (150+ ressources, 60+ tutos)
- Équipe
- FAQ
- Contact

---

## 🛠️ SCRIPTS UTILES

### MD → HTML

Convertit fichiers Markdown en HTML avec template SGPI.

**Usage :**
```bash
python3 scripts/md-to-html.py wiki/categories/vpn.md
# → Génère vpn.html
```

**Workflow wiki :**
1. Membres suggèrent dans #wiki-suggestions
2. Admin crée `categorie.md` avec liste ressources
3. `python3 scripts/md-to-html.py categorie.md`
4. Remplace ancien HTML dans wiki
5. Annonce dans #wiki-updates

---

## 🔧 CONFIGURATION

### Webhook Discord

**Créer webhook :**
1. Discord → #postulations
2. Intégrations → Webhooks → Nouveau
3. Copier URL
4. Dans `acces.html` ligne ~143 :
```javascript
const webhookUrl = 'https://discord.com/api/webhooks/TON_ID/TON_TOKEN';
```

**Format message :**
```json
{
  "embeds": [{
    "title": "📝 Nouvelle Postulation",
    "description": "[Réponse user]",
    "color": 65408,
    "timestamp": "2026-03-11T..."
  }]
}
```

### Discord Membership Screening

**Setup :**
1. Paramètres serveur → Membership Screening
2. Activer
3. Question : "Quelle est l'adresse du site SGPI en base64 ?"
4. Réponse attendue : `aHR0cHM6Ly9ycG1uMGlzZS5naXRodWIuaW8vc2dwaS8=`
5. Cocher "Exact match"

**Voir GUIDE-DISCORD.md pour détails complets !**

---

## 📊 STATS FOOTER

Toutes les pages affichent :
```
📚 150+ ressources • 60+ tutos • 🟢 Discord actif
```

Editable dans chaque fichier HTML (footer).

---

## 🎨 CUSTOMISATION

### Couleurs

Dans `css/sgpi-style.css` :
```css
:root {
    --neon-green: #00ff88;
    --neon-cyan: #00d4ff;
    --neon-pink: #ff0088;
}
```

### Logo

Place ton logo dans `assets/logo-sgpi-v2.png` (40x40px).

---

## 🐛 TROUBLESHOOTING

### Captcha ne marche pas

**Cause :** Bug callback

**Solution :** Déjà fixée dans cette version !

Vérif code `acces.html` ligne ~118 :
```javascript
window.onCaptchaSuccess = function(token) {
    // ...
    btn.disabled = false;
};
```

### Webhook ne fonctionne pas

**Cause :** URL invalide

**Solution :**
1. Vérif webhook existe dans Discord
2. Copie URL complète (avec token)
3. Teste avec `curl` :
```bash
curl -X POST "https://discord.com/api/webhooks/..." \
-H "Content-Type: application/json" \
-d '{"content":"Test"}'
```

### Lien Discord cassé

**Cause :** Pas changé

**Solution :** Remplace `CHANGE_MOI_MANUELLEMENT` dans `acces.html`

---

## 📋 CHECKLIST

### Installation
- [ ] Package extrait
- [ ] Fichiers copiés dans `sgpi/`
- [ ] Lien Discord changé (2 endroits dans `acces.html`)
- [ ] Webhook Discord configuré

### Test
- [ ] Homepage fonctionne
- [ ] Wiki complet visible
- [ ] Page tutos OK
- [ ] Captcha fonctionne
- [ ] Webhook reçoit messages

### Discord
- [ ] Membership Screening activé
- [ ] Question base64 configurée
- [ ] Rôles créés (Candidat/Membre/Admin)
- [ ] Permissions channels OK
- [ ] Message bienvenue épinglé

### Deploy
- [ ] Git commit
- [ ] Git push
- [ ] Site live testé
- [ ] Discord testé end-to-end

---

## 🎯 RÉSULTAT FINAL

Site SGPI v2 avec :
- ✅ Design underground gaming moderne
- ✅ Wiki 14 catégories, 150+ ressources
- ✅ Tutos 60+ guides ultra-détaillés
- ✅ Accès Discord simplifié (3 steps)
- ✅ Webhook postulations
- ✅ Structure Discord complète
- ✅ Search wiki client-side
- ✅ Dark/Light mode
- ✅ 100% static (GitHub Pages)
- ✅ Mobile responsive
- ✅ Français, friendly mais pro

**TOUT EST PRÊT ! Deploy et profite ! 🚀**

---

**Package créé avec ❤️ pour SGPI**
*Underground • Zone grise assumée • Communauté quality*
