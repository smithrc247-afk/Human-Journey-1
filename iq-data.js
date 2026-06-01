/* ============================================================
   iq-data.js — Power, Wealth & Inequality  (Part II)
   ------------------------------------------------------------
   A grounded-but-illustrative model of how a human group's
   structure, contribution, wealth and power redistribute across
   deep time. Every figure is an ESTIMATE, synthesised from
   archaeology, anthropology and economic history — calibrated to
   tell the real arc (egalitarian foraging → farming surplus →
   states → empires → industry → today), not to assert precise
   numbers.

   Aligned to the canon shared across the work:
     · the EIGHT eras (forager → present), and
     · the SIX functional roles (Owners, Organizers, Enforcers,
       Legitimators, Producers, Dependents).
   In the forager era the apex roles are near-empty placeholders —
   there was no owning, coercing or priestly class yet — so the
   strata read as an almost flat band, not a pyramid.

   ONE source of truth: each era's six role groups carry shares of
   {pop, contrib, wealth, income, power}. Every headline measure
   (Gini, Palma, top-share, the contribution–reward gap, the
   wealth↔power coupling) is DERIVED from those distributions.
   The master table (mechanisms → practiced archy) is carried
   separately, in window.IQ_MASTER.
   ============================================================ */

// ---- the six structural roles ------------------------------
window.IQ_ROLES = [
  { id: "owners",       label: "Owners",       color: "#c79a4e", role: "Capital & land",         glyph: "M3 21h18M5 21V8l7-5 7 5v13M9 21v-6h6v6" },
  { id: "organizers",   label: "Organizers",   color: "#6f93a8", role: "Coordination",           glyph: "M4 19V5m16 14V9M4 12h16M12 5v14" },
  { id: "enforcers",    label: "Enforcers",    color: "#a8553e", role: "Coercion & order",       glyph: "M12 2l7 3v6c0 5-3 8-7 11-4-3-7-6-7-11V5z" },
  { id: "legitimators", label: "Legitimators", color: "#9079ad", role: "Belief & legitimacy",    glyph: "M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7zM12 9a3 3 0 100 6 3 3 0 000-6z" },
  { id: "producers",    label: "Producers",    color: "#8a9a5b", role: "Labour",                 glyph: "M3 21h18M6 21V11m12 10V11M4 11l8-7 8 7" },
  { id: "dependents",   label: "Dependents",   color: "#7d7566", role: "Without a stake",         glyph: "M12 7a3 3 0 100-6 3 3 0 000 6zM5 22c0-4 3-7 7-7s7 3 7 7" },
];
// display order, apex → base (a society in cross-section)
window.IQ_STACK = ["owners", "organizers", "enforcers", "legitimators", "producers", "dependents"];

// ---- the metrics carried per role ---------------------------
window.IQ_METRICS = {
  pop:     "Share of the group",
  contrib: "Share of contribution",
  wealth:  "Share of wealth (stock)",
  income:  "Share of income (flow)",
  power:   "Share of power",
};

