---
layout: page.njk
title: À propos
description: Qui je suis, ce que je fais, et pourquoi j'écris.
permalink: /about/
---

<img src="{{ site.author.avatar }}" alt="{{ site.author.name }}"
     width="80" height="80"
     style="border-radius: 50%; border: 2px solid var(--border-default);">

Je suis **{{ site.author.name }}**.

Je construis des choses, je les casse, je comprends pourquoi, et je recommence. Basé en **{{ site.author.location }}**, je travaille principalement sur des systèmes Linux, de l'audio et de la simulation. Pas de case précise : un peu hacker, un peu audiophile, un peu pilote de sim — mais surtout quelqu'un qui préfère comprendre ce qu'il utilise plutôt que de le subir.

---

## Ce sur quoi je travaille

{% set systemes = "systemes" | domainInfo %}
<div class="about-section" style="--section-color: {{ systemes.color }};">
<p class="about-section__label">{{ systemes.label }}</p>

### Linux & systèmes

Mon environnement principal : **CachyOS** avec **Hyprland** et **Waybar**, configurés à la main. J'utilise aussi **Arch Linux** selon les contextes, et Windows uniquement pour les jeux qui l'imposent. Dual boot, environnements séparés, configs versionnées — rien de magique, juste de la rigueur.

J'ai cassé Waybar et systemd en passant. J'avais des backups, c'était reparti en deux heures. C'est comme ça que ça marche.

Du côté sécurité, je m'entraîne sur **Kali**, et j'ai un **Flipper Zero** pour explorer ce qui traîne dans l'air ambiant — RF, NFC, infrarouge. Pas encore en mode CTF sérieux, mais j'apprends à lire les systèmes avant de les toucher.
</div>

{% set ingenierie = "ingenierie" | domainInfo %}
<div class="about-section" style="--section-color: {{ ingenierie.color }};">
<p class="about-section__label">{{ ingenierie.label }}</p>

### Audio

L'audio c'est sérieux ici. À la maison : un ampli cinéma, un ampli sub dédié, et un sub de 14 pouces avec enceintes satellites pour gérer le médium et l'aigu. Dans la voiture de mon père : un système qu'on a monté ensemble, câble par câble, ampli 1000W compris.

Ce qui m'intéresse : l'infrabass, l'équilibre SPL vs qualité sonore, le tuning actif, la conception et la modification d'enceintes selon les besoins. Pas juste écouter — comprendre pourquoi ça sonne comme ça, et comment le faire sonner mieux.

Musicalement : électronique, US rap, rebassed. Le test ultime du système voiture : *Demon Lover* de Devilish Trio.
</div>

{% set simulation = "simulation" | domainInfo %}
<div class="about-section" style="--section-color: {{ simulation.color }};">
<p class="about-section__label">{{ simulation.label }}</p>

### Simulation & gaming

**BeamNG.drive** est ma plateforme principale — pas pour faire des tricks, mais pour comprendre comment un véhicule se comporte aux limites de la physique. Setup : Logitech G29, posé sur bureau. Pas le cockpit de rêve, mais suffisant pour sentir ce qui se passe.

Je joue aussi à **Assetto Corsa** et **Minecraft**, et à quelques autres jeux de simulation. Les FPS, c'est pas mon truc.
</div>

---

## Ce site

Ce site est mon espace personnel — documentation, articles, notes, projets. Tout ce que j'apprends et ce que je construis finit ici d'une façon ou d'une autre : guides techniques, logs, ressources, expérimentations. Pas pour des recruteurs. Pour moi, et pour ceux qui cherchent quelque chose de concret.

---

## Contact & Présence

Email : [{{ site.author.email }}](mailto:{{ site.author.email }})

- **Discord** : rpmn0ise
- **GitHub** : [{{ site.social.github }}]({{ site.social.github }})
