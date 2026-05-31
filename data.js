/* ============================================================
   data.js — The Human Journey
   All chronology in "years before present" (ya). Coordinates are
   [longitude, latitude]. Dates are scholarly approximations chosen
   for a general audience; rounded to legible figures.
   ============================================================ */

// ---- Timeline bounds (years ago) -----------------------------
window.TIME = {
  start: 300000, // emergence of Homo sapiens
  end: 1,        // present day
};

// ---- Out-of-Africa migration milestones ----------------------
// Each seeds the expanding "settled region" (a geo-circle that
// fades in and grows once its arrival date is reached).
window.MILESTONES = [
  { id: "origin",    name: "East Africa",           coord: [38, 8],     ya: 300000, grow: 60000, maxDeg: 20, label: "Homo sapiens · East Africa (Omo)" },
  { id: "origin_n",  name: "North Africa",          coord: [-7, 32],    ya: 300000, grow: 55000, maxDeg: 13, label: "North Africa · Jebel Irhoud (~315 ka)" },
  { id: "south_afr", name: "Southern Africa",       coord: [24, -28],   ya: 300000, grow: 55000, maxDeg: 24, label: "Southern Africa · Florisbad" },
  { id: "west_afr",  name: "West Africa",           coord: [-2, 9],     ya: 150000, grow: 40000, maxDeg: 22 },
  { id: "levant1",   name: "The Levant (early)",    coord: [35, 32.4],  ya: 190000, grow: 30000, maxDeg: 5, label: "Misliya · first steps beyond Africa (~190 ka)", diedAt: 152000 },
  { id: "levant2",   name: "The Levant (early)",    coord: [35.2, 32.7], ya: 120000, grow: 22000, maxDeg: 5, label: "Skhul & Qafzeh (~120–90 ka)", diedAt: 92000 },
  { id: "arabia",    name: "Arabia",                coord: [47, 22],    ya: 68000,  grow: 18000, maxDeg: 16 },
  { id: "south_asia",name: "South Asia",            coord: [76, 22],    ya: 60000,  grow: 18000, maxDeg: 22 },
  { id: "sahul",     name: "Sahul (Australia)",     coord: [134, -24],  ya: 50000,  grow: 18000, maxDeg: 26, label: "Crossing to a new continent" },
  { id: "se_asia",   name: "Southeast Asia",        coord: [106, 8],    ya: 55000,  grow: 15000, maxDeg: 20 },
  { id: "europe",    name: "Europe",                coord: [10, 47],    ya: 43000,  grow: 16000, maxDeg: 20, label: "Into Ice-Age Europe" },
  { id: "c_asia",    name: "Central Asia",          coord: [70, 45],    ya: 47000,  grow: 16000, maxDeg: 22 },
  { id: "e_asia",    name: "East Asia",             coord: [112, 35],   ya: 40000,  grow: 16000, maxDeg: 24 },
  { id: "siberia",   name: "Siberia",               coord: [105, 62],   ya: 32000,  grow: 14000, maxDeg: 28 },
  { id: "beringia",  name: "Beringia",              coord: [-168, 65],  ya: 20000,  grow: 8000,  maxDeg: 9,  label: "The land bridge" },
  { id: "n_america", name: "North America",         coord: [-105, 45],  ya: 15000,  grow: 9000,  maxDeg: 30, label: "Into the Americas" },
  { id: "s_america", name: "South America",         coord: [-63, -18],  ya: 13500,  grow: 9000,  maxDeg: 28 },
  { id: "patagonia", name: "Patagonia & the far south", coord: [-69, -46], ya: 12800, grow: 5000, maxDeg: 18 },
  { id: "remote_oc", name: "Remote Pacific",        coord: [-150, -17], ya: 900,    grow: 4000,  maxDeg: 22, label: "The last frontier" },
  { id: "nz",        name: "Aotearoa (New Zealand)",coord: [174, -41],  ya: 730,    grow: 350,   maxDeg: 9, label: "New Zealand — the last land settled" },
];

