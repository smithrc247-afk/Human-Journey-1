/* ============================================================
   op-data.js — The Origins of Power
   ------------------------------------------------------------
   A contested history of "archy" — the power of one over
   another — traced from the earliest humans to the present.
   Power is produced, converted, and justified. Six threads run
   through every era so they can be followed across time:
   production · conversion · ideology · kinship/gender · debt ·
   resistance.

   This is a synthesis, not a settled account. Where scholars
   disagree (notably Graeber & Wengrow on the "agriculture →
   inequality" arc) the disagreement is shown, not blended away.

   FIRST BUILD: Era 1 is rendered in full. Eras 2–3 carry their
   framing and are built next; Eras 4–8 are visible-but-inactive
   so the full scope stays legible.
   ============================================================ */

/* ---- the six recurring threads ----------------------------- */
window.OP_THREADS = [
  { id: "production", label: "Skill & Prestige",  glyph: "M12 22V12M12 12C12 8 9 5 5 5c0 4 3 7 7 7zM12 12c0-4 3-7 7-7 0 4-3 7-7 7z",
    question: "How was power generated — from surplus, land, labour, violence, knowledge or belief?" },
  { id: "conversion", label: "Power → more power",  glyph: "M4 9a8 8 0 0114-5l2 2M20 15a8 8 0 01-14 5l-2-2M18 4v4h-4M6 20v-4h4",
    question: "How did one kind of power turn into another?" },
  { id: "ideology",   label: "Power justifies itself", glyph: "M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7zM12 9a3 3 0 100 6 3 3 0 000-6z",
    question: "How was domination made to feel natural, lawful, or sacred?" },
  { id: "kinship",    label: "Family, gender & control", glyph: "M9 7a3 3 0 100-6 3 3 0 000 6zM3 21v-1.5A4.5 4.5 0 017.5 15M15 11a3 3 0 100-6 3 3 0 000 6zM21 21v-1.5A4.5 4.5 0 0016.5 15",
    question: "How did power inscribe itself in gender, marriage and lineage?" },
  { id: "debt",       label: "Who owes whom", glyph: "M12 3v18M5 8h14M7 8l-3 6a3 3 0 006 0zM17 8l-3 6a3 3 0 006 0zM8 21h8",
    question: "How did obligation bind people — and become an engine of subordination?" },
  { id: "resistance", label: "Resisting power",  glyph: "M9 12h2m2 0h2M8 8.5A4 4 0 008 15.5h1.5M16 15.5a4 4 0 000-7.5H14.5",
    question: "What pushed back — and what did it try to recover?" },
];

/* ---- glossary : hover concepts ----------------------------- */
window.OP_CONCEPTS = {
  "reverse dominance hierarchy": "Christopher Boehm's term for the way an egalitarian group's rank-and-file collectively dominate anyone who tries to dominate them — inverting the usual primate pattern of a single alpha.",
  "demand sharing": "A norm by which others may claim a share of a kill or windfall by right, so the producer can't hand it out as patronage or hold it back as leverage.",
  "egalitarianism": "Here, not the absence of hierarchy but an active practice — flatness continually maintained against would-be dominators.",
  "prestige vs. command": "Prestige is freely granted respect for skill; command is the power to compel. Forager societies allowed the first while blocking its conversion into the second.",
  "fission": "The splitting of a group when tensions rise — and the everyday option of simply leaving, which keeps any would-be leader's power contingent on consent.",
  "bilateral kinship": "Reckoning descent through both parents rather than a single line, which works against the consolidation of property-holding male lineages.",
  "surplus": "Stored, defensible wealth above immediate need — the central lever of later hierarchy, and one that mobile foragers had little means to accumulate.",
  "storage": "Holding food or goods across time. A granary concentrates value in one place and makes whoever controls it indispensable in lean seasons — unless it is held in common.",
  "divine kingship": "The claim that the ruler is a god, descended from one, or rules as a god's steward — fusing political and sacred authority in a single person.",
  "clean-slate edict": "A royal decree cancelling debts and freeing bond-servants. The earliest recorded 'jubilees', issued in Mesopotamia to keep debt from tearing the social order apart.",
};

/* ---- the eight eras ---------------------------------------- */
/* span: years-before-present (≈2025); used by the deep-time device.
   status: 'full' (built) · 'next' (framing only, built next) · 'planned'. */
