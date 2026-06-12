/* ============================================================
   iq-app.jsx — Power, Wealth & Inequality
   The shell: deep-time timeline (scrub + play) · era dashboard ·
   view switching across the four pillars.
   ============================================================ */
const { useState, useEffect, useRef, useCallback } = React;

const IQ_TIME = window.TIME;            // { start: 300000, end: 1 }
const IQ_L0 = Math.log(IQ_TIME.start), IQ_L1 = Math.log(IQ_TIME.end);
const iqPosToYa = (p) => Math.exp(IQ_L0 + (IQ_L1 - IQ_L0) * p);
const iqYaToPos = (ya) => (Math.log(Math.max(ya, 1)) - IQ_L0) / (IQ_L1 - IQ_L0);

const iqFmt = (n) => Math.round(n).toLocaleString("en-US");
function iqFmtGroup(n) {
  if (n >= 1e9) { const v = n / 1e9; return (v >= 10 ? Math.round(v) : v.toFixed(1).replace(/\.0$/, "")) + "B"; }
  if (n >= 1e6) { const v = n / 1e6; return (v >= 10 ? Math.round(v) : v.toFixed(1).replace(/\.0$/, "")) + "M"; }
  if (n >= 1e3) { const v = n / 1e3; return (v >= 10 ? Math.round(v) : v.toFixed(1).replace(/\.0$/, "")) + "K"; }
  return iqFmt(n);
}
function iqFmtPop(n) {
  if (n >= 1e9) { const v = n / 1e9; return (v >= 10 ? Math.round(v) : v.toFixed(1).replace(/\.0$/, "")) + " billion"; }
  if (n >= 1e6) { const v = n / 1e6; return (v >= 10 ? Math.round(v) : v.toFixed(1).replace(/\.0$/, "")) + " million"; }
  if (n >= 1e3) return (Math.round(n / 1000) * 1000).toLocaleString("en-US");
  return Math.round(n).toLocaleString("en-US");
}
function iqRoundYa(ya) {
  if (ya >= 100000) return Math.round(ya / 1000) * 1000;
  if (ya >= 10000) return Math.round(ya / 500) * 500;
  if (ya >= 1000) return Math.round(ya / 100) * 100;
  return Math.round(ya / 10) * 10;
}
function iqCalendar(ya) {
  const yr = 2025 - ya;
  if (ya > 12000) return null;
  if (yr < 0) { const v = Math.round(-yr / (ya > 3000 ? 100 : 10)) * (ya > 3000 ? 100 : 10); return "≈ " + iqFmt(v) + " BCE"; }
  return "≈ " + (Math.round(yr / 10) * 10) + " CE";
}

const IQ_APPS = [
  { id: "globe",   label: "The Human Journey",                    note: "Out of Africa — the atlas",      href: "index.html",
    glyph: "M12 2a10 10 0 100 20 10 10 0 000-20zM2 12h20M12 2c3 3 3 17 0 20M12 2c-3 3-3 17 0 20" },
  { id: "freedom",  label: "Power and Freedom",           note: "Part VI · the theory of freedom",  href: "Power and Freedom.html",
    glyph: "M4 21h16M6 21V4h9v17M12 12.5h1.5" },
  { id: "origins", label: "The Origins of Power",         note: "Part I · the mechanisms",        href: "The Origins of Power.html",
    glyph: "M13 2L4 14h6l-1 8 9-12h-6z" },
  { id: "iq",      label: "Power, Wealth & Inequality",   note: "Part II · the quantities",       href: "Power, Wealth & Inequality.html", current: true,
    glyph: "M4 20L20 4M4 20h16M4 20V8" },
  { id: "cast",    label: "The Cast & the Machine",       note: "Part III · roles & the state",   href: "The Cast and the Machine.html",
    glyph: "M9 7a3 3 0 100-6 3 3 0 000 6zM3 21v-1.5A4.5 4.5 0 017.5 15M15 11a3 3 0 100-6 3 3 0 000 6zM21 21v-1.5A4.5 4.5 0 0016.5 15" },
];

