/* ============================================================
   app.jsx — The Human Journey (React UI over the canvas globe)
   ============================================================ */
const { useState, useEffect, useRef, useCallback } = React;

const TIME = window.TIME;
const RELIGIONS = window.RELIGIONS;
const CHAPTERS = window.CHAPTERS;

// ---- log time mapping --------------------------------------
const L0 = Math.log(TIME.start), L1 = Math.log(TIME.end);
const posToYa = (p) => Math.exp(L0 + (L1 - L0) * p);
const yaToPos = (ya) => (Math.log(ya) - L0) / (L1 - L0);
const logLerp = (a, b, t) => Math.exp(Math.log(a) + (Math.log(b) - Math.log(a)) * t);

// Play pace envelope: hold a steady half speed across the migration & first-
// farming era (~70,000–9,500 ya) so it reads at a consistent, unhurried pace,
// easing smoothly in (older) and out (recent) so the rate never jumps.
function migrationPace(ya) {
  const slow = 0.5;
  const smooth = (t) => { t = Math.max(0, Math.min(1, t)); return t * t * (3 - 2 * t); };
  let k; // 0 → slow, 1 → normal speed
  if (ya >= 9500 && ya <= 70000) k = 0;
  else if (ya > 70000) k = smooth((ya - 70000) / 25000);  // ease to normal by ~95,000 ya
  else k = smooth((9500 - ya) / 5000);                    // ease to normal by ~4,500 ya
  return slow + (1 - slow) * k;
}

const fmt = (n) => Math.round(n).toLocaleString("en-US");
function fmtPop(n) {
  if (n >= 1e9) { const v = n / 1e9; return (v >= 10 ? Math.round(v) : v.toFixed(1).replace(/\.0$/, "")) + " billion"; }
  if (n >= 1e6) { const v = n / 1e6; return (v >= 10 ? Math.round(v) : v.toFixed(1).replace(/\.0$/, "")) + " million"; }
  if (n >= 1e3) return (Math.round(n / 1000) * 1000).toLocaleString("en-US");
  return Math.round(n).toLocaleString("en-US");
}
function roundYa(ya) {
  if (ya >= 100000) return Math.round(ya / 10000) * 10000;
  if (ya >= 10000) return Math.round(ya / 1000) * 1000;
  if (ya >= 1000) return Math.round(ya / 100) * 100;
  return Math.round(ya / 10) * 10;
}
function epochLabel(ya, tl) {
  const e = (tl || window.I18N.en).epochs;
  if (ya >= 12000) return e.palaeolithic;
  if (ya >= 5200) return e.neolithic;
  if (ya >= 3200) return e.bronze;
  if (ya >= 1500) return e.iron;
  return e.ce;
}
function calendarLabel(ya, tl) {
  const era = (tl || window.I18N.en).era;
  const yr = 2025 - ya;
  if (ya > 12000) return null;
  if (yr < 0) {
    const v = Math.round(-yr / (ya > 3000 ? 100 : 10)) * (ya > 3000 ? 100 : 10);
    return `≈ ${v} ${era.bce}`;
  }
  return `≈ ${Math.round(yr / 10) * 10} ${era.ce}`;
}