// ---- Migration flow lines (multi-point, realistic paths) -----
// `path` is an ordered list of waypoints [lon,lat]; the line draws
// progressively along the whole chain as the timeline crosses
// [startYa .. endYa]. Paths hug coasts, straits, and corridors.
window.ROUTES = [
  // pan-African metapopulation — at the dawn of our species, interconnected
  // populations of East, North & Southern Africa emerge together and share traits
  { path: [[38, 8], [33, 2], [28, -12], [25, -22], [24, -28]], startYa: 300000, endYa: 262000 }, // East <-> Southern Africa (network)
  { path: [[38, 8], [24, 18], [8, 27], [-7, 32]], startYa: 300000, endYa: 262000 }, // East <-> North Africa (network)
  // origin -> West Africa (across the Sahel)
  { path: [[38, 8], [28, 10], [15, 12], [4, 11], [-2, 9]], startYa: 220000, endYa: 150000 },
  // Africa -> Levant, up the Nile/Sinai corridor. Two failed early dispersals:
  // the Misliya excursion (~190 ka, the earliest H. sapiens known outside Africa)
  // and the later Skhul & Qafzeh pulse (~120 ka). Both die out long before the
  // successful Bab-el-Mandeb crossing at ~70 ka.
  { path: [[38, 8], [37, 15], [33, 22], [32, 28], [34, 31], [35, 32.4]], startYa: 205000, endYa: 185000 },
  { path: [[38, 8], [37, 15], [33, 22], [32, 28], [34, 31], [35.2, 32.7]], startYa: 132000, endYa: 112000 },
  // Africa -> Arabia across Bab-el-Mandeb, then the SE Arabian coast
  { path: [[40, 9], [43, 11.5], [43.3, 12.6], [47, 14], [52, 18], [50, 21], [47, 22]], startYa: 75000, endYa: 68000 },
  // Arabia -> South Asia, hugging the Persian Gulf & Makran coast
  { path: [[47, 22], [52, 21], [57, 24], [61, 25], [66, 25], [70, 23], [76, 22]], startYa: 68000, endYa: 60000 },
  // South Asia -> SE Asia around the Bay of Bengal coastline. Longitude only
  // ever increases (eastward) and latitude only descends, so the head never
  // jerks back north over the Bay of Bengal.
  { path: [[76, 22], [80, 19], [85, 16], [90, 15], [95, 12], [99, 9], [103, 7], [106, 8]], startYa: 60000, endYa: 55000 },
  // SE Asia -> Sahul, island-hopping through Sunda & Wallacea
  { path: [[106, 8], [109, 1], [114, -4], [120, -6], [125, -8], [130, -8], [134, -14], [134, -24]], startYa: 55000, endYa: 50000 },
  // South Asia -> Central Asia, climbing NW through the Iranian plateau /
  // Hindu Kush corridor. Kept monotonic (longitude only ever decreases, latitude
  // only increases) so the line never backtracks eastward on its way to Europe.
  { path: [[76, 22], [74, 28], [72, 34], [71, 40], [70, 45]], startYa: 58000, endYa: 48000 },
  // Central Asia -> Europe across the western steppe
  { path: [[70, 45], [58, 47], [46, 47], [34, 46], [24, 46], [15, 47], [10, 47]], startYa: 47000, endYa: 43000 },
  // Central Asia -> East Asia
  { path: [[70, 45], [80, 44], [90, 42], [100, 40], [108, 37], [112, 35]], startYa: 45000, endYa: 40000 },
  // East Asia -> Siberia
  { path: [[112, 35], [116, 43], [112, 51], [108, 57], [105, 62]], startYa: 38000, endYa: 32000 },
  // Siberia -> Beringia across the far north-east
  { path: [[105, 62], [122, 64], [142, 66], [162, 66], [178, 66], [-172, 65], [-168, 65]], startYa: 28000, endYa: 20000 },
  // Beringia -> North America down the ice-free corridor / coast
  { path: [[-168, 65], [-158, 62], [-148, 60], [-138, 57], [-126, 52], [-116, 48], [-105, 45]], startYa: 18000, endYa: 15000 },
  // North America -> South America, down through Central America, the Andes and
  // on to the southern tip (Tierra del Fuego) — reached by ~12,500 ya, matching
  // the "southern tip of South America" beat.
  { path: [[-105, 45], [-101, 31], [-95, 18], [-85, 12], [-79, 8], [-78, 0], [-74, -10], [-66, -16], [-64, -27], [-68, -39], [-71, -47], [-69, -54]], startYa: 15000, endYa: 12500 },
  // Near Oceania -> Remote Pacific (Austronesian fan, island-hopping east)
  { path: [[134, -10], [148, -6], [160, -9], [173, -17], [-170, -14], [-158, -16], [-150, -17]], startYa: 3200, endYa: 800 },
  // Remote Pacific -> Aotearoa (the final south-west leg; timed to draw at the
  // story's climax so the camera can follow this last migration to New Zealand)
  { path: [[-150, -17], [-162, -22], [-174, -31], [179, -37], [174, -41]], startYa: 800, endYa: 680 },
];

