/* ============================================================
   op-app.jsx — The Origins of Power
   Shell: left rail (eras / threads) · reading canvas · explore.
   ============================================================ */
const { useState: opAState, useRef: opARef, useEffect: opAEffect } = React;

/* explore dropdown — identical across modules */
const OP_APPS = [
  { id: "globe",   label: "The Human Journey",                   note: "Out of Africa — the atlas",     href: "index.html",
    glyph: "M12 2a10 10 0 100 20 10 10 0 000-20zM2 12h20M12 2c3 3 3 17 0 20M12 2c-3 3-3 17 0 20" },
  { id: "origins", label: "The Origins of Power",        note: "Part I · the mechanisms",       href: "The Origins of Power.html", current: true,
    glyph: "M13 2L4 14h6l-1 8 9-12h-6z" },
  { id: "iq",      label: "Power, Wealth & Inequality",  note: "Part II · the quantities",      href: "Power, Wealth & Inequality.html",
    glyph: "M4 20L20 4M4 20h16M4 20V8" },
  { id: "cast",    label: "The Cast & the Machine",      note: "Part III · roles & the state",  href: "The Cast and the Machine.html",
    glyph: "M9 7a3 3 0 100-6 3 3 0 000 6zM3 21v-1.5A4.5 4.5 0 017.5 15M15 11a3 3 0 100-6 3 3 0 000 6zM21 21v-1.5A4.5 4.5 0 0016.5 15" },
  { id: "excluded", label: "The Excluded & the Cracks",   note: "Part IV · cross-currents",        href: "The Excluded and the Cracks.html",
    glyph: "M9 12h2m2 0h2M8 8.5A4 4 0 008 15.5h1.5M16 15.5a4 4 0 000-7.5H14.5" },
  { id: "against",  label: "The Case Against",            note: "Part V · the objections",          href: "The Case Against.html",
    glyph: "M12 3v18M8 21h8M3 7h18M6 7l-3 7h6zM18 7l-3 7h6z" },
];

function OPNav() {
  const [open, setOpen] = opAState(false);
  const wrapRef = opARef(null);
  opAEffect(() => {
    if (!open) return;
    const onDoc = (e) => { if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false); };
    const onKey = (e) => { if (e.key === "Escape") setOpen(false); };
    document.addEventListener("mousedown", onDoc); window.addEventListener("keydown", onKey);
    return () => { document.removeEventListener("mousedown", onDoc); window.removeEventListener("keydown", onKey); };
  }, [open]);
  return (
    <div className="op-nav" ref={wrapRef}>
      <button className={"op-nav-btn" + (open ? " on" : "")} onClick={() => setOpen((v) => !v)} aria-haspopup="true" aria-expanded={open}>
        <svg className="op-nav-globe" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3c2.5 2.7 2.5 15.3 0 18M12 3c-2.5 2.7-2.5 15.3 0 18" /></svg>
        Explore
        <svg className="op-nav-caret" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9l6 6 6-6" /></svg>
      </button>
      {open && (
        <div className="op-nav-menu" role="menu">
          <p className="op-nav-head">The Human Journey</p>
          {OP_APPS.map((a) => (
            a.current
              ? <span key={a.id} className="op-nav-item current" role="menuitem" aria-disabled="true">
                  <span className="op-nav-ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d={a.glyph} /></svg></span>
                  <span className="op-nav-txt"><span className="op-nav-lab">{a.label}</span><span className="op-nav-note">You are here</span></span>
                </span>
              : <a key={a.id} className="op-nav-item" href={a.href} role="menuitem">
                  <span className="op-nav-ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d={a.glyph} /></svg></span>
                  <span className="op-nav-txt"><span className="op-nav-lab">{a.label}</span><span className="op-nav-note">{a.note}</span></span>
                  <svg className="op-nav-go" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
                </a>
          ))}
        </div>
      )}
    </div>
  );
}

