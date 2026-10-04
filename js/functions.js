let  version = 1.3;
let  url = ('http://' + window.location.hostname + '/');
let  iconsUrl = './assets/images/';
let  tilesUrl = "./map/{z}_{x}_{y}.jpg";
let  maxNativeZoom = 5;
let  mapMinZoom = 1;
let  mapMaxZoom = 5;

let  mapSize = 8192;
let  tileSize = 256;
let  mapScale = mapSize / tileSize;
let  mapOffset = mapSize / mapScale / 2;
let  halfTile = tileSize / 2;
let  mapBounds = 4096;

L.CRS.MySimple = L.extend({}, L.CRS.Simple, {
	transformation: new L.Transformation(1 / 16, 0, -1 / 16, 256)
});

let  myBounds = [[0,0],[mapBounds, mapBounds]];

let  map = L.map('map', {
  maxNativeZoom: maxNativeZoom,
  minZoom: mapMinZoom,
  maxZoom: mapMaxZoom,
  zoomControl: false, // the sidebar's own control cluster handles zooming (see js/ui.js)
  crs: L.CRS.MySimple,
  scrollWheelZoom: false, // disable original zoom function
  smoothWheelZoom: true,  // enable smooth zoom 
  smoothSensitivity: 1,   // zoom speed. default is 1
}).setView([2048,2048], 2);

L.tileLayer.canvas(tilesUrl, {
  maxNativeZoom: maxNativeZoom,
  minZoom: mapMinZoom,
  maxZoom: mapMaxZoom,
  tileSize: tileSize,
  noWrap: true,
  tms: false,
  bounds: myBounds,
  continuousWorld: true
}).addTo(map);

map.setMaxBounds([[-3000, -3000], [7000, 7000]]);

window.latLngToPixels = function(latlng) {
  return window.map.project([latlng.lat, latlng.lng], window.map.getMaxZoom());
};

window.pixelsToLatLng = function(x, y) {
  return window.map.unproject([x, y], window.map.getMaxZoom());
};

let  popup = L.popup();

// The sidebar is plain markup in index.html, driven by js/ui.js. It exposes a
// sidebar object with open()/close() so the code below keeps working.
sidebar.open('home');

let  hash = new L.Hash(map);

// Fix for the 1px white border

function gridfix(){
  let  originalInitTile = L.GridLayer.prototype._initTile
  L.GridLayer.include({
    _initTile: function (tile) {
      originalInitTile.call(this, tile);
      let  tileSize = this.getTileSize();
      tile.style.width = tileSize.x + 0.5 + 'px';
      tile.style.height = tileSize.y + 0.5 + 'px';
    }
  });
};
//gridfix();


let  layerGroups = [];

let  textLayer = [];

let  globalMarkers = [];
let  transparentMarker = L.icon({
        iconUrl: iconsUrl+'alpha_marker.png',
        iconSize: [1, 1],
        iconAnchor: [18, 18],
        popupAnchor: [0, -18]
      });

for (let  i = 0; i < textMarkers.length; i++) {
  // If the group doesn't exists
  if (layerGroups.textmarkers == undefined) {
    // Create the group
    layerGroups.textmarkers = new L.LayerGroup();
  }
  // Add the marker
  let  textMarker = new L.marker(textMarkers[i].coords, { opacity: 0.0, icon: transparentMarker }); //opacity may be set to zero
  textMarker.bindTooltip(trI18n(textMarkers[i].name), {permanent: true, direction: "top", className: "text-label", offset: [0, 0] });
  textMarker.addTo(layerGroups.textmarkers); // Adds the text markers to map.
  //layerGroups.textmarkers.addTo(map);
}

map.on('zoomend', function(e) {
  let  size = map.getZoom();
  switch (size){  // zoom level

    case 0:
      $('.text-label').css('visibility', 'visible');
      $('.text-label span').css('font-size', '12px');
      $('.text-label.secondary').css('visibility', 'hidden'); break;
    case 1:
      $('.text-label').css('visibility', 'visible');
      $('.text-label span').css('font-size', '14px');
      $('.text-label.secondary').css('visibility', 'hidden'); break;
    case 2:
      $('.text-label').css('visibility', 'visible');
      $('.text-label span').css('font-size', '16px');
      $('.text-label.secondary').css('visibility', 'hidden'); break;
    case 3:
      $('.text-label').css('visibility', 'visible');
      $('.text-label span').css('font-size', '18px');
      $('.text-label.secondary').css('visibility', 'hidden'); break;
    case 4:
      $('.text-label').css('visibility', 'visible');
      $('.text-label span').css('font-size', '20px');
      $('.text-label.secondary').css('visibility', 'hidden'); break;
    case 5:
      $('.text-label').css('visibility', 'visible');
      $('.text-label span').css('font-size', '20px');
      $('.text-label.secondary').css('visibility', 'hidden'); break;
  }
});

function getIcon(index) {
  let  icon = markers[index].icon;
	
  let  markerIcon = L.icon({
    iconUrl: iconsUrl+icon+'.png',
    iconSize: [36,36], // size of the icon
    iconAnchor:   [18, 18], // point of the icon which will correspond to marker's location
    popupAnchor:  [0, -18],
    // point from which the popup should open relative to the iconAnchor
  });

  return markerIcon;
}

/* ══════════════════════════════════════════════
   ██ LABELS
   js/markers.js and js/usr_markers.js identify herbs, requirements and lock
   difficulty by their in-game ids ("belladonna", "lockpicking", "very_hard").
   Those ids double as the CSS classes behind the little in-game icons, so they
   must stay English — only the text the visitor actually reads is translated,
   and that text now lives in the single cs/en dictionary in js/i18n.js.
   ══════════════════════════════════════════════ */

/* Fallback for an id the dictionary has never heard of: turn the underscores
   into spaces so a newly added marker shows its id instead of going blank. */
function  fallbackLabel(id) {
  return String(id == null ? '' : id).replace(/_/gi, " ");
}

/* Herbs, requirements and lock levels carry their own id, so they resolve
   straight from the dictionary. It is also called with a marker *group* id for
   the native hover title, so a group falls back to its category caption —
   otherwise every group without a bare key would show "fast travel". */
 function  idLabel(id) {
   var  key = String(id == null ? '' : id);
   var  translated = I18N[currentLang][key];
   if (typeof translated === "string") return translated;
   var  fallback = I18N[I18N_DEFAULT][key];
   if (typeof fallback === "string") return fallback;
   var  caption = I18N[currentLang]["cat_" + key];
   if (typeof caption === "string") return caption;
   var  captionDefault = I18N[I18N_DEFAULT]["cat_" + key];
   if (typeof captionDefault === "string") return captionDefault;
   return fallbackLabel(id);
 }

