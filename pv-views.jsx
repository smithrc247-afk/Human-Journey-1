/* ============================================================
   pv-views.jsx — Part V
   The debate panel (objection | reply | concession) and the
   synthesis panel (what survives). Exported to window.
   ============================================================ */

function PVDebate({ ob }) {
  return (
    <div className="pv-wrap pv-read-fade" key={ob.id}>
      <header className="pv-dh">
        <span className="pv-dh-num">Objection {ob.num}</span>
        <h2 className="pv-dh-title">{ob.title}</h2>
        {ob.attribution && <p className="pv-dh-attr">{ob.attribution}</p>}
        <div className="pv-dh-strength">
          <span className="pv-str-lab">How hard it hits</span>
          <span className="pv-str-meter"><span style={{ width: (ob.dent * 100) + "%" }}></span></span>
          <span className="pv-str-word">{ob.strength}</span>
        </div>
      </header>

      <div className="pv-debate">
        <div className="pv-side obj">
          <p className="pv-side-h">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 9v4m0 4h.01M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z"/></svg>
            The objection
          </p>
          <p className="pv-lead">{ob.objection.lead}</p>
          <ul className="pv-points">
            {ob.objection.points.map((p, i) => <li key={i}>{p}</li>)}
          </ul>
        </div>

        <div className="pv-side reply">
          <p className="pv-side-h">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H8l-5 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
            The reply
          </p>
          <p className="pv-lead">{ob.reply.lead}</p>
          <ul className="pv-points">
            {ob.reply.points.map((p, i) => <li key={i}>{p}</li>)}
          </ul>
        </div>

        <div className="pv-seam"><span className="pv-seam-badge">vs</span></div>
      </div>

      <div className="pv-concession">
        <span className="pv-conc-ic">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3v18M8 21h8M3 7h18M6 7l-3 7h6zM18 7l-3 7h6z"/></svg>
        </span>
        <div className="pv-conc-txt">
          <p className="pv-conc-h">The concession</p>
          <p>{ob.concession}</p>
        </div>
      </div>
    </div>
  );
}

function PVSurvives({ data }) {
  return (
    <div className="pv-syn pv-read-fade">
      <p className="pv-syn-kicker">The honest conclusion</p>
      <h2>{data.title}</h2>
      <p className="pv-syn-lead">{data.lead}</p>
      <ul className="pv-claims">
        {data.claims.map((c, i) => (
          <li key={i}><span className="pv-cl-n">{String(i + 1).padStart(2, "0")}</span><span>{c}</span></li>
        ))}
      </ul>
      <p className="pv-syn-close">{data.close}</p>
    </div>
  );
}

Object.assign(window, { PVDebate, PVSurvives });