// ---- story keyframes (≈5 minutes, wide framing) -----------
const STORY = [
  { dur: 11, ya: 300000, yaTo: 270000, coord: [34, 6],   zoom: 1.5,  kicker: "≈ 300,000 years ago · Africa", body: "A new kind of human takes shape — Homo sapiens. Not in one cradle but across the whole continent at once — the pan-African origin: an interconnected web of populations, from Morocco to Ethiopia to the Cape, slowly blending into us." },
  { dur: 12, ya: 270000, yaTo: 200000, coord: [20, 2],   zoom: 1.35, kicker: "The African homeland", body: "For thousands of generations they spread across the continent alone — from the Cape to the Sahara — mastering fire, tools, and language." },
  { dur: 12, ya: 200000, yaTo: 122000, coord: [24, 0],   zoom: 1.3,  kicker: "≈ 200,000 years ago", body: "They bury their dead, paint their bodies with ochre, and begin to sense spirits in animals, rivers, and stone — the dawn of animism." },
  { dur: 11, ya: 120000, yaTo: 74000,  coord: [40, 20],  zoom: 1.4,  kicker: "First steps beyond", body: "Early bands wander north into the Levant. But the world beyond Africa is harsh, and these first ventures fade away." },
  { dur: 12, ya: 73000,  yaTo: 63000,  coord: [46, 16],  zoom: 1.4,  kicker: "≈ 70,000 years ago · Out of Africa", body: "At last a small population crosses the narrow mouth of the Red Sea. Almost everyone alive outside Africa today descends from this single journey." },
  { dur: 11, ya: 62000,  yaTo: 55000,  coord: [78, 18],  zoom: 1.35, kicker: "The coastal road", body: "Hugging the shores of Arabia and India, they move east with astonishing speed, living on the riches of the sea." },
  { dur: 14, ya: 55000,  yaTo: 48000,  coord: [125, -12],zoom: 1.3,  kicker: "≈ 55,000 years ago · Sahul", body: "Crossing open ocean — the first humans ever to do so — they reach Australia, and bind themselves to the land through totems and the Dreaming." },
  { dur: 12, ya: 48000,  yaTo: 42000,  coord: [22, 46],  zoom: 1.4,  kicker: "≈ 45,000 years ago · Europe", body: "Others turn north into Ice-Age Europe. In the dark of painted caves, shamans enter trance to walk between the living and the spirit world." },
  { dur: 11, ya: 42000,  yaTo: 36000,  coord: [100, 40], zoom: 1.35, kicker: "Across Asia", body: "From the western steppes to the Pacific, humans fill the vast heart of Asia, reaching China and the edge of the northern ice." },
  { dur: 11, ya: 34000,  yaTo: 24000,  coord: [108, 58], zoom: 1.3,  kicker: "The frozen north", body: "Through the depths of the last Ice Age, hardy hunters press into Siberia, clothed in tailored furs against the killing cold." },
  { dur: 12, ya: 22000,  yaTo: 17000,  coord: [-165, 64],zoom: 1.3,  kicker: "≈ 20,000 years ago · Beringia", body: "So much water is locked in ice that a land bridge joins Asia to America. Hunters walk across into an entirely empty New World." },
  { dur: 11, ya: 16000,  yaTo: 13500,  coord: [-90, 12], zoom: 0.92, focusRel: "totemism", kicker: "Into the Americas", body: "From Alaska to the Andes, two great continents open before them. They spread down the New World with breathtaking speed — the last great landmass to feel a human footprint." },
  { dur: 12, ya: 13500,  yaTo: 12000,  coord: [-62, -20],zoom: 1.4,  focusRel: "totemism", kicker: "≈ 13,000 years ago", body: "Within a few thousand years they reach the southern tip of South America. Humanity has now touched every habitable continent." },
  { dur: 12, ya: 12000,  yaTo: 10800,  coord: [40, 34],  zoom: 1.5,  kicker: "The end of the Ice Age", body: "As the world warms, people in the Fertile Crescent linger by fields of wild grain — and begin, for the first time, to stay in one place." },
  { dur: 13, ya: 11000,  yaTo: 9600,   coord: [39, 37],  zoom: 1.6,  kicker: "≈ 11,000 years ago · Göbekli Tepe", body: "Before farming, before cities, they raise great carved pillars over their dead. The ancestors become guardians of the living." },
  { dur: 12, ya: 9500,   yaTo: 6000,   coord: [44, 32],  zoom: 1.4, push: 0.34, kicker: "The first farmers", body: "Wheat, barley, sheep, and cattle are tamed. A tended field feeds far more mouths than the hunt — so people stop wandering and settle beside their crops. The first permanent villages take root." },
  { dur: 13, ya: 5500,   yaTo: 4600,   coord: [44, 32],  zoom: 1.6,  kicker: "≈ 3300 BCE · Sumer", body: "Stored grain now feeds those who never farm — scribes, priests, soldiers, kings. In Mesopotamia the swollen villages become the first true cities, crowned with vast pantheons of gods." },
  { dur: 12, ya: 4600,   yaTo: 3600,   coord: [34, 28],  zoom: 1.4, push: 0.34, kicker: "Gods of the river kingdoms", body: "Along the Nile and the Indus, temples become the engines of the state, and a literate priesthood writes the will of the gods into the world." },
  { dur: 12, ya: 3400,   yaTo: 3050,   coord: [32, 28],  zoom: 1.42, push: 0.32, kicker: "≈ 1350 BCE · Egypt", body: "The pharaoh Akhenaten exalts a single sun-god above all the rest — a brief, radical step toward worshipping one god alone." },
  { dur: 12, ya: 3000,   yaTo: 2650,   coord: [52, 33],  zoom: 1.5,  kicker: "≈ 1000 BCE · Persia", body: "In Iran, the prophet Zarathustra reframes the cosmos as a struggle between good and evil — a dualism that will echo for millennia." },
  { dur: 12, ya: 2650,   yaTo: 2350,   coord: [35, 32],  zoom: 1.6,  kicker: "≈ 600 BCE · Judah", body: "In exile in Babylon, the people of Judah declare their god the one creator of all things — the first enduring monotheism." },
  { dur: 12, ya: 2500,   yaTo: 2000,   coord: [22, 38],  zoom: 1.4,  kicker: "≈ 500 BCE · The Mediterranean", body: "Around the Mediterranean, Greece and Rome make their gods into citizens — patrons of cities, festivals, and games, worshipped as public duty." },
  { dur: 12, ya: 2000,   yaTo: 1500,   coord: [34, 33],  zoom: 1.4,  kicker: "≈ 1st–4th century CE · Christianity", body: "From the eastern Mediterranean, Christianity carries the one-God idea across the Roman world — and, in time, far beyond it." },
  { dur: 13, ya: 1450,   yaTo: 1000,   coord: [54, 27],  zoom: 1.25, kicker: "≈ 7th century CE · Islam", body: "In Arabia, Islam arises and spreads with extraordinary speed — west to Spain and across the Sahara, and east to the Indus and the Swahili coast." },
  { dur: 11, ya: 1000,   yaTo: 880,    coord: [126, -2],  zoom: 1.15, flyMs: 2300, kicker: "The last great voyage", body: "Far to the east, in the warm seas of island Southeast Asia, the finest navigators who ever lived set out into the open Pacific — the last great human migration begins." },
  { dur: 11, ya: 880,    yaTo: 760,    coord: [-158, -16],zoom: 0.98, flyMs: 2300, kicker: "Across the remotest ocean", body: "Reading swell, star, and bird, they leap from island to island across thousands of miles of empty sea — settling the last scattered specks of land on Earth." },
  { dur: 12, ya: 760,    yaTo: 660,    coord: [177, -39], zoom: 0.95, flyMs: 1800, kicker: "Aotearoa · the last land", body: "Their final voyage carries them south to New Zealand — the last great landmass on Earth that human beings would ever reach." },
  { dur: 13, ya: 640,    yaTo: 220,    coord: [-42, 16],  zoom: 0.92, flyMs: 3000, kicker: "≈ 1500 CE · A world entwined", body: "Ships bind the continents at last. Europeans cross the open oceans, and people, crops, and gods move between worlds as never before — Christianity following empire and trade into the Americas and across Africa." },
  { dur: 12, ya: 220,    yaTo: 1,      coord: [54, 22],  zoom: 0.9, coordFrom: [-42, 16], zoomFrom: 0.92, kicker: "Today", body: "In barely two centuries humanity surges from one billion to eight. From a single African beginning, our species now fills the planet — every habitable continent inhabited, carrying the whole long inheritance of belief from the first spirits to one exclusive deity." },
];
const STORY_TOTAL = STORY.reduce((s, k) => s + k.dur, 0);

// Map a year-ago value to a position within the Story (segment index + local
// progress 0..1). Lets Play reuse the film's keyframes, captions and pacing
// while staying driven by the timeline's `ya`.
function storyPosForYa(ya) {
  for (let i = 0; i < STORY.length; i++) {
    const s = STORY[i];
    if (ya >= s.yaTo) {
      if (ya >= s.ya) return { i, local: 0 };
      return { i, local: Math.max(0, Math.min(1, (s.ya - ya) / (s.ya - s.yaTo))) };
    }
  }
  return { i: STORY.length - 1, local: 1 };
}

// Step a year-ago value forward/back by a whole number of film frames, using the
// exact pacing the autoplay uses (per-segment duration + sin-ease over a log
// interpolation). Inverts ya -> eased local, advances by frames, converts back —
// so the arrow keys move one frame at a time, identical to playback.
const STORY_FRAME_DT = 1 / 30; // seconds of film advanced per frame
function advanceFrames(ya, frames) {
  let i = storyPosForYa(ya).i;
  const toLocal = (seg, y) => {
    const T = (Math.log(seg.ya) - Math.log(y)) / (Math.log(seg.ya) - Math.log(seg.yaTo));
    return Math.acos(1 - 2 * Math.max(0, Math.min(1, T))) / Math.PI; // inverse sin-ease
  };
  let local = toLocal(STORY[i], ya);
  const dir = frames < 0 ? -1 : 1;
  const n = Math.abs(frames);
  for (let s = 0; s < n; s++) {
    local += dir * STORY_FRAME_DT / STORY[i].dur;
    while (local >= 1 && i < STORY.length - 1) { local -= 1; i++; }
    while (local < 0 && i > 0) { i--; local += 1; }
    if (i === 0 && local < 0) { local = 0; break; }
    if (i === STORY.length - 1 && local > 1) { local = 1; break; }
  }
  const seg = STORY[i];
  return logLerp(seg.ya, seg.yaTo, d3.easeSinInOut(Math.max(0, Math.min(1, local))));
}

