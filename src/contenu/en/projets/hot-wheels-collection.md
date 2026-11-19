---
title: "Hot Wheels Collection"
description: "Online catalogue of my Hot Wheels collection, still in their blister packs, powered by a Google Sheets spreadsheet, with photos, filters and detailed pages."
translationKey: collection-hot-wheels
status: en-cours
year: 2026
tech:
  - Google Sheets
  - HTML
  - CSS
  - JavaScript
  - Python
  - Cloudflare Pages
---

Hot Wheels Collection is the catalogue of my Hot Wheels cars, all still in their blister packs. I record each one in a Google Sheets spreadsheet, and a small static site turns it into a public gallery, with a photo and a page for each car.

I have around 50 to 100 cars, mostly Mainlines, and the collection is going to keep growing.

## Why

I wanted to know exactly what I own and find each car easily. I also have duplicates and variants (same model, different colour or year), which need to be told apart. I don't track prices or purchase dates: I don't know them, so they have no place in the inventory.

## What I do there

- I record the cars in batches, one row per physical car.
- I photograph the front of each blister pack with my phone.
- I prepare the photos with a script, then publish the site.

## How it works

**The inventory.** Each car has a personal ID (`HW-001`, `HW-002`…), which is not a Mattel reference. The Mattel code from the back of the blister pack is kept in its own column. I never guess a piece of information: whatever is still to be identified gets the "To check" status. One column automatically spots duplicates, and a statistics tab counts the cars by brand, colour, year and series.

**The site.** The spreadsheet is published as CSV and the page reads it on every visit, with a backup copy if Google doesn't answer. A new row in the spreadsheet becomes a new card, without touching the code. You can search, filter by brand, series, colour, year and type, sort, open a detailed page with its own address for each car, and look at statistics. A car without a photo displays "Photo coming soon".

**The photos.** Each photo carries the ID of its car (`HW-001.jpg`). A Python script sorts them by the time they were taken, renames them, shrinks them to 1200 pixels and removes hidden data, including the GPS location.

```powershell
python prepare_photos.py photos_brutes/lot-01 --start 1 --out site/photos --csv site/data/inventaire.csv
```

## Where the project stands

The inventory is ongoing: the cars are photographed and added to the catalogue as I go. I keep recording them batch by batch.

## Links

- Online collection: https://rpmn0ise-hotwheels.pages.dev/
