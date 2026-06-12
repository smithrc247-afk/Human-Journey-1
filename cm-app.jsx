/* ============================================================
   cm-app.jsx — The Cast and the Machine (Part III)
   Shell: deep-time timeline (scrub + play) · era dashboard ·
   the Cast plot + the Machine gauge.
   ============================================================ */
const { useState: cmState, useEffect: cmEffect, useRef: cmRef } = React;

const CM_TIME = window.TIME;                 // { start: 300000, end: 1 }
const CM_L0 = Math.log(CM_TIME.start), CM_L1 = Math.log(CM_TIME.end);
const cmPosToYa = (p) => Math.exp(CM_L0 + (CM_L1 - CM_L0) * p);
const cmYaToPos = (ya) => (Math.log(Math.max(ya, 1)) - CM_L0) / (CM_L1 - CM_L0);

const cmFmt = (n) => Math.round(n).toLocaleString("en-US");
function cmFmtScale(n) {
  if (n >= 1e9) { const v = n / 1e9; return (v >= 10 ? Math.round(v) : v.toFixed(1).replace(/\.0$/, "")) + "B"; }
  if (n >= 1e6) { const v = n / 1e6; return (v >= 10 ? Math.round(v) : v.toFixed(1).replace(/\.0$/, "")) + "M"; }
  if (n >= 1e3) { const v = n / 1e3; return (v >= 10 ? Math.round(v) : v.toFixed(1).replace(/\.0$/, "")) + "K"; }
  return cmFmt(n);
}
function cmRoundYa(ya) {
  if (ya >= 100000) return Math.round(ya / 1000) * 1000;
  if (ya >= 10000) return Math.round(ya / 500) * 500;
  if (ya >= 1000) return Math.round(ya / 100) * 100;
  return Math.round(ya / 10) * 10;
}
function cmCalendar(ya) {
  const yr = 2025 - ya;
  if (ya > 12000) return null;
  if (yr < 0) { const v = Math.round(-yr / (ya > 3000 ? 100 : 10)) * (ya > 3000 ? 100 : 10); return "≈ " + cmFmt(v) + " BCE"; }
  return "≈ " + (Math.round(yr / 10) * 10) + " CE";
}

const CM_APPS = [
  { id: "globe",   label: "The Human Journey",        note: "Out of Africa — the atlas",         href: "index.html",
    glyph: "M12 2a10 10 0 100 20 10 10 0 000-20zM2 12h20M12 2c3 3 3 17 0 20M12 2c-3 3-3 17 0 20" },
  { id: "freedom",  label: "Power and Freedom",           note: "Part VI · the theory of freedom",  href: "Power and Freedom.html",
    glyph: "M4 21h16M6 21V4h9v17M12 12.5h1.5" },
  { id: "origins", label: "The Origins of Power",      note: "Part I · the mechanisms",           href: "The Origins of Power.html",
    glyph: "M13 2L4 14h6l-1 8 9-12h-6z" },
  { id: "iq",      label: "Power, Wealth & Inequality", note: "Part II · the quantities",         href: "Power, Wealth & Inequality.html",
    glyph: "M4 20L20 4M4 20h16M4 20V8" },
  { id: "cast",    label: "The Cast & the Machine",    note: "Part III · roles & the state",       href: "The Cast and the Machine.html", current: true,
    glyph: "M9 7a3 3 0 100-6 3 3 0 000 6zM3 21v-1.5A4.5 4.5 0 017.5 15M15 11a3 3 0 100-6 3 3 0 000 6zM21 21v-1.5A4.5 4.5 0 0016.5 15" },
];

function CMNav() {
  const [open, setOpen] = cmState(false);
  const wrapRef = cmRef(null);
  cmEffect(() => {
    if (!open) return;
    const onDoc = (e) => { if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false); };
    const onKey = (e) => { if (e.key === "Escape") setOpen(false); };
    document.addEventListener("mousedown", onDoc); window.addEventListener("keydown", onKey);
    return () => { document.removeEventListener("mousedown", onDoc); window.removeEventListener("keydown", onKey); };
  }, [open]);
  return (
    <div className="cm-nav" ref={wrapRef}>
      <button className={"cm-nav-btn" + (open ? " on" : "")} onClick={() => setOpen((v) => !v)} aria-haspopup="true" aria-expanded={open}>
        <svg className="cm-nav-globe" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.5 2.7 2.5 15.3 0 18M12 3c-2.5 2.7-2.5 15.3 0 18"/></svg>
        Explore
        <svg className="cm-nav-caret" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9l6 6 6-6"/></svg>
      </button>
      {open && (
        <div className="cm-nav-menu" role="menu">
          <p className="cm-nav-head">The Human Journey</p>
          {CM_APPS.map((a) => (
            a.current
              ? <span key={a.id} className="cm-nav-item current" role="menuitem" aria-disabled="true">
                  <span className="cm-nav-ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d={a.glyph}/></svg></span>
                  <span className="cm-nav-txt"><span className="cm-nav-lab">{a.label}</span><span className="cm-nav-note">You are here</span></span>
                </span>
              : <a key={a.id} className="cm-nav-item" href={a.href} role="menuitem">
                  <span className="cm-nav-ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d={a.glyph}/></svg></span>
                  <span className="cm-nav-txt"><span className="cm-nav-lab">{a.label}</span><span className="cm-nav-note">{a.note}</span></span>
                  <svg className="cm-nav-go" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
                </a>
          ))}
        </div>
      )}
    </div>
  );
}

