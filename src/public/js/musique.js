// Indicateur d'écoute, historique et classements, alimentés par Last.fm (qui reçoit les écoutes Spotify).
// Facultatif : si Last.fm ne répond pas, la page reste correcte (voir ecoute.njk et musique.njk).
// Aucun innerHTML : tout ce qui vient de Last.fm passe par textContent.
(() => {
  // La page peut être remplacée sans rechargement (navigation.js) : on relance à chaque page, et on arrête avant de la quitter.
  function demarrer() {
    const blocs = document.querySelectorAll("[data-ecoute]");
    const classements = document.querySelector("[data-classements]");
    if (!blocs.length && !classements) return null;

    const GENERIQUE = "2a96cbd8b46e442fc41c2b86b821562f"; // image par défaut de Last.fm : ce n'est pas une vraie pochette
    const INTERVALLE = 30000; // actualisation toutes les 30 s, seulement si l'onglet est visible
    const DELAI = 8000;
    const PAGES_MAX = 10; // « Voir plus » s'arrête après 10 pages

    const el = (tag, classe, texte) => {
      const e = document.createElement(tag);
      if (classe) e.className = classe;
      if (texte != null) e.textContent = texte;
      return e;
    };

    const norm = (s) => String(s || "").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]/g, "");

    function depuis(uts) {
      const s = Math.max(0, Math.floor(Date.now() / 1000) - uts);
      if (s < 60) return "à l'instant";
      if (s < 3600) return `il y a ${Math.floor(s / 60)} min`;
      if (s < 86400) return `il y a ${Math.floor(s / 3600)} h`;
      if (s < 7 * 86400) return `il y a ${Math.floor(s / 86400)} j`;
      return new Date(uts * 1000).toLocaleDateString("fr-FR", { day: "numeric", month: "long" });
    }

    async function requete(url) {
      const stop = new AbortController();
      const minuteur = setTimeout(() => stop.abort(), DELAI);
      try {
        const r = await fetch(url, { signal: stop.signal });
        if (!r.ok) throw new Error("HTTP " + r.status);
        return await r.json();
      } finally {
        clearTimeout(minuteur);
      }
    }

    const source = (blocs[0] || classements).dataset;
    const utilisateur = source.utilisateur;
    const cle = source.cle;
    if (!utilisateur || !cle) return null;

    async function lastfm(methode, extra) {
      const url = "https://ws.audioscrobbler.com/2.0/?format=json" +
        `&method=${methode}&user=${encodeURIComponent(utilisateur)}&api_key=${encodeURIComponent(cle)}&${extra}`;
      const j = await requete(url);
      if (j.error) throw new Error(j.message || "Erreur Last.fm");
      return j;
    }

    async function ecoutes(limite, page) {
      const j = await lastfm("user.getrecenttracks", `limit=${limite}&page=${page}`);
      const rt = j.recenttracks || {};
      const pistes = [].concat(rt.track || []).map((t) => {
        const images = Array.isArray(t.image) ? t.image : [];
        const grande = images.length ? images[images.length - 1]["#text"] : "";
        return {
          titre: t.name || "",
          artiste: (t.artist && (t.artist["#text"] || t.artist.name)) || "",
          albumMbid: (t.album && t.album.mbid) || "",
          url: t.url || "",
          enCours: !!(t["@attr"] && t["@attr"].nowplaying === "true"),
          date: t.date ? Number(t.date.uts) : null,
          image: grande && !grande.includes(GENERIQUE) ? grande : "",
        };
      }).filter((t) => t.titre);
      return { pistes, pages: Number(rt["@attr"] && rt["@attr"].totalPages) || 1 };
    }

    // ── Pochettes : Last.fm (si ce n'est pas l'image générique) → Cover Art Archive → iTunes → rien
    function chargerImage(url) {
      return new Promise((ok, ko) => {
        const i = new Image();
        i.onload = () => ok(url);
        i.onerror = () => ko(new Error("image"));
        i.src = url;
      });
    }

    async function pochetteItunes(t) {
      const j = await requete(`https://itunes.apple.com/search?entity=song&limit=5&country=FR&term=${encodeURIComponent(t.artiste + " " + t.titre)}`);
      const bon = (j.results || []).find((x) =>
        (norm(x.artistName).includes(norm(t.artiste)) || norm(t.artiste).includes(norm(x.artistName))) &&
        (norm(x.trackName).includes(norm(t.titre)) || norm(t.titre).includes(norm(x.trackName))));
      return bon && bon.artworkUrl100 ? bon.artworkUrl100.replace("100x100bb", "300x300bb") : "";
    }

    async function pochette(t) {
      const memo = "pochette:" + norm(t.artiste) + ":" + norm(t.titre);
      try {
        const m = sessionStorage.getItem(memo);
        if (m !== null) return m;
      } catch (e) { /* stockage indisponible */ }
      const essais = [
        async () => t.image,
        async () => (t.albumMbid ? `https://coverartarchive.org/release/${t.albumMbid}/front-250` : ""),
        () => pochetteItunes(t),
      ];
      let trouve = "";
      for (const essai of essais) {
        try {
          const url = await essai();
          if (url) { trouve = await chargerImage(url); break; }
        } catch (e) { /* source suivante */ }
      }
      try { sessionStorage.setItem(memo, trouve); } catch (e) { /* ignoré */ }
      return trouve;
    }

    // ── Écoute en cours
    function construirePiste(bloc) {
      const cible = bloc.querySelector("[data-ecoute-piste]");
      const refs = {
        pochette: el("span", "ecoute__pochette"),
        statut: el("p", "etiquette ecoute__statut"),
        titre: el("a", "ecoute__titre"),
        artiste: el("p", "ecoute__artiste"),
      };
      refs.pochette.setAttribute("aria-hidden", "true");
      refs.titre.rel = "noopener";
      const texte = el("div", "ecoute__texte");
      texte.append(refs.statut, refs.titre, refs.artiste);
      cible.replaceChildren(refs.pochette, texte);
      bloc._refs = refs;
      return refs;
    }

    function afficherPiste(bloc, t) {
      const r = bloc._refs || construirePiste(bloc);
      r.statut.replaceChildren();
      if (t.enCours) {
        const eq = el("span", "eq");
        eq.setAttribute("aria-hidden", "true");
        eq.append(el("i"), el("i"), el("i"));
        r.statut.append(eq, document.createTextNode("En écoute"));
      } else {
        r.statut.textContent = "Dernier morceau enregistré" + (t.date ? " · " + depuis(t.date) : "");
      }
      const memo = t.artiste + "|" + t.titre;
      if (bloc._cle === memo) return;
      bloc._cle = memo;
      r.titre.textContent = t.titre;
      if (t.url) r.titre.href = t.url; else r.titre.removeAttribute("href");
      r.artiste.textContent = t.artiste;
      r.pochette.className = "ecoute__pochette";
      r.pochette.replaceChildren(document.createTextNode((t.artiste || t.titre).trim().charAt(0)));
      pochette(t).then((url) => {
        if (!url || bloc._cle !== memo) return;
        const img = el("img");
        img.src = url;
        img.alt = "";
        img.decoding = "async";
        r.pochette.className = "ecoute__pochette ecoute__pochette--image";
        r.pochette.replaceChildren(img);
      });
    }

    // ── Dernières écoutes + « Voir plus »
    function ligne(t) {
      const li = el("li");
      li.dataset.cle = (t.date || 0) + "|" + t.artiste + "|" + t.titre;
      li._uts = t.date;
      li.append(el("span", "meta ecoutes__quand", t.date ? depuis(t.date) : ""));
      const corps = el("span", "ecoutes__corps");
      const titre = el(t.url ? "a" : "span", "ecoutes__titre", t.titre);
      if (t.url) { titre.href = t.url; titre.rel = "noopener"; }
      corps.append(titre, el("span", "ecoutes__artiste", t.artiste));
      li.append(corps);
      return li;
    }

    function construireListe(bloc) {
      const cible = bloc.querySelector("[data-ecoute-liste]");
      const liste = {
        etiquette: el("p", "etiquette ecoutes__etiquette", "Dernières écoutes"),
        ol: el("ol", "ecoutes__liste"),
        plus: el("button", "bouton-plus", "Voir plus"),
        extras: [], // lignes des pages 2, 3… déjà chargées
        page: 1,
        pages: 1,
      };
      liste.plus.type = "button";
      liste.plus.hidden = true;
      liste.plus.addEventListener("click", () => pageSuivante(bloc));
      cible.replaceChildren(liste.etiquette, liste.ol, liste.plus);
      bloc._liste = liste;
      return liste;
    }

    function afficherListe(bloc) {
      if (!bloc.querySelector("[data-ecoute-liste]")) return;
      const L = bloc._liste || construireListe(bloc);
      const premiere = bloc._dernieres.slice(1).filter((t) => !t.enCours).map(ligne);
      const vues = new Set(premiere.map((li) => li.dataset.cle));
      L.extras = L.extras.filter((li) => !vues.has(li.dataset.cle));
      for (const li of L.extras) li.firstChild.textContent = li._uts ? depuis(li._uts) : "";
      L.ol.replaceChildren(...premiere, ...L.extras);
      L.etiquette.hidden = L.ol.children.length === 0;
      L.plus.hidden = L.page >= Math.min(L.pages, PAGES_MAX);
    }

    async function pageSuivante(bloc) {
      const L = bloc._liste;
      L.plus.disabled = true;
      L.plus.textContent = "Chargement…";
      try {
        const r = await ecoutes(limite, L.page + 1);
        L.page += 1;
        L.pages = r.pages;
        const connues = new Set([...L.ol.children].map((li) => li.dataset.cle));
        for (const t of r.pistes.filter((p) => !p.enCours)) {
          const li = ligne(t);
          if (!connues.has(li.dataset.cle)) L.extras.push(li);
        }
        L.plus.textContent = "Voir plus";
        afficherListe(bloc);
      } catch (e) {
        L.plus.textContent = "Réessayer";
      } finally {
        L.plus.disabled = false;
      }
    }

    function afficher(bloc, pistes, pages) {
      bloc._dernieres = pistes;
      afficherPiste(bloc, pistes[0]);
      afficherListe(bloc);
      if (bloc._liste) bloc._liste.pages = pages;
      if (bloc._liste) bloc._liste.plus.hidden = bloc._liste.page >= Math.min(pages, PAGES_MAX);
      bloc._ok = true;
      bloc.hidden = false;
      const parent = bloc.closest("[data-maintenant]");
      if (parent) parent.hidden = false;
      const vide = document.querySelector("[data-ecoute-vide]");
      if (vide) vide.hidden = true;
    }

    function echec() {
      // On garde l'affichage précédent s'il y en a un ; sinon on prévient seulement si la page le prévoit.
      if ([...blocs].some((b) => b._ok || !b.hidden)) return;
      const vide = document.querySelector("[data-ecoute-vide]");
      if (vide) vide.hidden = false;
    }

    const limite = blocs.length ? Math.max(...[...blocs].map((b) => Number(b.dataset.nombre) || 1)) : 1;

    let enCours = false;
    async function rafraichir() {
      if (enCours) return;
      enCours = true;
      try {
        const { pistes, pages } = await ecoutes(limite, 1);
        if (!pistes.length) throw new Error("aucune écoute");
        blocs.forEach((b) => afficher(b, pistes, pages));
      } catch (e) {
        echec();
      } finally {
        enCours = false;
      }
    }

    let minuteur = null;
    const surVisibilite = () => { if (!document.hidden) rafraichir(); };
    if (blocs.length) {
      rafraichir();
      minuteur = setInterval(() => { if (!document.hidden) rafraichir(); }, INTERVALLE);
      document.addEventListener("visibilitychange", surVisibilite);
    }

    // ── Classements : morceaux du mois, artistes de la semaine (chargés une fois)
    async function classement(methode, periode, lire) {
      const j = await lastfm(methode, `period=${periode}&limit=5`);
      const brut = lire(j);
      return [].concat(brut || []).map((x) => ({
        nom: x.name || "",
        artiste: (x.artist && (x.artist.name || x.artist["#text"])) || "",
        n: Number(x.playcount) || 0,
        url: x.url || "",
      })).filter((x) => x.nom);
    }

    function colonne(titre, items) {
      const bloc = el("div", "classement");
      bloc.append(el("p", "etiquette classement__etiquette", titre));
      const ol = el("ol", "classement__liste");
      items.forEach((x, i) => {
        const li = el("li");
        li.append(el("span", "meta classement__rang", String(i + 1).padStart(2, "0")));
        const corps = el("span", "classement__corps");
        const nom = el(x.url ? "a" : "span", "classement__nom", x.nom);
        if (x.url) { nom.href = x.url; nom.rel = "noopener"; }
        corps.append(nom);
        if (x.artiste) corps.append(el("span", "classement__artiste", x.artiste));
        li.append(corps, el("span", "meta classement__n", x.n + (x.n > 1 ? " écoutes" : " écoute")));
        ol.append(li);
      });
      bloc.append(ol);
      return bloc;
    }

    async function chargerClassements() {
      const [morceaux, artistes] = await Promise.allSettled([
        classement("user.gettoptracks", "1month", (j) => j.toptracks && j.toptracks.track),
        classement("user.gettopartists", "1month", (j) => j.topartists && j.topartists.artist),
      ]);
      const colonnes = [];
      if (morceaux.status === "fulfilled" && morceaux.value.length) colonnes.push(colonne("Morceaux du mois", morceaux.value));
      if (artistes.status === "fulfilled" && artistes.value.length) colonnes.push(colonne("Artistes du mois", artistes.value));
      if (!colonnes.length) return;
      classements.replaceChildren(...colonnes);
      const section = classements.closest("[data-classements-section]");
      if (section) section.hidden = false;
    }

    if (classements) chargerClassements().catch(() => { /* la section reste masquée */ });

    // Arrêt propre quand on quitte la page (navigation douce, voir navigation.js)
    return () => {
      if (minuteur) clearInterval(minuteur);
      document.removeEventListener("visibilitychange", surVisibilite);
    };
  }

  let arret = null;
  const lancer = () => { arret = demarrer(); };
  document.addEventListener("rpm:avant-page", () => { if (arret) { arret(); arret = null; } });
  document.addEventListener("rpm:page", lancer);
  lancer();
})();
