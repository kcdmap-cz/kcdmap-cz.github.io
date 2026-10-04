/* ═══════════════════════════════════════════════
   ██ i18n — Czech / English
   The map has one dataset (js/markers.js, js/usr_markers.js) whose marker names
   carry the markup "<span data-i18n='deer_hunting_spot'>Loviště Vysoké</span>":
   the Czech text is what the visitor sees, the attribute is the translation key.
   This module turns those keys — plus every piece of UI chrome around them — into
   the selected language.

   Sources:
     cs  the strings already in the repo (index.html, js/ui.js, js/functions.js)
     en  index-en.html.old for the chrome, and the English js/markers.js from
         before the Czech fork (commit 71e70fb) for the marker names

   Key namespaces:
     <bare>        marker name, herb, requirement or lock level (matches the
                   data-i18n attributes already in the data files)
     cat_<id>      sidebar / legend category label
     grp_<id>      category group heading
     icon_<id>     icon-picker entry
     ui_*          UI chrome (see below)

   Czech is the default: a first-time visitor with nothing stored gets cs, and the
   choice is remembered in localStorage afterwards.
   ═══════════════════════════════════════════════ */

var I18N_DEFAULT = 'cs';
var I18N_STORAGE = 'kcdmap_lang';

var I18N = {

  /* ─────────────────────────── Czech ─────────────────────────── */
  cs: {

    /* ── Marker names (data-i18n keys inside js/markers.js) ── */
    SKALITZ: 'SKALICE',
    PRIBYSLAVITZ: 'PŘIBYSLAVICE',
    ROVNA: 'ROVNÁ',
    MERHOJED: 'MRCHOJEDY',
    TALMBERG: 'TALMBERG',
    UZHITZ: 'UŽICE',
    SAMOPESH: 'SAMOPEŠ',
    MONASTERY: 'KLÁŠTER',
    LEDETCHKO: 'LEDEČKO',
    SASAU: 'SÁZAVA',
    VRANIK: 'VRANÍK',
    RATTAY: 'RATAJE',
    NEUHOF: 'NEUHOF',

    accident: 'Nehoda',
    alchemy_bench: 'Alchymistický stůl',
    apothecary: 'Aptikář',
    archery_range: 'Lukostřelnice',
    armourer: 'Platnéř',
    baker: 'Pekař',
    bandit_camp: 'Velký tábor banditů',
    baths: 'Lázně',
    bed: 'Postel',
    beehive: 'Úl',
    blacksmith: 'Kovář',
    boar_hunting_spot: 'Loviště divočáků',
    butcher: 'Řezník',
    camp: 'Tábor',
    cave: 'Jeskyně',
    charcoal_burner: 'Uhlíř',
    church: 'Kostel',
    cobbler: 'Švec',
    combat_arena: 'Kobyliště',
    conciliation_cross: 'Smírčí Kříž',
    deer_hunting_spot: 'Loviště Vysoké',
    fast_travel: 'Neuhof',
    fish_trap: 'Rybářská past',
    fishing_spot: 'Rybářský plácek',
    grave: 'Hrob',
    grindstone: 'Brusné kolo',
    herbalist: 'Bylinář',
    horse_trader: 'Koňský handléř',
    huntsman: 'Lovec',
    interesting_site: 'Zajímavost',
    lodgings: 'Hostinec s ubytováním',
    miller: 'Mlinář',
    mine: 'Vchod do dolu',
    nest: 'Hnízdo',
    scribe: 'Písař',
    shrine: 'Boží muka',
    tailor: 'Krejčí',
    tanner: 'Koželouh',
    tavern: 'Hospoda',
    trader: 'Kupec',
    vegetable_shop: 'Zelinář',
    weaponsmith: 'Zbrojíř',
    windmill: 'Windmill',
    woodland_garden: 'Lesní zahrada',
    treasure_map: 'Mapa k pokladu',
    treasure_chest: 'Poklad',

    /* ── Herbs (kcditems / items ids) ── */
    belladonna: 'Rulík',
    chamomile: 'Heřmánek',
    comfrey: 'Kostival',
    dandelion: 'Pampeliška',
    eyebright: 'Světlík',
    herb_paris: 'Vraní oko',
    marigold: 'Měsíček',
    mint: 'Máta',
    nettle: 'Kopřiva',
    poppy: 'Mák',
    sage: 'Šalvěj',
    st_johns_wort: 'Třezalka',
    thistle: 'Bodlák',
    valerian: 'Kozlík',
    wormwood: 'Pelyněk',

    /* ── Treasure requirements + lock difficulty ── */
    lockpicking: 'Páčení zámků',
    spade: 'Rýč',
    easy: 'snadná',
    hard: 'těžká',
    very_hard: 'velmi těžká',

    /* ── Category group headings ── */
    grp_trade: 'Města a obchody',
    grp_hunting: 'Lov a rybářství',
    grp_nature: 'Příroda a podzemí',
    grp_places: 'Památky a nebezpečí',
    grp_treasure: 'Poklady',

    /* ── Sidebar / legend category labels ── */
    cat_fast_travel: 'Rychlé cestování',
    cat_tavern: 'Hospoda',
    cat_lodgings: 'Hostinec s ubytováním',
    cat_bed: 'Postel',
    cat_baths: 'Lázně',
    cat_grindstone: 'Brusné kolo',
    cat_trader: 'Kupec',
    cat_blacksmith: 'Kovář',
    cat_armourer: 'Platnéř',
    cat_weaponsmith: 'Zbrojíř',
    cat_cobbler: 'Švec',
    cat_tailor: 'Krejčí',
    cat_tanner: 'Koželouh',
    cat_baker: 'Pekař',
    cat_butcher: 'Řezník',
    cat_miller: 'Mlinář',
    cat_herbalist: 'Bylinář',
    cat_apothecary: 'Aptikář',
    cat_alchemy_bench: 'Alchymistický stůl',
    cat_horse_trader: 'Koňský handléř',
    cat_scribe: 'Písař',
    cat_vegetable_shop: 'Zelinář',
    cat_huntsman: 'Lovec',
    cat_deer_hunting_spot: 'Loviště vysoké',
    cat_boar_hunting_spot: 'Loviště divočáků',
    cat_fishing_spot: 'Rybářský plácek',
    cat_fish_trap: 'Rybářská past',
    cat_woodland_garden: 'Lesní zahrada',
    cat_beehive: 'Úl',
    cat_cave: 'Jeskyně',
    cat_mine: 'Vchod do dolu',
    cat_nest: 'Hnízdo',
    cat_grave: 'Hrob',
    cat_interesting_site: 'Zajímavost',
    cat_accident: 'Nehoda',
    cat_combat_arena: 'Kobyliště',
    cat_archery_range: 'Lukostřelnice',
    cat_camp: 'Tábor',
    cat_bandit_camp: 'Tábor banditů',
    cat_conciliation_cross: 'Smírčí kříž',
    cat_shrine: 'Boží muka',
    cat_treasure_chest: 'Truhla s pokladem',
    cat_treasure_map: 'Mapa k pokladu',

    /* ── Icon picker ── */
    icon_arrow: 'Šipka',
    icon_exclamation: 'Vykřičník',
    icon_home: 'Dům',
    icon_grocer: 'Krám',
    icon_star: 'Hvězda',
    icon_marker_a: 'Štítek A',
    icon_marker_b: 'Štítek B',
    icon_marker_c: 'Štítek C',
    icon_treasure_map_alt: 'Mapa k pokladu (poutnická)',

    /* ── Document head ── */
    doc_title: 'Kingdom Come Deliverance Mapa - Interaktivní mapa pro Kingdom Come Deliverance',
    doc_description: 'Interaktivní mapa pro Kingdom Come Deliverance',
    doc_keywords: 'Interaktivní mapa pro Kingdom Come Deliverance',

    /* ── Rail ── */
    nav_panels: 'Postranní panely',
    rail_markers: 'Štítky',
    rail_mymarkers: 'Moje štítky',
    rail_info: 'Info',
    rail_tools: 'Nástroje',
    rail_kcd2: 'Kingdom Come: Deliverance II mapa',
    menu_collapse: 'Sbalit menu',
    menu_expand: 'Rozbalit menu',

    /* ── Panels ── */
    tagline: 'Interaktivní mapa',
    search_placeholder: 'Hledat štítky podle názvu...',
    search_aria: 'Hledat štítky podle názvu',
    search_clear: 'Vymazat hledání',
    search_results_aria: 'Výsledky hledání',
    show_all: 'Zobrazit vše',
    hide_all: 'Skrýt vše',
    my_markers_empty: 'Klikněte pravým tlačítkem na mapu pro přidání vlastního markeru.',
    map_view: 'Zobrazení',
    city_names: 'Názvy měst',

    /* ── Info panel ── */
    info: 'Info',
    version_n: 'Verze ',
    about_title: 'Kingdom Come Deliverance Mapa',
    about_original_map: 'Původní mapa',
    about_by: ' od ',
    about_copyright:
      'The Kingdom Come: Deliverance logo, icons, and the map are copyright and property of ',
    cl_v30_1: 'Kompletně předěláno UI mapy.',
    cl_v30_2: 'Přidány některé nové funkce.',
    cl_v30_3: 'Aktualizovány veškeré markery.',
    cl_v20_1: 'Kompletně přeloženo do češtiny.',
    cl_v131_1: 'Přidány sdílitelné štítky.',
    cl_v131_2: 'Všechny mapové štítky nyní mají odkaz, který na ně po návštěvě přesměruje.',
    cl_v131_3: 'Nyní můžete sdílet přidané štítky, stačí přidat štítek na mapu a zkopírovat odkaz na značku.',
    cl_v131_4: 'Štítky, které s námi sdílíte, můžeme přidat k vašim štítkům. Stačí kliknout na Upravit a Uložit.',
    cl_v13_1: 'Rozlišení mapy změněno na 8192px.',
    cl_v13_2: 'Souřadnice na mapě nyní odpovídají souřadnicím ve hře.',
    cl_v13_3: 'Pokud jste na mapě měli značky s předchozím souřadnicovým systémem, budou automaticky převedeny na nový.',
    cl_v13_4: 'Nová možnost exportu/importu a vymazání přidaných štítků.',
    cl_v13_5: 'Obsah štítků bude aktualizován o další podrobnosti!',
    cl_v12_1: 'Všechny štítky byly extrahované ze hry.',
    cl_v12_2: 'Ke svým štítkům můžete přidat název a popis a také zvolit ikonu značky.',
    cl_v12_3: 'Na mapě si všimnete souřadnic, tyto souřadnice jsou herní souřadnice.',
    cl_v12_4: 'Pokud máte více informací o konkrétní značce, použijte tyto souřadnice, které mi pomohou ji najít.',
    cl_v12_5: 'Některé lesní zahrady mají informace o tom, jaké bylinky tam můžete najít.',
    cl_v10_1: 'V této verzi mapy můžete umístit štítky na mapu a ty se uloží do lokálního úložiště ve vašem prohlížeči. I když ji zavřete, zůstanou tam. Značky se ztratí pouze vymazáním mezipaměti prohlížeče!',
    cl_v10_2: 'Ke svým značkám můžete přidat název a popis a také zvolit ikonu značky.',
    cl_v10_3: 'Mapa bude denně aktualizována o nové značky a prvky.',

    /* ── Tools panel ── */
    lang_section: 'Jazyk / Language',
    lang_group_aria: 'Jazyk',
    lang_cs: 'Čeština',
    lang_en: 'English',
    import_export_section: 'Import / Export štítků',
    export_markers: 'Exportovat štítky',
    export_desc: 'Uloží všechny tvoje štítky do souboru JSON',
    import_markers: 'Importovat štítky',
    import_desc: 'Obnoví štítky ze zálohy uložené v souboru JSON',
    data_section: 'Správa dat',
    clear_markers: 'Vymazat štítky',
    clear_desc: 'Smaže všechny tvoje štítky z mapy (nelze vzít zpět)',

    /* ── Map controls + overlays ── */
    reset_view: 'Zobrazit celou mapu',
    fullscreen: 'Celá obrazovka',
    copy_view_link: 'Kopírovat odkaz na tento pohled',
    map_hint: 'Tip: <b>Klikněte pravým tlačítkem</b> kamkoli na mapu pro přidání vlastního markeru.',
    got_it: 'Rozumím',
    got_it_aria: 'Jasně',
    zoom_prefix: 'Přiblížení ',
    legend: 'Legenda',
    legend_show: 'Zobrazit legendu ikon',

    /* ── Dialogs ── */
    import_modal_title: 'Importovat štítky',
    import_modal_body: 'Vyber soubor s exportovanou zálohou. <strong>Současné štítky budou nahrazeny</strong> obsahem souboru.',
    cancel: 'Zrušit',
    confirm_title: 'Opravdu?',
    confirm_ok: 'Potvrdit',

    /* ── Category list / search / legend ── */
    group_toggle_all_aria: 'Přepnout vše ve skupině ',
    search_no_results: 'Nenalezeny žádné štítky',
    search_cat_own: 'Vlastní',
    search_tag_own: ' (moje)',
    search_more: ' dalších',
    default_icon: 'Šipka',

    /* ── Toasts + confirm bodies ── */
    toast_import_invalid: 'Soubor není platná záloha.',
    toast_import_no_markers: 'V souboru chybějí štítky.',
    toast_import_done: 'Štítky byly importovány ze zálohy.',
    toast_import_failed: 'Import se nezdařil.',
    toast_export_done: 'Štítky byly exportovány.',
    toast_clear_confirm: 'Toto smaže všechny tvoje štítky z mapy. Opravdu je chceš smazat?',
    toast_clear_title: 'Vymazat štítky?',
    toast_clear_ok: 'Vymazat',
    toast_clear_done: 'Všechny štítky byly smazány.',
    toast_link_copied: 'Odkaz zkopírován do schránky.',
    toast_link_failed: 'Kopírování selhalo — zkontroluj oprávnění prohlížeče.',
    toast_no_clipboard: 'Schránka není v tomto prohlížeči dostupná.',

    /* ── Marker popups + add/edit form ── */
    req: 'Požadavky:',
    copylink: 'Kopírovat odkaz',
    share: 'Sdílet',
    copied: 'Zkopírováno',
    edit_marker: 'Upravit štítek',
    choose_icon: 'Vyberte ikonu:',
    marker_title: 'Název štítku:',
    marker_desc: 'Popis štítku:',
    add: 'Přidat',
    add_marker: 'Přidat štítek',
    save: 'Uložit',
    remove_marker: 'Smazat štítek',
    remove_text: 'Opravdu chcete štítek smazat?',
    yes: 'Ano',
    no: 'Ne',
    marker_saved: 'Štítek byl uložen.',
    marker_removed: 'Štítek byl smazán.'
  },

  /* ─────────────────────────── English ─────────────────────────── */
  en: {

    /* ── Marker names (data-i18n keys inside js/markers.js).
          Taken verbatim from the English js/markers.js (commit 71e70fb). ── */
    SKALITZ: 'SKALITZ',
    PRIBYSLAVITZ: 'PRIBYSLAVITZ',
    ROVNA: 'ROVNA',
    MERHOJED: 'MERCHOJEDY',
    TALMBERG: 'TALMBERG',
    UZHITZ: 'UZHITZ',
    SAMOPESH: 'SAMOPESH',
    MONASTERY: 'MONASTERY',
    LEDETCHKO: 'LEDETCHKO',
    SASAU: 'SASAU',
    VRANIK: 'VRANIK',
    RATTAY: 'RATTAY',
    NEUHOF: 'NEUHOF',

    accident: 'Accident',
    alchemy_bench: 'Alchemy Bench',
    apothecary: 'Apothecary',
    archery_range: 'Archery Range',
    armourer: 'Armourer',
    baker: 'Baker',
    bandit_camp: 'Bandit Camp',
    baths: 'Baths',
    bed: 'Bed',
    beehive: 'Beehive',
    blacksmith: 'Blacksmith',
    boar_hunting_spot: 'Boar Hunting Spot',
    butcher: 'Butcher',
    camp: 'Camp',
    cave: 'Cave',
    charcoal_burner: 'Charcoal Burner',
    church: 'Church',
    cobbler: 'Cobbler',
    combat_arena: 'Combat Arena',
    conciliation_cross: 'Conciliation Cross',
    deer_hunting_spot: 'Deer Hunting Spot',
    fast_travel: 'Fast Travel',
    fish_trap: 'Fishing Trap',
    fishing_spot: 'Fishing Spot',
    grave: 'Grave',
    grindstone: 'Grindstone',
    herbalist: 'Herbalist',
    horse_trader: 'Horse Trader',
    huntsman: 'Huntsman',
    interesting_site: 'Interesting Site',
    lodgings: 'Lodgings',
    miller: 'Miller',
    mine: 'Mine',
    nest: 'Nest',
    scribe: 'Scribe',
    shrine: 'Shrine',
    tailor: 'Tailor',
    tanner: 'Tanner',
    tavern: 'Tavern',
    trader: 'Trader',
    vegetable_shop: 'Vegetable Shop',
    weaponsmith: 'Weaponsmith',
    windmill: 'Windmill',
    woodland_garden: 'Woodland Garden',
    treasure_map: 'Treasure Map',
    treasure_chest: 'Treasure',

    /* ── Herbs ── */
    belladonna: 'Belladonna',
    chamomile: 'Chamomile',
    comfrey: 'Comfrey',
    dandelion: 'Dandelion',
    eyebright: 'Eyebright',
    herb_paris: 'Herb Paris',
    marigold: 'Marigold',
    mint: 'Mint',
    nettle: 'Nettle',
    poppy: 'Poppy',
    sage: 'Sage',
    st_johns_wort: 'St. John\'s Wort',
    thistle: 'Thistle',
    valerian: 'Valerian',
    wormwood: 'Wormwood',

    /* ── Treasure requirements + lock difficulty ── */
    lockpicking: 'Lockpicking',
    spade: 'Spade',
    easy: 'easy',
    hard: 'hard',
    very_hard: 'very hard',

    /* ── Category group headings ── */
    grp_trade: 'Cities and Trade',
    grp_hunting: 'Hunting and Fishing',
    grp_nature: 'Nature and Underground',
    grp_places: 'Places and Dangers',
    grp_treasure: 'Treasures',

    /* ── Sidebar / legend category labels ── */
    cat_fast_travel: 'Fast Travel',
    cat_tavern: 'Tavern',
    cat_lodgings: 'Lodgings',
    cat_bed: 'Bed',
    cat_baths: 'Baths',
    cat_grindstone: 'Grindstone',
    cat_trader: 'Trader',
    cat_blacksmith: 'Blacksmith',
    cat_armourer: 'Armourer',
    cat_weaponsmith: 'Weaponsmith',
    cat_cobbler: 'Cobbler',
    cat_tailor: 'Tailor',
    cat_tanner: 'Tanner',
    cat_baker: 'Baker',
    cat_butcher: 'Butcher',
    cat_miller: 'Miller',
    cat_herbalist: 'Herbalist',
    cat_apothecary: 'Apothecary',
    cat_alchemy_bench: 'Alchemy Bench',
    cat_horse_trader: 'Horse Trader',
    cat_scribe: 'Scribe',
    cat_vegetable_shop: 'Greengrocer',
    cat_huntsman: 'Huntsman',
    cat_deer_hunting_spot: 'Deer Hunting Spot',
    cat_boar_hunting_spot: 'Boar Hunting Spot',
    cat_fishing_spot: 'Fishing Spot',
    cat_fish_trap: 'Fish Trap',
    cat_woodland_garden: 'Woodland Garden',
    cat_beehive: 'Beehive',
    cat_cave: 'Cave',
    cat_mine: 'Mine',
    cat_nest: 'Nest',
    cat_grave: 'Grave',
    cat_interesting_site: 'Interesting Site',
    cat_accident: 'Accident',
    cat_combat_arena: 'Combat Arena',
    cat_archery_range: 'Archery Range',
    cat_camp: 'Camp',
    cat_bandit_camp: 'Bandit Camp',
    cat_conciliation_cross: 'Conciliation Cross',
    cat_shrine: 'Shrine',
    cat_treasure_chest: 'Treasure Chest',
    cat_treasure_map: 'Treasure Map',

    /* ── Icon picker ── */
    icon_arrow: 'Arrow',
    icon_exclamation: 'Exclamation',
    icon_home: 'Home',
    icon_grocer: 'Grocer',
    icon_star: 'Star',
    icon_marker_a: 'Marker A',
    icon_marker_b: 'Marker B',
    icon_marker_c: 'Marker C',
    icon_treasure_map_alt: 'Pilgrim Map',

    /* ── Document head ── */
    doc_title: 'Kingdom Come Deliverance Map - Interactive map for Kingdom Come Deliverance',
    doc_description: 'Interactive Map for Kingdom Come Deliverance',
    doc_keywords: 'Interactive Map for Kingdom Come Deliverance',

    /* ── Rail ── */
    nav_panels: 'Side panels',
    rail_markers: 'Markers',
    rail_mymarkers: 'My Markers',
    rail_info: 'Info',
    rail_tools: 'Tools',
    rail_kcd2: 'Kingdom Come: Deliverance II map',
    menu_collapse: 'Collapse menu',
    menu_expand: 'Expand menu',

    /* ── Panels ── */
    tagline: 'Interactive Map',
    search_placeholder: 'Search markers by name...',
    search_aria: 'Search markers by name',
    search_clear: 'Clear search',
    search_results_aria: 'Search results',
    show_all: 'Show All',
    hide_all: 'Hide All',
    my_markers_empty: 'Right-click anywhere on the map to add your own marker.',
    map_view: 'Map View',
    city_names: 'City Names',

    /* ── Info panel ── */
    info: 'Info',
    version_n: 'Version ',
    about_title: 'Kingdom Come Deliverance Map',
    about_original_map: 'Original map',
    about_by: ' by ',
    about_copyright:
      'The Kingdom Come: Deliverance logo, icons, and the map are copyright and property of ',
    cl_v30_1: 'Completely redesigned map UI.',
    cl_v30_2: 'Added a few new features.',
    cl_v30_3: 'All markers updated.',
    cl_v20_1: 'Fully translated into Czech.',
    cl_v131_1: 'Added shareable markers.',
    cl_v131_2: 'All map markers now have a link that redirects to them when visited.',
    cl_v131_3: 'You can now share the markers you add — just place a marker on the map and copy the marker link.',
    cl_v131_4: 'Markers shared with you can be added to your own markers. Just click Edit and Save.',
    cl_v13_1: 'Map resolution changed to 8192px.',
    cl_v13_2: 'Map coordinates now match the in-game coordinates.',
    cl_v13_3: 'If you had markers on the map with the previous coordinate system, they will be converted automatically to the new one.',
    cl_v13_4: 'New option to export/import and clear the markers you added.',
    cl_v13_5: 'Marker content will be updated with more details!',
    cl_v12_1: 'All markers were extracted from the game.',
    cl_v12_2: 'You can add a name and a description to your markers, and choose the marker icon.',
    cl_v12_3: 'You will notice coordinates inside the marker popups — these are the in-game coordinates.',
    cl_v12_4: 'If you have more information about a specific marker, use those coordinates to help locate it.',
    cl_v12_5: 'Some woodland gardens list which herbs can be found there.',
    cl_v10_1: 'In this version of the map you can place markers on the map and they will be saved in your browser\'s local storage. Even if you close the map they will still be there. Markers are only lost if you clear your browser cache!',
    cl_v10_2: 'You can add a name and a description to your markers, and choose the marker icon.',
    cl_v10_3: 'The map will be updated daily with new markers and features.',

    /* ── Tools panel ── */
    lang_section: 'Jazyk / Language',
    lang_group_aria: 'Language',
    lang_cs: 'Čeština',
    lang_en: 'English',
    import_export_section: 'Import / Export markers',
    export_markers: 'Export markers',
    export_desc: 'Saves all your markers to a JSON file',
    import_markers: 'Import markers',
    import_desc: 'Restores markers from a backup stored in a JSON file',
    data_section: 'Data management',
    clear_markers: 'Clear markers',
    clear_desc: 'Deletes all your markers from the map (cannot be undone)',

    /* ── Map controls + overlays ── */
    reset_view: 'Show whole map',
    fullscreen: 'Fullscreen',
    copy_view_link: 'Copy link to this view',
    map_hint: 'Tip: <b>Right-click</b> anywhere on the map to add your own marker.',
    got_it: 'Got it',
    got_it_aria: 'Got it',
    zoom_prefix: 'Zoom ',
    legend: 'Legend',
    legend_show: 'Show icon legend',

    /* ── Dialogs ── */
    import_modal_title: 'Import markers',
    import_modal_body: 'Choose a file with an exported backup. <strong>Your current markers will be replaced</strong> by the contents of the file.',
    cancel: 'Cancel',
    confirm_title: 'Are you sure?',
    confirm_ok: 'Confirm',

    /* ── Category list / search / legend ── */
    group_toggle_all_aria: 'Toggle everything in group ',
    search_no_results: 'No markers found',
    search_cat_own: 'Own',
    search_tag_own: ' (mine)',
    search_more: ' more',
    default_icon: 'Arrow',

    /* ── Toasts + confirm bodies ── */
    toast_import_invalid: 'This file is not a valid backup.',
    toast_import_no_markers: 'The file contains no markers.',
    toast_import_done: 'Markers were imported from the backup.',
    toast_import_failed: 'Import failed.',
    toast_export_done: 'Markers were exported.',
    toast_clear_confirm: 'This will delete all your markers from the map. Are you sure you want to delete them?',
    toast_clear_title: 'Clear markers?',
    toast_clear_ok: 'Clear',
    toast_clear_done: 'All markers were deleted.',
    toast_link_copied: 'Link copied to the clipboard.',
    toast_link_failed: 'Copying failed — check your browser permissions.',
    toast_no_clipboard: 'The clipboard is not available in this browser.',

    /* ── Marker popups + add/edit form ── */
    req: 'Requirements:',
    copylink: 'Copy link',
    share: 'Share',
    copied: 'Copied',
    edit_marker: 'Edit marker',
    choose_icon: 'Choose icon:',
    marker_title: 'Marker title:',
    marker_desc: 'Marker description:',
    add: 'Add',
    add_marker: 'Add marker',
    save: 'Save',
    remove_marker: 'Remove marker',
    remove_text: 'Are you sure you want to remove this marker?',
    yes: 'Yes',
    no: 'No',
    marker_saved: 'Marker saved.',
    marker_removed: 'Marker removed.'
  }
};

