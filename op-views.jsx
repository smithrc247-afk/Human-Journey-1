/* ============================================================
   op-views.jsx — The Origins of Power (visual edition)
   A hybrid, visual-first era view: a symbolic "society" diagram
   is the hero; the deep prose lives in click-to-open panels;
   captions stay light. Era transitions animate.
   ============================================================ */
const { useState: opUseState, useRef: opUseRef, useEffect: opUseEffect } = React;

const OP_THREAD_BY_ID = {};
window.OP_THREADS.forEach((t) => { OP_THREAD_BY_ID[t.id] = t; });
const OP_PERSON = "M12 11.6a3.5 3.5 0 100-7 3.5 3.5 0 000 7zM5.2 20.6a6.8 6.8 0 0113.6 0z";

/* ---- concept tooltip (portaled out of the zoomed stage) ---- */
function OPConcept({ term }) {
  const [show, setShow] = opUseState(false);
  const [pos, setPos] = opUseState({ left: 0, top: 0, flip: false });
  const ref = opUseRef(null);
  const def = window.OP_CONCEPTS[term.toLowerCase()] || window.OP_CONCEPTS[term];
  const enter = () => {
    const r = ref.current.getBoundingClientRect();
    const left = Math.max(12, Math.min(r.left + r.width / 2 - 140, window.innerWidth - 292));
    const flip = r.bottom > window.innerHeight - 170;
    setPos({ left, top: flip ? r.top - 8 : r.bottom + 8, flip });
    setShow(true);
  };
  if (!def) return <span>{term}</span>;
  return (
    <span ref={ref} className="op-concept" tabIndex={0}
      onMouseEnter={enter} onMouseLeave={() => setShow(false)} onFocus={enter} onBlur={() => setShow(false)}>
      {term}
      {show && ReactDOM.createPortal(
        <span className="op-tip" style={{ left: pos.left, top: pos.top, transform: pos.flip ? "translateY(-100%)" : "none" }}>
          <span className="tip-term">{term}</span><span className="tip-def">{def}</span>
        </span>, document.body)}
    </span>
  );
}
function opRich(text, key) {
  return String(text).split(/\{\{(.*?)\}\}/g).map((p, i) =>
    i % 2 === 1 ? <OPConcept key={key + "c" + i} term={p} /> : <React.Fragment key={key + "t" + i}>{p}</React.Fragment>);
}

/* ---- deep-time scale device -------------------------------- */
function OPDeepTime({ eras, activeId, onSelect }) {
  const total = eras.reduce((s, e) => s + (e.span.from - e.span.to), 0);
  let acc = 0;
  const segs = eras.map((e) => { const w = (e.span.from - e.span.to) / total * 100; const seg = { e, w, left: acc, mid: acc + w / 2 }; acc += w; return seg; });
  const era1w = segs[0].w;
  const active = segs.find((s) => s.e.id === activeId) || segs[0];
  return (
    <div className="op-deeptime">
      <div className="op-dt-head"><span className="op-dt-h">Deep time, to scale</span><span className="op-dt-note">Era I is ~95% of the human story</span></div>
      <div className="op-dt-bar">
        {segs.map((s) => (
          <div key={s.e.id} className={"op-dt-seg" + (s.e.id === activeId ? " on" : "")}
            style={{ flexGrow: s.w, background: s.e.id === activeId ? s.e.accent : "color-mix(in oklab, " + s.e.accent + " 26%, transparent)", opacity: s.e.id === activeId ? 1 : 0.5 }}
            title={s.e.title + " · " + s.e.dates} onClick={() => onSelect(s.e)}></div>
        ))}
        <span className="op-dt-here" style={{ left: active.mid + "%", "--ec": active.e.accent }}>you are here</span>
        <span className="op-dt-rec" style={{ left: era1w + "%" }}>all recorded history →</span>
      </div>
      <div className="op-dt-ticks">
        <span className="op-dt-tick t-left" style={{ left: "0%" }}>≈300,000&nbsp;BCE</span>
        <span className="op-dt-tick t-right" style={{ left: "100%" }}>now</span>
      </div>
    </div>
  );
}

