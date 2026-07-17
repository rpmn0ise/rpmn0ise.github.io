/* ============================================================
   TOC — scrollspy du sommaire dans la marge de laboratoire
   ============================================================ */

document.addEventListener("DOMContentLoaded", function () {
  const tocList = document.getElementById("toc-list");
  if (!tocList) return;

  const links = tocList.querySelectorAll("[data-toc-link]");
  if (!links.length) return;

  const targets = [];
  links.forEach(function (link) {
    const id = link.getAttribute("data-toc-target");
    const heading = document.getElementById(id);
    if (heading) targets.push({ id, link, heading });
  });

  if (!targets.length) return;

  function setActive(id) {
    links.forEach(function (link) {
      if (link.getAttribute("data-toc-target") === id) {
        link.setAttribute("data-toc-active", "true");
      } else {
        link.removeAttribute("data-toc-active");
      }
    });
  }

  let currentId = null;

  const observer = new IntersectionObserver(
    function (entries) {
      // Le titre le plus proche du haut du viewport parmi ceux visibles.
      const visible = entries
        .filter((e) => e.isIntersecting)
        .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);

      if (visible.length) {
        const id = visible[0].target.id;
        if (id !== currentId) {
          currentId = id;
          setActive(id);
        }
      }
    },
    {
      rootMargin: "-96px 0px -70% 0px",
      threshold: 0,
    }
  );

  targets.forEach((t) => observer.observe(t.heading));

  // Titre initial actif au chargement (avant tout scroll).
  setActive(targets[0].id);
});