// ---- Population centres through time (cities grow in number) --
// Each appears at `startYa` (years ago) and persists; Neolithic
// "regions" carry an `endYa` and hand off to the named cities that
// supersede them. Bar height tracks world population × weight, so
// ancient centres read small and modern megacities tower.
window.POP_CENTERS = [
  // — Neolithic regional clusters (fade out as cities take over) —
  { name: "Nile Valley",      coord: [31.4, 28.8], startYa: 12000, endYa: 4700, w: 0.012 },
  { name: "Fertile Crescent", coord: [44.8, 32],   startYa: 12000, endYa: 4800, w: 0.013 },
  { name: "Indus",            coord: [68.6, 27.3], startYa: 9000,  endYa: 4200, w: 0.010 },
  { name: "Yellow River",     coord: [114, 35.6],  startYa: 9000,  endYa: 3000, w: 0.011 },
  { name: "Danube",           coord: [20, 46],   startYa: 8000,  endYa: 2800, w: 0.008 },
  { name: "Mesoamerica",      coord: [-98, 19],  startYa: 9000,  endYa: 2200, w: 0.008 },
  { name: "Andes",            coord: [-73, -14], startYa: 8000,  endYa: 900,  w: 0.007 },
  { name: "SE Asia",          coord: [105, 5],   startYa: 8000,  endYa: 1200, w: 0.006 },
  // — Bronze Age cities —
  { name: "Uruk",        coord: [45.6, 31.3],  startYa: 5500, w: 0.0040 },
  { name: "Memphis",     coord: [31.2, 29.85], startYa: 5100, w: 0.0040 },
  { name: "Mohenjo-daro",coord: [68.1, 27.3],  startYa: 4600, w: 0.0035 },
  { name: "Babylon",     coord: [44.4, 32.5],  startYa: 4100, w: 0.0045 },
  { name: "Thebes",      coord: [32.6, 25.7],  startYa: 3800, w: 0.0035 },
  { name: "Anyang",      coord: [114.3, 36.1], startYa: 3300, w: 0.0035 },
  // — Classical cities —
  { name: "Athens",      coord: [23.7, 38.0],  startYa: 2900, w: 0.0040 },
  { name: "Rome",        coord: [12.5, 41.9],  startYa: 2700, w: 0.0055 },
  { name: "Carthage",    coord: [10.3, 36.85], startYa: 2800, w: 0.0030 },
  { name: "Alexandria",  coord: [29.9, 31.2],  startYa: 2300, w: 0.0045 },
  { name: "Pataliputra", coord: [85.1, 25.6],  startYa: 2400, w: 0.0045 },
  { name: "Chang'an",    coord: [108.9, 34.3], startYa: 3100, w: 0.0055 },
  { name: "Luoyang",     coord: [112.4, 34.6], startYa: 3000, w: 0.0045 },
  { name: "Teotihuacan", coord: [-98.84, 19.69],startYa: 2000, w: 0.0035 },
  // — Medieval cities —
  { name: "Constantinople",coord: [28.98, 41.0],startYa: 1700, w: 0.0050 },
  { name: "Baghdad",     coord: [44.4, 33.3],  startYa: 1250, w: 0.0050 },
  { name: "Córdoba",     coord: [-4.78, 37.9], startYa: 1150, w: 0.0030 },
  { name: "Kaifeng",     coord: [114.3, 34.8], startYa: 1050, w: 0.0045 },
  { name: "Cairo",       coord: [31.24, 30.05],startYa: 1050, w: 0.0050 },
  { name: "Angkor",      coord: [103.87, 13.41],startYa: 900, w: 0.0035 },
  { name: "Kyoto",       coord: [135.77, 35.0],startYa: 1200, w: 0.0035 },
  { name: "Tenochtitlan",coord: [-99.13, 19.43],startYa: 700, w: 0.0045 },
  { name: "Cahokia",     coord: [-90.06, 38.66],startYa: 1000, endYa: 600, w: 0.0025 },
  { name: "Cusco",       coord: [-71.97, -13.52],startYa: 800, w: 0.0030 },
  { name: "Timbuktu",    coord: [-3.0, 16.77], startYa: 850, w: 0.0025 },
  // — Modern megacities —
  { name: "London",      coord: [-0.13, 51.5], startYa: 500, w: 0.0045 },
  { name: "Paris",       coord: [2.35, 48.85], startYa: 600, w: 0.0040 },
  { name: "Moscow",      coord: [37.62, 55.75],startYa: 700, w: 0.0040 },
  { name: "Beijing",     coord: [116.4, 39.9], startYa: 800, w: 0.0060 },
  { name: "Istanbul",    coord: [28.98, 41.02],startYa: 560, w: 0.0045 },
  { name: "Tokyo",       coord: [139.69, 35.69],startYa: 420, w: 0.0065 },
  { name: "Delhi",       coord: [77.1, 28.7],  startYa: 600, w: 0.0060 },
  { name: "Mumbai",      coord: [72.88, 19.07],startYa: 350, w: 0.0050 },
  { name: "Shanghai",    coord: [121.47, 31.23],startYa: 250, w: 0.0055 },
  { name: "New York",    coord: [-74.0, 40.71],startYa: 380, w: 0.0050 },
  { name: "Mexico City", coord: [-99.13, 19.43],startYa: 480, w: 0.0055 },
  { name: "São Paulo",   coord: [-46.63, -23.55],startYa: 180, w: 0.0050 },
  { name: "Lagos",       coord: [3.39, 6.45],  startYa: 180, w: 0.0050 },
  { name: "Jakarta",     coord: [106.85, -6.21],startYa: 300, w: 0.0050 },
  { name: "Cairo (mod.)",coord: [31.24, 30.05],startYa: 200, w: 0.0050 },
  { name: "Karachi",     coord: [67.0, 24.86], startYa: 250, w: 0.0045 },
  { name: "Seoul",       coord: [126.98, 37.57],startYa: 600, w: 0.0045 },
  { name: "Los Angeles", coord: [-118.24, 34.05],startYa: 230, w: 0.0040 },
  { name: "Buenos Aires",coord: [-58.38, -34.6],startYa: 200, w: 0.0035 },
  { name: "Lima",        coord: [-77.04, -12.05],startYa: 480, w: 0.0035 },
  { name: "Dhaka",       coord: [90.4, 23.8],  startYa: 300, w: 0.0045 },
  { name: "Manila",      coord: [120.98, 14.6],startYa: 450, w: 0.0045 },
  // — further major world metros (so every major city carries a bar) —
  { name: "Guangzhou",   coord: [113.26, 23.13],startYa: 800, w: 0.0050 },
  { name: "Chongqing",   coord: [106.55, 29.56],startYa: 250, w: 0.0048 },
  { name: "Shenzhen",    coord: [114.06, 22.54],startYa: 70,  w: 0.0045 },
  { name: "Tianjin",     coord: [117.20, 39.13],startYa: 600, w: 0.0040 },
  { name: "Wuhan",       coord: [114.30, 30.59],startYa: 800, w: 0.0040 },
  { name: "Chengdu",     coord: [104.07, 30.57],startYa: 700, w: 0.0040 },
  { name: "Chennai",     coord: [80.27, 13.08], startYa: 380, w: 0.0045 },
  { name: "Kolkata",     coord: [88.36, 22.57], startYa: 330, w: 0.0050 },
  { name: "Bengaluru",   coord: [77.59, 12.97], startYa: 480, w: 0.0045 },
  { name: "Hyderabad",   coord: [78.47, 17.38], startYa: 430, w: 0.0040 },
  { name: "Lahore",      coord: [74.33, 31.55], startYa: 970, w: 0.0045 },
  { name: "Tehran",      coord: [51.39, 35.69], startYa: 250, w: 0.0045 },
  { name: "Baghdad (mod.)",coord: [44.36, 33.31],startYa: 200, w: 0.0040 },
  { name: "Riyadh",      coord: [46.71, 24.71], startYa: 280, w: 0.0035 },
  { name: "Bangkok",     coord: [100.50, 13.75],startYa: 240, w: 0.0045 },
  { name: "Ho Chi Minh City", coord: [106.66, 10.76],startYa: 320, w: 0.0040 },
  { name: "Chicago",     coord: [-87.63, 41.88],startYa: 190, w: 0.0040 },
  { name: "Toronto",     coord: [-79.38, 43.65],startYa: 230, w: 0.0035 },
  { name: "Bogotá",      coord: [-74.07, 4.71], startYa: 480, w: 0.0040 },
  { name: "Santiago",    coord: [-70.65, -33.45],startYa: 480, w: 0.0035 },
  { name: "Rio de Janeiro",coord: [-43.20, -22.90],startYa: 460, w: 0.0040 },
  { name: "Johannesburg",coord: [28.04, -26.20],startYa: 140, w: 0.0040 },
  { name: "Kinshasa",    coord: [15.31, -4.32], startYa: 140, w: 0.0045 },
  { name: "Nairobi",     coord: [36.82, -1.29], startYa: 130, w: 0.0035 },
  { name: "Addis Ababa", coord: [38.74, 9.03],  startYa: 160, w: 0.0035 },
  { name: "Khartoum",    coord: [32.53, 15.50], startYa: 200, w: 0.0035 },
  { name: "Casablanca",  coord: [-7.59, 33.57], startYa: 300, w: 0.0030 },
  { name: "Madrid",      coord: [-3.70, 40.42], startYa: 600, w: 0.0035 },
  { name: "Berlin",      coord: [13.40, 52.52], startYa: 500, w: 0.0035 },
];

