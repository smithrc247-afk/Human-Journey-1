/* ============================================================
   cm-data.js — The Cast and the Machine  (Part III)
   ------------------------------------------------------------
   Part III of "Archy: A Natural History of Power Over Others".
   Two linked questions, traced across the same eight eras:

     THE CAST — six functional roles (Owners, Organizers,
     Enforcers, Legitimators, Producers, Dependents) that recur
     in every era. We track how concentrated each is at the
     ruling apex (0 = diffuse / rotating / absent, 5 = fused into
     the apex) — i.e. how the roles BUNDLE at the top and SPLIT
     apart below.

     THE MACHINE — the administrative state. How far it reaches
     into an ordinary life (0–5), and how private power taps in.

   The apex-concentration matrix is structured judgement,
   calibrated to the document; certainty degrades going back.
   ============================================================ */

/* ---- the six functional roles ------------------------------ */
window.CM_ROLES = [
  { id: "owners",       label: "Owners",       color: "#c79a4e", role: "Hold the store of value",
    glyph: "M3 21h18M5 21V8l7-5 7 5v13M9 21v-6h6v6" },
  { id: "organizers",   label: "Organizers",   color: "#6f93a8", role: "Coordinate & administer",
    glyph: "M4 19V5m16 14V9M4 12h16M12 5v14" },
  { id: "enforcers",    label: "Enforcers",    color: "#a8553e", role: "Supply coercion",
    glyph: "M12 2l7 3v6c0 5-3 8-7 11-4-3-7-6-7-11V5z" },
  { id: "legitimators", label: "Legitimators", color: "#9079ad", role: "Make it feel just",
    glyph: "M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7zM12 9a3 3 0 100 6 3 3 0 000-6z" },
  { id: "producers",    label: "Producers",    color: "#8a9a5b", role: "Do the work",
    glyph: "M3 21h18M6 21V11m12 10V11M4 11l8-7 8 7" },
  { id: "dependents",   label: "Dependents",   color: "#7d7566", role: "Without a stake",
    glyph: "M12 7a3 3 0 100-6 3 3 0 000 6zM5 22c0-4 3-7 7-7s7 3 7 7" },
];
// display order across the plot, apex roles first
window.CM_STACK = ["owners", "organizers", "enforcers", "legitimators", "producers", "dependents"];

// concentration at/above which a role counts as "in the apex"
window.CM_APEX_THRESHOLD = 3.5;

/* ---- machine-reach word for a 0–5 score -------------------- */
window.cmReachWord = function (v) {
  if (v <= 0) return "No machine";
  if (v < 1.5) return "Embryonic";
  if (v < 2.5) return "Partial";
  if (v < 3.5) return "Shallow";
  if (v < 4.5) return "Deep";
  return "Maximal";
};

/* ---- the eight eras ---------------------------------------- */
/* span: years-before-present (≈2025), used to map the timeline.
   reach: administrative-state strength 0–5.
   roles[id] = { apex: 0–5, note }.
   apexClaim: the era's bundling configuration (the headline).
   reachNote: what the machine could do.
   access: { label, detail } — how private power taps the machine.
   scale / scaleUnit: the scale at which power operated.
   cert: certainty of this era's reconstruction.                 */
