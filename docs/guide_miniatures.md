# Guide — éditer la collection de miniatures

Toute la collection vit dans **un seul fichier** :
`src/_data/miniatures.json`

C'est un tableau JSON. Chaque voiture est un objet entre `{ }`. Pour ajouter une voiture, copie un bloc existant, colle-le dans le tableau (avec une virgule avant), et modifie les valeurs.

## Modèle vide à copier

```json
{
  "id": "identifiant-unique-kebab-case",
  "marque": "Hot Wheels",
  "modele": "Nom du modèle",
  "couleur": "",
  "image": ""
}
```

## Détail des champs

| Champ     | Obligatoire | Description                                                                 |
|-----------|:-----------:|-------------------------------------------------------------------------------|
| `id`      | oui         | Identifiant unique, kebab-case, sans espace ni accent (ex: `hw-supra-mk4`). Ne doit jamais être dupliqué. |
| `marque`  | oui         | Exactement `Hot Wheels`, `Majorette` ou `Matchbox` (respecte la casse — sinon le filtre par marque ne fonctionnera pas). |
| `modele`  | oui         | Nom du modèle affiché en titre de carte.                                     |
| `couleur` | non         | Couleur principale, affichée sous le titre. Laisse `""` si tu ne veux rien afficher. |
| `image`   | non         | Chemin de la photo, ex: `/assets/images/miniatures/hw-supra-mk4.jpg`. Laisse `""` tant que tu n'as pas la photo — un pictogramme générique s'affiche à la place. |

## Ajouter des photos

1. Prépare la photo en format **portrait 3:4** (ex: 900×1200px) — c'est le ratio de la vignette sur le site, et l'image n'est jamais recadrée : elle s'affiche en entier, centrée.
2. Dépose le fichier dans `src/assets/images/miniatures/`.
3. Renseigne le champ `image` de la voiture correspondante, ex :
   `"image": "/assets/images/miniatures/hw-supra-mk4.jpg"`

## Points de vigilance

- **JSON strict** : virgules entre chaque objet du tableau, mais **pas de virgule après le dernier**. Guillemets doubles obligatoires. Pas de commentaires possibles dans le fichier — ce guide en tient lieu.
- Si le site ne se build plus après une modification, c'est presque toujours une virgule manquante ou en trop, ou un guillemet non fermé. Un validateur JSON en ligne (ex: jsonlint.com) repère l'erreur en un clic.
- Le filtre par marque est généré automatiquement à partir des valeurs présentes dans le fichier — pas besoin de le déclarer ailleurs.