window.OP_ERAS = [
  {
    id: "forager", num: "I", status: "full", accent: "#8a9a5b",
    title: "Forager Egalitarianism",
    dates: "deep prehistory – 12,000 BCE",
    span: { from: 302000, to: 14000 },
    subtitle: "The longest chapter. The world before \u201carchy\u201d — and the work it took to keep it that way.",
    contested: { level: "Moderate", note: "That leveling mechanisms exist is well documented in studied societies. What is genuinely contested is how far we can project them onto deep prehistory — a gap this piece marks rather than papers over." },
    framing: "Roughly ninety-five percent of the human story happens here — and most accounts give it a sentence. For tens of thousands of years people lived in small, mobile groups without kings, bosses, priests, or private fortunes. The easy reading is that they were too simple for hierarchy. The better-supported reading is that they worked — constantly, deliberately — to prevent it.",
    conventional: {
      label: "The conventional arc",
      body: "Forager life is treated as a primitive default: people were equal because they had nothing to be unequal about — no surplus, no property, no scale. Equality is framed as an absence, a blank that civilisation will later fill in.",
    },
    revision: {
      label: "\u2026and why it misleads",
      body: "Among mobile hunter-gatherers, equality is not passive. These groups are egalitarian on purpose, through constant effort. The flatness isn't what's left when hierarchy is absent — it is an achievement, maintained against the very people who would otherwise rise.",
    },
    threads: {
      production: {
        title: "Power produced — and prevented",
        body: "Skill and prestige existed: good hunters, healers and storytellers were recognised. But prestige was kept soft — it brought respect, not command, and it neither accumulated nor passed to children. Mobility made hoarding impractical, so the central lever of later hierarchy, storable {{surplus}}, simply wasn't available. The one durable asset was knowledge of land, season and ritual — real authority, but diffuse, and it died with the person.",
      },
      conversion: {
        title: "Conversion, deliberately jammed",
        body: "Almost the whole point of this era is that conversion was blocked. A successful hunt could not become lasting status; {{prestige vs. command}} stayed separate; knowledge could not be inherited as a fortune. The machinery that later lets military power become economic power become divine right is, here, jammed at every step. The drama of the eras that follow is watching these blocks come off, one by one.",
      },
      ideology: {
        title: "A cosmos without a throne",
        body: "Cosmologies tended toward the participatory — relationships of reciprocity with animals, land and ancestors rather than a sky-king commanding from above. Where later religion will mirror and sanctify earthly hierarchy, forager belief more often mirrors a world of mutual obligation among rough equals. The sacred order here has no throne at the top.",
      },
      kinship: {
        title: "Before patriarchy",
        body: "The evidence points away from a primordial patriarchy. Women's foraging often supplied the bulk of reliable calories, and that economic weight tracked with real social standing. Fluid membership and {{bilateral kinship}} work against the consolidation of male lineages that heritable property will later encourage. Patriarchy is not the human default we depart from; it is built later, alongside property and inheritance.",
      },
      debt: {
        title: "Obligation that never settles",
        body: "This is where debt actually begins — as its benign ancestor. The dense web of sharing, gifts and mutual aid is a system of obligation, and a binding one. But it flows in every direction and never hardens into a permanent creditor and a permanent debtor. The raw material of debt is present; its weaponisation is not.",
      },
      resistance: {
        title: "Resistance as prevention",
        signature: true,
        body: "In every later era, resistance pushes against an established power. Here there is none yet — so the work is to stop power from forming at all. Forager societies developed a toolkit for cutting down would-be dominators:",
        list: [
          { k: "Mockery & teasing", v: "The successful hunter is ribbed, not praised. In some groups the rule is explicit — boast of your kill and you'll be told the meat is thin and worthless, precisely to deflate the claim to status." },
          { k: "{{demand sharing}}", v: "A good kill isn't the hunter's to dole out as patronage; others claim shares by right, stripping the producer of the leverage that giving would otherwise create." },
          { k: "Mobility as exit", v: "If someone grows overbearing, people simply leave. The group {{fission}}s. The threat of walking away is a permanent check on anyone accumulating authority." },
          { k: "Ridicule, ostracism — and, at the limit, violence", v: "Boehm called this a {{reverse dominance hierarchy}}: the rank-and-file collectively dominate anyone who tries to dominate them." },
        ],
        close: "The capacity for hierarchy was always there. What varied was whether a society would permit its expression. Every later jubilee, revolt and commons is, in some sense, an attempt to recover this original condition.",
      },
    },
    legitimacy: { fill: 0, claim: "None.", detail: "There is no formal claim to rule, because there is no rule to justify." },
    threadCaps: {
      production: "Prestige stays soft — respect, never command.",
      conversion: "Every path from power to more power is jammed.",
      ideology: "A cosmos of reciprocity — no throne at the top.",
      kinship: "Balanced relations; patriarchy isn't here yet.",
      debt: "Obligation flows every way and never settles.",
      resistance: "Flatness, actively defended — the signature thread.",
    },
    /* causal-map edge states: cut · forming · open */
    causal: {
      caption: "Place the capacity for hierarchy at the centre. Every path that could carry it into permanent power is actively severed — the leveling mechanisms are those cuts.",
      edges: { "prestige>command": "cut", "surplus>command": "cut", "command>sanction": "cut", "command>inherit": "cut" },
    },
  },

  {
    id: "neolithic", num: "II", status: "full", accent: "#c79a4e",
    title: "The Neolithic Threshold",
    dates: "12,000 – 4,000 BCE",
    span: { from: 14000, to: 6000 },
    subtitle: "The contested moment. Where \u201carchy\u201d may — or may not — have taken root.",
    contested: { level: "High", note: "This era carries the strongest \u2018disputed\u2019 marker of any. The conventional and revisionist accounts are shown side by side rather than blended." },
    framing: "For most of human history there was no surplus to fight over. Then, independently and across several parts of the world, people began to settle, store and cultivate. The standard story says this is where inequality was born. That story is now under serious challenge — and the argument itself is the subject of this era.",
    legitimacy: { fill: 0.12, claim: "Barely any.", detail: "Legitimacy as a formal claim hardly exists yet — a near-blankness that only means something beside Era III." },
    causal: { edges: { "prestige>command": "forming", "surplus>command": "forming", "command>sanction": "cut", "command>inherit": "forming" } },
  },

  {
    id: "states", num: "III", status: "full", accent: "#a8553e",
    title: "The First States & God-Kings",
    dates: "4,000 – 800 BCE",
    span: { from: 6000, to: 2800 },
    subtitle: "The locks come off. Where surplus, belief and violence finally fuse into permanent rule.",
    contested: { level: "Low–Moderate", note: "That early states and stratification are real is solid. What is debated is how autocratic each was, and how universal the \u2018god-king\u2019 image is beyond Egypt and Mesopotamia." },
    framing: "Here \u201carchy\u201d stops being an experiment and becomes an institution. Across Mesopotamia, Egypt, the Indus, and northern China the same configuration appears: a ruler, a priesthood, a writing system, a tax, and a wall. The question is no longer why hierarchy happened, but what finally made it permanent and inescapable.",
    legitimacy: { fill: 1, claim: "Total.", detail: "Divine descent, cosmic mandate, sacred stewardship. Legitimacy goes from nothing to total in a single step." },
    causal: { edges: { "prestige>command": "open", "surplus>command": "open", "command>sanction": "open", "command>inherit": "open", loop: true } },
  },

  { id: "classical", num: "IV", status: "full", accent: "#6f93a8",
    title: "Classical Empires & Slavery", dates: "800 BCE – 500 CE", span: { from: 2800, to: 1525 },
    subtitle: "Codified law, coinage, large-scale slavery, citizenship as a hierarchy of belonging.",
    framing: "The classical world did not invent archy — it systematised it, with written law, abstract money, mass chattel slavery and citizenship as graded belonging. Power became less a person and more a structure, which is why so much of the apparatus feels continuous with our own.",
    legitimacy: { fill: 0.9, claim: "Law, citizenship & the cult.", detail: "The emperor as supreme magistrate and divine figure; belonging itself is ranked, and to be outside citizenship is to be beneath it." },
    causal: { edges: { "prestige>command": "open", "surplus>command": "open", "command>sanction": "open", "command>inherit": "open", loop: true } } },
  { id: "feudal", num: "V", status: "full", accent: "#9a7b4e",
    title: "Feudal & Tributary Orders", dates: "500 – 1450 CE", span: { from: 1525, to: 575 },
    subtitle: "Land-bound labour and divine right — in Europe, but also Japan, India and the Islamic world.",
    framing: "Power devolved, fragmented and attached itself directly to land and the bodies that worked it. The defining fact, across very different civilisations, is labour bound to the soil — the forager's last weapon, the right to leave, abolished without selling the person.",
    legitimacy: { fill: 1, claim: "Divine right & sacred function.", detail: "The monarch answerable to God alone; the three orders — those who pray, fight, and work — cast as a divinely ordained division of mutual service." },
    causal: { edges: { "prestige>command": "open", "surplus>command": "open", "command>sanction": "open", "command>inherit": "open", loop: true } } },
  { id: "mercantile", num: "VI", status: "full", accent: "#7d8a6f",
    title: "Mercantilism & the Atlantic System", dates: "1450 – 1800", span: { from: 575, to: 225 },
    subtitle: "Joint-stock companies, racialised chattel slavery, extraction across continents. Power goes global.",
    framing: "Power goes global and is exercised at a distance — the chartered company governing millions, and racialised chattel slavery at the base. And for the first time the counter-current crosses the abolition horizon: a whole category of bondage declared an abomination to be ended.",
    legitimacy: { fill: 0.85, claim: "Charter, conquest & race.", detail: "Sliding from God and birth toward ownership, contract, and an invented hierarchy of human kinds manufactured to justify the plantation." },
    causal: { edges: { "prestige>command": "open", "surplus>command": "open", "command>sanction": "open", "command>inherit": "open", loop: true } } },
  { id: "industrial", num: "VII", status: "full", accent: "#9a6f6a",
    title: "Industrial Capitalism", dates: "1800 – 1970", span: { from: 225, to: 55 },
    subtitle: "Wage labour, the factory, the nation-state — and organised resistance as a major counter-current.",
    framing: "Wage labour, the factory and the nation-state — and, for the first time, a counter-current strong enough to bend the curve downward. Unions, the franchise and the welfare state achieved the most thorough taming of archy the large-scale world has managed.",
    legitimacy: { fill: 0.7, claim: "The people & the contract.", detail: "Popular sovereignty and the nation; the owner's authority grounded in property and the worker's 'free' agreement to the wage bargain." },
    causal: { edges: { "prestige>command": "open", "surplus>command": "open", "command>sanction": "forming", "command>inherit": "forming", loop: true } } },
  { id: "present", num: "VIII", status: "full", accent: "#8a7da0",
    title: "The Present", dates: "1970 – now", span: { from: 55, to: 0 },
    subtitle: "Financialisation, algorithmic management, data as surplus. Novel — or old patterns in new dress?",
    framing: "Financialisation, algorithmic management and data as a genuinely new kind of surplus. The mid-century taming has substantially unwound — and the arrangement is, like every previous one, up for grabs.",
    legitimacy: { fill: 0.78, claim: "Democracy fused with merit.", detail: "Popular sovereignty plus property, expertise and the meritocratic claim that those at the top are there because they earned it." },
    causal: { edges: { "prestige>command": "open", "surplus>command": "open", "command>sanction": "forming", "command>inherit": "open", loop: true } } },
];

