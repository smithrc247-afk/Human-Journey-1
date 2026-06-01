/* ============================================================
   cm-views.jsx — The Cast and the Machine (Part III)
   The two halves: the Cast (six-role concentration plot) and
   the Machine (administrative-state gauge). Exported to window.
   ============================================================ */

function CMRoleGlyph({ id, color }) {
  const r = window.CM_ROLES.find((x) => x.id === id);
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke={color || "currentColor"} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d={r.glyph} />
    </svg>
  );
}

/* small sparkline of a role's apex-concentration across all 8 eras */
function CMSpark({ roleId, eraIndex, color }) {
  const series = window.cmSeries(roleId);
  const W = 100, H = 20, pad = 3;
  const n = series.length;
  const x = (i) => pad + (i * (W - 2 * pad)) / (n - 1);
  const y = (v) => H - pad - (v / 5) * (H - 2 * pad);
  const pts = series.map((v, i) => `${x(i).toFixed(1)},${y(v).toFixed(1)}`).join(" ");
  return (
    <svg className="cm-spark" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none">
      <polyline className="cm-spark-line" points={pts} />
      {series.map((v, i) => (
        <circle key={i} className="cm-spark-dot" cx={x(i)} cy={y(v)} r={i === eraIndex ? 3 : 1.4}
          fill={i === eraIndex ? color : "var(--ivory-faint)"} opacity={i === eraIndex ? 1 : 0.45}
          style={{ transition: "cx 0.3s, cy 0.3s" }} />
      ))}
    </svg>
  );
}

/* ============================================================
   THE CAST — how the six roles bundle at the apex / split apart
   (roles on the y-axis; each bar reaches right toward the apex)
   ============================================================ */
function CMCastPlot({ era, eraIndex, selected, onSelect }) {
  const TH = window.CM_APEX_THRESHOLD;        // apex threshold (concentration)
  const anyApex = window.CM_STACK.some((id) => era.roles[id].apex >= TH);
  return (
    <div className="cm-plot">
      <div className="cm-rows">
        <div className="cm-apexband"><span className="ab-lab">the apex · power fused here</span></div>
        {window.CM_STACK.map((id) => {
          const role = window.CM_ROLES.find((r) => r.id === id);
          const v = era.roles[id].apex;
          const inApex = v >= TH;
          const pct = Math.max(v / 5 * 100, 1.5);
          const inside = pct > 86;            // tuck the value inside long bars
          const valStyle = inside
            ? { left: pct + "%", transform: "translate(calc(-100% - 7px), -50%)", color: "#161a17" }
            : { left: pct + "%", transform: "translate(7px, -50%)", color: "var(--ivory)" };
          const cls = "cm-bar2" + (inApex ? " apex" : (anyApex && v < 1.2 ? " muted" : ""));
          return (
            <div key={id} className={"cm-row" + (selected === id ? " sel" : "")}
              onClick={() => onSelect(selected === id ? null : id)}>
              <div className="cm-row-id">
                <div className="cm-id-head">
                  <span className="cm-row-glyph" style={{ color: role.color }}><CMRoleGlyph id={id} color={role.color} /></span>
                  <span className="cm-row-name">{role.label}</span>
                </div>
                <span className="cm-row-desc">{role.role}</span>
                <CMSpark roleId={id} eraIndex={eraIndex} color={role.color} />
              </div>
              <div className="cm-row-track">
                <div className="cm-row-barwrap">
                  <div className={cls} style={{ width: pct + "%", background: role.color }}></div>
                  <span className="cm-val2" style={valStyle}>{v % 1 === 0 ? v : v.toFixed(1)}</span>
                </div>
                <span className="cm-row-note">{era.roles[id].note}</span>
              </div>
            </div>
          );
        })}
      </div>
      <div className="cm-axis">
        <span>diffuse · the broad base</span>
        <span className="ax-r">fused into the ruling apex →</span>
      </div>
    </div>
  );
}

/* ============================================================
   THE MACHINE — a single bar on the same 0–5 axis, sat above
   the Cast so the state's reach reads against the roles.
   ============================================================ */
function CMMachineBar({ era }) {
  const reach = era.reach;
  const word = window.cmReachWord(reach);
  const pct = Math.max(reach / 5 * 100, 1.5);
  return (
    <div className="cm-mrow">
      <div className="cm-row-id">
        <div className="cm-id-head">
          <span className="cm-row-glyph cm-mglyph"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M3 21h18M5 21V10M9.5 21V10M14.5 21V10M19 21V10M3 10l9-6 9 6z"/></svg></span>
          <span className="cm-row-name">The Machine</span>
        </div>
        <span className="cm-row-desc">the administrative state</span>
      </div>
      <div className="cm-row-track">
        <div className="cm-row-barwrap">
          <div className="cm-mbar" style={{ width: pct + "%" }}></div>
          <span className="cm-val2 cm-mval" style={{ left: pct + "%", transform: "translate(9px, -50%)" }}>{word} · {reach}/5</span>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   THE MACHINE — narrative detail (side panel)
   ============================================================ */
function CMMachine({ era }) {
  return (
    <div className="cm-card cm-machine">
      <p className="cm-card-h">The machine · the administrative state</p>
      <p className="cm-reach-note">{era.reachNote}</p>
      <div className="cm-access">
        <p className="cm-access-h">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="8" cy="15" r="4"/><path d="M10.8 12.2 19 4M16 7l3-3M14 9l2 2"/></svg>
          How private power taps in
        </p>
        <div className="cm-access-lab">{era.access.label}</div>
        <p className="cm-access-det">{era.access.detail}</p>
      </div>
    </div>
  );
}

Object.assign(window, { CMRoleGlyph, CMSpark, CMCastPlot, CMMachineBar, CMMachine });
