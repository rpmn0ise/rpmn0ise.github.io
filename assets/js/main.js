/* ============================================================
   MOBILE NAV
   ============================================================ */

document.addEventListener("DOMContentLoaded", function () {
  const toggle = document.getElementById("nav-toggle");
  const nav = document.getElementById("site-nav");

  if (!toggle || !nav) return;

  toggle.addEventListener("click", function () {
    const expanded = toggle.getAttribute("aria-expanded") === "true";
    toggle.setAttribute("aria-expanded", String(!expanded));
    nav.classList.toggle("is-open", !expanded);
    document.body.style.overflow = !expanded ? "hidden" : "";
  });

  // Close on ESC
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && nav.classList.contains("is-open")) {
      toggle.setAttribute("aria-expanded", "false");
      nav.classList.remove("is-open");
      document.body.style.overflow = "";
      toggle.focus();
    }
  });

  // Close on outside click
  document.addEventListener("click", function (e) {
    if (!nav.contains(e.target) && !toggle.contains(e.target)) {
      toggle.setAttribute("aria-expanded", "false");
      nav.classList.remove("is-open");
      document.body.style.overflow = "";
    }
  });
});

/* ============================================================
   LOCAL SEARCH
   ============================================================ */

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

    // Show/hide no results
    const noResults = document.getElementById("no-results");
    if (noResults) {
      const visible = [...items].some((i) => i.style.display !== "none");
      noResults.hidden = visible;
    }
  });
});

/* ============================================================
   ACTIVE NAV LINK
   ============================================================ */

document.addEventListener("DOMContentLoaded", function () {
  const currentPath = window.location.pathname;
  document.querySelectorAll(".site-nav__link").forEach(function (link) {
    const href = link.getAttribute("href");
    if (href === "/" && currentPath === "/") {
      link.classList.add("site-nav__link--active");
      link.setAttribute("aria-current", "page");
    } else if (href !== "/" && currentPath.startsWith(href)) {
      link.classList.add("site-nav__link--active");
    }
  });
});

/* ============================================================
   READING PROGRESS
   ============================================================ */

document.addEventListener("DOMContentLoaded", function () {
  const article = document.querySelector(".post__body");
  if (!article) return;

  const bar = document.createElement("div");
  bar.setAttribute("role", "progressbar");
  bar.setAttribute("aria-label", "Progression de lecture");
  bar.style.cssText =
    "position:fixed;top:0;left:0;height:2px;width:0%;background:var(--accent-primary);z-index:200;transition:width 0.1s linear;";
  document.body.appendChild(bar);

  function update() {
    const rect = article.getBoundingClientRect();
    const total = article.offsetHeight - window.innerHeight;
    const scrolled = -rect.top;
    const pct = Math.min(100, Math.max(0, (scrolled / total) * 100));
    bar.style.width = pct + "%";
    bar.setAttribute("aria-valuenow", Math.round(pct));
  }

  window.addEventListener("scroll", update, { passive: true });
  update();
});

/* ============================================================
   COPY CODE BUTTON
   ============================================================ */

document.addEventListener("DOMContentLoaded", function () {
  document.querySelectorAll("pre[class*='language-']").forEach(function (pre) {
    const btn = document.createElement("button");
    btn.textContent = "Copier";
    btn.setAttribute("aria-label", "Copier le code");
    btn.style.cssText =
      "position:absolute;top:8px;right:8px;padding:4px 10px;font-size:12px;font-family:var(--font-sans);background:var(--bg-elevated);color:var(--text-secondary);border:1px solid var(--border-default);border-radius:4px;cursor:pointer;opacity:0;transition:opacity 0.2s;";

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

/* ============================================================
   INTERSECTION OBSERVER (animations)
   ============================================================ */

document.addEventListener("DOMContentLoaded", function () {
  if (!("IntersectionObserver" in window)) return;

  const observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.style.animationPlayState = "running";
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
  );

  document.querySelectorAll(".animate-fade-up").forEach(function (el) {
    el.style.animationPlayState = "paused";
    observer.observe(el);
  });
});