function IQNav() {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef(null);
  useEffect(() => {
    if (!open) return;
    const onDoc = (e) => { if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false); };
    const onKey = (e) => { if (e.key === "Escape") setOpen(false); };
    document.addEventListener("mousedown", onDoc);
    window.addEventListener("keydown", onKey);
    return () => { document.removeEventListener("mousedown", onDoc); window.removeEventListener("keydown", onKey); };
  }, [open]);
  return (
    <div className="iq-nav" ref={wrapRef}>
      <button className={"iq-back iq-nav-btn" + (open ? " on" : "")} onClick={() => setOpen((v) => !v)} aria-haspopup="true" aria-expanded={open}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.5 2.7 2.5 15.3 0 18M12 3c-2.5 2.7-2.5 15.3 0 18"/></svg>
        Explore
        <svg className="iq-nav-caret" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9l6 6 6-6"/></svg>
      </button>
      {open && (
        <div className="iq-nav-menu" role="menu">
          <p className="iq-nav-head">The Human Journey</p>
          {IQ_APPS.map((a) => (
            a.current
              ? <span key={a.id} className="iq-nav-item current" role="menuitem" aria-disabled="true">
                  <span className="iq-nav-ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d={a.glyph}/></svg></span>
                  <span className="iq-nav-txt"><span className="iq-nav-lab">{a.label}</span><span className="iq-nav-note">You are here</span></span>
                </span>
              : <a key={a.id} className="iq-nav-item" href={a.href} role="menuitem">
                  <span className="iq-nav-ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d={a.glyph}/></svg></span>
                  <span className="iq-nav-txt"><span className="iq-nav-lab">{a.label}</span><span className="iq-nav-note">{a.note}</span></span>
                  <svg className="iq-nav-go" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
                </a>
          ))}
        </div>
      )}
    </div>
  );
}

const IQ_TABS = [
  { id: "strata", label: "Strata", glyph: "M3 7h18M3 12h18M3 17h18" },
  { id: "contrib", label: "Contribution", glyph: "M5 12h6M13 12h6M11 7l2 0M11 17l2 0M7 9v6M17 9v6" },
  { id: "wealth", label: "Wealth", glyph: "M4 20L20 4M4 20h16M4 20V8" },
  { id: "power", label: "Power", glyph: "M13 2L4 14h6l-1 8 9-12h-6z" },
  { id: "mechanism", label: "Mechanisms", glyph: "M4 5h16v4H4zM4 11h16v4H4zM4 17h16v3H4z" },
];

const IQ_TICKS = [
  { ya: 300000, label: "300ka" },
  { ya: 70000, label: "Out of Africa" },
  { ya: 12000, label: "First villages" },
  { ya: 5000, label: "First cities" },
  { ya: 2000, label: "2ka" },
  { ya: 1, label: "Today" },
];