// ---- era anchors --------------------------------------------
// Each row: pop / contrib / wealth / income / power (each column
// is meant to total ~100 across the six roles; the engine
// renormalises to be safe). Plus scalar regimes:
//   mobility    0 = caste-rigid    → 1 = wholly fluid
//   inheritance 0 = position resets → 1 = position transmits whole
//   coupling    0 = wealth & power independent → 1 = fully fused
// Two forager anchors hold the deep past flat until the Neolithic.
window.IQ_ERAS = [
  {
    ya: 300000, key: "forager", name: "Forager egalitarianism", year: "≈ 300,000 BP",
    place: "Pleistocene Africa", group: 30, unit: "a foraging band",
    blurb: "A band of a few dozen. Almost everyone forages; what is found is shared the same day. There is no owning class, no standing enforcers, no priesthood — only soft, fleeting prestige, fiercely levelled.",
    roles: {
      owners:       { pop: 1,  contrib: 1,  wealth: 2,  income: 2,  power: 3  },
      organizers:   { pop: 4,  contrib: 5,  wealth: 5,  income: 5,  power: 12 },
      enforcers:    { pop: 1,  contrib: 2,  wealth: 2,  income: 2,  power: 5  },
      legitimators: { pop: 2,  contrib: 3,  wealth: 3,  income: 3,  power: 10 },
      producers:    { pop: 67, contrib: 78, wealth: 67, income: 74, power: 58 },
      dependents:   { pop: 25, contrib: 11, wealth: 21, income: 14, power: 12 },
    },
    notes: { owners: "—", organizers: "Whoever leads the hunt", enforcers: "—", legitimators: "Shamans & storytellers", producers: "Foragers — nearly everyone", dependents: "Children & the old" },
    mobility: 0.86, inheritance: 0.07, coupling: 0.12,
  },
  {
    ya: 13000, key: "forager", name: "Forager egalitarianism", year: "≈ 11,000 BCE",
    place: "Late Palaeolithic", group: 40, unit: "a foraging band",
    blurb: "Bands range farther and trade ornaments across hundreds of miles, yet the social rule holds: no one accumulates, no one commands. Equality is not innocence — it is enforced, daily.",
    roles: {
      owners:       { pop: 1,  contrib: 1,  wealth: 2,  income: 2,  power: 3  },
      organizers:   { pop: 4,  contrib: 5,  wealth: 5,  income: 5,  power: 12 },
      enforcers:    { pop: 1,  contrib: 2,  wealth: 2,  income: 2,  power: 5  },
      legitimators: { pop: 2,  contrib: 3,  wealth: 3,  income: 3,  power: 10 },
      producers:    { pop: 67, contrib: 78, wealth: 67, income: 74, power: 58 },
      dependents:   { pop: 25, contrib: 11, wealth: 21, income: 14, power: 12 },
    },
    notes: { owners: "—", organizers: "Whoever leads the hunt", enforcers: "—", legitimators: "Shamans & storytellers", producers: "Hunter-gatherers", dependents: "Children & the old" },
    mobility: 0.84, inheritance: 0.08, coupling: 0.13,
  },
  {
    ya: 9000, key: "neolithic", name: "The Neolithic threshold", year: "≈ 7,000 BCE",
    place: "First farming villages", group: 350, unit: "a village",
    blurb: "Tamed grain and herds become the first things worth keeping — and the first households that keep more than others. The aggrandiser throws the debt-creating feast; some communities still refuse to let anyone rise.",
    roles: {
      owners:       { pop: 2,  contrib: 3,  wealth: 13, income: 8,  power: 14 },
      organizers:   { pop: 5,  contrib: 7,  wealth: 9,  income: 8,  power: 16 },
      enforcers:    { pop: 3,  contrib: 4,  wealth: 5,  income: 5,  power: 8  },
      legitimators: { pop: 3,  contrib: 4,  wealth: 6,  income: 5,  power: 12 },
      producers:    { pop: 68, contrib: 73, wealth: 51, income: 62, power: 42 },
      dependents:   { pop: 19, contrib: 9,  wealth: 16, income: 12, power: 8  },
    },
    notes: { owners: "Aggrandiser households", organizers: "Big-men & headmen", enforcers: "Part-time warriors", legitimators: "Shamans & ritual specialists", producers: "Farmers & herders", dependents: "The first bonded" },
    mobility: 0.50, inheritance: 0.40, coupling: 0.42,
  },
  {
    ya: 5000, key: "states", name: "The first states & god-kings", year: "≈ 3,000 BCE",
    place: "Uruk, Sumer", group: 45000, unit: "a city-state",
    blurb: "Stored grain feeds those who never farm — scribes, priests, soldiers, a king. The temple records who owes what. Writing is born as accounting, and the surplus of the many becomes the estate of the few.",
    roles: {
      owners:       { pop: 2,  contrib: 4,  wealth: 34, income: 26, power: 30 },
      organizers:   { pop: 6,  contrib: 9,  wealth: 13, income: 12, power: 16 },
      enforcers:    { pop: 5,  contrib: 5,  wealth: 9,  income: 9,  power: 12 },
      legitimators: { pop: 4,  contrib: 5,  wealth: 12, income: 10, power: 18 },
      producers:    { pop: 68, contrib: 70, wealth: 26, income: 38, power: 20 },
      dependents:   { pop: 15, contrib: 7,  wealth: 6,  income: 5,  power: 4  },
    },
    notes: { owners: "God-king, temple & elite", organizers: "Scribes & bureaucrats", enforcers: "Standing soldiery", legitimators: "The priesthood", producers: "Peasant cultivators", dependents: "Debt-bondsmen & the enslaved" },
    mobility: 0.22, inheritance: 0.70, coupling: 0.76,
  },
  {
    ya: 2000, key: "classical", name: "Classical empires & slavery", year: "≈ 1 CE",
    place: "Imperial Rome", group: 60000000, unit: "an empire",
    blurb: "An empire of tens of millions, fed by grain fleets and the labour of the enslaved — perhaps a third of Italy, who produce much and own nothing. A senatorial elite of a few thousand commands estates spanning provinces.",
    roles: {
      owners:       { pop: 2,  contrib: 4,  wealth: 40, income: 30, power: 34 },
      organizers:   { pop: 5,  contrib: 8,  wealth: 13, income: 12, power: 14 },
      enforcers:    { pop: 6,  contrib: 5,  wealth: 11, income: 11, power: 16 },
      legitimators: { pop: 3,  contrib: 4,  wealth: 8,  income: 7,  power: 12 },
      producers:    { pop: 54, contrib: 68, wealth: 22, income: 34, power: 18 },
      dependents:   { pop: 30, contrib: 11, wealth: 6,  income: 6,  power: 6  },
    },
    notes: { owners: "Senatorial & equestrian elite", organizers: "Bureaucrats & tax-farmers", enforcers: "The legions", legitimators: "Priests & jurists", producers: "Free peasants & artisans", dependents: "The enslaved" },
    mobility: 0.20, inheritance: 0.72, coupling: 0.78,
  },
  {
    ya: 900, key: "feudal", name: "Feudal & tributary orders", year: "≈ 1,100 CE",
    place: "The manor", group: 500, unit: "a manorial estate",
    blurb: "Born a serf, die a serf; born a lord, rule. Land is bound to bloodline and bloodline to land. The three orders — those who pray, those who fight, those who work — are held to be ordained, not chosen.",
    roles: {
      owners:       { pop: 2,  contrib: 4,  wealth: 42, income: 32, power: 40 },
      organizers:   { pop: 3,  contrib: 5,  wealth: 10, income: 9,  power: 12 },
      enforcers:    { pop: 4,  contrib: 5,  wealth: 10, income: 10, power: 16 },
      legitimators: { pop: 4,  contrib: 5,  wealth: 14, income: 11, power: 18 },
      producers:    { pop: 77, contrib: 73, wealth: 20, income: 34, power: 10 },
      dependents:   { pop: 10, contrib: 8,  wealth: 4,  income: 4,  power: 4  },
    },
    notes: { owners: "Nobility & crown", organizers: "Stewards & officials", enforcers: "Knights & men-at-arms", legitimators: "The Church", producers: "Peasants & serfs", dependents: "Beggars & the infirm" },
    mobility: 0.12, inheritance: 0.86, coupling: 0.80,
  },
  {
    ya: 400, key: "mercantile", name: "Mercantilism & the Atlantic", year: "≈ 1,650 CE",
    place: "The Atlantic system", group: 5000000, unit: "an empire & its network",
    blurb: "Power goes global. Joint-stock companies fuse capital with state-backed force; silver, sugar and the plantation feed metropolitan fortunes. A racialised, heritable enslaved class is built at the base — defined out of humanity to justify it.",
    roles: {
      owners:       { pop: 2,  contrib: 4,  wealth: 44, income: 33, power: 40 },
      organizers:   { pop: 4,  contrib: 7,  wealth: 13, income: 12, power: 14 },
      enforcers:    { pop: 4,  contrib: 4,  wealth: 9,  income: 9,  power: 14 },
      legitimators: { pop: 3,  contrib: 4,  wealth: 9,  income: 8,  power: 12 },
      producers:    { pop: 47, contrib: 61, wealth: 19, income: 31, power: 16 },
      dependents:   { pop: 40, contrib: 20, wealth: 6,  income: 7,  power: 4  },
    },
    notes: { owners: "Crown, planters & companies", organizers: "Factors & merchants", enforcers: "Navies & company armies", legitimators: "Clergy & the ideology of race", producers: "Wage labour (metropole)", dependents: "The colonised & enslaved" },
    mobility: 0.20, inheritance: 0.72, coupling: 0.78,
  },
  {
    ya: 150, key: "industrial", name: "Industrial capitalism", year: "≈ 1,875 CE",
    place: "The factory city", group: 100000, unit: "a nation-state",
    blurb: "Machines and mills concentrate wealth as never before — yet the Producer, now legally free and packed into factories, can organise. Unions, the franchise and the welfare state bend the curve downward: the one great compression in 12,000 years.",
    roles: {
      owners:       { pop: 3,  contrib: 7,  wealth: 46, income: 30, power: 38 },
      organizers:   { pop: 12, contrib: 18, wealth: 20, income: 23, power: 22 },
      enforcers:    { pop: 3,  contrib: 4,  wealth: 5,  income: 6,  power: 10 },
      legitimators: { pop: 4,  contrib: 5,  wealth: 6,  income: 7,  power: 10 },
      producers:    { pop: 72, contrib: 62, wealth: 18, income: 30, power: 16 },
      dependents:   { pop: 6,  contrib: 4,  wealth: 5,  income: 4,  power: 4  },
    },
    notes: { owners: "Industrialists & capital", organizers: "Managers, clerks & professionals", enforcers: "Police & army", legitimators: "Press, academy & church", producers: "The industrial working class", dependents: "Paupers & the workhouse" },
    mobility: 0.38, inheritance: 0.60, coupling: 0.66,
  },
  {
    ya: 1, key: "present", name: "The present", year: "Today",
    place: "A networked planet", group: 8100000000, unit: "the connected world",
    blurb: "Formal power is shared one-person-one-vote, yet wealth as stock is more concentrated than ever — the richest tenth hold most of it. Ownership re-fuses with management at the top; the Organizer role swells and migrates into code.",
    roles: {
      owners:       { pop: 2,  contrib: 7,  wealth: 52, income: 26, power: 34 },
      organizers:   { pop: 22, contrib: 30, wealth: 24, income: 33, power: 26 },
      enforcers:    { pop: 3,  contrib: 3,  wealth: 4,  income: 5,  power: 9  },
      legitimators: { pop: 3,  contrib: 4,  wealth: 5,  income: 6,  power: 10 },
      producers:    { pop: 58, contrib: 48, wealth: 9,  income: 26, power: 17 },
      dependents:   { pop: 12, contrib: 8,  wealth: 6,  income: 4,  power: 4  },
    },
    notes: { owners: "Capital owners & the billionaire class", organizers: "Professionals, managers & code", enforcers: "State security", legitimators: "Media & the meritocratic story", producers: "Workers, service & gig labour", dependents: "The precarious & data-subjects" },
    mobility: 0.45, inheritance: 0.50, coupling: 0.55,
  },
];