/* ---- HERO A : the society diagram (who holds power) -------- */
function OPSociety({ era }) {
  const soc = window.OP_SOCIETY[era.id];
  if (!soc) return null;
  const ac = era.accent;
  const yOf = (p) => (1 - p) * 76 + 9;            // power → vertical %
  const figSize = (p) => 22 + p * 30;             // power → px
  // pyramid backdrop geometry from top & bottom tiers
  const top = soc.tiers[0], bot = soc.tiers[soc.tiers.length - 1];
  const apexY = yOf(top.power), baseY = yOf(bot.power) + 6;
  return (
    <div className="op-soc" key={era.id}>
      <svg className="op-soc-bg" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
        {soc.shape === "pyramid" && <polygon points={`50,${apexY - 4} 90,${baseY + 6} 10,${baseY + 6}`} fill={ac} fillOpacity="0.07" stroke={ac} strokeOpacity="0.18" strokeWidth="0.4" />}
        {soc.shape === "flat" && <rect x="10" y={yOf(top.power) - 5} width="80" height="16" rx="3" fill={ac} fillOpacity="0.08" stroke={ac} strokeOpacity="0.2" strokeWidth="0.4" />}
        {soc.shape === "emerging" && <polygon points={`50,${apexY - 3} 84,${baseY + 6} 16,${baseY + 6}`} fill={ac} fillOpacity="0.06" stroke={ac} strokeOpacity="0.16" strokeWidth="0.4" strokeDasharray="2 2" />}
      </svg>

      {/* power axis label */}
      <div className="op-soc-axis"><span>more power</span><span className="op-soc-axis-line"></span><span>less</span></div>

      {soc.tiers.map((tr, ti) => (
        <div className="op-soc-tier" key={ti} style={{ top: yOf(tr.power) + "%", animationDelay: (ti * 90 + 80) + "ms" }}>
          <div className="op-soc-figs">
            {Array.from({ length: tr.n }).map((_, i) => (
              <svg key={i} className="op-soc-fig" style={{ width: figSize(tr.power), height: figSize(tr.power), color: ac, opacity: 0.4 + tr.power * 0.55, animationDelay: (ti * 90 + i * 28 + 100) + "ms" }} viewBox="0 0 24 24"><path d={OP_PERSON} fill="currentColor" /></svg>
            ))}
          </div>
          <div className="op-soc-lab"><span className="sl-n">{tr.label}</span>{tr.note && <span className="sl-note">{tr.note}</span>}</div>
        </div>
      ))}

      {/* forager-only: the leveling ceiling + a riser being pulled back down */}
      {soc.leveling && (
        <>
          <div className="op-soc-ceiling" style={{ top: yOf(top.power) - 11 + "%" }}>
            <span className="op-soc-ceiling-lab">no one rises above the band</span>
          </div>
          <div className="op-soc-riser" style={{ top: yOf(top.power) - 9 + "%" }}>
            <svg viewBox="0 0 24 24" style={{ color: ac }}><path d={OP_PERSON} fill="currentColor" /></svg>
            <svg className="op-soc-push" viewBox="0 0 24 24"><path d="M12 4v14M6 13l6 6 6-6" fill="none" stroke="#d98463" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </div>
          <div className="op-soc-levels">
            {soc.leveling.map((l) => <span key={l} className="op-soc-level">{l}</span>)}
          </div>
        </>
      )}
    </div>
  );
}

