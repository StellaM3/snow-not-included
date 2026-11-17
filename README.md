# Snow not included

**Tout s'importe à Noël. Sauf la neige.** Une expérience web sur la durabilité du Noël suisse : d'où viennent les sapins, les décorations, les mandarines ou le fromage, et comment la neige du 25 décembre disparaît. Un interrupteur « Guirlandes » fait passer de la vue *Magique* (les données) à la *Face cachée* (ce que la fête cache).

Projet d'Estelle Rossier, Master Digital Experience Design, ECAL, workshop « Make Sense » (Pascal Wicht), 2026.

## Lancer en local

```bash
npm install
npm run dev
```

## Publier

Chaque push sur `main` construit le site et le publie sur GitHub Pages (`.github/workflows/deploy.yml`).

## Structure

- `src/main.js` : état de la page (mode, années, produit, décennie) et interactions
- `src/views/data-view.js` : vue Magique (Noël-mètre, voyage des produits, climat, neige, calendrier)
- `src/views/hidden-view.js` : vue Face cachée (électricité, pictogrammes, aide)
- `src/data/*.json` : données préparées à partir des sources ouvertes
- `public/snow/*.jpg` : cartes de la neige à Noël par décennie (relief swisstopo + limite de la neige calculée)

## Sources

MétéoSuisse (neige manuelle, séries homogénéisées), OFDF commerce extérieur (TN8), Swissgrid, OFS, swisstopo swissALTIRegio, Suva / BPA / AXA, La Main Tendue, Statistique Vaud.