// ---- Religion transmission flows (spread of ideas) ------------
// Drawn in the faith's colour as it is carried from place to place.
window.RELIGION_FLOWS = [
  // Archaic polytheism exchange
  { rel: "polytheism", from: [44, 32], to: [31, 28],   startYa: 5150, endYa: 4400 }, // Mesopotamia <-> Egypt
  // Civic polytheism
  { rel: "civic",      from: [23, 38], to: [12, 42],   startYa: 2900, endYa: 2450 }, // Greece -> Rome (civic gods spread through the Mediterranean as the form emerges)
  // Dualism — Zarathustra's vision arises in Persia (~1000 BCE) and its idea
  // reaches the Levant by the Persian period, so the line draws during the
  // Persia caption and lands during the Judah one.
  { rel: "dualism",    from: [52, 32], to: [36, 33],   startYa: 3000, endYa: 2650 }, // Persia -> Levant
  // Henotheism & monolatry — Akhenaten's Aten cult in Egypt and the rising
  // devotion to one god above the rest, carried toward the Levant (early Yahwism).
  { rel: "henotheism", from: [31, 28], to: [35, 31],   startYa: 3380, endYa: 2700 }, // Egypt (Aten) -> Levant
  // — Abrahamic monotheism: three strands, each shown in its own colour —
  // Christianity
  { rel: "christianity", from: [35, 31], to: [12, 42],   startYa: 1980, endYa: 1650 }, // Judea -> Rome
  { rel: "christianity", from: [12, 42], to: [8, 52],    startYa: 1650, endYa: 1100 }, // Rome -> N Europe
  // The Reconquista — Christianity restored across Iberia, complete by 1492.
  { rel: "christianity", from: [2, 43],  to: [-4, 40],   startYa: 950,  endYa: 540 },
  // Islam
  { rel: "islam", from: [40, 21], to: [-5, 34],   startYa: 1390, endYa: 1330 }, // Arabia -> the Maghreb (rapid Umayyad sweep across N. Africa)
  // Islam crosses the Strait of Gibraltar into Iberia — al-Andalus (711 CE) —
  // then retreats through the Reconquista: central Iberia is lost across the
  // 11th–13th c., and the southern emirate of Granada holds out until 1492.
  { rel: "islam", from: [-5, 35.5], to: [-3.8, 39.5], startYa: 1315, endYa: 1235, fadeStart: 940, fadeEnd: 760 }, // central Iberia
  { rel: "islam", from: [-5, 35.5], to: [-4, 37],     startYa: 1305, endYa: 1230, fadeStart: 640, fadeEnd: 533 }, // the south (Granada)
  { rel: "islam", from: [40, 21], to: [73, 30],   startYa: 1350, endYa: 950 },  // Arabia -> South Asia
  // Islam into Africa: across the Sahel, and down the Swahili coast
  { rel: "islam", from: [-5, 34],  to: [-3, 17],   startYa: 1050, endYa: 800 },  // Maghreb -> Sahel / W Africa
  { rel: "islam", from: [-3, 17],  to: [20, 12],   startYa: 950,  endYa: 650 },  // W Sahel -> C Sahel
  { rel: "islam", from: [43, 14],  to: [40, -6],   startYa: 1050, endYa: 700 },  // Arabia -> Swahili / E Africa coast
  // Christianity into sub-Saharan & Southern Africa (missionary / colonial era)
  { rel: "christianity", from: [12, 42],  to: [19, -33],  startYa: 374,  endYa: 300 },  // Europe -> Cape (1652)
  { rel: "christianity", from: [19, -33], to: [27, -20],  startYa: 230,  endYa: 120 },  // Cape -> Southern Africa interior
  { rel: "christianity", from: [19, -33], to: [10, 4],    startYa: 210,  endYa: 100 },  // -> W/C sub-Saharan Africa
  { rel: "christianity", from: [40, -6],  to: [37, 0],    startYa: 200,  endYa: 90 },   // E Africa interior (missions)
  // The Christianisation of the New World (1490s onward)
  { rel: "christianity", from: [12, 42],  to: [-70, 14],  startYa: 545, endYa: 532 }, // Europe -> Caribbean (1493)
  { rel: "christianity", from: [-70, 14], to: [-66, 2],   startYa: 532, endYa: 510 }, // Caribbean -> N. South America
  { rel: "christianity", from: [-70, 14], to: [-82, 28],  startYa: 522, endYa: 512 }, // Caribbean -> Florida / N. America
  { rel: "christianity", from: [-70, 14], to: [-99, 19],  startYa: 516, endYa: 506 }, // Caribbean -> Mexico
  { rel: "christianity", from: [-99, 19], to: [-72, -13], startYa: 506, endYa: 494 }, // Mexico -> Andes / Peru
];