/* ============================================================
   THE MASTER TABLE — door-opening mechanisms → practiced archy
   Each mechanism scored 0–5 per era (0 = absent, 5 = maximally
   developed). The counter-current pushes the other way. The
   wealth Gini and an overall archy index (0–5) sit on the right.
   Structured judgement, calibrated to Part I; Gini carries the
   certainty noted per era.
   ============================================================ */
window.IQ_MASTER = {
  eras: [
    { roman: "I",    short: "Forager" },
    { roman: "II",   short: "Neolithic" },
    { roman: "III",  short: "First states" },
    { roman: "IV",   short: "Classical" },
    { roman: "V",    short: "Feudal" },
    { roman: "VI",   short: "Atlantic" },
    { roman: "VII",  short: "Industrial" },
    { roman: "VIII", short: "Present" },
  ],
  mechanisms: [
    { label: "Surplus & storage",            scores: [0, 3, 4, 4, 4, 5, 5, 5] },
    { label: "Loss of exit",                 scores: [0, 2, 4, 4, 5, 4, 3, 3] },
    { label: "Leveling defeated",            scores: [0, 2, 4, 5, 5, 5, 3, 4] },
    { label: "Control of subsistence",       scores: [0, 3, 5, 5, 5, 5, 4, 4] },
    { label: "Inheritance of position",      scores: [0, 2, 4, 4, 5, 4, 3, 3] },
    { label: "Debt",                         scores: [0, 1, 4, 4, 4, 4, 4, 5] },
    { label: "The ledger (legibility)",      scores: [0, 0, 4, 4, 3, 4, 5, 5] },
    { label: "Sacralization / naturalizing", scores: [0, 1, 5, 4, 5, 4, 2, 2] },
    { label: "Dispersed responsibility",     scores: [0, 0, 1, 2, 2, 4, 4, 5] },
    { label: "Coercion masked as exchange",  scores: [0, 0, 1, 2, 2, 3, 5, 5] },
  ],
  counter: { label: "Counter-current strength", scores: [5, 3, 2, 1, 2, 3, 5, 3] },
  gini:     ["~0.17", "~0.30", "~0.52", "~0.57", "~0.55", "~0.60", "~0.48", "~0.82"],
  giniCert: ["measured", "measured", "estimated", "estimated", "estimated", "estimated", "measured", "measured"],
  archy:    [0.3, 1.5, 4.0, 4.3, 4.3, 4.5, 3.0, 4.2],
};