/* ---- HERO B : the causal "machine of power" ---------------- */
const OPM_W = 620, OPM_H = 300;
function opCenter(n) { return { x: n.x / 100 * OPM_W, y: n.y / 100 * OPM_H }; }
function OPCausalMap({ era }) {
  const nodes = window.OP_CAUSAL_NODES, edges = window.OP_CAUSAL_EDGES;
  const state = (era.causal && era.causal.edges) || {};
  const byId = {}; nodes.forEach((n) => { byId[n.id] = n; });
  const ac = era.accent;
  return (
    <div className="op-machine" key={era.id}>
      <svg viewBox={"0 0 " + OPM_W + " " + OPM_H} role="img" aria-label="How power converts into permanent rule">
        <defs><marker id="op-arrow2" markerWidth="9" markerHeight="9" refX="6" refY="4.5" orient="auto"><path d="M0 0L9 4.5L0 9z" fill={ac} /></marker></defs>
        {edges.map((ed) => {
          const a = opCenter(byId[ed.from]), b = opCenter(byId[ed.to]);
          const st = state[ed.id] || "cut";
          const ang = Math.atan2(b.y - a.y, b.x - a.x);
          const tA = { x: a.x + Math.cos(ang) * 66, y: a.y + Math.sin(ang) * 26 };
          const tB = { x: b.x - Math.cos(ang) * 66, y: b.y - Math.sin(ang) * 26 };
          const mx = (a.x + b.x) / 2, my = (a.y + b.y) / 2;
          if (st === "open") return <line key={ed.id} x1={tA.x} y1={tA.y} x2={tB.x} y2={tB.y} stroke={ac} strokeWidth="2" markerEnd="url(#op-arrow2)" />;
          if (st === "forming") return <line key={ed.id} x1={tA.x} y1={tA.y} x2={tB.x} y2={tB.y} stroke={ac} opacity="0.6" strokeWidth="2" strokeDasharray="7 6" markerEnd="url(#op-arrow2)" />;
          const px = Math.cos(ang + Math.PI / 2), py = Math.sin(ang + Math.PI / 2);
          return (
            <g key={ed.id}>
              <line x1={tA.x} y1={tA.y} x2={tB.x} y2={tB.y} stroke="#b9b3a4" opacity="0.22" strokeDasharray="4 6" strokeWidth="2" />
              <line x1={mx - px * 9 - Math.cos(ang) * 4} y1={my - py * 9 - Math.sin(ang) * 4} x2={mx + px * 9 - Math.cos(ang) * 4} y2={my + py * 9 - Math.sin(ang) * 4} stroke="#d98463" strokeWidth="2.2" />
              <line x1={mx - px * 9 + Math.cos(ang) * 4} y1={my - py * 9 + Math.sin(ang) * 4} x2={mx + px * 9 + Math.cos(ang) * 4} y2={my + py * 9 + Math.sin(ang) * 4} stroke="#d98463" strokeWidth="2.2" />
            </g>
          );
        })}
        {nodes.map((n) => {
          const c = opCenter(n), w = 128, h = 42;
          const faded = era.id === "forager" && n.id === "surplus";
          return (
            <g key={n.id} opacity={faded ? 0.4 : 1}>
              <rect x={c.x - w / 2} y={c.y - h / 2} width={w} height={h} rx="6" fill="rgba(20,24,26,0.96)" stroke={faded ? "#b9b3a4" : ac} strokeOpacity={faded ? 0.4 : 0.75} strokeWidth="1.4" strokeDasharray={faded ? "4 4" : "none"} />
              <text x={c.x} y={c.y + 4.5} textAnchor="middle" fontFamily="var(--serif)" fontSize="15" fontWeight="600" fill="#ece5d6">{n.label}</text>
            </g>
          );
        })}
      </svg>
      <div className="op-machine-legend">
        <span className="op-cl"><span className="cl-m" style={{ borderTop: "2px dashed #d98463" }}></span>Severed</span>
        <span className="op-cl"><span className="cl-m" style={{ borderTop: "2px dashed " + ac }}></span>Forming</span>
        <span className="op-cl"><span className="cl-m" style={{ borderTop: "2px solid " + ac }}></span>Open</span>
      </div>
    </div>
  );
}

