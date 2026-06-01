/* ============================================================
   iq-views.jsx — Power, Wealth & Inequality
   Views 1 & 2: Strata (roles & mobility) · Contribution vs reward
   Shared helpers exported to window for iq-views2.jsx.
   ============================================================ */
const { useState: iqUseState } = React;

const IQ_META = {};
window.IQ_ROLES.forEach((r) => { IQ_META[r.id] = r; });

const iqPct = (x) => Math.round(x) + "%";
const iqMult = (w, pop) => {
  if (pop < 1e-6) return "—";
  const m = w / pop;
  return "×" + (m >= 10 ? Math.round(m) : m >= 1 ? m.toFixed(1) : m.toFixed(2));
};

// a glyph chip for a role
function RoleGlyph({ id, size }) {
  const r = IQ_META[id];
  return (
    <span className="iq-band-glyph" style={{ color: r.color }}>
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" width={size || 20} height={size || 20}>
        <path d={r.glyph} />
      </svg>
    </span>
  );
}

// share-vs-wealth fill colour: blend role colour toward brass as the stratum's
// per-capita wealth multiple climbs (gilding the apex)
function gild(id, mult) {
  const r = IQ_META[id];
  if (id === "owners") return `linear-gradient(90deg, ${r.color}, var(--brass-bright))`;
  const g = Math.max(0, Math.min(1, (mult - 0.6) / 4));
  return g > 0.04 ? `linear-gradient(90deg, ${r.color}, ${r.color} ${100 - g * 55}%, var(--brass))` : r.color;
}

// ============================================================
//  VIEW 1 — STRATA
// ============================================================
function StrataView({ era }) {
  const roles = era.roles;
  const mob = era.mobility;
  const mobWord = mob > 0.7 ? "Fluid" : mob > 0.45 ? "Semi-open" : mob > 0.25 ? "Hardening" : "Caste-rigid";
  // gold fill width scales to "share of all the group's wealth", 0..100% of track
  return (
    <>
      <div className="iq-viz-head">
        <div>
          <h2 className="iq-viz-title">A society in <em>cross-section</em></h2>
          <p className="iq-viz-sub">One band per role, all equal in height. The gold fill is the share of <em>all</em> the group's wealth that stratum holds — watch the apex gild while the broad base stays bare.</p>
        </div>
      </div>
      <div className="iq-viz-body">
        <div className="iq-strata-wrap">
          <div className="iq-mob-rail">
            <div className="iq-mob-arrows" style={{ opacity: 0.25 + mob * 0.75 }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M12 5v14M6 11l6-6 6 6"/></svg>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M12 5v14M6 13l6 6 6-6"/></svg>
            </div>
            <span className="mr-cap">Mobility · {mobWord}</span>
          </div>
          <div className="iq-strata">
            {window.IQ_STACK.map((id) => {
              const r = roles[id];
              const meta = IQ_META[id];
              const mult = r.pop > 1e-6 ? r.wealth / r.pop : 0;
              return (
                <div key={id} className="iq-band" style={{ flexGrow: 1, flexBasis: 0, minHeight: 44 }}>
                  <div className="iq-band-fillwrap"></div>
                  <div className="iq-band-fill" style={{ width: Math.max(r.wealth, 1.5) + "%", background: gild(id, mult) }}></div>
                  <div className="iq-band-row">
                    <div className="iq-band-id">
                      <RoleGlyph id={id} />
                      <span>
                        <span className="iq-band-name">{meta.label}</span>
                        <span className="iq-band-note">{era.notes[id]}</span>
                      </span>
                    </div>
                    <div className="iq-band-figs">
                      <div className="iq-fig"><span className="fl">of group</span><span className="fv">{iqPct(r.pop)}</span></div>
                      <div className="iq-fig"><span className="fl">of wealth</span><span className="fv gold">{iqPct(r.wealth)}</span></div>
                      <span className="iq-band-mult"><b>{iqMult(r.wealth, r.pop)}</b><br/>avg. wealth</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}

// ============================================================
//  VIEW 2 — CONTRIBUTION vs REWARD
// ============================================================
function ContributionView({ era }) {
  const [reward, setReward] = iqUseState("wealth"); // wealth (stock) | income (flow)
  const roles = era.roles;
  // scale: largest of any contribution / reward bar, with headroom
  let max = 1;
  window.IQ_STACK.forEach((id) => { max = Math.max(max, roles[id].contrib, roles[id][reward]); });
  max = max * 1.04;
  const dispro = window.iqDisproportion(roles, reward);

  return (
    <>
      <div className="iq-viz-head">
        <div>
          <h2 className="iq-viz-title">What each role <em>gives</em> — and <em>gets</em></h2>
          <p className="iq-viz-sub">The bar each role earns set against the bar it contributes. Where reward outruns contribution the gap glows gold; where it falls short it bleeds red. That gap is inequality's clearest signal.</p>
        </div>
        <div className="iq-tabs" style={{ position: "static", transform: "none", boxShadow: "none", padding: 4 }}>
          <button className={"iq-tab" + (reward === "wealth" ? " on" : "")} onClick={() => setReward("wealth")}>Stock</button>
          <button className={"iq-tab" + (reward === "income" ? " on" : "")} onClick={() => setReward("income")}>Flow</button>
        </div>
      </div>
      <div className="iq-viz-body">
        <div className="iq-div">
          <div className="iq-div-legend">
            <span className="k"><span className="sw" style={{ background: "rgba(232,224,205,0.28)", border: "1px solid rgba(232,224,205,0.5)" }}></span>Share of contribution</span>
            <span className="k"><span className="sw" style={{ background: "var(--brass)" }}></span>Share of {reward === "wealth" ? "wealth (stock)" : "income (flow)"}</span>
            <span className="k" style={{ color: "var(--ivory-faint)" }}>Disproportion index <b style={{ color: "var(--brass-bright)", fontFamily: "var(--serif)", fontSize: 15, marginLeft: 4 }}>{dispro.toFixed(2)}</b></span>
          </div>
          <div className="iq-div-rows">
            {window.IQ_STACK.map((id) => {
              const r = roles[id];
              const meta = IQ_META[id];
              const gap = r[reward] - r.contrib;
              const cW = (r.contrib / max) * 62;
              const rW = (r[reward] / max) * 62;
              return (
                <div key={id} className="iq-divrow">
                  <div className="iq-divrow-id">
                    <span className="n">{meta.label}</span>
                    <span className="g">{era.notes[id]}</span>
                  </div>
                  <div className="iq-divbars">
                    <div className="iq-divtrack">
                      <div className="iq-divbar contrib" style={{ left: 0, width: cW + "%", background: "rgba(232,224,205,0.26)", border: "1px solid rgba(232,224,205,0.5)" }}></div>
                      <div className="iq-divbar reward" style={{ left: 0, width: rW + "%", background: meta.color }}></div>
                      <span className="iq-divbar-cap" style={{ left: `calc(${cW}% + 8px)`, top: 0 }}>contributes {iqPct(r.contrib)}</span>
                      <span className="iq-divbar-cap" style={{ left: `calc(${rW}% + 8px)`, bottom: 0 }}>
                        keeps {iqPct(r[reward])}
                        <span className={"iq-gap-flag " + (gap >= 0 ? "surplus" : "deficit")} style={{ marginLeft: 8 }}>
                          {gap >= 0 ? "▲ +" : "▼ "}{Math.abs(Math.round(gap))} pts
                        </span>
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}

Object.assign(window, { StrataView, ContributionView, IQ_META, iqPct, iqMult, RoleGlyph, gild });