const OP_TSTART = 300000, OP_TEND = 1;
const OP_L0 = Math.log(OP_TSTART), OP_L1 = Math.log(OP_TEND);
const opPosToYa = (p) => Math.exp(OP_L0 + (OP_L1 - OP_L0) * p);
const opYaToPos = (ya) => (Math.log(Math.max(ya, 1)) - OP_L0) / (OP_L1 - OP_L0);
const opFmtN = (n) => Math.round(n).toLocaleString("en-US");
function opTLDate(ya) {
  if (ya <= 1.5) return { big: "Today", unit: "", cal: "" };
  let big;
  if (ya >= 100000) big = opFmtN(Math.round(ya / 1000) * 1000);
  else if (ya >= 10000) big = opFmtN(Math.round(ya / 500) * 500);
  else if (ya >= 1000) big = opFmtN(Math.round(ya / 100) * 100);
  else big = opFmtN(Math.round(ya / 10) * 10);
  let cal = "";
  if (ya <= 12000) { const yr = 2025 - ya; cal = yr < 0 ? "\u2248 " + opFmtN(Math.round(-yr / (ya > 3000 ? 100 : 10)) * (ya > 3000 ? 100 : 10)) + " BCE" : "\u2248 " + (Math.round(yr / 10) * 10) + " CE"; }
  return { big, unit: "years ago", cal };
}
const OP_TICKS = [
  { ya: 300000, label: "300ka" },
  { ya: 12000, label: "First villages" },
  { ya: 5000, label: "First cities" },
  { ya: 2000, label: "Rome" },
  { ya: 500, label: "1500" },
  { ya: 1, label: "Today" },
];