/* An icon is usually also a category, so fall back through the icon caption and
   the category caption before giving up. That keeps js/ui.js and the icon picker
   from drifting apart. */
function  iconLabel(id) {
  var  key = String(id == null ? '' : id);
  if (I18N[currentLang]["icon_" + key]) return t("icon_" + key);
  if (I18N[currentLang]["cat_" + key]) return t("cat_" + key);
  var  own = I18N[currentLang][key];
  if (typeof own === "string") return own;
  return fallbackLabel(id);
}

/* Every popup below is generated from the marker data, so its HTML is assembled
   once with the Czech source strings embedded and translated on the way in. The
   untranslated markup is kept on the popup object, which is what allows a
   language switch to repaint a popup that is already open. */
function  bindTrPopup(marker, html) {
  var  popup = marker.bindPopup(trI18n(html)).getPopup();
  popup.__kcdRawHtml = html;
  marker.on("popupopen", function () {
    var  p = marker.getPopup();
    if (p && p.__kcdRawHtml) p.setContent(trI18n(p.__kcdRawHtml));
  });
  return marker;
}

/* Called from js/ui.js when the language changes: repaint the popup that happens
   to be open right now. Skipped while an add/edit form is filled in, because
   repainting would throw away what the visitor has typed. */
function  refreshOpenPopup() {
  if (typeof map === "undefined" || !map || !map._popup) return;
  var  popup = map._popup;
  if (!popup.__kcdRawHtml) return;
  if (popup._container && popup._container.querySelector(".edit-dialog:not(.hide)")) return;
  popup.setContent(trI18n(popup.__kcdRawHtml));
}

// GAME MARKERS

for (let  i = 0; i < markers.length; i++) {
  // if the group doesn't exists in layergroups
  if (layerGroups[markers[i].group] == undefined) {
    // Create the group
    layerGroups[markers[i].group] = new L.LayerGroup();
  }
  if (markers[i].desc == undefined) {
    markers[i].desc = "";
  }
  if (markers[i].items == undefined) {
    markers[i].items = "";
  }
	if (markers[i].kcditems == undefined) {
    markers[i].kcditems = "";
  }
  let  ilist = "";
  for (let  h in markers[i].kcditems) {
		let  kcditems =  markers[i].kcditems[h];
    ilist += '<li><i class="'+ markers[i].kcditems[h].item+'"></i><span class="iname" data-i18n="'+ markers[i].kcditems[h].item+'">'+ idLabel(markers[i].kcditems[h].item)+'</span><span class="qnt">'+markers[i].kcditems[h].qnt+'</span></li>';
  }
  let  x = (markers[i].coords[1]).toFixed(0);
  let  y = (markers[i].coords[0]).toFixed(0);
  
  let  origin_x = (markers[i].coords[1]).toFixed(0);
  let  origin_y = (markers[i].coords[0]).toFixed(0);
	
  let  markerUrl = (url+"?marker="+y+","+x);
	markerUrl = encodeURI(markerUrl);

  // Add the marker
  let  marker = bindTrPopup(L.marker([x, y], {icon: getIcon(i), title: idLabel(markers[i].group)}), "<p class='mtitle'>"+markers[i].name + "</p><span class='mdesc'>"+ markers[i].desc +"</span><ul class='ilist'>"+ilist+"</ul><p class='original_coords'>"+origin_y+","+origin_x+"</p><p class='markerlink hide'>"+markerUrl+"</p><button class='copymarkerurl'><span class='sharetext' data-i18n='copylink'>Kopírovat odkaz</span><span class='copiedmsg hide'>Zkopírováno</span></button>").addTo(layerGroups[markers[i].group]);
  /* The popup HTML is built once at load time, so translate the name, the herbs
     and the buttons now; refreshOpenPopup() redoes it if the visitor switches
     language while a popup is open. */
  marker.getPopup().__kcdHtml = trI18n(marker.getPopup().getContent());
	globalMarkers.push(marker);
}

function getIconUsr(index) {
  let  icon = usr_markers[index].icon;

  let  markerIcon = L.icon({
    iconUrl: iconsUrl+icon+'.png',
    iconSize: [36,36], // size of the icon
    iconAnchor:   [18, 18], // point of the icon which will correspond to marker's location
    popupAnchor:  [0, -18],
    // point from which the popup should open relative to the iconAnchor
  });

  return markerIcon;
}

// USER MARKERS
for (let  i = 0; i < usr_markers.length; i++) {
	let  imarkers = usr_markers[i]
  // if the group doesn't exists in layergroups
  if (layerGroups[imarkers.group] == undefined) {
    // Create the group
    layerGroups[imarkers.group] = new L.LayerGroup();
  }
  if (imarkers.desc == undefined) {
    imarkers.desc = "";
  }
	if (imarkers.desc2 == undefined) {
    imarkers.desc2 = "";
  }
  if (imarkers.items == undefined) {
    imarkers.items = "";
  }
  let req = "";
  if (imarkers.req != undefined) {
  imarkers.req = (imarkers.req == undefined) ? "" : imarkers.req;
  imarkers.level = (imarkers.level == undefined) ? "" : imarkers.level;
    req = '<p class="req" data-i18n="req">Požadavky:</p><ul class="ilist"><li><i class="'+imarkers.req+'"></i><span class="iname" data-i18n="'+imarkers.req+'">'+idLabel(imarkers.req)+'</span><span class="ilevel '+imarkers.level+'" data-i18n="'+imarkers.level+'">'+idLabel(imarkers.level)+'</span></li>';
  }
  let  ilist = "";
  for (let  c in imarkers.items) {
    ilist += '<li><i class="'+ imarkers.items[c]+'"></i><span class="iname" data-i18n="'+ imarkers.items[c]+'">'+ idLabel(imarkers.items[c])+'</span></li>';
  }
	
  let  x = (imarkers.coords[1]);
  let  y = (imarkers.coords[0]);
	
  let  markerUrl = (url+"?marker="+y+","+x);
	markerUrl = encodeURI(markerUrl);

  // Add the marker
  let  marker = bindTrPopup(L.marker([x, y], {icon: getIconUsr(i), title: plainName(trI18n(imarkers.name))}), "<p class='mtitle'>"+imarkers.name + "</p><p class='mdesc'>"+ imarkers.desc +"</p><p class='mdesc'>"+ imarkers.desc2 +"</p>"+req+"<ul class='ilist'>"+ilist+"</ul><p class='original_coords'>"+y+","+x+"</p><p class='markerlink hide'>"+markerUrl+"</p><button class='copymarkerurl'><span class='sharetext' data-i18n='share'>Sdílet</span><span class='copiedmsg hide'>Zkopírováno</span></button>").addTo(layerGroups[imarkers.group]);
	globalMarkers.push(marker);
}