/* ---- legitimacy gauge (compact) ---------------------------- */
function OPLegitGauge({ era, onOpen }) {
  const lg = era.legitimacy || { fill: 0, claim: "—", detail: "" };
  return (
    <button className="op-gauge" onClick={onOpen} style={{ "--ec": era.accent }}>
      <span className="op-gauge-h">The claim to rule</span>
      <span className="op-gauge-meter"><span style={{ width: (lg.fill * 100) + "%" }}></span></span>
      <span className="op-gauge-claim">{lg.claim}</span>
      <span className="op-gauge-detail">{lg.detail}</span>
      <span className="op-gauge-more">Compare across eras →</span>
    </button>
  );
}

/* ---- legitimacy comparative (read-deeper) ------------------ */
function OPLegitGrid({ eras }) {
  const three = eras.slice(0, 3);
  return (
    <div>
      <div className="op-legit-grid">
        {three.map((e, i) => (
          <div key={e.id} className={"op-legcell" + (i > 0 ? " future" : "")} style={{ "--ec": e.accent }}>
            <div className="lg-era">Era {e.num}</div><div className="lg-title">{e.title}</div>
            <div className="op-legmeter"><span style={{ width: (e.legitimacy.fill * 100) + "%" }}></span></div>
            <div className="lg-claim">{e.legitimacy.claim}</div><div className="lg-detail">{e.legitimacy.detail}</div>
          </div>
        ))}
      </div>
      <p className="op-panel-note">Legitimacy is the machinery that makes domination feel ordained rather than imposed. Era I's near-emptiness beside the god-kings of Era III is the sharpest comparison in the piece — it goes from nothing to total in one step.</p>
    </div>
  );
}

/* ---- thread tiles ------------------------------------------ */
function OPThreadTiles({ era, onOpen }) {
  const caps = era.threadCaps || {};
  const full = era.threads || {};
  return (
    <div className="op-tiles">
      {window.OP_THREADS.map((t) => {
        const has = !!full[t.id];
        const data = full[t.id];
        const sig = data && data.signature;
        return (
          <button key={t.id} className={"op-tile" + (sig ? " sig" : "") + (has ? "" : " thin")}
            style={{ "--ec": era.accent }} onClick={() => has && onOpen({ kind: "thread", id: t.id })} disabled={!has}>
            <span className="op-tile-ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d={t.glyph} /></svg></span>
            <span className="op-tile-lab">{t.label}{sig && <span className="op-tile-sig">★</span>}</span>
            <span className="op-tile-cap">{has ? (caps[t.id] || t.question) : "Thread builds with this era"}</span>
            {has && <span className="op-tile-more">Read deeper →</span>}
          </button>
        );
      })}
    </div>
  );
}