// speed control — selects a playback rate for Play & the film
function SpeedControl({ speed, setSpeed, dark }) {
  const RATES = [0.5, 1, 2, 4];
  return (
    <div className={"speed-ctrl" + (dark ? " dark" : "")}>
      <span className="sp-ic" title="Playback speed">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
          <path d="M13 2 4 14h7l-1 8 9-12h-7z" /></svg>
      </span>
      {RATES.map((r) => (
        <button key={r} className={"sp-btn" + (speed === r ? " on" : "")} onClick={() => setSpeed(r)}>
          {r + "×"}
        </button>
      ))}
    </div>
  );
}

// camera keyframes for Play, ya descending. Play is a single slow EASTWARD
// rotation, so its deep-time keyframes only ever increase in longitude —
// following the migration out of Africa, across Asia, into Australia and the
// Pacific, over the Beringian bridge to the Americas and round to the Old
// World again. (The story/video still cuts west to Ice-Age Europe; Play does
// not, so the globe never swivels back west mid-rotation.) Through the religion
// era (≈7000→1000 ya) Play uses its own progressively-widening frame to take in
// all of Afro-Eurasia as the faiths fan out.
const CAM = [
  // — deep time: one continuous eastward sweep (longitude only increases); from
  //   the Sahul through the Americas the latitude is held near ~25°N so the
  //   camera only rotates east — no north-south panning — and Australia (low in
  //   frame) and then all of the Americas stay in view —
  { ya: 300000, coord: [28, 8],   zoom: 1.5 },
  { ya: 200000, coord: [30, 4],   zoom: 1.42 },
  { ya: 120000, coord: [44, 16],  zoom: 1.4 },
  { ya: 73000,  coord: [55, 18],  zoom: 1.4 },   // Out of Africa
  { ya: 62000,  coord: [80, 18],  zoom: 1.32 },  // South Asia
  { ya: 54000,  coord: [106, 18], zoom: 1.22 },  // Southeast Asia
  { ya: 48000,  coord: [128, 22], zoom: 1.18 },  // Sahul / Australia low in frame; latitude settles to ~25°N
  { ya: 42000,  coord: [150, 25], zoom: 1.12 },  // east across the Pacific rim, holding ~25°N
  { ya: 34000,  coord: [173, 25], zoom: 1.08 },  // the far north-east
  { ya: 22000,  coord: [-165, 25],zoom: 1.05 },  // Beringia high in frame — no northward pan
  { ya: 16000,  coord: [-112, 25],zoom: 1.0 },   // into the Americas
  { ya: 13500,  coord: [-74, 23], zoom: 1.05 },  // down through the Americas
  { ya: 12000,  coord: [40, 30],  zoom: 1.35 },  // round to the Old World (eastward across the Atlantic)
  // — religion era: zoom out steadily as belief spreads across the Old World —
  { ya: 9500, coord: [42, 33],  zoom: 1.30 }, // first farmers / first villages
  { ya: 7000, coord: [40, 31],  zoom: 1.16 }, // towns thicken across the Fertile Crescent
  { ya: 5000, coord: [50, 30],  zoom: 0.95 }, // first cities: Egypt & Mesopotamia, reaching to the Indus
  { ya: 3300, coord: [60, 30],  zoom: 0.86 }, // gods of the first cities span Africa to Asia — Egypt, Sumer, the Indus & China
  { ya: 2600, coord: [33, 33],  zoom: 0.96 }, // dualism, civic gods, monotheism crystallises
  { ya: 2100, coord: [27, 34],  zoom: 0.93 }, // Greece→Rome; Christianity begins to move
  { ya: 1500, coord: [25, 30],  zoom: 0.90 }, // Christianity into Europe; Islam emerges
  { ya: 1000, coord: [34, 22],  zoom: 0.88 }, // widest: Islam across Sahel/Swahili/S Asia
  // — late: follow the action to its last frontiers —
  { ya: 850,  coord: [-150, -12], zoom: 1.20 }, // remote Pacific settled
  { ya: 545,  coord: [-72, 8],    zoom: 1.05 }, // Christianity into the Americas
  { ya: 470,  coord: [12, 16],    zoom: 1.12 }, // today
];
function camForYa(ya) {
  if (ya >= CAM[0].ya) return CAM[0];
  if (ya <= CAM[CAM.length - 1].ya) return CAM[CAM.length - 1];
  for (let i = 0; i < CAM.length - 1; i++) {
    const a = CAM[i], b = CAM[i + 1];
    if (ya <= a.ya && ya >= b.ya) {
      const t = d3.easeSinInOut((a.ya - ya) / (a.ya - b.ya));
      const c = d3.geoInterpolate(a.coord, b.coord)(t);
      return { coord: c, zoom: a.zoom + (b.zoom - a.zoom) * t };
    }
  }
  return CAM[CAM.length - 1];
}
// step a rotation angle a fraction of the way toward target (wrap-aware for lon)
function approachAngle(cur, target, k) {
  let d = target - cur;
  while (d > 180) d -= 360;
  while (d < -180) d += 360;
  return cur + d * k;
}

