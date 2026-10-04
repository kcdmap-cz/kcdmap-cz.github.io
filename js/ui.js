/* ═══════════════════════════════════════════════
   ██ UI CHROME — Kingdom Come: Deliverance map
   The sidebar rail, panels, category list, search, legend and dialogs follow
   the KCD2 map layout. The map, its layers and the marker data are owned by
   js/functions.js and js/markers.js — this file only drives the chrome around
   them and mirrors their state.
   ═══════════════════════════════════════════════ */

/* ── Storage helpers ── */
var STORAGE = {
  panel: 'kcd1_active_tab',
  collapsed: 'kcd1_collapsed_groups',
  hint: 'kcd1_map_hint_dismissed',
  textmarkers: 'kcd1_textmarkers'
};

function storeGet(key) {
  try { return localStorage.getItem(key); } catch (e) { return null; }
}
function storeSet(key, value) {
  try { localStorage.setItem(key, value); } catch (e) { /* private mode */ }
}

function escapeHtml(s) {
  return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
    return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
  });
}

/* Same escaping, but for a double-quoted attribute value — there an embedded
   quote would end the attribute and break the element. */
function escapeAttr(s) {
  return escapeHtml(s);
}

/* Fold accents and apostrophes so "atamans" finds "Ataman's" and unaccented
   Czech typing matches the accented category names. */
