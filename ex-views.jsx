/* ============================================================
   ex-views.jsx — Part IV reader
   Renders one theme as a long-form trace: framing · (stack) ·
   era/form beats · the lesson. Exported to window.
   ============================================================ */

window.EX_ACCENT = { sorted: "#a8553e", cracks: "#8a9a5b", cases: "#6f93a8", matter: "#c79a4e" };

function ExReader({ theme }) {
  const group = window.EX_GROUPS.find((g) => g.id === theme.group);
  const ac = window.EX_ACCENT[theme.group] || "var(--brass)";
  return (
    <div className="ex-col ex-read-fade" key={theme.id} style={{ "--ac": ac }}>
      <p className="ex-kicker">{group.kicker} · {group.label}</p>
      <h2 className="ex-title">{theme.title}</h2>
      <p className="ex-tagline">{theme.tagline}</p>
      <p className="ex-framing">{theme.framing}</p>

      {theme.stack && (
        <div className="ex-stackrow">
          <p className="ex-stack-h">It ran through the whole institutional stack</p>
          <div className="ex-chips">
            {window.EX_STACK.map((s, i) => (
              <React.Fragment key={s}>
                {i > 0 && <span className="ex-chip-arrow">›</span>}
                <span className="ex-chip">{s}</span>
              </React.Fragment>
            ))}
          </div>
        </div>
      )}

      <p className="ex-trace-h">Traced across the arc</p>
      <div className="ex-beats">
        {theme.beats.map((b, i) => (
          <div className="ex-beat" key={i}>
            <span className="ex-beat-mark">{b.mark}</span>
            <span className="ex-beat-sub">{b.sub}</span>
            <p className="ex-beat-text">{b.text}</p>
          </div>
        ))}
      </div>

      <div className="ex-lesson">
        <p className="ex-lesson-h">The lesson</p>
        <p>{theme.lesson}</p>
      </div>
    </div>
  );
}

Object.assign(window, { ExReader });
