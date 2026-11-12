// Menu Apparence : mode (auto, clair, sombre, AMOLED) et couleur dominante.
// Le script de <head> applique déjà le choix avant l'affichage ; ici on gère le menu et la mémorisation.
(() => {
  const racine = document.documentElement;
  const bouton = document.querySelector("[data-theme-toggle]");
  const menu = document.getElementById("menu-apparence");
  if (!bouton || !menu) return;

  const systeme = window.matchMedia ? matchMedia("(prefers-color-scheme: light)") : null;
  const garder = (cle, valeur) => { try { localStorage.setItem(cle, valeur); } catch (e) { /* stockage indisponible */ } };

  function appliquerMode(mode) {
    racine.dataset.mode = mode;
    racine.dataset.theme = mode === "auto" ? (systeme && systeme.matches ? "light" : "dark") : mode;
  }

  function marquer() {
    menu.querySelectorAll("[data-mode]").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.mode === racine.dataset.mode)));
    menu.querySelectorAll("[data-accent]").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.accent === racine.dataset.accent)));
  }

  function ouvrir(ouvert) {
    menu.hidden = !ouvert;
    bouton.setAttribute("aria-expanded", String(ouvert));
  }

  menu.addEventListener("click", (e) => {
    const cible = e.target.closest("button");
    if (!cible) return;
    if (cible.dataset.mode) { appliquerMode(cible.dataset.mode); garder("theme", cible.dataset.mode); }
    if (cible.dataset.accent) { racine.dataset.accent = cible.dataset.accent; garder("accent", cible.dataset.accent); }
    marquer();
  });

  bouton.addEventListener("click", () => ouvrir(menu.hidden));
  document.addEventListener("click", (e) => { if (!menu.hidden && !menu.contains(e.target) && !bouton.contains(e.target)) ouvrir(false); });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape" && !menu.hidden) { ouvrir(false); bouton.focus(); } });
  if (systeme) systeme.addEventListener("change", () => { if (racine.dataset.mode === "auto") appliquerMode("auto"); });

  marquer();
  bouton.hidden = false;
})();