function toggle(element, layer) {
  if (element.checked) {
    map.addLayer(layerGroups[layer]);
  } else {
    $('#allmarkers').prop('checked', false);
    map.removeLayer(layerGroups[layer]);
  }
}

// TOGGLE ALL LAYERS
let  allmarkers = document.getElementById('allmarkers');
function toggleAll(element) {
		if (element.checked) {
			$('.markers-list input').prop('checked', true);
			for (let  key in layerGroups) {
				map.addLayer(layerGroups[key]);
			}
		} else {
			$('.markers-list input').prop('checked', false);
			for (let  keys in layerGroups) {
				map.removeLayer(layerGroups[keys]);
			}
		}
		// #textmarkers is a master switch, so it isn't part of .markers-list —
		// but it does own a layer group, so keep it in step with "all markers".
		let  textBox = document.getElementById('textmarkers');
		if (textBox) {
			textBox.checked = element.checked;
			applyTextMarkers(element.checked);
		}
	}

allmarkers.onchange = function() {toggleAll(this)};

$(allmarkers).click(function(){
  if($(this).prop("checked") == true){
    let  toggled, activemarkers = [];
    $('.markers-list input').each(function() {
      toggled = {id: $(this).attr('id'), value: $(this).prop('checked')};
      activemarkers.push(toggled);
    });
    localStorage.setItem("activemarkers", JSON.stringify(activemarkers));

  }
  else if($(this).prop("checked") == false){
    localStorage.setItem("activemarkers", "[]");
  }
});

$('.markers-list input').each(function() {
  this.onchange = function() {
    toggle(this, this.id);
  };
});

// VILLAGE NAMES
// #textmarkers is a master switch (it sits above the category groups), so it
// needs its own wiring instead of the .markers-list loop above.
function applyTextMarkers(isChecked) {
  if (isChecked) {
    $('.text-label').css('visibility', 'visible');
    $('.text-label').css('font-size', '24px');
    $('.text-label.secondary').css('visibility', 'hidden');
  } else {
    $('.text-label').css('visibility', 'hidden');
    $('.text-label.secondary').css('visibility', 'hidden');
  }
}

$('#textmarkers').on('change', function() {
  let  isChecked = $(this).prop('checked');
  toggle(this, 'textmarkers');
  applyTextMarkers(isChecked);
});

// URL Function
function getUrlVars() {
let  vars = {};
let  parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
vars[key] = value;
});
return vars;
}

let  urlCoordinates = getUrlVars()["marker"];
if (urlCoordinates != undefined) {
  let  markFound = false;
  sidebar.close();
  if (getUrlVars()["zoom"]>=1 && getUrlVars()["zoom"]<=4) {
    let  urlZoom = getUrlVars()["zoom"];
  } else {
    let  urlZoom = 4;
  }

  for (let  l in globalMarkers){
    let  markerX = globalMarkers[l]._latlng.lat;
    let  markerY = globalMarkers[l]._latlng.lng;
    let  markerdata = (markerY+','+markerX);    

    if (markerdata == urlCoordinates){
      $('#'+globalMarkers[l].options.title).prop('checked', true);
      map.addLayer(layerGroups[globalMarkers[l].options.title]);
      map.flyTo(globalMarkers[l].getLatLng(),urlZoom);
      if (getUrlVars()["popup"]!="false") globalMarkers[l].openPopup();
      markFound = true;
    };
  };

  if (markFound==false) {
    let  aux_y = urlCoordinates.split(",")[1];
    let  aux_x = urlCoordinates.split(",")[0];
    if ((aux_y <= mapBounds && aux_y>0) && (aux_x<=mapBounds && aux_x>0)) {
      let  aux_marker = L.marker([aux_y, aux_x]);        
      map.flyTo(aux_marker.getLatLng(), urlZoom);
      aux_marker = null;
    }
    aux_y = null;
    aux_x = null;
  };
};

// Copy function

function copy(element) {
  let  $temp = $("<input>");
  $("body").append($temp);
  $temp.val($(element).text()).select();
  document.execCommand("copy");
  $temp.remove();
}
$(document).on('click', '.copymarkerurl', function() {
  let  copy = $(this).parent().find('.markerlink');
  let  $temp = $("<input>");
  $("body").append($temp);
  $temp.val($(copy).text()).select();
  document.execCommand("copy");
  $('.copiedmsg').fadeIn({queue: false, duration: '300'});
  $('.copiedmsg').delay(1000).fadeOut(300);
  $temp.remove();
})


let  locatedGroup = L.layerGroup();
markers.forEach(function (items) {
  let  marker = L.marker(items.latLng, {
    title: items.name,
    riseOnHover: true
  });
  // Add each marker to the group
  locatedGroup.addLayer(marker);
  // Save the ID of the marker with it's data
  items.marker_id = locatedGroup.getLayerId(marker);
  //console.log(items.marker_id);
});

markers.forEach(function (items) {
  $('.locate').on('click', function(){
    let  locateMarker = $(this).attr('data-marker');
    if(locateMarker == items.title){
      let  locatedMarkerIcon = L.icon({
        iconUrl: iconsUrl+'alpha_marker.png',
        iconSize: [iWidth, iHeight],
        iconAnchor: [iWidth / 2, iHeight],
        popupAnchor: [0, -iHeight]
      });

      $('#'+items.group).prop('checked', true);
      map.addLayer(layerGroups[items.group]);

      let  locatedMarker = bindTrPopup(L.marker(items.coords, {icon: locatedMarkerIcon}), items.name + "<br>"+ items.desc).addTo(map);
      map.panTo(locatedMarker.getLatLng());
      locatedMarker.openPopup();
      locatedMarker.on('popupclose', function() {
        map.removeLayer(locatedMarker);
      });
    };
  });
});

// Limit input of coordinates range
function numonly(e){
  $("#mlat,#mlon").keyup(function() {
    let  val = $(this).val().replace(/-?\d+[^0-9]+/,"");
    if (val => 2934){
      !/^\s*$/.test(val);
      if (val > 0) {
        val = (parseInt(val) > 2934) ? 2934 : val;
      }else{
        val = (parseInt(val) > -2394) ? val : -2394;
      }

    }
    else {
      (!/^\s*$/.test(val));
      if (val > 0) {
        val = (parseInt(val) > 2934) ? 2934 : val;
      }else{
        val = (parseInt(val) > -2394) ? val : -2394;
      }
    }
    $(this).val(val);
  });
}
// End limit input of coordinates range