/* ═══════════════════════════════════════════════
   ██ RUNTIME
   ═══════════════════════════════════════════════ */

/* Czech on the first visit; afterwards whatever the visitor last chose.
   "langactive" is the key the old English map used, and backups exported
   before this fork still carry it, so it is honoured as a fallback. */
var currentLang = (function () {
  try {
    var stored = localStorage.getItem(I18N_STORAGE) || localStorage.getItem('langactive');
    if (stored && I18N[stored]) return stored;
  } catch (e) { /* private mode */ }
  return I18N_DEFAULT;
})();

/* Locale-aware fallback: Czech first, then the key itself so a missing entry
   shows up as "cat_foo" rather than silently blanking the UI. */
function t(key, fallback) {
  var dict = I18N[currentLang];
  if (dict && typeof dict[key] === 'string') return dict[key];
  var base = I18N[I18N_DEFAULT];
  if (base && typeof base[key] === 'string') return base[key];
  return (fallback === undefined || fallback === null) ? key : fallback;
}

function getLang() { return currentLang; }

/* Escaped because dictionary values are injected into HTML (marker popups).
   Kept local instead of reusing ui.js's escapeHtml so this file stands alone. */
function i18nEscape(s) {
  return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
    return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
  });
}

/* Rewrite the visible text of every data-i18n span inside an HTML string, so a
   marker name built from js/markers.js arrives in the right language. Idempotent
   — the key is the source of truth, not the text that happens to be there. */
