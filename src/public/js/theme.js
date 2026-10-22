// Bascule clair/sombre. Sans ce script, le site suit la préférence du système.
(() => {
  const racine = document.documentElement;
  const bouton = document.querySelector("[data-theme-toggle]");
  if (!bouton) return;

  const sysSombre = window.matchMedia("(prefers-color-scheme: dark)");
  const actuel = () => racine.dataset.theme || (sysSombre.matches ? "dark" : "light");

  function afficher() {
    const cible = actuel() === "dark" ? "clair" : "sombre";
    bouton.textContent = cible;
    bouton.setAttribute("aria-label", `Passer au thème ${cible}`);
    bouton.hidden = false;
  }

  bouton.addEventListener("click", () => {
    const suivant = actuel() === "dark" ? "light" : "dark";
    racine.dataset.theme = suivant;
    try { localStorage.setItem("theme", suivant); } catch (e) { /* stockage indisponible */ }
    afficher();
  });

  sysSombre.addEventListener("change", afficher);
  afficher();
})();
