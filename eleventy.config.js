// eleventy.config.js

const { DateTime } = require("luxon");
const markdownIt = require("markdown-it");
const markdownItAnchor = require("markdown-it-anchor");
const markdownItAttrs = require("markdown-it-attrs");

const pluginRss = require("@11ty/eleventy-plugin-rss");
const pluginSyntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");
const pluginNavigation = require("@11ty/eleventy-navigation");

// Source unique de vérité des domaines — voir src/_data/domains.json
const domainsData = require("./src/_data/domains.json");

module.exports = function (eleventyConfig) {

  // ─────────────────────────────────────────────
  // Plugins
  // ─────────────────────────────────────────────
  eleventyConfig.addPlugin(pluginRss);

  eleventyConfig.addPlugin(pluginSyntaxHighlight, {
    preAttributes: { tabindex: 0 },
  });

  eleventyConfig.addPlugin(pluginNavigation);

  // ❌ supprimé: plugin reading-time (inexistant / inutile)

  // ─────────────────────────────────────────────
  // Markdown
  // ─────────────────────────────────────────────
  const md = markdownIt({
    html: true,
    breaks: false,
    linkify: true,
    typographer: true,
  })
    .use(markdownItAnchor, {
      permalink: markdownItAnchor.permalink.ariaHidden({
        placement: "after",
        class: "header-anchor",
        symbol: "#",
      }),
      level: [2, 3, 4],
      slugify: eleventyConfig.getFilter("slugify"),
    })
    .use(markdownItAttrs);

  eleventyConfig.setLibrary("md", md);

  // ─────────────────────────────────────────────
  // Passthrough
  // ─────────────────────────────────────────────
  eleventyConfig.addPassthroughCopy("src/assets/images");
  eleventyConfig.addPassthroughCopy("src/assets/fonts");
  eleventyConfig.addPassthroughCopy("src/assets/js");
  eleventyConfig.addPassthroughCopy("src/assets/css");
  eleventyConfig.addPassthroughCopy({ "src/robots.txt": "robots.txt" });
  eleventyConfig.addPassthroughCopy({ "src/favicon.ico": "favicon.ico" });

  // ─────────────────────────────────────────────
  // Watch
  // ─────────────────────────────────────────────
  eleventyConfig.addWatchTarget("src/assets/css/");
  eleventyConfig.addWatchTarget("src/assets/js/");

  // ─────────────────────────────────────────────
  // Collections
  // ─────────────────────────────────────────────
  const isProd = process.env.NODE_ENV === "production";

  eleventyConfig.addCollection("posts", (collectionApi) =>
    collectionApi
      .getFilteredByGlob("src/content/blog/**/*.md")
      .filter((item) => !isProd || !item.data.draft)
      .sort((a, b) => b.date - a.date)
  );

  eleventyConfig.addCollection("projects", (collectionApi) =>
    collectionApi
      .getFilteredByGlob("src/content/projects/**/*.md")
      .filter((item) => !isProd || !item.data.draft)
      .sort((a, b) => (a.data.order || 99) - (b.data.order || 99))
  );

  eleventyConfig.addCollection("notes", (collectionApi) =>
    collectionApi
      .getFilteredByGlob("src/content/notes/**/*.md")
      .filter((item) => !isProd || !item.data.draft)
      .sort((a, b) => b.date - a.date)
  );

  eleventyConfig.addCollection("tagList", (collectionApi) => {
    const tagSet = new Set();

    [
      ...collectionApi.getFilteredByGlob("src/content/blog/**/*.md"),
      ...collectionApi.getFilteredByGlob("src/content/notes/**/*.md"),
    ]
      .filter((item) => !isProd || !item.data.draft)
      .forEach((item) => {
        (item.data.tags || []).forEach((tag) => {
          if (!["post", "posts", "all"].includes(tag)) {
            tagSet.add(tag);
          }
        });
      });

    return [...tagSet].sort();
  });

  // "entries" — le flux unique du labo : articles + notes + projets
  // mélangés chronologiquement. C'est la collection qui matérialise
  // concrètement le concept de journal (homepage, page labo, pages domaine).
  eleventyConfig.addCollection("entries", (collectionApi) => {
    const tag = (items, entryType) =>
      items
        .filter((item) => !isProd || !item.data.draft)
        .map((item) => {
          item.data.entryType = entryType;
          return item;
        });

    const posts = tag(
      collectionApi.getFilteredByGlob("src/content/blog/**/*.md"),
      "article"
    );
    const notes = tag(
      collectionApi.getFilteredByGlob("src/content/notes/**/*.md"),
      "note"
    );
    const projects = tag(
      collectionApi.getFilteredByGlob("src/content/projects/**/*.md"),
      "projet"
    );

    return [...posts, ...notes, ...projects].sort((a, b) => b.date - a.date);
  });

  // "domainStats" — comptage réel par domaine (articles/notes/projets),
  // utilisé par le panneau de navigation et la répartition de la homepage.
  // Une seule fonction de calcul, une seule source de vérité (domains.json).
  eleventyConfig.addCollection("domainStats", (collectionApi) => {
    const filterLive = (items) =>
      items.filter((item) => !isProd || !item.data.draft);

    const posts = filterLive(
      collectionApi.getFilteredByGlob("src/content/blog/**/*.md")
    );
    const notes = filterLive(
      collectionApi.getFilteredByGlob("src/content/notes/**/*.md")
    );
    const projects = filterLive(
      collectionApi.getFilteredByGlob("src/content/projects/**/*.md")
    );

    const stats = domainsData.map((domain) => {
      const articles = posts.filter((p) => p.data.domain === domain.id).length;
      const noteCount = notes.filter((p) => p.data.domain === domain.id).length;
      const projectCount = projects.filter((p) => p.data.domain === domain.id).length;

      return {
        ...domain,
        articles,
        notes: noteCount,
        projects: projectCount,
        total: articles + noteCount + projectCount,
      };
    });

    const maxTotal = Math.max(1, ...stats.map((s) => s.total));

    return stats.map((s) => ({
      ...s,
      pct: s.total > 0 ? Math.max(6, Math.round((s.total / maxTotal) * 100)) : 0,
    }));
  });

  // ─────────────────────────────────────────────
  // Filters
  // ─────────────────────────────────────────────
  eleventyConfig.addFilter("readingTime", (content) => {
    const wordsPerMinute = 200;
    const words = (content || "").split(/\s+/g).length;
    return Math.max(1, Math.ceil(words / wordsPerMinute));
  });

  eleventyConfig.addFilter("readableDate", (date, format, zone) => {
    return DateTime.fromJSDate(date, { zone: zone || "utc" }).toFormat(
      format || "dd LLLL yyyy"
    );
  });

  eleventyConfig.addFilter("htmlDateString", (date) =>
    DateTime.fromJSDate(date, { zone: "utc" }).toFormat("yyyy-LL-dd")
  );

  eleventyConfig.addFilter("isoDate", (date) =>
    DateTime.fromJSDate(date, { zone: "utc" }).toISO()
  );

  eleventyConfig.addFilter("year", () => new Date().getFullYear());

  eleventyConfig.addFilter("limit", (arr, limit) => arr.slice(0, limit));

  eleventyConfig.addFilter("exclude", (arr, item) =>
    (arr || []).filter((i) => i !== item)
  );

  eleventyConfig.addFilter("where", (arr, key, value) =>
    (arr || []).filter((item) => {
      const actual = key.split(".").reduce((obj, k) => (obj == null ? obj : obj[k]), item);
      return actual === value;
    })
  );

  // Pour les champs tableau (ex: tags) — retient les items dont le tableau contient la valeur
  eleventyConfig.addFilter("whereContains", (arr, key, value) =>
    (arr || []).filter((item) => {
      const actual = key.split(".").reduce((obj, k) => (obj == null ? obj : obj[k]), item);
      return Array.isArray(actual) && actual.includes(value);
    })
  );

  eleventyConfig.addFilter("slugify", (str = "") =>
    str
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")
  );

  eleventyConfig.addFilter("absoluteUrl", (url, base) => {
    try {
      return new URL(url, base).href;
    } catch {
      return url;
    }
  });

  // Remplace l'ancien "relatedPosts" (limité à la collection posts) :
  // travaille sur "entries" (articles + notes + projets) et pondère
  // le domaine partagé en plus des tags partagés.
  eleventyConfig.addFilter("relatedEntries", function (item, entries, limit = 3) {
    if (!item || !entries) return [];

    const tags = item.data?.tags || [];
    const domain = item.data?.domain;

    return entries
      .filter((e) => e && e.url && e.url !== item.url && !e.data?.draft)
      .map((e) => {
        const eTags = e.data?.tags || [];
        const sharedTags = eTags.filter((t) => tags.includes(t)).length;
        const domainMatch = domain && e.data?.domain === domain ? 1 : 0;

        return { entry: e, score: sharedTags * 2 + domainMatch };
      })
      .filter((x) => x.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
      .map((x) => x.entry);
  });

  // Navigation précédent/suivant au sein du flux "entries" — remplace
  // previousPost/nextPost qui n'étaient en réalité jamais renseignés
  // nulle part dans le code existant (variables toujours vides).
  eleventyConfig.addFilter("previousEntry", (item, entries) => {
    if (!item || !entries) return null;
    const idx = entries.findIndex((e) => e.url === item.url);
    if (idx === -1 || idx === entries.length - 1) return null;
    return entries[idx + 1];
  });

  eleventyConfig.addFilter("nextEntry", (item, entries) => {
    if (!item || !entries) return null;
    const idx = entries.findIndex((e) => e.url === item.url);
    if (idx <= 0) return null;
    return entries[idx - 1];
  });

  // Numéro de spécimen — stable dans le temps (basé sur l'ordre chronologique
  // réel, pas sur la position dans une sous-liste filtrée). La plus ancienne
  // entrée du labo porte le №1.
  eleventyConfig.addFilter("entryId", (item, entries) => {
    if (!item || !entries) return null;
    const idx = entries.findIndex((e) => e.url === item.url);
    if (idx === -1) return null;
    return entries.length - idx;
  });

  eleventyConfig.addFilter("entryTypeGlyph", (entryType) => {
    const glyphs = { article: "▮", note: "▪", projet: "▲" };
    return glyphs[entryType] || "•";
  });

  // "labStats" — les chiffres du labo lui-même : combien d'entrées, depuis
  // quand, combien de domaines actifs. Sert la homepage et le header —
  // le site se documente lui-même, cohérent avec le concept de labo.
  eleventyConfig.addCollection("labStats", (collectionApi) => {
    const filterLive = (items) => items.filter((i) => !isProd || !i.data.draft);
    const posts = filterLive(collectionApi.getFilteredByGlob("src/content/blog/**/*.md"));
    const notes = filterLive(collectionApi.getFilteredByGlob("src/content/notes/**/*.md"));
    const projects = filterLive(collectionApi.getFilteredByGlob("src/content/projects/**/*.md"));
    const all = [...posts, ...notes, ...projects];

    const years = all.map((i) => i.date.getFullYear()).filter(Boolean);
    const domainsActive = new Set(all.map((i) => i.data.domain).filter(Boolean));
    const activeProjects = projects.filter((p) => p.data.status === "en-cours");

    return {
      totalEntries: all.length,
      totalArticles: posts.length,
      totalNotes: notes.length,
      totalProjects: projects.length,
      activeProjectsCount: activeProjects.length,
      domainsActiveCount: domainsActive.size,
      sinceYear: years.length ? Math.min(...years) : new Date().getFullYear(),
    };
  });

  // Lookup domaine — source unique domains.json (règle de cohérence n°4)
  eleventyConfig.addFilter("domainInfo", (id) =>
    domainsData.find((d) => d.id === id) || null
  );

  // Ligne d'état du header — fonctionnelle, calculée depuis la vraie
  // date de la dernière entrée. Remplace l'ancien compteur "142 entrées".
  eleventyConfig.addFilter("timeAgo", (date) => {
    if (!date) return "";

    const dt = DateTime.fromJSDate(date, { zone: "utc" });
    const days = Math.floor(DateTime.utc().diff(dt, "days").days);

    if (days <= 0) return "aujourd'hui";
    if (days === 1) return "hier";
    if (days < 30) return `il y a ${days} jours`;

    const months = Math.floor(days / 30);
    if (months < 12) return `il y a ${months} mois`;

    const years = Math.floor(months / 12);
    return `il y a ${years} an${years > 1 ? "s" : ""}`;
  });

  // ─────────────────────────────────────────────
  // Shortcodes
  // ─────────────────────────────────────────────
  eleventyConfig.addShortcode("year", () => `${new Date().getFullYear()}`);

  eleventyConfig.addPairedShortcode("callout", (content, type = "info") => {
    return `<div class="callout callout--${type}">${md.render(content)}</div>`;
  });

  eleventyConfig.addShortcode("image", (src, alt = "", caption = "") => {
    return `
      <figure class="post-figure">
        <img src="${src}" alt="${alt}" loading="lazy" decoding="async">
        ${caption ? `<figcaption>${caption}</figcaption>` : ""}
      </figure>
    `;
  });

  // ─────────────────────────────────────────────
  // HTML minify (prod only)
  // ─────────────────────────────────────────────
  if (isProd) {
    const { minify } = require("html-minifier-terser");

    eleventyConfig.addTransform("htmlmin", async function (content) {
      if ((this.page.outputPath || "").endsWith(".html")) {
        return await minify(content, {
          useShortDoctype: true,
          removeComments: true,
          collapseWhitespace: true,
          minifyCSS: true,
          minifyJS: true,
        });
      }
      return content;
    });
  }

  // ─────────────────────────────────────────────
  // Base config
  // ─────────────────────────────────────────────
  return {
    templateFormats: ["md", "njk", "html", "liquid"],
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",

    dir: {
      input: "src",
      output: "_site",
      includes: "_includes",
      layouts: "_includes/layouts",
      data: "_data",
    },

    pathPrefix: "/",
  };
};