/* ---- causal-map node geometry (shared across eras) --------- */
/* x,y in a 0–100 box; the component scales to its container. */
window.OP_CAUSAL_NODES = [
  { id: "prestige", label: "Skill & prestige",          x: 16, y: 30 },
  { id: "surplus",  label: "Stored surplus",            x: 16, y: 74 },
  { id: "command",  label: "Command & rule",            x: 54, y: 52 },
  { id: "sanction", label: "Divine sanction",           x: 86, y: 28 },
  { id: "inherit",  label: "Heritable rank",            x: 86, y: 78 },
];
window.OP_CAUSAL_EDGES = [
  { id: "prestige>command", from: "prestige", to: "command" },
  { id: "surplus>command",  from: "surplus",  to: "command" },
  { id: "command>sanction", from: "command",  to: "sanction" },
  { id: "command>inherit",  from: "command",  to: "inherit" },
];

/* ---- the "society" diagram model : who holds power -------- */
/* tiers run apex → base; power 0..1 sets vertical height & figure scale;
   n is a representative head-count, not a literal census. */
window.OP_SOCIETY = {
  forager: { shape: "flat", scale: { head: "25–50 per band", detail: "networked into groups of ~150" },
    caption: "A flat band. Skill earns respect, never command — and the leveling mechanisms cut down anyone who tries to rise.",
    tiers: [{ label: "The band", n: 9, power: 0.36, note: "roughly equal" }],
    leveling: ["Mockery", "Demand sharing", "Mobility / exit", "Ridicule & ostracism"] },
  neolithic: { shape: "emerging", scale: { head: "150–1,000 per village", detail: "Çatalhöyük reached ~8,000" },
    caption: "Surplus appears, and with it the first tentative risers — whom many communities still refuse. The outcome is genuinely contested.",
    tiers: [
      { label: "Big-man / ritual figure?", n: 1, power: 0.6, note: "tentative · often refused" },
      { label: "Households", n: 8, power: 0.34, note: "communal granary" }] },
  states: { shape: "pyramid", scale: { head: "10,000–80,000 per city", detail: "Uruk among the first at this scale" },
    caption: "The machine closes into a pyramid — a god-king at the apex, sanctified from above; a mass of producers and bonded labour at the base.",
    tiers: [
      { label: "God-king", n: 1, power: 0.98 },
      { label: "Priests & warriors", n: 3, power: 0.74 },
      { label: "Scribes & officials", n: 4, power: 0.55 },
      { label: "Farmers & labourers", n: 10, power: 0.28 },
      { label: "Bonded & enslaved", n: 6, power: 0.10 }] },
  classical: { shape: "pyramid", scale: { head: "≈ 60 million", detail: "Rome & Han each governed tens of millions" },
    caption: "Codified law and citizenship as a hierarchy of belonging — resting on large-scale slavery.",
    tiers: [
      { label: "Emperor & elite", n: 1, power: 0.95 },
      { label: "Citizens", n: 4, power: 0.60 },
      { label: "Freedmen & plebs", n: 8, power: 0.33 },
      { label: "Enslaved", n: 8, power: 0.09 }] },
  feudal: { shape: "pyramid", scale: { head: "hundreds → millions", detail: "manor: hundreds · realm: millions" },
    caption: "Land-bound labour under divine right — the monarch, the church, the lord, the serf.",
    tiers: [
      { label: "Monarch & church", n: 1, power: 0.95 },
      { label: "Lords", n: 3, power: 0.72 },
      { label: "Knights & clergy", n: 5, power: 0.50 },
      { label: "Peasants & serfs", n: 13, power: 0.20 }] },
  mercantile: { shape: "pyramid", scale: { head: "continental", detail: "trade & empire spanning four continents" },
    caption: "Power goes global — joint-stock companies and racialised chattel slavery across continents.",
    tiers: [
      { label: "Crown & companies", n: 1, power: 0.95 },
      { label: "Merchant elite", n: 3, power: 0.70 },
      { label: "Free labour", n: 7, power: 0.40 },
      { label: "Colonised & enslaved", n: 11, power: 0.08 }] },
  industrial: { shape: "pyramid", scale: { head: "tens–hundreds of millions", detail: "nation-states · factories of thousands" },
    caption: "Wage labour and the factory — and, for the first time, organised resistance pushing back up the slope.",
    tiers: [
      { label: "Capital owners", n: 1, power: 0.90 },
      { label: "Managers", n: 3, power: 0.64 },
      { label: "Wage workers", n: 13, power: 0.32 },
      { label: "Unemployed & colonised", n: 5, power: 0.12 }] },
  present: { shape: "pyramid", scale: { head: "≈ 8 billion", detail: "one connected species · platforms with billions of users" },
    caption: "Financialisation, platforms and data-as-surplus. Novel — or an old pyramid in new dress?",
    tiers: [
      { label: "Asset owners & platforms", n: 1, power: 0.93 },
      { label: "Professional class", n: 5, power: 0.60 },
      { label: "Wage & gig workers", n: 13, power: 0.30 },
      { label: "Excluded", n: 4, power: 0.12 }] },
};