// ---- population graph (log–log curve with a live marker) ----
function PopGraph({ ya, variant, logScale, onToggle, dragProps, title, compact }) {
  const W = compact ? 112 : 236, H = compact ? 38 : 110;
  const PADL = compact ? 3 : 32, PADR = compact ? 3 : 10, PADT = compact ? 5 : 12, PADB = compact ? 5 : 26;
  const MAXP = 8.2e9, START = window.TIME.start;
  const plotW = W - PADL - PADR, plotH = H - PADT - PADB;
  const lpmin = Math.log(1e4), lpmax = Math.log(1e10);
  const ltmin = Math.log(1), ltmax = Math.log(START);
  const xf = (ya2) => logScale
    ? PADL + ((ltmax - Math.log(Math.max(ya2, 1))) / (ltmax - ltmin)) * plotW
    : PADL + ((START - ya2) / START) * plotW;
  const y = (pop) => logScale
    ? H - PADB - ((Math.log(Math.max(pop, 1e4)) - lpmin) / (lpmax - lpmin)) * plotH
    : H - PADB - Math.max(0, Math.min(1, pop / MAXP)) * plotH;
  const path = React.useMemo(() => {
    const pts = [];
    const N = 240;
    for (let i = 0; i <= N; i++) {
      const ya2 = START * (1 - i / N);
      pts.push({ x: xf(ya2), y: y(window.popAt(ya2)) });
    }
    let d = "";
    for (let i = 0; i < pts.length; i++) d += (i === 0 ? "M" : "L") + pts[i].x.toFixed(1) + " " + pts[i].y.toFixed(1) + " ";
    const a = d + "L" + xf(0).toFixed(1) + " " + (H - PADB) + " L" + xf(START).toFixed(1) + " " + (H - PADB) + " Z";
    return { line: d, area: a, pts };
  }, [logScale]);
  const ygrids = logScale
    ? [{ p: 1e4, l: "10K" }, { p: 1e6, l: "1M" }, { p: 1e8, l: "100M" }, { p: 1e10, l: "10B" }]
    : [{ p: 0, l: "0" }, { p: 2e9, l: "2B" }, { p: 4e9, l: "4B" }, { p: 6e9, l: "6B" }, { p: 8e9, l: "8B" }];
  const xgrids = logScale
    ? [{ ya: 300000, l: "300ka" }, { ya: 10000, l: "10ka" }, { ya: 100, l: "100" }, { ya: 1, l: "now" }]
    : [{ ya: 300000, l: "300ka" }, { ya: 200000, l: "200ka" }, { ya: 100000, l: "100ka" }, { ya: 1, l: "now" }];
  // place the marker exactly on the drawn polyline. Points are evenly spaced in
  // ya but NOT in x under a log axis, so locate the segment by actual x position
  // (monotonic) rather than assuming even spacing.
  const cx = xf(ya);
  const pts = path.pts;
  let seg = pts.length - 2;
  for (let i = 0; i < pts.length - 1; i++) {
    if (cx <= pts[i + 1].x) { seg = i; break; }
  }
  seg = Math.max(0, Math.min(pts.length - 2, seg));
  const segFrac = Math.max(0, Math.min(1, (cx - pts[seg].x) / ((pts[seg + 1].x - pts[seg].x) || 1)));
  const cy = pts[seg].y + (pts[seg + 1].y - pts[seg].y) * segFrac;
  return (
    <div className={"pop-graph " + variant + (compact ? " compact" : "") + (dragProps ? " draggable" : "")} {...(dragProps || {})}>
      {!compact && <div className="pg-head">
        <p className="pg-title">{title || "Human population"}</p>
        {onToggle && (
          <button className="pg-scale" onClick={onToggle} title="Toggle axis scale">
            <span className={logScale ? "" : "on"}>LIN</span>
            <span className={logScale ? "on" : ""}>LOG</span>
          </button>
        )}
        {!onToggle && <span className="pg-scale-label">{logScale ? "log" : "linear"}</span>}
      </div>}
      <svg viewBox={`0 0 ${W} ${H}`} width={W} height={H}>
        {!compact && ygrids.map((g) => (
          <g key={g.l}>
            <line x1={PADL} x2={W - PADR} y1={y(g.p)} y2={y(g.p)} className="pg-grid" />
            <text x={PADL - 5} y={y(g.p) + 3} className="pg-axislabel" textAnchor="end">{g.l}</text>
          </g>
        ))}
        {!compact && xgrids.map((g) => (
          <text key={g.l} x={xf(g.ya)} y={H - PADB + 11} className="pg-axislabel" textAnchor="middle">{g.l}</text>
        ))}
        <path d={path.area} className="pg-area" />
        <path d={path.line} className="pg-line" />
        <line x1={cx} x2={cx} y1={PADT - 2} y2={H - PADB} className="pg-marker" />
        <circle cx={cx} cy={cy} r="3.5" className="pg-dot" />
      </svg>
    </div>
  );
}

// ---- icons --------------------------------------------------
const Ico = {
  play: <svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>,
  pause: <svg viewBox="0 0 24 24" fill="currentColor"><path d="M6 5h4v14H6zM14 5h4v14h-4z"/></svg>,
  film: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><rect x="3" y="4" width="18" height="16" rx="2"/><path d="M3 9h18M3 15h18M8 4v16M16 4v16"/></svg>,
  x: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 6l12 12M18 6L6 18"/></svg>,
  replay: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M4 4v6h6"/><path d="M4 10a8 8 0 1 1-1.5 5"/></svg>,
};

// makes a fixed-position panel draggable; remembers its offset in localStorage
function useDraggable(key, centerX) {
  const load = () => { try { return JSON.parse(localStorage.getItem("hj-pos-" + key)) || { x: 0, y: 0 }; } catch (e) { return { x: 0, y: 0 }; } };
  const [off, setOff] = React.useState(load);
  const offRef = React.useRef(off); offRef.current = off;
  const onPointerDown = (e) => {
    if (e.target.closest("button, input, select, a, .tl-track, .pg-scale, .speed-ctrl, .leg-item, .lb-row, .gt-row")) return;
    e.preventDefault();
    const sx = e.clientX, sy = e.clientY, base = { ...offRef.current };
    const move = (ev) => setOff({ x: base.x + (ev.clientX - sx), y: base.y + (ev.clientY - sy) });
    const up = () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
      try { localStorage.setItem("hj-pos-" + key, JSON.stringify(offRef.current)); } catch (e) {}
    };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
  };
  const transform = centerX
    ? `translate(calc(-50% + ${off.x}px), ${off.y}px)`
    : `translate(${off.x}px, ${off.y}px)`;
  return { onPointerDown, style: { transform } };
}