// ---- Religious / cosmological stages -------------------------
// Ordered earliest-emerging to latest. `from`/`to` in years ago
// describe when the form becomes archaeologically/​historically
// visible and (loosely) its florescence. `sites` place markers.
window.RELIGIONS = [
  {
    id: "animism",
    name: "Animism",
    color: "#9aa86b",
    from: 100000, to: 0,
    blurb: "The oldest and most widespread way of seeing the world: that everything — animals, rivers, stones, weather, the dead — is alive with spirit and intention. It is less a doctrine than a default human stance toward a living cosmos.",
    examples: "San hunter-gatherers of southern Africa · Amazonian peoples · circumpolar cultures",
    when: "From the Middle Stone Age onward (~100,000 ya)",
    sites: [[24, -22], [-60, -5], [120, 60]],
  },
  {
    id: "shamanism",
    name: "Shamanism",
    color: "#9d86b8",
    from: 48000, to: 0,
    blurb: "Specialists — shamans — enter trance to travel between the human and spirit worlds, healing, divining, and guiding the hunt. The painted caves of Ice-Age Europe and Siberia preserve some of its earliest signatures.",
    examples: "Chauvet & Lascaux cave painters · Tungusic peoples of Siberia (the word 'shaman' is Evenki)",
    when: "Upper Palaeolithic (~48,000 ya)",
    sites: [[2, 45], [105, 60], [100, 50]],
  },
  {
    id: "totemism",
    name: "Totemism",
    color: "#cda544",
    from: 50000, to: 0,
    blurb: "Clans bind themselves to a totem — an animal, plant, or place — that marks identity, kinship, and obligation. In Aboriginal Australia these bonds are woven into the Dreaming, the eternal landscape of ancestral beings.",
    examples: "Aboriginal Australian nations · many North American and African clan systems",
    when: "Vivid in Aboriginal Australia (~50,000 ya)",
    sites: [[134, -24], [-110, 50]],
  },
  {
    id: "ancestor",
    name: "Ancestor worship",
    color: "#c07c4e",
    from: 12000, to: 0,
    blurb: "As people settled into villages, the dead stayed close. The ancestors became guardians of land, lineage, and law — honoured with offerings, tended skulls, and the first monumental shrines.",
    examples: "Göbekli Tepe (~11,000 ya) · Çatalhöyük · later Chinese ancestral rites",
    when: "Neolithic (~12,000 ya)",
    sites: [[39, 37], [33, 38], [114, 34]],
  },
  {
    id: "polytheism",
    name: "Archaic polytheism",
    color: "#c2553e",
    from: 5200, to: 1700,
    blurb: "The first cities needed gods as vast and bureaucratic as themselves. Pantheons ruled sky, storm, grain, and underworld; temples became the engines of the earliest states, served by a literate priesthood.",
    examples: "Sumer & Babylon · Egypt · the Indus and early China",
    when: "Bronze Age (~3200 BCE onward)",
    sites: [[44, 32], [31, 26], [113, 35]],
  },
  {
    id: "civic",
    name: "Civic polytheism",
    color: "#d98a3a",
    from: 2900, to: 1600,
    blurb: "In the classical Mediterranean the gods became citizens too — patrons of cities, festivals, and games. Religion was public duty and shared identity as much as private belief.",
    examples: "Greek city-states · the Roman state cult · Vedic and later Hindu traditions",
    when: "Classical antiquity (~900 BCE – 400 CE)",
    sites: [[23, 38], [12, 42], [78, 27]],
  },
  {
    id: "dualism",
    name: "Dualism",
    color: "#b8588f",
    from: 3000, to: 1300,
    blurb: "The cosmos reframed as a moral battlefield: a supreme good locked in struggle with a principle of evil, with humanity's choices tipping the balance. Zoroaster's vision in Persia would echo through later faiths.",
    examples: "Zoroastrianism in Persia · later Manichaeism",
    when: "Iron-Age Persia (~1000–700 BCE)",
    sites: [[52, 32]],
  },
  {
    id: "henotheism",
    name: "Henotheism & monolatry",
    color: "#3f9b94",
    from: 3400, to: 2600,
    blurb: "A pivot point: many gods are acknowledged, yet one is exalted above all — or alone deserves worship. Akhenaten's brief solar revolution and early Israel's devotion to Yahweh mark the road toward one God.",
    examples: "Akhenaten's Aten cult (~1350 BCE) · early Israelite Yahwism",
    when: "Late Bronze / early Iron Age (~1400–600 BCE)",
    sites: [[31, 28], [35, 31]],
  },
  {
    id: "judaism",
    name: "Judaism",
    color: "#5b8dd9",
    from: 2600, to: 0,
    blurb: "One God, creator of all — first held enduringly by the Judeans in Iron-Age Israel and Babylonian exile. The root from which the other Abrahamic faiths would grow.",
    examples: "Israel & Judah · the Babylonian exile (~6th c. BCE) · the Jewish diaspora",
    when: "Iron Age onward (~600 BCE)",
    sites: [[35, 31]],
  },
  {
    id: "christianity",
    name: "Christianity",
    color: "#e8d49a",
    from: 1980, to: 0,
    blurb: "Born in Roman Judea, Christianity carried the one-God idea across the Empire and, by conviction, conquest, and colony, to Europe, the Americas, and Africa — the most widespread faith on Earth.",
    examples: "Roman Empire (~1st c. CE) · medieval Europe · the Americas & Africa (1500s onward)",
    when: "1st century CE onward",
    sites: [[35, 31], [12, 42], [8, 50]],
  },
  {
    id: "islam",
    name: "Islam",
    color: "#46a86a",
    from: 1400, to: 0,
    blurb: "Arising in 7th-century Arabia, Islam spread with extraordinary speed — west to Iberia, south across the Sahara and the Swahili coast, and east to the Indus and beyond.",
    examples: "Arabia (~7th c. CE) · the Caliphates · the Sahel, Swahili coast & South Asia",
    when: "7th century CE onward",
    sites: [[40, 21], [43, 14], [-3, 30]],
  },
];

