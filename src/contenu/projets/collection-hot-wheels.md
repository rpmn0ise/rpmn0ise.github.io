---
title: "Collection Hot Wheels"
description: "Catalogue en ligne de ma collection de Hot Wheels sous blister, alimenté par un tableur Google Sheets, avec photos, filtres et fiches détaillées."
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

Collection Hot Wheels est le catalogue de mes voitures Hot Wheels, toutes encore sous blister. Je recense chaque exemplaire dans un tableur Google Sheets, et un petit site statique en fait une galerie publique, avec une photo et une fiche par voiture.

J'ai environ 50 à 100 voitures, surtout des Mainline, et la collection va continuer de grandir.

## Pourquoi

Je voulais savoir exactement ce que je possède et retrouver chaque voiture facilement. J'ai aussi des doublons et des variantes (même modèle, couleur ou année différente), qu'il faut pouvoir distinguer. Je ne suis ni les prix ni les dates d'achat : je ne les connais pas, donc ils n'ont pas leur place dans l'inventaire.

## Ce que j'y fais

- Je recense les voitures par lots, une ligne par voiture physique.
- Je photographie la face de chaque blister avec mon téléphone.
- Je prépare les photos avec un script, puis je publie le site.

## Comment ça marche

**L'inventaire.** Chaque voiture a un identifiant personnel (`HW-001`, `HW-002`…), qui n'est pas une référence Mattel. Le code Mattel du dos du blister est conservé dans sa propre colonne. Je ne devine jamais une information : ce qui reste à identifier prend le statut « À vérifier ». Une colonne repère automatiquement les doublons, et un onglet de statistiques compte les voitures par marque, couleur, année et série.

**Le site.** Le tableur est publié au format CSV et la page le lit à chaque visite, avec une copie de secours si Google ne répond pas. Une nouvelle ligne dans le tableur devient une nouvelle carte, sans toucher au code. On peut chercher, filtrer par marque, série, couleur, année et type, trier, ouvrir une fiche détaillée avec une adresse propre à chaque voiture, et consulter des statistiques. Une voiture sans photo affiche « Photo à venir ».

**Les photos.** Chaque photo porte l'identifiant de sa voiture (`HW-001.jpg`). Un script Python les classe par heure de prise de vue, les renomme, les réduit à 1200 pixels et retire les données cachées, dont la position GPS.

```powershell
python prepare_photos.py photos_brutes/lot-01 --start 1 --out site/photos --csv site/data/inventaire.csv
```

## Où en est le projet

Pour l'instant, 10 voitures sont recensées et photographiées, de `HW-001` à `HW-010`. [À CONFIRMER : nombre de voitures recensées au moment de la publication de cette page] Je continue le recensement lot par lot.

## Liens

- Collection en ligne : https://rpmn0ise-hotwheels.pages.dev/