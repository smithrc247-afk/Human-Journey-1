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
function epochLabel(ya) {
  if (ya >= 12000) return "Palaeolithic";
  if (ya >= 5200) return "Neolithic";
  if (ya >= 3200) return "Bronze Age";
  if (ya >= 1500) return "Iron Age / Classical";
  return "Common Era";
}
function calendarLabel(ya) {
  const yr = 2025 - ya;
  if (ya > 12000) return null;
  if (yr < 0) {
    const v = Math.round(-yr / (ya > 3000 ? 100 : 10)) * (ya > 3000 ? 100 : 10);
    return `≈ ${fmt(v)} BCE`;
  }
  return `≈ ${fmt(Math.round(yr / 10) * 10)} CE`;
}

// ---- story keyframes (≈5 minutes, wide framing) -----------
const STORY = [
  { dur: 11, ya: 300000, yaTo: 270000, coord: [34, 6],   zoom: 1.5,  kicker: "300,000 years ago · East Africa", body: "In the African sun, a new kind of human appears — Homo sapiens. Tall, lightly built, and endlessly curious." },
  { dur: 12, ya: 270000, yaTo: 200000, coord: [20, 2],   zoom: 1.35, kicker: "The African homeland", body: "For thousands of generations they spread across the continent alone — from the Cape to the Sahara — mastering fire, tools, and language." },
  { dur: 12, ya: 200000, yaTo: 122000, coord: [24, 0],   zoom: 1.3,  kicker: "≈ 200,000 years ago", body: "They bury their dead, paint their bodies with ochre, and begin to sense spirits in animals, rivers, and stone — the dawn of animism." },
  { dur: 11, ya: 120000, yaTo: 74000,  coord: [40, 20],  zoom: 1.4,  kicker: "First steps beyond", body: "Early bands wander north into the Levant. But the world beyond Africa is harsh, and these first ventures fade away." },
  { dur: 12, ya: 73000,  yaTo: 63000,  coord: [46, 16],  zoom: 1.4,  kicker: "≈ 70,000 years ago · Out of Africa", body: "At last a small population crosses the narrow mouth of the Red Sea. Almost everyone alive outside Africa today descends from this single journey." },
  { dur: 11, ya: 62000,  yaTo: 55000,  coord: [78, 18],  zoom: 1.35, kicker: "The coastal road", body: "Hugging the shores of Arabia and India, they move east with astonishing speed, living on the riches of the sea." },
  { dur: 12, ya: 56000,  yaTo: 50000,  coord: [125, -12],zoom: 1.3,  kicker: "≈ 55,000 years ago · Sahul", body: "Crossing open ocean — the first humans ever to do so — they reach Australia, and bind themselves to the land through totems and the Dreaming." },
  { dur: 12, ya: 48000,  yaTo: 42000,  coord: [22, 46],  zoom: 1.4,  kicker: "≈ 45,000 years ago · Europe", body: "Others turn north into Ice-Age Europe. In the dark of painted caves, shamans enter trance to walk between the living and the spirit world." },
  { dur: 11, ya: 42000,  yaTo: 36000,  coord: [100, 40], zoom: 1.35, kicker: "Across Asia", body: "From the western steppes to the Pacific, humans fill the vast heart of Asia, reaching China and the edge of the northern ice." },
  { dur: 11, ya: 34000,  yaTo: 24000,  coord: [108, 58], zoom: 1.3,  kicker: "The frozen north", body: "Through the depths of the last Ice Age, hardy hunters press into Siberia, clothed in tailored furs against the killing cold." },
  { dur: 12, ya: 22000,  yaTo: 17000,  coord: [-165, 64],zoom: 1.3,  kicker: "≈ 20,000 years ago · Beringia", body: "So much water is locked in ice that a land bridge joins Asia to America. Hunters walk across into an entirely empty New World." },
  { dur: 11, ya: 16000,  yaTo: 13500,  coord: [-110, 46],zoom: 1.35, kicker: "Into the Americas", body: "They spread down the continent with breathtaking speed — the last great landmass to feel a human footprint." },
  { dur: 12, ya: 13500,  yaTo: 12000,  coord: [-62, -20],zoom: 1.4,  kicker: "≈ 13,000 years ago", body: "Within a few thousand years they reach the southern tip of South America. Humanity has now touched nearly every habitable shore." },
  { dur: 12, ya: 12000,  yaTo: 10800,  coord: [40, 34],  zoom: 1.5,  kicker: "The end of the Ice Age", body: "As the world warms, people in the Fertile Crescent linger by fields of wild grain — and begin, for the first time, to stay in one place." },
  { dur: 13, ya: 11000,  yaTo: 9600,   coord: [39, 37],  zoom: 1.6,  kicker: "≈ 11,000 years ago · Göbekli Tepe", body: "Before farming, before cities, they raise great carved pillars over their dead. The ancestors become guardians of the living." },
  { dur: 12, ya: 9500,   yaTo: 6000,   coord: [44, 32],  zoom: 1.45, kicker: "The first farmers", body: "Wheat, sheep, and cattle are tamed. Villages swell into towns, and the harvest reshapes the very rhythm of human life." },
  { dur: 13, ya: 5500,   yaTo: 4600,   coord: [44, 32],  zoom: 1.6,  kicker: "≈ 3300 BCE · Sumer", body: "In Mesopotamia the first cities rise. To master the chaos of flood and harvest, they crown themselves with vast pantheons of gods." },
  { dur: 12, ya: 4600,   yaTo: 3600,   coord: [34, 28],  zoom: 1.5,  kicker: "Gods of the river kingdoms", body: "Along the Nile and the Indus, temples become the engines of the state, and a literate priesthood writes the will of the gods into the world." },
  { dur: 12, ya: 3400,   yaTo: 3050,   coord: [32, 28],  zoom: 1.55, kicker: "≈ 1350 BCE · Egypt", body: "The pharaoh Akhenaten exalts a single sun-god above all the rest — a brief, radical step toward worshipping one god alone." },
  { dur: 12, ya: 3000,   yaTo: 2650,   coord: [52, 33],  zoom: 1.5,  kicker: "≈ 1000 BCE · Persia", body: "In Iran, the prophet Zarathustra reframes the cosmos as a struggle between good and evil — a dualism that will echo for millennia." },
  { dur: 12, ya: 2650,   yaTo: 2350,   coord: [35, 32],  zoom: 1.6,  kicker: "≈ 600 BCE · Judah", body: "In exile in Babylon, the people of Judah declare their god the one creator of all things — the first enduring monotheism." },
  { dur: 12, ya: 2500,   yaTo: 2000,   coord: [20, 40],  zoom: 1.4,  kicker: "≈ 500 BCE · The Mediterranean", body: "Meanwhile Greece and Rome make their gods into citizens — patrons of cities, festivals, and games, worshipped as public duty." },
  { dur: 12, ya: 2000,   yaTo: 1500,   coord: [33, 34],  zoom: 1.45, kicker: "≈ 1st–4th century CE", body: "From the eastern Mediterranean, Christianity carries the one-God idea across the Roman world and far beyond it." },
  { dur: 12, ya: 1450,   yaTo: 1100,   coord: [42, 26],  zoom: 1.45, kicker: "≈ 7th century CE · Arabia", body: "In Arabia, Islam arises and spreads with extraordinary speed to Spain and the Indus — the youngest of the great monotheisms." },
  { dur: 12, ya: 1000,   yaTo: 620,    coord: [-150, -12],zoom: 1.3, kicker: "The last frontier", body: "Far out in the Pacific, master navigators settle the final islands — the last empty lands on Earth to be reached by people." },
  { dur: 14, ya: 600,    yaTo: 480,    coord: [-58, 8],   zoom: 1.3, kicker: "≈ 1500 CE · A New World", body: "Across the Atlantic, Christianity follows the explorers — first to the Caribbean and South America in the 1490s, then onto the North American mainland, Mexico, and Peru." },
  { dur: 16, ya: 470,    yaTo: 1,      coord: [12, 16],  zoom: 1.12, kicker: "Today", body: "From a single African beginning, humanity now fills the planet — carrying the whole long inheritance of belief, from the first spirits to the one God." },
];
const STORY_TOTAL = STORY.reduce((s, k) => s + k.dur, 0);

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

