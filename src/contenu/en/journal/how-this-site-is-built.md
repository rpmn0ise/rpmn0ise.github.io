---
title: "How I built this site"
date: 2026-11-11
description: "Eleventy, Markdown, Cloudflare Pages and a listening indicator without a server: the technical choices behind this site, explained simply."
translationKey: comment-ce-site-est-construit
tags:
  - site
  - eleventy
  - technique
---

This site is deliberately simple. Here is how it's made, and why.

## Why a simple site

I have plenty of other projects that take up my time. I didn't want a site that demands maintenance: no database, no server to keep an eye on, no admin system. Just files that I edit, and a site that rebuilds itself.

## The technical foundation

- **Static site**: all the pages are generated in advance, then served as they are. There's no database at all.
- **Eleventy**: the tool that turns my files into web pages. I'm comfortable with Node.js and Eleventy, which weighed in the choice.
- **Markdown**: articles, pages and projects are simple text files with a header. To publish, I add a file.
- **Cloudflare Pages**: the hosting.
- **Light and dark theme**, which follows your device's setting, and a site designed for mobile first.
- **Two languages**, French and English, each page having its own version.

## A listening indicator without a server

The [Music](/en/music/) page shows what I'm listening to, with a "now playing" indicator. To do this without a server, the visitor's browser queries the Last.fm API directly, where my listens are recorded. The site refreshes the information every 30 seconds while the tab is visible.

Last.fm often returns a generic image instead of the real cover art. So the site tries several sources, in order: the Last.fm image, then Cover Art Archive, then an iTunes search, and finally a typographic thumbnail with the initial of the title if nothing was found. The result is kept in memory in the tab so the search isn't repeated.

A useful clarification: when I pause a track, it disappears from the indicator. That's not a bug in the site, it's Last.fm removing the current track when playback stops. A track is only added to the history after half of it or four minutes of listening.

## Small details

- **The quote on the home page** is picked at random from a JSON file every time the page loads. The site checks the file at build time and flags a problem such as a duplicate.
- **The 404 page** shows a random message on each visit.
- **The share preview** (the image and text that appear when you paste a link into Discord) is set up for every page.

## The role of AI

This site was generated with the help of Claude, an AI. I want to say so clearly: it shows my transparency, and I stand by that trust. I knew what I wanted, the structure, the style, the rules for simplicity and content, and everything went the way I wanted.

## What's left to do

The site evolves with my ideas. Adding a page means adding a file. That was exactly the point.
