#!/usr/bin/env node
// Suivi des traductions FR → EN, sans dépendance ni service externe (Node 20+).
//
//   npm run traductions                      état de toutes les traductions
//   npm run traductions -- statut --strict   idem, code d'erreur 1 s'il manque ou si c'est obsolète
//   npm run traductions -- preparer <cle>    prépare un fichier à coller dans Claude (traductions/a-traduire/<cle>.md)
//   npm run traductions -- nouveau <cle> <slug-anglais>   crée le fichier anglais (en brouillon) à partir du français
//   npm run traductions -- valider <cle>     marque la traduction comme à jour (après relecture)
//   npm run traductions -- valider --tout    idem pour toutes les traductions existantes
//
// Fonctionnement : chaque contenu français et sa version anglaise partagent un `translationKey`
// (à défaut, le français prend son nom de fichier). `valider` enregistre dans le fichier anglais
// l'empreinte (`sourceHash`) du français au moment de la relecture : si le français change ensuite,
// l'empreinte ne correspond plus et la traduction est signalée « obsolète ».
import { createHash } from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const RACINE = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const CONTENU = path.join(RACINE, "src", "contenu");
const TYPES = ["journal", "projets", "pages"];

// ── Lecture d'un fichier Markdown : en-tête simple (clé: valeur) + corps
function lire(fichier) {
  const brut = fs.readFileSync(fichier, "utf8").replace(/\r\n/g, "\n");
  const m = brut.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  const champs = {};
  if (m) {
    for (const l of m[1].split("\n")) {
      const k = l.match(/^([A-Za-z][\w-]*):\s*(.*)$/);
      if (k) champs[k[1]] = k[2].replace(/^["']|["']$/g, "").trim();
    }
  }
  return { fichier, brut, champs, corps: m ? m[2] : brut, entete: m ? m[1] : "" };
}

// Empreinte de ce qui se traduit : titre, description, corps.
const empreinte = (c) =>
  createHash("sha256").update([c.champs.title, c.champs.description, c.corps.trim()].join("\n---\n")).digest("hex").slice(0, 12);

function lister(dossier) {
  const sortie = [];
  for (const type of TYPES) {
    const d = path.join(dossier, type);
    if (!fs.existsSync(d)) continue;
    for (const f of fs.readdirSync(d).filter((f) => f.endsWith(".md")).sort()) {
      const c = lire(path.join(d, f));
      c.type = type;
      c.slug = f.slice(0, -3);
      c.cle = c.champs.translationKey || (dossier === CONTENU ? c.slug : "");
      sortie.push(c);
    }
  }
  return sortie;
}

// ── État : une ligne par contenu français, plus les anglais sans équivalent
export function etatTraductions() {
  const fr = lister(CONTENU);
  const en = lister(path.join(CONTENU, "en"));
  const parCle = new Map(en.map((e) => [e.cle, e]));
  const lignes = [];
  for (const f of fr) {
    if (f.champs.draft === "true") continue;
    const e = parCle.get(f.cle);
    let etat;
    if (!e) etat = "a-traduire";
    else if (e.champs.draft === "true") etat = "brouillon";
    else if (!e.champs.sourceHash) etat = "non-validee";
    else if (e.champs.sourceHash !== empreinte(f)) etat = "obsolete";
    else etat = "ok";
    lignes.push({ cle: f.cle, type: f.type, fr: f, en: e, etat });
  }
  const cles = new Set(fr.map((f) => f.cle));
  const orphelines = en.filter((e) => !cles.has(e.cle));
  const doublons = [];
  for (const liste of [fr, en]) {
    const vus = new Set();
    for (const c of liste) { if (vus.has(c.cle)) doublons.push(c); vus.add(c.cle); }
  }
  return { lignes, orphelines, doublons, donnees: donneesManquantes() };
}

// Textes courts des fichiers de données : tout ce qui devrait avoir une version anglaise.
function donneesManquantes() {
  const manque = [];
  const json = (nom) => JSON.parse(fs.readFileSync(path.join(RACINE, "src", "donnees", nom), "utf8"));
  json("citations.json").forEach((c, i) => { if (!c.en) manque.push(`citations.json : citation n° ${i + 1}`); });
  json("erreurs404.json").forEach((e, i) => { if (!e.en || !e.en.titre || !e.en.texte) manque.push(`erreurs404.json : message n° ${i + 1}`); });
  const m = json("musique.json");
  m.selection.forEach((s, i) => { if (!s.note?.en) manque.push(`musique.json : note du morceau n° ${i + 1} (${s.titre})`); });
  if (m.playlist?.note && !m.playlist.note.en) manque.push("musique.json : note de la playlist");
  const n = json("maintenant.json");
  if (n.travaille && !n.travaille.en) manque.push("maintenant.json : « travaille »");
  if (n.setup?.note && !n.setup.note.en) manque.push("maintenant.json : note du setup");
  const tags = json("nomsTags.json");
  for (const f of lister(CONTENU)) {
    for (const t of (f.entete.match(/^tags:\n((?:\s+- .*\n?)+)/m)?.[1] ?? "").split("\n").map((l) => l.replace(/^\s*-\s*/, "").trim()).filter(Boolean)) {
      if (!tags[t]?.en) manque.push(`nomsTags.json : tag « ${t} »`);
    }
  }
  return [...new Set(manque)];
}

const ETIQUETTES = {
  ok: "à jour",
  "a-traduire": "À TRADUIRE",
  obsolete: "OBSOLÈTE (le français a changé)",
  "non-validee": "à valider (relire puis « valider »)",
  brouillon: "brouillon (non publié)",
};

function afficher(e) {
  const largeur = Math.max(...e.lignes.map((l) => l.cle.length), 10);
  for (const l of e.lignes) {
    const cible = l.en ? path.relative(RACINE, l.en.fichier) : "—";
    console.log(`${l.etat === "ok" ? "✓" : "✗"} ${l.type.padEnd(7)} ${l.cle.padEnd(largeur)}  ${ETIQUETTES[l.etat].padEnd(38)} ${cible}`);
  }
  for (const o of e.orphelines) console.log(`? ${o.type.padEnd(7)} ${(o.cle || "(sans translationKey)").padEnd(largeur)}  version anglaise sans français correspondant   ${path.relative(RACINE, o.fichier)}`);
  for (const d of e.doublons) console.log(`! translationKey en double : ${d.cle} (${path.relative(RACINE, d.fichier)})`);
  for (const d of e.donnees) console.log(`✗ données  ${d} : traduction manquante`);
  const nb = (s) => e.lignes.filter((l) => l.etat === s).length;
  console.log(`\n${e.lignes.length} contenus : ${nb("ok")} à jour, ${nb("a-traduire")} à traduire, ${nb("obsolete")} obsolètes, ${nb("non-validee")} à valider, ${nb("brouillon")} brouillons.`);
  if (e.orphelines.length || e.doublons.length || e.donnees.length) console.log(`${e.orphelines.length} orphelin(s), ${e.doublons.length} doublon(s), ${e.donnees.length} donnée(s) sans traduction.`);
}

export const problemes = (e) => e.lignes.filter((l) => l.etat !== "ok").length + e.orphelines.length + e.doublons.length + e.donnees.length;

// ── Commandes
function trouver(cle) {
  const e = etatTraductions();
  const l = e.lignes.find((x) => x.cle === cle);
  if (!l) { console.error(`Erreur : aucun contenu français avec la clé « ${cle} ». Clés : ${e.lignes.map((x) => x.cle).join(", ")}`); process.exit(1); }
  return l;
}

function preparer(cle) {
  const l = trouver(cle);
  const modele = path.join(RACINE, "docs", "prompts", "prompt-traduction.md");
  const consignes = fs.existsSync(modele) ? fs.readFileSync(modele, "utf8") : "Traduis ce contenu du français vers l'anglais, en gardant le ton direct et personnel.";
  const sortie = path.join(RACINE, "traductions", "a-traduire", `${cle}.md`);
  fs.mkdirSync(path.dirname(sortie), { recursive: true });
  const cibleExistante = l.en ? path.relative(RACINE, l.en.fichier) : `src/contenu/en/${l.type}/<slug-anglais>.md`;
  fs.writeFileSync(sortie, `${consignes.trim()}\n\n---\n\nClé de traduction : ${cle}\nFichier anglais à créer ou mettre à jour : ${cibleExistante}\n${l.en ? "\nVersion anglaise actuelle (à mettre à jour) :\n\n```markdown\n" + l.en.brut.trim() + "\n```\n" : ""}\nSource française (${path.relative(RACINE, l.fr.fichier)}) :\n\n\`\`\`\`markdown\n${l.fr.brut.trim()}\n\`\`\`\`\n`);
  console.log(`Prêt : ${path.relative(RACINE, sortie)}\n1. Colle son contenu dans Claude.\n2. Enregistre la réponse dans ${cibleExistante}.\n3. Relis, corrige, puis : npm run traductions -- valider ${cle}`);
}

function nouveau(cle, slug) {
  if (!slug || !/^[a-z0-9-]+$/.test(slug)) { console.error("Usage : nouveau <cle> <slug-anglais>   (slug en minuscules, chiffres et tirets)"); process.exit(1); }
  const l = trouver(cle);
  if (l.en) { console.error(`Erreur : ${path.relative(RACINE, l.en.fichier)} existe déjà.`); process.exit(1); }
  const dossier = path.join(CONTENU, "en", l.type);
  fs.mkdirSync(dossier, { recursive: true });
  const cible = path.join(dossier, `${slug}.md`);
  const entete = l.fr.entete.split("\n").filter((x) => !/^translationKey:|^draft:|^sourceHash:/.test(x));
  fs.writeFileSync(cible, `---\n${entete.join("\n")}\ntranslationKey: ${cle}\ndraft: true\n---\n\n(Traduction à venir : colle ici la version anglaise, traduis aussi title et description ci-dessus, puis retire « draft: true » et lance « valider ${cle} ».)\n`);
  console.log(`Créé (en brouillon, non publié) : ${path.relative(RACINE, cible)}\nÉtape suivante : npm run traductions -- preparer ${cle}`);
}

function valider(cle) {
  const lignes = cle === "--tout" ? etatTraductions().lignes.filter((l) => l.en) : [trouver(cle)];
  for (const l of lignes) {
    if (!l.en) { console.error(`Erreur : pas de version anglaise pour « ${l.cle} ».`); process.exit(1); }
    if (l.en.champs.draft === "true") { console.error(`Erreur : ${path.relative(RACINE, l.en.fichier)} est encore en brouillon (« draft: true »). Retire cette ligne après relecture.`); process.exit(1); }
    const h = empreinte(l.fr);
    let texte = l.en.brut;
    texte = /^sourceHash:.*$/m.test(texte) ? texte.replace(/^sourceHash:.*$/m, `sourceHash: ${h}`) : texte.replace(/^(translationKey:.*)$/m, `$1\nsourceHash: ${h}`);
    fs.writeFileSync(l.en.fichier, texte);
    console.log(`✓ ${l.cle} : traduction marquée à jour (${h})`);
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const [cmd = "statut", ...args] = process.argv.slice(2);
  if (cmd === "statut") { const e = etatTraductions(); afficher(e); if (args.includes("--strict") && problemes(e)) process.exit(1); }
  else if (cmd === "preparer" && args[0]) preparer(args[0]);
  else if (cmd === "nouveau") nouveau(args[0], args[1]);
  else if (cmd === "valider" && args[0]) valider(args[0]);
  else { console.error("Commandes : statut [--strict], preparer <cle>, nouveau <cle> <slug>, valider <cle|--tout>"); process.exit(1); }
}