const CM_TICKS = [
  { ya: 300000, label: "300ka" },
  { ya: 12000, label: "First villages" },
  { ya: 5000, label: "First cities" },
  { ya: 2000, label: "Rome" },
  { ya: 500, label: "1500" },
  { ya: 1, label: "Today" },
];

function CMApp() {
  const loadYa = () => { try { const v = parseFloat(localStorage.getItem("cm-ya")); return isFinite(v) && v >= 1 && v <= CM_TIME.start ? v : 4000; } catch (e) { return 4000; } };
  const [ya, setYa] = cmState(loadYa);
  const [playing, setPlaying] = cmState(false);
  const [speed, setSpeed] = cmState(1);
  const [selRole, setSelRole] = cmState(null);
  const yaRef = cmRef(ya); yaRef.current = ya;
  const speedRef = cmRef(speed); speedRef.current = speed;

  cmEffect(() => { try { localStorage.setItem("cm-ya", String(ya)); } catch (e) {} }, [ya]);

  const era = window.cmAt(ya);
  const eraIndex = window.cmEraIndex(era.id);

  // ---- play loop : advance linearly (≈48s end-to-end at 1×) ----
  cmEffect(() => {
    if (!playing) return;
    let last = performance.now();
    const BASE = 48;
    const id = setInterval(() => {
      const now = performance.now();
      const dt = (now - last) / 1000; last = now;
      let pos = cmYaToPos(yaRef.current) + (dt * speedRef.current) / BASE;
      if (pos >= 1) { pos = 1; setPlaying(false); }
      setYa(cmPosToYa(pos));
    }, 33);
    return () => clearInterval(id);
  }, [playing]);

  // ---- timeline drag ----
  const trackRef = cmRef(null);
  const draggingRef = cmRef(false);
  const setFromClientX = (clientX) => {
    const rect = trackRef.current.getBoundingClientRect();
    const p = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    setYa(cmPosToYa(p));
  };
  const onTrackDown = (e) => { draggingRef.current = true; setPlaying(false); setFromClientX(e.clientX ?? e.touches[0].clientX); };
  cmEffect(() => {
    const mv = (e) => { if (draggingRef.current) setFromClientX(e.clientX ?? (e.touches && e.touches[0].clientX)); };
    const up = () => { draggingRef.current = false; };
    window.addEventListener("mousemove", mv); window.addEventListener("mouseup", up);
    window.addEventListener("touchmove", mv, { passive: true }); window.addEventListener("touchend", up);
    return () => { window.removeEventListener("mousemove", mv); window.removeEventListener("mouseup", up);
      window.removeEventListener("touchmove", mv); window.removeEventListener("touchend", up); };
  }, []);

  // ---- keyboard : space play/pause · arrows scrub (snap to eras with shift) ----
  cmEffect(() => {
    const onKey = (e) => {
      const tag = (e.target && e.target.tagName) || "";
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;
      if (e.key === " " || e.code === "Space") {
        e.preventDefault();
        setPlaying((v) => { if (!v && cmYaToPos(yaRef.current) >= 0.999) setYa(CM_TIME.start); return !v; });
        return;
      }
      if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
      e.preventDefault();
      setPlaying(false);
      if (e.shiftKey) {
        // jump era to era (land at the mid-point of the neighbouring era)
        const i = window.cmEraIndex(window.cmAt(yaRef.current).id);
        const ni = Math.max(0, Math.min(window.CM_ERAS.length - 1, i + (e.key === "ArrowRight" ? 1 : -1)));
        const sp = window.CM_ERAS[ni].span;
        const mid = Math.exp((Math.log(Math.max(sp.from, 1)) + Math.log(Math.max(sp.to, 1))) / 2);
        setYa(mid);
        return;
      }
      const step = 0.008 * (e.key === "ArrowRight" ? 1 : -1);
      setYa((prev) => cmPosToYa(Math.max(0, Math.min(1, cmYaToPos(prev) + step))));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // ---- derived readouts ----
  const dispYa = cmRoundYa(ya);
  const isPresent = ya <= 1.5;
  const cal = cmCalendar(ya);
  const bigText = isPresent ? "Today" : ya <= 60 ? String(Math.round(ya)) : cmFmt(dispYa);
  const unitText = isPresent ? "" : "years ago";
  const pos = cmYaToPos(ya);
  const worldPop = window.popAt(ya);

  // build the apex claim with a soft emphasis on the leading clause
  const claim = era.apexClaim;

  return (
    <div className="cm-stage" style={{ "--ac": era.accent }}>
      {/* top : masthead · explore */}
      <div className="cm-top">
        <div className="cm-mast">
          <p className="cm-eyebrow">The Human Journey · Part III</p>
          <h1>The Cast &amp; the <em>Machine</em></h1>
          <p className="cm-sub">Six functional roles recur in every era. Watch them bundle at the ruling apex and split apart — and watch the administrative state grow from nothing to maximal reach. Drag the timeline.</p>
        </div>
        <CMNav />
      </div>

      {/* body : the cast plot (left) · dashboard (right) */}
      <div className="cm-body">
        <div className="cm-card cm-viz">
          <div className="cm-viz-head">
            <div>
              <h2 className="cm-viz-title">The cast &amp; the <em>machine</em></h2>
              <p className="cm-viz-sub">The administrative state's reach, and each role's pull toward the ruling apex — read on one left→right scale. The further right, the more concentrated; the spark beside each role traces its arc across the eight eras.</p>
            </div>
          </div>
          <CMMachineBar era={era} />
          <div className="cm-claim">
            <span className="cm-claim-ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3l8 4v5c0 5-3.5 8-8 9-4.5-1-8-4-8-9V7z"/></svg></span>
            <p>{claim}</p>
          </div>
          <CMCastPlot era={era} eraIndex={eraIndex} selected={selRole} onSelect={setSelRole} />
        </div>

        <div className="cm-side">
          <div className="cm-card cm-era-card">
            <div className="cm-era-key">
              <span className="cm-era-num">Era {era.num}</span>
              <span className="cm-era-dates">{era.dates}</span>
              <span className="cm-era-place">{era.place}</span>
            </div>
            <h3 className="cm-era-name">{era.name}
              <span className={"cm-cert " + era.cert}>{era.cert}</span>
            </h3>
            <p className="cm-era-blurb">{era.blurb}</p>
            <div className="cm-era-foot">
              <div className="cm-denom">
                <span className="dl">Power operates at</span>
                <span className="dv">≈ {cmFmtScale(era.scale)}</span>
                <span className="du">{era.scaleUnit}</span>
              </div>
              <div className="cm-denom">
                <span className="dl">Humans alive</span>
                <span className="dv">≈ {cmFmtScale(worldPop)}</span>
                <span className="du">on Earth</span>
              </div>
            </div>
          </div>

          <CMMachine era={era} />
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
            <span className="lab">Machine reach</span>
            <span className="val">{era.reach}/5</span>
          </div>
          <div className="tl-controls">
            <div className="speed-ctrl">
              <span className="sp-ic" title="Playback speed"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><path d="M13 2 4 14h7l-1 8 9-12h-7z"/></svg></span>
              {[0.5, 1, 2, 4].map((r) => (
                <button key={r} className={"sp-btn" + (speed === r ? " on" : "")} onClick={() => setSpeed(r)}>{r}×</button>
              ))}
            </div>
            <button className="btn primary" onClick={() => { if (!playing && pos >= 0.999) setYa(CM_TIME.start); setPlaying((v) => !v); }}>
              {playing
                ? <svg viewBox="0 0 24 24" fill="currentColor"><path d="M6 5h4v14H6zM14 5h4v14h-4z"/></svg>
                : <svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>}
              {playing ? "Pause" : "Play"}
            </button>
          </div>
        </div>
        <div className="tl-track-wrap">
          <div className="tl-ticks">
            {CM_TICKS.map((tk) => (
              <span key={tk.label} className="tl-tick" style={{ left: (cmYaToPos(tk.ya) * 100) + "%" }}>{tk.label}</span>
            ))}
            <span className="cm-tl-note" style={{ left: (cmYaToPos(5500) * 100) + "%" }}>the machine is born ↓</span>
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

ReactDOM.createRoot(document.getElementById("cm-root")).render(<CMApp />);