// ============================================================
//  ENGINE
// ============================================================
(function () {
  const ERAS = window.IQ_ERAS;
  const ROLE_IDS = window.IQ_ROLES.map((r) => r.id);
  const METRIC_KEYS = ["pop", "contrib", "wealth", "income", "power"];

  const clamp01 = (x) => Math.max(0, Math.min(1, x));
  const lerp = (a, b, t) => a + (b - a) * t;

  function normalise(roleMap) {
    // force each metric column to total exactly 100
    for (const m of METRIC_KEYS) {
      let sum = 0;
      for (const id of ROLE_IDS) sum += roleMap[id][m];
      if (sum > 0) for (const id of ROLE_IDS) roleMap[id][m] = (roleMap[id][m] / sum) * 100;
    }
    return roleMap;
  }

  // interpolate the whole society at a given years-ago
  window.iqAt = function (ya) {
    let a = ERAS[0], b = ERAS[0];
    if (ya >= ERAS[0].ya) { a = b = ERAS[0]; }
    else if (ya <= ERAS[ERAS.length - 1].ya) { a = b = ERAS[ERAS.length - 1]; }
    else {
      for (let i = 0; i < ERAS.length - 1; i++) {
        if (ya <= ERAS[i].ya && ya >= ERAS[i + 1].ya) { a = ERAS[i]; b = ERAS[i + 1]; break; }
      }
    }
    let t = 0;
    if (a !== b) t = clamp01((Math.log(a.ya) - Math.log(ya)) / (Math.log(a.ya) - Math.log(b.ya)));

    const roles = {};
    for (const id of ROLE_IDS) {
      roles[id] = {};
      for (const m of METRIC_KEYS) roles[id][m] = lerp(a.roles[id][m], b.roles[id][m], t);
    }
    normalise(roles);

    const near = t < 0.5 ? a : b;
    return {
      roles,
      mobility: lerp(a.mobility, b.mobility, t),
      inheritance: lerp(a.inheritance, b.inheritance, t),
      coupling: lerp(a.coupling, b.coupling, t),
      group: Math.exp(lerp(Math.log(a.group), Math.log(b.group), t)),
      // era identity snaps to the nearer anchor (flips at the midpoint)
      key: near.key, name: near.name, year: near.year, place: near.place,
      unit: near.unit, blurb: near.blurb, notes: near.notes,
      t, from: a, to: b,
    };
  };

  // per-capita value of a metric for a role (value share ÷ pop share)
  const perCap = (roles, id, metric) => {
    const pop = roles[id].pop;
    return pop > 1e-6 ? roles[id][metric] / pop : 0;
  };

  // Lorenz polyline for a metric: roles sorted poorest→richest per-capita,
  // returning cumulative [{x: cum pop frac, y: cum value frac}] incl. origin.
  window.iqLorenz = function (roles, metric) {
    const order = ROLE_IDS.slice().sort((i, j) => perCap(roles, i, metric) - perCap(roles, j, metric));
    const pts = [{ x: 0, y: 0 }];
    let cx = 0, cy = 0;
    for (const id of order) {
      cx += roles[id].pop / 100;
      cy += roles[id][metric] / 100;
      pts.push({ x: cx, y: cy });
    }
    return pts;
  };

  // Gini from the Lorenz polyline (between-role; a clean lower bound)
  window.iqGini = function (roles, metric) {
    const L = window.iqLorenz(roles, metric);
    let area = 0; // area under the Lorenz curve
    for (let i = 1; i < L.length; i++) area += (L[i].x - L[i - 1].x) * (L[i].y + L[i - 1].y) / 2;
    return clamp01(1 - 2 * area);
  };

  // share of a metric held by the richest `p` fraction of the population
  // (walk the Lorenz from the top, interpolating within the straddling role)
  window.iqTopShare = function (roles, metric, p) {
    const L = window.iqLorenz(roles, metric); // poorest→richest
    const target = 1 - p; // cumulative pop below the top slice
    for (let i = 1; i < L.length; i++) {
      if (L[i].x >= target - 1e-9) {
        const seg = (target - L[i - 1].x) / ((L[i].x - L[i - 1].x) || 1);
        const yAt = L[i - 1].y + (L[i].y - L[i - 1].y) * seg;
        return clamp01(1 - yAt);
      }
    }
    return 0;
  };

  // Palma ratio: richest-10% share ÷ poorest-40% share
  window.iqPalma = function (roles, metric) {
    const top10 = window.iqTopShare(roles, metric, 0.10);
    const bottom40 = botShare(roles, metric, 0.40);
    return bottom40 > 1e-6 ? top10 / bottom40 : 99;
  };
  function botShare(roles, metric, p) {
    const L = window.iqLorenz(roles, metric);
    for (let i = 1; i < L.length; i++) {
      if (L[i].x >= p - 1e-9) {
        const seg = (p - L[i - 1].x) / ((L[i].x - L[i - 1].x) || 1);
        return clamp01(L[i - 1].y + (L[i].y - L[i - 1].y) * seg);
      }
    }
    return 1;
  }
  window.iqBottomShare = botShare;

  // contribution–reward gap per role (positive = over-rewarded vs effort)
  window.iqGap = function (roles, rewardMetric) {
    const out = {};
    for (const id of ROLE_IDS) out[id] = roles[id][rewardMetric] - roles[id].contrib;
    return out;
  };
  // a single disproportion index 0..1: half the summed absolute gap, /100
  window.iqDisproportion = function (roles, rewardMetric) {
    let s = 0;
    for (const id of ROLE_IDS) s += Math.abs(roles[id][rewardMetric] - roles[id].contrib);
    return clamp01(s / 200);
  };

  // wealth↔power coupling, 0..1: how aligned the two distributions are across
  // roles (cosine-style overlap of share vectors), blended with the era regime.
  window.iqCoupling = function (era) {
    const roles = era.roles;
    let dot = 0, nw = 0, np = 0;
    for (const id of ROLE_IDS) {
      const w = roles[id].wealth, p = roles[id].power;
      dot += w * p; nw += w * w; np += p * p;
    }
    const cos = dot / (Math.sqrt(nw) * Math.sqrt(np) || 1);
    // cos runs high even when equal; rescale so equality≈0, perfect lockstep≈1,
    // then blend with the authored regime so democratic-but-moneyed reads right
    const aligned = clamp01((cos - 0.55) / 0.45);
    return clamp01(0.45 * aligned + 0.55 * era.coupling);
  };
})();