/* ---- the core framing engine : produced → converted → justified */
window.OP_THREAD_STAGE = { production: "produced", kinship: "produced", conversion: "converted", debt: "converted", ideology: "justified", resistance: "resist" };
window.OP_ENGINE = {
  forager:    { produced: "Skill & knowledge earn respect — but there is no storable surplus to seize.", converted: "Jammed at every step: prestige can't become command; nothing is inherited.", justified: "No throne. A cosmos of reciprocity among rough equals.", loop: "cut" },
  neolithic:  { produced: "Stored grain and fixed land appear — the first seizable surplus.", converted: "Ritual and labour begin to entangle; conversion is tentative, often refused.", justified: "Earth and fertility turn sacred — but shared rite can level as easily as raise.", loop: "forming" },
  states:     { produced: "Surplus, land, labour and force — centrally controlled.", converted: "Freely: force → wealth → office → priesthood → the right to tax, and back.", justified: "Divine kingship: the social order mirrors the cosmic one.", loop: "open" },
  classical:  { produced: "Conquest, enslaved labour, coin and codified law.", converted: "Military spoils become land, office and citizenship.", justified: "Citizenship as sacred belonging; the emperor-cult.", loop: "open" },
  feudal:     { produced: "Land and the bound labour worked upon it.", converted: "Land grants ⇄ military service ⇄ clerical office.", justified: "Divine right; the great chain of being.", loop: "open" },
  mercantile: { produced: "Colonised land, enslaved labour, chartered monopoly.", converted: "Company capital buys force; force seizes more capital.", justified: "Race and 'civilisation' as cover for extraction.", loop: "open" },
  industrial: { produced: "Wage labour, machines, fossil energy.", converted: "Capital → political power → law that protects capital.", justified: "The 'free' contract; the market as natural law.", loop: "open" },
  present:    { produced: "Data, attention and financial assets.", converted: "Money ⇄ media ⇄ policy ⇄ algorithmic control.", justified: "Meritocracy; markets and code as neutral.", loop: "open" },
};

