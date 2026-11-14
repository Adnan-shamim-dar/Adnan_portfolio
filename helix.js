/* The Strand: portfolio chapters ride on a 3D DNA helix that turns as you scroll. */
(() => {
  "use strict";
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduce) return;                                   // plain readable list stays in place

  document.body.classList.add("helix-on");
  const cards = [...document.querySelectorAll(".strand-card")];
  const n = cards.length;
  const space = document.getElementById("space");
  const rail = document.getElementById("rail");
  const cv = document.getElementById("strand");
  const ctx = cv.getContext("2d");
  const PERSP = 1400;                                   // must match .stage perspective
  const MINT = "76,245,200", CYAN = "90,190,255", VIOLET = "170,140,255";

  let W, H, R, STEP, GAP, PER, dpr;
  let p = 0, target = 0, snapTimer = 0, active = -1;

  const layout = () => {
    W = window.innerWidth; H = window.innerHeight;
    const small = W < 760;
    R = small ? W * 0.18 : Math.min(W * 0.2, 300);      // helix radius the cards sit on
    STEP = small ? 0.5 : 0.62;                          // twist between chapters (rad)
    GAP = H * (small ? 0.62 : 0.56);                    // rise between chapters (px)
    PER = H * 0.8;                                      // scroll distance per chapter
    space.style.height = (n - 1) * PER + H + "px";
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    cv.width = W * dpr; cv.height = H * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  };

  // chapter rail
  cards.forEach((c, i) => {
    const b = document.createElement("button");
    b.innerHTML = `${c.dataset.label || i + 1}<i></i>`;
    b.setAttribute("aria-label", `Go to ${c.dataset.label || "chapter " + (i + 1)}`);
    b.addEventListener("click", () => window.scrollTo({ top: i * PER, behavior: "smooth" }));
    rail.appendChild(b);
  });
  const railBtns = [...rail.children];

  // glow sprites
  const sprite = (rgb) => {
    const s = document.createElement("canvas"); s.width = s.height = 64;
    const g = s.getContext("2d"), grd = g.createRadialGradient(32, 32, 0, 32, 32, 32);
    grd.addColorStop(0, `rgba(${rgb},1)`); grd.addColorStop(.2, `rgba(${rgb},.5)`); grd.addColorStop(1, `rgba(${rgb},0)`);
    g.fillStyle = grd; g.fillRect(0, 0, 64, 64); return s;
  };
  const glow = { [MINT]: sprite(MINT), [CYAN]: sprite(CYAN), [VIOLET]: sprite(VIOLET) };

  // 3D helix point for parameter t (chapter units). strand 0 carries the cards.
  const point = (t, strand, spin) => {
    const d = t - p, th = d * STEP + spin + (strand ? Math.PI : 0);
    return { x: R * Math.sin(th), y: d * GAP, z: R * Math.cos(th) - R };
  };
  const project = (q) => {
    const s = PERSP / (PERSP - q.z);
    return { x: W / 2 + q.x * s, y: H / 2 + q.y * s, s, z: q.z };
  };

  const drawStrands = () => {
    ctx.clearRect(0, 0, W, H);
    const from = p - 3, to = p + 3, dt = 0.04;
    // rungs (base pairs)
    for (let t = Math.ceil(from * 6) / 6; t <= to; t += 1 / 6) {
      const a = project(point(t, 0, 0)), b = project(point(t, 1, 0));
      const front = Math.max(0, Math.min(1, (Math.max(a.z, b.z) + 2 * R) / (2 * R)));
      const g = ctx.createLinearGradient(a.x, a.y, b.x, b.y);
      g.addColorStop(0, `rgba(${MINT},${0.05 + 0.2 * front})`); g.addColorStop(1, `rgba(${CYAN},${0.05 + 0.2 * front})`);
      ctx.strokeStyle = g; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
    }
    // backbones, brightness by depth
    for (let strand = 0; strand < 2; strand++) {
      let prev = project(point(from, strand, 0));
      for (let t = from + dt; t <= to; t += dt) {
        const q = project(point(t, strand, 0));
        const depth = Math.max(0, Math.min(1, (q.z + 2 * R) / (2 * R)));
        ctx.strokeStyle = `rgba(${strand ? CYAN : MINT},${0.12 + 0.55 * depth})`;
        ctx.lineWidth = 1 + 2.2 * depth;
        ctx.beginPath(); ctx.moveTo(prev.x, prev.y); ctx.lineTo(q.x, q.y); ctx.stroke();
        prev = q;
      }
    }
    // nucleotides + card anchors
    ctx.globalCompositeOperation = "lighter";
    for (let t = Math.ceil(from * 6) / 6; t <= to; t += 1 / 6) {
      for (let strand = 0; strand < 2; strand++) {
        const q = project(point(t, strand, 0));
        const depth = Math.max(0, Math.min(1, (q.z + 2 * R) / (2 * R)));
        const anchor = strand === 0 && Math.abs(t - Math.round(t)) < 1e-3;
        const c = strand ? CYAN : MINT, r = (anchor ? 4 : 1.6) + 2.2 * depth;
        ctx.globalAlpha = 0.25 + 0.6 * depth;
        ctx.drawImage(glow[c], q.x - r * 4, q.y - r * 4, r * 8, r * 8);
      }
    }
    ctx.globalAlpha = 1; ctx.globalCompositeOperation = "source-over";
  };

  const placeCards = () => {
    let best = 0, bestD = 1e9;
    cards.forEach((card, i) => {
      const d = i - p;
      const ad = Math.abs(d);
      if (ad > 3.2) { card.style.opacity = 0; card.style.visibility = "hidden"; return; }
      card.style.visibility = "visible";
      const th = d * STEP;
      const x = R * Math.sin(th), y = d * GAP, z = R * Math.cos(th) - R;
      // card hangs off its anchor on the strand and faces outward from the axis
      card.style.transform = `translate3d(${x}px, ${y}px, ${z}px) rotateY(${th}rad) translate(-50%, -50%)`;
      const facing = Math.cos(th);
      card.style.opacity = Math.max(0, Math.min(1, (facing - 0.2) / 0.6)) * Math.max(0, 1 - Math.max(0, ad - 1.2));
      card.style.filter = ad > 0.6 ? `blur(${Math.min(3, (ad - 0.6) * 2.4).toFixed(2)}px)` : "none";
      card.style.zIndex = String(1000 - Math.round(ad * 100));
      if (ad < bestD) { bestD = ad; best = i; }
    });
    cards.forEach((c, i) => c.classList.toggle("front", i === best && bestD < 0.35));
    if (best !== active) { active = best; railBtns.forEach((b, i) => b.classList.toggle("on", i === best)); }
  };

  const frame = () => {
    target = window.scrollY / PER;
    p += (target - p) * 0.12;
    if (Math.abs(target - p) < 0.0005) p = target;
    placeCards(); drawStrands();
    requestAnimationFrame(frame);
  };

  // gentle snap so a chapter always settles facing you
  window.addEventListener("scroll", () => {
    clearTimeout(snapTimer);
    snapTimer = setTimeout(() => {
      const i = Math.round(window.scrollY / PER);
      if (Math.abs(window.scrollY - i * PER) > 2) window.scrollTo({ top: i * PER, behavior: "smooth" });
    }, 160);
  }, { passive: true });

  window.addEventListener("keydown", (e) => {
    const i = Math.round(window.scrollY / PER);
    if (["ArrowDown", "PageDown", "j"].includes(e.key)) { e.preventDefault(); window.scrollTo({ top: Math.min(n - 1, i + 1) * PER, behavior: "smooth" }); }
    if (["ArrowUp", "PageUp", "k"].includes(e.key)) { e.preventDefault(); window.scrollTo({ top: Math.max(0, i - 1) * PER, behavior: "smooth" }); }
  });

  window.addEventListener("resize", layout);
  layout(); p = target = window.scrollY / PER;
  requestAnimationFrame(frame);
})();
