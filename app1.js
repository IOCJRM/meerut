
var DATA = {
  terminals: [" ", "Meerut Terminal"]
};


var elTerminal = null;


function option(value) {
  var o = document.createElement("option");
  o.value = value;
  o.textContent = value;
  return o;
}

function byId(id) {
  return document.getElementById(id);
}

function safeSetTextById(id, text) {
 
  var el = byId(id);
  if (el) {
    el.textContent = text;
    return;
  }
 
  var all = document.querySelectorAll('#' + CSS.escape(id));
  if (all && all.length) {
    all.forEach(function (node) { node.textContent = text; });
    return;
  }
 
}


function populateTerminals() {
  elTerminal = document.getElementById("terminal");
  if (!elTerminal) return;


  elTerminal.innerHTML = "";

 
  for (var i = 0; i < DATA.terminals.length; i++) {
    var t = DATA.terminals[i];
    elTerminal.appendChild(option(t));
  }

  elTerminal.value = DATA.terminals[0];
}

function getAllDestinationNames() {
  
  if (typeof DIST === "object" && DIST) {
    return Object.keys(DIST).sort();
  }
  
  if (typeof DATA1 === "object" && DATA1 && Array.isArray(DATA1.terminal)) {
    return DATA1.terminal.filter(function (x) { return String(x || "").trim() !== ""; });
  }
  
  return [];
}

function populateDestinations() {
  var destList = document.getElementById("destinations");
  if (!destList) return;

  destList.innerHTML = ""; // clear

  var names = getAllDestinationNames();
  for (var i = 0; i < names.length; i++) {
    var d = names[i];
    var opt = document.createElement("option");
    opt.value = d;
    destList.appendChild(opt);
  }
}


function updateStatsFor(name) {
 
  var d = (typeof DIST === "object" && DIST && Object.prototype.hasOwnProperty.call(DIST, name)) ? DIST[name] : null;
  safeSetTextById("statDistance", (d === null || d === undefined || d === "" ? "—" : (typeof d === "number" ? d + " km" : String(d))));

  
  var h = (typeof HOSPITALS === "object" && HOSPITALS && Object.prototype.hasOwnProperty.call(HOSPITALS, name)) ? HOSPITALS[name] : null;
  safeSetTextById("statStation2", (h === null || h === undefined || h === "" ? "—" : String(h)));

  
  var f = (typeof FUEL === "object" && FUEL && Object.prototype.hasOwnProperty.call(FUEL, name)) ? FUEL[name] : null;
  safeSetTextById("statStations", (f === null || f === undefined || f === "" ? "—" : String(f)));

  var p = (typeof POLICE === "object" && POLICE && Object.prototype.hasOwnProperty.call(POLICE, name)) ? POLICE[name] : null;
  safeSetTextById("statStation3", (p === null || p === undefined || p === "" ? "—" : String(p)));
}


var QR_BASE = ""; 
function buildShareUrl(filePath) {
  
  var base = QR_BASE || window.location.href;
  try {
    return new URL(filePath, base).href;
  } catch (e) {
    return filePath; 
  }
}

function clearQR(box) {
  while (box && box.firstChild) box.removeChild(box.firstChild);
}

function renderQRForPath(filePath) {
  var box = byId("qrBox");
  if (!box || typeof QRCode === "undefined") return;
  clearQR(box);
  var url = buildShareUrl(filePath);

  var tgt = byId("qrTarget");
  if (tgt) tgt.value = url;

 
  new QRCode(box, {
    text: url,
    width: 220,
    height: 220,
    correctLevel: QRCode.CorrectLevel.M
  });
}


function loadPage() {
  var el = document.getElementById("destination");
  if (!el) return;

  var val = (el.value || "").trim();
  if (!val || val === " ") return; 
  var filePath = "JRM/" + val + ".html";

 
  updateStatsFor(val);

  
  var obj = document.querySelector("#c2 object");
  if (obj) {
    obj.setAttribute("data", encodeURI(filePath));
  }


  renderQRForPath(filePath);
}

function clearDestination() {
  var input = document.getElementById("destination");
  if (input && input.tagName.toLowerCase() === "input") {
    input.value = "";
    input.focus();
  }
 
  safeSetTextById("statDistance", "—");
  safeSetTextById("statStations", "—");
  safeSetTextById("statStation2", "—");
  safeSetTextById("statStation3", "—");
}


window.addEventListener("DOMContentLoaded", function () {
  populateTerminals();
  populateDestinations();

 
  var preset = byId("qrTarget");
  if (preset && preset.value) {
    renderQRForPath(preset.value);
  }
  
  var obj = document.querySelector("#c2 object");
  if (obj) {
    try {
      var current = decodeURI(obj.getAttribute("data") || "");
      var m = current.match(/JRM\/(.+)\.html$/i);
      if (m && m[1]) {
        updateStatsFor(m[1]);
      }
    } catch (e) { }
  }
});


window.loadPage = loadPage;
window.clearDestination = clearDestination;