// ---- World population estimates (years ago -> people) --------
// Rough scholarly figures for a general audience; interpolated
// in log–log space between these control points.
window.POPULATION = [
  { ya: 300000, pop: 20000 },
  { ya: 130000, pop: 200000 },
  { ya: 70000,  pop: 600000 },
  { ya: 30000,  pop: 1500000 },
  { ya: 12000,  pop: 4000000 },
  { ya: 10000,  pop: 5000000 },
  { ya: 5000,   pop: 19000000 },
  { ya: 3000,   pop: 45000000 },
  { ya: 2000,   pop: 250000000 },   // ~1 CE
  { ya: 1000,   pop: 300000000 },   // ~1000 CE
  { ya: 500,    pop: 460000000 },   // ~1500 CE
  { ya: 225,    pop: 1000000000 },  // ~1800
  { ya: 125,    pop: 1650000000 },  // ~1900
  { ya: 75,     pop: 2500000000 },  // ~1950
  { ya: 50,     pop: 4000000000 },  // ~1975
  { ya: 25,     pop: 6100000000 },  // ~2000
  { ya: 1,      pop: 8200000000 },  // present
];

// ---- Polar ice extent over time (glacial cycles) -------------
// f = 0 (minimal ice) .. 1 (glacial maximum). Interpolated linearly
// in time. Peaks at the Last Glacial Maximum (~20,000 ya).
window.ICE = [
  { ya: 300000, f: 0.55 },
  { ya: 250000, f: 0.85 }, // glacial
  { ya: 200000, f: 0.35 }, // interglacial
  { ya: 140000, f: 0.88 }, // glacial (MIS 6)
  { ya: 125000, f: 0.28 }, // Eemian interglacial
  { ya: 70000,  f: 0.70 }, // last glacial onset
  { ya: 45000,  f: 0.72 },
  { ya: 26000,  f: 0.92 },
  { ya: 20000,  f: 1.00 }, // Last Glacial Maximum
  { ya: 14000,  f: 0.70 },
  { ya: 11700,  f: 0.30 }, // Holocene begins
  { ya: 6000,   f: 0.22 },
  { ya: 1,      f: 0.20 }, // present
];
window.iceAt = function (ya) {
  const I = window.ICE;
  if (ya >= I[0].ya) return I[0].f;
  if (ya <= I[I.length - 1].ya) return I[I.length - 1].f;
  for (let i = 0; i < I.length - 1; i++) {
    const a = I[i], b = I[i + 1];
    if (ya <= a.ya && ya >= b.ya) {
      const t = (a.ya - ya) / (a.ya - b.ya);
      return a.f + t * (b.f - a.f);
    }
  }
  return I[I.length - 1].f;
};

