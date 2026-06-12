/* ============================================================
   pv-app.jsx — The Case Against This Analysis (Part V)
   Shell: left rail of objections + synthesis · the debate view.
   ============================================================ */
const { useState: pvState, useEffect: pvEffect, useRef: pvRef } = React;

const PV_APPS = [
  { id: "globe",    label: "The Human Journey",          note: "Out of Africa — the atlas",        href: "index.html",
    glyph: "M12 2a10 10 0 100 20 10 10 0 000-20zM2 12h20M12 2c3 3 3 17 0 20M12 2c-3 3-3 17 0 20" },
  { id: "origins",  label: "The Origins of Power",        note: "Part I · the mechanisms",          href: "The Origins of Power.html",
    glyph: "M13 2L4 14h6l-1 8 9-12h-6z" },
  { id: "iq",       label: "Power, Wealth & Inequality",  note: "Part II · the quantities",         href: "Power, Wealth & Inequality.html",
    glyph: "M4 20L20 4M4 20h16M4 20V8" },
  { id: "cast",     label: "The Cast & the Machine",      note: "Part III · roles & the state",      href: "The Cast and the Machine.html",
    glyph: "M9 7a3 3 0 100-6 3 3 0 000 6zM3 21v-1.5A4.5 4.5 0 017.5 15M15 11a3 3 0 100-6 3 3 0 000 6zM21 21v-1.5A4.5 4.5 0 0016.5 15" },
  { id: "excluded", label: "The Excluded & the Cracks",   note: "Part IV · cross-currents",          href: "The Excluded and the Cracks.html",
    glyph: "M9 12h2m2 0h2M8 8.5A4 4 0 008 15.5h1.5M16 15.5a4 4 0 000-7.5H14.5" },
  { id: "against",  label: "The Case Against",            note: "Part V · the objections",           href: "The Case Against.html", current: true,
    glyph: "M12 3v18M8 21h8M3 7h18M6 7l-3 7h6zM18 7l-3 7h6z" },
  { id: "freedom",  label: "Power and Freedom",           note: "Part VI · the theory of freedom",  href: "Power and Freedom.html",
    glyph: "M4 21h16M6 21V4h9v17M12 12.5h1.5" },
];

function PVNav() {
  const [open, setOpen] = pvState(false);
  const wrapRef = pvRef(null);
  pvEffect(() => {
    if (!open) return;
    const onDoc = (e) => { if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false); };
    const onKey = (e) => { if (e.key === "Escape") setOpen(false); };
    document.addEventListener("mousedown", onDoc); window.addEventListener("keydown", onKey);
    return () => { document.removeEventListener("mousedown", onDoc); window.removeEventListener("keydown", onKey); };
  }, [open]);
  return (
    <div className="pv-nav" ref={wrapRef}>
      <button className={"pv-nav-btn" + (open ? " on" : "")} onClick={() => setOpen((v) => !v)} aria-haspopup="true" aria-expanded={open}>
        <svg className="pv-nav-globe" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.5 2.7 2.5 15.3 0 18M12 3c-2.5 2.7-2.5 15.3 0 18"/></svg>
        Explore
        <svg className="pv-nav-caret" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9l6 6 6-6"/></svg>
      </button>
      {open && (
        <div className="pv-nav-menu" role="menu">
          <p className="pv-nav-head">The Human Journey</p>
          {PV_APPS.map((a) => (
            a.current
              ? <span key={a.id} className="pv-nav-item current" role="menuitem" aria-disabled="true">
                  <span className="pv-nav-ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d={a.glyph}/></svg></span>
                  <span className="pv-nav-txt"><span className="pv-nav-lab">{a.label}</span><span className="pv-nav-note">You are here</span></span>
                </span>
              : <a key={a.id} className="pv-nav-item" href={a.href} role="menuitem">
                  <span className="pv-nav-ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d={a.glyph}/></svg></span>
                  <span className="pv-nav-txt"><span className="pv-nav-lab">{a.label}</span><span className="pv-nav-note">{a.note}</span></span>
                  <svg className="pv-nav-go" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
                </a>
          ))}
        </div>
      )}
    </div>
  );
}

function PVApp() {
  const obs = window.PV_OBJECTIONS;
  const ids = obs.map((o) => o.id).concat("survives");
  const load = () => { try { const v = localStorage.getItem("pv-sel"); return ids.includes(v) ? v : obs[0].id; } catch (e) { return obs[0].id; } };
  const [sel, setSel] = pvState(load);
  const mainRef = pvRef(null);
  pvEffect(() => { try { localStorage.setItem("pv-sel", sel); } catch (e) {} }, [sel]);
  pvEffect(() => { if (mainRef.current) mainRef.current.scrollTo({ top: 0, behavior: "smooth" }); }, [sel]);

  pvEffect(() => {
    const onKey = (e) => {
      const k = e.key;
      if (k !== "ArrowUp" && k !== "ArrowDown" && k !== "ArrowLeft" && k !== "ArrowRight") return;
      const tag = (e.target && e.target.tagName) || "";
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;
      e.preventDefault();
      const i = ids.indexOf(sel);
      const ni = Math.max(0, Math.min(ids.length - 1, i + ((k === "ArrowDown" || k === "ArrowRight") ? 1 : -1)));
      if (ni !== i) setSel(ids[ni]);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [sel]);

  const ob = obs.find((o) => o.id === sel);

  return (
    <div className="pv-stage">
      <div className="pv-top">
        <div className="pv-mast">
          <p className="pv-eyebrow">The Human Journey · Part V</p>
          <h1>The Case <em>Against</em></h1>
        </div>
        <PVNav />
      </div>

      <nav className="pv-rail">
        <p className="pv-rail-intro">{window.PV_INTRO}</p>
        <p className="pv-rail-h">Five objections</p>
        {obs.map((o) => (
          <button key={o.id} className={"pv-item" + (o.id === sel ? " on" : "") + (o.dent >= 0.75 ? " gravest" : "")}
            onClick={() => setSel(o.id)}>
            <span className="pv-item-num">{o.num}</span>
            <span className="pv-item-txt">
              <span className="pv-item-lab">{o.title}</span>
              <span className="pv-item-tag">{o.strength}</span>
            </span>
          </button>
        ))}
        <div className="pv-rail-sep"></div>
        <button className={"pv-item survives" + (sel === "survives" ? " on" : "")} onClick={() => setSel("survives")}>
          <span className="pv-item-num">✦</span>
          <span className="pv-item-txt"><span className="pv-item-lab">What survives</span></span>
        </button>
      </nav>

      <main className="pv-main" ref={mainRef}>
        {ob ? <PVDebate ob={ob} /> : <PVSurvives data={window.PV_SURVIVES} />}
      </main>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("pv-root")).render(<PVApp />);
