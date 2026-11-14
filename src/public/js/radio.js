// RPMN0ISE RADIO : lecteur musical aléatoire, fixé en bas à gauche de toutes les pages.
// Une seule bibliothèque (index.json hébergé sur le projet « rpmn0ise-radio »), aucun genre, aucune playlist.
// La lecture continue d'une page à l'autre grâce à la navigation douce (js/navigation.js).
// Aucune requête réseau avant le premier clic sur lecture. Texte dynamique : textContent uniquement.
(() => {
  const racine = document.getElementById("radio");
  if (!racine || !racine.dataset.url) return;

  let origine;
  try { origine = new URL(racine.dataset.url); } catch (e) { return; }

  const CLE = "radio";
  const ERREURS_MAX = 3;
  const HISTORIQUE_MAX = 20;
  const AFFICHES = 10;

  // ── Mémoire locale (volume, état du lecteur, dernier morceau, historique)
  const lire = () => { try { return JSON.parse(localStorage.getItem(CLE)) || {}; } catch (e) { return {}; } };
  let etat = lire();
  const garder = () => { try { localStorage.setItem(CLE, JSON.stringify(etat)); } catch (e) { /* stockage indisponible */ } };
  etat.historique = Array.isArray(etat.historique) ? etat.historique.slice(-HISTORIQUE_MAX) : [];
  if (typeof etat.volume !== "number" || !(etat.volume >= 0 && etat.volume <= 1)) etat.volume = 0.8;

  // ── Structure (statique, sans donnée externe)
  const ICONES = {
    lecture: '<path d="M8 5v14l11-7z"/>',
    pause: '<path d="M7 5h4v14H7zM13 5h4v14h-4z"/>',
    precedent: '<path d="M18 5L9 12l9 7zM5 5h2v14H5z"/>',
    suivant: '<path d="M6 5l9 7-9 7zM17 5h2v14h-2z"/>',
    plus: '<circle cx="5" cy="12" r="1.8"/><circle cx="12" cy="12" r="1.8"/><circle cx="19" cy="12" r="1.8"/>',
    son: '<path d="M4 9v6h4l5 4V5L8 9z"/><path d="M16 8.5a5 5 0 0 1 0 7M18.5 6a8.5 8.5 0 0 1 0 12" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>',
    muet: '<path d="M4 9v6h4l5 4V5L8 9z"/><path d="M16 9l5 6M21 9l-5 6" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>',
  };
  const svg = (nom) => `<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">${ICONES[nom]}</svg>`;

  racine.innerHTML = `
    <div class="radio__panneau" id="radio-panneau" hidden>
      <div class="radio__entete">
        <p class="etiquette">RPMN0ISE RADIO</p>
        <button class="radio__lien" type="button" data-act="masquer">Masquer</button>
      </div>
      <div class="radio__progres">
        <span class="meta" data-temps>0:00</span>
        <input type="range" min="0" max="1000" value="0" step="1" disabled data-progres aria-label="Position dans le morceau">
        <span class="meta" data-duree>0:00</span>
      </div>
      <div class="radio__volume">
        <button class="radio__bouton" type="button" data-act="muet" aria-label="Couper le son">${svg("son")}</button>
        <input type="range" min="0" max="100" value="80" step="1" data-volume aria-label="Volume">
      </div>
      <p class="etiquette radio__sous-titre">Derniers morceaux</p>
      <ol class="radio__histo" data-histo></ol>
      <p class="meta radio__note" data-note>Lecture aléatoire</p>
    </div>
    <div class="radio__barre">
      <button class="radio__pochette" type="button" data-act="lecture" aria-label="Lancer la radio">
        <span class="radio__tuile" data-tuile aria-hidden="true"></span>
        <img data-image alt="" width="44" height="44" decoding="async" referrerpolicy="no-referrer" hidden>
        <span class="radio__icone" data-icone aria-hidden="true">${svg("lecture")}</span>
      </button>
      <div class="radio__texte">
        <p class="radio__titre" data-titre>RPMN0ISE RADIO</p>
        <p class="radio__artiste" data-artiste>Lancer la lecture</p>
      </div>
      <span class="eq radio__eq" aria-hidden="true"><i></i><i></i><i></i></span>
      <button class="radio__bouton" type="button" data-act="precedent" aria-label="Morceau précédent">${svg("precedent")}</button>
      <button class="radio__bouton" type="button" data-act="suivant" aria-label="Morceau suivant">${svg("suivant")}</button>
      <button class="radio__bouton" type="button" data-act="deroule" aria-expanded="false" aria-controls="radio-panneau" aria-label="Plus d'options">${svg("plus")}</button>
    </div>
    <button class="radio__rond" type="button" data-act="afficher" aria-label="Afficher RPMN0ISE RADIO">
      <span class="eq" aria-hidden="true"><i></i><i></i><i></i></span>
    </button>
    <p class="sr-seulement" role="status" data-annonce></p>`;

  const $ = (s) => racine.querySelector(s);
  const ui = {
    panneau: $("#radio-panneau"), deroule: $('[data-act="deroule"]'), lecture: $('[data-act="lecture"]'),
    icone: $("[data-icone]"), tuile: $("[data-tuile]"), image: $("[data-image]"),
    titre: $("[data-titre]"), artiste: $("[data-artiste]"), progres: $("[data-progres]"),
    temps: $("[data-temps]"), duree: $("[data-duree]"), volume: $("[data-volume]"),
    muet: $('[data-act="muet"]'), histo: $("[data-histo]"), note: $("[data-note]"), annonce: $("[data-annonce]"),
  };

  // ── Lecteur audio unique : il survit aux changements de page (navigation douce)
  const audio = new Audio();
  audio.preload = "none";
  audio.volume = etat.volume;

  let index = null;      // morceaux valides de la bibliothèque
  let sac = [];          // ordre aléatoire en cours
  let courant = null;    // morceau affiché ou en lecture
  let erreurs = 0;       // échecs de lecture consécutifs
  let glisse = false;    // l'utilisateur déplace la barre de progression
  let dernierSauvetage = 0;

  const fmt = (s) => {
    if (!isFinite(s) || s < 0) return "0:00";
    return `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`;
  };

  function urlDe(chemin) {
    try {
      const u = new URL(String(chemin), origine);
      return u.origin === origine.origin ? u.href : "";
    } catch (e) { return ""; }
  }

  // ── Affichage
  function majIcone() {
    const joue = !audio.paused && !audio.ended;
    ui.icone.innerHTML = svg(joue ? "pause" : "lecture");
    ui.lecture.setAttribute("aria-label", joue ? "Mettre en pause" : courant ? "Reprendre la lecture" : "Lancer la radio");
    racine.classList.toggle("radio--lecture", joue);
  }

  function majMorceau() {
    ui.titre.textContent = courant ? courant.titre : "RPMN0ISE RADIO";
    ui.artiste.textContent = courant ? courant.artiste : "Lancer la lecture";
    const lettre = courant ? (courant.artiste || courant.titre || "").trim().charAt(0) : "";
    ui.tuile.textContent = lettre;
    const src = courant && courant.pochette ? urlDe(courant.pochette) : "";
    if (src) { ui.image.src = src; ui.image.hidden = false; } else { ui.image.removeAttribute("src"); ui.image.hidden = true; }
    if (!courant) ui.tuile.textContent = "";
    majIcone();
    majHistorique();
    if ("mediaSession" in navigator && courant) {
      const artwork = src ? [{ src }] : [];
      try { navigator.mediaSession.metadata = new MediaMetadata({ title: courant.titre, artist: courant.artiste, album: "RPMN0ISE RADIO", artwork }); } catch (e) { /* ignoré */ }
    }
  }

  function majHistorique() {
    const lignes = etat.historique.slice(-AFFICHES).reverse().map((h, i) => {
      const li = document.createElement("li");
      const bt = document.createElement("button");
      bt.type = "button";
      bt.className = "radio__histo-bouton";
      bt.dataset.rejouer = h.id;
      bt.setAttribute("aria-label", `Rejouer ${h.titre}, ${h.artiste}`);
      if (i === 0 && courant && h.id === courant.id) li.className = "radio__histo-courant";
      const t = document.createElement("span");
      t.className = "radio__histo-titre";
      t.textContent = h.titre;
      const a = document.createElement("span");
      a.className = "radio__histo-artiste";
      a.textContent = h.artiste;
      bt.append(t, a);
      li.append(bt);
      return li;
    });
    if (!lignes.length) {
      const li = document.createElement("li");
      li.className = "radio__histo-vide";
      li.textContent = "Rien pour l'instant.";
      lignes.push(li);
    }
    ui.histo.replaceChildren(...lignes);
  }

  function noter(texte) { ui.note.textContent = texte; }

  function majProgression() {
    const d = audio.duration;
    const ok = isFinite(d) && d > 0;
    ui.progres.disabled = !ok;
    if (!glisse) ui.progres.value = ok ? String(Math.round((audio.currentTime / d) * 1000)) : "0";
    ui.temps.textContent = fmt(audio.currentTime);
    ui.duree.textContent = ok ? fmt(d) : "0:00";
    ui.progres.setAttribute("aria-valuetext", ok ? `${fmt(audio.currentTime)} sur ${fmt(d)}` : "");
  }

  function majVolume() {
    ui.volume.value = String(Math.round(etat.volume * 100));
    ui.muet.innerHTML = svg(audio.muted || etat.volume === 0 ? "muet" : "son");
    ui.muet.setAttribute("aria-label", audio.muted ? "Remettre le son" : "Couper le son");
  }

  // ── Bibliothèque et programmation
  async function charger() {
    if (index) return index;
    const r = await fetch(new URL("index.json", origine).href, { cache: "no-cache" });
    if (!r.ok) throw new Error("HTTP " + r.status);
    const j = await r.json();
    const liste = (Array.isArray(j.morceaux) ? j.morceaux : []).filter((m) =>
      m && typeof m.id === "string" && typeof m.titre === "string" && typeof m.artiste === "string" && urlDe(m.fichier));
    if (!liste.length) throw new Error("bibliothèque vide");
    index = liste;
    noter(`Lecture aléatoire · ${index.length} morceau${index.length > 1 ? "x" : ""}`);
    return index;
  }

  function melanger(t) {
    for (let i = t.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [t[i], t[j]] = [t[j], t[i]];
    }
    return t;
  }

  // Tous les morceaux sont joués avant de recommencer ; les morceaux joués récemment (même lors d'une visite précédente) passent en dernier.
  function construireSac() {
    const n = index.length;
    const k = Math.min(etat.historique.length, Math.floor(n / 2));
    const recents = new Set(etat.historique.slice(etat.historique.length - k).map((h) => h.id));
    const neufs = melanger(index.filter((m) => !recents.has(m.id)));
    const vus = melanger(index.filter((m) => recents.has(m.id)));
    sac = neufs.concat(vus);
    if (sac.length > 1 && courant && sac[0].id === courant.id) sac.push(sac.shift());
  }

  async function suivante() {
    try {
      await charger();
    } catch (e) {
      noter("Radio indisponible pour l'instant.");
      ui.artiste.textContent = "Indisponible pour l'instant";
      majIcone();
      return;
    }
    if (!sac.length) construireSac();
    demarrer(sac.shift(), 0, true);
  }

  async function rejouer(id) {
    try { await charger(); } catch (e) { noter("Radio indisponible pour l'instant."); return; }
    const m = index.find((x) => x.id === id);
    if (!m) { noter("Ce morceau n'est plus dans la radio."); return; }
    sac = sac.filter((x) => x.id !== id);
    demarrer(m, 0, true);
  }

  async function precedente() {
    if (audio.src && audio.currentTime > 3) { audio.currentTime = 0; return; }
    const h = etat.historique;
    const cible = courant && h.length && h[h.length - 1].id === courant.id ? h[h.length - 2] : h[h.length - 1];
    if (!cible) { if (audio.src) audio.currentTime = 0; return; }
    try { await charger(); } catch (e) { noter("Radio indisponible pour l'instant."); return; }
    const m = index.find((x) => x.id === cible.id);
    if (!m) { noter("Ce morceau n'est plus dans la radio."); return; }
    if (courant && h.length && h[h.length - 1].id === courant.id) etat.historique = h.slice(0, -1);
    demarrer(m, 0, true);
  }

  function demarrer(m, position, noterHistorique) {
    courant = { id: m.id, titre: m.titre, artiste: m.artiste, fichier: m.fichier, pochette: m.pochette || "" };
    const url = urlDe(m.fichier);
    audio.src = url;
    if (position > 0) audio.addEventListener("loadedmetadata", () => { try { audio.currentTime = position; } catch (e) { /* ignoré */ } }, { once: true });
    if (noterHistorique) {
      etat.historique = etat.historique.filter((h) => h.id !== m.id);
      etat.historique.push({ id: m.id, titre: m.titre, artiste: m.artiste });
      etat.historique = etat.historique.slice(-HISTORIQUE_MAX);
    }
    etat.piste = { ...courant, position: position || 0 };
    garder();
    majMorceau();
    ui.annonce.textContent = `En lecture : ${m.titre}, ${m.artiste}`;
    const p = audio.play();
    if (p && p.catch) p.catch((e) => { if (e && e.name !== "AbortError") majIcone(); });
  }

  function basculer() {
    if (!courant) { suivante(); return; }
    if (!audio.src) { demarrer(courant, (etat.piste && etat.piste.position) || 0, false); return; }
    if (audio.paused) { const p = audio.play(); if (p && p.catch) p.catch(majIcone); } else audio.pause();
  }

  // ── Événements audio
  audio.addEventListener("playing", () => { erreurs = 0; majIcone(); });
  audio.addEventListener("play", majIcone);
  audio.addEventListener("pause", () => { majIcone(); sauverPosition(true); });
  audio.addEventListener("ended", suivante);
  audio.addEventListener("loadedmetadata", majProgression);
  audio.addEventListener("durationchange", majProgression);
  audio.addEventListener("timeupdate", () => { majProgression(); sauverPosition(false); });
  audio.addEventListener("volumechange", majVolume);
  audio.addEventListener("error", () => {
    if (!audio.src) return;
    erreurs++;
    if (erreurs >= ERREURS_MAX) { noter("Lecture impossible pour l'instant. Réessaie plus tard."); ui.artiste.textContent = "Lecture impossible"; audio.pause(); majIcone(); return; }
    setTimeout(suivante, 400);
  });

  function sauverPosition(force) {
    const t = Date.now();
    if (!courant || (!force && t - dernierSauvetage < 2000)) return;
    dernierSauvetage = t;
    etat.piste = { ...courant, position: Math.floor(audio.currentTime) || 0 };
    garder();
  }
  window.addEventListener("pagehide", () => sauverPosition(true));

  // ── Commandes
  function afficherEtat(masque) {
    racine.classList.toggle("radio--masque", masque);
    document.documentElement.classList.toggle("radio-actif", !masque);
    etat.mode = masque ? "masque" : "compact";
    if (masque) ouvrir(false);
    garder();
  }

  function ouvrir(ouvert) {
    ui.panneau.hidden = !ouvert;
    ui.deroule.setAttribute("aria-expanded", String(ouvert));
  }

  racine.addEventListener("click", (e) => {
    const r = e.target.closest("[data-rejouer]");
    if (r) { rejouer(r.dataset.rejouer); return; }
    const b = e.target.closest("[data-act]");
    if (!b) return;
    switch (b.dataset.act) {
      case "lecture": basculer(); break;
      case "suivant": suivante(); break;
      case "precedent": precedente(); break;
      case "deroule": ouvrir(ui.panneau.hidden); break;
      case "masquer": afficherEtat(true); break;
      case "afficher": afficherEtat(false); ui.lecture.focus(); break;
      case "muet": audio.muted = !audio.muted; break;
    }
  });

  ui.progres.addEventListener("pointerdown", () => { glisse = true; });
  ui.progres.addEventListener("change", () => { glisse = false; });
  ui.progres.addEventListener("input", () => {
    const d = audio.duration;
    if (isFinite(d) && d > 0) { try { audio.currentTime = (Number(ui.progres.value) / 1000) * d; } catch (e) { /* ignoré */ } }
  });
  ui.volume.addEventListener("input", () => {
    etat.volume = Number(ui.volume.value) / 100;
    audio.volume = etat.volume;
    if (audio.muted && etat.volume > 0) audio.muted = false;
    garder();
  });
  racine.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !ui.panneau.hidden) { ouvrir(false); ui.deroule.focus(); }
  });
  document.addEventListener("click", (e) => { if (!ui.panneau.hidden && !racine.contains(e.target)) ouvrir(false); });

  if ("mediaSession" in navigator) {
    const action = (nom, f) => { try { navigator.mediaSession.setActionHandler(nom, f); } catch (e) { /* non pris en charge */ } };
    action("play", basculer);
    action("pause", () => audio.pause());
    action("nexttrack", suivante);
    action("previoustrack", precedente);
    action("seekto", (d) => { if (d && typeof d.seekTime === "number") { try { audio.currentTime = d.seekTime; } catch (e) { /* ignoré */ } } });
  }

  // ── Démarrage : on restaure l'affichage du dernier morceau, sans rien lancer
  if (etat.piste && typeof etat.piste.titre === "string" && typeof etat.piste.fichier === "string" && urlDe(etat.piste.fichier)) {
    courant = { id: String(etat.piste.id || ""), titre: etat.piste.titre, artiste: String(etat.piste.artiste || ""), fichier: etat.piste.fichier, pochette: String(etat.piste.pochette || "") };
  }
  majMorceau();
  majVolume();
  majProgression();
  afficherEtat(etat.mode === "masque");
  racine.hidden = false;
})();
