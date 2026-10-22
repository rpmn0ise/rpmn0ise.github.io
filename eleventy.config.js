import { readFileSync } from "node:fs";
import pluginRss from "@11ty/eleventy-plugin-rss";
import syntaxHighlight from "@11ty/eleventy-plugin-syntaxhighlight";

const site = JSON.parse(readFileSync("./src/donnees/site.json", "utf8"));

// "build" = production (npm run build) ; "serve" = npm run dev
const production = process.env.ELEVENTY_RUN_MODE === "build";

const STATUTS = {
  "en-cours": "en cours",
  termine: "terminé",
  "en-pause": "en pause",
  abandonne: "abandonné",
};

const dateLongue = new Intl.DateTimeFormat("fr-FR", {
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: "UTC",
});

export default function (eleventyConfig) {
  eleventyConfig.addPlugin(pluginRss);
  eleventyConfig.addPlugin(syntaxHighlight, { preAttributes: { tabindex: 0 } });
  eleventyConfig.amendLibrary("md", (md) => {
    md.set({ linkify: true });
    // Listes de tâches « - [x] fait » / « - [ ] à faire » (syntaxe GFM, absente de markdown-it)
    // taches:debut
    md.core.ruler.after("inline", "taches", (state) => {
      const t = state.tokens;
      for (let i = 2; i < t.length; i++) {
        if (t[i].type !== "inline" || t[i - 1].type !== "paragraph_open" || t[i - 2].type !== "list_item_open") continue;
        const m = t[i].content.match(/^\[([ xX])\] /);
        if (!m) continue;
        t[i].content = t[i].content.slice(4);
        let reste = 4; // retire « [x] » des premiers jetons texte
        for (const c of t[i].children) {
          if (reste <= 0 || c.type !== "text") break;
          const n = Math.min(reste, c.content.length);
          c.content = c.content.slice(n);
          reste -= n;
        }
        t[i - 2].attrJoin("class", m[1] === " " ? "tache" : "tache tache--faite");
      }
    });
    // taches:fin
  });

  // Tout ce qui est dans src/public est copié tel quel à la racine du site.
  eleventyConfig.addPassthroughCopy({ "src/public": "/" });

  // Champs obligatoires + brouillons (visibles en dev, exclus du build).
  eleventyConfig.addPreprocessor("contenu", "md", (data) => {
    const fichier = data.page.inputPath;
    const exiger = (...champs) => {
      const manquants = champs.filter((c) => !data[c]);
      if (manquants.length) {
        throw new Error(`${fichier} : champ(s) obligatoire(s) manquant(s) : ${manquants.join(", ")}`);
      }
    };
    if (fichier.includes("/contenu/journal/")) exiger("title", "date");
    if (fichier.includes("/contenu/projets/")) exiger("title", "description");
    if (production && data.draft) return false;
  });

  // Journal : du plus récent au plus ancien.
  eleventyConfig.addCollection("journal", (api) =>
    api.getFilteredByGlob("src/contenu/journal/*.md").sort((a, b) => b.date - a.date)
  );

  // Projets : année décroissante, puis ordre alphabétique.
  eleventyConfig.addCollection("projets", (api) =>
    api
      .getFilteredByGlob("src/contenu/projets/*.md")
      .sort(
        (a, b) =>
          (b.data.year || 0) - (a.data.year || 0) ||
          a.data.title.localeCompare(b.data.title, "fr")
      )
  );

  // Tags du journal : [{ nom, slug, entrees }], triés par nom.
  eleventyConfig.addCollection("tagList", (api) => {
    const slugify = eleventyConfig.getFilter("slugify");
    const parTag = new Map();
    for (const entree of api.getFilteredByGlob("src/contenu/journal/*.md").sort((a, b) => b.date - a.date)) {
      for (const nom of [].concat(entree.data.tags ?? [])) {
        if (!parTag.has(nom)) parTag.set(nom, []);
        parTag.get(nom).push(entree);
      }
    }
    return [...parTag]
      .map(([nom, entrees]) => ({ nom, slug: slugify(nom), entrees }))
      .sort((a, b) => a.nom.localeCompare(b.nom, "fr"));
  });

  eleventyConfig.addFilter("dateLongue", (date) => dateLongue.format(date));
  eleventyConfig.addFilter("dateIso", (date) => date.toISOString().slice(0, 10));
  eleventyConfig.addFilter("statut", (cle) => STATUTS[cle] ?? cle);
  eleventyConfig.addFilter("limite", (liste, n) => liste.slice(0, n));
  eleventyConfig.addFilter("misEnAvant", (liste) => liste.filter((p) => p.data.featured));
  eleventyConfig.addGlobalData("annee", () => new Date().getFullYear());

  eleventyConfig.on("eleventy.before", () => {
    if (production && site.url.includes("example.com")) {
      console.warn('[!] src/donnees/site.json : "url" est encore le texte provisoire (example.com). À remplacer avant la mise en ligne.');
    }
  });

  return {
    dir: {
      input: "src",
      output: "_site",
      includes: "gabarits",
      layouts: "gabarits",
      data: "donnees",
    },
  };
}