// ---- Ice sheets (realistic geography, not symmetric polar caps) --
// Each sheet is a geo-circle [lon,lat] that scales between its present
// extent (`now`, degrees radius) and its Last Glacial Maximum extent
// (`lgm`) as the glacial factor rises. Sheets with now:0 vanish in
// interglacials. Beringia & interior Alaska are deliberately left
// ice-free — the corridor humans used to enter the Americas.
window.ICE_SHEETS = [
  // Persistent
  { name: "Antarctica",      center: [10, -89],  now: 27, lgm: 32 },
  { name: "Greenland",       center: [-41, 73],  now: 9,  lgm: 13 },
  // Northern-hemisphere glacial sheets (gone in the Holocene)
  { name: "Laurentide",      center: [-82, 60],  now: 0,  lgm: 33 }, // Canada / N. USA
  { name: "Cordilleran",     center: [-127, 57], now: 0,  lgm: 12 }, // W. Canada
  { name: "Innuitian",       center: [-90, 79],  now: 0,  lgm: 10 }, // Arctic Canada
  { name: "Fennoscandian",   center: [22, 63],   now: 0,  lgm: 20 }, // Scandinavia / N. Europe
  { name: "British–Irish",   center: [-4, 56],   now: 0,  lgm: 7 },
  { name: "Barents–Kara",    center: [62, 78],   now: 0,  lgm: 16 }, // NW Russian Arctic
  { name: "Patagonian",      center: [-73, -47], now: 0,  lgm: 8 },
  // Sea ice (rings of pack ice that expand in glacials)
  { name: "Arctic sea ice",  center: [-40, 88],  now: 13, lgm: 22, sea: true },
  { name: "Antarctic sea ice",center: [0, -90],  now: 6,  lgm: 16, sea: true },
];

