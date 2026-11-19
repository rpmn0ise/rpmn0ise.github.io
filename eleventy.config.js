import { readFileSync } from "node:fs";
import pluginRss from "@11ty/eleventy-plugin-rss";
import syntaxHighlight from "@11ty/eleventy-plugin-syntaxhighlight";
import { etatTraductions, problemes } from "./outils/traductions.mjs";

const site = JSON.parse(readFileSync("./src/donnees/site.json", "utf8"));
const citations = JSON.parse(readFileSync("./src/donnees/citations.json", "utf8"));
const i18n = JSON.parse(readFileSync("./src/donnees/i18n.json", "utf8"));
const tagsJson = JSON.parse(readFileSync("./src/donnees/nomsTags.json", "utf8"));
const LANGUES = ["fr", "en"];

// "build" = production (npm run build) ; "serve" = npm run dev
const production = process.env.ELEVENTY_RUN_MODE === "build";

// Dates longues : « 14 novembre 2026 » / « 14 November 2026 »
const formats = Object.fromEntries(
  LANGUES.map((l) => [l, new Intl.DateTimeFormat(i18n[l].locale, { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" })])
);

// Nom d'un tag dans une langue (en français, c'est la clé elle-même) et son adresse (/tags/<slug>/).
const nomTag = (cle, lang) => (lang === "fr" ? cle : tagsJson[cle]?.[lang]) ?? cle;

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
    if (/\/contenu\/(en\/)?journal\//.test(fichier)) exiger("title", "date");
    if (/\/contenu\/(en\/)?projets\//.test(fichier)) exiger("title", "description");
    if (fichier.includes("/contenu/en/")) exiger("translationKey");
    if (production && data.draft) return false;
  });

  // Collections par langue : journal-fr / journal-en, projets-fr / projets-en.
  const dossiers = { fr: "src/contenu", en: "src/contenu/en" };
  for (const l of LANGUES) {
    // Journal : du plus récent au plus ancien.
    eleventyConfig.addCollection(`journal-${l}`, (api) =>
      api.getFilteredByGlob(`${dossiers[l]}/journal/*.md`).sort((a, b) => b.date - a.date)
    );
    // Projets : année décroissante, puis ordre alphabétique.
    eleventyConfig.addCollection(`projets-${l}`, (api) =>
      api
        .getFilteredByGlob(`${dossiers[l]}/projets/*.md`)
        .sort((a, b) => (b.data.year || 0) - (a.data.year || 0) || a.data.title.localeCompare(b.data.title, l))
    );
  }

  // Pages de tags (les deux langues) : [{ lang, cle, nom, slug, url, entrees }]
  eleventyConfig.addCollection("tagPages", (api) => {
    const slugify = eleventyConfig.getFilter("slugify");
    const pages = [];
    for (const l of LANGUES) {
      const parTag = new Map();
      for (const entree of api.getFilteredByGlob(`${dossiers[l]}/journal/*.md`).sort((a, b) => b.date - a.date)) {
        for (const cle of [].concat(entree.data.tags ?? [])) {
          if (!parTag.has(cle)) parTag.set(cle, []);
          parTag.get(cle).push(entree);
        }
      }
      for (const [cle, entrees] of parTag) {
        const nom = nomTag(cle, l);
        const slug = slugify(nom);
        pages.push({ lang: l, cle, nom, slug, url: `${i18n[l].routes.tags}${slug}/`, entrees });
      }
    }
    return pages.sort((a, b) => a.nom.localeCompare(b.nom, a.lang));
  });

  // Tags d'une langue, pour la liste du journal : [{ nom, slug, url, entrees }]
  eleventyConfig.addFilter("tagsDeLangue", (pages, lang) => pages.filter((p) => p.lang === lang));
  eleventyConfig.addFilter("nomTag", nomTag);
  eleventyConfig.addFilter("urlTag", (cle, lang) => `${i18n[lang].routes.tags}${eleventyConfig.getFilter("slugify")(nomTag(cle, lang))}/`);

  // Texte à une langue : une chaîne reste telle quelle, un objet { fr, en } donne la bonne langue (français à défaut).
  eleventyConfig.addFilter("loc", (v, lang) => (v && typeof v === "object" && !Array.isArray(v) ? v[lang] ?? v.fr ?? "" : v));
  // Liste d'éléments { fr: {...}, en: {...} } -> liste pour la langue.
  eleventyConfig.addFilter("listeLoc", (liste, lang) => liste.map((x) => x[lang] ?? x.fr));

  // Versions d'une même page : [{ lang, url }] pour une clé de traduction (la page elle-même incluse).
  eleventyConfig.addFilter("versions", (toutes, cle) =>
    cle
      ? toutes
          .filter((p) => p.data.cleTraduction === cle && p.data.lang)
          .map((p) => ({ lang: p.data.lang, url: p.url }))
          .sort((a, b) => LANGUES.indexOf(a.lang) - LANGUES.indexOf(b.lang))
      : []
  );

  eleventyConfig.addFilter("dateLongue", (date, lang = "fr") => formats[lang].format(date));
  eleventyConfig.addFilter("dateIso", (date) => date.toISOString().slice(0, 10));
  eleventyConfig.addFilter("statut", (cle, lang = "fr") => i18n[lang].statuts[cle] ?? cle);
  // Remplace {nom} dans un texte d'interface : {{ "Rejouer {titre}" | remplir({ titre: x }) }}
  eleventyConfig.addFilter("remplir", (texte, valeurs) => texte.replace(/\{(\w+)\}/g, (m, k) => valeurs[k] ?? m));
  eleventyConfig.addFilter("limite", (liste, n) => liste.slice(0, n));
  eleventyConfig.addFilter("misEnAvant", (liste) => liste.filter((p) => p.data.featured));
  eleventyConfig.addGlobalData("annee", () => new Date().getFullYear());

  eleventyConfig.on("eleventy.before", () => {
    // Citations de l'accueil : texte et auteur obligatoires, longueur raisonnable, pas de doublon.
    const vus = new Set();
    citations.forEach((c, i) => {
      if (!c.texte || !c.auteur) throw new Error(`src/donnees/citations.json : la citation n° ${i + 1} doit avoir un "texte" et un "auteur".`);
      if (vus.has(c.texte)) throw new Error(`src/donnees/citations.json : citation en double (n° ${i + 1}) : « ${c.texte} »`);
      vus.add(c.texte);
      if (!c.en) console.warn(`[!] citations.json : la citation n° ${i + 1} n'a pas de traduction ("en").`);
      if (c.texte.length > 140) console.warn(`[!] citations.json : la citation n° ${i + 1} fait ${c.texte.length} caractères (140 conseillés pour tenir sur l'accueil).`);
    });
    // Traductions : un seul message récapitulatif (détails : npm run traductions).
    const etat = etatTraductions();
    const nb = (e) => etat.lignes.filter((l) => l.etat === e).length;
    if (problemes(etat)) {
      console.warn(`[!] Traductions : ${nb("a-traduire")} à traduire, ${nb("obsolete")} obsolète(s), ${nb("non-validee")} à valider, ${etat.orphelines.length + etat.doublons.length} anomalie(s), ${etat.donnees.length} donnée(s) sans traduction. Détails : npm run traductions`);
    }
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
