/* ============================================================
   gallery.jsx — caption photo gallery + full Gallery view
   Exposes:
     window.CaptionGallery({ segIdx, isMobile, label, galleryLabel, onOpenGallery })
     window.GalleryView({ open, onClose, getLabel, title, closeLabel })
   - Desktop: an auto-advancing carousel card (pause on hover) in the
     lower-right, with a "Gallery" link above the photo.
   - Mobile: a "Photos" pill + "Gallery" link on the caption; the pill
     opens a fullscreen viewer.
   - Gallery view: a fullscreen, scrollable grid of every beat's photos,
     click any to enlarge.
   Photos come from window.GALLERY[segIdx].
   ============================================================ */
(function () {
  const { useState, useEffect, useRef, useCallback } = React;

  function photosFor(segIdx) {
    const g = window.GALLERY || {};
    const arr = g[segIdx];
    return Array.isArray(arr) && arr.length ? arr : null;
  }
  function allIndices() {
    return Object.keys(window.GALLERY || {}).map(Number).sort((a, b) => a - b);
  }

  // shared auto-advance (paused while `paused` true)
  function useAuto(len, paused, ms) {
    const [idx, setIdx] = useState(0);
    const lenRef = useRef(len); lenRef.current = len;
    useEffect(() => { setIdx(0); }, [len]);
    useEffect(() => {
      if (paused || len < 2) return;
      const id = setInterval(() => setIdx((i) => (i + 1) % lenRef.current), ms);
      return () => clearInterval(id);
    }, [len, paused, ms]);
    return [Math.min(idx, len - 1), setIdx];
  }

  function Meta({ p }) {
    if (!p.caption && !p.credit) return null;
    return (
      <div className="cg-meta">
        {p.caption && <span className="cg-cap">{p.caption}</span>}
        {p.credit && <span className="cg-credit">{p.credit}</span>}
      </div>
    );
  }

  // ---- desktop floating card ----
  function GalleryCard({ photos, galleryLabel, onOpenGallery }) {
    const [hover, setHover] = useState(false);
    const [idx, setIdx] = useAuto(photos.length, hover, 4600);
    const p = photos[idx];
    return (
      <div className="cap-gallery" onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}>
        <button className="cg-gallery-link" onClick={onOpenGallery}>
          {galleryLabel}
          <svg viewBox="0 0 24 24" width="11" height="11" aria-hidden="true">
            <rect x="3" y="4" width="8" height="8" rx="1" fill="none" stroke="currentColor" strokeWidth="2"/>
            <rect x="13" y="4" width="8" height="8" rx="1" fill="none" stroke="currentColor" strokeWidth="2"/>
            <rect x="3" y="14" width="8" height="8" rx="1" fill="none" stroke="currentColor" strokeWidth="2"/>
            <rect x="13" y="14" width="8" height="8" rx="1" fill="none" stroke="currentColor" strokeWidth="2"/>
          </svg>
        </button>
        <div className="cg-frame">
          {photos.map((ph, i) => (
            <img key={ph.src} src={ph.src} alt={ph.caption || ""} loading="lazy" draggable="false"
              className={"cg-img" + (i === idx ? " on" : "")} />
          ))}
          <span className="cg-corner"></span>
        </div>
        <Meta p={p} />
        {photos.length > 1 && (
          <div className="cg-dots">
            {photos.map((_, i) => (
              <button key={i} className={"cg-dot" + (i === idx ? " on" : "")}
                onClick={() => setIdx(i)} aria-label={"Photo " + (i + 1)}></button>
            ))}
          </div>
        )}
      </div>
    );
  }

  // ---- mobile button + fullscreen viewer ----
  function GalleryMobile({ photos, label, galleryLabel, onOpenGallery }) {
    const [open, setOpen] = useState(false);
    const [idx, setIdx] = useState(0);
    useEffect(() => { setIdx(0); }, [photos]);
    const go = useCallback((d) => setIdx((i) => (i + d + photos.length) % photos.length), [photos.length]);
    const touch = useRef(null);
    const onStart = (e) => { touch.current = e.touches[0].clientX; };
    const onEnd = (e) => {
      if (touch.current == null) return;
      const dx = e.changedTouches[0].clientX - touch.current;
      if (Math.abs(dx) > 44) go(dx < 0 ? 1 : -1);
      touch.current = null;
    };
    const p = photos[idx];
    return (
      <div className="cg-mobile-row">
        <button className="cg-mobile-btn" onClick={() => setOpen(true)}>
          <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true">
            <rect x="3" y="5" width="18" height="14" rx="2" fill="none" stroke="currentColor" strokeWidth="1.6"/>
            <circle cx="8.5" cy="10" r="1.6" fill="currentColor"/>
            <path d="M4 17l5-4 3.5 3 3-2.5L20 17" fill="none" stroke="currentColor" strokeWidth="1.6"/>
          </svg>
          {label} · {photos.length}
        </button>
        <button className="cg-gallery-link mobile" onClick={onOpenGallery}>{galleryLabel}</button>
        {open && (
          <div className="cg-lightbox" onClick={() => setOpen(false)}>
            <div className="cg-lb-inner" onClick={(e) => e.stopPropagation()} onTouchStart={onStart} onTouchEnd={onEnd}>
              <button className="cg-lb-close" onClick={() => setOpen(false)} aria-label="Close">✕</button>
              <div className="cg-lb-stage">
                <img src={p.src} alt={p.caption || ""} draggable="false" />
                {photos.length > 1 && <>
                  <button className="cg-lb-nav prev" onClick={() => go(-1)} aria-label="Previous">‹</button>
                  <button className="cg-lb-nav next" onClick={() => go(1)} aria-label="Next">›</button>
                </>}
              </div>
              <Meta p={p} />
              {photos.length > 1 && (
                <div className="cg-dots">
                  {photos.map((_, i) => (
                    <button key={i} className={"cg-dot" + (i === idx ? " on" : "")} onClick={() => setIdx(i)} aria-label={"Photo " + (i + 1)}></button>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    );
  }

  function CaptionGallery({ segIdx, isMobile, label, galleryLabel, onOpenGallery }) {
    const photos = photosFor(segIdx);
    if (!photos) return null;
    return isMobile
      ? <GalleryMobile photos={photos} label={label || "Photos"} galleryLabel={galleryLabel || "Gallery"} onOpenGallery={onOpenGallery} />
      : <GalleryCard photos={photos} galleryLabel={galleryLabel || "Gallery"} onOpenGallery={onOpenGallery} />;
  }

  // ---- full-screen Gallery view ----
  function GalleryView({ open, onClose, getLabel, title, closeLabel }) {
    const [zoom, setZoom] = useState(null); // {src,caption,credit}
    useEffect(() => {
      if (!open) return;
      const onKey = (e) => { if (e.key === "Escape") { if (zoom) setZoom(null); else onClose(); } };
      window.addEventListener("keydown", onKey);
      return () => window.removeEventListener("keydown", onKey);
    }, [open, zoom, onClose]);
    useEffect(() => { if (!open) setZoom(null); }, [open]);
    if (!open) return null;
    const idxs = allIndices();
    return (
      <div className="gv-overlay">
        <div className="gv-head">
          <h2 className="gv-title">{title}</h2>
          <button className="about-close gv-close" onClick={onClose} aria-label={closeLabel || "Close"}>✕</button>
        </div>
        <div className="gv-scroll">
          {idxs.map((i) => {
            const photos = window.GALLERY[i];
            const lbl = getLabel ? getLabel(i) : ("Beat " + i);
            return (
              <section className="gv-beat" key={i}>
                <h3 className="gv-beat-title"><span className="gv-num">{String(i + 1).padStart(2, "0")}</span>{lbl}</h3>
                <div className="gv-grid">
                  {photos.map((ph, j) => (
                    <figure className="gv-card" key={ph.src} onClick={() => setZoom(ph)}>
                      <div className="gv-img-wrap"><img src={ph.src} alt={ph.caption || ""} loading="lazy" /></div>
                      <figcaption>
                        {ph.caption && <span className="gv-cap">{ph.caption}</span>}
                        {ph.credit && <span className="gv-credit">{ph.credit}</span>}
                      </figcaption>
                    </figure>
                  ))}
                </div>
              </section>
            );
          })}
        </div>
        {zoom && (
          <div className="gv-zoom" onClick={() => setZoom(null)}>
            <img src={zoom.src} alt={zoom.caption || ""} onClick={(e) => e.stopPropagation()} />
            <div className="gv-zoom-meta" onClick={(e) => e.stopPropagation()}>
              {zoom.caption && <span className="gv-cap">{zoom.caption}</span>}
              {zoom.credit && <span className="gv-credit">{zoom.credit}</span>}
            </div>
            <button className="about-close gv-zoom-close" onClick={() => setZoom(null)} aria-label={closeLabel || "Close"}>✕</button>
          </div>
        )}
      </div>
    );
  }

  window.CaptionGallery = CaptionGallery;
  window.GalleryView = GalleryView;
})();
