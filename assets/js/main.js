/* ============================================================
   MAIN — comportements fonctionnels uniquement.
   (la navigation est gérée par nav-panel.js)
   ============================================================ */

/* ─── Recherche locale (page labo) ─── */

document.addEventListener("DOMContentLoaded", function () {
  const searchInput = document.getElementById("search-input");
  if (!searchInput) return;

  const items = document.querySelectorAll("[data-search-item]");

  function normalize(str) {
    return str
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");
  }

  searchInput.addEventListener("input", function () {
    const query = normalize(this.value.trim());

    items.forEach(function (item) {
      const text = normalize(item.getAttribute("data-search-item") || item.textContent);
      const match = !query || text.includes(query);
      item.style.display = match ? "" : "none";
    });

    const noResults = document.getElementById("no-results");
    if (noResults) {
      const visible = [...items].some((i) => i.style.display !== "none");
      noResults.hidden = visible;
    }
  });
});

/* ─── Filtres domaine + type (page labo) ─── */

document.addEventListener("DOMContentLoaded", function () {
  const domainLinks = document.querySelectorAll("[data-domain-filter]");
  const typeLinks = document.querySelectorAll("[data-type-filter]");
  const items = document.querySelectorAll("[data-entry-domain]");
  if (!items.length) return;

  let activeDomain = "tous";
  let activeType = "tous";

  function apply() {
    items.forEach(function (item) {
      const domainMatch = activeDomain === "tous" || item.getAttribute("data-entry-domain") === activeDomain;
      const typeMatch = activeType === "tous" || item.getAttribute("data-entry-type") === activeType;
      item.style.display = domainMatch && typeMatch ? "" : "none";
    });
  }

  domainLinks.forEach(function (link) {
    link.addEventListener("click", function (e) {
      e.preventDefault();
      activeDomain = link.getAttribute("data-domain-filter");
      domainLinks.forEach((l) => l.classList.remove("tag--active"));
      link.classList.add("tag--active");
      apply();
    });
  });

  typeLinks.forEach(function (link) {
    link.addEventListener("click", function (e) {
      e.preventDefault();
      activeType = link.getAttribute("data-type-filter");
      typeLinks.forEach((l) => l.classList.remove("tag--active"));
      link.classList.add("tag--active");
      apply();
    });
  });
});

/* ─── Barre de progression de lecture ─── */

document.addEventListener("DOMContentLoaded", function () {
  const article = document.querySelector(".post__body, .project-detail__body");
  if (!article) return;

  const bar = document.createElement("div");
  bar.setAttribute("role", "progressbar");
  bar.setAttribute("aria-label", "Progression de lecture");
  bar.style.cssText =
    "position:fixed;top:0;left:0;height:2px;width:0%;background:var(--accent-primary);z-index:150;transition:width 0.1s linear;";
  document.body.appendChild(bar);

  function update() {
    const rect = article.getBoundingClientRect();
    const total = article.offsetHeight - window.innerHeight;
    const scrolled = -rect.top;
    const pct = total > 0 ? Math.min(100, Math.max(0, (scrolled / total) * 100)) : 0;
    bar.style.width = pct + "%";
    bar.setAttribute("aria-valuenow", Math.round(pct));
  }

  window.addEventListener("scroll", update, { passive: true });
  update();
});

/* ─── Bouton copier le code ─── */

document.addEventListener("DOMContentLoaded", function () {
  document.querySelectorAll("pre[class*='language-']").forEach(function (pre) {
    const btn = document.createElement("button");
    btn.textContent = "Copier";
    btn.setAttribute("aria-label", "Copier le code");
    btn.style.cssText =
      "position:absolute;top:8px;right:8px;padding:4px 10px;font-size:12px;font-family:var(--font-sans);background:var(--bg-elevated);color:var(--text-secondary);border:1px solid var(--border-default);border-radius:var(--radius-sm);cursor:pointer;opacity:0;transition:opacity var(--transition-fast);";

    pre.style.position = "relative";
    pre.appendChild(btn);

    pre.addEventListener("mouseenter", () => (btn.style.opacity = "1"));
    pre.addEventListener("mouseleave", () => (btn.style.opacity = "0"));

    btn.addEventListener("click", function () {
      const code = pre.querySelector("code");
      if (!code) return;

      navigator.clipboard.writeText(code.textContent).then(() => {
        btn.textContent = "Copié !";
        btn.style.color = "var(--success)";
        setTimeout(() => {
          btn.textContent = "Copier";
          btn.style.color = "var(--text-secondary)";
        }, 2000);
      });
    });
  });
});
