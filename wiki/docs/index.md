<script>
async function checkAuth() {
  const hash = "eff32de3f75650c428d5d6afd5f6dfd93b431e8702a88153cca0a961cafd8956"; // Remplace par ton SHA-256
  if (sessionStorage.getItem('sgpi_hash') !== hash) {
    const input = prompt("Accès sécurisé SGPI - Entrez le code :");
    const encoder = new TextEncoder();
    const data = encoder.encode(input);
    const buffer = await crypto.subtle.digest('SHA-256', data);
    const inputHash = Array.from(new Uint8Array(buffer)).map(b => b.toString(16).padStart(2, '0')).join('');
    
    if (inputHash === hash) {
      sessionStorage.setItem('sgpi_hash', inputHash);
      location.reload();
    } else {
      alert("Accès refusé.");
      window.location.href = "../index.html";
    }
  }
}
checkAuth();
</script>

# 🏴‍☠️ SGPI Wiki : La Collection Ultime

Bienvenue sur le wiki de la **Société Générale des Pirates Informatiques**. Inspiré par l'esprit *FreeMediaHeckYeah*, cet annuaire regroupe les meilleures ressources du net, de la zone blanche à la zone grise.

!!! danger "Disclaimer & Responsabilité"
    Ce site est un simple annuaire de liens vers des services tiers. **SGPI n'héberge aucun contenu illégal sur ses serveurs.** L'utilisation des ressources listées ici relève de votre entière responsabilité. Nous vous conseillons l'usage d'un VPN et d'un bloqueur de publicités avant toute navigation.

---

## 📂 Index des Catégories

* 🔒 [**Confidentialité & Sécurité**](securite.md) — *Adblocking, VPN, Antivirus et protection des données.*
* 🤖 [**Intelligence Artificielle**](ia.md) — *Chatbots, Générateurs d'images et outils de Machine Learning.*
* 🎬 [**Films & Séries**](film-series.md) — *Streaming, DDL, Torrents et IPTV.*
* 🎵 [**Musique**](musique.md) — *Streaming audio, Radio et outils de production.*
* 🎮 [**Jeux Vidéo**](jeux-videos.md) — *Repacks, Emulation, ROMs et outils gaming.*
* 📚 [**Livres & Mangas**](livre-mangas.md) — *Ebooks, Audiobooks et scan de mangas.*
* 📥 [**Téléchargement Direct**](ddl.md) — *Sites DDL, Débrideurs et Usenet.*
* 🌊 [**Torrents**](torrents.md) — *Trackers publics/privés et clients de téléchargement.*
* 🎓 [**Éducation & Formation**](education.md) — *Cours, Sciences, Langues et IT.*
* 📱 [**Mobile**](mobile.md) — *APKs moddés, iOS Sideloading et outils mobiles.*
* 💻 [**Systèmes d'Exploitation**](os.md) — *Windows, Linux, macOS et optimisation.*
* 📁 [**Logiciels & Outils**](logiciels.md) — *Bureautique, Édition Audio/Vidéo et DevTools.*
* 🌐 [**Web & Création**](web.md) — *Web tools, Social Media et ressources design.*
* 🔧 [**Divers**](divers.md) — *Lifestyle, Santé, Finance et liens utiles.*

---

## 🤝 Contribuer
Une ressource est morte ? Un nouveau site incroyable vient de sortir ? 
Proposez vos liens directement sur notre **Discord** pour que nous puissions mettre à jour le wiki après vérification.