/* ---- the mechanism : threads (force bars) → degree of power -- */
function OPEngine({ era, factors }) {
  const ac = era.accent;
  const checks = (factors && factors.checks) || window.OP_CHECKS[era.id] || {};
  const doors = (factors && factors.doors) || window.OP_DOORS[era.id] || {};
  const pWith = factors ? factors.pWith : window.opPowerWith(era.id);
  const pOver = factors ? factors.pOver : window.opPowerOver(era.id);
  const GREEN = "#8a9a5b", RED = "#c2705f";
  const verdict = pWith > pOver + 0.12 ? "Power held mostly with others"
    : pOver > pWith + 0.12 ? "Power held mostly over others"
    : "Power hangs in the balance";

  const factorRow = (def, val, color) => (
    <div className="op-frow" key={def.k}>
      <span className="op-frow-lab">{def.label}<span className="op-frow-hint">{def.hint}</span></span>
      <span className="op-ftrack"><span className="op-ffill" style={{ width: (val * 100) + "%", background: color }}></span></span>
      <span className="op-fpct">{Math.round(val * 100)}</span>
    </div>
  );
  const meter = (lab, val, color, cls) => (
    <div className="op-pmeter">
      <span className={"op-pm-lab " + cls}>{lab}</span>
      <div className="op-pm-bar"><div className="op-pm-fill" style={{ height: (val * 100) + "%", background: color }}></div></div>
      <span className="op-pm-val" style={{ color: color }}>{Math.round(val * 100)}</span>
    </div>
  );

  return (
    <section className="op-engine" style={{ "--ec": ac }}>
      <div className="op-eng-head"><span className="sh-t">How power works</span><span className="sh-line"></span><span className="op-eng-key">the checks vs the door-openers \u2192 power with / over</span></div>

      <div className="op-mech2">
        <div className="op-factors">
          <p className="op-mech-cap">The checks sustain power held <b>with</b> others; the door-openers turn it into power held <b>over</b> them. Their balance sets the two meters.</p>
          <div className="op-fgroup">
            <p className="op-fg-h with">What keeps it in check<span>sustains power <b>with</b></span></p>
            {window.OP_CHECK_DEFS.map((d) => factorRow(d, checks[d.k] || 0, GREEN))}
          </div>
          <div className="op-fgroup">
            <p className="op-fg-h over">How &ldquo;with&rdquo; becomes &ldquo;over&rdquo;<span>opens power <b>over</b></span></p>
            {window.OP_DOOR_DEFS.map((d) => factorRow(d, doors[d.k] || 0, RED))}
          </div>
        </div>

        <div className="op-powers">
          {meter("Power WITH", pWith, GREEN, "with")}
          {meter("Power OVER", pOver, RED, "over")}
        </div>
      </div>
      <p className="op-verdict" style={{ color: pOver > pWith ? RED : GREEN }}>{verdict}</p>
      {era.id === "industrial" && (
        <p className="op-annote"><span className="op-annote-tag">The Great Compression</span>For the first time since the foragers, power-with rebounds — unions, the franchise and the welfare state bend the curve back down.</p>
      )}
    </section>
  );
}

/* ---- evidence plates (user-fillable image slots) ----------- */
function OPEvidence({ era }) {
  const items = (window.OP_EVIDENCE && window.OP_EVIDENCE[era.id]) || [];
  if (!items.length) return null;
  return (
    <div className="op-evidence">
      <p className="op-ev-h">Evidence — drop in your own images</p>
      <div className="op-ev-row">
        {items.map((it, i) => (
          <figure className="op-ev-fig" key={i}>
            <image-slot id={"op-" + era.id + "-" + i} shape="rounded" radius="8" placeholder={it.label} style={{ width: "100%", height: "128px", display: "block" }}></image-slot>
            <figcaption>{it.label}</figcaption>
          </figure>
        ))}
      </div>
    </div>
  );
}