function App() {
  const [t, setTweak] = useTweaks(window.TWEAK_DEFAULTS);
  const [ya, setYa] = useState(TIME.start);
  const [active, setActive] = useState(() => new Set(RELIGIONS.map((r) => r.id)));
  const [pinned, setPinned] = useState(null);
  const [aboutOpen, setAboutOpen] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [lang, setLang] = useState(() => { try { return localStorage.getItem("hj-lang") || "en"; } catch (e) { return "en"; } });
  useEffect(() => { try { localStorage.setItem("hj-lang", lang); } catch (e) {} }, [lang]);
  const TL = window.I18N[lang] || window.I18N.en;
  const EN = window.I18N.en;
  const ui = (k) => (TL.ui && TL.ui[k] != null) ? TL.ui[k] : EN.ui[k];
  const locStory = (s, i) => { const x = TL.story && TL.story[i]; return x ? { ...s, kicker: x.k, body: x.b } : s; };
  const locRel = (r) => { const x = TL.religions && TL.religions[r.id]; return x ? { ...r, name: x.name, blurb: x.blurb, examples: x.examples, when: x.when } : r; };
  const [exploring, setExploring] = useState(false); // explore autoplay
  const [story, setStory] = useState(false);
  const [storyPlaying, setStoryPlaying] = useState(false);
  const [storyElapsed, setStoryElapsed] = useState(0);
  const [showTitle, setShowTitle] = useState(false);
  const [hintGone, setHintGone] = useState(false);
  const [layers, setLayers] = useState({ settlement: true, migration: true, religion: true, population: true, ice: true });
  const [graphLog, setGraphLog] = useState(false);
  const [speed, setSpeed] = useState(1);
  const speedRef = useRef(1); speedRef.current = speed;
  // draggable panels (Play mode)
  const dragReader = useDraggable("reader", false);
  const dragLegend = useDraggable("legend", false);
  const dragLayers = useDraggable("layers", true);
  const dragGlobe = useDraggable("globe", false);
  const dragGraph = useDraggable("graph", false);
  const dragTimeline = useDraggable("timeline", true);
  const dragMast = useDraggable("masthead", false);

  const globeRef = useRef(null);
  const canvasRef = useRef(null);
  const yaRef = useRef(ya);
  yaRef.current = ya;

  // init globe
  useEffect(() => {
    const g = new window.Globe(canvasRef.current);
    globeRef.current = g;
    window.__globe = g;
    g.onInteract = () => setHintGone(true);
    g.load();
    return () => {};
  }, []);

  // push state -> globe
  useEffect(() => { globeRef.current && globeRef.current.setTime(ya); }, [ya]);
  useEffect(() => { globeRef.current && globeRef.current.setReligions(active); }, [active]);
  useEffect(() => { globeRef.current && globeRef.current.setTheme(t.globeTheme); }, [t.globeTheme]);
  useEffect(() => { globeRef.current && globeRef.current.setIdleSpin(t.idleSpin && !story && !exploring); }, [t.idleSpin, story, exploring]);
  // layer visibility — during the film all layers show; in explore they follow the on-page Layers box
  useEffect(() => {
    const g = globeRef.current; if (!g) return;
    if (story) { g.setLayer("showRegion", true); g.setLayer("showRoutes", true); g.setLayer("showReligion", true); g.setLayer("showPopBars", true); g.setLayer("showIce", true); }
    else { g.setLayer("showRegion", layers.settlement); g.setLayer("showRoutes", layers.migration); g.setLayer("showReligion", layers.religion); g.setLayer("showPopBars", layers.population); g.setLayer("showIce", layers.ice); }
  }, [layers, story]);

  // Play autoplay — step through the Watch-the-Story keyframes so Play shares
  // the film's pacing. `ya` stays the source of truth; camera + caption derive
  // from it (below), so scrubbing the timeline stays in sync.
  useEffect(() => {
    if (!exploring) return;
    const g = globeRef.current;
    if (g) g._anim = null;
    let pos = storyPosForYa(yaRef.current);
    let last = performance.now();
    const id = setInterval(() => {
      const now = performance.now();
      const dt = (now - last) / 1000; last = now;
      let seg = STORY[pos.i];
      pos.local += (dt * speedRef.current) / seg.dur;
      while (pos.local >= 1 && pos.i < STORY.length - 1) { pos.local -= 1; pos.i += 1; }
      if (pos.i >= STORY.length - 1 && pos.local >= 1) { pos.local = 1; setExploring(false); }
      seg = STORY[pos.i];
      setYa(logLerp(seg.ya, seg.yaTo, d3.easeSinInOut(Math.min(1, pos.local))));
    }, 33);
    return () => clearInterval(id);
  }, [exploring]);

  // Auto-scroll the Forms of Belief list so the newest-arrived faith stays in
  // view — as religions emerge over time the box follows the action down.
  // (CSS smooth-scroll fails inside the zoomed wrapper, so tween by hand.)
  useEffect(() => {
    const el = document.querySelector(".legend");
    if (!el) return;
    const liveR = RELIGIONS.filter((r) => ya <= r.from && ya >= r.to);
    if (!liveR.length) return;
    const latest = liveR.reduce((a, b) => (b.from < a.from ? b : a));
    const item = el.querySelector(`[data-rel="${latest.id}"]`);
    if (!item) return;
    const top = item.offsetTop, bottom = top + item.offsetHeight, margin = 16;
    const viewTop = el.scrollTop, viewBottom = viewTop + el.clientHeight;
    let target = null;
    if (bottom > viewBottom - margin) target = bottom - el.clientHeight + margin;
    else if (top < viewTop + margin) target = top - margin;
    if (target == null) return;
    target = Math.max(0, Math.min(el.scrollHeight - el.clientHeight, target));
    const start = el.scrollTop, dist = target - start;
    if (Math.abs(dist) < 1) return;
    const t0 = performance.now(), dur = 380;
    let raf;
    const step = (now) => {
      const k = Math.min(1, (now - t0) / dur);
      const e = k < 0.5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2;
      el.scrollTop = start + dist * e;
      if (k < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [ya]);

  // Play camera — glide to the Story keyframe for the current segment (whether
  // auto-playing or scrubbing), mirroring the film's camera moves & framing.
  const lastPlaySegRef = useRef(-1);
  useEffect(() => {
    if (story) { lastPlaySegRef.current = -1; return; }
    const g = globeRef.current;
    if (!g) return;
    const pos = storyPosForYa(ya);
    const i = pos.i;
    const seg = STORY[i];
    if (i !== lastPlaySegRef.current) {
      lastPlaySegRef.current = i;
      if (!seg.coordFrom) g.flyTo(seg.coord, seg.zoom, seg.flyMs || 1500, seg.spin || 0);
    }
    if (seg.coordFrom) {
      // Continuous pan from coordFrom -> coord across the whole segment, tied to
      // the timeline — turns a long camera leap (e.g. the Americas back to the
      // Old World at the close) into one smooth glide at any playback speed.
      const e = d3.easeSinInOut(Math.max(0, Math.min(1, pos.local)));
      const c = d3.geoInterpolate(seg.coordFrom, seg.coord)(e);
      const z0 = seg.zoomFrom != null ? seg.zoomFrom : seg.zoom;
      g._anim = null;
      g.rotate = [-c[0], -c[1], 0];
      g.zoom = z0 + (seg.zoom - z0) * e;
      g._dirty = true;
    } else if (seg.push && !g._anim) {
      // Continuous push-in across the segment, tied to timeline progress. Gives
      // otherwise-static beats (e.g. the first farmers) visible motion that draws
      // the eye to what is actually changing — the swelling population bars.
      const e = d3.easeSinInOut(Math.max(0, Math.min(1, pos.local)));
      g.zoom = seg.zoom + seg.push * e;
      g._dirty = true;
    }
  }, [ya, story]);

  // ---- story engine -----------------------------------------
  const startStory = useCallback(() => {
    setExploring(false);
    setStory(true); setShowTitle(true);
    setStoryElapsed(0); setStoryPlaying(false);
    const g = globeRef.current;
    g.setReligions(new Set(RELIGIONS.map((r) => r.id)));
    g.setTheme(t.globeTheme);           // lock the chosen globe type for the whole film
    g.setIdleSpin(false);
    g.flyTo(STORY[0].coord, STORY[0].zoom, 1400);
    setYa(STORY[0].ya);
    // wait for the world geometry to be loaded so land/borders never "pop in"
    const begin = () => { setShowTitle(false); setStoryPlaying(true); };
    const ready = () => g._loaded;
    let waited = 0;
    const tick = () => {
      if (ready() || waited >= 4000) begin();
      else { waited += 120; setTimeout(tick, 120); }
    };
    setTimeout(tick, 3200);
  }, [t.globeTheme]);

  const exitStory = useCallback(() => {
    setStory(false); setStoryPlaying(false); setShowTitle(false);
    const g = globeRef.current;
    g.flyTo([20, 10], 1, 1200);
  }, []);

  const segAt = (elapsed) => {
    let acc = 0;
    for (let i = 0; i < STORY.length; i++) {
      if (elapsed < acc + STORY[i].dur || i === STORY.length - 1) {
        return { i, local: Math.min(1, (elapsed - acc) / STORY[i].dur), acc };
      }
      acc += STORY[i].dur;
    }
    return { i: STORY.length - 1, local: 1, acc };
  };

  const lastSegRef = useRef(-1);
  // timer: advance the clock only (when playing)
  useEffect(() => {
    if (!story || !storyPlaying) return;
    let last = performance.now();
    const id = setInterval(() => {
      const now = performance.now();
      const dt = (now - last) / 1000; last = now;
      let el = storyElapsedRef.current + dt * speedRef.current;
      if (el >= STORY_TOTAL) { el = STORY_TOTAL; setStoryPlaying(false); }
      setStoryElapsed(el);
    }, 33);
    return () => clearInterval(id);
  }, [story, storyPlaying]);

  // derive time + camera from the clock (so scrubbing works even when paused)
  useEffect(() => {
    if (!story) return;
    const { i, local } = segAt(storyElapsed);
    const seg = STORY[i];
    setYa(logLerp(seg.ya, seg.yaTo, d3.easeSinInOut(local)));
    if (i !== lastSegRef.current) {
      lastSegRef.current = i;
      globeRef.current && globeRef.current.flyTo(seg.coord, seg.zoom, seg.flyMs || 1500, seg.spin || 0);
    }
  }, [story, storyElapsed]);

  const storyElapsedRef = useRef(0); storyElapsedRef.current = storyElapsed;

  // toggle a body class so chrome (e.g. Tweaks) can hide during the film
  useEffect(() => {
    document.body.classList.toggle("in-story", story);
  }, [story]);

  // ---- derived ----------------------------------------------
  const dispYa = roundYa(ya);
  const isPresent = ya <= 1.5;
  const cal = calendarLabel(ya, TL);         // "≈ 3000 BCE" / "≈ 1990 CE" for the historical era
  // keep the "<n> years ago" reading AND the calendar year side by side all the
  // way to the present (only the very end collapses to "Today").
  const bigText = isPresent ? ui("today") : ya <= 60 ? String(Math.round(ya)) : fmt(dispYa);
  const unitText = isPresent ? "" : ui("yearsAgo");
  const calYear = isPresent ? null : cal;
  const eraText = isPresent ? ui("presentDay") : epochLabel(ya, TL);
  const popText = fmtPop(window.popAt(ya));
  const chapterRaw = CHAPTERS.find((c) => ya <= c.from && ya > c.to) || CHAPTERS[CHAPTERS.length - 1];
  const cIdx = CHAPTERS.indexOf(chapterRaw);
  const cTr = TL.chapters && TL.chapters[cIdx];
  const chapter = cTr ? { ...chapterRaw, title: cTr.t, body: cTr.b } : chapterRaw;

  const liveReligions = RELIGIONS.filter((r) => ya <= r.from && ya >= r.to);
  let focus = null;
  if (pinned) focus = RELIGIONS.find((r) => r.id === pinned);
  if (!focus) {
    const liveActive = liveReligions.filter((r) => active.has(r.id));
    // a STORY beat may name the faith that matches its on-screen action (e.g.
    // Totemism as the Americas are peopled) — prefer it when it is live.
    const segFocus = STORY[storyPosForYa(ya).i].focusRel;
    const segRel = segFocus && liveActive.find((r) => r.id === segFocus);
    focus = segRel || (liveActive.length ? liveActive.reduce((a, b) => (b.from < a.from ? b : a)) : null);
  }

  const toggleReligion = (id) => {
    setActive((prev) => {
      const n = new Set(prev);
      n.has(id) ? n.delete(id) : n.add(id);
      return n;
    });
  };
  const focusReligion = (r) => {
    setPinned(r.id);
    if (!active.has(r.id)) toggleReligion(r.id);
    // jump time into its window if outside
    if (ya > r.from || ya < r.to) setYa(Math.min(r.from, Math.max(r.to + 1, (r.from + Math.max(r.to, 50)) / 2)));
    globeRef.current.flyTo(r.sites[0], 2.4, 1400);
  };

  // slider drag
  const trackRef = useRef(null);
  const draggingRef = useRef(false);
  const setFromClientX = (clientX) => {
    const rect = trackRef.current.getBoundingClientRect();
    const p = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    setYa(posToYa(p));
  };
  const onTrackDown = (e) => {
    draggingRef.current = true; setExploring(false); setHintGone(true);
    setFromClientX(e.clientX ?? e.touches[0].clientX);
  };
  useEffect(() => {
    const mv = (e) => { if (draggingRef.current) setFromClientX(e.clientX ?? (e.touches && e.touches[0].clientX)); };
    const up = () => { draggingRef.current = false; };
    window.addEventListener("mousemove", mv); window.addEventListener("mouseup", up);
    window.addEventListener("touchmove", mv, { passive: true }); window.addEventListener("touchend", up);
    return () => { window.removeEventListener("mousemove", mv); window.removeEventListener("mouseup", up);
      window.removeEventListener("touchmove", mv); window.removeEventListener("touchend", up); };
  }, []);

  // Left / right arrow keys nudge the timeline slider one frame at a time
  // (a small step in slider-position space). Right = forward toward today,
  // left = back into deep time. Holding a key auto-repeats. Any nudge pauses
  // playback so the user can scrub frame-by-frame.
  useEffect(() => {
    const onKey = (e) => {
      const tag = (e.target && e.target.tagName) || "";
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;
      // Space toggles play / pause
      if (e.key === " " || e.code === "Space") {
        e.preventDefault();
        setStory(false); setHintGone(true);
        setExploring((v) => {
          if (!v && yaRef.current <= 2) setYa(TIME.start); // restart from the top if at the end
          return !v;
        });
        return;
      }
      if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
      e.preventDefault();
      const frames = (e.shiftKey ? 20 : 1) * (e.key === "ArrowRight" ? 1 : -1);
      setExploring(false); setStory(false); setHintGone(true);
      setYa((prev) => advanceFrames(prev, frames));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const pos = yaToPos(ya);
  const ticks = [
    { ya: 300000, label: ui("tick_300ka") },
    { ya: 70000, label: ui("tick_ooa") },
    { ya: 12000, label: ui("tick_villages") },
    { ya: 5000, label: ui("tick_cities") },
    { ya: 2000, label: ui("tick_2ka") },
    { ya: 1, label: ui("tick_today") },
  ];

  const curSegIdx = story ? segAt(storyElapsed).i : storyPosForYa(ya).i;
  const curSeg = locStory(STORY[curSegIdx], curSegIdx);
  const fmtClock = (s) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`;

  return (
    <div className="stage">
      <canvas id="globe" ref={canvasRef}></canvas>
      <div className="vignette"></div>

      <div className="ui-scale">
      {/* masthead */}
      {!story && <div className="masthead">
        <div className="draggable mast-grab" {...dragMast}>
          <p className="eyebrow">{ui("eyebrow")}</p>
          <h1>{ui("titleA")} <em>{ui("titleB")}</em></h1>
          <p className="credit">{ui("credit1")} · {ui("credit2")}</p>
        </div>
      </div>}

      {/* mobile-only readout — fills the space under the title with the live
          population figure + sparkline and the forms of belief alive right now */}
      {!story && (
        <div className="mobile-readout">
          <div className="mr-pop">
            <div className="mr-time">
              <span className="mr-big">{bigText}</span>
              {unitText && <span className="mr-unit">{unitText}</span>}
              {calYear && <span className="mr-cal">{calYear}</span>}
            </div>
            <span className="mr-div"></span>
            <div className="mr-pop-text">
              <span className="mr-lab">{ui("humansAlive")}</span>
              <span className="mr-val">≈ {popText}</span>
            </div>
          </div>
          <div className="mr-faiths">
            <p className="mr-lab mr-faiths-lab">{ui("formsOfBelief")}</p>
            <div className="mr-chips">
              {liveReligions.length === 0 && <span className="mr-none">—</span>}
              {liveReligions.map((r) => {
                const lr = locRel(r);
                const isFocus = focus && focus.id === r.id;
                return (
                  <button key={r.id} className={"mr-chip" + (isFocus ? " on" : "")}
                    onClick={() => focusReligion(r)}>
                    <span className="mr-dot" style={{ background: r.color }}></span>
                    {lr.name}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* consolidated utility toolbar (top-right) */}
      {!story && <div className="toolbar">
        <button className="tb-panel mobile-only" onClick={() => setSheetOpen(true)} aria-label={ui("mapLayers")}>
          <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M4 6h16M4 12h16M4 18h16"/></svg>
        </button>
        <span className="tb-group">
          <span className="tb-label">{ui("globeType")}</span>
          <select className="tb-select" value={t.globeTheme} onChange={(e) => setTweak("globeTheme", e.target.value)} aria-label={ui("globeType")}>
            <option value="slate">{ui("theme_slate")}</option>
            <option value="relief">{ui("theme_relief")}</option>
            <option value="twilight">{ui("theme_twilight")}</option>
            <option value="atlas">{ui("theme_atlas")}</option>
          </select>
        </span>
        <select className="tb-select" value={lang} onChange={(e) => setLang(e.target.value)} aria-label={ui("language")}>
          {window.LANGS.map((L) => <option key={L.code} value={L.code}>{L.label}</option>)}
        </select>
        <button className="tb-about" onClick={() => setAboutOpen(true)}>{(TL.about || EN.about).open}</button>
      </div>}

      {/* About modal */}

      {/* narrative reader */}
      {!story && <div className="reader draggable" {...dragReader}>
        <p className="chapter-kicker">{chapter.title}</p>
        <h2 className="read-fade">{chapter.title}</h2>
        <p className="read-fade">{chapter.body}</p>
        {focus && (() => { const f = locRel(focus); return (
          <div className="relfocus">
            <div className="rf-head">
              <span className="dot" style={{ background: f.color, color: f.color }}></span>
              <h3>{f.name}</h3>
            </div>
            <p className="rf-when">{f.when}</p>
            <p>{f.blurb}</p>
            <p className="rf-ex">{f.examples}</p>
          </div>
        ); })()}
      </div>}

      {/* story-style caption box (also shown during Play) */}
      {!story && curSeg && (
        <div className="story-overlay play-overlay">
          <div className="story-caption play-caption">
            <p className="sc-kicker">{curSeg.kicker}</p>
            <p className="sc-body">{curSeg.body}</p>
          </div>
        </div>
      )}

      {/* "On the map" legend (from the film) */}
      {!story && <div className="story-legend play-onmap">
        <p className="sl-title">{ui("onTheMap")}</p>
        <div className="sl-row"><span className="sl-g sl-region"></span><span>{ui("map_region")}</span></div>
        <div className="sl-row"><span className="sl-g sl-route"></span><span>{ui("map_route")}</span></div>
        <div className="sl-row"><span className="sl-g sl-dot"></span><span>{ui("map_settlement")}</span></div>
        <div className="sl-row"><span className="sl-g sl-flow"></span><span>{ui("map_flow")}</span></div>
        <div className="sl-row"><span className="sl-g sl-bar"></span><span>{ui("map_pop")}</span></div>
      </div>}

      {/* legend */}
      {!story && <div className="legend draggable" {...dragLegend}>
        <p className="leg-title">
          <span>{ui("formsOfBelief")}</span>
          <button onClick={() => { setPinned(null); setActive(new Set(RELIGIONS.map((r) => r.id))); }}>{ui("reset")}</button>
        </p>
        {RELIGIONS.map((r) => {
          const live = ya <= r.from && ya >= r.to;
          const on = active.has(r.id);
          return (
            <button key={r.id} data-rel={r.id}
              className={"leg-item" + (on ? "" : " off") + (live ? " live" : " dormant")}
              onClick={(e) => { if (e.shiftKey) { toggleReligion(r.id); } else { focusReligion(r); } }}
              onDoubleClick={() => toggleReligion(r.id)}
              title={ui("legItemTitle")}>
              <span className="swatch" style={{ background: on ? r.color : "transparent", borderColor: r.color }}></span>
              <span>
                <span className="lname">{locRel(r).name}</span><br/>
                <span className="ldate">{locRel(r).when}</span>
              </span>
              <span className="pip"></span>
            </button>
          );
        })}
      </div>}

      {!story && <div className={"hint" + (hintGone ? " gone" : "")}>{ui("hint")}</div>}

      {/* on-page layer toggles */}
      {!story && (
        <div className="layers-box draggable" {...dragLayers}>
          <p className="lb-title">{ui("mapLayers")}</p>
          {[["settlement", ui("layer_settlement")], ["migration", ui("layer_migration")], ["religion", ui("layer_religion")], ["population", ui("layer_population")], ["ice", ui("layer_ice")]].map(([k, lbl]) => (
            <button key={k} className={"lb-row" + (layers[k] ? " on" : "")}
              onClick={() => setLayers((p) => ({ ...p, [k]: !p[k] }))}>
              <span className="lb-check"></span><span>{lbl}</span>
            </button>
          ))}
        </div>
      )}

      {/* on-page globe-type selector */}
      {/* on-page globe-type selector — consolidated into the top-right toolbar */}


      {/* on-page population graph */}
      {!story && <PopGraph ya={ya} variant="explore" logScale={graphLog} onToggle={() => setGraphLog((v) => !v)} dragProps={dragGraph} title={ui("humanPopulation")} />}

      {/* timeline */}
      {!story && <div className="timeline draggable" {...dragTimeline}>
        <div className="tl-top">
          <div className="tl-date">
            <span className="big">{bigText}</span>
            {unitText && <span className="unit">{unitText}</span>}
            {calYear && <span className="cal">{calYear}</span>}
            <span className="era">{eraText}</span>
          </div>
          <div className="tl-pop">
            <span className="lab">{ui("humansAlive")}</span>
            <span className="val">≈ {popText}</span>
          </div>
          <div className="tl-controls">
            <SpeedControl speed={speed} setSpeed={setSpeed} />
            <button className="btn" onClick={() => {
              if (!exploring && ya <= 2) setYa(TIME.start);
              setExploring((v) => !v);
            }}>
              {exploring ? Ico.pause : Ico.play}{exploring ? ui("pause") : ui("play")}
            </button>
          </div>
        </div>
        <div className="tl-track-wrap">
          <div className="tl-ticks">
            {ticks.map((tk) => (
              <span key={tk.label} className="tl-tick" style={{ left: (yaToPos(tk.ya) * 100) + "%" }}>{tk.label}</span>
            ))}
          </div>
          <div className="tl-track" ref={trackRef} onMouseDown={onTrackDown} onTouchStart={onTrackDown}>
            <div className="tl-fill" style={{ width: (pos * 100) + "%" }}></div>
            <div className="tl-thumb" style={{ left: (pos * 100) + "%" }}></div>
          </div>
        </div>
      </div>}

      {/* story / video mode */}
      {story && (
        <>
          <div className="story-bars fade-in"></div>
          {showTitle && (
            <div className="story-title-card">
              <div className="stc-inner fade-in">
                <div className="stc-eyebrow">An Interactive Atlas</div>
                <h2>The Human <em>Journey</em></h2>
              </div>
            </div>
          )}
          {!showTitle && curSeg && (
            <div className="story-overlay">
              <div className="story-caption story-cap-anim" key={segAt(storyElapsed).i}>
                <p className="sc-kicker">{curSeg.kicker}</p>
                <p className="sc-body">{curSeg.body}</p>
              </div>
            </div>
          )}
          {!showTitle && (
            <div className="story-year">
              <span className="sy-num">{bigText}</span>
              {unitText && <span className="sy-unit">{unitText}</span>}
              <span className="sy-cal">{eraText}</span>
              <span className="sy-pop">≈ {popText} humans alive</span>
            </div>
          )}
          {!showTitle && <PopGraph ya={ya} variant="film" logScale={graphLog} title={ui("humanPopulation")} />}
          {!showTitle && (
            <div className="story-legend">
              <p className="sl-title">On the map</p>
              <div className="sl-row"><span className="sl-g sl-region"></span><span>Settled land — belief colour</span></div>
              <div className="sl-row"><span className="sl-g sl-route"></span><span>Migration route</span></div>
              <div className="sl-row"><span className="sl-g sl-dot"></span><span>Settlement reached</span></div>
              <div className="sl-row"><span className="sl-g sl-flow"></span><span>Belief spreads</span></div>
              <div className="sl-row"><span className="sl-g sl-bar"></span><span>Population (height)</span></div>
            </div>
          )}
          {!showTitle && (
            <div className="story-religions">
              <p className="sr-title">Forms of belief</p>
              {RELIGIONS.map((r) => {
                const live = ya <= r.from && ya >= r.to;
                return (
                  <div key={r.id} className={"sr-row" + (live ? "" : " sr-dim")}>
                    <span className="sr-dot" style={{ background: live ? r.color : "transparent", borderColor: r.color }}></span>
                    <span>{r.name}</span>
                  </div>
                );
              })}
            </div>
          )}
          <div className="story-controls">
            <button className="icon-btn" onClick={() => {
              if (storyElapsed >= STORY_TOTAL) { lastSegRef.current = -1; setStoryElapsed(0); setYa(STORY[0].ya); globeRef.current.flyTo(STORY[0].coord, STORY[0].zoom, 1000); setStoryPlaying(true); }
              else setStoryPlaying((v) => !v);
            }}>
              {storyElapsed >= STORY_TOTAL ? Ico.replay : (storyPlaying ? Ico.pause : Ico.play)}
            </button>
            <div className="story-progress" onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const p = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
              lastSegRef.current = -1; setStoryElapsed(p * STORY_TOTAL);
            }}>
              <div className="pg" style={{ width: (storyElapsed / STORY_TOTAL * 100) + "%" }}></div>
            </div>
            <span className="story-time">{fmtClock(storyElapsed)} / {fmtClock(STORY_TOTAL)}</span>
            <SpeedControl speed={speed} setSpeed={setSpeed} dark />
            <button className="icon-btn ghost" onClick={exitStory} title="Exit">{Ico.x}</button>
          </div>
        </>
      )}
      </div>

      {/* About modal — outside .ui-scale so it shows full-scale above everything */}
      {!story && aboutOpen && (() => { const A = TL.about || EN.about; return (
        <div className="about-overlay" onClick={() => setAboutOpen(false)}>
          <div className="about-card" onClick={(e) => e.stopPropagation()}>
            <button className="about-close" onClick={() => setAboutOpen(false)} aria-label={A.close}>✕</button>
            <h2 className="about-title">{A.title}</h2>
            <p className="about-intro">{A.intro}</p>
            {A.s.map((sec, i) => (
              <div className="about-sec" key={i}>
                <h3>{sec.h}</h3>
                <p>{sec.b}</p>
              </div>
            ))}
          </div>
        </div>
      ); })()}

      {/* Mobile controls sheet — layer toggles, beliefs & population graph */}
      {!story && sheetOpen && (
        <div className="sheet-overlay" onClick={() => setSheetOpen(false)}>
          <div className="sheet" onClick={(e) => e.stopPropagation()}>
            <div className="sheet-grip"></div>
            <button className="about-close sheet-close" onClick={() => setSheetOpen(false)} aria-label={(TL.about || EN.about).close}>✕</button>

            <PopGraph ya={ya} variant="explore" logScale={graphLog} onToggle={() => setGraphLog((v) => !v)} title={ui("humanPopulation")} />

            <p className="sheet-h">{ui("mapLayers")}</p>
            <div className="sheet-layers">
              {[["settlement", ui("layer_settlement")], ["migration", ui("layer_migration")], ["religion", ui("layer_religion")], ["population", ui("layer_population")], ["ice", ui("layer_ice")]].map(([k, lbl]) => (
                <button key={k} className={"lb-row" + (layers[k] ? " on" : "")} onClick={() => setLayers((p) => ({ ...p, [k]: !p[k] }))}>
                  <span className="lb-check"></span><span>{lbl}</span>
                </button>
              ))}
            </div>

            <p className="sheet-h">{ui("formsOfBelief")}</p>
            {focus && (() => { const f = locRel(focus); return (
              <div className="relfocus sheet-focus">
                <div className="rf-head"><span className="dot" style={{ background: f.color, color: f.color }}></span><h3>{f.name}</h3></div>
                <p className="rf-when">{f.when}</p>
                <p>{f.blurb}</p>
              </div>
            ); })()}
            <div className="sheet-beliefs">
              {RELIGIONS.map((r) => {
                const live = ya <= r.from && ya >= r.to; const on = active.has(r.id);
                return (
                  <button key={r.id} className={"leg-item" + (on ? "" : " off") + (live ? " live" : " dormant")}
                    onClick={() => focusReligion(r)} onDoubleClick={() => toggleReligion(r.id)}>
                    <span className="swatch" style={{ background: on ? r.color : "transparent", borderColor: r.color }}></span>
                    <span><span className="lname">{locRel(r).name}</span><br/><span className="ldate">{locRel(r).when}</span></span>
                    <span className="pip"></span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Tweaks */}
      <TweaksPanel>
        <TweakSection label="Globe" />
        <TweakSelect label="Globe type" value={t.globeTheme}
          options={[
            { value: "slate", label: "Slate — light land / dark sea" },
            { value: "relief", label: "Relief — green land / blue sea" },
            { value: "twilight", label: "Twilight — blue night earth" },
            { value: "atlas", label: "Atlas — engraved line-art" },
          ]}
          onChange={(v) => setTweak("globeTheme", v)} />
        <TweakToggle label="Idle auto-rotate" value={t.idleSpin} onChange={(v) => setTweak("idleSpin", v)} />
      </TweaksPanel>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
