# KCD Interactive Map (CZ / EN)

An interactive web map for **Kingdom Come: Deliverance**, with two languages **Czech and English**. Built with [Leaflet.js](https://leafletjs.com/).

This is a fork of [Kingdom Come Map](https://kingdomcomemap.github.io) by [RogerHN](https://github.com/kingdomcomemap/kingdomcomemap.github.io).

---

## Features

- **Full game map** — the complete 8192 × 8192 map rendered from a pyramid of 1,366 JPG tiles (zoom levels 0–5)
- **1,086 in-game markers** — interesting sites, nests, accidents, graves, shrines, fish traps, camps, woodland gardens, beehives, hunting and fishing spots, fast travel points, caves, mines and every trade and service
- **43 marker categories in 5 groups** — each category is switched on and off individually and shows a live count; every group has one master switch that toggles all of its categories at once, and its header folds the whole group away. *Show all* / *Hide all* sit above the list, and they leave the village-name layer untouched
- **Display options** — a collapsible *Zobrazení / Display* block at the top of the markers panel toggles the village-name labels
- **Bilingual, switchable live** — Czech and English for the whole interface *and* every marker name, herb, requirement and lock level. Czech is the default on a first visit; the choice is remembered and can be changed at any time under **Tools → Janguage / Language**. Search matches category and marker names in both languages at once, so `kovář` still finds the blacksmith in the English UI.
- **Community markers** — 55 treasure chests and treasure maps with hints, lock difficulty and required skills
- **Forage data** — woodland gardens list the herbs found there with their own icons and, where known, quantities
- **Settlement labels** — 13 named villages as permanent text labels, with their own toggle
- **Game coordinates** — the X/Y readout matches the in-game coordinates, and you can type coordinates in to jump straight to that spot
- **Custom markers** — right-click anywhere on the map to add your own marker with a title, description and icon; edit or remove it later
- **Progress tracking** — which categories are visible is remembered in your browser
- **Import / export** — back up your custom markers as a JSON file, restore them on another device, or wipe them
- **Shareable URLs** — every marker has a *Copy link* button, and the URL hash keeps your current position, so you can link directly to a spot
- **Responsive** — the sidebar collapses to an icon rail and becomes an overlay on phones
- **Fullscreen and smooth zoom** — fullscreen control plus smoothed mouse-wheel zooming
- **One typeface** — the map surface uses the same Source Sans 3 as the sidebar, so marker tooltips, popups, village names and map controls all match the chrome

---

## Run Locally

The site is fully static — there is no build step and no server-side logic. Just open `index.html` in your browser.

If you prefer to serve it over HTTP (e.g. for localStorage isolation or to test on mobile devices):

```bash
git clone https://github.com/kcdmap-cz/kcdmap-cz.github.io.git
cd kcdmap-cz.github.io
python -m http.server 8000
```

Then open [http://localhost:8000](http://localhost:8000). Any other static server works too (Node's `http-server`, VS Code Live Server, etc.).

---

## Project Structure

```
kcdmap-cz.github.io/
├── index.html               # Page shell + markup
├── css/
│   ├── style.css            # All app styles (sidebar, panels, map chrome)
│   └── leaflet.css          # Leaflet core
├── js/
│   ├── i18n.js              # cs/en dictionary + runtime. MUST load first
│   ├── ui.js                # Sidebar, panels, category list, search, legend, dialogs
│   ├── functions.js         # Map, layers, markers, popups, backup
│   ├── markers.js           # Settlement labels + the 1,086 in-game markers
│   ├── usr_markers.js       # Community marker data (treasure chests / maps)
│   ├── leaflet.js           # Leaflet core
│   ├── leaflet-hash.min.js  # Map position in the URL
│   ├── jquery.min.js
│   └── libs/                # Smooth wheel zoom + canvas tile layer
├── map/                     # 1,366 JPG tiles named <zoom>_<x>_<y>.jpg
├── assets/
│   ├── images/              # 151 marker icons + backgrounds
│   └── images/kcd2-ui/      # Sidebar logo and rail icons
├── kcd2_icon.png
└── README.md
```

---

## Browser Storage

Everything is kept in `localStorage`, so nothing is uploaded anywhere:

| Key | Contents |
| --- | --- |
| `kcdmap_lang` | chosen language (`cs` / `en`) |
| `mapUserMarkers` | your custom markers, as JSON |
| `kcd1_active_tab` | which panel was open last |
| `kcd1_collapsed_groups` | which category groups you folded away |
| `kcd1_textmarkers` | settlement labels on/off |
| `kcd1_map_hint_dismissed` | whether the right-click hint was dismissed |

`langactive` is the key the original map used. It is still read as a fallback, so visitors who already had a language stored keep their choice, and backups exported before this fork still restore the right language.

---

## Credits

- **Game, art, map data, and all in-game assets** © [Warhorse Studios](https://warhorsestudios.cz/). This is an unofficial fan project — not affiliated with or endorsed by Warhorse.
- **Original map** by [RogerHN](https://github.com/kingdomcomemap/kingdomcomemap.github.io).
- **Built with** [Leaflet.js](https://leafletjs.com/).

Marker coordinates are game coordinates, so they can be used directly with what is shown on screen.