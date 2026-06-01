/* ============================================================
   iq-views3.jsx — Power, Wealth & Inequality
   View 5: the MASTER TABLE — door-opening mechanisms → archy.
   Reads window.IQ_MASTER; lights the column for the scrubbed era.
   ============================================================ */

const IQ_KEY2IDX = { forager: 0, neolithic: 1, states: 2, classical: 3, feudal: 4, mercantile: 5, industrial: 6, present: 7 };

function MechanismsView({ era }) {
  const M = window.IQ_MASTER;
  const cur = IQ_KEY2IDX[era.key];
  const shade = (s) => (s <= 0 ? "rgba(232,224,205,0.035)" : `rgba(199,154,78,${0.10 + (s / 5) * 0.74})`);
  const cShade = (s) => (s <= 0 ? "rgba(232,224,205,0.035)" : `rgba(138,154,91,${0.12 + (s / 5) * 0.66})`);

  return (
    <>
      <div className="iq-viz-head">
        <div>
          <h2 className="iq-viz-title">The door-opening <em>mechanisms</em></h2>
          <p className="iq-viz-sub">Practised archy, on the right, tracks the sum of the mechanisms on the left — minus what the counter-current claws back. Each is scored 0–5; the column for the era you are viewing is lit.</p>
        </div>
      </div>
      <div className="iq-viz-body">
        <div className="iq-master">
          <div className="iq-mrow iq-mhead">
            <div className="iq-mlab"></div>
            {M.eras.map((e, i) => (
              <div key={i} className={"iq-mcol-h" + (i === cur ? " cur" : "")}>
                <span className="mh-roman">{e.roman}</span>
                <span className="mh-short">{e.short}</span>
              </div>
            ))}
          </div>

          {M.mechanisms.map((m, ri) => (
            <div className="iq-mrow" key={ri}>
              <div className="iq-mlab">{m.label}</div>
              {m.scores.map((s, i) => (
                <div key={i} className={"iq-mcell" + (i === cur ? " cur" : "")} style={{ background: shade(s) }}>{s > 0 ? s : ""}</div>
              ))}
            </div>
          ))}

          <div className="iq-mrow iq-mcounter">
            <div className="iq-mlab">{M.counter.label}</div>
            {M.counter.scores.map((s, i) => (
              <div key={i} className={"iq-mcell" + (i === cur ? " cur" : "")} style={{ background: cShade(s) }}>{s > 0 ? s : ""}</div>
            ))}
          </div>

          <div className="iq-mrow iq-mout">
            <div className="iq-mlab">Wealth Gini</div>
            {M.gini.map((g, i) => (
              <div key={i} className={"iq-mcell iq-mgini" + (i === cur ? " cur" : "")}>{g}</div>
            ))}
          </div>
          <div className="iq-mrow iq-mout">
            <div className="iq-mlab">Archy index <small>0–5</small></div>
            {M.archy.map((a, i) => (
              <div key={i} className={"iq-mcell iq-marchy" + (i === cur ? " cur" : "")}>{a.toFixed(1)}</div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

Object.assign(window, { MechanismsView });