/* ---- force model : how hard each thread pushes power to
   concentrate this era (0..1). resistance pushes the other way.
   The degree of power is derived from these, so the mechanism is
   honest — the bars literally set the gauge. */
window.OP_FORCE = {
  forager:    { production: 0.10, kinship: 0.10, conversion: 0.05, debt: 0.05, ideology: 0.05, resistance: 0.95 },
  neolithic:  { production: 0.45, kinship: 0.40, conversion: 0.30, debt: 0.35, ideology: 0.25, resistance: 0.55 },
  states:     { production: 0.85, kinship: 0.80, conversion: 0.95, debt: 0.90, ideology: 0.95, resistance: 0.20 },
  classical:  { production: 0.80, kinship: 0.75, conversion: 0.85, debt: 0.85, ideology: 0.80, resistance: 0.30 },
  feudal:     { production: 0.80, kinship: 0.80, conversion: 0.80, debt: 0.80, ideology: 0.90, resistance: 0.25 },
  mercantile: { production: 0.85, kinship: 0.70, conversion: 0.85, debt: 0.85, ideology: 0.80, resistance: 0.30 },
  industrial: { production: 0.80, kinship: 0.55, conversion: 0.85, debt: 0.70, ideology: 0.75, resistance: 0.55 },
  present:    { production: 0.85, kinship: 0.50, conversion: 0.90, debt: 0.80, ideology: 0.80, resistance: 0.45 },
};
window.opDegree = function (id) {
  var f = window.OP_FORCE[id]; if (!f) return 0;
  var c = (f.production + f.kinship + f.conversion + f.debt + f.ideology) / 5;
  return Math.max(0, Math.min(1, c - 0.35 * f.resistance + 0.15));
};

/* ---- evidence plates : labels for user-fillable image slots */
window.OP_EVIDENCE = {
  forager: [{ label: "A mobile foraging band" }, { label: "Hand stencils, deep time" }, { label: "Sharing the kill" }],
  neolithic: [{ label: "Göbekli Tepe" }, { label: "Çatalhöyük dwellings" }, { label: "An early granary" }],
  states: [{ label: "Ziggurat & temple" }, { label: "A cuneiform debt tablet" }, { label: "Law stele (Hammurabi)" }],
  classical: [{ label: "Forum & senate" }, { label: "Coinage" }, { label: "An enslaved workforce" }],
  feudal: [{ label: "The manor" }, { label: "Cathedral & crown" }, { label: "Serfs at harvest" }],
  mercantile: [{ label: "A company port" }, { label: "The Atlantic trade" }, { label: "A plantation" }],
  industrial: [{ label: "The factory floor" }, { label: "A union march" }, { label: "The tenement city" }],
  present: [{ label: "The data centre" }, { label: "A trading floor" }, { label: "Gig / platform work" }],
};

/* ---- thread write-ups for Eras II–VIII (Era I keeps its richer
   inline `threads`). Each opens the same read-deeper panel. ---- */
