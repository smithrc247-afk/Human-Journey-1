/* ============================================================
   gallery.js — photo gallery manifest for The Human Journey
   ------------------------------------------------------------
   window.GALLERY maps a STORY beat (0-based index, same order as
   the captions in app.jsx) to an array of 2–3 photos. A carousel
   card floats in the lower-right on desktop (above the timeline)
   and auto-cycles through the photos; on phones a "Photos" button
   on the caption opens a fullscreen viewer. A "Gallery" link on the
   card opens the full-screen Gallery view (every beat, every photo).

   Each photo: { src, caption, credit }
   All images are from Wikimedia Commons (public domain or Creative
   Commons); the credit line carries author + licence so attribution
   travels with the image. Each beat mixes evidence (artifacts, sites)
   with reconstructions / replicas — "what people think it looked
   like" (people, boats, houses).
   ============================================================ */
window.GALLERY = {
  0: [
    { src: "images/gallery/seg00-2.jpg", caption: "How they may have looked — a museum reconstruction of an early Homo sapiens", credit: "MUSE, Trento · CC BY-SA 3.0 · Wikimedia Commons" },
    { src: "images/gallery/seg00.jpg",   caption: "Jebel Irhoud, Morocco — among the earliest known Homo sapiens, ~300,000 years old", credit: "Jonathan Chen · CC BY-SA 4.0 · Wikimedia Commons" },
    { src: "images/gallery/seg00-3.jpg", caption: "The African savanna — the world of our first ancestors", credit: "Giles Laurent · CC BY-SA 4.0 · Wikimedia Commons" },
  ],
  1: [
    { src: "images/gallery/seg01.jpg",   caption: "An Acheulean hand-axe — the long mastery of stone, fire and tools", credit: "Muséum de Toulouse · CC BY-SA 4.0 · Wikimedia Commons" },
    { src: "images/gallery/seg01-2.jpg", caption: "A Hadza hunter — a glimpse of the foraging life that sustained humanity for millennia", credit: "Erasmus Kamugisha · CC BY-SA 4.0 · Wikimedia Commons" },
    { src: "images/gallery/seg01-3.jpg", caption: "Finely worked stone points — the toolmaker's craft", credit: "Vincent Mourre / Inrap · CC BY-SA 3.0 · Wikimedia Commons" },
  ],
  2: [
    { src: "images/gallery/seg02.jpg",   caption: "Blombos Cave, South Africa — home to the earliest ochre engravings", credit: "Vincent Mourre / Inrap · CC BY-SA 3.0 · Wikimedia Commons" },
    { src: "images/gallery/seg02-2.jpg", caption: "San rock art — a living sense of a world full of spirit", credit: "Discott · CC BY-SA 4.0 · Wikimedia Commons" },
    { src: "images/gallery/seg02-3.jpg", caption: "Red ochre — pigment for the body, the dead, and the first art", credit: "Bob Richmond · CC BY 2.0 · Wikimedia Commons" },
  ],
  3: [
    { src: "images/gallery/seg03.jpg",   caption: "The caves of Mount Carmel — early, failed excursions beyond Africa", credit: "R. Yeshurun · CC BY-SA 3.0 · Wikimedia Commons" },
    { src: "images/gallery/seg03-2.jpg", caption: "Skhul Cave — remains of early modern humans who reached the Levant", credit: "R. Yeshurun · CC BY-SA 3.0 · Wikimedia Commons" },
    { src: "images/gallery/seg03-3.jpg", caption: "Misliya Cave — the earliest known humans outside Africa, ~190,000 years ago", credit: "Hanay · CC BY 3.0 · Wikimedia Commons" },
  ],
  4: [
    { src: "images/gallery/seg04.jpg",   caption: "The Bab-el-Mandeb strait — the narrow gateway out of Africa", credit: "NASA / ASTER · Public domain" },
    { src: "images/gallery/seg04-3.jpg", caption: "The reefs of the Red Sea, seen from orbit", credit: "ESA · Attribution" },
  ],
  5: [
    { src: "images/gallery/seg05.jpg",   caption: "An Indian Ocean shore — the coastal road east", credit: "Lebu Ayiga · CC BY-SA 4.0 · Wikimedia Commons" },
    { src: "images/gallery/seg05-2.jpg", caption: "A shell midden — the debris of generations living on the sea's riches", credit: "Martyn Gorman · CC BY-SA 2.0 · Wikimedia Commons" },
    { src: "images/gallery/seg05-3.jpg", caption: "The coasts of the northern Arabian Sea, the road to South Asia", credit: "NASA · Public domain" },
  ],
  6: [
    { src: "images/gallery/seg06.jpg",   caption: "Rock art at Ubirr, Australia — totems and the Dreaming", credit: "Dietmar Rabich · CC BY-SA 4.0 · Wikimedia Commons" },
    { src: "images/gallery/seg06-2.jpg", caption: "An Aboriginal bark canoe — the kind of craft that first crossed open sea", credit: "Oswald B. Walters, 1842 · Public domain" },
    { src: "images/gallery/seg06-3.jpg", caption: "Lake Mungo — among the oldest human remains in Australia", credit: "Richard Horvath · CC BY-SA 3.0 · Wikimedia Commons" },
  ],
  7: [
    { src: "images/gallery/seg07.jpg",   caption: "The painted caves of Lascaux, France — shamans between the worlds", credit: "Public domain · Wikimedia Commons" },
    { src: "images/gallery/seg07-2.jpg", caption: "A Cro-Magnon face, rebuilt from the bone", credit: "Cícero Moraes · CC BY-SA 4.0 · Wikimedia Commons" },
    { src: "images/gallery/seg07-3.jpg", caption: "The Venus of Willendorf — Ice-Age art of the human form", credit: "MatthiasKabel · CC BY 2.5 · Wikimedia Commons" },
  ],
  8: [
    { src: "images/gallery/seg08.jpg",   caption: "Denisova Cave, the Altai — humans across the heart of Asia", credit: "Alexey Demin · CC BY-SA 4.0 · Wikimedia Commons" },
    { src: "images/gallery/seg08-2.jpg", caption: "Woolly mammoths on the Ice-Age steppe (painting by Charles R. Knight)", credit: "Charles R. Knight · Public domain" },
    { src: "images/gallery/seg08-3.jpg", caption: "The vast Eurasian steppe", credit: "Damiano Luchetti · Public domain" },
  ],
  9: [
    { src: "images/gallery/seg09.jpg",   caption: "A Mal'ta figurine, Siberia — survival in the Ice-Age north", credit: "Kozuch · CC BY-SA 3.0 · Wikimedia Commons" },
    { src: "images/gallery/seg09-2.jpg", caption: "The face of an Ice-Age hunter, reconstructed from a Sunghir burial", credit: "after M. Gerasimov · CC BY-SA 4.0 · Wikimedia Commons" },
    { src: "images/gallery/seg09-3.jpg", caption: "The woolly mammoth — prey and partner of the northern hunters", credit: "Thomas Quine · CC BY 2.0 · Wikimedia Commons" },
  ],
  10: [
    { src: "images/gallery/seg10.png",   caption: "Beringia — the land bridge from Asia into an empty New World", credit: "Public domain · Wikimedia Commons" },
    { src: "images/gallery/seg10-3.jpg", caption: "The Bering Strait today, drowned by the rising seas", credit: "NASA · Public domain" },
  ],
  11: [
    { src: "images/gallery/seg11.jpg",   caption: "A Clovis point — the spreading of the first Americans", credit: "Daderot · CC0 · Wikimedia Commons" },
    { src: "images/gallery/seg11-2.jpg", caption: "A mammoth hunt, as imagined in art", credit: "John Steeple Davis · Public domain" },
    { src: "images/gallery/seg11-3.jpg", caption: "A Folsom point — the hunt of Ice-Age big game", credit: "Great Sand Dunes NPP · Public domain" },
  ],
  12: [
    { src: "images/gallery/seg12.jpg",   caption: "Cueva de las Manos, Patagonia — humanity reaches the far south", credit: "Mariano · Public domain · Wikimedia Commons" },
    { src: "images/gallery/seg12-2.jpg", caption: "The peaks of Patagonia — the road to the end of the world", credit: "Pedro Szekely · CC BY-SA 2.0 · Wikimedia Commons" },
    { src: "images/gallery/seg12-3.jpg", caption: "A guanaco — the game that drew hunters ever southward", credit: "Ismcuacor · CC BY-SA 4.0 · Wikimedia Commons" },
  ],
  13: [
    { src: "images/gallery/seg13.jpg",   caption: "Wild wheat — at the threshold of farming and settled life", credit: "Davidbena · CC BY-SA 4.0 · Wikimedia Commons" },
    { src: "images/gallery/seg13-2.jpg", caption: "A reconstructed Neolithic house", credit: "Prof. saxx · CC BY-SA 3.0 · Wikimedia Commons" },
    { src: "images/gallery/seg13-3.jpg", caption: "A model of the great tower of Jericho — one of the first towns", credit: "Hanay · CC BY-SA 3.0 · Wikimedia Commons" },
  ],
  14: [
    { src: "images/gallery/seg14.jpg",   caption: "Göbekli Tepe — great carved pillars raised before cities", credit: "Teomancimit · CC BY-SA 3.0 · Wikimedia Commons" },
    { src: "images/gallery/seg14-2.jpg", caption: "How Göbekli Tepe may have looked — a reconstruction", credit: "Dosseman · CC BY-SA 4.0 · Wikimedia Commons" },
    { src: "images/gallery/seg14-3.jpg", caption: "Animals carved on a Göbekli Tepe pillar", credit: "Dosseman · CC BY-SA 4.0 · Wikimedia Commons" },
  ],
  15: [
    { src: "images/gallery/seg15.jpg",   caption: "Çatalhöyük, Anatolia — among the first farming towns", credit: "Murat Özsoy · CC BY-SA 4.0 · Wikimedia Commons" },
    { src: "images/gallery/seg15-2.jpg", caption: "Inside a Çatalhöyük house, reconstructed", credit: "Dosseman · CC BY-SA 4.0 · Wikimedia Commons" },
    { src: "images/gallery/seg15-3.jpg", caption: "The Seated Woman of Çatalhöyük", credit: "Dosseman · CC BY-SA 4.0 · Wikimedia Commons" },
  ],
  16: [
    { src: "images/gallery/seg16.jpg",   caption: "The Standard of Ur — gods and kings of the first cities", credit: "British Museum · Public domain" },
    { src: "images/gallery/seg16-2.jpg", caption: "The Ziggurat of Ur — a temple-mountain for the gods", credit: "Hardnfast · CC BY 3.0 · Wikimedia Commons" },
    { src: "images/gallery/seg16-3.jpg", caption: "A Sumerian clay tablet — writing the will of the gods", credit: "Gary Todd · CC0 · Wikimedia Commons" },
  ],
  17: [
    { src: "images/gallery/seg17.jpg",   caption: "Mohenjo-daro — temple and city on the Indus", credit: "Saqib Qayyum · CC BY-SA 3.0 · Wikimedia Commons" },
    { src: "images/gallery/seg17-2.jpg", caption: "The pyramids of the Nile (painted by David Roberts, 1839)", credit: "David Roberts · Public domain" },
    { src: "images/gallery/seg17-3.jpg", caption: "The 'Priest-King' of Mohenjo-daro", credit: "Mamoon Mengal · CC BY-SA · Wikimedia Commons" },
  ],
  18: [
    { src: "images/gallery/seg18.jpg",   caption: "An Amarna king — Akhenaten exalts one god above the rest", credit: "Museo Egizio, Turin · CC0" },
    { src: "images/gallery/seg18-2.jpg", caption: "Nefertiti, queen of the Aten revolution", credit: "Arkadiy Etumyan · CC BY-SA 3.0 · Wikimedia Commons" },
    { src: "images/gallery/seg18-3.jpg", caption: "Akhenaten and his family beneath the sun-disc Aten", credit: "Egyptian Museum, Berlin · CC0" },
  ],
  19: [
    { src: "images/gallery/seg19.jpg",   caption: "The Faravahar at Persepolis — Zoroaster's cosmos of good and evil", credit: "Sahand Ace · CC BY-SA 3.0 · Wikimedia Commons" },
    { src: "images/gallery/seg19-2.jpg", caption: "The columns of Persepolis, seat of the Persian kings", credit: "Bernard Gagnon · CC BY-SA 4.0 · Wikimedia Commons" },
    { src: "images/gallery/seg19-3.jpg", caption: "A Zoroastrian fire temple, where the sacred flame still burns", credit: "Bernard Gagnon · CC BY-SA 4.0 · Wikimedia Commons" },
  ],
  20: [
    { src: "images/gallery/seg20.jpg",   caption: "A Dead Sea Scroll — one God, creator of all things", credit: "Israel Antiquities Authority · Public domain" },
    { src: "images/gallery/seg20-2.jpg", caption: "The glazed lions of Babylon, place of the Judean exile", credit: "Public domain · Wikimedia Commons" },
    { src: "images/gallery/seg20-3.jpg", caption: "The Cyrus Cylinder — the Persian decree that freed the exiles", credit: "Mike Peel · CC BY-SA 4.0 · Wikimedia Commons" },
  ],
  21: [
    { src: "images/gallery/seg21.jpg",   caption: "The Parthenon, Athens — gods made citizens of the city", credit: "Thermos · CC BY-SA 2.5 · Wikimedia Commons" },
    { src: "images/gallery/seg21-2.jpg", caption: "The dome of the Roman Pantheon — a temple to all the gods", credit: "Wilfredor · CC0 · Wikimedia Commons" },
    { src: "images/gallery/seg21-3.jpg", caption: "Greek temples at Paestum", credit: "Norbert Nagel · CC BY-SA 3.0 · Wikimedia Commons" },
  ],
  22: [
    { src: "images/gallery/seg22.jpg",   caption: "The Good Shepherd, a Roman catacomb — the spread of Christianity", credit: "Public domain · Wikimedia Commons" },
    { src: "images/gallery/seg22-2.jpg", caption: "Hagia Sophia — the great church of the Christian East", credit: "Fossati / Haghe, 1852 · Public domain" },
    { src: "images/gallery/seg22-3.jpg", caption: "Christ as the Good Shepherd, a mosaic at Ravenna", credit: "Gsimonov · CC0 · Wikimedia Commons" },
  ],
  23: [
    { src: "images/gallery/seg23.jpg",   caption: "The Dome of the Rock, Jerusalem — the rise of Islam", credit: "Godot13 · CC BY-SA 4.0 · Wikimedia Commons" },
    { src: "images/gallery/seg23-2.jpg", caption: "The arches of the Great Mosque of Córdoba", credit: "Richard Mortel · CC BY 2.0 · Wikimedia Commons" },
    { src: "images/gallery/seg23-3.jpg", caption: "The dome of the Great Mosque of Kairouan", credit: "Issam Barhoumi · CC BY-SA 4.0 · Wikimedia Commons" },
  ],
  24: [
    { src: "images/gallery/seg24.jpg",   caption: "A ship carved at Borobudur — the great Austronesian voyages begin", credit: "Andreas Sihono · CC BY-SA 3.0 · Wikimedia Commons" },
    { src: "images/gallery/seg24-2.jpg", caption: "The Hōkūleʻa — a voyaging canoe sailed by the old arts of navigation", credit: "Miliefsk · CC BY-SA 4.0 · Wikimedia Commons" },
    { src: "images/gallery/seg24-3.jpg", caption: "Lapita shell ornaments — traces of the Pacific's first settlers", credit: "Patrick Nunn · CC BY-SA 4.0 · Wikimedia Commons" },
  ],
  25: [
    { src: "images/gallery/seg25.jpg",   caption: "The moai of Rapa Nui — the remotest specks of land settled", credit: "Aurbina · Public domain · Wikimedia Commons" },
    { src: "images/gallery/seg25-2.jpg", caption: "Outrigger canoes — the va'a that crossed the open Pacific", credit: "Gérard · CC BY-SA 2.0 · Wikimedia Commons" },
    { src: "images/gallery/seg25-3.jpg", caption: "An atoll lagoon in the Cook Islands", credit: "Patrick Nunn · CC BY-SA 4.0 · Wikimedia Commons" },
  ],
  26: [
    { src: "images/gallery/seg26.jpg",   caption: "A Māori waka — the last great voyage, to Aotearoa", credit: "Pierre André Leclercq · CC BY-SA 4.0 · Wikimedia Commons" },
    { src: "images/gallery/seg26-2.jpg", caption: "A waka taua, the great war canoe, under paddle", credit: "David Hawgood · CC BY-SA 2.0 · Wikimedia Commons" },
    { src: "images/gallery/seg26-3.jpg", caption: "Milford Sound — near the last land humans would reach", credit: "Krzysztof Golik · CC BY-SA 4.0 · Wikimedia Commons" },
  ],
  27: [
    { src: "images/gallery/seg27.jpg",   caption: "The Cantino planisphere, 1502 — the continents bound at last", credit: "Public domain · Wikimedia Commons" },
    { src: "images/gallery/seg27-2.jpg", caption: "A replica of the caravel that crossed the open oceans", credit: "Public domain · Wikimedia Commons" },
    { src: "images/gallery/seg27-3.jpg", caption: "The Waldseemüller map, 1507 — the first to name the New World", credit: "Martin Waldseemüller · Public domain" },
  ],
  28: [
    { src: "images/gallery/seg28.jpg",   caption: "Earth today — from one African beginning, a species that fills the planet", credit: "NASA · Public domain" },
    { src: "images/gallery/seg28-2.jpg", caption: "The lights of humanity, seen from space at night", credit: "NASA / NOAA · Public domain" },
    { src: "images/gallery/seg28-3.jpg", caption: "A modern megacity by night", credit: "Paulo Barcellos Jr. · CC BY-SA 2.0 · Wikimedia Commons" },
  ],
};