function getAObj(obj,name) {
  for (e in obj) {
    if (obj[e].name == name)
      return obj[e].value;
  };
  return 0;
};

// Available markers to add on click
let  mapMarkers = 
[
  {
	icon:"arrow",
	width: "36",
	height: "36"},
  {
	icon:"accident",
	width: "36",
	height: "36"},
  {
	icon:"alchemy_bench",
	width: "36",
	height: "36"},
  {
	icon:"apothecary",
	width: "36",
	height: "36"},
  {
	icon:"archery_range",
	width: "36",
	height: "36"},
  {
	icon:"armourer",
	width: "36",
	height: "36"},
  {
	icon:"baker",
	width: "36",
	height: "36"},
  {
	icon:"bandit_camp",
	width: "36",
	height: "36"},
  {
	icon:"baths",
	width: "36",
	height: "36"},
  {
	icon:"beehive",
	width: "36",
	height: "36"},
  {
	icon:"blacksmith",
	width: "36",
	height: "36"},
  {
	icon:"boar_hunting_spot",
	width: "36",
	height: "36"},
  {
	icon:"butcher",
	width: "36",
	height: "36"},
  {
	icon:"camp",
	width: "36",
	height: "36"},
  {
	icon:"cave",
	width: "36",
	height: "36"},
  {
	icon:"charcoal_burner",
	width: "36",
	height: "36"},
  {
	icon:"cobbler",
	width: "36",
	height: "36"},
  {
	icon:"combat_arena",
	width: "36",
	height: "36"},
  {
	icon:"conciliation_cross",
	width: "36",
	height: "36"},
  {
	icon:"deer_hunting_spot",
	width: "36",
	height: "36"},
  {
	icon:"fast_travel",
	width: "64",
	height: "64"},
  {
	icon:"fish_trap",
	width: "36",
	height: "36"},
  {
	icon:"fishing_spot",
	width: "36",
	height: "36"},
  {
	icon:"grave",
	width: "36",
	height: "36"},
  {
	icon:"grindstone",
	width: "36",
	height: "36"},
  {
	icon:"grocer",
	width: "36",
	height: "36"},
  {
	icon:"herbalist",
	width: "36",
	height: "36"},
  {
	icon:"home",
	width: "36",
	height: "36"},
  {
	icon:"horse_trader",
	width: "36",
	height: "36"},
  {
	icon:"huntsman",
	width: "36",
	height: "36"},
  {
	icon:"interesting_site",
	width: "36",
	height: "36"},
  {
	icon:"lodgings",
	width: "36",
	height: "36"},
  {
	icon:"miller",
	width: "36",
	height: "36"},
  {
	icon:"nest",
	width: "36",
	height: "36"},
  {
	icon:"scribe",
	width: "36",
	height: "36"},
  {
	icon:"shrine",
	width: "36",
	height: "36"},
  {
	icon:"tailor",
	width: "36",
	height: "36"},
  {
	icon:"tanner",
	width: "36",
	height: "36"},
  {
	icon:"tavern",
	width: "36",
	height: "36"},
  {
	icon:"trader",
	width: "36",
	height: "36"},
  {
	icon:"treasure_chest",
	width: "36",
	height: "36"},
  {
	icon:"treasure_map",
	width: "36",
	height: "36"},
  {
	icon:"treasure_map_alt",
	width: "36",
	height: "36"},
  {
	icon:"weaponsmith",
	width: "36",
	height: "36"},
  {
	icon:"woodland_garden",
	width: "36",
	height: "36"},
  {
	icon:"belladonna",
	width: "36",
	height: "36"},
  {
	icon:"chamomile",
	width: "36",
	height: "36"},
  {
	icon:"comfrey",
	width: "36",
	height: "36"},
  {
	icon:"dandelion",
	width: "36",
	height: "36"},
  {
	icon:"eyebright",
	width: "36",
	height: "36"},
  {
	icon:"herb_paris",
	width: "36",
	height: "36"},
  {
	icon:"marigold",
	width: "36",
	height: "36"},
  {
	icon:"mint",
	width: "36",
	height: "36"},
  {
	icon:"nettle",
	width: "36",
	height: "36"},
  {
	icon:"poppy",
	width: "36",
	height: "36"},
  {
	icon:"sage",
	width: "36",
	height: "36"},
  {
	icon:"st_johns_wort",
	width: "36",
	height: "36"},
  {
	icon:"thistle",
	width: "36",
	height: "36"},
  {
	icon:"valerian",
	width: "36",
	height: "36"},
  {
	icon:"wormwood",
	width: "36",
	height: "36"},
  {
	icon:"marker_a",
	width: "36",
	height: "36"},
  {
	icon:"marker_b",
	width: "36",
	height: "36"},
  {
	icon:"marker_c",
	width: "36",
	height: "36"},
  {
	icon:"star",
	width: "36",
	height: "36"},
  {
	icon:"exclamation",
	width: "36",
	height: "36"},
	
]

let  markerIconTypes = [];
for (let  i in mapMarkers) {
  let  icon = mapMarkers[i].icon;
  let  iWidth = mapMarkers[i].width;
  let  iHeight = mapMarkers[i].height;
  // make the icon while we are here
  markerIconTypes[i] = L.icon({
    className: "",
    iconUrl: iconsUrl + icon.replace(/ /g, "") + '.png',
    iconSize: [iWidth, iHeight],
    iconAnchor: [iWidth / 2, iHeight / 2,],
    popupAnchor: [0, -iHeight / 2]
  });
};
// End available markers to add on click