window.OP_ERA_THREADS = {
  neolithic: {
    production: { signature: true, title: "Storage becomes potential power", body: "A granary concentrates value where it can be defended, and makes whoever controls it indispensable in lean seasons; settling turns \u2018where we forage\u2019 into \u2018what we own and pass on.\u2019 Where storage stayed communal, though, that potential never hardened into private leverage." },
    conversion: { title: "Ritual before economy", body: "G\u00f6bekli Tepe shows monumental, coordinated labour by people who were not yet farmers \u2014 the power to mobilise collective effort may have come before agricultural surplus, not after. Conversion here is tentative, and often refused." },
    ideology: { title: "Earth and fertility turn sacred", body: "Belief begins to encode the new bond to land and reproduction. But shared rite cuts both ways: everyone raising the temple together can level as surely as a priest-class owning it can stratify \u2014 the same machinery, opposite ends." },
    kinship: { title: "The entanglement begins", body: "Heritable land creates an interest in controlling inheritance \u2014 and therefore reproduction and lineage. Yet flat households and female-associated imagery at sites like \u00c7atalh\u00f6y\u00fck caution against assuming patriarchy arrived with the first hoe." },
    debt: { title: "Obligation becomes countable", body: "Debt long predates money as social obligation; what the Neolithic adds is the measurable kind \u2014 stored grain lent and owed in exact amounts. The seed of debt-as-leverage is planted, its weaponisation still to come." },
    resistance: { title: "Refusing to build it", body: "Resistance here is prevention, not revolt: uniform houses, absent palaces, and farming taken up and then abandoned read as societies declining, for millennia, to let anyone permanently rise." },
  },
  states: {
    production: { title: "Surplus, centrally held", body: "Surplus is now large, storable and controlled through temple and palace as a combined institution; command of irrigation, land allotment and the calendar gathers in the same hands. The communal granary of Era II becomes the state\u2019s." },
    conversion: { title: "Every form, freely convertible", body: "Military success buys land; land buys office; office claims religious authority; religious authority licenses the tax \u2014 and back again. The ruler-priesthood pairing is exactly this circuit made permanent." },
    ideology: { signature: true, title: "Earthly order as cosmic order", body: "Hierarchy is now mirrored in and sanctified by the heavens: the pharaoh is divine, the Mesopotamian king the god\u2019s steward, the Chinese ruler holds Heaven\u2019s mandate. The claim that the social order reflects the structure of the universe is this era\u2019s defining invention." },
    kinship: { title: "Patriarchy written into law", body: "Heritable office and land create a powerful interest in legitimate heirs, which becomes formal control of women\u2019s reproduction. The earliest law codes \u2014 Hammurabi and its predecessors \u2014 encode a stratified, patriarchal household as the basic legal unit." },
    debt: { title: "Debt fully weaponised", body: "Recorded and enforceable across generations, debt now produces bondage and slavery; people pledge their labour, their kin, or themselves. It grows so destabilising that rulers must periodically cancel it." },
    resistance: { title: "The clean slate", body: "Resistance becomes reaction against an established power \u2014 and the sharpest counter-current comes from the top: Mesopotamian clean-slate edicts that wiped debts and freed bond-servants to keep the order from tearing itself apart. The jubilee tradition starts here." },
  },
  classical: {
    production: { signature: true, title: "Built on slavery", body: "Conquest supplies enslaved labour, coined money and codified law; the productive base of Greece, Rome, Persia and Han is large-scale bondage. Citizenship is a hierarchy of belonging laid over that base." },
    conversion: { title: "Spoils into standing", body: "Military victory converts into land, office and citizenship; coinage makes power liquid and movable. The soldier-statesman and the slave-owning citizen are two faces of one circuit." },
    ideology: { title: "Citizenship as sacred belonging", body: "Legitimacy runs through law and the cult of the city and emperor: to belong is to be ranked, and to rule is to embody the order of the state. Those outside citizenship are, by definition, beneath it." },
    kinship: { title: "The household, codified", body: "Roman law makes the male head of household a near-sovereign over wife, children and slaves; legitimacy and inheritance structure property and citizenship alike." },
    debt: { title: "Debt bondage and the dole", body: "Debt slavery recurs as a chronic crisis \u2014 and a recurring political demand to abolish it; bread and circuses manage the unpropertied poor without dispersing power." },
    resistance: { title: "Revolt and reform", body: "Slave revolts, plebeian secessions and debt-relief agitation push back; a few win reforms, most are crushed. Resistance now contends with an entrenched state rather than preventing one." },
  },
  feudal: {
    production: { title: "Land and bound labour", body: "Power rests on land worked by tied peasants and serfs who owe labour, rent and dues; the manor is the unit of production and of rule at once." },
    conversion: { title: "Service for land, land for service", body: "Land grants are exchanged for military service up a chain of vassalage; title, armed force and clerical office all convert into one another through fealty." },
    ideology: { signature: true, title: "Divine right & the great chain", body: "Kings rule by God\u2019s grace, and the social order is cast as a divinely ordained \u2018great chain of being\u2019 \u2014 every rank fixed in its place by Heaven. Mirrored in Japanese, Indian and Islamic tributary orders, not Europe alone." },
    kinship: { title: "Lineage as property", body: "Primogeniture and dynastic marriage make bloodline the carrier of land and title; to control women\u2019s marriage and reproduction is to control the transmission of estates." },
    debt: { title: "Dues, tithes, bondage to the land", body: "The serf owes labour and a share of produce in perpetuity; the tithe binds the peasant to the church. Obligation is hereditary and attached to the soil itself." },
    resistance: { title: "Jacquerie and heresy", body: "Peasant revolts, millenarian movements and heresies challenge lord and church; most are suppressed, but they keep alive the claim that the order is made, not God-given." },
  },
  mercantile: {
    production: { title: "Extraction across continents", body: "Power is generated from colonised land, enslaved labour and chartered monopoly \u2014 sugar, silver and the plantation. Wealth seized abroad becomes capital at home." },
    conversion: { signature: true, title: "Company capital and the gun", body: "The joint-stock company fuses private capital with state-backed force: capital buys armies and charters, force seizes more land and trade, and the proceeds buy political power. Economic and military power become a single global instrument." },
    ideology: { title: "Race as alibi", body: "A new ideology of racial hierarchy and \u2018civilising mission\u2019 recasts plunder and chattel slavery as natural, even benevolent \u2014 legitimating extraction by denying the humanity of the extracted." },
    kinship: { title: "Race, slavery and the family", body: "Chattel slavery makes status heritable through the mother\u2019s condition; marriage, \u2018blood\u2019 and racial classification become legal machinery for sorting who may own and who may be owned." },
    debt: { title: "Bondage on credit", body: "Indentured servitude, debt peonage and the financing of slave voyages all run on credit; whole colonies are organised as engines for servicing debt to the metropole." },
    resistance: { title: "Maroons and revolt", body: "Slave uprisings, maroon communities and the Haitian Revolution prove the system contestable; abolition movements begin to turn its own moral language against it." },
  },
  industrial: {
    production: { title: "The factory and the wage", body: "Power is generated through wage labour, machines and fossil energy; ownership of the means of production \u2014 not land or birth \u2014 becomes the decisive asset." },
    conversion: { title: "Capital into law", body: "Wealth converts into political power and a legal order \u2014 property, contract, limited liability \u2014 built to protect and compound capital, which then buys more influence." },
    ideology: { title: "The free contract", body: "Domination is recast as voluntary exchange between equals, and the market as a law of nature; if you are poor, the story goes, you simply lost a fair game." },
    kinship: { title: "Separate spheres", body: "Industrial capitalism hardens a gendered divide \u2014 waged \u2018public\u2019 man, unpaid domestic woman \u2014 even as it pulls women and children onto the factory floor." },
    debt: { title: "Wages, rent, the company store", body: "The propertyless live one paycheque from ruin; rent, hire-purchase and the company store keep workers perpetually owing \u2014 binding labour without owning it." },
    resistance: { signature: true, title: "The organised counter-current", body: "For the first time resistance organises at scale: unions, strikes, abolition, suffrage and socialist movements win the vote, the weekend and the wage floor. Strong enough to bend the curve \u2014 you can see it as the dip in the degree of power this era." },
  },
  present: {
    production: { title: "Data, attention, assets", body: "Power is increasingly generated from financial assets, intellectual property, attention and data \u2014 surplus extracted from behaviour and information as much as from labour." },
    conversion: { signature: true, title: "Money \u21c4 media \u21c4 policy \u21c4 code", body: "Wealth buys media reach and political access; policy and law protect asset-holders; algorithms turn data into control over what people see and do \u2014 and the proceeds buy more of all of it. The circuit is fast, global and largely invisible." },
    ideology: { title: "Meritocracy & neutral code", body: "Markets and algorithms are presented as neutral and meritocratic \u2014 outcomes framed as earned, and the machinery of advantage as objective rather than designed." },
    kinship: { title: "Reproduction, still unwaged", body: "Care and domestic labour remain largely unwaged and gendered even as formal equality advances; control over reproduction stays a live political battleground." },
    debt: { title: "Credit, loans, rent", body: "Debt is now near-universal infrastructure \u2014 mortgages, student loans, credit, medical debt \u2014 a quiet, lifelong engine of obligation that disciplines without overt force." },
    resistance: { title: "Old patterns, new tools", body: "Labour organising returns in new forms, alongside movements against finance, surveillance and extraction. The open question: are algorithmic management and data-as-surplus genuinely new \u2014 or the oldest pattern in new dress?" },
  },
};