function searchNorm(s) {
  return (s || '')
    .toLowerCase()
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/['’ʼ`]/g, '');
}

/* ═══════════════════════════════════════════════
   ██ CATEGORY GROUPS
   Same five groups and the same 43 marker categories the original sidebar
   listed. Every id doubles as the marker group id, and each category keeps a
   real checkbox inside a .markers-list container — js/functions.js drives the
   map layers straight off those inputs.
   ═══════════════════════════════════════════════ */

var ICON_BASE = 'assets/images/';

var CATEGORY_GROUPS = [
  {
    id: 'trade', name: 'Města a obchody', color: '#c9a84c', categories: [
      { id: 'fast_travel', name: 'Rychlé cestování' },
      { id: 'tavern', name: 'Hospoda' },
      { id: 'lodgings', name: 'Hostinec s ubytováním' },
      { id: 'bed', icon: 'your_bed', name: 'Postel' },
      { id: 'baths', name: 'Lázně' },
      { id: 'grindstone', name: 'Brusné kolo' },
      { id: 'trader', name: 'Kupec' },
      { id: 'blacksmith', name: 'Kovář' },
      { id: 'armourer', name: 'Platnéř' },
      { id: 'weaponsmith', name: 'Zbrojíř' },
      { id: 'cobbler', name: 'Švec' },
      { id: 'tailor', name: 'Krejčí' },
      { id: 'tanner', name: 'Koželouh' },
      { id: 'baker', name: 'Pekař' },
      { id: 'butcher', name: 'Řezník' },
      { id: 'miller', name: 'Mlinář' },
      { id: 'herbalist', name: 'Bylinář' },
      { id: 'apothecary', name: 'Aptikář' },
      { id: 'alchemy_bench', name: 'Alchymistický stůl' },
      { id: 'horse_trader', name: 'Koňský handléř' },
      { id: 'scribe', name: 'Písař' },
      { id: 'vegetable_shop', name: 'Zelinář' }
    ]
  },
  {
    id: 'hunting', name: 'Lov a rybářství', color: '#8fae5a', categories: [
      { id: 'huntsman', name: 'Lovec' },
      { id: 'deer_hunting_spot', name: 'Loviště vysoké' },
      { id: 'boar_hunting_spot', name: 'Loviště divočáků' },
      { id: 'fishing_spot', name: 'Rybářský plácek' },
      { id: 'fish_trap', name: 'Rybářská past' }
    ]
  },
  {
    id: 'nature', name: 'Příroda a podzemí', color: '#6fae7a', categories: [
      { id: 'woodland_garden', name: 'Lesní zahrada' },
      { id: 'beehive', name: 'Úl' },
      { id: 'cave', name: 'Jeskyně' },
      { id: 'mine', name: 'Vchod do dolu' },
      { id: 'nest', name: 'Hnízdo' },
      { id: 'grave', name: 'Hrob' }
    ]
  },
  {
    id: 'places', name: 'Památky a nebezpečí', color: '#c25a5a', categories: [
      { id: 'interesting_site', name: 'Zajímavost' },
      { id: 'accident', name: 'Nehoda' },
      { id: 'combat_arena', name: 'Kobyliště' },
      { id: 'archery_range', name: 'Lukostřelnice' },
      { id: 'camp', name: 'Tábor' },
      { id: 'bandit_camp', name: 'Tábor banditů' },
      { id: 'conciliation_cross', name: 'Smírčí kříž' },
      { id: 'shrine', name: 'Boží muka' }
    ]
  },
  {
    id: 'treasure', name: 'Poklady', color: '#e0c24c', categories: [
      { id: 'treasure_chest', name: 'Truhla s pokladem' },
      { id: 'treasure_map', name: 'Mapa k pokladu' }
    ]
  }
];

var DEFAULT_GROUP_COLOR = '#c9a84c';

function catIcon(cat) { return ICON_BASE + (cat.icon || cat.id) + '.png'; }

/* Category and group captions live in js/i18n.js; the `name` in CATEGORY_GROUPS
   stays as the Czech fallback so a missing key degrades to Czech, never to blank. */
function catLabel(cat) { return t('cat_' + cat.id, cat.name); }
function groupLabel(group) { return t('grp_' + group.id, group.name); }

function catById(id) {
  for (var g = 0; g < CATEGORY_GROUPS.length; g++) {
    var cats = CATEGORY_GROUPS[g].categories;
    for (var c = 0; c < cats.length; c++) {
      if (cats[c].id === id) return { cat: cats[c], group: CATEGORY_GROUPS[g] };
    }
  }
  return null;
}
function groupById(id) {
  for (var g = 0; g < CATEGORY_GROUPS.length; g++) {
    if (CATEGORY_GROUPS[g].id === id) return CATEGORY_GROUPS[g];
  }
  return null;
}
function groupColorOf(catId) {
  var found = catById(catId);
  return found ? found.group.color : DEFAULT_GROUP_COLOR;
}

/* ═══════════════════════════════════════════════
   ██ CATEGORY LIST
   Built once, before js/functions.js runs, so its .markers-list checkboxes
   exist when functions.js binds and restores their state. Filtering only
   toggles visibility, which keeps the switch animations intact.
   ═══════════════════════════════════════════════ */

var collapsedGroups = {};

/* KCD2 ships every category group collapsed; we only store what the visitor
   changed, so a group with no stored entry counts as collapsed. */
function groupIsCollapsed(groupId) {
  return collapsedGroups[groupId] !== false;
}

function renderCategoryList() {
  var list = document.getElementById('category-list');
  if (!list) return;

  if (!storeGet(STORAGE.collapsed)) storeSet(STORAGE.collapsed, '{}');
  try { collapsedGroups = JSON.parse(storeGet(STORAGE.collapsed)) || {}; } catch (e) { collapsedGroups = {}; }

  var html = '';
  CATEGORY_GROUPS.forEach(function (group) {
    var expanded = !groupIsCollapsed(group.id);
    html += '<div class="cat-group" data-group="' + group.id + '">';
    html += '  <div class="cat-group-header' + (expanded ? ' expanded' : '') + '" tabindex="0" role="button"'
      + ' aria-expanded="' + expanded + '" data-group="' + group.id + '"'
      + ' onclick="toggleGroup(\'' + group.id + '\')">';
    html += '    <span class="group-arrow">▶</span>';
    html += '    <span class="group-name" data-i18n="grp_' + group.id + '">' + escapeHtml(groupLabel(group)) + '</span>';
    html += '    <button type="button" class="group-toggle-all switch" aria-label="' + escapeAttr(t('group_toggle_all_aria') + ' ' + groupLabel(group))
      + '" onclick="event.stopPropagation();toggleGroupCategories(\'' + group.id + '\', this)"></button>';
    html += '  </div>';
    html += '  <div class="cat-group-children' + (expanded ? ' expanded' : '') + '">';
    html += '    <ul class="markers-list">';
    group.categories.forEach(function (cat) {
      html += '      <li class="cat-row" data-cat="' + cat.id + '" data-name="' + escapeAttr(searchNorm(cat.name)) + '">';
      html += '        <input type="checkbox" id="' + cat.id + '" class="cc">';
      html += '        <div class="category-item" tabindex="0" role="switch" aria-checked="false" data-cat="' + cat.id + '"'
        + ' onclick="toggleCategory(\'' + cat.id + '\', this)">';
      html += '          <span class="cat-icon"><img src="' + catIcon(cat) + '" alt=""></span>';
      html += '          <span class="cat-name" data-i18n="cat_' + cat.id + '">' + escapeHtml(catLabel(cat)) + '</span>';
      html += '          <span class="cat-progress">0</span>';
      html += '          <span class="cat-toggle switch"></span>';
      html += '        </div>';
      html += '      </li>';
    });
    html += '    </ul>';
    html += '  </div>';
    html += '</div>';
  });

  list.innerHTML = html;
  syncCategoryUI();
}

function toggleGroup(groupId) {
  var collapsed = !groupIsCollapsed(groupId);
  collapsedGroups[groupId] = collapsed;
  storeSet(STORAGE.collapsed, JSON.stringify(collapsedGroups));
  var header = document.querySelector('.cat-group-header[data-group="' + groupId + '"]');
  var children = document.querySelector('.cat-group[data-group="' + groupId + '"] > .cat-group-children');
  if (header) {
    header.classList.toggle('expanded', !collapsed);
    header.setAttribute('aria-expanded', collapsed ? 'false' : 'true');
  }
  if (children) children.classList.toggle('expanded', !collapsed);
}

/* The visible row is a switch, the checkbox underneath is the real state
   functions.js listens to — flip it and let the change event do the rest. */
function toggleCategory(catId) {
  var box = document.getElementById(catId);
  if (!box) return;
  box.checked = !box.checked;
  dispatchChange(box);
  syncCategoryUI();
}

function toggleGroupCategories(groupId, el) {
  var group = groupById(groupId);
  if (!group) return;
  var boxes = group.categories
    .map(function (cat) { return document.getElementById(cat.id); })
    .filter(Boolean);
  var show = !boxes.every(function (b) { return b.checked; });
  boxes.forEach(function (b) {
    b.checked = show;
    dispatchChange(b);
  });
  if (el) el.classList.toggle('on', show);
  syncCategoryUI();
}

/* Show/Hide All — hands over to the original #allmarkers master switch so the
   layer bookkeeping stays in one place (js/functions.js). */
/* "Zobrazit vše" / "Skrýt vše" only ever touched the map markers. The village-name
   layer keeps its own #textmarkers switch in the "Zobrazení" block above the
   category groups, so snapshot it, let functions.js do the bulk toggle, then put
   the name layer back as it was. */
function toggleAllCategories(show) {
  var all = document.getElementById('allmarkers');
  if (!all) return;

  var textBox = document.getElementById('textmarkers');
  var namesWereOn = textBox ? textBox.checked : false;
  var nameGroup = (typeof layerGroups !== 'undefined' && layerGroups) ? layerGroups.textmarkers : null;

  all.checked = show;
  if (typeof toggleAll === 'function') toggleAll(all);
  else dispatchChange(all);

  if (textBox) {
    textBox.checked = namesWereOn;
    if (nameGroup && typeof map !== 'undefined' && map) {
      try {
        if (namesWereOn) map.addLayer(nameGroup);
        else map.removeLayer(nameGroup);
      } catch (e) { /* layer already in the requested state */ }
    }
    if (typeof applyTextMarkers === 'function') applyTextMarkers(namesWereOn);
  }

  syncCategoryUI();
}

/* Any checkbox change (click, keyboard or programmatic) re-syncs the switches,
   the group masters and the persisted village-name toggle. */
function dispatchChange(el) {
  try { el.dispatchEvent(new Event('change', { bubbles: true })); }
  catch (e) { if (el.onchange) el.onchange(); }
}

function syncCategoryUI() {
  CATEGORY_GROUPS.forEach(function (group) {
    var groupEl = document.querySelector('.cat-group[data-group="' + group.id + '"]');
    if (!groupEl) return;
    var active = 0;
    group.categories.forEach(function (cat) {
      var box = document.getElementById(cat.id);
      var row = groupEl.querySelector('.category-item[data-cat="' + cat.id + '"]');
      var on = !!(box && box.checked);
      if (on) active++;
      if (row) {
        row.classList.toggle('active', on);
        row.setAttribute('aria-checked', on ? 'true' : 'false');
      }
    });
    var master = groupEl.querySelector('.group-toggle-all');
    if (master) {
      master.classList.toggle('on', active === group.categories.length && active > 0);
      /* The group name is inside the label, so it cannot be a plain data-i18n
         attribute — rebuild it whenever the language changes. */
      master.setAttribute('aria-label', t('group_toggle_all_aria') + ' ' + groupLabel(group));
    }
  });

  // "Show All" must never stay lit once a single category is hidden.
  var all = document.getElementById('allmarkers');
  if (all) all.checked = false;
}

function updateCategoryCounts() {
  // layerGroups is a `let` inside functions.js, so it is still in its temporal
  // dead zone while this file's top-level code runs — the try/catch keeps that
  // early call (renderCategoryList → syncCategoryUI) harmless.
  var groups;
  try { groups = layerGroups; } catch (e) { return; }
  if (!groups) return;
  CATEGORY_GROUPS.forEach(function (group) {
    group.categories.forEach(function (cat) {
      var row = document.querySelector('.category-item[data-cat="' + cat.id + '"] .cat-progress');
      if (!row) return;
      var layer = groups[cat.id];
      row.textContent = layer && layer.getLayers ? layer.getLayers().length : 0;
    });
  });
}

/* ═══════════════════════════════════════════════
   ██ SEARCH
   ═══════════════════════════════════════════════ */

function filterCategories(query) {
  var q = searchNorm(String(query || '').trim());
  CATEGORY_GROUPS.forEach(function (group) {
    var groupEl = document.querySelector('.cat-group[data-group="' + group.id + '"]');
    if (!groupEl) return;
    var visible = 0;
    group.categories.forEach(function (cat) {
      var row = groupEl.querySelector('.cat-row[data-cat="' + cat.id + '"]');
      if (!row) return;
      var hit = !q || matchesCategory(cat, q);
      row.classList.toggle('hidden', !hit);
      if (hit) visible++;
    });
    groupEl.style.display = visible ? '' : 'none';
    // A live search always reveals its matches.
    if (q && visible) {
      var header = groupEl.querySelector('.cat-group-header');
      var children = groupEl.querySelector('.cat-group-children');
      if (header) { header.classList.add('expanded'); header.setAttribute('aria-expanded', 'true'); }
      if (children) children.classList.add('expanded');
    }
  });
}

/* Search the caption in both languages: the sidebar may be showing English, but
   somebody who knows the map as "kovář" should still find the blacksmith. */
function matchesCategory(cat, q) {
  var labels = [catLabel(cat), cat.name, I18N.cs['cat_' + cat.id], I18N.en['cat_' + cat.id]];
  return labels.some(function (label) {
    return label && searchNorm(label).indexOf(q) !== -1;
  });
}

function onSearchInput(query) {
  var q = searchNorm(String(query || '').trim());
  var clearBtn = document.getElementById('search-clear');
  if (clearBtn) clearBtn.hidden = !String(query || '').length;

  filterCategories(query);

  var resultsEl = document.getElementById('search-results');
  var input = document.getElementById('search-input');
  if (!resultsEl) return;

  if (!q || q.length < 2) {
    resultsEl.classList.remove('active');
    resultsEl.innerHTML = '';
    if (input) input.setAttribute('aria-expanded', 'false');
    return;
  }

  var matches = collectSearchHits(q);
  if (!matches.length) {
    resultsEl.innerHTML = '<div class="search-no-results">' + escapeHtml(t('search_no_results')) + '</div>';
    resultsEl.classList.add('active');
    if (input) input.setAttribute('aria-expanded', 'true');
    return;
  }

  var limited = matches.slice(0, 20);
  /* The target goes into data-* attributes, never into an inline onclick: a
     double quote inside onclick="…" terminates the attribute early, the browser
     then gets a syntax error and silently drops the handler. */
  resultsEl.innerHTML = limited.map(function (m) {
    var found = catById(m.group);
    var icon = found ? '<img src="' + catIcon(found.cat) + '" onerror="this.style.display=\'none\'" alt="">'
      : '<span style="width:18px;text-align:center;font-size:12px">📌</span>';
    var catName = found ? escapeHtml(groupLabel(found.group)) : escapeHtml(t('search_cat_own'));
    var tag = m.own ? ' ' + escapeHtml(t('search_tag_own')) : '';
    return '<div class="search-result-item" role="option"'
      + ' data-lat="' + m.lat + '" data-lng="' + m.lng + '"'
      + ' data-group="' + escapeAttr(m.group || '') + '" data-own="' + (m.own ? '1' : '0') + '">'
      + icon
      + '<div><div class="sr-name">' + escapeHtml(m.name) + '</div>'
      + '<div class="sr-cat">' + catName + tag + ' — (' + m.x + ', ' + m.y + ')</div></div></div>';
  }).join('') + (matches.length > 20
    ? '<div style="padding:6px 10px;font-size:11px;color:var(--text-muted);text-align:center">+' +
      (matches.length - 20) + escapeHtml(t('search_more')) + '</div>'
    : '');
  resultsEl.classList.add('active');
  if (input) input.setAttribute('aria-expanded', 'true');
}

/* Marker names in markers.js / usr_markers.js carry translation markup, e.g.
   "<span data-i18n='SKALITZ'>SKALICE</span>". Search results are plain text, so
   use the text inside the markup instead of printing the tags. */
function plainName(name) {
  return String(name == null ? '' : name)
    .replace(/<[^>]*>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/* Every caption a marker can carry in either language, so search works no matter
   which one is on screen: the visible one plus its Czech and English variants. */
function markerSearchLabels(name) {
  var labels = [
    plainName(trI18n(name)),
    plainName(trI18nAs(name, 'cs')),
    plainName(trI18nAs(name, 'en'))
  ];
  return labels.filter(Boolean);
}

function collectSearchHits(q) {
  var hits = [];

  if (typeof markers !== 'undefined' && markers) {
    for (var i = 0; i < markers.length; i++) {
      var m = markers[i];
      if (!m || !m.name) continue;
      var labels = markerSearchLabels(m.name);
      if (!labels.length) continue;
      if (!labels.some(function (l) { return searchNorm(l).indexOf(q) !== -1; })) continue;
      hits.push({
        name: labels[0], group: m.group,
        x: Math.round(m.coords[1]), y: Math.round(m.coords[0]),          // for the readout
        lat: m.coords[1], lng: m.coords[0],                            // how the map stores it
        own: false
      });
    }
  }

  var mine = readUserMarkers();
  mine.forEach(function (m) {
    /* Own markers are the visitor's own text — there is nothing to translate, so
       the name is matched exactly as typed. */
    var label = plainName(m.name);
    if (searchNorm(label).indexOf(q) === -1) return;
    hits.push({
      name: label, group: '',
      x: m.coords.y, y: m.coords.x,
      lat: m.coords.x, lng: m.coords.y,   // own markers are stored lat=x, lng=y
      own: true
    });
  });

  return hits;
}

function clearSearch() {
  var input = document.getElementById('search-input');
  if (input) { input.value = ''; input.focus(); }
  var clearBtn = document.getElementById('search-clear');
  if (clearBtn) clearBtn.hidden = true;
  var resultsEl = document.getElementById('search-results');
  if (resultsEl) { resultsEl.classList.remove('active'); resultsEl.innerHTML = ''; }
  if (input) input.setAttribute('aria-expanded', 'false');
  filterCategories('');
}

/* Fly to a search hit: reveal its category if hidden, then open the popup of
   the matching Leaflet marker. */
/* Jump to a search hit and open its popup. Both marker kinds live on the map as
   L.marker([lat, lng]) — game/shared markers use lat=coords[1], lng=coords[0] and
   sit in globalMarkers, own markers use lat=coords.x, lng=coords.y and sit in
   groupUser. Comparing lat against y (as this used to) never matched, which is why
   the map moved but nothing was selected. */
function focusMarker(lat, lng, groupId, own) {
  clearSearch();
  if (typeof map === 'undefined' || !map) return;

  if (!own && groupId) {
    var box = document.getElementById(groupId);
    if (box && !box.checked) {
      box.checked = true;
      dispatchChange(box);
      syncCategoryUI();
    }
  }

  map.flyTo([lat, lng], 4);

  var pool = null;
  if (own) {
    if (typeof groupUser !== 'undefined' && groupUser && groupUser.getLayers) pool = groupUser.getLayers();
  } else if (typeof globalMarkers !== 'undefined' && globalMarkers) {
    pool = globalMarkers;
  }
  if (!pool) return;

  for (var i = 0; i < pool.length; i++) {
    var marker = pool[i];
    if (!marker || !marker.getLatLng) continue;
    var ll = marker.getLatLng();
    if (Math.abs(ll.lat - lat) > 0.5 || Math.abs(ll.lng - lng) > 0.5) continue;

    var opened = false;
    var openIt = function () {
      if (opened) return;
      opened = true;
      try { marker.openPopup(); } catch (e) { /* marker gone */ }
    };
    if (typeof map.once === 'function') map.once('moveend', openIt);
    setTimeout(openIt, 450);
    return;
  }
}

/* ═══════════════════════════════════════════════
   ██ MY MARKERS PANEL
   ═══════════════════════════════════════════════ */

function readUserMarkers() {
  try {
    var raw = storeGet('mapUserMarkers');
    var parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) { return []; }
}

/* js/functions.js owns the mapUserMarkers writes; it calls this after each one so
   the "Moje štítky" list is never stale (e.g. a marker added while the panel is
   already open used to stay invisible until a reload). */
function userMarkersChanged() {
  renderMyMarkersList();
}

function renderMyMarkersList() {
  var el = document.getElementById('my-markers-list');
  if (!el) return;
  var mine = readUserMarkers();
  if (!mine.length) {
    el.innerHTML = '<div class="no-markers">' + escapeHtml(t('my_markers_empty')) + '</div>';
    return;
  }
  el.innerHTML = mine.map(function (m, index) {
    var iconUrl = (m.icon && m.icon.options && m.icon.options.iconUrl) || '';
    var icon = iconUrl
      ? '<img src="' + escapeHtml(iconUrl) + '" alt="" style="width:20px;height:20px;">'
      : '📌';
    return '<div class="my-marker-item" role="button" tabindex="0"'
      + ' onclick="focusUserMarker(' + index + ')"'
      + ' onkeydown="if(event.key===\'Enter\'||event.key===\' \'){event.preventDefault();focusUserMarker(' + index + ');}">'
      + '<span class="mm-icon">' + icon + '</span>'
      + '<span class="mm-info">'
      + '<span class="mm-name">' + escapeHtml(plainName(m.name) || t('default_icon')) + '</span>'
      + '<span class="mm-coords">X: ' + m.coords.y + ' Y: ' + m.coords.x + '</span>'
      + '</span></div>';
  }).join('');
}

function focusUserMarker(index) {
  if (typeof map === 'undefined' || !map) return;
  var mine = readUserMarkers();
  var m = mine[index];
  if (!m) return;

  // Keep the shared/user marker layer visible, same as the original master switch.
  var userBox = document.getElementById('usermarkers');
  if (userBox && !userBox.checked) {
    userBox.checked = true;
    dispatchChange(userBox);
  }

  map.flyTo([m.coords.x, m.coords.y], 4);

  if (typeof groupUser === 'undefined' || !groupUser || !groupUser.getLayers) return;
  groupUser.getLayers().forEach(function (marker) {
    if (!marker || !marker.getLatLng) return;
    var ll = marker.getLatLng();
    if (Math.round(ll.lat) === m.coords.x && Math.round(ll.lng) === m.coords.y) {
      setTimeout(function () { marker.openPopup(); }, 420);
    }
  });
}

/* ═══════════════════════════════════════════════
   ██ RAIL + PANELS
   ═══════════════════════════════════════════════ */

var currentPanel = 'markers';

function switchSide(side, persist) {
  var panel = document.getElementById('side-panel-' + side);
  if (!panel) return;
  currentPanel = side;
  document.querySelectorAll('.rail-btn').forEach(function (btn) {
    var on = btn.id === 'rail-' + side;
    btn.classList.toggle('active', on);
    btn.setAttribute('aria-selected', on ? 'true' : 'false');
  });
  document.querySelectorAll('.side-panel').forEach(function (p) { p.classList.remove('active'); });
  panel.classList.add('active');
  if (side === 'mymarkers') renderMyMarkersList();
  if (side === 'markers') updateCategoryCounts();
  if (persist !== false) storeSet(STORAGE.panel, side);
}

function setSidebarCollapsed(collapsed) {
  var sb = document.getElementById('sidebar');
  if (!sb) return;
  sb.classList.toggle('collapsed', collapsed);
  var btn = document.getElementById('rail-collapse');
  if (btn) {
    var label = t(collapsed ? 'menu_expand' : 'menu_collapse');
    btn.setAttribute('aria-expanded', collapsed ? 'false' : 'true');
    btn.setAttribute('title', label);
    btn.setAttribute('aria-label', label);
  }
  if (typeof map !== 'undefined' && map) setTimeout(function () { map.invalidateSize(); }, 60);
}

function toggleSidebar() {
  var sb = document.getElementById('sidebar');
  if (!sb) return;
  setSidebarCollapsed(!sb.classList.contains('collapsed'));
}

/* The original sidebar was a plugin object — js/functions.js still calls it. */
var sidebar = {
  open: function (name) {
    setSidebarCollapsed(false);
    // Legacy shim for js/functions.js, which calls sidebar.open('home') while the
    // page is still loading — never let that overwrite the remembered panel.
    if (name === 'home') switchSide('markers', false);
    else switchSide(name, false);
  },
  close: function () { setSidebarCollapsed(true); },
  toggle: toggleSidebar,
  isOpen: function () {
    var sb = document.getElementById('sidebar');
    return !!sb && !sb.classList.contains('collapsed');
  }
};

function toggleMapOptions(btn) {
  var el = document.getElementById('map-options');
  if (!el) return;
  var collapsed = el.classList.toggle('collapsed');
  if (btn) btn.setAttribute('aria-expanded', collapsed ? 'false' : 'true');
}

/* ═══════════════════════════════════════════════
   ██ LANGUAGE SWITCH
   js/i18n.js owns the language, the dictionary and localStorage; this block only
   moves the gold pill and repaints the parts of the UI that are built in
   JavaScript. The category list is deliberately NOT re-rendered — its checkboxes
   are wired to the map layers by functions.js, so rebuilding it would silently
   drop every layer the visitor had switched on. Its captions carry data-i18n
   instead, which applyI18n() translates in place.
   ═══════════════════════════════════════════════ */

function syncLangButtons() {
  var lang = getLang();
  document.querySelectorAll('#side-panel-tools .region-btn[data-lang]').forEach(function (btn) {
    var on = btn.dataset.lang === lang;
    btn.classList.toggle('active', on);
    btn.setAttribute('aria-pressed', on ? 'true' : 'false');
  });
}

/* js/i18n.js dispatches kcdmap:langchange after it has translated the DOM.
   Everything that is generated rather than written in index.html gets rebuilt
   here, so a language switch is complete without a reload. */
document.addEventListener('kcdmap:langchange', function () {
  syncLangButtons();
  syncCategoryUI();          // also rebuilds the group-toggle aria-labels
  renderLegend();
  renderMyMarkersList();

  var input = document.getElementById('search-input');
  if (input && input.value) onSearchInput(input.value);
  if (typeof refreshOpenPopup === 'function') refreshOpenPopup();
});

function switchLang(lang) {
  setLang(lang);
}

/* Czech on a first visit, the stored choice afterwards — decided in js/i18n.js. */
function initLang() {
  if (document.documentElement) document.documentElement.lang = getLang();
  applyI18n(document);
  syncLangButtons();
}

/* ═══════════════════════════════════════════════
   ██ LEGEND
   ═══════════════════════════════════════════════ */

var legendOpen = false;

function toggleLegend() {
  legendOpen = !legendOpen;
  var panel = document.getElementById('legend-panel');
  if (!panel) return;
  panel.classList.toggle('active', legendOpen);
  if (legendOpen) renderLegend();
}

function renderLegend() {
  var content = document.getElementById('legend-content');
  if (!content) return;
  var html = '';
  CATEGORY_GROUPS.forEach(function (group) {
    html += '<div class="legend-group-title" style="color:' + group.color + '">' + escapeHtml(groupLabel(group)) + '</div>';
    group.categories.forEach(function (cat) {
      html += '<div class="legend-row"><img src="' + catIcon(cat) + '" onerror="this.style.display=\'none\'" alt="">'
        + '<span>' + escapeHtml(catLabel(cat)) + '</span></div>';
    });
  });
  content.innerHTML = html;
}

/* ═══════════════════════════════════════════════
   ██ TOAST + DIALOGS
   ═══════════════════════════════════════════════ */

var toastTimer = null;
function showToast(message) {
  var toast = document.getElementById('toast');
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(function () { toast.classList.remove('show'); }, 2500);
}

var confirmResolve = null;
function showConfirm(message, options) {
  options = options || {};
  var modal = document.getElementById('confirm-modal');
  if (!modal) return Promise.resolve(false);
  return new Promise(function (resolve) {
    confirmResolve = resolve;
    document.getElementById('confirm-title').textContent = options.title || t('confirm_title');
    document.getElementById('confirm-message').textContent = message;
    var ok = document.getElementById('confirm-ok');
    ok.textContent = options.confirmText || t('confirm_ok');
    ok.classList.toggle('btn-danger', !!options.danger);
    ok.classList.toggle('btn-primary', !options.danger);
    modal.classList.add('show');
    ok.focus();
  });
}
function confirmClose(result) {
  var modal = document.getElementById('confirm-modal');
  if (modal) modal.classList.remove('show');
  var resolve = confirmResolve;
  confirmResolve = null;
  if (resolve) resolve(result);
}

function showImportModal() {
  var modal = document.getElementById('import-modal');
  var file = document.getElementById('import-file');
  if (!modal) return;
  if (file) file.value = '';
  modal.classList.add('show');
}
function closeImportModal() {
  var modal = document.getElementById('import-modal');
  if (modal) modal.classList.remove('show');
}

function importFromFile(input) {
  var file = input.files && input.files[0];
  closeImportModal();
  if (!file) return;
  var reader = new FileReader();
  reader.onload = function (e) {
    var data;
    try {
      data = JSON.parse(e.target.result);
    } catch (err) {
      showToast(t('toast_import_invalid'));
      return;
    }
    if (!data || typeof data.markers === 'undefined') {
      showToast(t('toast_import_no_markers'));
      return;
    }
    try {
      localStorage.setItem('mapUserMarkers', data.markers);
      /* A backup restores the language it was made in, whichever key it used. */
      if (data.lang && I18N[data.lang]) setLang(data.lang);
      if (data.langactive) localStorage.setItem('langactive', data.langactive);
      if (typeof map !== 'undefined' && map) map.removeLayer(groupUser);
      initUserLayerGroup();
      userMarkersChanged();
      showToast(t('toast_import_done'));
    } catch (err) {
      showToast(t('toast_import_failed'));
    }
  };
  reader.readAsText(file);
}

/* ── Keyboard: keep Tab inside an open modal ── */
function _trapModalTab(e, overlay) {
  if (e.key !== 'Tab') return;
  var focusable = [].slice.call(overlay.querySelectorAll(
    'a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
  )).filter(function (el) { return el.offsetParent !== null; });
  if (!focusable.length) return;
  var first = focusable[0];
  var last = focusable[focusable.length - 1];
  if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
  else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
}

/* ═══════════════════════════════════════════════
   ██ BACKUP (export / import / clear)
   ═══════════════════════════════════════════════ */

function getFormattedTime() {
  var d = new Date();
  function p(n) { return (n < 10 ? '0' : '') + n; }
  return d.getFullYear() + p(d.getMonth() + 1) + p(d.getDate()) + '_' + p(d.getHours()) + p(d.getMinutes());
}

function exportMarkers() {
  var backup = {
    markers: storeGet('mapUserMarkers') || '[]',
    lang: getLang(),
    langactive: storeGet('langactive')
  };
  var base = btoa(JSON.stringify(backup));
  var link = document.createElement('a');
  link.setAttribute('download', 'kcdmap_' + getFormattedTime() + '.json');
  link.setAttribute('href', 'data:text/javascript;charset=utf-8;base64,' + base);
  document.body.appendChild(link);
  link.click();
  link.remove();
  showToast(t('toast_export_done'));
}

function clearMarkers() {
  showConfirm(t('toast_clear_confirm'), {
    title: t('toast_clear_title'), confirmText: t('toast_clear_ok'), danger: true
  }).then(function (ok) {
    if (!ok) return;
    try { localStorage.setItem('mapUserMarkers', '[]'); } catch (e) { /* private mode */ }
    if (typeof map !== 'undefined' && map) map.removeLayer(groupUser);
    initUserLayerGroup();
    userMarkersChanged();
    showToast(t('toast_clear_done'));
  });
}

/* ═══════════════════════════════════════════════
   ██ MAP CONTROLS + DISPLAYS
   ═══════════════════════════════════════════════ */

function resetView() {
  if (typeof map !== 'undefined' && map) map.setView([2048, 2048], 2);
}

function toggleFullscreen() {
  var doc = document;
  var el = doc.documentElement;
  if (!doc.fullscreenElement && !doc.webkitFullscreenElement) {
    (el.requestFullscreen || el.webkitRequestFullscreen || function () {}).call(el);
  } else {
    (doc.exitFullscreen || doc.webkitExitFullscreen || function () {}).call(doc);
  }
}
document.addEventListener('fullscreenchange', function () {
  if (typeof map !== 'undefined' && map) setTimeout(function () { map.invalidateSize(); }, 60);
});

function copyCurrentLink() {
  var link = window.location.href;
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(link)
      .then(function () { showToast(t('toast_link_copied')); })
      .catch(function () { showToast(t('toast_link_failed')); });
  } else {
    showToast(t('toast_no_clipboard'));
  }
}

function dismissMapHint() {
  var hint = document.getElementById('map-hint');
  if (hint) hint.classList.remove('show');
  storeSet(STORAGE.hint, '1');
}
function maybeShowMapHint() {
  if (storeGet(STORAGE.hint) === '1') return;
  var hint = document.getElementById('map-hint');
  if (hint) hint.classList.add('show');
}

/* Live cursor position + zoom level, matching the original coordinates readout. */
function initMapDisplays() {
  if (typeof map === 'undefined' || !map) return;

  var coords = document.getElementById('coords-display');
  if (coords) {
    map.on('mousemove', function (e) {
      coords.textContent = 'X: ' + Math.round(e.latlng.lng) + '  Y: ' + Math.round(e.latlng.lat);
    });
  }

  var zoom = document.getElementById('zoom-display');
  if (zoom) {
    var sync = function () { zoom.textContent = t('zoom_prefix') + (+map.getZoom()).toFixed(2); };
    map.on('zoom', sync);
    map.on('zoomend', sync);
    sync();
  }
}

/* ═══════════════════════════════════════════════
   ██ KEYBOARD + OUTSIDE CLICKS
   ═══════════════════════════════════════════════ */

function isTypingTarget(el) {
  return !!el && (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA' ||
    el.tagName === 'SELECT' || el.isContentEditable);
}

function closeTopmostOverlay() {
  var confirmModal = document.getElementById('confirm-modal');
  if (confirmModal && confirmModal.classList.contains('show')) { confirmClose(false); return true; }
  var importModal = document.getElementById('import-modal');
  if (importModal && importModal.classList.contains('show')) { closeImportModal(); return true; }
  var results = document.getElementById('search-results');
  if (results && results.classList.contains('active')) { clearSearch(); return true; }
  if (legendOpen) { toggleLegend(); return true; }
  if (typeof map !== 'undefined' && map && map._popup) { map.closePopup(); return true; }
  return false;
}

document.addEventListener('keydown', function (e) {
  if (e.key === '/' && !isTypingTarget(e.target)) {
    var input = document.getElementById('search-input');
    if (input) { e.preventDefault(); input.focus(); input.select(); }
    return;
  }
  if (e.key === 'Escape') closeTopmostOverlay();
  if ((e.key === 'Enter' || e.key === ' ') && e.target && e.target.classList &&
      (e.target.classList.contains('category-item') || e.target.classList.contains('cat-group-header'))) {
    e.preventDefault();
    e.target.click();
  }
});

// Clicking away from the search field dismisses its results.
document.addEventListener('click', function (e) {
  var results = document.getElementById('search-results');
  var search = document.querySelector('.search-box');
  if (results && results.classList.contains('active') && search &&
      !search.contains(e.target) && !results.contains(e.target)) {
    results.classList.remove('active');
  }
});

/* Clicking a result flies to it. Delegated, so it survives a re-render of the
   dropdown and the target never has to be pasted into an inline onclick — a
   double quote inside onclick="…" ends the attribute early and the browser then
   drops the handler with a syntax error, which is why clicking used to do
   nothing at all. */
document.addEventListener('click', function (e) {
  var item = e.target && e.target.closest ? e.target.closest('.search-result-item') : null;
  if (!item) return;
  focusMarker(
    parseFloat(item.getAttribute('data-lat')),
    parseFloat(item.getAttribute('data-lng')),
    item.getAttribute('data-group') || '',
    item.getAttribute('data-own') === '1'
  );
});

// Delegated so it survives any checkbox re-render; functions.js owns the layers.
document.addEventListener('change', function (e) {
  var t = e.target;
  if (!t) return;
  if (t.id === 'textmarkers') {
    // Remember the village-name toggle — functions.js keeps its own label state.
    storeSet(STORAGE.textmarkers, t.checked ? '1' : '0');
    return;
  }
  if (t.classList && t.classList.contains('cc')) syncCategoryUI();
});

/* ═══════════════════════════════════════════════
   ██ INIT
   ═══════════════════════════════════════════════ */

/* Village names + fast travel for somebody who opens the map for the first time.
   Afterwards their own choice is what counts — this only fills in a blank slate.
   functions.js owns both layers, so every change has to be dispatched as a real
   change event: setting .checked alone would never put the labels on the map,
   which is exactly why the names used to disappear after a browser restart. */
var DEFAULT_ON_CATEGORIES = ['fast_travel'];

function applyDefaultMarkerState() {
  var textBox = document.getElementById('textmarkers');
  if (textBox) {
    var savedNames = storeGet(STORAGE.textmarkers);
    var namesWanted = (savedNames === null || savedNames === undefined) ? true : savedNames === '1';
    if (textBox.checked !== namesWanted) {
      textBox.checked = namesWanted;
      dispatchChange(textBox);
    } else if (typeof applyTextMarkers === 'function') {
      applyTextMarkers(namesWanted);
    }
  }

  if (storeGet('activemarkers') !== null) return;   // returning visitor
  DEFAULT_ON_CATEGORIES.forEach(function (id) {
    var box = document.getElementById(id);
    if (!box || box.checked) return;
    box.checked = true;
    dispatchChange(box);
  });
}

/* Runs while the body is still parsing: js/functions.js binds and restores the
   .markers-list checkboxes immediately after this file. */
renderCategoryList();

function initUI() {
  initLang();
  renderMyMarkersList();
  applyDefaultMarkerState();

  // Restore the panel that was open last time (markers is the default).
  var saved = storeGet(STORAGE.panel);
  if (saved === '') setSidebarCollapsed(true);
  else if (saved) switchSide(saved);

  updateCategoryCounts();
  syncCategoryUI();

  maybeShowMapHint();
  initMapDisplays();

  if (typeof map !== 'undefined' && map) setTimeout(function () { map.invalidateSize(); }, 60);
}

document.addEventListener('DOMContentLoaded', initUI);