// User added markers
let  groupUser = [];
initUserLayerGroup();
function initUserLayerGroup() {
	let  markersUser = [];
	if (localStorage.mapUserMarkers == "undefined") {
		localStorage.mapUserMarkers = "[]";
	}
  if (localStorage.mapUserMarkers !== undefined) {
    let  storageMarkers = [];

    storageMarkers = JSON.parse(localStorage.mapUserMarkers);

    for (let  i = 0; i < storageMarkers.length; i++) {
      let  x = storageMarkers[i].coords.x;
      let  y = storageMarkers[i].coords.y;
      let  name = storageMarkers[i].name;
      let  icon = storageMarkers[i].icon;
			let  iconvalue = storageMarkers[i].iconvalue;
      let  iconUrl = storageMarkers[i].icon.options.iconUrl;
      let  title = storageMarkers[i].title;
      let  desc = storageMarkers[i].desc;
			
			let  markerlink = (url+"?m="+y+","+x+"&title="+name+"&desc="+desc+"&icon="+iconvalue+"&");
			markerlink = encodeURI(markerlink);

      let  customIcon = L.icon({
        iconUrl: storageMarkers[i].icon.options.iconUrl,
        iconSize: storageMarkers[i].icon.options.iconSize,
        iconAnchor: [18,18], //storageMarkers[i].icon.options.iconAnchor,
        popupAnchor:  [0,-18], //storageMarkers[i].icon.options.popupAnchor
				className: storageMarkers[i].icon.options.className,
      });
			
			let  popupcontent = '<div class="popcontent">\
			<p class="mtitle">'+name+'</p>\
			<p class="mdesc">'+desc+'</p>\
			<span class="mcoords">X: '+y+' Y: '+x+'</span></div>\
      <span class="markerlink hide">'+markerlink+'</span>\
      <button class="copymarkerurl"><span class="sharetext" data-i18n="copylink">Kopírovat odkaz</span>\
      <span class="copiedmsg hide">Zkopírováno</span></button>\
			<button class="edit-marker" data-i18n="edit_marker">Upravit štítek</button>\
			<div id="edit-dialog" class="hide">\
			<div class="chooseIcon" data-i18n="choose_icon">Vyberte ikonu:</div>\
			<div id="iconprev" style="background-image:url(\''+iconUrl+'\')"></div>\
			<select id="select_icon" name="icon" onchange="iconpref(this.value);">';
      for (let  j in mapMarkers) {
        popupcontent +='<option value="'+j+'">'+iconLabel(mapMarkers[j].icon)+'</option>';
      };
      popupcontent = popupcontent+'</select>\
			<input type="text" id="editedtitle" name="title" value="'+title+'">\
			<textarea id="editeddesc" name="desc">'+desc+'</textarea>\
			<button class="cancel" data-i18n="cancel">Zrušit</button>\
			<button class="save-marker" data-i18n="save">Uložit</button>\
			</div>\
			<button class="remove-marker" data-i18n="remove_marker">Smazat štítek</button>\
			<div id="remove-dialog" class="hide">\
			<span class="remove-text" data-i18n="remove_text">Opravdu chcete štítek smazat?</span>\
			<button class="yes" data-i18n="yes">Ano</button>\
			<button class="no" data-i18n="no">Ne</button></div>';
      let  marker = bindTrPopup(L.marker([x, y], {draggable: false,icon: customIcon}), popupcontent);

      marker.on("popupopen", onPopupOpen);
      markersUser.push(marker);
    }
  } else {
		localStorage.mapUserMarkers = "[]";
	}
	groupUser = L.layerGroup(markersUser);
  map.addLayer(groupUser);
}
// End user added markers

// Patch coordinates if old version
let  actualversion = localStorage.getItem('version');
if (actualversion === null || actualversion < version) {
  localStorage.setItem('version', version);
  console.log("version outdated")
  storageMarkers = JSON.parse(localStorage.mapUserMarkers);
  for (let  i = 0; i < storageMarkers.length; i++) {
    let  x = storageMarkers[i].coords.x;
    let  y = storageMarkers[i].coords.y;
    x = (x/2932*2048 + 2048).toFixed(0);
    y = (y/2932*2048 + 2048).toFixed(0);
    storageMarkers[i].coords.x = x
    storageMarkers[i].coords.y = y
    localStorage.mapUserMarkers = JSON.stringify(storageMarkers);
    map.removeLayer(groupUser);
    initUserLayerGroup();
  };
} else {};
// End Patch

// Change marker background image on select marker
function iconpref(value) {
  document.getElementById("iconprev").style.backgroundImage = "url("+markerIconTypes[value].options.iconUrl+")";
};
// Change marker name image on select marker
function titlepref(value) {
  /* The option label is the translated icon caption, so take it verbatim
     instead of re-deriving a name from the icon id — iconLabel() would be
     handed a caption, miss every lookup and land on fallbackLabel(), which
     only works by accident until a caption collides with some other key. */
  document.getElementById("titleprev").value = value;
};

function removeMarkerE(lat,lon) {
  for(e in markers) {
    let  tmpm = markers[e].getLatLng();
    if(tmpm.lat == lat && tmpm.lng == lon) {
      map.removeLayer(markers[e]);
    };
  };
};