window.CM_ERAS = [
  {
    id: "forager", num: "I", accent: "#8a9a5b", cert: "inferred",
    name: "Forager egalitarianism", dates: "to c. 12,000 BCE", place: "Deep prehistory",
    span: { from: 302000, to: 14000 },
    scale: 25, scaleUnit: "a band",
    blurb: "The roles barely exist as distinct slots — which is the whole point. Everyone is a Producer; ownership beyond what one can carry does not exist; organising is ad-hoc and consensual. Enforcement is collective and turned UPWARD — the band coerces any would-be dominator.",
    apexClaim: "No apex. The roles are unbundled and rotating — held briefly, by consent, never accumulating in one person.",
    reach: 0,
    reachNote: "No machine at all. There is no apparatus, no standing office, no record — nothing to reach into a life.",
    access: { label: "None", detail: "Power is personal and capped by the leveling mechanisms — there is no machine to capture." },
    roles: {
      owners:       { apex: 0,   note: "No ownership beyond portable personal goods." },
      organizers:   { apex: 0.3, note: "Whoever knows the ground leads the hunt — then stops leading." },
      enforcers:    { apex: 0.3, note: "Coercion is collective and aimed upward — the band cuts down the upstart." },
      legitimators: { apex: 0.3, note: "The stories told are leveling stories, mocking the boaster." },
      producers:    { apex: 1,   note: "Everyone. There is no one who does not also forage." },
      dependents:   { apex: 0.2, note: "The old, young & sick are kept as members, not a separate underclass." },
    },
  },
  {
    id: "neolithic", num: "II", accent: "#c79a4e", cert: "contested",
    name: "The Neolithic threshold", dates: "12,000 – 4,000 BCE", place: "First settlements",
    span: { from: 14000, to: 6000 },
    scale: 3500, scaleUnit: "a proto-town",
    blurb: "The slots begin to separate. Most people remain Producers; the novel figure is the emergent Owner-Organizer — the aggrandiser or \u201cbig-man\u201d who controls a surplus and throws the debt-creating feast — but he is not yet hereditary or backed by force.",
    apexClaim: "A tentative apex: Owner + Organizer fused in the aggrandiser — not yet hereditary, not yet armed.",
    reach: 1,
    reachNote: "Proto-administration — the first stores, the first reckoning of a feast-debt, the first coordinated labour. Still nothing that can compel a stranger.",
    access: { label: "Control the surplus", detail: "and the debt of the feast. Power is local and personal — it taps obligation, not any machine." },
    roles: {
      owners:       { apex: 2,   note: "The emergent aggrandiser, controlling a surplus." },
      organizers:   { apex: 2,   note: "The \u201cbig-man\u201d who throws the debt-creating feast." },
      enforcers:    { apex: 1,   note: "Still communal; no standing warrior class yet." },
      legitimators: { apex: 1,   note: "Thin & contested — the communal tomb still argues for the collective." },
      producers:    { apex: 2,   note: "Farmers & herders — most people." },
      dependents:   { apex: 1,   note: "The first debt-bondsmen & captives, at the margins." },
    },
  },
  {
    id: "states", num: "III", accent: "#a8553e", cert: "estimated",
    name: "The first states & god-kings", dates: "4,000 – 800 BCE", place: "Mesopotamia · Egypt",
    span: { from: 6000, to: 2800 },
    scale: 50000, scaleUnit: "an early city",
    blurb: "All six roles now exist as distinct, full-time, mostly hereditary slots — this is what \u201cthe state\u201d means. At the apex the god-king fuses Owner + chief Enforcer + chief Legitimator. Below him the roles specialise sharply, and Organizer & Legitimator overlap: the temple is the account-house AND the house of the god.",
    apexClaim: "Maximum bundling: the god-king is Owner + chief Enforcer + chief Legitimator, fused into one.",
    reach: 3,
    reachNote: "The machine is born — writing-as-accountancy, the temple-granary, the corvée. Real reach, but shallow and patchy; and it is OWNED at the top.",
    access: { label: "Be the apex, or serve it", detail: "to be powerful is to be the state; below the apex, scribe-officials tap power by serving it." },
    roles: {
      owners:       { apex: 4,   note: "The god-king — or the god he embodies — owns the land." },
      organizers:   { apex: 3,   note: "Scribe-bureaucrats invent writing to keep the ledgers." },
      enforcers:    { apex: 3,   note: "A standing soldiery." },
      legitimators: { apex: 4,   note: "A literate priesthood — the temple is also the account-house." },
      producers:    { apex: 2,   note: "The peasant mass." },
      dependents:   { apex: 3,   note: "A large structural class of debt-bondsmen & slaves." },
    },
  },
  {
    id: "classical", num: "IV", accent: "#6f93a8", cert: "estimated",
    name: "Classical empires & slavery", dates: "800 BCE – 500 CE", place: "Rome · Han China",
    span: { from: 2800, to: 1525 },
    scale: 60000000, scaleUnit: "an empire",
    blurb: "The apex unbundles somewhat — the emperor is supreme but not literally a god. The Organizer role professionalises and, in Han China, begins to detach from ownership (exam-selected officials). The legions become so central they make and unmake emperors; Legitimators split into priests and jurists.",
    apexClaim: "The apex unbundles — Organizers professionalise and, in the East, detach from Owners.",
    reach: 4,
    reachNote: "Deep & impersonal — censuses (the Han counted ~57 million), codified law, coinage, a salaried officialdom that outlives any official.",
    access: { label: "Own it, farm it, or seize it", detail: "the Senate owns it from within; the publicani farm its revenue; the legions seize it by force." },
    roles: {
      owners:       { apex: 3,   note: "The senatorial & equestrian elite." },
      organizers:   { apex: 3,   note: "A vast administration; in Han China, exam-selected officials." },
      enforcers:    { apex: 4,   note: "The legions — central enough to capture the apex." },
      legitimators: { apex: 3,   note: "Priests AND jurists — Aristotle's \u201cnatural slave\u201d is their work." },
      producers:    { apex: 2,   note: "Free peasants & artisans." },
      dependents:   { apex: 4,   note: "The enslaved — now the economic foundation, not a margin." },
    },
  },
  {
    id: "feudal", num: "V", accent: "#9a7b4e", cert: "estimated",
    name: "Feudal & tributary orders", dates: "500 – 1450 CE", place: "Europe · Japan · Islam",
    span: { from: 1525, to: 575 },
    scale: 1000, scaleUnit: "a manor",
    blurb: "After Rome's western collapse the roles re-bundle violently in the lord — Owner of the manor, Enforcer as armed knight, Organizer of its production and justice, three roles fused in one person locally. The Legitimator role, by contrast, centralises in the Church: a continent-spanning monopoly on the justifying story.",
    apexClaim: "The lord re-fuses Owner + Enforcer + Organizer locally; the Legitimator globalises in the Church.",
    reach: 2,
    reachNote: "In the European west the machine shatters into private hands — the lord's court is his private justice, his dues a private tax, his men a private army. (Islamic & Chinese states stayed strongly central.)",
    access: { label: "Own a fragment outright", detail: "there is no public machine to capture — the machine IS private property, split across thousands of lordships." },
    roles: {
      owners:       { apex: 4,   note: "The lord — Owner of the manor." },
      organizers:   { apex: 3,   note: "The lord again — running the estate & its justice." },
      enforcers:    { apex: 4,   note: "The lord again — the armed, mounted knight." },
      legitimators: { apex: 4,   note: "The Church — monopoly on the justifying story & on literacy." },
      producers:    { apex: 2,   note: "Serfs, bound to the land." },
      dependents:   { apex: 3,   note: "Serfs shading into household slaves where they persisted." },
    },
  },
  {
    id: "mercantile", num: "VI", accent: "#7d8a6f", cert: "estimated",
    name: "Mercantilism & the Atlantic", dates: "1450 – 1800", place: "The Atlantic system",
    span: { from: 575, to: 225 },
    scale: 20000000, scaleUnit: "an empire & its network",
    blurb: "A new kind of Owner-Organizer appears: the joint-stock company, which fuses shareholders (Owner) and directors (Organizer) into one immortal legal person — then is granted Enforcer powers and quasi-sovereignty. For the first time the bundle is held not by a person but by an abstraction, so responsibility disperses.",
    apexClaim: "The Owner-Organizer-Enforcer bundle migrates from a person to the corporation.",
    reach: 3,
    reachNote: "A dual machine — the absolutist state rebuilds a central administration, while the chartered company runs a private copy of it, with its own bureaucracy, army and courts.",
    access: { label: "Secure a charter", detail: "a licensed private copy of state power — the grant to tax, rule, monopolise trade and wage war." },
    roles: {
      owners:       { apex: 4,   note: "Shareholders of the joint-stock company." },
      organizers:   { apex: 3,   note: "Its directors & factors — fused with ownership in one legal person." },
      enforcers:    { apex: 3,   note: "The company's own armies & fleets." },
      legitimators: { apex: 3,   note: "A dark new product — the manufactured ideology of race." },
      producers:    { apex: 2,   note: "Wage labour in the metropole." },
      dependents:   { apex: 4,   note: "The racialised enslaved — heritable, maximised, made uncrossable." },
    },
  },
  {
    id: "industrial", num: "VII", accent: "#9a6f6a", cert: "measured",
    name: "Industrial capitalism", dates: "1800 – 1970", place: "The nation-state",
    span: { from: 225, to: 55 },
    scale: 100000000, scaleUnit: "a nation-state",
    blurb: "The roles reach their most specialised configuration in history. Ownership (capital) and Organization (management) formally split — the salaried manager who runs a firm he does not own. The Organizer class balloons; Enforcers are nationalised; the Producer is legally free, concentrated in factories — and therefore, for the first time, able to organise.",
    apexClaim: "The most unbundled ever — Owner and Organizer formally split; the Producer is legally free.",
    reach: 5,
    reachNote: "Maximal reach into every individual life — census, passport, compulsory schooling, conscription, income tax, police, the registry. And the fight over WHO controls it becomes the central politics of the age.",
    access: { label: "Lobby, finance, revolve", detail: "the revolving door between corporate and official posts — contested, for a few decades, by mass democratic capture from below." },
    roles: {
      owners:       { apex: 3,   note: "Capital — owners of factories, finance and land." },
      organizers:   { apex: 3,   note: "A vast new salaried middle class — managers, clerks, engineers." },
      enforcers:    { apex: 2,   note: "Professionalised & nationalised — the state's, not private hands." },
      legitimators: { apex: 2,   note: "Secularised & spread — press, universities, advertising, nationalism." },
      producers:    { apex: 3,   note: "The industrial working class — legally free, and able to organise." },
      dependents:   { apex: 2,   note: "A shrinking legal category — slavery abolished, serfdom gone." },
    },
  },
  {
    id: "present", num: "VIII", accent: "#8a7da0", cert: "measured",
    name: "The present", dates: "1970 – now", place: "A networked planet",
    span: { from: 55, to: 0 },
    scale: 8000000000, scaleUnit: "a networked planet",
    blurb: "Paradoxical: roles are at once more dispersed (across a global supply chain) and re-fusing at the top. Ownership re-concentrates and re-merges with Organization through founder-owners; the Organizer role migrates into algorithms; and a genuinely new universal Dependency appears — everyone as a data-subject.",
    apexClaim: "The apex re-fuses — own the firm, run the firm, own the press that explains why you should.",
    reach: 5,
    reachNote: "Maximal & digitally enhanced — but functionally privatised: its functions contracted out, its officials funded from above, and a second private machine (the platforms) running alongside it.",
    access: { label: "Privatise & capture", detail: "contract out its functions, fund its officials directly, and run a private platform machine alongside it." },
    roles: {
      owners:       { apex: 4,   note: "Re-concentrated — inherited wealth & the billionaire class." },
      organizers:   { apex: 4,   note: "Re-merging with ownership — and migrating into algorithms." },
      enforcers:    { apex: 2,   note: "Mostly the state, plus \u201csoft\u201d enforcement — deactivation, the credit score." },
      legitimators: { apex: 3,   note: "Media conglomerates (often apex-owned) & the meritocratic story." },
      producers:    { apex: 2,   note: "The global workforce — including the gig worker, stripped of protection." },
      dependents:   { apex: 3,   note: "The platform-precarious — and everyone, now, as a data-subject." },
    },
  },
];

/* ---- map a years-ago value to its era --------------------- */
window.cmAt = function (ya) {
  var E = window.CM_ERAS;
  for (var i = 0; i < E.length; i++) {
    if (ya <= E[i].span.from && ya > E[i].span.to) return E[i];
  }
  return ya > E[0].span.to ? E[0] : E[E.length - 1];
};
window.cmEraIndex = function (id) { return window.CM_ERAS.findIndex(function (e) { return e.id === id; }); };

/* per-role apex series across all eras (for the sparklines) */
window.cmSeries = function (roleId) {
  return window.CM_ERAS.map(function (e) { return e.roles[roleId].apex; });
};