/* ---- read-deeper slide-in panel ---------------------------- */
function OPReadPanel({ panel, era, eras, onClose }) {
  opUseEffect(() => {
    if (!panel) return;
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [panel]);
  if (!panel) return null;
  let title = "", kicker = "", body = null;
  if (panel.kind === "thread") {
    const t = OP_THREAD_BY_ID[panel.id], d = window.opThreads(era)[panel.id];
    kicker = t.label + (d.signature ? " · signature thread" : ""); title = d.title;
    body = (
      <>
        <p className="op-panel-body">{opRich(d.body, panel.id)}</p>
        {d.list && <ol className="op-leveling">{d.list.map((it, i) => (
          <li key={i}><span><span className="lv-k">{opRich(it.k, panel.id + "k" + i)}</span><span className="lv-v">{opRich(it.v, panel.id + "v" + i)}</span></span></li>))}</ol>}
        {d.close && <p className="op-tb-close">{opRich(d.close, panel.id + "close")}</p>}
      </>
    );
  } else if (panel.kind === "readings") {
    kicker = "Two readings"; title = "A contested account";
    body = (
      <>
        <div className="op-rcard"><p className="rc-l">{era.conventional.label}</p><p>{era.conventional.body}</p></div>
        <div className="op-rcard rev"><p className="rc-l">{era.revision.label}</p><p>{era.revision.body}</p></div>
        {era.contested && <p className="op-panel-note"><b>Contested · {era.contested.level}.</b> {era.contested.note}</p>}
      </>
    );
  } else if (panel.kind === "legit") {
    kicker = "Comparative"; title = "The claim to rule, across eras";
    body = <OPLegitGrid eras={eras} />;
  } else if (panel.kind === "society") {
    kicker = "Who holds power"; title = era.title;
    body = <p className="op-panel-body">{window.OP_SOCIETY[era.id] ? window.OP_SOCIETY[era.id].caption : ""}</p>;
  } else if (panel.kind === "machine") {
    kicker = "The machine of power"; title = "Severed, forming, or closed";
    body = <p className="op-panel-body">{(era.causal && era.causal.caption) || "Every kind of power can convert into another — military to economic to sacred to political. Watch the arrows go from severed (Era I), to forming (Era II), to a closed self-reinforcing loop (Era III)."}</p>;
  }
  return ReactDOM.createPortal(
    <div className="op-panel-wrap" onMouseDown={onClose}>
      <aside className="op-panel" style={{ "--ec": era.accent }} onMouseDown={(e) => e.stopPropagation()}>
        <button className="op-panel-x" onClick={onClose} aria-label="Close">✕</button>
        <p className="op-panel-kicker">{kicker}</p>
        <h3 className="op-panel-title">{title}</h3>
        {body}
      </aside>
    </div>, document.body);
}

/* ---- assembled visual era view ----------------------------- */
function OPEraVisual({ era, eras, focusThread, factors }) {
  const [panel, setPanel] = opUseState(null);
  const soc = window.OP_SOCIETY[era.id];

  // a thread chosen in the rail's "by thread" mode opens its panel
  opUseEffect(() => {
    if (focusThread && window.opThreads(era)[focusThread]) setPanel({ kind: "thread", id: focusThread });
  }, [focusThread, era.id]);

  return (
    <article className="op-era">
      <header className="op-erahead">
        <div className="op-eh-left">
          <div className="op-kicker"><span className="k-num">Era {era.num}</span><span className="k-line"></span></div>
          <h2>{era.title}</h2>
          {era.subtitle && <p className="op-eh-sub">{era.subtitle}</p>}
          <p className="op-eh-meta"><span className="op-dates">{era.dates}</span>
            {era.contested && <button className="op-contested" onClick={() => era.conventional ? setPanel({ kind: "readings" }) : null} title={era.contested.note}><span className="cc-dot"></span>Contested · <b>{era.contested.level}</b></button>}
          </p>
        </div>
      </header>

      <div className="op-herowrap">
        <div className="op-hero-main">
          <OPSociety era={era} />
          <p className="op-hero-cap">
            {soc && soc.caption}
            <button className="op-cap-more" onClick={() => setPanel({ kind: "society" })}>read deeper →</button>
          </p>
        </div>
        <aside className="op-hero-side">
          <OPLegitGauge era={era} onOpen={() => setPanel({ kind: "legit" })} />
          {era.conventional ? (
            <button className="op-readings" onClick={() => setPanel({ kind: "readings" })}>
              <span className="op-rd-h">Two readings</span>
              <span className="op-rd-line"><em>Received:</em> hierarchy was the inevitable result of surplus.</span>
              <span className="op-rd-line on"><em>Better:</em> {era.id === "forager" ? "flatness was an achievement, actively maintained." : "people experimented; inequality was not automatic."}</span>
              <span className="op-tile-more">Read deeper →</span>
            </button>
          ) : (
            era.framing && <div className="op-readings static"><span className="op-rd-h">In brief</span><span className="op-rd-line">{era.framing}</span></div>
          )}
        </aside>
      </div>

      <OPEngine era={era} factors={factors} />
      <OPEvidence era={era} />

      <p className="op-closing"><b>A contested history.</b> A synthesis, not a verdict — scholars such as Graeber and Wengrow dispute the tidy line from agriculture to inequality. Where the evidence is thin or fought over, this piece marks it rather than smoothing it away.</p>

      <OPReadPanel panel={panel} era={era} eras={eras} onClose={() => setPanel(null)} />
    </article>
  );
}

/* ---- "By thread" : one thread traced across all eight eras ---- */
function OPThreadChart({ threadId, activeId, eras, onPick }) {
  const W = 760, H = 330, padL = 44, padR = 22, padT = 22, padB = 50;
  const x0 = padL, x1 = W - padR, yBot = H - padB, yTop = padT;
  const n = eras.length;
  const xi = (i) => x0 + (n === 1 ? 0 : i * (x1 - x0) / (n - 1));
  const yv = (v) => yBot - v * (yBot - yTop);
  const isResist = threadId === "resistance";
  const lineColor = isResist ? "#d98463" : "#e0b766";
  const pts = eras.map((e, i) => ({ e, x: xi(i), v: (window.OP_FORCE[e.id] || {})[threadId] || 0 }));
  const degPts = eras.map((e, i) => ({ x: xi(i), v: window.opDegree(e.id) }));
  const toPath = (arr) => arr.map((p, i) => (i ? "L" : "M") + p.x.toFixed(1) + " " + yv(p.v).toFixed(1)).join(" ");
  const linePath = toPath(pts);
  const areaPath = linePath + " L" + pts[n - 1].x.toFixed(1) + " " + yBot + " L" + pts[0].x.toFixed(1) + " " + yBot + " Z";
  const grid = [0, 0.25, 0.5, 0.75, 1];
  return (
    <div className="op-tchart">
      <svg viewBox={"0 0 " + W + " " + H} role="img" aria-label="The thread's force across the eight eras">
        <defs><linearGradient id="op-tcg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={lineColor} stopOpacity="0.22" /><stop offset="1" stopColor={lineColor} stopOpacity="0" /></linearGradient></defs>
        {grid.map((g) => (
          <g key={g}>
            <line x1={x0} y1={yv(g)} x2={x1} y2={yv(g)} stroke="rgba(232,224,205,0.09)" strokeWidth="1" />
            <text x={x0 - 8} y={yv(g) + 3} textAnchor="end" fontFamily="var(--mono)" fontSize="9" fill="#8a857a">{Math.round(g * 100)}</text>
          </g>
        ))}
        <path d={toPath(degPts)} fill="none" stroke="#b9b3a4" strokeOpacity="0.5" strokeWidth="1.5" strokeDasharray="5 5" />
        <path d={areaPath} fill="url(#op-tcg)" />
        <path d={linePath} fill="none" stroke={lineColor} strokeWidth="2.5" strokeLinejoin="round" />
        {pts.map((p) => (
          <g key={p.e.id} style={{ cursor: "pointer" }} onClick={() => onPick(p.e.id)}>
            <circle cx={p.x} cy={yv(p.v)} r="15" fill="transparent" />
            {p.e.id === activeId && <circle cx={p.x} cy={yv(p.v)} r="10" fill="none" stroke={p.e.accent} strokeWidth="1.5" opacity="0.7" />}
            <circle cx={p.x} cy={yv(p.v)} r={p.e.id === activeId ? 6.5 : 5} fill={p.e.accent} stroke="#0d100e" strokeWidth="1.5" />
            <text x={p.x} y={yBot + 18} textAnchor="middle" fontFamily="var(--serif)" fontSize="13" fontWeight="600" fill={p.e.id === activeId ? "#ece5d6" : "#8a857a"}>{p.e.num}</text>
          </g>
        ))}
        <line x1={x0} y1={yBot} x2={x1} y2={yBot} stroke="rgba(232,224,205,0.2)" />
      </svg>
    </div>
  );
}

function OPThreadView({ threadId, activeId, eras }) {
  const t = OP_THREAD_BY_ID[threadId];
  const [panelEra, setPanelEra] = opUseState(null);
  const isResist = threadId === "resistance";
  return (
    <article className="op-tview">
      <header className="op-erahead">
        <div className="op-eh-left">
          <div className="op-kicker"><span className="k-num" style={{ color: "var(--brass)" }}>Thread across time</span><span className="k-line"></span></div>
          <h2>{t.label}</h2>
          <p className="op-eh-sub">{t.question}</p>
        </div>
        <span className="op-tb-ic" style={{ width: 30, height: 30, color: isResist ? "#d98463" : "var(--brass-bright)" }}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d={t.glyph} /></svg></span>
      </header>
      <div className="op-tchart-wrap">
        <div className="op-tchart-head">
          <span className="op-tc-y">{isResist ? "Dispersing force →" : "Concentrating force →"}</span>
          <span className="op-tc-legend">
            <span style={{ color: isResist ? "#d98463" : "var(--brass-bright)" }}>— {t.label}</span>
            <span style={{ color: "var(--ivory-dim)" }}>┄ degree of power</span>
          </span>
        </div>
        <OPThreadChart threadId={threadId} activeId={activeId} eras={eras} onPick={(id) => setPanelEra(eras.find((e) => e.id === id))} />
        <p className="op-tc-cap">Eight eras on the axis, this thread's force on the rise. Click any point to read how <b>{t.label.toLowerCase()}</b> worked in that era; use ← / → to move the marker. The dashed line is the overall <b>degree of power</b>, for comparison.</p>
      </div>
      {panelEra && <OPReadPanel panel={{ kind: "thread", id: threadId }} era={panelEra} eras={eras} onClose={() => setPanelEra(null)} />}
    </article>
  );
}

/* ---- the opening primer : what power is ---- */
function OPPrimer({ onEnter }) {
  const P = window.OP_PRIMER;
  return (
    <article className="op-primer">
      <header className="op-pr-head">
        <div className="op-kicker"><span className="k-num" style={{ color: "var(--brass)" }}>{P.kicker}</span><span className="k-line"></span></div>
        <h2 className="op-pr-title">{P.title}</h2>
        <p className="op-pr-lead">{P.lead}</p>
      </header>

      <div className="op-pr-faces">
        {P.faces.map((f) => (
          <div key={f.id} className={"op-pr-face " + f.id}>
            <div className="op-pr-face-h"><span className="pf-lab">{f.label}</span><span className="pf-tag">{f.tag}</span></div>
            <p className="op-pr-face-body">{f.body}</p>
            <div className="op-pr-marks">{f.marks.map((m) => <span key={m} className="pf-mark">{m}</span>)}</div>
          </div>
        ))}
        <div className="op-pr-arrow">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
          <span>Here we explore how one changes to the other</span>
        </div>
      </div>

      <div className="op-pr-cols">
        <section className="op-pr-block checks">
          <h3>{P.checks.h}</h3>
          <p className="op-pr-bi">{P.checks.intro}</p>
          <ol className="op-pr-list">{P.checks.items.map((it) => <li key={it.k}><span className="li-k">{it.k}</span><span className="li-v">{it.v}</span></li>)}</ol>
          <p className="op-pr-bc">{P.checks.close}</p>
        </section>
        <section className="op-pr-block turn">
          <h3>{P.turn.h}</h3>
          <p className="op-pr-bi">{P.turn.intro}</p>
          <ol className="op-pr-list">{P.turn.items.map((it) => <li key={it.k}><span className="li-k">{it.k}</span><span className="li-v">{it.v}</span></li>)}</ol>
          <p className="op-pr-bc">{P.turn.close}</p>
        </section>
      </div>

      <p className="op-pr-outro">{P.outro}</p>
      <button className="op-pr-cta" onClick={onEnter}>Enter Era I — Forager egalitarianism
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
      </button>
    </article>
  );
}

Object.assign(window, { OPConcept, opRich, OPDeepTime, OPSociety, OPCausalMap, OPThreadTiles, OPEngine, OPThreadChart, OPThreadView, OPLegitGauge, OPLegitGrid, OPEvidence, OPReadPanel, OPEraVisual, OPPrimer });