// camera keyframes for Play (reuse the story's geography), ya descending
const CAM = STORY.map((s) => ({ ya: s.ya, coord: s.coord, zoom: s.zoom }));
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
function PopGraph({ ya, variant, logScale, onToggle, dragProps }) {
  const W = 236, H = 110, PADL = 32, PADR = 10, PADT = 12, PADB = 26;
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
  // place the marker exactly on the drawn polyline (interpolate between samples)
  const cx = xf(ya);
  const pts = path.pts;
  const seg = Math.max(0, Math.min(pts.length - 2, Math.floor((cx - pts[0].x) / ((pts[pts.length - 1].x - pts[0].x) / (pts.length - 1)))));
  const segFrac = (cx - pts[seg].x) / ((pts[seg + 1].x - pts[seg].x) || 1);
  const cy = pts[seg].y + (pts[seg + 1].y - pts[seg].y) * Math.max(0, Math.min(1, segFrac));
  return (
    <div className={"pop-graph " + variant + (dragProps ? " draggable" : "")} {...(dragProps || {})}>
      <div className="pg-head">
        <p className="pg-title">Human population</p>
        {onToggle && (
          <button className="pg-scale" onClick={onToggle} title="Toggle axis scale">
            <span className={logScale ? "" : "on"}>LIN</span>
            <span className={logScale ? "on" : ""}>LOG</span>
          </button>
        )}
        {!onToggle && <span className="pg-scale-label">{logScale ? "log" : "linear"}</span>}
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} width={W} height={H}>
        {ygrids.map((g) => (
          <g key={g.l}>
            <line x1={PADL} x2={W - PADR} y1={y(g.p)} y2={y(g.p)} className="pg-grid" />
            <text x={PADL - 5} y={y(g.p) + 3} className="pg-axislabel" textAnchor="end">{g.l}</text>
          </g>
        ))}
        {xgrids.map((g) => (
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
  const dragGlobe = useDraggable("globe", true);
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

  // explore autoplay (scrub timeline forward) — globe follows the action,
  // and the final 20 years play out one calendar year at a time.
  useEffect(() => {
    if (!exploring) return;
    const g = globeRef.current;
    if (g) { g._anim = null; }
    let last = performance.now();
    let yearAccum = 0;
    const id = setInterval(() => {
      const now = performance.now();
      const dt = (now - last) / 1000; last = now;
      const curYa = yaRef.current;

      if (curYa <= 20.5) {
        // year-by-year through the last two decades
        yearAccum += dt;
        const STEP = 0.5 / speedRef.current; // seconds per year (speed-scaled)
        if (yearAccum >= STEP) {
          yearAccum = 0;
          const next = Math.max(1, Math.round(curYa) - 1);
          setYa(next);
          if (next <= 1) setExploring(false);
        }
      } else {
        // baseline sweep ~110s; brisk through the last two millennia
        let rate = 1 / 110;
        if (curYa < 2000) rate *= 3;
        rate *= speedRef.current;
        let p = yaToPos(curYa) + dt * rate;
        let ny = posToYa(p);
        if (ny <= 20) ny = 20; // hand off to the year-stepping phase
        setYa(ny);
      }

      // camera glides to follow the narrative
      if (g) {
        const goal = camForYa(yaRef.current);
        const tl = -goal.coord[0], tt = -goal.coord[1];
        g.rotate = [approachAngle(g.rotate[0], tl, 0.06), approachAngle(g.rotate[1], tt, 0.06), 0];
        g.zoom += (goal.zoom - g.zoom) * 0.05;
        g._dirty = true;
      }
    }, 33);
    return () => clearInterval(id);
  }, [exploring]);

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
      globeRef.current && globeRef.current.flyTo(seg.coord, seg.zoom, 1500);
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
  const recentYear = ya > 1.5 && ya <= 30;   // show exact CE year for the last decades
  const yrCE = 2025 - Math.round(ya);
  const bigText = isPresent ? "Today" : recentYear ? String(yrCE) : fmt(dispYa);
  const unitText = isPresent ? "" : recentYear ? "CE" : "years ago";
  const eraText = isPresent ? "Present day · 2025"
    : recentYear ? (Math.round(ya) + (Math.round(ya) === 1 ? " year ago" : " years ago"))
    : epochLabel(ya) + (cal ? " · " + cal : "");
  const popText = fmtPop(window.popAt(ya));
  const chapter = CHAPTERS.find((c) => ya <= c.from && ya > c.to) || CHAPTERS[CHAPTERS.length - 1];
  const cal = calendarLabel(ya);

  const liveReligions = RELIGIONS.filter((r) => ya <= r.from && ya >= r.to);
  let focus = null;
  if (pinned) focus = RELIGIONS.find((r) => r.id === pinned);
  if (!focus) {
    const liveActive = liveReligions.filter((r) => active.has(r.id));
    focus = liveActive.length ? liveActive.reduce((a, b) => (b.from < a.from ? b : a)) : null;
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

  const pos = yaToPos(ya);
  const ticks = [
    { ya: 300000, label: "300ka" },
    { ya: 70000, label: "Out of Africa" },
    { ya: 12000, label: "First villages" },
    { ya: 5000, label: "First cities" },
    { ya: 2000, label: "2 ka" },
    { ya: 1, label: "Today" },
  ];

  const curSeg = story ? STORY[segAt(storyElapsed).i] : null;
  const fmtClock = (s) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`;

  return (
    <div className="stage">
      <canvas id="globe" ref={canvasRef}></canvas>
      <div className="vignette"></div>

      {/* masthead */}
      {!story && <div className="masthead">
        <div className="draggable mast-grab" {...dragMast}>
          <p className="eyebrow">An Interactive Atlas</p>
          <h1>The Human <em>Journey</em></h1>
        </div>
        <div className="credit">Out of Africa<br/>& the Origins of Belief</div>
      </div>}

      {/* narrative reader */}
      {!story && <div className="reader draggable" {...dragReader}>
        <p className="chapter-kicker">{chapter.title}</p>
        <h2 className="read-fade">{chapter.title}</h2>
        <p className="read-fade">{chapter.body}</p>
        {focus && (
          <div className="relfocus">
            <div className="rf-head">
              <span className="dot" style={{ background: focus.color, color: focus.color }}></span>
              <h3>{focus.name}</h3>
            </div>
            <p className="rf-when">{focus.when}</p>
            <p>{focus.blurb}</p>
            <p className="rf-ex">{focus.examples}</p>
          </div>
        )}
      </div>}

      {/* legend */}
      {!story && <div className="legend draggable" {...dragLegend}>
        <p className="leg-title">
          <span>Forms of Belief</span>
          <button onClick={() => { setPinned(null); setActive(new Set(RELIGIONS.map((r) => r.id))); }}>Reset</button>
        </p>
        {RELIGIONS.map((r) => {
          const live = ya <= r.from && ya >= r.to;
          const on = active.has(r.id);
          return (
            <button key={r.id}
              className={"leg-item" + (on ? "" : " off") + (live ? " live" : " dormant")}
              onClick={(e) => { if (e.shiftKey) { toggleReligion(r.id); } else { focusReligion(r); } }}
              onDoubleClick={() => toggleReligion(r.id)}
              title="Click to focus · Shift-click to toggle">
              <span className="swatch" style={{ background: on ? r.color : "transparent", borderColor: r.color }}></span>
              <span>
                <span className="lname">{r.name}</span><br/>
                <span className="ldate">{r.when}</span>
              </span>
              <span className="pip"></span>
            </button>
          );
        })}
      </div>}

      {!story && <div className={"hint" + (hintGone ? " gone" : "")}>Drag to rotate · Scroll to zoom · Drag the timeline</div>}

      {/* on-page layer toggles */}
      {!story && (
        <div className="layers-box draggable" {...dragLayers}>
          <p className="lb-title">Map layers</p>
          {[["settlement", "Settlement"], ["migration", "Migration lines"], ["religion", "Religion"], ["population", "Population"], ["ice", "Polar ice"]].map(([k, lbl]) => (
            <button key={k} className={"lb-row" + (layers[k] ? " on" : "")}
              onClick={() => setLayers((p) => ({ ...p, [k]: !p[k] }))}>
              <span className="lb-check"></span><span>{lbl}</span>
            </button>
          ))}
        </div>
      )}

      {/* on-page globe-type selector */}
      {!story && (
        <div className="globe-box draggable" {...dragGlobe}>
          <p className="lb-title">Globe type</p>
          {[["slate", "Slate"], ["relief", "Relief"], ["twilight", "Twilight"], ["atlas", "Atlas"]].map(([v, lbl]) => (
            <button key={v} className={"gt-row" + (t.globeTheme === v ? " on" : "")}
              onClick={() => setTweak("globeTheme", v)}>{lbl}</button>
          ))}
        </div>
      )}

      {/* on-page population graph */}
      {!story && <PopGraph ya={ya} variant="explore" logScale={graphLog} onToggle={() => setGraphLog((v) => !v)} dragProps={dragGraph} />}

      {/* timeline */}
      {!story && <div className="timeline draggable" {...dragTimeline}>
        <div className="tl-top">
          <div className="tl-date">
            <span className="big">{bigText}</span>
            {unitText && <span className="unit">{unitText}</span>}
            <span className="era">{eraText}</span>
          </div>
          <div className="tl-pop">
            <span className="lab">Humans alive</span>
            <span className="val">≈ {popText}</span>
          </div>
          <div className="tl-controls">
            <SpeedControl speed={speed} setSpeed={setSpeed} />
            <button className="btn" onClick={() => setExploring((v) => !v)}>
              {exploring ? Ico.pause : Ico.play}{exploring ? "Pause" : "Play"}
            </button>
            <button className="btn primary" onClick={startStory}>{Ico.film}Watch the story</button>
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
          {!showTitle && <PopGraph ya={ya} variant="film" logScale={graphLog} />}
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
