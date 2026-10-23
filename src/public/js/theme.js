// Bascule clair/sombre. Au premier passage, le thème suit celui du système (sombre à défaut) ; le choix est ensuite mémorisé.
(() => {
  const racine = document.documentElement;
  const bouton = document.querySelector("[data-theme-toggle]");
  if (!bouton) return;

  const actuel = () => (racine.dataset.theme === "light" ? "light" : "dark");

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

  afficher();
})();
