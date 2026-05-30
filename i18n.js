/* ============================================================
   i18n.js — language registry for The Human Journey
   English is the canonical source: STORY / RELIGIONS / CHAPTERS
   live in app.jsx & data.js. Each other language registers a
   parallel translation object on window.I18N[code]. Missing keys
   fall back to English so the app never shows a blank string.
   ============================================================ */
window.I18N = window.I18N || {};

// menu order + native names for the selector
window.LANGS = [
  { code: "en", label: "English" },
  { code: "ca", label: "Català" },
  { code: "es", label: "Español" },
  { code: "fr", label: "Français" },
  { code: "nl", label: "Nederlands" },
  { code: "no", label: "Norsk" },
];

// English baseline (UI chrome + epoch / era markers). The narrative text
// for English is read straight from the source arrays.
window.I18N.en = {
  ui: {
    eyebrow: "An Interactive Atlas",
    titleA: "The Human", titleB: "Journey",
    credit1: "Out of Africa", credit2: "& the Origins of Belief",
    mapLayers: "Map layers",
    layer_settlement: "Settlement", layer_migration: "Migration",
    layer_religion: "Religion", layer_population: "Population", layer_ice: "Ice caps",
    globeType: "Globe type",
    theme_slate: "Slate", theme_relief: "Relief", theme_twilight: "Twilight", theme_atlas: "Atlas",
    formsOfBelief: "Forms of Belief", reset: "Reset",
    legItemTitle: "Click to focus · Shift-click to toggle",
    humanPopulation: "Human population", humansAlive: "Humans alive",
    play: "Play", pause: "Pause",
    yearsAgo: "years ago", yearAgo: "year ago",
    today: "Today", presentDay: "Present day · 2025",
    onTheMap: "On the map",
    map_region: "Settled land — belief colour", map_route: "Migration route",
    map_settlement: "Settlement reached", map_flow: "Belief spreads", map_pop: "Population (height)",
    hint: "Drag to rotate · Scroll to zoom · Drag the timeline",
    language: "Language",
    tick_300ka: "300ka", tick_ooa: "Out of Africa", tick_villages: "First villages",
    tick_cities: "First cities", tick_2ka: "2 ka", tick_today: "Today",
  },
  epochs: { palaeolithic: "Palaeolithic", neolithic: "Neolithic", bronze: "Bronze Age",
    iron: "Iron Age / Classical", ce: "Common Era" },
  era: { bce: "BCE", ce: "CE" },
  about: {
    open: "About", close: "Close",
    title: "About this atlas",
    intro: "The Human Journey follows our species across 300,000 years — out of Africa to every habitable continent — and traces, alongside that great migration, the unfolding of human belief, from the first sense of spirits to the world religions.",
    s: [
      { h: "What you are seeing", b: "A single globe carries every layer at once. Glowing land is settled land, tinted with the colour of the belief held there. Dashed cyan lines are migration routes; bright dots mark settlements reached. Coloured streams show beliefs spreading from place to place, and the pink spires are population — short in deep prehistory, towering in the age of cities. White caps are the polar ice, swelling and retreating with the ice ages." },
      { h: "How to navigate", b: "Press Play (or the space bar) to set the story in motion; the camera, captions and timeline move together. Use the ← and → keys to step one frame at a time, or drag the timeline to travel freely. Drag the globe to rotate it and scroll to zoom. Click any belief in the Forms of Belief panel to read about it and centre the view; the Map layers and Globe type panels let you show, hide and restyle each element." },
      { h: "As a teaching tool", b: "Pause on any moment to discuss it. Trace how environment shapes migration, and how settlement, farming, cities and belief rise together. Toggle layers to isolate a single thread — just migration, or just religion — and switch the population graph between linear and logarithmic to show how recently our numbers exploded. The captions read as a narrated script for a class." },
      { h: "Why we made it", b: "Not to argue, but to marvel. This atlas was built to let anyone stand back and take in the long, improbable arc of human origins — one restless African beginning that, over ten thousand generations, came to fill and wonder at the whole Earth." },
    ],
  },
};
