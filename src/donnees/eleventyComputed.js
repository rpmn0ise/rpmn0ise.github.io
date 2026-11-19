// Données calculées pour toutes les pages :
//  - lang : « fr » par défaut ;
//  - t : les textes d'interface de la langue de la page (src/donnees/i18n.json) ;
//  - cleTraduction : relie les deux versions d'une page (le français prend son nom de fichier à défaut de translationKey).
export default {
  lang: (d) => d.lang || "fr",
  t: (d) => d.i18n[d.lang || "fr"],
  cleTraduction: (d) => d.translationKey || (d.lang === "fr" && d.page?.inputPath?.includes("/contenu/") ? d.page.fileSlug : undefined),
};