/* resolve an era's thread set (Era I inline, others from the map) */
window.opThreads = function (era) { return era.threads || window.OP_ERA_THREADS[era.id] || {}; };

/* ---- the opening primer : what power is, and how "with" turns "over" ---- */
window.OP_PRIMER = {
  kicker: "Before the eras — a definition",
  title: "What is power?",
  lead: "Strip the prefixes from monarchy, oligarchy, patriarchy and hierarchy, and the same bare word remains \u2014 archy, rule. At its simplest, power is the capacity to influence others, control resources, and direct one's own destiny despite resistance. But that capacity comes in two very different forms, and the whole of this story is how one becomes the other.",
  faces: [
    { id: "with", label: "Power WITH", tag: "the generative kind",
      body: "The capacity a group creates together \u2014 to hunt, to build, to decide, to care for its own. It is additive: it grows as more people join, and it belongs to no one in particular. Influence here is granted, provisional, and revocable.",
      marks: ["Cooperation", "Persuasion", "Earned prestige", "Acting in concert"] },
    { id: "over", label: "Power OVER", tag: "the extractive kind",
      body: "The capacity of some to command, extract from, or dispose of others. It is subtractive: one person's gain is another's loss. Authority here is held, durable, and imposed \u2014 and, crucially, it can be inherited.",
      marks: ["Command", "Coercion", "Ownership", "Inherited rank"] },
  ],
  checks: {
    h: "What keeps it in check",
    intro: "For most of human history the turn from with to over was actively blocked. The checks are strikingly consistent across unrelated societies:",
    items: [
      { k: "Exit", v: "The freedom to walk away \u2014 the ultimate veto on any would-be ruler." },
      { k: "Voice", v: "Decisions reached together; a leader followed only while useful, and no longer." },
      { k: "Sharing", v: "No one controls another's subsistence, so surplus cannot pool into leverage." },
      { k: "Sanction", v: "Ridicule, ostracism \u2014 and, at the limit, force \u2014 turned upward against the upstart." },
    ],
    close: "Where these hold, prestige stays soft: respect, never command.",
  },
  turn: {
    h: "How \u201cwith\u201d becomes \u201cover\u201d",
    intro: "Archy is not the arrival of a new force; it is the failure of these checks. Watch, in each era, for the moment a door opens:",
    items: [
      { k: "Surplus & storage", v: "Something worth seizing \u2014 and someone positioned to control it." },
      { k: "The loss of exit", v: "Fields, granaries and graves that can no longer be left behind." },
      { k: "Monopoly", v: "Of force, of the written ledger, or of the sacred story that explains the order." },
      { k: "Inheritance", v: "A one-generation advantage hardened into a dynasty." },
    ],
    close: "Each converts a fleeting, shared capacity into a fixed, transmissible command.",
  },
  outro: "So the question is not \u201cwhy is there hierarchy?\u201d but \u201cwhy, and when, did power-with curdle into power-over \u2014 and what would it take to turn it back?\u201d The eras that follow trace these doors opening, and sometimes closing again. Begin where the checks still held.",
};