function addMarkerText(lat,long) {
  //console.log(markerIconTypes);
  let  message = '<div class="chooseIcon" data-i18n="choose_icon">Vyberte ikonu:</div>\
  <div id="iconprev" style="background-image:url(\''+markerIconTypes[0].options.iconUrl+'\')"></div>\
  <form id="addmark" method="post" action="#">\
  <select id="select_icon" name="icon" onchange="iconpref(this.value); titlepref(this.options[this.selectedIndex].innerHTML);">';
  for (let  i in mapMarkers) {
    message +='<option value="'+i+'">'+iconLabel(mapMarkers[i].icon)+'</option>';
  };
  message = message+'</select><div class="markertitle" data-i18n="marker_title">Název štítku:</div>\
  <input type="text" id="titleprev" name="title" value="'+t('default_icon')+'">\
  <div class="markerdesc" data-i18n="marker_desc">Popis štítku:</div>\
  <textarea name="desc" onclick="this.value=\'\'; this.onclick = function(){}"></textarea>\
  <table class="coordsinputs">\
  <tr>\
  <td>X:<input type="text" readonly="readonly" name="mlon" id="mlon" maxlength="5" value="'+long+'" onKeyPress="return numonly(this,event)"></td>\
  <td>Y:<input id="mlat" type="text" readonly="readonly" name="mlat" maxlength="5" value="'+lat+'" onKeyPress="return numonly(this,event)"></td>\
  </tr>\
  </table>\
  <input type="hidden" name="submit" value="true">\
  <button type="submit" class="send" data-i18n="add">Přidat</button>\
  </form>';
  // 
  let  ltn = {};
  ltn.lat = lat;
  ltn.lng = long;
  popup.setLatLng(ltn).setContent(trI18n(message)).openOn(map);
  
  // Add the mark
  $('#addmark').submit(function(e){
		let  selectedIcon = $(this).find("#select_icon option:selected").text();
    let  postData = $(this).serializeArray();
    let  lat = Math.round(getAObj(postData,"mlat"));
    let  lon = Math.round(getAObj(postData,"mlon"));
    postData.push({"name": "lat","value":lat});
    postData.push({"name": "lon","value":lon});

    let  storageMarkers = [];
    let  markersUser = [];

    if (localStorage.mapUserMarkers !== undefined) {
      storageMarkers = JSON.parse(localStorage.mapUserMarkers);
    }
    storageMarkers.push({
      "coords": {
        "x": lat,
        "y": lon
      },
      "name": getAObj(postData,"title"),
      "icon": markerIconTypes[getAObj(postData,"icon")],
      "iconvalue": getAObj(postData,"icon"),
      "title": getAObj(postData,"title"),
      "desc": getAObj(postData,"desc")
    });
    popup._close();
		
		let  markerlink = (url+"?m="+lon+","+lat+"&title="+getAObj(postData,"title")+"&desc="+getAObj(postData,"desc")+"&icon="+getAObj(postData,"icon")+"&");
		markerlink = encodeURI(markerlink);

    let  popupcontent = '<div class="popcontent">\
    <p class="mtitle">'+getAObj(postData,'title')+'</p>\
    <p class="mdesc">'+getAObj(postData,'desc')+'</p>\
    <span class="mcoords">[ '+getAObj(postData,'mlon')+' , '+getAObj(postData,'mlat')+']</span></div>\
    <span class="markerlink hide">'+markerlink+'</span>\
    <button class="copymarkerurl"><span class="sharetext" data-i18n="copylink">Kopírovat odkaz</span>\
    <span class="copiedmsg hide">Zkopírováno</span></button>\
    <button class="edit-marker" data-i18n="edit_marker">Upravit štítek</button>\
    <div id="edit-dialog" class="hide">\
    <div class="chooseIcon" data-i18n="choose_icon">Vyberte ikonu:</div>\
    <div id="iconprev" style="background-image:url(\''+markerIconTypes[0].options.iconUrl+'\')"></div>\
    <select id="select_icon" name="icon" onchange="iconpref(this.value);">';
      for (let  i in mapMarkers) {
      popupcontent +='<option value="'+i+'">'+iconLabel(mapMarkers[i].icon)+'</option>';
    };
    popupcontent = popupcontent+'</select>\
    <input type="text" id="editedtitle" name="title" value="'+getAObj(postData,'title')+'">\
    <textarea id="editeddesc" name="desc">'+getAObj(postData,'desc')+'</textarea>\
    <button class="cancel" data-i18n="cancel">Zrušit</button>\
    <button class="save-marker" data-i18n="save">Uložit</button>\
    </div>\
    <button class="remove-marker" data-i18n="remove_marker">Smazat štítek</button>\
    <div id="remove-dialog" class="hide">\
    <span class="remove-text" data-i18n="remove_text">Opravdu chcete štítek smazat?</span>\
    <button class="yes" data-i18n="yes">Ano</button>\
    <button class="no" data-i18n="no">Ne</button></div>'
    //
    let  newMarker = L.marker({lat: lat, lng: lon},{icon: markerIconTypes[getAObj(postData,"icon")]});
    bindTrPopup(newMarker, popupcontent);
    newMarker.addTo(map);
    newMarker.on("popupopen", onPopupOpen);
    markersUser.push(newMarker);
		console.log(groupUser);
    groupUser.addLayer(newMarker);
    localStorage.mapUserMarkers = JSON.stringify(storageMarkers);
    if (typeof userMarkersChanged === 'function') userMarkersChanged();
    map.addLayer(groupUser);
    e.preventDefault();
  });
}

function onPopupOpen(e) {
  let  _this = this;
  let  clickedMarkerCoords = _this.getLatLng();
	console.log("clickedMarkerCoords= "+clickedMarkerCoords);
  let  clickedMarkerCoordsNew = e.target.getLatLng();
	console.log("clickedMarkerCoordsNew= "+clickedMarkerCoordsNew);
  let  popup = _this.getPopup();

  $(document).off('click', '.remove-marker')
  $(document).on('click', '.remove-marker', function() {
    $(this).addClass('hide');
    $(this).next('#remove-dialog').removeClass('hide');
    $(this).parent().parent().find('.popcontent').addClass('hide');
    $(this).parent().parent().find('.edit-marker').addClass('hide');
		$(this).parent().parent().find('.copymarkerurl').addClass('hide');
  });
  $(document).off('click', '.no')
  $(document).on('click', '.no', function() {
    $(this).parent('#remove-dialog').addClass('hide');
    $(this).parent().parent().find('.popcontent').removeClass('hide');
    $(this).parent().parent().find('.edit-marker').removeClass('hide');
    $(this).parent().parent().find('.remove-marker').removeClass('hide');
		$(this).parent().parent().find('.copymarkerurl').removeClass('hide');
  });

  $(document).off('click', '.yes')
  $(document).on('click', '.yes', function() {
    storageMarkers = JSON.parse(localStorage.mapUserMarkers);
    for(i = storageMarkers.length; i > -1; i--) {
      if (typeof storageMarkers[i] != 'undefined' && 
          (clickedMarkerCoords.lat == storageMarkers[i].coords.x &&
           clickedMarkerCoords.lng == storageMarkers[i].coords.y)
         ) {
				//console.log(storageMarkers[i]);
        storageMarkers.splice(i, 1);
        localStorage.mapUserMarkers = JSON.stringify(storageMarkers);
    if (typeof userMarkersChanged === 'function') userMarkersChanged();
      }
    }  
    //localStorage.removeItem('userMarkers');
    map.removeLayer(_this);
		groupUser.removeLayer(_this);
  });
  
   //Edit Marker
   $(document).off('click', '.edit-marker')
  $(document).on('click', '.edit-marker', function() {
    storageMarkers = JSON.parse(localStorage.mapUserMarkers);
		for(i = storageMarkers.length; i > -1; i--) {
      if (typeof storageMarkers[i] != 'undefined' && 
          (clickedMarkerCoords.lat == storageMarkers[i].coords.x &&
           clickedMarkerCoords.lng == storageMarkers[i].coords.y)
         ) {
					 //console.log(storageMarkers[i]);
        $(this).parent().find('#iconprev').css("background-image", "url("+storageMarkers[i].icon.options.iconUrl+")");
        $(this).parent().find('#select_icon').val(storageMarkers[i].iconvalue);
      }
    }
    // HERE
    $(this).addClass('hide');
    $(this).next('#edit-dialog').removeClass('hide');
    $(this).parent().parent().find('.popcontent').addClass('hide');
    $(this).parent().parent().find('.remove-marker').addClass('hide');
		$(this).parent().parent().find('.copymarkerurl').addClass('hide');
  });
  $(document).off('click', '.cancel')
  $(document).on('click', '.cancel', function() {
    $(this).parent().parent().find('#edit-dialog').addClass('hide');
    $(this).parent().parent().find('.popcontent').removeClass('hide');
    $(this).parent().parent().find('.edit-marker').removeClass('hide');
    $(this).parent().parent().find('.remove-marker').removeClass('hide');
		$(this).parent().parent().find('.copymarkerurl').removeClass('hide');
		popup._close();
  });
  $(document).off('click', '.save-marker')
  $(document).on('click', '.save-marker', function() {
    storageMarkers = JSON.parse(localStorage.mapUserMarkers);
    for(i = storageMarkers.length; i > -1; i--) {
      if (typeof storageMarkers[i] != 'undefined' && 
          (clickedMarkerCoords.lat == storageMarkers[i].coords.x &&
           clickedMarkerCoords.lng == storageMarkers[i].coords.y)
         ) {
        let  editedicon = $(this).parent().find('select[name=icon]').val();
        let  editedtitle = $(this).parent().find('#editedtitle').val();
        let  editeddesc = $(this).parent().find('#editeddesc').val();
				
				let  markerlink = (url+"?m="+clickedMarkerCoords.lng+","+clickedMarkerCoords.lat+"&title="+editedtitle+"&desc="+editeddesc+"&icon="+editedicon+"&");
				markerlink = encodeURI(markerlink);
        
        let  editedpopup ='<div class="popcontent"><p class="mtitle">'+editedtitle+'</p>\
<p class="mdesc">'+editeddesc+'</p>\
<span class="mcoords">[ '+clickedMarkerCoords.lng+' , '+clickedMarkerCoords.lat+']</span></div>\
<span class="markerlink hide">'+markerlink+'</span>\
<button class="copymarkerurl"><span class="sharetext" data-i18n="copylink">Kopírovat odkaz</span>\
<span class="copiedmsg hide">Zkopírováno</span></button>\
<button class="edit-marker" data-i18n="edit_marker">Upravit štítek</button>\
<div id="edit-dialog" class="hide">\
<div class="chooseIcon" data-i18n="choose_icon">Vyberte ikonu:</div>\
  <div id="iconprev" style="background-image:url(\''+markerIconTypes[0].options.iconUrl+'\')"></div>\
  <select id="select_icon" name="icon" onchange="iconpref(this.value);">';
    for (let  j in mapMarkers) {
    editedpopup +='<option value="'+j+'">'+iconLabel(mapMarkers[j].icon)+'</option>';
  };
  editedpopup = editedpopup+'</select>\
<input type="text" id="editedtitle" name="title" value="'+editedtitle+'">\
<textarea id="editeddesc" name="desc">'+editeddesc+'</textarea>\
<button class="cancel" data-i18n="cancel">Zrušit</button>\
<button class="save-marker" data-i18n="save">Uložit</button>\
</div>\
<button class="remove-marker" data-i18n="remove_marker">Smazat štítek</button>\
<div id="remove-dialog" class="hide">\
<span class="remove-text" data-i18n="remove_text">Opravdu chcete štítek smazat?</span>\
<button class="yes" data-i18n="yes">Ano</button><button class="no" data-i18n="no">Ne</button></div>';
        popup.setContent(trI18n(editedpopup));

        _this.setIcon(markerIconTypes[editedicon]);
        storageMarkers[i].name = editedtitle;
        storageMarkers[i].title = editedtitle;
        storageMarkers[i].desc = editeddesc;
        storageMarkers[i].icon = (markerIconTypes[editedicon]);
        storageMarkers[i].iconvalue = editedicon;
        localStorage.mapUserMarkers = JSON.stringify(storageMarkers);
    if (typeof userMarkersChanged === 'function') userMarkersChanged();
      }
    } 
    popup._close();
  });
}

