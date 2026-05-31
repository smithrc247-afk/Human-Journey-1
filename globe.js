/* ============================================================
   globe.js — orthographic canvas globe controller
   Vanilla (no React). React drives it via public methods.
   Depends on: d3 (v7), topojson-client.
   ============================================================ */
(function () {
  const RAD = Math.PI / 180;

  // ---- Visual themes ----------------------------------------
  const THEMES = {
    relief: {
      bg: "transparent",
      ocean: ["#1c3a52", "#0d2233"],          // radial: center -> edge
      land: "#4a6b4a",
      landHi: "#5d8055",
      graticule: "rgba(220,228,224,0.10)",
      border: "rgba(12,22,28,0.45)",
      sphereLine: "rgba(232,224,205,0.30)",
      atmosphere: "rgba(120,170,200,0.35)",
      region: "#e0a44a",
      regionAlpha: 0.30,
      route: "#7fdcec",
      routeGlow: "rgba(120,222,240,0.9)",
      milestone: "#eafaff",
      text: "#ece5d6",
    },
    atlas: {
      bg: "transparent",
      ocean: ["#11161c", "#070a0e"],
      land: "rgba(214,201,168,0.06)",
      landHi: "rgba(214,201,168,0.10)",
      graticule: "rgba(214,201,168,0.16)",
      border: "rgba(214,201,168,0.42)",
      sphereLine: "rgba(214,201,168,0.55)",
      atmosphere: "rgba(214,201,168,0.18)",
      region: "#d8b25a",
      regionAlpha: 0.26,
      route: "#7fd6e6",
      routeGlow: "rgba(120,214,230,0.9)",
      milestone: "#e6fbff",
      text: "#e8dfc8",
    },
    twilight: {
      bg: "transparent",
      ocean: ["#1a2747", "#080c1c"],
      land: "#3c4f78",
      landHi: "#4f649a",
      graticule: "rgba(150,180,230,0.10)",
      border: "rgba(10,16,34,0.55)",
      sphereLine: "rgba(150,180,230,0.32)",
      atmosphere: "rgba(90,140,230,0.40)",
      region: "#e07a4a",
      regionAlpha: 0.28,
      route: "#84e0f0",
      routeGlow: "rgba(130,224,242,0.95)",
      milestone: "#e8fdff",
      text: "#dfe6f2",
    },
    // "Slate": unambiguous — clearly LIGHT land over DARK water
    slate: {
      bg: "transparent",
      ocean: ["#0e1c30", "#05101d"],
      land: "#7c93ab",
      landHi: "#97acc2",
      graticule: "rgba(190,208,226,0.12)",
      border: "rgba(8,16,26,0.5)",
      sphereLine: "rgba(200,220,240,0.42)",
      atmosphere: "rgba(110,150,200,0.36)",
      region: "#e08a4a",
      regionAlpha: 0.30,
      route: "#84e0f0",
      routeGlow: "rgba(130,224,242,0.95)",
      milestone: "#e8fdff",
      text: "#eaf0f7",
    },
  };

  class Globe {
    constructor(canvas) {
      this.canvas = canvas;
      this.ctx = canvas.getContext("2d");
      this.dpr = Math.min(window.devicePixelRatio || 1, 2);

      this.projection = d3.geoOrthographic().clipAngle(90).precision(0.4);
      this.path = d3.geoPath(this.projection, this.ctx);
      this.graticule = d3.geoGraticule10();

      this.rotate = [-20, -8, 0];
      this.zoom = 1;
      this.timeYa = window.TIME.start;
      this.theme = "relief";
      this.lang = "en";
      this.activeReligions = new Set(window.RELIGIONS.map((r) => r.id));
      this.showRoutes = true;
      this.showRegion = true;
      this.showReligion = true;
      this.showPopBars = true;
      this.showIce = true;

      this.land = null;
      this.borders = null;
      this._dirty = true;
      this._anim = null;       // active flyTo animation
      this._idleSpin = false;
      this._lastT = 0;
      this._loaded = false;

      // offscreen region mask
      this._mask = document.createElement("canvas");
      this._mctx = this._mask.getContext("2d");

      this._initInput();
      this._resize();
      window.addEventListener("resize", () => this._resize());
      this._render();                       // immediate first paint
      this._lastT = performance.now();
      // Drive with setInterval (rAF does not tick reliably in this host).
      this._timer = setInterval(() => this._frame(performance.now()), 33);
    }

    async load() {
      let topo = window.WORLD_TOPO || null;
      if (!topo) {
        const tryUrls = [
          "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json",
          "https://unpkg.com/world-atlas@2/countries-110m.json",
        ];
        for (const u of tryUrls) {
          try { topo = await (await fetch(u)).json(); break; } catch (e) { /* try next */ }
        }
      }
      if (!topo) { console.warn("globe: could not load world data"); return false; }
      this.land = this._cleanLand(topojson.merge(topo, topo.objects.countries.geometries));
      this.borders = topojson.mesh(topo, topo.objects.countries, (a, b) => a !== b);
      this._loaded = true;
      this._dirty = true;
      this._render();
      return true;
    }

    // Remove degenerate rings (fewer than 3 distinct vertices, i.e. zero-area
    // slivers left by aggressive simplification). On an orthographic globe d3's
    // circle-clip turns such a sliver into a full horizon ring at certain view
    // angles, which floods the ocean with the land colour (land/water appear
    // to swap). Stripping them keeps land/water colours stable at every angle.
    _cleanLand(geo) {
      const distinct = (ring) => {
        const s = new Set();
        for (const p of ring) s.add(p[0].toFixed(5) + "," + p[1].toFixed(5));
        return s.size;
      };
      const polys = geo.type === "Polygon" ? [geo.coordinates] : geo.coordinates;
      const out = [];
      for (const poly of polys) {
        const rings = poly.filter((r) => distinct(r) >= 3);
        if (rings.length) out.push(rings);
      }
      return { type: "MultiPolygon", coordinates: out };
    }

    // ---- public API -----------------------------------------
    setTime(ya) { this.timeYa = ya; this._dirty = true; }    setTheme(name) { if (THEMES[name]) { this.theme = name; this._dirty = true; } }
    setReligions(set) { this.activeReligions = set; this._dirty = true; }
    setLayer(key, on) { this[key] = on; this._dirty = true; }
    setLang(code) { this.lang = code; this._dirty = true; }
    // localized milestone name (falls back to the English source name)
    _msName(ms) {
      const places = (window.I18N && window.I18N[this.lang] && window.I18N[this.lang].places) || null;
      return (places && places[ms.id]) || ms.name;
    }
    setIdleSpin(on) { this._idleSpin = on; }

    // spin: 0 = shortest great-circle path (default); -1 = force the camera to
    // travel WEST (centre longitude decreasing); +1 = force EAST. Use a forced
    // direction to steer the globe the intuitive way across a long traverse
    // (e.g. follow belief west from Europe across the Atlantic to the Americas
    // rather than letting it whip east across Asia and the empty Pacific).
    flyTo(coord, zoom, ms = 1600, spin = 0) {
      const start = [-this.rotate[0], -this.rotate[1]];
      const end = coord;
      const z0 = this.zoom, z1 = zoom != null ? zoom : this.zoom;
      const t0 = performance.now();
      const useDir = spin !== 0;
      let dLon = 0;
      if (useDir) {
        dLon = end[0] - start[0];
        while (dLon > 180) dLon -= 360;
        while (dLon <= -180) dLon += 360;
        if (spin > 0 && dLon < 0) dLon += 360;   // force eastward
        if (spin < 0 && dLon > 0) dLon -= 360;   // force westward
      }
      const interp = useDir ? null : d3.geoInterpolate(start, end);
      this._anim = (now) => {
        let k = Math.min(1, (now - t0) / ms);
        const e = d3.easeCubicInOut(k);
        let lon, lat;
        if (useDir) {
          lon = start[0] + dLon * e;
          lat = start[1] + (end[1] - start[1]) * e;
        } else {
          const c = interp(e); lon = c[0]; lat = c[1];
        }
        this.rotate = [-lon, -lat, 0];
        this.zoom = z0 + (z1 - z0) * e;
        this._dirty = true;
        if (k >= 1) this._anim = null;
      };
    }

    rotateTo(rotate, zoom, ms = 1600) {
      this.flyTo([-rotate[0], -rotate[1]], zoom, ms);
    }

    // ---- internals ------------------------------------------
    _resize() {
      const r = this.canvas.getBoundingClientRect();
      this.w = r.width; this.h = r.height;
      this.canvas.width = this.w * this.dpr;
      this.canvas.height = this.h * this.dpr;
      this.ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
      this._mask.width = this.w * this.dpr;
      this._mask.height = this.h * this.dpr;
      this._mctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
      this.baseScale = Math.min(this.w, this.h) / 2 * 0.72;
      this._dirty = true;
    }

    _initInput() {
      const c = this.canvas;
      let dragging = false, lx = 0, ly = 0;
      const sens = () => 0.25 / Math.sqrt(this.zoom);
      const down = (x, y) => { dragging = true; lx = x; ly = y; this._anim = null; this._userInteract(); };
      const move = (x, y) => {
        if (!dragging) return;
        const k = sens();
        this.rotate = [
          this.rotate[0] + (x - lx) * k,
          Math.max(-90, Math.min(90, this.rotate[1] - (y - ly) * k)),
          0,
        ];
        lx = x; ly = y; this._dirty = true;
      };
      const up = () => { dragging = false; };
      c.addEventListener("mousedown", (e) => down(e.clientX, e.clientY));
      window.addEventListener("mousemove", (e) => move(e.clientX, e.clientY));
      window.addEventListener("mouseup", up);
      c.addEventListener("touchstart", (e) => { const t = e.touches[0]; down(t.clientX, t.clientY); }, { passive: true });
      c.addEventListener("touchmove", (e) => { const t = e.touches[0]; move(t.clientX, t.clientY); }, { passive: true });
      c.addEventListener("touchend", up);
      c.addEventListener("wheel", (e) => {
        e.preventDefault();
        this._userInteract();
        const f = Math.exp(-e.deltaY * 0.0012);
        this.zoom = Math.max(0.8, Math.min(6, this.zoom * f));
        this._dirty = true;
      }, { passive: false });
    }

    _userInteract() {
      this._lastInteract = performance.now();
      if (this.onInteract) this.onInteract();
    }

    _visible(coord) {
      const c = [-this.rotate[0], -this.rotate[1]];
      return d3.geoDistance(coord, c) < Math.PI / 2 - 0.02;
    }

    _frame(t) {
      const dt = t - (this._lastT || t);
      this._lastT = t;
      if (this._anim) this._anim(t);
      if (this._idleSpin && !this._anim) {
        const idle = performance.now() - (this._lastInteract || 0) > 2500;
        if (idle) { this.rotate = [this.rotate[0] + dt * 0.0015, this.rotate[1], 0]; }
      }
      // Always repaint: routes (dash), markers (pulse) and tweens are time-based.
      this._render();
    }

    _render() {
      const ctx = this.ctx, T = THEMES[this.theme];
      const cx = this.w / 2, cy = this.h / 2;
      this.projection
        .scale(this.baseScale * this.zoom)
        .translate([cx, cy])
        .rotate(this.rotate);

      ctx.clearRect(0, 0, this.w, this.h);
      const R = this.baseScale * this.zoom;

      // atmosphere halo
      const halo = ctx.createRadialGradient(cx, cy, R * 0.96, cx, cy, R * 1.16);
      halo.addColorStop(0, T.atmosphere);
      halo.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = halo;
      ctx.beginPath(); ctx.arc(cx, cy, R * 1.16, 0, 2 * Math.PI); ctx.fill();

      // ocean sphere
      const og = ctx.createRadialGradient(cx - R * 0.32, cy - R * 0.36, R * 0.1, cx, cy, R);
      og.addColorStop(0, T.ocean[0]);
      og.addColorStop(1, T.ocean[1]);
      ctx.beginPath(); this.path({ type: "Sphere" }); ctx.fillStyle = og; ctx.fill();

      if (this._loaded) {
        // graticule
        ctx.beginPath(); this.path(this.graticule);
        ctx.strokeStyle = T.graticule; ctx.lineWidth = 0.6; ctx.stroke();

        // land
        ctx.beginPath(); this.path(this.land);
        ctx.fillStyle = T.land; ctx.fill();
        // subtle top-light on land
        ctx.save();
        ctx.beginPath(); this.path(this.land); ctx.clip();
        const lg = ctx.createRadialGradient(cx - R * 0.3, cy - R * 0.34, R * 0.05, cx, cy, R);
        lg.addColorStop(0, T.landHi); lg.addColorStop(0.7, "rgba(0,0,0,0)");
        ctx.fillStyle = lg; ctx.fillRect(0, 0, this.w, this.h);
        ctx.restore();
        // borders
        ctx.beginPath(); this.path(this.borders);
        ctx.strokeStyle = T.border; ctx.lineWidth = 0.4; ctx.stroke();
      }

      // polar ice (over land + ocean, beneath everything else)
      if (this.showIce) this._renderIce(T);

      // settled region (coloured by the faith present there)
      if (this.showRegion) this._renderRegion(T);
      // migration routes
      if (this.showRoutes) this._renderRoutes(T);
      // religion transmission flows (belief shown by the settled-area colour, not dots)
      if (this.showReligion) { this._renderReligionFlows(T); }
      // milestone markers
      this._renderMilestones(T);
      // population columns (drawn last so they rise above the surface)
      if (this.showPopBars) this._renderPopBars(T);

      // sphere outline
      ctx.beginPath(); this.path({ type: "Sphere" });
      ctx.strokeStyle = T.sphereLine; ctx.lineWidth = 1; ctx.stroke();
    }

    _msRadiusDeg(ms) {
      if (this.timeYa > ms.ya) return 0;
      const prog = Math.max(0, Math.min(1, (ms.ya - this.timeYa) / ms.grow));
      if (prog <= 0) return 0;
      const maxDeg = ms.maxDeg || 18;
      return 3 + prog * (maxDeg - 3);
    }

    _settled(coord) {
      for (const ms of window.MILESTONES) {
        const r = this._msRadiusDeg(ms);
        if (r <= 0) continue;
        if (d3.geoDistance(coord, ms.coord) < r * RAD) return true;
      }
      return false;
    }

    _presencePoints() {
      const pts = [];
      for (const r of window.RELIGIONS) {
        if (!this.activeReligions.has(r.id)) continue;
        if (this.timeYa > r.from || this.timeYa < r.to) continue;
        // weight ramps smoothly from emergence so colour eases in (no jump)
        const w = Math.max(0, Math.min(1, (r.from - this.timeYa) / 2500));
        for (const s of r.sites) pts.push({ coord: s, color: r.color, w });
      }
      for (const f of window.RELIGION_FLOWS) {
        if (!this.activeReligions.has(f.rel)) continue;
        if (this.timeYa <= f.startYa) {
          const rel = window.RELIGIONS.find((x) => x.id === f.rel);
          if (rel) {
            // presence grows as the transmission line draws, full once it lands
            let w = Math.max(0, Math.min(1, (f.startYa - this.timeYa) / (f.startYa - f.endYa)));
            // optional recession: presence wanes between fadeStart and fadeEnd
            // (years ago) — used to retreat al-Andalus through the Reconquista.
            if (f.fadeStart != null && this.timeYa < f.fadeStart) {
              w *= Math.max(0, (this.timeYa - f.fadeEnd) / (f.fadeStart - f.fadeEnd));
            }
            if (w > 0) pts.push({ coord: f.to, color: rel.color, w });
          }
        }
      }
      return pts;
    }

    _rgb(hex) {
      const h = hex.replace("#", "");
      const n = parseInt(h.length === 3 ? h.split("").map((c) => c + c).join("") : h, 16);
      return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
    }

    // Blend the colours of every belief present near a point, weighted by
    // each belief's smoothly-ramping presence and its distance. A modest
    // animism baseline underlies everything so colour shifts are gradual.
    _regionColorAt(coord, pts, T) {
      const THRESH = 50 * RAD;
      let rr = 0, gg = 0, bb = 0, tw = 0;
      if (this.activeReligions.has("animism") && this.timeYa <= window.RELIGIONS[0].from) {
        const base = this._rgb(window.RELIGIONS[0].color);
        const bw = 0.16;
        rr += base[0] * bw; gg += base[1] * bw; bb += base[2] * bw; tw += bw;
      }
      for (const pt of pts) {
        const d = d3.geoDistance(coord, pt.coord);
        if (d >= THRESH) continue;
        const fall = (1 - d / THRESH);
        const w = pt.w * fall * fall * 3.0;
        if (w <= 0) continue;
        const c = pt._rgbCache || (pt._rgbCache = this._rgb(pt.color));
        rr += c[0] * w; gg += c[1] * w; bb += c[2] * w; tw += w;
      }
      // No belief present yet (before animism emerges) → neutral grey
      if (tw <= 0) return [116, 117, 111];
      return [Math.round(rr / tw), Math.round(gg / tw), Math.round(bb / tw)];
    }

    _renderRegion(T) {
      const ctx = this.ctx, m = this._mctx;
      const pts = this._presencePoints();
      const center = [-this.rotate[0], -this.rotate[1]];
      const scl = this.baseScale * this.zoom;
      // paint coloured circles onto an offscreen layer first, so overlapping
      // settled regions don't additively oversaturate
      m.clearRect(0, 0, this.w, this.h);
      const mpath = d3.geoPath(this.projection, m);
      let any = false;
      for (const ms of window.MILESTONES) {
        const radiusDeg = this._msRadiusDeg(ms);
        if (radiusDeg <= 0) continue;
        if (d3.geoDistance(ms.coord, center) > Math.PI / 2 + radiusDeg * RAD) continue;
        const color = this._regionColorAt(ms.coord, pts, T);
        const rgba = (a) => `rgba(${color[0]},${color[1]},${color[2]},${a})`;
        const circle = d3.geoCircle().center(ms.coord).radius(radiusDeg)();
        m.save();
        m.beginPath(); mpath(circle); m.clip();
        const p = this.projection(ms.coord);
        const rpx = Math.max(radiusDeg * RAD * scl, 12);
        const g = m.createRadialGradient(p[0], p[1], 0, p[0], p[1], rpx);
        g.addColorStop(0, rgba(1));
        g.addColorStop(0.72, rgba(0.95));
        g.addColorStop(1, rgba(0));
        m.fillStyle = g; m.fillRect(0, 0, this.w, this.h);
        m.restore();
        any = true;
      }
      // Until the Bab-el-Mandeb crossing (the `arabia` milestone), keep the
      // Arabian Peninsula unsettled — don't let the African homeland's colour
      // bleed across the narrow Red Sea. Mask the whole peninsula (a polygon
      // hugging its coasts, bounded west by the Red-Sea axis so African land is
      // untouched, and kept south of the Levant so that early site stays lit).
      const arabiaGate = (window.MILESTONES.find((x) => x.id === "arabia") || {}).ya || 68000;
      if (any && this.timeYa > arabiaGate) {
        const arabia = { type: "Polygon", coordinates: [[
          [38, 30], [44, 31], [50, 30], [58, 26], [60, 20], [55, 14],
          [48, 12], [43, 13], [41, 16], [38, 20], [37, 24], [35, 28], [38, 30],
        ]] };
        m.save();
        m.globalCompositeOperation = "destination-out";
        m.beginPath(); mpath(arabia); m.fillStyle = "#000"; m.fill();
        m.restore();
      }
      if (!any) return;
      // composite the layer at a fixed opacity, clipped to sphere ∩ land
      ctx.save();
      ctx.beginPath(); this.path({ type: "Sphere" }); ctx.clip();
      if (this._loaded && this.land) { ctx.beginPath(); this.path(this.land); ctx.clip(); }
      ctx.globalAlpha = 0.72;
      ctx.drawImage(this._mask, 0, 0, this.w, this.h);
      ctx.globalAlpha = 1;
      ctx.restore();
    }

    _renderRoutes(T) {
      const ctx = this.ctx;
      for (const rt of window.ROUTES) {
        let frac;
        if (this.timeYa >= rt.startYa) frac = 0;
        else if (this.timeYa <= rt.endYa) frac = 1;
        else frac = (rt.startYa - this.timeYa) / (rt.startYa - rt.endYa);
        if (frac <= 0) continue;
        // densify along the waypoint chain with great-circle segments
        const wp = rt.path || [rt.from, rt.to];
        const full = [];
        const per = 14;
        for (let s = 0; s < wp.length - 1; s++) {
          const interp = d3.geoInterpolate(wp[s], wp[s + 1]);
          for (let i = (s === 0 ? 0 : 1); i <= per; i++) full.push(interp(i / per));
        }
        // take the leading `frac` portion of the chain
        const span = (full.length - 1) * frac;
        const upto = Math.floor(span);
        const pts = full.slice(0, upto + 1);
        if (upto < full.length - 1) {
          const tt = span - upto;
          const seg = d3.geoInterpolate(full[upto], full[upto + 1]);
          pts.push(seg(tt));
        }
        if (pts.length < 2) continue;
        const line = { type: "LineString", coordinates: pts };
        ctx.beginPath(); this.path(line);
        ctx.strokeStyle = T.route; ctx.lineWidth = 1.6; ctx.lineJoin = "round";
        ctx.setLineDash([4, 4]); ctx.lineDashOffset = -(performance.now() * 0.02) % 8;
        ctx.shadowColor = T.routeGlow; ctx.shadowBlur = 6;
        ctx.stroke();
        ctx.setLineDash([]); ctx.shadowBlur = 0;
        // head dot
        if (frac < 1) {
          const head = pts[pts.length - 1];
          if (this._visible(head)) {
            const p = this.projection(head);
            ctx.beginPath(); ctx.arc(p[0], p[1], 2.6, 0, 2 * Math.PI);
            ctx.fillStyle = T.milestone; ctx.shadowColor = T.routeGlow; ctx.shadowBlur = 8; ctx.fill();
            ctx.shadowBlur = 0;
          }
        }
      }
    }

    _renderReligion(T) {
      const ctx = this.ctx;
      const pulse = 0.5 + 0.5 * Math.sin(performance.now() * 0.004);
      for (const r of window.RELIGIONS) {
        if (!this.activeReligions.has(r.id)) continue;
        if (this.timeYa > r.from || this.timeYa < r.to) continue;
        for (const s of r.sites) {
          if (!this._visible(s)) continue;
          if (!this._settled(s)) continue;
          const p = this.projection(s);
          // soft glow zone
          const g = ctx.createRadialGradient(p[0], p[1], 0, p[0], p[1], 26);
          g.addColorStop(0, this._hexA(r.color, 0.5));
          g.addColorStop(1, this._hexA(r.color, 0));
          ctx.beginPath(); ctx.arc(p[0], p[1], 26, 0, 2 * Math.PI); ctx.fillStyle = g; ctx.fill();
          // core
          ctx.beginPath(); ctx.arc(p[0], p[1], 4.2 + pulse * 1.4, 0, 2 * Math.PI);
          ctx.fillStyle = r.color; ctx.fill();
          ctx.lineWidth = 1; ctx.strokeStyle = "rgba(255,255,255,0.7)"; ctx.stroke();
        }
      }
    }

    _renderMilestones(T) {
      const ctx = this.ctx;
      ctx.font = "600 11px 'IBM Plex Mono', monospace";
      for (const ms of window.MILESTONES) {
        if (this.timeYa > ms.ya) continue;
        if (!this._visible(ms.coord)) continue;
        const p = this.projection(ms.coord);
        ctx.beginPath(); ctx.arc(p[0], p[1], 2.4, 0, 2 * Math.PI);
        ctx.fillStyle = T.milestone; ctx.fill();
        // a dispersal that died out — strike its dot with an X a little while
        // after it first appears, then hold it as the venture fades away
        if (ms.diedAt != null && this.timeYa <= ms.diedAt) {
          const fade = Math.max(0, Math.min(1, (ms.diedAt - this.timeYa) / 1200));
          const r = 4.8;
          ctx.save();
          ctx.globalAlpha = fade;
          ctx.strokeStyle = "#e0593e";
          ctx.lineWidth = 1.7; ctx.lineCap = "round";
          ctx.shadowColor = "rgba(0,0,0,0.7)"; ctx.shadowBlur = 3;
          ctx.beginPath();
          ctx.moveTo(p[0] - r, p[1] - r); ctx.lineTo(p[0] + r, p[1] + r);
          ctx.moveTo(p[0] + r, p[1] - r); ctx.lineTo(p[0] - r, p[1] + r);
          ctx.stroke();
          ctx.restore();
        }
        if (ms.label && this.timeYa <= ms.ya && this.timeYa > ms.ya - ms.grow * 1.4) {
          ctx.fillStyle = T.text;
          ctx.shadowColor = "rgba(0,0,0,0.8)"; ctx.shadowBlur = 4;
          ctx.fillText(this._msName(ms), p[0] + 7, p[1] + 3);
          ctx.shadowBlur = 0;
        }
      }
    }

    _renderReligionFlows(T) {
      const ctx = this.ctx;
      for (const f of window.RELIGION_FLOWS) {
        if (!this.activeReligions.has(f.rel)) continue;
        if (this.timeYa >= f.startYa) continue;
        const rel = window.RELIGIONS.find((x) => x.id === f.rel);
        if (!rel) continue;
        let frac = this.timeYa <= f.endYa ? 1 : (f.startYa - this.timeYa) / (f.startYa - f.endYa);
        if (frac <= 0) continue;
        const interp = d3.geoInterpolate(f.from, f.to);
        const N = 40, pts = [];
        for (let i = 0; i <= N; i++) pts.push(interp((i / N) * frac));
        // soft base line in the faith's colour (stays once the flow lands)
        ctx.beginPath(); this.path({ type: "LineString", coordinates: pts });
        ctx.strokeStyle = this._hexA(rel.color, 0.85);
        ctx.lineWidth = 2.6; ctx.lineCap = "round";
        ctx.shadowColor = this._hexA(rel.color, 0.85); ctx.shadowBlur = 8;
        ctx.stroke(); ctx.shadowBlur = 0;
        // bright dashes streaming along it — reads as an active, directional
        // spread of belief and sets the faith-flows apart from migration routes
        ctx.beginPath(); this.path({ type: "LineString", coordinates: pts });
        ctx.strokeStyle = this._hexA(rel.color, 1);
        ctx.lineWidth = 2.6; ctx.lineCap = "round";
        ctx.setLineDash([2.5, 13]); ctx.lineDashOffset = -(performance.now() * 0.03) % 15.5;
        ctx.shadowColor = this._hexA(rel.color, 1); ctx.shadowBlur = 6;
        ctx.stroke();
        ctx.setLineDash([]); ctx.shadowBlur = 0; ctx.lineCap = "butt";
        if (frac < 1) {
          const head = pts[pts.length - 1];
          if (this._visible(head)) {
            const p = this.projection(head);
            const pulse = 0.5 + 0.5 * Math.sin(performance.now() * 0.005);
            const g = ctx.createRadialGradient(p[0], p[1], 0, p[0], p[1], 16);
            g.addColorStop(0, this._hexA(rel.color, 0.55));
            g.addColorStop(1, this._hexA(rel.color, 0));
            ctx.beginPath(); ctx.arc(p[0], p[1], 16, 0, 2 * Math.PI); ctx.fillStyle = g; ctx.fill();
            ctx.beginPath(); ctx.arc(p[0], p[1], 3.4 + pulse * 1.2, 0, 2 * Math.PI);
            ctx.fillStyle = rel.color; ctx.shadowColor = rel.color; ctx.shadowBlur = 9; ctx.fill();
            ctx.shadowBlur = 0;
          }
        }
      }
    }

    _renderIce(T) {
      const ctx = this.ctx;
      const f = window.iceAt(this.timeYa);
      // normalise glacial factor: ~0.18 (interglacial floor) → 1 (LGM)
      const k = Math.max(0, Math.min(1, (f - 0.18) / (1 - 0.18)));
      const center = [-this.rotate[0], -this.rotate[1]];
      const scl = this.baseScale * this.zoom;
      ctx.save();
      ctx.beginPath(); this.path({ type: "Sphere" }); ctx.clip();
      for (const s of window.ICE_SHEETS) {
        const deg = s.now + (s.lgm - s.now) * k;
        if (deg <= 0.5) continue;
        if (d3.geoDistance(s.center, center) > Math.PI / 2 + deg * RAD) continue;
        const circle = d3.geoCircle().center(s.center).radius(deg)();
        ctx.save();
        ctx.beginPath(); this.path(circle); ctx.clip();
        const p = this.projection(s.center);
        const rpx = Math.max(deg * RAD * scl, 10);
        const g = ctx.createRadialGradient(p[0], p[1], 0, p[0], p[1], rpx);
        if (s.sea) {
          g.addColorStop(0, "rgba(225,238,248,0.42)");
          g.addColorStop(0.7, "rgba(205,224,242,0.24)");
          g.addColorStop(1, "rgba(200,222,242,0)");
        } else {
          g.addColorStop(0, "rgba(242,248,253,0.82)");
          g.addColorStop(0.75, "rgba(224,236,248,0.58)");
          g.addColorStop(1, "rgba(210,228,245,0)");
        }
        ctx.fillStyle = g; ctx.fillRect(0, 0, this.w, this.h);
        ctx.restore();
        if (!s.sea) {
          ctx.beginPath(); this.path(circle);
          ctx.strokeStyle = "rgba(235,245,252,0.32)"; ctx.lineWidth = 1; ctx.stroke();
        }
      }
      ctx.restore();
    }

    _renderPopBars(T) {
      const ctx = this.ctx;
      const cx = this.w / 2, cy = this.h / 2;
      const world = window.popAt(this.timeYa);
      const REF = 49e6;
      const items = [];
      const FADE = 600; // years over which a centre fades in (after founding) / out (before it is superseded)
      for (const c of window.POP_CENTERS) {
        if (this.timeYa > c.startYa) continue;            // not founded yet
        let fade = Math.min(1, (c.startYa - this.timeYa) / FADE);
        if (c.endYa != null) fade = Math.min(fade, (this.timeYa - c.endYa) / FADE);
        fade = Math.max(0, Math.min(1, fade));
        if (fade <= 0) continue;                          // gone (or not yet visible)
        if (!this._visible(c.coord)) continue;
        const local = world * c.w;
        const h = 95 * Math.cbrt(local / REF);
        if (h < 3) continue;
        const p = this.projection(c.coord);
        let dx = p[0] - cx, dy = p[1] - cy;
        const len = Math.hypot(dx, dy) || 1;
        items.push({ p, nx: dx / len, ny: dy / len, h, d: len, fade });
      }
      items.sort((a, b) => b.d - a.d);
      for (const it of items) {
        ctx.globalAlpha = it.fade;
        const bx = it.p[0] + it.nx * it.h, by = it.p[1] + it.ny * it.h;
        const grad = ctx.createLinearGradient(it.p[0], it.p[1], bx, by);
        grad.addColorStop(0, "rgba(240,140,190,0.16)");
        grad.addColorStop(1, "rgba(255,180,218,0.95)");
        ctx.strokeStyle = grad; ctx.lineWidth = 3.4; ctx.lineCap = "butt";
        ctx.beginPath(); ctx.moveTo(it.p[0], it.p[1]); ctx.lineTo(bx, by); ctx.stroke();
        ctx.beginPath(); ctx.arc(it.p[0], it.p[1], 2, 0, 2 * Math.PI);
        ctx.fillStyle = "rgba(255,180,218,0.6)"; ctx.fill();
        ctx.fillStyle = "#ffc6e2"; ctx.shadowColor = "rgba(240,120,185,0.9)"; ctx.shadowBlur = 6;
        ctx.fillRect(bx - 2.8, by - 2.8, 5.6, 5.6);
        ctx.shadowBlur = 0;
      }
      ctx.globalAlpha = 1;
    }

    _hexA(hex, a) {
      const h = hex.replace("#", "");
      const n = parseInt(h.length === 3 ? h.split("").map((c) => c + c).join("") : h, 16);
      return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${a})`;
    }
  }

  window.Globe = Globe;
})();