function OPApp() {
  const eras = window.OP_ERAS;
  const load = () => { try { const v = localStorage.getItem("op-era"); return (v === "primer" || eras.some((e) => e.id === v)) ? v : "primer"; } catch (e) { return "primer"; } };
  const [activeId, setActiveId] = opAState(load);
  const [mode, setMode] = opAState("eras");
  const [focusThread, setFocusThread] = opAState(null);
  const [ya, setYa] = opAState(() => { const e = eras.find((x) => x.id === activeId); return e ? e.anchorYa : eras[0].anchorYa; });
  const [playing, setPlaying] = opAState(false);
  const [speed, setSpeed] = opAState(1);
  const mainRef = opARef(null);
  const railRef = opARef(null);
  const trackRef = opARef(null);
  const draggingRef = opARef(false);
  const yaRef = opARef(ya); yaRef.current = ya;
  const speedRef = opARef(speed); speedRef.current = speed;
  const era = eras.find((e) => e.id === activeId) || eras[0];
  const factors = window.opInterpFactors(ya);
  const dt = opTLDate(ya);

  opAEffect(() => { try { localStorage.setItem("op-era", activeId); } catch (e) {} }, [activeId]);

  // keep the active era card in view within the rail
  opAEffect(() => {
    const r = railRef.current; if (!r) return;
    const card = r.querySelector(".op-eracard.on"); if (!card) return;
    const cr = card.getBoundingClientRect(), rr = r.getBoundingClientRect();
    if (cr.top < rr.top) r.scrollTop += cr.top - rr.top - 8;
    else if (cr.bottom > rr.bottom) r.scrollTop += cr.bottom - rr.bottom + 8;
  }, [activeId]);

  const selectEra = (e) => {
    if (e.status === "planned" && e.id !== activeId) { /* still selectable to preview scope */ }
    setActiveId(e.id);
    setYa(e.anchorYa);
    setFocusThread(null);
    if (mainRef.current) mainRef.current.scrollTo({ top: 0, behavior: "smooth" });
  };

  // ---- keyboard : ← / → (or ↑ / ↓) step through the eras, keeping scroll steady ----
  opAEffect(() => {
    const onKey = (e) => {
      const k = e.key;
      if (k !== "ArrowLeft" && k !== "ArrowRight" && k !== "ArrowUp" && k !== "ArrowDown") return;
      const tag = (e.target && e.target.tagName) || "";
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;
      e.preventDefault();
      const i = eras.findIndex((x) => x.id === activeId);
      const dir = (k === "ArrowRight" || k === "ArrowDown") ? 1 : -1;
      const ni = Math.max(0, Math.min(eras.length - 1, i + dir));
      if (ni !== i) { setActiveId(eras[ni].id); setYa(eras[ni].anchorYa); }   // no scroll: graphic stays in view
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [activeId]);

  // ---- slider ↔ era sync, play loop, and track drag ----
  opAEffect(() => {
    if (activeId === "primer" || mode !== "eras") return;
    const e = window.opEraAtYa(ya);
    if (e.id !== activeId) setActiveId(e.id);
  }, [ya, activeId, mode]);

  opAEffect(() => {
    if (!playing) return;
    let last = performance.now(); const BASE = 60;
    const id = setInterval(() => {
      const now = performance.now(); const d = (now - last) / 1000; last = now;
      let pos = opYaToPos(yaRef.current) + (d * speedRef.current) / BASE;
      if (pos >= 1) { pos = 1; setPlaying(false); }
      setYa(opPosToYa(pos));
    }, 40);
    return () => clearInterval(id);
  }, [playing]);

  const setFromClientX = (clientX) => {
    const rect = trackRef.current.getBoundingClientRect();
    setYa(opPosToYa(Math.max(0, Math.min(1, (clientX - rect.left) / rect.width))));
  };
  const onTrackDown = (e) => { draggingRef.current = true; setPlaying(false); setFromClientX(e.clientX != null ? e.clientX : e.touches[0].clientX); };
  opAEffect(() => {
    const mv = (e) => { if (draggingRef.current) setFromClientX(e.clientX != null ? e.clientX : (e.touches && e.touches[0].clientX)); };
    const up = () => { draggingRef.current = false; };
    window.addEventListener("mousemove", mv); window.addEventListener("mouseup", up);
    window.addEventListener("touchmove", mv, { passive: true }); window.addEventListener("touchend", up);
    return () => { window.removeEventListener("mousemove", mv); window.removeEventListener("mouseup", up); window.removeEventListener("touchmove", mv); window.removeEventListener("touchend", up); };
  }, []);

  const selectThread = (tid) => {
    // open this thread's explanation for the era currently in view
    setFocusThread(focusThread === tid ? null : tid);
  };

  return (
    <div className="op-stage" style={{ "--ac": era.accent }}>
      {/* top bar */}
      <div className="op-top">
        <div className="op-mast">
          <p className="op-eyebrow">The Human Journey</p>
          <h1>The Origins of <em>Power</em></h1>
        </div>
        <OPNav />
      </div>

      {/* left rail */}
      <nav className="op-rail">
        <div className="op-mode">
          <button className={mode === "eras" ? "on" : ""} onClick={() => { setMode("eras"); setFocusThread(null); }}>By era</button>
          <button className={mode === "threads" ? "on" : ""} onClick={() => { setMode("threads"); setFocusThread((p) => p || "production"); }}>By thread</button>
        </div>
        <div className="op-rail-scroll" ref={railRef}>
          {mode === "eras" ? (
            <>
              <button className={"op-startcard" + (activeId === "primer" ? " on" : "")}
                onClick={() => { setActiveId("primer"); setFocusThread(null); if (mainRef.current) mainRef.current.scrollTo({ top: 0, behavior: "smooth" }); }}>
                <span className="op-sc-ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9"/><path d="M9.5 9.5a2.5 2.5 0 113.4 2.3c-.6.25-.9.7-.9 1.4v.3M12 16.5v.01"/></svg></span>
                <span className="op-sc-body"><span className="op-sc-title">What is power?</span><span className="op-sc-sub">Start here — a definition</span></span>
              </button>
              <p className="op-rail-h">Eight eras of archy</p>
              <div className="op-eralist">
                {eras.map((e) => (
                  <button key={e.id}
                    className={"op-eracard" + (e.id === activeId ? " on" : "") + (e.status === "planned" ? " locked" : "")}
                    style={{ "--ec": e.accent }}
                    onClick={() => selectEra(e)}>
                    <span className="op-ec-num">{e.num}</span>
                    <span className="op-ec-body">
                      <span className="op-ec-title">{e.title}</span>
                      <span className="op-ec-dates">{e.dates}</span>
                    </span>
                    {e.status === "next" && <span className="op-ec-tag next">Next</span>}
                    {e.status === "planned" && <span className="op-ec-tag planned">Planned</span>}
                  </button>
                ))}
              </div>
            </>
          ) : (
            <>
              <p className="op-rail-h">Follow one thread across time</p>
              <div className="op-threadlist">
                {window.OP_THREADS.map((t) => (
                  <button key={t.id} className={"op-threaditem" + (focusThread === t.id ? " on" : "")} onClick={() => selectThread(t.id)}>
                    <span className="op-ti-ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d={t.glyph} /></svg></span>
                    <span><span className="op-ti-lab">{t.label}</span><span className="op-ti-q">{t.question}</span></span>
                  </button>
                ))}
              </div>
              <p className="op-rail-h" style={{ marginTop: "18px", lineHeight: "1.5", textTransform: "none", letterSpacing: "0.02em", color: "var(--ivory-faint)", fontFamily: "var(--body)", fontSize: "11.5px" }}>
                Pick a thread to trace its force across all eight eras as a line — then click any point to read that era, or use ← / → to move along it.
              </p>
            </>
          )}
        </div>
      </nav>

      {/* reading canvas */}
      <main className="op-main" ref={mainRef}>
        <div className="op-col">
          {mode === "threads" && focusThread
            ? <OPThreadView key={focusThread} threadId={focusThread} activeId={activeId} eras={eras} />
            : activeId === "primer"
              ? <OPPrimer onEnter={() => selectEra(eras[0])} />
              : <>
                <OPDeepTime eras={eras} activeId={activeId} onSelect={selectEra} />
                <OPEraVisual era={era} eras={eras} focusThread={focusThread} factors={factors} />
              </>}
        </div>
      </main>

      {mode === "eras" && activeId !== "primer" && (
        <div className="timeline op-timeline">
          <div className="tl-top">
            <div className="tl-date">
              <span className="big">{dt.big}</span>
              {dt.unit && <span className="unit">{dt.unit}</span>}
              {dt.cal && <span className="cal">{dt.cal}</span>}
              <span className="era">{era.title}</span>
            </div>
            <div className="tl-controls">
              <div className="speed-ctrl">
                <span className="sp-ic" title="Speed"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><path d="M13 2 4 14h7l-1 8 9-12h-7z"/></svg></span>
                {[0.5, 1, 2, 4].map((r) => (<button key={r} className={"sp-btn" + (speed === r ? " on" : "")} onClick={() => setSpeed(r)}>{r}×</button>))}
              </div>
              <button className="btn primary" onClick={() => { if (!playing && opYaToPos(ya) >= 0.999) setYa(OP_TSTART); setPlaying((v) => !v); }}>
                {playing ? <svg viewBox="0 0 24 24" fill="currentColor"><path d="M6 5h4v14H6zM14 5h4v14h-4z"/></svg> : <svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>}
                {playing ? "Pause" : "Play"}
              </button>
            </div>
          </div>
          <div className="tl-track-wrap">
            <div className="tl-ticks">
              {OP_TICKS.map((tk) => (<span key={tk.label} className="tl-tick" style={{ left: (opYaToPos(tk.ya) * 100) + "%" }}>{tk.label}</span>))}
            </div>
            <div className="tl-track" ref={trackRef} onMouseDown={onTrackDown} onTouchStart={onTrackDown}>
              <div className="tl-fill" style={{ width: (opYaToPos(ya) * 100) + "%" }}></div>
              <div className="tl-thumb" style={{ left: (opYaToPos(ya) * 100) + "%" }}></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("op-root")).render(<OPApp />);
