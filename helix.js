/* The Strand: work items as nodes riding a DNA helix; click a node to open its mind map. */
(() => {
  "use strict";
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ================= data ================= */
  const GROUPS = {
    exp: { label: "Experience", color: "76,245,200" },
    res: { label: "Research", color: "170,140,255" },
    bld: { label: "Builds", color: "90,190,255" },
    cred: { label: "Credentials", color: "242,207,138" },
  };
  const NODES = [
    { g: "exp", flag: true, title: "Mercor · Odin", sub: "Trusted QA reviewer", kicker: "Experience · Oct 2026 – now",
      hook: "Other experts record computer-use agent tasks. I decide whether they ship.",
      branches: [
        { big: "80+", text: "expert reviews in my first three weeks" },
        { big: "<45 min", text: "per review, on target every time" },
        { big: "6 in 10", text: "submissions sent back, each with written fixes" },
        { text: "Made the <b>Trusted tier</b> and was picked for the <b>top-performer incentive</b>" },
        { text: "Hired straight in at reviewer level. ID-verified and background-checked." },
        { img: "assets/mercor-odin/odin-reviewer-performance.png", text: "Reviewer dashboard" },
      ] },
    { g: "exp", title: "Mercor · Feather", sub: "Expert design grader", kicker: "Experience · Jul 2026",
      hook: "I graded AI-generated decks for an enterprise client, with evidence for every score.",
      branches: [
        { big: "6", text: "task types, from aesthetic ranking to template following" },
        { big: "1–7", text: "forced-spread scale; no lazy ties" },
        { big: "45 min", text: "clock per task under strict quality rules" },
        { big: "22k", text: "characters in my own grading manual" },
      ] },
    { g: "exp", title: "micro1 · Titan Proton", sub: "Robotics video data", kicker: "Experience · Sep – Oct 2026",
      hook: "Robots learn from video, and someone has to say exactly when the motion stops being useful.",
      branches: [
        { text: "Frame-level tagging of robotics task footage" },
        { text: "Idle time, wasted motion and task progress, marked to the second" },
        { big: "100%", text: "on both certification quizzes" },
      ] },
    { g: "exp", title: "Labelbox / Alignerr", sub: "Voice-agent red-teamer", kicker: "Experience · Oct 2026",
      hook: "I called a clinic's AI receptionist and tried to break it.",
      branches: [
        { text: "Checked every tool call: identity checks, booking, patient lookup" },
        { text: "Pushed it toward unsafe help to test its refusals" },
        { text: "Tried to make it leak its own system prompt" },
        { text: "Qualified on Alignerr as a <b>Biology Subject Matter Expert</b>" },
      ] },
    { g: "exp", title: "Outlier · Scale AI", sub: "Medical & multilingual", kicker: "Experience · Dec 2025 – Nov 2026",
      hook: "I wrote the prompts that break frontier models, then judged what they said.",
      branches: [
        { text: "<b>White Coat</b>: clinical prompts and response ranking" },
        { text: "<b>Almanac</b>: research prompts with verifiable answers, built to make models fail" },
        { text: "<b>Galaxy Speech</b>: long conversations to find where models fall apart" },
        { text: "<b>Aether, Multimango</b>: Italian evaluation and speech test sets" },
        { text: "<b>Sixth Sense, Mime Orchard, Cribbage Tail</b> and more, with access gated by quality score" },
        { img: "assets/outlier/other-projects/outlier-projects-whitecoat-almanac-galaxy.png", text: "Project history" },
      ] },
    { g: "exp", title: "Ermis", sub: "Audio transcription", kicker: "Experience · Aug 2026",
      hook: "Speech data for model training, done to strict conventions.",
      branches: [
        { text: "Spoken forms, non-speech tags, overlapping speakers" },
        { text: "Training modules 1–4, then production work" },
      ] },

    { g: "res", flag: true, title: "Genesis", sub: "Artificial life", kicker: "Flagship research",
      hook: "What happens when you give an AI agent something to lose?",
      branches: [
        { text: "Single-cell agents that can <b>actually die</b>" },
        { text: "<b>No fitness function</b>: behaviour has to emerge on its own" },
        { big: "~⅓", text: "fewer divisions when fear is removed" },
        { big: "88%", text: "cut from my own headline metric after a null baseline. Honest numbers first." },
        { big: "455", text: "automated tests. Framework paper in preparation." },
      ] },
    { g: "res", flag: true, title: "NeoResist-MD", sub: "Computational oncology", kicker: "Flagship research",
      hook: "Most cancer-AI papers overclaim. I built a research engine that can't.",
      branches: [
        { text: "Ranks <b>neoantigens</b>, the targets for personalised cancer vaccines" },
        { text: "Evidence ladder: <b>discovery → held-out → claim</b>" },
        { big: "27k+", text: "evaluations by its discovery engine" },
        { big: "9", text: "cancer contexts searched" },
        { big: "0", text: "claims promoted without the evidence to back them" },
        { img: "assets/neovax/Screenshot 2026-05-02 201952.png", text: "<a href=\"https://github.com/Adnan-shamim-dar/neoresist-md\" target=\"_blank\" rel=\"noreferrer\">Open on GitHub ↗</a>" },
      ] },

    { g: "bld", flag: true, title: "Tandem", sub: "Private AI runtime", kicker: "Flagship build",
      hook: "Your own private AI, on hardware you already own. No cloud. No telemetry.",
      branches: [
        { text: "Pools a laptop's, phone's and tablet's memory to run <b>one model too big for any of them</b>" },
        { big: "AES-256", text: "end-to-end encrypted device pairing" },
        { big: "~50", text: "tokens per second on a laptop GPU" },
        { big: "18k+", text: "lines across Windows, Android and iOS" },
        { big: "90+", text: "automated checks" },
        { img: "assets/tandem/tandem-home.png", text: "The control room" },
      ] },
    { g: "bld", title: "refusal-gate", sub: "AI safety · open source", kicker: "Build",
      hook: "No source, no claim.",
      branches: [
        { text: "Pulls real PubMed abstracts for every health question" },
        { text: "An LLM judge keeps only the papers that actually study it" },
        { text: "<b>Refuses</b> when the evidence is thin, and rejects drafts that cite papers outside the evidence" },
        { text: "<a href=\"https://github.com/Adnan-shamim-dar/refusal-gate\" target=\"_blank\" rel=\"noreferrer\">Open on GitHub ↗</a>" },
      ] },
    { g: "bld", title: "MedViva", sub: "AI oral examiner", kicker: "Build",
      hook: "An examiner that interrupts you mid-answer, the way real ones do.",
      branches: [
        { text: "Structured clinical questions by topic and difficulty" },
        { text: "Scores every answer against a rubric" },
        { img: "assets/medviva/Screenshot 2026-03-22 173340.png", text: "Practice and exam modes" },
      ] },
    { g: "bld", title: "VivaMed Access", sub: "Hackathon", kicker: "Build",
      hook: "Health explainers for people on slow phones and other languages.",
      branches: [
        { text: "Multilingual and works on low data" },
        { text: "Sources and an AI-assistance disclosure on every page" },
        { text: "<a href=\"https://github.com/Adnan-shamim-dar/vivamed-access\" target=\"_blank\" rel=\"noreferrer\">Open on GitHub ↗</a>" },
      ] },
    { g: "bld", title: "Data & signals", sub: "CGM · ECG · radiology", kicker: "Build",
      hook: "The classic biomedical data work.",
      branches: [
        { text: "<b>CGM</b>: glucose prediction from continuous-monitor data" },
        { text: "<b>ECG</b>: Butterworth denoising and spectral analysis in MATLAB" },
        { text: "<b>Radiology</b>: a review of how far clinical AI adoption has really gone" },
      ] },

    { g: "cred", flag: true, title: "MD · UNIVPM", sub: "Medicine & Surgery", kicker: "Credentials",
      hook: "Medicine is the hardest domain to fake. I'm trained in it.",
      branches: [
        { big: "104th", text: "worldwide on the IMAT admission exam" },
        { text: "<b>ERDIS</b> fully funded merit scholarship" },
        { text: "Year 4 of 6 · Università Politecnica delle Marche" },
      ] },
    { g: "cred", title: "Certifications", sub: "Verified", kicker: "Credentials",
      hook: "The paper trail.",
      branches: [
        { text: "Mercor · Introduction to Agents (AI agent evaluation)" },
        { text: "Alignerr · Biology Subject Matter Expert" },
        { text: "UNIVPM · High-Risk Healthcare Safety" },
        { text: "Google · Foundations of UX Design" },
      ] },
    { g: "cred", title: "Five languages", sub: "IELTS 8.5", kicker: "Credentials",
      hook: "I evaluate AI in more than one language.",
      branches: [
        { big: "8.5", text: "IELTS Academic, English" },
        { text: "Italian: I work on Italian-locale AI projects" },
        { text: "Arabic · Hindi · Urdu" },
      ] },
    { g: "cred", flag: true, title: "Let's talk", sub: "Open to roles", kicker: "Contact",
      hook: "If your model gives medical answers, I'm the person you want reading them first.",
      branches: [
        { text: "<a href=\"mailto:dar.adnan.54@gmail.com\">dar.adnan.54@gmail.com</a>" },
        { text: "<a href=\"cv/Adnan_Shamim_Dar_CV.pdf\">Download CV (PDF)</a>" },
        { text: "<a href=\"https://www.linkedin.com/in/adnan-shamim-dar-85664b230/\" target=\"_blank\" rel=\"noreferrer\">LinkedIn ↗</a>" },
        { text: "<a href=\"https://github.com/Adnan-shamim-dar\" target=\"_blank\" rel=\"noreferrer\">GitHub ↗</a>" },
        { text: "Open to reviewer-lead, QA, human-data and AI research roles" },
      ] },
  ];

  /* ================= setup ================= */
  const $ = (id) => document.getElementById(id);
  const back = $("back"), front = $("front"), bctx = back.getContext("2d"), fctx = front.getContext("2d");
  const layerBack = $("nodes-back"), layerFront = $("nodes-front"), space = $("space");
  let W, H, dpr, R, L, S, CX, RATE, PERSP = 1600;
  let offset = 0, spin = 0, spinSpeed = 0.00028, hoverSlow = 1, last = performance.now();

  // build node chips (each has a twin in front/back layers; only one is visible at a time)
  const els = NODES.map((n, i) => {
    const mk = (layer) => {
      const b = document.createElement("button");
      b.className = `node g-${n.g}${n.flag ? " flag" : ""}`;
      b.innerHTML = `<span class="nd"></span><span class="nt"><b>${n.title}</b><small>${n.sub}</small></span>`;
      b.setAttribute("aria-label", `${n.title}: ${n.sub}. Open map`);
      if (layer === layerBack) { b.tabIndex = -1; b.setAttribute("aria-hidden", "true"); }
      else {
        b.addEventListener("click", () => openMap(i, b));
        b.addEventListener("mouseenter", () => (hoverSlow = 0.08));
        b.addEventListener("mouseleave", () => (hoverSlow = 1));
        b.addEventListener("focus", () => scrollToNode(i));
      }
      layer.appendChild(b); return b;
    };
    return { f: mk(layerFront), b: mk(layerBack) };
  });

  // section index
  const groupsNav = $("groups");
  const groupBtns = Object.entries(GROUPS).map(([key, g]) => {
    const first = NODES.findIndex((n) => n.g === key);
    const count = NODES.filter((n) => n.g === key).length;
    const b = document.createElement("button");
    b.style.setProperty("--c", `rgb(${g.color})`);
    b.innerHTML = `<i></i><span>${g.label}</span><em>${String(count).padStart(2, "0")}</em>`;
    b.addEventListener("click", () => scrollToNode(first));
    groupsNav.appendChild(b);
    return { key, b };
  });

  const layout = () => {
    W = window.innerWidth; H = window.innerHeight;
    const small = W < 760;
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    for (const c of [back, front]) { c.width = W * dpr; c.height = H * dpr; c.getContext("2d").setTransform(dpr, 0, 0, dpr, 0, 0); }
    R = small ? Math.min(W * 0.2, 90) : Math.min(W * 0.13, 220);   // helix radius
    L = R * 2 * 1.6;                                                // one full turn (B-DNA proportions)
    S = small ? 120 : 132;                                          // axis gap between nodes
    CX = small ? W * 0.5 : W * 0.34 + (W - W * 0.34) * 0.5 - 10;    // helix centred in the free area
    RATE = 0.75;                                                    // axis px per scroll px
    space.style.height = ((NODES.length - 1) * S) / RATE + H + "px";
  };

  const nodeY = (i) => i * S;                              // axis position of node i
  const scrollToNode = (i) => window.scrollTo({ top: nodeY(i) / RATE, behavior: reduce ? "auto" : "smooth" });

  // helix geometry at axis position y on strand s (0/1)
  const at = (y, s) => {
    const th = (2 * Math.PI * y) / L + spin + (s ? Math.PI : 0);
    const x = R * Math.sin(th), z = R * Math.cos(th);
    const k = PERSP / (PERSP - z);
    return { sx: CX + x * k, sy: H / 2 + (y - offset) * k, z, k, side: Math.sin(th) };
  };

  /* ================= draw ================= */
  const drawStrands = () => {
    bctx.clearRect(0, 0, W, H); fctx.clearRect(0, 0, W, H);
    const y0 = offset - H / 2 - 60, y1 = offset + H / 2 + 60;
    // base pairs every 18px: drawn on the back layer, fading with depth
    for (let y = Math.floor(y0 / 18) * 18; y <= y1; y += 18) {
      const a = at(y, 0), b = at(y, 1);
      const al = 0.07 + 0.08 * (1 + Math.max(a.z, b.z) / R) / 2;
      const g = bctx.createLinearGradient(a.sx, a.sy, b.sx, b.sy);
      g.addColorStop(0, `rgba(76,245,200,${al})`); g.addColorStop(1, `rgba(90,190,255,${al})`);
      bctx.strokeStyle = g; bctx.lineWidth = 1;
      bctx.beginPath(); bctx.moveTo(a.sx, a.sy); bctx.lineTo(b.sx, b.sy); bctx.stroke();
    }
    // backbones split into front/back segments so nodes can pass behind the strand
    for (let s = 0; s < 2; s++) {
      const col = s ? "90,190,255" : "76,245,200";
      let prev = at(y0, s);
      for (let y = y0 + 5; y <= y1; y += 5) {
        const q = at(y, s), depth = (1 + (q.z + prev.z) / (2 * R)) / 2;
        const ctx = q.z >= 0 ? fctx : bctx;
        ctx.strokeStyle = `rgba(${col},${0.12 + 0.6 * depth})`;
        ctx.lineWidth = 0.8 + 2.4 * depth;
        ctx.beginPath(); ctx.moveTo(prev.sx, prev.sy); ctx.lineTo(q.sx, q.sy); ctx.stroke();
        prev = q;
      }
    }
  };

  let activeGroup = "";
  const placeNodes = () => {
    let nearest = 0, nd = 1e9;
    NODES.forEach((n, i) => {
      const s = i % 2;                                     // alternate strands so nodes wrap both sides
      const p = at(nodeY(i), s);
      const depth = (1 + p.z / R) / 2;                     // 0 back .. 1 front
      const onScreen = p.sy > -60 && p.sy < H + 60;
      const isFront = p.z >= 0;
      const { f, b } = els[i];
      const show = isFront ? f : b, hide = isFront ? b : f;
      hide.style.visibility = "hidden";
      if (!onScreen) { show.style.visibility = "hidden"; return; }
      show.style.visibility = "visible";
      const flip = p.side < 0;                             // left of the axis: chip extends left
      show.classList.toggle("flip", flip);
      const scale = (n.flag ? 0.92 : 0.82) + 0.3 * depth;
      const ox = flip ? "calc(-100% + 15px)" : "-15px";
      show.style.transform = `translate(${p.sx}px, ${p.sy}px) translate(${ox}, -50%) scale(${scale.toFixed(3)})`;
      show.style.opacity = (0.28 + 0.72 * depth).toFixed(3);
      show.style.filter = depth < 0.4 ? `blur(${((0.4 - depth) * 4).toFixed(2)}px)` : "none";
      show.style.zIndex = String(Math.round(depth * 100));
      const dc = Math.abs(p.sy - H / 2);
      if (dc < nd) { nd = dc; nearest = i; }
    });
    const g = NODES[nearest].g;
    if (g !== activeGroup) { activeGroup = g; groupBtns.forEach(({ key, b }) => b.classList.toggle("on", key === g)); }
  };

  const hero = $("hero"), hint = $("hint");
  const tick = (now) => {
    const dt = Math.min(64, now - last); last = now;
    const target = window.scrollY * RATE;
    offset += (target - offset) * (reduce ? 1 : 0.14);
    if (!reduce && mm.hidden) spin += spinSpeed * hoverSlow * dt + (target - offset) * 0.0006;
    drawStrands(); placeNodes();
    hero.classList.toggle("dim", window.scrollY > 120);
    hint.style.opacity = window.scrollY > 60 ? "0" : "1";
    requestAnimationFrame(tick);
  };

  /* ================= mind map ================= */
  const mm = $("mm"), mmLines = $("mm-lines"), mmBranches = $("mm-branches");
  let current = -1, lastFocus = null;

  const openMap = (i, from) => {
    current = (i + NODES.length) % NODES.length;
    const n = NODES[current], col = GROUPS[n.g].color;
    lastFocus = from || lastFocus;
    mm.style.setProperty("--c", `rgb(${col})`);
    $("mm-kicker").textContent = n.kicker;
    $("mm-title").textContent = n.title;
    $("mm-hook").textContent = n.hook;
    const center = $("mm-center");
    center.style.animation = "none"; void center.offsetWidth; center.style.animation = "";
    mm.hidden = false;
    document.body.style.overflow = "hidden";
    renderBranches(n);
    $("mm-close").focus({ preventScroll: true });
  };

  const renderBranches = (n) => {
    mmBranches.innerHTML = ""; mmLines.innerHTML = "";
    const vw = window.innerWidth, vh = window.innerHeight, small = vw < 760;
    const cx = vw / 2, cy = vh / 2;
    const count = n.branches.length;
    const rx = Math.min(vw * 0.34, 470), ry = Math.min(vh * 0.33, 290);
    n.branches.forEach((br, k) => {
      const el = document.createElement("div");
      el.className = "mm-branch";
      el.style.setProperty("--d", `${120 + k * 70}ms`);
      el.innerHTML = (br.img ? `<img src="${br.img}" alt="" loading="lazy" />` : "")
        + (br.big ? `<span class="big">${br.big}</span>` : "")
        + `<p>${br.text}</p>`;
      if (!small) {
        const ang = -Math.PI / 2 + (k / count) * Math.PI * 2 + (count % 2 ? 0 : Math.PI / count);
        const bx = cx + rx * Math.cos(ang), by = cy + ry * Math.sin(ang);
        el.style.left = bx + "px"; el.style.top = by + "px";
        // curved connector from centre to branch
        const mx = cx + (bx - cx) * 0.5 + (by - cy) * 0.12, my = cy + (by - cy) * 0.5 - (bx - cx) * 0.12;
        const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
        path.setAttribute("d", `M${cx},${cy} Q${mx},${my} ${bx},${by}`);
        mmLines.appendChild(path);
        const len = path.getTotalLength();
        path.style.setProperty("--len", len);
        path.style.animationDelay = `${k * 70}ms`;
        const dot = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        dot.setAttribute("cx", bx); dot.setAttribute("cy", by); dot.setAttribute("r", 3.5);
        dot.style.animationDelay = `${300 + k * 70}ms`;
        mmLines.appendChild(dot);
      }
      mmBranches.appendChild(el);
    });
  };

  const closeMap = () => {
    mm.hidden = true; document.body.style.overflow = "";
    if (lastFocus) lastFocus.focus({ preventScroll: true });
  };
  $("mm-close").addEventListener("click", closeMap);
  $("mm-prev").addEventListener("click", () => { openMap(current - 1); scrollToNode(current); });
  $("mm-next").addEventListener("click", () => { openMap(current + 1); scrollToNode(current); });
  mm.addEventListener("click", (e) => { if (e.target === mm || e.target === mmLines) closeMap(); });
  window.addEventListener("keydown", (e) => {
    if (mm.hidden) return;
    if (e.key === "Escape") closeMap();
    if (e.key === "ArrowRight") { openMap(current + 1); scrollToNode(current); }
    if (e.key === "ArrowLeft") { openMap(current - 1); scrollToNode(current); }
  });
  window.addEventListener("resize", () => { layout(); if (!mm.hidden) renderBranches(NODES[current]); });

  layout();
  offset = window.scrollY * RATE;
  requestAnimationFrame(tick);

  // deep link: helix.html#genesis opens that node's map
  const slug = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  const hash = location.hash.slice(1);
  if (hash) { const i = NODES.findIndex((n) => slug(n.title) === hash); if (i >= 0) { scrollToNode(i); setTimeout(() => openMap(i, els[i].f), 300); } }
})();