$('#usermarkers').click(function(){
  if($(this).prop("checked") == true){
    map.addLayer(groupUser);
  }
  else if($(this).prop("checked") == false){
    map.removeLayer(groupUser);
  }
});
// End toggle user markers */

// Adding your own marker is a right-click action — a plain left click has to stay
// free for the markers themselves. Leaflet suppresses the browser menu for us
// because the map listens for 'contextmenu'.
map.on('contextmenu', function (e) {
  let  lat = Math.round(e.latlng.lat);
  let  long = Math.round(e.latlng.lng);
  if (long < 0 || long > 4095 || lat < 0 || lat > 4095) {
   console.log("lat: "+lat+ "long: "+long);
  } else {
    message = '<span class="coordsinfo">X: ' +long+ ' ' + 'Y: ' +lat+ '</span><br><button class="add-marker" data-i18n="add_marker" onclick="addMarkerText('+lat+','+long+')">Přidat štítek</button>';
    popup.setLatLng(e.latlng).setContent(trI18n(message)).openOn(map);
  }
});

let  sharedMarker = getUrlVars()["m"];
if (sharedMarker != undefined) {
  sidebar.close();
  let  smIcon = getUrlVars()["icon"];
  let  smTitle = getUrlVars()["title"];
  smTitle = decodeURIComponent(smTitle);
  let  smDesc = getUrlVars()["desc"];
  smDesc = decodeURIComponent(smDesc);
  let  smY = sharedMarker.split(",")[1];
  let  smX = sharedMarker.split(",")[0];
  console.log(smTitle);
  console.log(smDesc);
  let  icoUrl = (markerIconTypes[smIcon].options.iconUrl);

  let  popupcontent = '<div class="popcontent">\
<p class="mtitle">'+smTitle+'</p>\
<p class="mdesc">'+smDesc+'</p>\
<span class="mcoords">X: '+smX+' Y: '+smY+'</span></div>\
<button class="edit-marker" data-i18n="edit_marker">Upravit štítek</button>\
<div id="edit-dialog" class="hide">\
<div class="chooseIcon" data-i18n="choose_icon">Vyberte ikonu:</div>\
<div id="iconprev" style="background-image:url(\''+icoUrl+'\')"></div>\
<select id="select_icon" name="icon" onchange="iconpref(this.value);">';
  for (let  k in mapMarkers) {
    popupcontent +='<option value="'+k+'">'+iconLabel(mapMarkers[k].icon)+'</option>';
  };
  popupcontent = popupcontent+'</select>\
<input type="text" id="editedtitle" name="title" value="'+smTitle+'">\
<textarea id="editeddesc" name="desc">'+smDesc+'</textarea>\
<button class="cancel" data-i18n="cancel">Zrušit</button>\
<button class="save-marker" data-i18n="save">Uložit</button>\
</div>\
<button class="remove-marker" data-i18n="remove_marker">Smazat štítek</button>\
<div id="remove-dialog" class="hide">\
<span class="remove-text" data-i18n="remove_text">Opravdu chcete štítek smazat?</span>\
<button class="yes" data-i18n="yes">Ano</button>\
<button class="no" data-i18n="no">Ne</button></div>';

  if ((smY <= mapBounds && smY>0) && (smX<=mapBounds && smX>0)) {
    let  sm_marker = bindTrPopup(L.marker([smY,smX], {icon: markerIconTypes[smIcon]}), popupcontent).addTo(map);
    map.flyTo(sm_marker.getLatLng(), 4);
    sm_marker.on("popupopen", onPopupOpenShared);
    sm_marker.openPopup();
  }
};

