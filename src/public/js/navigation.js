// Navigation douce : au clic sur un lien interne, on remplace seulement le contenu de la page (<main>, titre, méta)
// au lieu de la recharger. Résultat : la radio (js/radio.js) continue de jouer d'une page à l'autre.
// Au moindre doute (erreur réseau, lien externe, fichier, clic modifié…), on laisse le navigateur faire une navigation normale.
(() => {
  if (!window.fetch || !window.DOMParser || !window.history || !history.pushState) return;

  const PRINCIPAL = "contenu";
  const METAS = 'meta[name="description"], meta[name="robots"], meta[property^="og:"], meta[property^="article:"], meta[name^="twitter:"], link[rel="canonical"]';
  let jeton = 0;
  let courante = location.pathname + location.search;

  history.scrollRestoration = "manual";
  history.replaceState({ rpm: true, y: 0 }, "");

  function pageHtml(u) {
    return /\.[a-z0-9]+$/i.test(u.pathname) && !/\.html?$/i.test(u.pathname) ? false : true;
  }

  function interne(a) {
    if (!a || !a.href) return null;
    if (a.target && a.target !== "_self") return null;
    if (a.hasAttribute("download") || /\bexternal\b/.test(a.rel)) return null;
    let u;
    try { u = new URL(a.href, location.href); } catch (e) { return null; }
    if (u.origin !== location.origin || !pageHtml(u)) return null;
    return u;
  }

  document.addEventListener("click", (e) => {
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    const u = interne(e.target.closest && e.target.closest("a[href]"));
    if (!u) return;
    // Même page (ancre seulement) : comportement natif.
    if (u.pathname === location.pathname && u.search === location.search) return;
    e.preventDefault();
    aller(u, true);
  });

  // On garde la position de défilement dans l'entrée d'historique, pour la retrouver au retour.
  let attente = 0;
  window.addEventListener("scroll", () => {
    clearTimeout(attente);
    attente = setTimeout(() => history.replaceState({ ...(history.state || {}), rpm: true, y: window.scrollY }, ""), 150);
  }, { passive: true });

  window.addEventListener("popstate", (e) => {
    // Simple changement d'ancre sur la même page : le navigateur s'en charge.
    if (location.pathname + location.search === courante) return;
    aller(new URL(location.href), false, e.state && typeof e.state.y === "number" ? e.state.y : 0);
  });

  function synchroniserTete(doc) {
    document.head.querySelectorAll(METAS).forEach((n) => n.remove());
    doc.head.querySelectorAll(METAS).forEach((n) => document.head.append(document.importNode(n, true)));
    document.title = doc.title;
  }

  function reactiverScripts(racine) {
    racine.querySelectorAll("script").forEach((ancien) => {
      const neuf = document.createElement("script");
      [...ancien.attributes].forEach((a) => neuf.setAttribute(a.name, a.value));
      neuf.textContent = ancien.textContent;
      ancien.replaceWith(neuf);
    });
  }

  function appliquer(doc, u, y) {
    document.dispatchEvent(new CustomEvent("rpm:avant-page"));
    synchroniserTete(doc);
    const nav = document.querySelector(".entete nav");
    const navNeuve = doc.querySelector(".entete nav");
    if (nav && navNeuve) nav.replaceChildren(...[...navNeuve.childNodes].map((n) => document.importNode(n, true)));

    const principal = document.getElementById(PRINCIPAL);
    principal.replaceChildren(...[...doc.getElementById(PRINCIPAL).childNodes].map((n) => document.importNode(n, true)));
    reactiverScripts(principal);

    const cible = u.hash && document.getElementById(decodeURIComponent(u.hash.slice(1)));
    if (cible) cible.scrollIntoView();
    else window.scrollTo(0, y || 0);

    const annonce = document.getElementById("annonce-page");
    if (annonce) annonce.textContent = doc.title;
    principal.setAttribute("tabindex", "-1");
    principal.focus({ preventScroll: true });
    courante = u.pathname + u.search;
    document.dispatchEvent(new CustomEvent("rpm:page"));
  }

  async function aller(u, pousser, y) {
    const moi = ++jeton;
    try {
      const r = await fetch(u.href, { credentials: "same-origin" });
      const type = r.headers.get("content-type") || "";
      // Une page 404 (HTML) s'affiche aussi sans couper la musique.
      if ((!r.ok && r.status !== 404) || !type.includes("text/html")) throw new Error("page non remplaçable");
      const doc = new DOMParser().parseFromString(await r.text(), "text/html");
      if (!doc.getElementById(PRINCIPAL)) throw new Error("structure inattendue");
      if (moi !== jeton) return; // une navigation plus récente a pris le relais

      const finale = new URL(r.url || u.href);
      if (pousser) {
        history.replaceState({ rpm: true, y: window.scrollY }, "");
        history.pushState({ rpm: true, y: 0 }, "", finale.pathname + finale.search + finale.hash);
      }
      const bouger = () => appliquer(doc, finale, y);
      const calme = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (document.startViewTransition && !calme) document.startViewTransition(bouger); else bouger();
    } catch (e) {
      if (moi === jeton) location.href = u.href;
    }
  }
})();
