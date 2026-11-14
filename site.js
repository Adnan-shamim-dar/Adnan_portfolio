/* Portfolio interactions: spotlight, section nav, reveal, lightbox, DNA helix, Genesis life sim. */
(() => {
  "use strict";
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  document.documentElement.classList.add("js");

  /* ---------- cursor spotlight ---------- */
  const spot = document.querySelector(".spotlight");
  if (!reduce && spot) {
    window.addEventListener("pointermove", (e) => {
      spot.style.setProperty("--x", e.clientX + "px");
      spot.style.setProperty("--y", e.clientY + "px");
    }, { passive: true });
  }

  /* ---------- active section in nav ---------- */
  const links = [...document.querySelectorAll(".toc a")];
  const navIO = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (!en.isIntersecting) return;
      links.forEach((a) => a.classList.toggle("active", a.getAttribute("href") === "#" + en.target.id));
    });
  }, { rootMargin: "-40% 0px -55% 0px" });
  document.querySelectorAll("main section").forEach((s) => navIO.observe(s));

  /* ---------- reveal on scroll ---------- */
  const revealIO = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (en.isIntersecting) { en.target.classList.add("in"); revealIO.unobserve(en.target); }
    });
  }, { rootMargin: "0px 0px -8% 0px" });
  document.querySelectorAll(".entry, .flagship, .mini, .cred, .proofbar, .trust, .hook").forEach((el) => {
    el.classList.add("reveal");
    if (reduce) el.classList.add("in"); else revealIO.observe(el);
  });

  /* ---------- lightbox ---------- */
  const dlg = document.getElementById("lightbox");
  if (dlg) {
    const img = dlg.querySelector("img");
    document.querySelectorAll("[data-lightbox]").forEach((a) => {
      a.addEventListener("click", (e) => {
        e.preventDefault();
        img.src = a.getAttribute("href");
        img.alt = a.querySelector("img")?.alt || a.querySelector("h4")?.textContent || "";
        dlg.showModal();
      });
    });
    dlg.addEventListener("click", (e) => { if (e.target !== img) dlg.close(); });
  }

  /* ---------- shared glow sprite ---------- */
  const sprite = (rgb) => {
    const s = document.createElement("canvas"); s.width = s.height = 64;
    const g = s.getContext("2d"), grd = g.createRadialGradient(32, 32, 0, 32, 32, 32);
    grd.addColorStop(0, `rgba(${rgb},1)`); grd.addColorStop(0.2, `rgba(${rgb},0.5)`); grd.addColorStop(1, `rgba(${rgb},0)`);
    g.fillStyle = grd; g.fillRect(0, 0, 64, 64); return s;
  };
  const MINT = "76,245,200", CYAN = "90,190,255", VIOLET = "170,140,255";
  const glows = { [MINT]: sprite(MINT), [CYAN]: sprite(CYAN), [VIOLET]: sprite(VIOLET) };

  const fitCanvas = (cv) => {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const W = cv.clientWidth, H = cv.clientHeight;
    cv.width = W * dpr; cv.height = H * dpr;
    cv.getContext("2d").setTransform(dpr, 0, 0, dpr, 0, 0);
    return [W, H];
  };

  /* ---------- neon DNA helix (left margin) ---------- */
  const dna = document.querySelector(".dna");
  if (dna) {
    const ctx = dna.getContext("2d");
    let [W, H] = fitCanvas(dna);
    let lastScroll = window.scrollY, spin = 0, velocity = 0, last = 0;
    // signal pulses travelling down the strands
    const pulses = Array.from({ length: 3 }, (_, i) => ({ y: (i / 3) * H, strand: i % 2, speed: 0.6 + Math.random() * 0.5 }));

    const draw = (t) => {
      ctx.clearRect(0, 0, W, H);
      const cx = W / 2, A = Math.min(W * 0.3, 64), step = 16;
      const k = (Math.PI * 2 * 2.2) / H;
      const phase = spin + window.scrollY * 0.0026;
      const at = (y, strand) => cx + (strand ? -1 : 1) * A * Math.sin(y * k + phase);

      const nodes = [];
      let i = 0;
      for (let y = -step; y <= H + step; y += step, i++) {
        const th = y * k + phase, s = Math.sin(th), z = Math.cos(th);
        const xa = cx + A * s, xb = cx - A * s, xm = (xa + xb) / 2;
        // two-tone base pair: each half coloured by its strand; every 5th pair is a violet "marker"
        const front = (z + 1) / 2, back = 1 - front;
        const pairColor = i % 5 === 0 ? VIOLET : null;
        ctx.lineWidth = 1.1;
        ctx.strokeStyle = `rgba(${pairColor || MINT},${0.05 + 0.13 * front})`;
        ctx.beginPath(); ctx.moveTo(xa, y); ctx.lineTo(xm, y); ctx.stroke();
        ctx.strokeStyle = `rgba(${pairColor || CYAN},${0.05 + 0.13 * back})`;
        ctx.beginPath(); ctx.moveTo(xm, y); ctx.lineTo(xb, y); ctx.stroke();
        nodes.push([xa, y, z, MINT], [xb, y, -z, CYAN]);
      }
      // backbones: brighter where they face the viewer
      for (let strand = 0; strand < 2; strand++) {
        for (let y = -step; y <= H + step; y += 6) {
          const z = Math.cos(y * k + phase) * (strand ? -1 : 1);
          ctx.strokeStyle = `rgba(${strand ? CYAN : MINT},${0.10 + 0.22 * (z + 1) / 2})`;
          ctx.lineWidth = 1 + 0.6 * (z + 1) / 2;
          ctx.beginPath(); ctx.moveTo(at(y, strand), y); ctx.lineTo(at(y + 6, strand), y + 6); ctx.stroke();
        }
      }
      ctx.globalCompositeOperation = "lighter";
      nodes.sort((a, b) => a[2] - b[2]);
      for (const [x, y, z, c] of nodes) {
        const d = (z + 1) / 2, r = 1.1 + 1.9 * d, a = 0.16 + 0.64 * d;
        ctx.globalAlpha = a * 0.5;
        const gs = r * 7; ctx.drawImage(glows[c], x - gs / 2, y - gs / 2, gs, gs);
        ctx.globalAlpha = a; ctx.fillStyle = `rgb(${c})`;
        ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill();
      }
      // travelling pulses
      for (const p of pulses) {
        const x = at(p.y, p.strand), c = p.strand ? CYAN : MINT;
        for (let tail = 0; tail < 7; tail++) {
          const ty = p.y - tail * 5, tx = at(ty, p.strand);
          ctx.globalAlpha = 0.5 * (1 - tail / 7);
          ctx.drawImage(glows[c], tx - 9, ty - 9, 18, 18);
        }
        ctx.globalAlpha = 1; ctx.drawImage(glows[c], x - 14, p.y - 14, 28, 28);
      }
      ctx.globalAlpha = 1; ctx.globalCompositeOperation = "source-over";
    };

    const tick = (t) => {
      if (document.hidden) return;
      if (t - last > 33) {
        const dy = window.scrollY - lastScroll; lastScroll = window.scrollY;
        velocity = velocity * 0.9 + dy * 0.0004;               // scroll gives the helix a little extra spin
        spin += 0.009 + velocity;
        for (const p of pulses) { p.y += p.speed * 3 + Math.abs(dy) * 0.2; if (p.y > H + 40) { p.y = -40; p.strand = Math.random() < 0.5 ? 0 : 1; } }
        draw(t); last = t;
      }
      requestAnimationFrame(tick);
    };

    draw(0);
    window.addEventListener("resize", () => { [W, H] = fitCanvas(dna); draw(0); });
    if (reduce) window.addEventListener("scroll", () => draw(0), { passive: true });
    else {
      requestAnimationFrame(tick);
      document.addEventListener("visibilitychange", () => { if (!document.hidden) requestAnimationFrame(tick); });
    }
  }

  /* ---------- Genesis: tiny artificial-life sim (runs only when visible) ---------- */
  const life = document.querySelector("canvas.life");
  if (life) {
    const ctx = life.getContext("2d");
    let [W, H] = fitCanvas(life);
    let agents = [], food = [], visible = false, last = 0;
    const spawn = (x, y, e = 0.6) => agents.push({ x, y, vx: 0, vy: 0, e, dying: 0 });
    const reset = () => {
      agents = []; food = [];
      for (let i = 0; i < 26; i++) spawn(Math.random() * W, Math.random() * H, 0.4 + Math.random() * 0.4);
      for (let i = 0; i < 40; i++) food.push({ x: Math.random() * W, y: Math.random() * H });
    };
    reset();

    const step = () => {
      if (food.length < 60 && Math.random() < 0.5) food.push({ x: Math.random() * W, y: Math.random() * H });
      const born = [];
      for (const a of agents) {
        if (a.dying) { a.dying += 0.04; continue; }
        // seek the nearest food within sensing range, otherwise wander
        let best = null, bd = 70 * 70;
        for (const f of food) { const d = (f.x - a.x) ** 2 + (f.y - a.y) ** 2; if (d < bd) { bd = d; best = f; } }
        if (best) { a.vx += (best.x - a.x) * 0.0025; a.vy += (best.y - a.y) * 0.0025; }
        a.vx += (Math.random() - 0.5) * 0.25; a.vy += (Math.random() - 0.5) * 0.25;
        a.vx *= 0.92; a.vy *= 0.92;
        a.x = (a.x + a.vx + W) % W; a.y = (a.y + a.vy + H) % H;
        a.e -= 0.0035;
        if (best && bd < 36) { a.e += 0.22; food.splice(food.indexOf(best), 1); }
        if (a.e > 1 && agents.length + born.length < 70) { a.e = 0.5; born.push([a.x + 4, a.y + 4]); }
        if (a.e <= 0) a.dying = 0.01;
      }
      born.forEach(([x, y]) => spawn(x, y, 0.5));
      agents = agents.filter((a) => a.dying < 1);
      if (agents.length < 6) reset();
    };

    const draw = () => {
      ctx.fillStyle = "rgba(6, 9, 12, 0.32)"; ctx.fillRect(0, 0, W, H);   // motion trails
      ctx.globalCompositeOperation = "lighter";
      for (const f of food) { ctx.globalAlpha = 0.35; ctx.drawImage(glows[VIOLET], f.x - 4, f.y - 4, 8, 8); }
      for (const a of agents) {
        const c = a.dying ? "255,110,110" : MINT;
        const r = 2 + a.e * 2.4, alpha = a.dying ? 1 - a.dying : 0.55 + a.e * 0.4;
        ctx.globalAlpha = Math.max(0, alpha) * 0.6;
        ctx.drawImage(a.dying ? glows[VIOLET] : glows[MINT], a.x - r * 4, a.y - r * 4, r * 8, r * 8);
        ctx.globalAlpha = Math.max(0, alpha); ctx.fillStyle = `rgb(${c})`;
        ctx.beginPath(); ctx.arc(a.x, a.y, r, 0, Math.PI * 2); ctx.fill();
      }
      ctx.globalAlpha = 1; ctx.globalCompositeOperation = "source-over";
    };

    const tick = (t) => {
      if (!visible || document.hidden) return;
      if (t - last > 33) { step(); draw(); last = t; }
      requestAnimationFrame(tick);
    };
    ctx.fillStyle = "#06090c"; ctx.fillRect(0, 0, W, H);
    for (let i = 0; i < 40; i++) step(); draw();
    if (!reduce) {
      new IntersectionObserver(([en]) => { visible = en.isIntersecting; if (visible) requestAnimationFrame(tick); }).observe(life);
      document.addEventListener("visibilitychange", () => { if (!document.hidden && visible) requestAnimationFrame(tick); });
    }
    window.addEventListener("resize", () => { [W, H] = fitCanvas(life); reset(); });
  }
})();
