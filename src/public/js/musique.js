// Indicateur d'écoute, alimenté par Last.fm (qui reçoit les écoutes Spotify).
// Facultatif : si Last.fm ne répond pas, la page reste correcte (voir ecoute.njk).
// Aucun innerHTML : tout ce qui vient de Last.fm passe par textContent.
(() => {
  const blocs = document.querySelectorAll("[data-ecoute]");
  if (!blocs.length) return;

  const GENERIQUE = "2a96cbd8b46e442fc41c2b86b821562f"; // image par défaut de Last.fm : ce n'est pas une vraie pochette
  const INTERVALLE = 30000; // actualisation toutes les 30 s, seulement si l'onglet est visible
  const DELAI = 8000;

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

  async function ecoutes(utilisateur, cle, limite) {
    const url = "https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&format=json" +
      `&user=${encodeURIComponent(utilisateur)}&api_key=${encodeURIComponent(cle)}&limit=${limite}`;
    const j = await requete(url);
    if (j.error) throw new Error(j.message || "Erreur Last.fm");
    const brut = (j.recenttracks && j.recenttracks.track) || [];
    return [].concat(brut).map((t) => {
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
    const cle = "pochette:" + norm(t.artiste) + ":" + norm(t.titre);
    try {
      const memo = sessionStorage.getItem(cle);
      if (memo !== null) return memo;
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
    try { sessionStorage.setItem(cle, trouve); } catch (e) { /* ignoré */ }
    return trouve;
  }

  // ── Affichage
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
      r.statut.textContent = "Dernière écoute" + (t.date ? " · " + depuis(t.date) : "");
    }
    const cle = t.artiste + "|" + t.titre;
    if (bloc._cle === cle) return;
    bloc._cle = cle;
    r.titre.textContent = t.titre;
    if (t.url) r.titre.href = t.url; else r.titre.removeAttribute("href");
    r.artiste.textContent = t.artiste;
    r.pochette.className = "ecoute__pochette";
    r.pochette.replaceChildren(document.createTextNode((t.artiste || t.titre).trim().charAt(0)));
    pochette(t).then((url) => {
      if (!url || bloc._cle !== cle) return;
      const img = el("img");
      img.src = url;
      img.alt = "";
      img.decoding = "async";
      r.pochette.className = "ecoute__pochette ecoute__pochette--image";
      r.pochette.replaceChildren(img);
    });
  }

  function afficherListe(bloc, pistes) {
    const cible = bloc.querySelector("[data-ecoute-liste]");
    if (!cible) return;
    const autres = pistes.slice(1).filter((t) => !t.enCours);
    if (!autres.length) { cible.replaceChildren(); return; }
    const liste = el("ol", "ecoutes__liste");
    for (const t of autres) {
      const li = el("li");
      li.append(el("span", "meta ecoutes__quand", t.date ? depuis(t.date) : ""));
      const corps = el("span", "ecoutes__corps");
      const titre = el(t.url ? "a" : "span", "ecoutes__titre", t.titre);
      if (t.url) { titre.href = t.url; titre.rel = "noopener"; }
      corps.append(titre, el("span", "ecoutes__artiste", t.artiste));
      li.append(corps);
      liste.append(li);
    }
    cible.replaceChildren(el("p", "etiquette ecoutes__etiquette", "Dernières écoutes"), liste);
  }

  function afficher(bloc, pistes) {
    afficherPiste(bloc, pistes[0]);
    afficherListe(bloc, pistes);
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

  const { utilisateur, cle } = blocs[0].dataset;
  const limite = Math.max(...[...blocs].map((b) => Number(b.dataset.nombre) || 1));
  if (!utilisateur || !cle) return;

  let enCours = false;
  async function rafraichir() {
    if (enCours) return;
    enCours = true;
    try {
      const pistes = await ecoutes(utilisateur, cle, limite);
      if (!pistes.length) throw new Error("aucune écoute");
      blocs.forEach((b) => afficher(b, pistes));
    } catch (e) {
      echec();
    } finally {
      enCours = false;
    }
  }

  rafraichir();
  setInterval(() => { if (!document.hidden) rafraichir(); }, INTERVALLE);
  document.addEventListener("visibilitychange", () => { if (!document.hidden) rafraichir(); });
})();
