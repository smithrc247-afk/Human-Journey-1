/* ============================================================
   ex-app.jsx — The Excluded, the Cracks & the Counter-Cases
   Shell: left rail of themes (grouped by chapter) · reading main.
   ============================================================ */
const { useState: exState, useEffect: exEffect, useRef: exRef } = React;

const EX_APPS = [
  { id: "globe",    label: "The Human Journey",          note: "Out of Africa — the atlas",        href: "index.html",
    glyph: "M12 2a10 10 0 100 20 10 10 0 000-20zM2 12h20M12 2c3 3 3 17 0 20M12 2c-3 3-3 17 0 20" },
  { id: "origins",  label: "The Origins of Power",        note: "Part I · the mechanisms",          href: "The Origins of Power.html",
    glyph: "M13 2L4 14h6l-1 8 9-12h-6z" },
  { id: "iq",       label: "Power, Wealth & Inequality",  note: "Part II · the quantities",         href: "Power, Wealth & Inequality.html",
    glyph: "M4 20L20 4M4 20h16M4 20V8" },
  { id: "cast",     label: "The Cast & the Machine",      note: "Part III · roles & the state",      href: "The Cast and the Machine.html",
    glyph: "M9 7a3 3 0 100-6 3 3 0 000 6zM3 21v-1.5A4.5 4.5 0 017.5 15M15 11a3 3 0 100-6 3 3 0 000 6zM21 21v-1.5A4.5 4.5 0 0016.5 15" },
  { id: "excluded", label: "The Excluded & the Cracks",   note: "Part IV · cross-currents",          href: "The Excluded and the Cracks.html", current: true,
    glyph: "M9 12h2m2 0h2M8 8.5A4 4 0 008 15.5h1.5M16 15.5a4 4 0 000-7.5H14.5" },
  { id: "against",  label: "The Case Against",            note: "Part V · the objections",          href: "The Case Against.html",
    glyph: "M12 3v18M8 21h8M3 7h18M6 7l-3 7h6zM18 7l-3 7h6z" },
];

function ExNav() {
  const [open, setOpen] = exState(false);
  const wrapRef = exRef(null);
  exEffect(() => {
    if (!open) return;
    const onDoc = (e) => { if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false); };
    const onKey = (e) => { if (e.key === "Escape") setOpen(false); };
    document.addEventListener("mousedown", onDoc); window.addEventListener("keydown", onKey);
    return () => { document.removeEventListener("mousedown", onDoc); window.removeEventListener("keydown", onKey); };
  }, [open]);
  return (
    <div className="ex-nav" ref={wrapRef}>
      <button className={"ex-nav-btn" + (open ? " on" : "")} onClick={() => setOpen((v) => !v)} aria-haspopup="true" aria-expanded={open}>
        <svg className="ex-nav-globe" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.5 2.7 2.5 15.3 0 18M12 3c-2.5 2.7-2.5 15.3 0 18"/></svg>
        Explore
        <svg className="ex-nav-caret" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9l6 6 6-6"/></svg>
      </button>
      {open && (
        <div className="ex-nav-menu" role="menu">
          <p className="ex-nav-head">The Human Journey</p>
          {EX_APPS.map((a) => (
            a.current
              ? <span key={a.id} className="ex-nav-item current" role="menuitem" aria-disabled="true">
                  <span className="ex-nav-ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d={a.glyph}/></svg></span>
                  <span className="ex-nav-txt"><span className="ex-nav-lab">{a.label}</span><span className="ex-nav-note">You are here</span></span>
                </span>
              : <a key={a.id} className="ex-nav-item" href={a.href} role="menuitem">
                  <span className="ex-nav-ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d={a.glyph}/></svg></span>
                  <span className="ex-nav-txt"><span className="ex-nav-lab">{a.label}</span><span className="ex-nav-note">{a.note}</span></span>
                  <svg className="ex-nav-go" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
                </a>
          ))}
        </div>
      )}
    </div>
  );
}

function ExApp() {
  const flat = window.EX_THEMES;
  const load = () => { try { const v = localStorage.getItem("ex-theme"); return flat.some((t) => t.id === v) ? v : "gender"; } catch (e) { return "gender"; } };
  const [activeId, setActiveId] = exState(load);
  const mainRef = exRef(null);
  const theme = window.exTheme(activeId) || flat[0];

  exEffect(() => { try { localStorage.setItem("ex-theme", activeId); } catch (e) {} }, [activeId]);
  exEffect(() => { if (mainRef.current) mainRef.current.scrollTo({ top: 0, behavior: "smooth" }); }, [activeId]);

  // keyboard ↑/↓ (or ←/→) step through the themes in order
  exEffect(() => {
    const onKey = (e) => {
      const k = e.key;
      if (k !== "ArrowUp" && k !== "ArrowDown" && k !== "ArrowLeft" && k !== "ArrowRight") return;
      const tag = (e.target && e.target.tagName) || "";
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;
      e.preventDefault();
      const i = flat.findIndex((t) => t.id === activeId);
      const dir = (k === "ArrowDown" || k === "ArrowRight") ? 1 : -1;
      const ni = Math.max(0, Math.min(flat.length - 1, i + dir));
      if (ni !== i) setActiveId(flat[ni].id);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [activeId]);

  return (
    <div className="ex-stage">
      <div className="ex-top">
        <div className="ex-mast">
          <p className="ex-eyebrow">The Human Journey · Part IV</p>
          <h1>The Excluded &amp; the <em>Counter-Cases</em></h1>
        </div>
        <ExNav />
      </div>

      <nav className="ex-rail">
        <p className="ex-rail-intro">The earlier parts risked treating <b>the many</b> as undifferentiated, resistance as doomed revolt, and the trajectory as inevitable. These four cuts run across all the eras at once — pick one to trace it.</p>
        {window.EX_GROUPS.map((g, gi) => (
          <div className="ex-group" key={g.id}>
            <div className="ex-group-h">
              <span className="ex-group-num">{["I","II","III","IV"][gi]}</span>
              <span className="ex-group-lab">{g.label}</span>
              <span className="ex-group-sub">{g.sub}</span>
            </div>
            {window.exThemesByGroup(g.id).map((t) => (
              <button key={t.id} className={"ex-item" + (t.id === activeId ? " on" : "")}
                style={{ "--ec": window.EX_ACCENT[g.id] }}
                onClick={() => setActiveId(t.id)}>
                <span className="ex-dot"></span>
                <span className="ex-it-txt">
                  <span className="ex-it-lab">{t.title}</span>
                  <span className="ex-it-tag">{t.tagline}</span>
                </span>
              </button>
            ))}
          </div>
        ))}
      </nav>

      <main className="ex-main" ref={mainRef}>
        <ExReader theme={theme} />
      </main>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("ex-root")).render(<ExApp />);
