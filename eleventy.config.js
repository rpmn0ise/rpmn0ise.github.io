// eleventy.config.js

const { DateTime } = require("luxon");
const markdownIt = require("markdown-it");
const markdownItAnchor = require("markdown-it-anchor");
const markdownItAttrs = require("markdown-it-attrs");

const pluginRss = require("@11ty/eleventy-plugin-rss");
const pluginSyntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");
const pluginNavigation = require("@11ty/eleventy-navigation");

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

  eleventyConfig.addCollection("resources", (collectionApi) =>
    collectionApi
      .getFilteredByGlob("src/content/resources/**/*.md")
      .filter((item) => !isProd || !item.data.draft)
      .sort((a, b) => b.date - a.date)
  );

  eleventyConfig.addCollection("notes", (collectionApi) =>
    collectionApi
      .getFilteredByGlob("src/content/notes/**/*.md")
      .filter((item) => !isProd || !item.data.draft)
      .sort((a, b) => b.date - a.date)
  );

  eleventyConfig.addCollection("tagList", (collectionApi) => {
    const tagSet = new Set();

    collectionApi
      .getFilteredByGlob("src/content/blog/**/*.md")
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

  eleventyConfig.addCollection("featured", (collectionApi) =>
    collectionApi
      .getFilteredByGlob("src/content/blog/**/*.md")
      .filter((item) => item.data.featured && !item.data.draft)
      .sort((a, b) => b.date - a.date)
      .slice(0, 3)
  );

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
    (arr || []).filter((item) => item[key] === value)
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

  eleventyConfig.addFilter("relatedPosts", function (post, posts, limit = 3) {
    if (!post || !posts) return [];

    const tags = post.data?.tags || [];

    return posts
      .filter((p) => p && p.url && p.url !== post.url && !p.data?.draft)
      .map((p) => {
        const pTags = p.data?.tags || [];
        const sharedTags = pTags.filter((t) => tags.includes(t)).length;

        return { post: p, score: sharedTags };
      })
      .filter((x) => x.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
      .map((x) => x.post);
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