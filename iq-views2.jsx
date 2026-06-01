/* ============================================================
   iq-views2.jsx — Power, Wealth & Inequality
   Views 3 & 4: Wealth (Lorenz + stock vs flow) · Power (coupling)
   ============================================================ */
const IQ_META2 = window.IQ_META;
const iqPct2 = window.iqPct;

// ============================================================
//  VIEW 3 — WEALTH (Lorenz curve + stock vs flow)
// ============================================================
function WealthView({ era }) {
  const roles = era.roles;
  const W = 360, H = 320, padL = 44, padR = 16, padT = 14, padB = 36;
  const px = (x) => padL + x * (W - padL - padR);
  const py = (y) => (H - padB) - y * (H - padB - padT);

  const pathFor = (metric) => {
    const L = window.iqLorenz(roles, metric);
    return L.map((p, i) => (i === 0 ? "M" : "L") + px(p.x).toFixed(1) + " " + py(p.y).toFixed(1)).join(" ");
  };
  const wealthLine = pathFor("wealth");
  const incomeLine = pathFor("income");
  // shaded Gini area = between equality diagonal and the wealth curve
  const Lw = window.iqLorenz(roles, "wealth");
  const area = "M" + px(0) + " " + py(0) + " " +
    Lw.map((p) => "L" + px(p.x).toFixed(1) + " " + py(p.y).toFixed(1)).join(" ") +
    " L" + px(1) + " " + py(1) + " Z";

  const giniW = window.iqGini(roles, "wealth");
  const giniI = window.iqGini(roles, "income");
  const inh = era.inheritance;
  const inhWord = inh > 0.78 ? "Hereditary" : inh > 0.55 ? "Strong" : inh > 0.35 ? "Partial" : inh > 0.18 ? "Weak" : "Resets";

  // top-decile marker on the wealth curve
  const topX = 0.9, topY = 1 - window.iqTopShare(roles, "wealth", 0.1);

  return (
    <>
      <div className="iq-viz-head">
        <div>
          <h2 className="iq-viz-title">How the <em>wealth</em> is shared</h2>
          <p className="iq-viz-sub">The further the curve bows from the line of equality, the more lopsided the holding. Stock (accumulated wealth) always bows further than flow (yearly income) — fortunes concentrate more than wages.</p>
        </div>
      </div>
      <div className="iq-viz-body">
        <div className="iq-wealth">
          <div className="iq-lorenz-wrap">
            <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid meet">
              {/* grid */}
              {[0.25, 0.5, 0.75].map((g) => (
                <g key={g}>
                  <line x1={px(g)} x2={px(g)} y1={py(0)} y2={py(1)} stroke="rgba(232,224,205,0.07)" />
                  <line x1={px(0)} x2={px(1)} y1={py(g)} y2={py(g)} stroke="rgba(232,224,205,0.07)" />
                </g>
              ))}
              {/* axes */}
              <line x1={px(0)} x2={px(1)} y1={py(0)} y2={py(0)} stroke="var(--hair)" />
              <line x1={px(0)} x2={px(0)} y1={py(0)} y2={py(1)} stroke="var(--hair)" />
              {/* Gini area */}
              <path d={area} fill="rgba(199,154,78,0.16)" stroke="none" />
              {/* equality diagonal */}
              <line x1={px(0)} y1={py(0)} x2={px(1)} y2={py(1)} stroke="rgba(232,224,205,0.4)" strokeDasharray="4 4" />
              {/* income (flow) */}
              <path d={incomeLine} fill="none" stroke="#6f93a8" strokeWidth="2" strokeLinejoin="round" />
              {/* wealth (stock) */}
              <path d={wealthLine} fill="none" stroke="var(--brass-bright)" strokeWidth="2.6" strokeLinejoin="round" />
              {/* top-decile marker */}
              <line x1={px(topX)} y1={py(0)} x2={px(topX)} y2={py(topY)} stroke="rgba(232,224,205,0.25)" strokeDasharray="2 3" />
              <circle cx={px(topX)} cy={py(topY)} r="3.4" fill="var(--brass-bright)" />
              {/* labels */}
              <text x={px(0.5)} y={H - 10} textAnchor="middle" fontFamily="var(--mono)" fontSize="10" fill="var(--ivory-faint)" letterSpacing="1.5">POOREST  →  RICHEST  (share of group)</text>
              <text x={14} y={py(0.5)} textAnchor="middle" fontFamily="var(--mono)" fontSize="10" fill="var(--ivory-faint)" letterSpacing="1.5" transform={`rotate(-90 14 ${py(0.5)})`}>CUMULATIVE WEALTH</text>
              <text x={px(0.98)} y={py(0.96)} textAnchor="end" fontFamily="var(--mono)" fontSize="10" fill="var(--ivory-dim)">equality</text>
            </svg>
          </div>
          <div className="iq-stockflow">
            <div className="iq-sf-block">
              <p className="sf-h">Stock · accumulated wealth</p>
              <div className="iq-sf-big" style={{ color: "var(--brass-bright)" }}>{giniW.toFixed(2)}</div>
              <p className="sf-cap">Gini of holdings. 0 = all share alike · 1 = one holds everything.</p>
            </div>
            <div className="iq-sf-block">
              <p className="sf-h">Flow · yearly income</p>
              <div className="iq-sf-big" style={{ color: "#9bb6c6" }}>{giniI.toFixed(2)}</div>
              <p className="sf-cap">Gini of income — always the gentler curve.</p>
            </div>
            <div className="iq-stat-hr" style={{ margin: "4px 0" }}></div>
            <div className="iq-sf-block">
              <p className="sf-h">Inheritance · across generations</p>
              <div className="iq-sf-big" style={{ fontSize: 22, color: "var(--ivory)" }}>{inhWord}</div>
              <div className="iq-meter" style={{ marginTop: 8 }}><span style={{ width: (inh * 100) + "%", background: "var(--brass)" }}></span></div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

// ============================================================
//  VIEW 4 — POWER (the wealth ↔ power coupling)
// ============================================================
function PowerView({ era }) {
  const roles = era.roles;
  const W = 360, H = 300, top = 18, bot = 16;
  const colW = 52;
  const xLa = 60, xLb = xLa + colW;      // left column (wealth)
  const xRb = W - 60, xRa = xRb - colW;  // right column (power)
  const plotH = H - top - bot;

  // cumulative stacks (owners at top → dependents at bottom)
  const stack = (metric) => {
    let acc = 0; const out = {};
    for (const id of window.IQ_STACK) {
      const h = (roles[id][metric] / 100) * plotH;
      out[id] = { y0: top + acc, y1: top + acc + h };
      acc += h;
    }
    return out;
  };
  const Lw = stack("wealth"), Lp = stack("power");

  const coupling = window.iqCoupling(era);
  const coupWord = coupling > 0.78 ? "Fused" : coupling > 0.6 ? "Tightly linked" : coupling > 0.42 ? "Reinforcing" : coupling > 0.25 ? "Loosely tied" : "Independent";
  const coupCap = coupling > 0.6
    ? "Those who own also decide — and use that rule to own still more. The loop reinforces itself."
    : coupling > 0.4
      ? "Wealth and power lean on one another. A share of one tends to buy a share of the other."
      : "Power is held apart from wealth: voice is spread more widely than riches.";

  const decisionRights = roles.owners.power + roles.organizers.power;
  const leverage = window.iqTopShare(roles, "power", 0.1) * 100;
  const control = roles.owners.wealth;
  const meters = [
    { lab: "Decision rights", sub: "who chooses, and over whom", v: decisionRights, note: "held by owners + organizers" },
    { lab: "Political leverage", sub: "voice, vote & veto", v: leverage, note: "in the hands of the top tenth" },
    { lab: "Control of resources", sub: "land, capital, the means", v: control, note: "owned by the owner class" },
  ];

  return (
    <>
      <div className="iq-viz-head">
        <div>
          <h2 className="iq-viz-title">Where wealth meets <em>power</em></h2>
          <p className="iq-viz-sub">Each stratum's slice of wealth (left) tied by ribbon to its slice of power (right). When the ribbons run flat and parallel, the two are fused — the central feedback loop of inequality.</p>
        </div>
      </div>
      <div className="iq-viz-body">
        <div className="iq-power">
          <div className="iq-couple">
            <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid meet">
              {/* ribbons */}
              {window.IQ_STACK.map((id) => {
                const a = Lw[id], b = Lp[id];
                const c = IQ_META2[id].color;
                return (
                  <path key={id}
                    d={`M${xLb} ${a.y0} L${xLb} ${a.y1} C${(xLb + xRa) / 2} ${a.y1}, ${(xLb + xRa) / 2} ${b.y1}, ${xRa} ${b.y1} L${xRa} ${b.y0} C${(xLb + xRa) / 2} ${b.y0}, ${(xLb + xRa) / 2} ${a.y0}, ${xLb} ${a.y0} Z`}
                    fill={c} opacity="0.28" />
                );
              })}
              {/* bars */}
              {window.IQ_STACK.map((id) => {
                const a = Lw[id], b = Lp[id]; const c = IQ_META2[id].color;
                return (
                  <g key={id}>
                    <rect x={xLa} y={a.y0} width={colW} height={Math.max(0, a.y1 - a.y0)} fill={c} />
                    <rect x={xRa} y={b.y0} width={colW} height={Math.max(0, b.y1 - b.y0)} fill={c} />
                  </g>
                );
              })}
              <text x={xLa + colW / 2} y={12} textAnchor="middle" fontFamily="var(--mono)" fontSize="10" fill="var(--ivory-faint)" letterSpacing="2">WEALTH</text>
              <text x={xRa + colW / 2} y={12} textAnchor="middle" fontFamily="var(--mono)" fontSize="10" fill="var(--ivory-faint)" letterSpacing="2">POWER</text>
            </svg>
          </div>
          <div className="iq-pow-right">
            <div className="iq-loop">
              <p className="iq-loop-h">Wealth ↔ Power</p>
              <div className="iq-loop-val">{coupWord}</div>
              <div className="iq-meter" style={{ marginTop: 8 }}><span style={{ width: (coupling * 100) + "%", background: "var(--brass-bright)" }}></span></div>
              <p className="iq-loop-cap">{coupCap}</p>
            </div>
            <div className="iq-pow-meters">
              {meters.map((m) => (
                <div key={m.lab} className="pm-row">
                  <div className="pm-top">
                    <span className="pm-lab">{m.lab}</span>
                    <span className="pm-val">{Math.round(m.v)}%</span>
                  </div>
                  <div className="iq-meter" style={{ marginTop: 5 }}><span style={{ width: Math.min(100, m.v) + "%", background: "var(--brass)" }}></span></div>
                  <div style={{ fontFamily: "var(--mono)", fontSize: 8.5, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--ivory-faint)", marginTop: 4 }}>{m.note}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

Object.assign(window, { WealthView, PowerView });