function translateHtml(html, dict) {
  var table = dict || I18N[currentLang];
  var fallback = I18N[I18N_DEFAULT];
  return String(html == null ? '' : html).replace(
    /<([a-z][a-z0-9]*)\b([^>]*?)data-i18n=(['"])([^'"]+)\3([^>]*)>([\s\S]*?)<\/\1>/gi,
    function (whole, tag, before, quote, key, after, inner) {
      var value = (table && typeof table[key] === 'string') ? table[key]
        : (typeof fallback[key] === 'string' ? fallback[key] : plainText(inner));
      return '<' + tag + before + 'data-i18n=' + quote + key + quote + after + '>' +
        i18nEscape(value) + '</' + tag + '>';
    }
  );
}

function trI18n(html) { return translateHtml(html); }

/* Same, but into an explicit language. Search needs every caption in every
   language to match against, without disturbing the live one. */
function trI18nAs(html, lang) { return translateHtml(html, I18N[lang] || I18N[I18N_DEFAULT]); }

/* Dictionary values are plain text; strip any markup so they can be re-escaped. */
function plainText(html) {
  return String(html == null ? '' : html).replace(/<[^>]*>/g, '');
}

/* Translate the live DOM in place. Covers index.html, the permanent village-name
   tooltips and any popup that is open right now. */
function applyI18n(root) {
  var scope = root || document;
  if (!scope || typeof scope.querySelectorAll !== 'function') return;

  scope.querySelectorAll('[data-i18n]').forEach(function (el) {
    var key = el.getAttribute('data-i18n');
    if (!key) return;
    /* data-i18n-html is for the few strings that carry markup (the map hint,
       the import-modal warning). Everything else is set as text. */
    if (el.hasAttribute('data-i18n-html')) el.innerHTML = t(key, el.innerHTML);
    else el.textContent = t(key, el.textContent);
  });

  var attrs = [
    ['data-i18n-placeholder', 'placeholder'],
    ['data-i18n-title', 'title'],
    ['data-i18n-aria', 'aria-label'],
    ['data-i18n-content', 'content']   // <meta name="description" …>
  ];
  attrs.forEach(function (pair) {
    scope.querySelectorAll('[' + pair[0] + ']').forEach(function (el) {
      var key = el.getAttribute(pair[0]);
      if (!key) return;
      el.setAttribute(pair[1], t(key, el.getAttribute(pair[1])));
    });
  });
}

/* Split a changelog key into its bullet points. */
function changelogItems(key) {
  return String(t(key, '')).split('|');
}

/* Switch language: remember it, repaint the DOM, then let the UI re-render the
   parts it builds in JavaScript (category list, legend, my markers, popups). */
function setLang(lang) {
  var next = (lang && I18N[lang]) ? lang : I18N_DEFAULT;
  currentLang = next;
  try { localStorage.setItem(I18N_STORAGE, next); } catch (e) { /* private mode */ }
  if (document.documentElement) document.documentElement.lang = next;
  applyI18n(document);
  document.dispatchEvent(new CustomEvent('kcdmap:langchange', { detail: { lang: next } }));
  return next;
}