function IQApp() {
  const loadYa = () => { try { const v = parseFloat(localStorage.getItem("iq-ya")); return isFinite(v) && v >= 1 && v <= IQ_TIME.start ? v : 5000; } catch (e) { return 5000; } };
  const [ya, setYa] = useState(loadYa);
  const [view, setView] = useState("strata");
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const yaRef = useRef(ya); yaRef.current = ya;
  const speedRef = useRef(speed); speedRef.current = speed;

  useEffect(() => { try { localStorage.setItem("iq-ya", String(ya)); } catch (e) {} }, [ya]);

  const era = window.iqAt(ya);
  const roles = era.roles;

  // ---- play loop : advance position linearly (≈48s end-to-end at 1×) ----
  useEffect(() => {
    if (!playing) return;
    let last = performance.now();
    const BASE = 48; // seconds for a full sweep at 1×
    const id = setInterval(() => {
      const now = performance.now();
      const dt = (now - last) / 1000; last = now;
      let pos = iqYaToPos(yaRef.current) + (dt * speedRef.current) / BASE;
      if (pos >= 1) { pos = 1; setPlaying(false); }
      setYa(iqPosToYa(pos));
    }, 33);
    return () => clearInterval(id);
  }, [playing]);

  // ---- timeline drag ----
  const trackRef = useRef(null);
  const draggingRef = useRef(false);
  const setFromClientX = (clientX) => {
    const rect = trackRef.current.getBoundingClientRect();
    const p = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    setYa(iqPosToYa(p));
  };
  const onTrackDown = (e) => { draggingRef.current = true; setPlaying(false); setFromClientX(e.clientX ?? e.touches[0].clientX); };
  useEffect(() => {
    const mv = (e) => { if (draggingRef.current) setFromClientX(e.clientX ?? (e.touches && e.touches[0].clientX)); };
    const up = () => { draggingRef.current = false; };
    window.addEventListener("mousemove", mv); window.addEventListener("mouseup", up);
    window.addEventListener("touchmove", mv, { passive: true }); window.addEventListener("touchend", up);
    return () => { window.removeEventListener("mousemove", mv); window.removeEventListener("mouseup", up);
      window.removeEventListener("touchmove", mv); window.removeEventListener("touchend", up); };
  }, []);

  // ---- keyboard : space play/pause · arrows scrub ----
  useEffect(() => {
    const onKey = (e) => {
      const tag = (e.target && e.target.tagName) || "";
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;
      if (e.key === " " || e.code === "Space") {
        e.preventDefault();
        setPlaying((v) => { if (!v && iqYaToPos(yaRef.current) >= 0.999) setYa(IQ_TIME.start); return !v; });
        return;
      }
      if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
      e.preventDefault();
      setPlaying(false);
      const step = (e.shiftKey ? 0.04 : 0.008) * (e.key === "ArrowRight" ? 1 : -1);
      setYa((prev) => iqPosToYa(Math.max(0, Math.min(1, iqYaToPos(prev) + step))));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // ---- derived readouts ----
  const dispYa = iqRoundYa(ya);
  const isPresent = ya <= 1.5;
  const cal = iqCalendar(ya);
  const bigText = isPresent ? "Today" : ya <= 60 ? String(Math.round(ya)) : iqFmt(dispYa);
  const unitText = isPresent ? "" : "years ago";
  const pos = iqYaToPos(ya);

  // ---- measures (all derived from the role distribution) ----
  const giniW = window.iqGini(roles, "wealth");
  const top10 = window.iqTopShare(roles, "wealth", 0.10) * 100;
  const top1 = window.iqTopShare(roles, "wealth", 0.01) * 100;
  const palma = window.iqPalma(roles, "wealth");
  const mobility = era.mobility;
  const worldPop = window.popAt(ya);

  const ActiveView = { strata: window.StrataView, contrib: window.ContributionView, wealth: window.WealthView, power: window.PowerView, mechanism: window.MechanismsView }[view];

  const giniWord = giniW < 0.2 ? "near-equal" : giniW < 0.35 ? "modest" : giniW < 0.5 ? "steep" : "extreme";

  return (
    <div className="iq-stage">
      {/* top : masthead · tabs · back */}
      <div className="iq-top">
        <div className="iq-mast">
          <p className="iq-eyebrow">The Human Journey</p>
          <h1>Power, Wealth &amp; <em>Inequality</em></h1>
          <p className="iq-sub">How a human group's structure, contribution, wealth and power redistribute across deep time — drag the timeline to watch it shift.</p>
        </div>
        <IQNav />
      </div>

      <div className="iq-tabs">
        {IQ_TABS.map((tb) => (
          <button key={tb.id} className={"iq-tab" + (view === tb.id ? " on" : "")} onClick={() => setView(tb.id)}>
            <span className="iq-tab-i"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d={tb.glyph}/></svg></span>
            {tb.label}
          </button>
        ))}
      </div>

      {/* body : viz + dashboard */}
      <div className="iq-body">
        <div className="iq-card iq-viz">
          {ActiveView && <ActiveView era={era} />}
        </div>

        <div className="iq-side">
          <div className="iq-card iq-era-card">
            <div className="iq-era-key">
              <span className="iq-era-year">{era.year}</span>
              <span className="iq-era-place">{era.place}</span>
            </div>
            <h3 className="iq-era-name">{era.name}</h3>
            <p className="iq-era-blurb">{era.blurb}</p>
            <div className="iq-era-denom">
              <div className="iq-denom">
                <span className="dl">The group</span>
                <span className="dv">≈ {iqFmtGroup(era.group)}</span>
                <span className="du">{era.unit}</span>
              </div>
              <div className="iq-denom">
                <span className="dl">Humans alive</span>
                <span className="dv">≈ {iqFmtGroup(worldPop)}</span>
                <span className="du">on Earth</span>
              </div>
            </div>
          </div>

          <div className="iq-card iq-meas">
            <p className="iq-card-h">Measures of inequality <span className="iq-est">est.</span></p>
            <div className="iq-stat-row">
              <span className="iq-stat-lab">Wealth Gini<small>{giniWord} concentration</small></span>
              <span className="iq-stat-val">{giniW.toFixed(2)}</span>
              <div className="iq-meter"><span style={{ width: (giniW * 100) + "%", background: "var(--brass-bright)" }}></span></div>
            </div>
            <div className="iq-stat-row">
              <span className="iq-stat-lab">Richest hold<small>top 10% · top 1% of all wealth</small></span>
              <span className="iq-stat-val dim">{Math.round(top10)}% · {Math.round(top1)}%</span>
              <div className="iq-meter"><span style={{ width: top10 + "%", background: "var(--brass)" }}></span></div>
            </div>
            <div className="iq-stat-hr"></div>
            <div className="iq-stat-row">
              <span className="iq-stat-lab">Palma ratio<small>top 10% ÷ bottom 40%</small></span>
              <span className="iq-stat-val dim">{palma >= 20 ? "20+" : palma.toFixed(1)}</span>
            </div>
            <div className="iq-stat-row">
              <span className="iq-stat-lab">Mobility between roles<small>chance of moving up or down</small></span>
              <span className="iq-stat-val dim">{Math.round(mobility * 100)}%</span>
              <div className="iq-meter"><span style={{ width: (mobility * 100) + "%", background: "#6f93a8" }}></span></div>
            </div>
          </div>
        </div>
      </div>

      {/* role key removed per request */}


      {/* timeline */}
      <div className="timeline">
        <div className="tl-top">
          <div className="tl-date">
            <span className="big">{bigText}</span>
            {unitText && <span className="unit">{unitText}</span>}
            {cal && <span className="cal">{cal}</span>}
            <span className="era">{era.name}</span>
          </div>
          <div className="tl-pop">
            <span className="lab">The group</span>
            <span className="val">≈ {iqFmtGroup(era.group)}</span>
          </div>
          <div className="tl-controls">
            <div className="speed-ctrl">
              <span className="sp-ic" title="Playback speed"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><path d="M13 2 4 14h7l-1 8 9-12h-7z"/></svg></span>
              {[0.5, 1, 2, 4].map((r) => (
                <button key={r} className={"sp-btn" + (speed === r ? " on" : "")} onClick={() => setSpeed(r)}>{r}×</button>
              ))}
            </div>
            <button className="btn primary" onClick={() => { if (!playing && pos >= 0.999) setYa(IQ_TIME.start); setPlaying((v) => !v); }}>
              {playing
                ? <svg viewBox="0 0 24 24" fill="currentColor"><path d="M6 5h4v14H6zM14 5h4v14h-4z"/></svg>
                : <svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>}
              {playing ? "Pause" : "Play"}
            </button>
          </div>
        </div>
        <div className="tl-track-wrap">
          <div className="tl-ticks">
            {IQ_TICKS.map((tk) => (
              <span key={tk.label} className="tl-tick" style={{ left: (iqYaToPos(tk.ya) * 100) + "%" }}>{tk.label}</span>
            ))}
            <span className="iq-tl-note" style={{ left: (iqYaToPos(11000) * 100) + "%" }}>the great divergence begins ↓</span>
          </div>
          <div className="tl-track" ref={trackRef} onMouseDown={onTrackDown} onTouchStart={onTrackDown}>
            <div className="tl-fill" style={{ width: (pos * 100) + "%" }}></div>
            <div className="tl-thumb" style={{ left: (pos * 100) + "%" }}></div>
          </div>
        </div>
      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<IQApp />);
