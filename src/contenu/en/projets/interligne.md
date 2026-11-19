---
title: "Interligne"
description: "French-language fanzine of news and discoveries: articles written by AI, subjects chosen and checked by me, sources and reliability displayed."
translationKey: interligne
status: en-cours
year: 2026
tech:
  - Eleventy
  - Markdown
  - Nunjucks
  - HTML and CSS
  - JavaScript
  - Node.js
  - GitHub
  - Cloudflare Pages
demo: https://interligne.pages.dev
---

Interligne is a personal fanzine in French. It publishes articles on a range of subjects (science, computing, artificial intelligence, video games) that I choose because they surprised me, interest me or are new.

The texts are written by an AI, from sources that I provide. I choose the subjects, I check the content by comparing it with the sources, I write my opinion and I publish. Each article displays its sources and a reliability level.

## Why

I wanted a publication of my own, with real freedom of subject, without being limited to a single theme. The idea comes from the site of a NSI (computer science) teacher, Mon petit informaticien. I also wanted to use an AI to write without leaving it the editorial decisions, and to say so clearly to readers.

## What I do there

- I choose the subjects and gather the sources, looking first for where the information comes from.
- I give the text of those sources to the AI, which writes the article.
- I check the figures, dates, names and quotes against the sources.
- I write the opinion that goes with each article myself.
- I designed how the site works and its layout, and the AI wrote the code.

## How it works

The site is static: it has no server and no database. Eleventy generates the pages from Markdown files, one per article, with a YAML header that contains the title, the date, the sources, the reliability level and the date of verification.

An article goes through five statuses: idea, draft, to check, validated, published. The site only displays published articles. A script written in Node.js blocks publication if a published article has no source, no reliability level or no verification date.

The reliability level is solid, partial or fragile. A fragile article displays a warning at the top of the page. Corrections made after publication are dated and gathered on a dedicated page.

The site also offers an RSS feed, a sitemap and a light or dark theme, automatic or chosen by hand. The fonts are hosted with the site.

## Where the project stands

The site has been online since October 2026. I publish about one article a week, and I keep adjusting the method and the layout as the articles go. The code is in a private repository.

## Links

- [The site](https://interligne.pages.dev/)
- [The editorial approach](https://interligne.pages.dev/demarche/)
- [Corrections](https://interligne.pages.dev/corrections/)
- [The RSS feed](https://interligne.pages.dev/feed.xml)