// Edit and save shared marker
function onPopupOpenShared() {
  let  _this = this;
  let  clickedMarkerCoords = _this.getLatLng();
  let  popup = _this.getPopup();
  let  smIcon = getUrlVars()["icon"];
  let  smTitle = getUrlVars()["title"];
  smTitle = decodeURIComponent(smTitle);
  let  smDesc = getUrlVars()["desc"];
  smDesc = decodeURIComponent(smDesc);
  let  smY = sharedMarker.split(",")[1];
  let  smX = sharedMarker.split(",")[0];
  let  icoUrl = (markerIconTypes[smIcon].options.iconUrl);

  $(document).off('click', '.remove-marker')
  $(document).on('click', '.remove-marker', function() {
    $(this).addClass('hide');
    $(this).next('#remove-dialog').removeClass('hide');
    $(this).parent().parent().find('.popcontent').addClass('hide');
    $(this).parent().parent().find('.edit-marker').addClass('hide');
  });
  $(document).off('click', '.no')
  $(document).on('click', '.no', function() {
    $(this).parent('#remove-dialog').addClass('hide');
    $(this).parent().parent().find('.popcontent').removeClass('hide');
    $(this).parent().parent().find('.edit-marker').removeClass('hide');
    $(this).parent().parent().find('.remove-marker').removeClass('hide');
  });

  $(document).off('click', '.yes')
  $(document).on('click', '.yes', function() {
    map.removeLayer(_this);
  });
  
   //Edit Marker
   $(document).off('click', '.edit-marker')
  $(document).on('click', '.edit-marker', function() {
    storageMarkers = JSON.parse(localStorage.mapUserMarkers);
        $(this).parent().find('#iconprev').css("background-image", "url("+icoUrl+")");
        $(this).parent().find('#select_icon').val(smIcon);
    // HERE
    $(this).addClass('hide');
    $(this).next('#edit-dialog').removeClass('hide');
    $(this).parent().parent().find('.popcontent').addClass('hide');
    $(this).parent().parent().find('.remove-marker').addClass('hide');
  });
  $(document).off('click', '.cancel')
  $(document).on('click', '.cancel', function() {
    $(this).parent().parent().find('#edit-dialog').addClass('hide');
    $(this).parent().parent().find('.popcontent').removeClass('hide');
    $(this).parent().parent().find('.edit-marker').removeClass('hide');
    $(this).parent().parent().find('.remove-marker').removeClass('hide');
  });
  $(document).off('click', '.save-marker')
  $(document).on('click', '.save-marker', function() {
    storageMarkers = JSON.parse(localStorage.mapUserMarkers);
        let  editedicon = $(this).parent().find('select[name=icon]').val();
        let  editedtitle = $(this).parent().find('#editedtitle').val();
        let  editeddesc = $(this).parent().find('#editeddesc').val();
        
        let  editedpopup ='<div class="popcontent"><p class="mtitle">'+editedtitle+'</p>\
<p class="mdesc">'+editeddesc+'</p>\
<span class="mcoords">[ '+clickedMarkerCoords.lng+' , '+clickedMarkerCoords.lat+']</span></div>\
<button class="edit-marker" data-i18n="edit_marker">Upravit štítek</button>\
<div id="edit-dialog" class="hide">\
<div class="chooseIcon" data-i18n="choose_icon">Vyberte ikonu:</div>\
  <div id="iconprev" style="background-image:url(\''+markerIconTypes[0].options.iconUrl+'\')"></div>\
  <select id="select_icon" name="icon" onchange="iconpref(this.value);">';
    for (let  j in mapMarkers) {
    editedpopup +='<option value="'+j+'">'+iconLabel(mapMarkers[j].icon)+'</option>';
  };
  editedpopup = editedpopup+'</select>\
<input type="text" id="editedtitle" name="title" value="'+editedtitle+'">\
<textarea id="editeddesc" name="desc">'+editeddesc+'</textarea>\
<button class="cancel" data-i18n="cancel">Zrušit</button>\
<button class="save-marker" data-i18n="save">Uložit</button>\
</div>\
<button class="remove-marker" data-i18n="remove_marker">Smazat štítek</button>\
<div id="remove-dialog" class="hide">\
<span class="remove-text" data-i18n="remove_text">Opravdu chcete štítek smazat?</span>\
<button class="yes" data-i18n="yes">Ano</button><button class="no" data-i18n="no">Ne</button></div>';
        popup.setContent(trI18n(editedpopup));
    
        storageMarkers.push({
          "coords": {
            "x": smY,
            "y": smX
          },
          "name": editedtitle,
          "icon": (markerIconTypes[editedicon]),
          "iconvalue": editedicon,
          "title": editedtitle,
          "desc": editeddesc
        });

        _this.setIcon(markerIconTypes[editedicon]);
        localStorage.mapUserMarkers = JSON.stringify(storageMarkers);
    if (typeof userMarkersChanged === 'function') userMarkersChanged();
				map.removeLayer(_this);
				initUserLayerGroup();
    popup._close();
  });
}

function getFormattedTime() {
    let  today = new Date();
    let  y = today.getFullYear();
    let  m = ("0" + (today.getMonth() + 1)).slice(-2)
    let  d = today.getDate();
    let  hour = today.getHours();
    let  min = today.getMinutes();
    let  s = today.getSeconds();
    return y + "-" + m + "-" + d + "_" + hour + "." + min;
}


// Backup (export / import / clear) lives in js/ui.js, which is wired to the
// new backup panel and its dialogs.


// The old English map wrote its language choice to "langactive", and backups
// exported before this fork still carry it. Seed it from js/i18n.js (which reads
// the same key on startup) so an imported backup restores the right language.
if (localStorage.getItem('langactive') === null) {
  localStorage.setItem('langactive', getLang());
}


	// Save toggle state
$('.markers-list input').on('change', function() {
  let  toggled, activemarkers = [];
  $('.markers-list input').each(function() { // run through each of the checkboxes
    toggled = {id: $(this).attr('id'), value: $(this).prop('checked')};
    activemarkers.push(toggled);
  });
  localStorage.setItem("activemarkers", JSON.stringify(activemarkers));
});

let  activemarkers = JSON.parse(localStorage.getItem('activemarkers'));
if (localStorage.activemarkers !== undefined) {
  for (let  i=0; i<activemarkers.length; i++) {
    $('#' + activemarkers[i].id ).prop('checked', activemarkers[i].value);
    if (activemarkers[i].value) {
      $('#allmarkers').prop('checked', false);
      map.addLayer(layerGroups[activemarkers[i].id]);
    };
  };
};
// end toggle state