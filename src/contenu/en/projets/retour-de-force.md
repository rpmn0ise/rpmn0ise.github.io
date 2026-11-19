---
title: "Retour de Force"
description: "Private platform of hand-tested BeamNG.drive mods, with a Discord community. Downloads are available after a Discord login."
translationKey: retour-de-force
status: en-cours
year: 2026
tech:
  - Eleventy
  - Nunjucks
  - Markdown
  - JavaScript
  - CSS
  - Cloudflare Pages
  - Cloudflare Workers
  - GitHub Actions
  - Discord OAuth
  - AES-256-GCM encryption
demo: https://retour-de-force.pages.dev/
featured: true
---

Retour de Force is a site that lists mods for BeamNG.drive: vehicles, maps, scenarios and configs. Every mod is tested by hand before it's published, and the site has no ads at all.

I run the site and its Discord server on my own. The project was launched on 20 March 2026.

## Why

Sites that host mods are full of misleading ads and fake download buttons, and some links end up disappearing. I wanted a place where only what works is kept, with a small and respectful community.

## What I do there

- I build and maintain the site.
- I select and test the mods.
- I run the Discord server and its moderation.
- I create the visuals, such as the channel banners.

## How it works

- The site is static, generated with Eleventy. Each mod is a Markdown file with its header (frontmatter).
- It's hosted on Cloudflare Pages and can be browsed without an account.
- The site doesn't store any mod files: the links point to third-party hosts, such as FileDitch.
- To download, you have to log in with Discord and have the access role. The links are encrypted in the site's code, and a Cloudflare Worker provides the decryption code after the login.
- A GitHub Actions workflow automatically announces each new mod on Discord.

## Where the project stands

The project has been running since its launch on 20 March 2026. The catalogue keeps evolving: I add new mods after testing them and I plan to sort through the older ones.

## Links

- [The site](https://retour-de-force.pages.dev/)
- [The Discord server](https://discord.gg/XZuxq9hpTb)