window.popAt = function (ya) {
  const P = window.POPULATION;
  if (ya >= P[0].ya) return P[0].pop;
  if (ya <= P[P.length - 1].ya) return P[P.length - 1].pop;
  for (let i = 0; i < P.length - 1; i++) {
    const a = P[i], b = P[i + 1];
    if (ya <= a.ya && ya >= b.ya) {
      const t = (Math.log(a.ya) - Math.log(ya)) / (Math.log(a.ya) - Math.log(b.ya));
      return Math.exp(Math.log(a.pop) + t * (Math.log(b.pop) - Math.log(a.pop)));
    }
  }
  return P[P.length - 1].pop;
};

// Shown when the timeline sits within [from..to] (years ago).
window.CHAPTERS = [
  { from: 300000, to: 160000, title: "An African dawn", body: "Roughly 300,000 years ago, in the savannas and coasts of Africa, a new kind of human appears — Homo sapiens. Lighter of build and restless of mind, they spread across the continent long before they leave it." },
  { from: 160000, to: 75000,  title: "A continent explored", body: "For more than a hundred millennia, modern humans range across Africa, refining tools, pigments, ornament, and perhaps the first beliefs that the world is alive with spirit." },
  { from: 75000,  to: 50000,  title: "Out of Africa", body: "Around 70,000 years ago a small population crosses the mouth of the Red Sea into Arabia. Every non-African alive today descends largely from this dispersal — a journey that will reach every habitable continent." },
  { from: 50000,  to: 30000,  title: "A world of hunters", body: "Humans sweep into Australia, Europe, and the heart of Asia. In painted caves and trance, shamans bridge the worlds; clans bind themselves to totems and to the land." },
  { from: 30000,  to: 13000,  title: "Ice and the New World", body: "Through the last Ice Age, hunters press into Siberia and across the Beringian land bridge into the Americas, racing south to the tip of the continent within a few thousand years." },
  { from: 13000,  to: 5200,   title: "The first villages", body: "As the ice retreats, people settle, farm, and build. The dead remain among the living as honoured ancestors; at Göbekli Tepe, humans raise monuments before they raise cities." },
  { from: 5200,   to: 2900,   title: "Gods of the first cities", body: "In Mesopotamia and Egypt, the first states crown themselves with great pantheons. Temples store grain and knowledge; a priesthood writes the will of the gods into the world." },
  { from: 2900,   to: 2000,   title: "An age of ferment", body: "From Persia to the Mediterranean to India, new visions stir — cosmic dualism, civic gods, and the daring idea that one God might stand above, or instead of, all the rest." },
  { from: 2000,   to: 50,     title: "One God, many peoples", body: "Carried by empire, trade, and conviction, Abrahamic monotheism spreads across continents. The descendants of a single African population now fill the Earth — and carry with them the whole long inheritance of belief." },
];