/* ---- the primer's factors, carried into every era ----------
   checks (0..1) sustain power-WITH; doors (0..1) open power-OVER.
   Power With = mean of the checks; Power Over = mean of the doors. */
window.OP_CHECK_DEFS = [
  { k: "exit",     label: "Exit",     hint: "freedom to walk away" },
  { k: "voice",    label: "Voice",    hint: "deciding together" },
  { k: "sharing",  label: "Sharing",  hint: "no grip on subsistence" },
  { k: "sanction", label: "Sanction", hint: "the upstart cut down" },
];
window.OP_DOOR_DEFS = [
  { k: "surplus",     label: "Surplus & storage", hint: "something worth seizing" },
  { k: "exitloss",    label: "Loss of exit",      hint: "bound to field & granary" },
  { k: "monopoly",    label: "Monopoly",          hint: "of force, ledger, the sacred" },
  { k: "inheritance", label: "Inheritance",       hint: "advantage made a dynasty" },
];
window.OP_CHECKS = {
  forager:    { exit: 0.95, voice: 0.90, sharing: 0.95, sanction: 0.90 },
  neolithic:  { exit: 0.55, voice: 0.60, sharing: 0.50, sanction: 0.50 },
  states:     { exit: 0.20, voice: 0.20, sharing: 0.15, sanction: 0.20 },
  classical:  { exit: 0.20, voice: 0.28, sharing: 0.15, sanction: 0.22 },
  feudal:     { exit: 0.10, voice: 0.14, sharing: 0.15, sanction: 0.18 },
  mercantile: { exit: 0.18, voice: 0.20, sharing: 0.14, sanction: 0.30 },
  industrial: { exit: 0.45, voice: 0.55, sharing: 0.40, sanction: 0.55 },
  present:    { exit: 0.42, voice: 0.45, sharing: 0.35, sanction: 0.42 },
};
window.OP_DOORS = {
  forager:    { surplus: 0.05, exitloss: 0.05, monopoly: 0.05, inheritance: 0.05 },
  neolithic:  { surplus: 0.50, exitloss: 0.40, monopoly: 0.30, inheritance: 0.45 },
  states:     { surplus: 0.85, exitloss: 0.80, monopoly: 0.90, inheritance: 0.85 },
  classical:  { surplus: 0.85, exitloss: 0.80, monopoly: 0.85, inheritance: 0.80 },
  feudal:     { surplus: 0.80, exitloss: 0.95, monopoly: 0.85, inheritance: 0.95 },
  mercantile: { surplus: 0.90, exitloss: 0.85, monopoly: 0.85, inheritance: 0.80 },
  industrial: { surplus: 0.90, exitloss: 0.60, monopoly: 0.70, inheritance: 0.60 },
  present:    { surplus: 0.95, exitloss: 0.55, monopoly: 0.85, inheritance: 0.70 },
};
window.opMean = function (o) { var v = Object.keys(o).map(function (k) { return o[k]; }); return v.reduce(function (a, b) { return a + b; }, 0) / v.length; };
window.opPowerWith = function (id) { return window.OP_CHECKS[id] ? window.opMean(window.OP_CHECKS[id]) : 0; };
window.opPowerOver = function (id) { return window.OP_DOORS[id] ? window.opMean(window.OP_DOORS[id]) : 0; };

/* ---- continuous scrubbing: anchor each era at the geometric
   midpoint of its span, then interpolate the factors in log-time
   so the bars glide as the slider moves between eras. ---- */
window.OP_ERAS.forEach(function (e) { e.anchorYa = Math.sqrt(Math.max(e.span.from, 1) * Math.max(e.span.to, 1)); });
/* hold full forager until 25,000 BP, then begin the morph toward the Neolithic */
window.OP_ERAS[0].anchorYa = 25000;

window.opEraAtYa = function (ya) {
  var E = window.OP_ERAS;
  for (var i = 0; i < E.length; i++) { if (ya <= E[i].span.from && ya > E[i].span.to) return E[i]; }
  return ya > E[0].span.to ? E[0] : E[E.length - 1];
};

window.opInterpFactors = function (ya) {
  var E = window.OP_ERAS, a = E[0], b = E[0];
  if (ya >= E[0].anchorYa) { a = b = E[0]; }
  else if (ya <= E[E.length - 1].anchorYa) { a = b = E[E.length - 1]; }
  else { for (var i = 0; i < E.length - 1; i++) { if (ya <= E[i].anchorYa && ya >= E[i + 1].anchorYa) { a = E[i]; b = E[i + 1]; break; } } }
  var t = (a === b) ? 0 : (Math.log(a.anchorYa) - Math.log(ya)) / (Math.log(a.anchorYa) - Math.log(b.anchorYa));
  t = Math.max(0, Math.min(1, t));
  var lerp = function (x, y) { return x + (y - x) * t; };
  var ca = window.OP_CHECKS[a.id], cb = window.OP_CHECKS[b.id], da = window.OP_DOORS[a.id], db = window.OP_DOORS[b.id];
  var checks = {}, doors = {};
  ["exit", "voice", "sharing", "sanction"].forEach(function (k) { checks[k] = lerp(ca[k], cb[k]); });
  ["surplus", "exitloss", "monopoly", "inheritance"].forEach(function (k) { doors[k] = lerp(da[k], db[k]); });
  return { checks: checks, doors: doors, pWith: window.opMean(checks), pOver: window.opMean(doors) };
};
