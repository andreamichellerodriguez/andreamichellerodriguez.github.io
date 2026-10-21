(() => {
  "use strict";
  const D = window.PORTFOLIO_DATA;
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const NS = "http://www.w3.org/2000/svg";
  const el = (tag, attrs = {}, parent) => {
    const n = document.createElementNS(NS, tag);
    for (const k in attrs) n.setAttribute(k, attrs[k]);
    if (parent) parent.appendChild(n);
    return n;
  };

  /* ---------- Hero entrance ---------- */
  requestAnimationFrame(() => $(".hero").classList.add("ready"));

  /* ---------- Nav state ---------- */
  const nav = $("#nav");
  const onScroll = () => nav.classList.toggle("scrolled", window.scrollY > 40);
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  const navLinks = $$(".nav ul a");
  const secObs = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      const id = e.target.id === "cases" || e.target.id === "numbers" ? "work" : e.target.id;
      navLinks.forEach((a) => a.setAttribute("aria-current", a.getAttribute("href") === "#" + id ? "true" : "false"));
    });
  }, { rootMargin: "-45% 0px -50% 0px" });
  ["work", "cases", "beyond", "expertise", "about", "contact"].forEach((id) => { const s = document.getElementById(id); if (s) secObs.observe(s); });

  /* ---------- Counters (once) ---------- */
  const animateCount = (node) => {
    const target = parseFloat(node.dataset.count);
    const prefix = node.dataset.prefix || "";
    if (reduce) { node.textContent = prefix + target; return; }
    const dur = 1600, t0 = performance.now();
    const step = (t) => {
      const p = Math.min(1, (t - t0) / dur);
      const e = 1 - Math.pow(1 - p, 3);
      node.textContent = prefix + Math.round(target * e);
      if (p < 1) requestAnimationFrame(step);
    };
    node.textContent = prefix + "0";
    requestAnimationFrame(step);
  };

  /* ---------- Reveal + triggers ---------- */
  const revObs = new IntersectionObserver((entries, obs) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      const t = e.target;
      t.classList.add("in");
      $$("[data-count]", t).forEach(animateCount);
      if (t.matches("[data-count]")) animateCount(t);
      $$(".bar i[data-w]", t).forEach((b) => (b.style.width = b.dataset.w + "%"));
      obs.unobserve(t);
    });
  }, { threshold: 0.2 });
  $$(".reveal").forEach((n) => revObs.observe(n));
  // compare blocks live inside .reveal sections already; make sure stats outside reveal also count
  $$("[data-count]").forEach((n) => { if (!n.closest(".reveal")) revObs.observe(n); });

  /* ---------- Sparklines (real CPL index series, inverted so "down" reads as improvement) ---------- */
  $$(".card[data-spark]").forEach((card) => {
    const data = D[card.dataset.spark].metrics.cpl.values;
    const svg = $("svg.spark", card);
    const w = 300, h = 64, pad = 6;
    const min = Math.min(...data), max = Math.max(...data);
    const x = (i) => pad + (i * (w - pad * 2)) / (data.length - 1);
    const yy = (v) => h - pad - ((v - min) / (max - min || 1)) * (h - pad - 18);
    el("line", { x1: 0, x2: w, y1: yy(100), y2: yy(100), stroke: "#B8A99A", "stroke-dasharray": "3 4" }, svg);
    const d = data.map((v, i) => (i ? "L" : "M") + x(i).toFixed(1) + " " + yy(v).toFixed(1)).join(" ");
    const path = el("path", { d, fill: "none", stroke: "#4D0C1B", "stroke-width": 2, "stroke-linejoin": "round", "stroke-linecap": "round" }, svg);
    el("circle", { cx: x(data.length - 1), cy: yy(data[data.length - 1]), r: 4, fill: "#4D0C1B" }, svg);
    const t = el("text", { x: w, y: 10, "text-anchor": "end", "font-size": 10, fill: "#6E6155", "font-family": "Inter, sans-serif", "letter-spacing": ".08em" }, svg);
    t.textContent = "COST PER LEAD · INDEXED";
    if (!reduce) {
      const len = path.getTotalLength();
      path.style.strokeDasharray = len; path.style.strokeDashoffset = len;
      const o = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { path.style.transition = "stroke-dashoffset 1.6s cubic-bezier(.2,.7,.2,1)"; path.style.strokeDashoffset = 0; o.disconnect(); } }), { threshold: .4 });
      o.observe(svg);
    }
  });

  /* ---------- Interactive line charts ---------- */
  const fmt = (m, v) => (m.unit === "pct" ? v.toFixed(1) + "%" : String(v));

  $$("[data-chart]").forEach((card) => {
    const C = D[card.dataset.chart];
    const keys = Object.keys(C.metrics);
    const tabs = $(".tabs", card), plot = $("[data-role=plot]", card);
    const titleEl = $("[data-role=title]", card), subEl = $("[data-role=sub]", card);
    const tableEl = $("[data-role=table]", card);
    const annList = $(".ann-list", card);
    C.annotations.forEach((a) => { const li = document.createElement("li"); li.textContent = a.text; annList.appendChild(li); });

    // table view (all metrics)
    let html = "<table><thead><tr><th>Month</th>" + keys.map((k) => `<th>${C.metrics[k].label}${C.metrics[k].unit === "index" ? " (index)" : ""}</th>`).join("") + "</tr></thead><tbody>";
    C.months.forEach((mo, i) => { html += `<tr><td>${mo} 2026</td>` + keys.map((k) => `<td>${fmt(C.metrics[k], C.metrics[k].values[i])}</td>`).join("") + "</tr>"; });
    tableEl.innerHTML = html + `</tbody></table><p style="margin-top:8px;color:#666">Index base: ${C.baseLabel}.</p>`;

    const tip = document.createElement("div"); tip.className = "tip"; tip.setAttribute("aria-hidden", "true"); plot.appendChild(tip);

    let current = "leads", drawn = false;
    const M = { t: 28, r: 16, b: 34, l: 40 };
    let W = 860, H = 340;

    const draw = (key, animate) => {
      const m = C.metrics[key], data = m.values;
      W = Math.max(300, Math.round(plot.clientWidth || 860)); H = W < 600 ? 280 : 340;
      titleEl.textContent = m.label + " by month";
      const change = m.change;
      subEl.textContent = (m.unit === "pct" ? "Percent of clicks" : "Indexed, " + C.baseLabel) + " · " + C.period.name + ": " + change;
      plot.querySelector("svg")?.remove();
      const svg = el("svg", { viewBox: `0 0 ${W} ${H}`, role: "img", "aria-label": `${m.label} by month. ${m.desc} Change: ${change}.` });
      plot.insertBefore(svg, tip);
      const iw = W - M.l - M.r, ih = H - M.t - M.b;
      let lo = Math.min(...data), hi = Math.max(...data);
      if (m.unit === "index") { lo = Math.min(lo, 100); hi = Math.max(hi, 100); }
      const rawStep = (hi - (m.unit === "pct" ? 0 : lo)) / 4;
      const mag = Math.pow(10, Math.floor(Math.log10(rawStep)));
      const tickStep = [1, 2, 2.5, 5, 10].map((s) => s * mag).find((s) => s >= rawStep);
      lo = m.unit === "pct" ? 0 : Math.max(0, Math.floor(lo / tickStep) * tickStep);
      hi = Math.ceil(hi / tickStep) * tickStep;
      if (hi - Math.max(...data) < tickStep * 0.25) hi += tickStep;
      const x = (i) => M.l + (data.length === 1 ? iw / 2 : (i * iw) / (data.length - 1));
      const y = (v) => M.t + ih - ((v - lo) / (hi - lo)) * ih;
      const step = (x(1) - x(0));

      // periods
      const P = C.period;
      [[P.before, P.beforeLabel, .22, 0], [P.after, P.afterLabel, .6, 2]].forEach(([r, lab, op, gap]) => {
        const x0 = x(r[0]) - step / 2 + gap, x1 = x(r[1]) + step / 2;
        el("rect", { class: "period", x: Math.max(M.l, x0), y: M.t, width: Math.min(W - M.r, x1) - Math.max(M.l, x0), height: ih, style: "opacity:" + op }, svg);
        const t = el("text", { class: "period-l", x: (Math.max(M.l, x0) + Math.min(W - M.r, x1)) / 2, y: M.t - 10, "text-anchor": "middle" }, svg);
        t.textContent = lab;
      });
      // grid + y axis
      const g = el("g", { class: "grid" }, svg), ax = el("g", { class: "axis" }, svg);
      for (let v = lo; v <= hi + 1e-9; v += tickStep) {
        el("line", { x1: M.l, x2: W - M.r, y1: y(v), y2: y(v) }, g);
        const t = el("text", { x: M.l - 8, y: y(v) + 4, "text-anchor": "end" }, ax);
        t.textContent = m.unit === "pct" ? (+v.toFixed(1)) + "%" : Math.round(v);
      }
      C.months.forEach((mo, i) => { const t = el("text", { x: x(i), y: H - 10, "text-anchor": "middle" }, ax); t.textContent = mo; });
      // baseline ref
      if (m.unit === "index") {
        el("line", { class: "ref", x1: M.l, x2: W - M.r, y1: y(100), y2: y(100) }, svg);
        const t = el("text", { class: "ref-l", x: W - M.r - 4, y: y(100) + 14, "text-anchor": "end" }, svg); t.textContent = "BASELINE 100";
      }
      // annotations
      const ag = el("g", { class: "ann" }, svg);
      C.annotations.forEach((a) => {
        const ax0 = M.l + a.pos * step;
        el("line", { x1: ax0, x2: ax0, y1: M.t + 4, y2: M.t + ih }, ag);
        el("circle", { cx: ax0, cy: M.t + 12, r: 8 }, ag);
        const t = el("text", { x: ax0, y: M.t + 15.5, "text-anchor": "middle" }, ag); t.textContent = a.label;
      });
      // line
      const d = data.map((v, i) => (i ? "L" : "M") + x(i).toFixed(1) + " " + y(v).toFixed(1)).join(" ");
      const path = el("path", { class: "ln", d }, svg);
      const pts = data.map((v, i) => el("circle", { class: "pt", cx: x(i), cy: y(v), r: 4.5 }, svg));
      // direct labels: first and last only
      [0, data.length - 1].forEach((i) => {
        const t = el("text", { x: x(i) + (i ? -2 : 2), y: y(data[i]) - 12, "text-anchor": i ? "end" : "start", "font-size": 12, "font-weight": 600, fill: "#222", "font-family": "Inter, sans-serif" }, svg);
        t.textContent = fmt(m, data[i]);
      });
      if (animate && !reduce) {
        const len = path.getTotalLength();
        path.style.strokeDasharray = len; path.style.strokeDashoffset = len;
        pts.forEach((p) => (p.style.opacity = 0));
        requestAnimationFrame(() => {
          path.style.transition = "stroke-dashoffset 1.2s cubic-bezier(.2,.7,.2,1)";
          path.style.strokeDashoffset = 0;
          pts.forEach((p, i) => { p.style.transition = `opacity .3s ${0.15 + i * 0.1}s`; p.style.opacity = 1; });
        });
      }
      // hover layer: crosshair + tooltip
      const xh = el("line", { class: "xh", y1: M.t, y2: M.t + ih, x1: 0, x2: 0, visibility: "hidden" }, svg);
      const hit = el("rect", { x: M.l - step / 2, y: M.t, width: iw + step, height: ih, fill: "transparent" }, svg);
      const show = (i) => {
        xh.setAttribute("x1", x(i)); xh.setAttribute("x2", x(i)); xh.setAttribute("visibility", "visible");
        pts.forEach((p, j) => p.setAttribute("r", j === i ? 6.5 : 4.5));
        const ann = C.annotations.filter((a) => a.i === i).map((a) => `<div style="margin-top:6px;color:#E8D7D9">Milestone ${a.label}</div>`).join("");
        tip.innerHTML = `<b>${C.months[i]} 2026</b>${m.label}: ${fmt(m, data[i])}${m.unit === "index" ? " <span style='opacity:.7'>(index)</span>" : ""}${ann}`;
        const r = svg.getBoundingClientRect(), sx = r.width / W;
        let left = x(i) * sx + 12; if (left > r.width - 170) left = x(i) * sx - 172;
        tip.style.left = left + "px"; tip.style.top = Math.max(0, y(data[i]) * sx - 60) + "px";
        tip.classList.add("on");
      };
      const hide = () => { tip.classList.remove("on"); xh.setAttribute("visibility", "hidden"); pts.forEach((p) => p.setAttribute("r", 4.5)); };
      hit.addEventListener("pointermove", (ev) => {
        const r = svg.getBoundingClientRect(); const px = ((ev.clientX - r.left) / r.width) * W;
        show(Math.max(0, Math.min(data.length - 1, Math.round((px - M.l) / step))));
      });
      hit.addEventListener("pointerleave", hide);
      // keyboard access to points
      svg.setAttribute("tabindex", "0");
      let kIdx = -1;
      svg.addEventListener("keydown", (e) => {
        if (e.key === "ArrowRight") { kIdx = Math.min(data.length - 1, kIdx + 1); show(kIdx); e.preventDefault(); }
        if (e.key === "ArrowLeft") { kIdx = Math.max(0, kIdx - 1); show(kIdx); e.preventDefault(); }
      });
      svg.addEventListener("blur", hide);
    };

    keys.forEach((k, i) => {
      const b = document.createElement("button");
      b.type = "button"; b.setAttribute("role", "tab"); b.textContent = C.metrics[k].label;
      b.setAttribute("aria-selected", k === current ? "true" : "false");
      b.title = C.metrics[k].desc;
      b.addEventListener("click", () => {
        current = k;
        $$("button", tabs).forEach((x) => x.setAttribute("aria-selected", x === b ? "true" : "false"));
        draw(k, true);
      });
      b.addEventListener("keydown", (e) => {
        const bs = $$("button", tabs); const j = bs.indexOf(b);
        if (e.key === "ArrowRight") { bs[(j + 1) % bs.length].focus(); bs[(j + 1) % bs.length].click(); }
        if (e.key === "ArrowLeft") { bs[(j - 1 + bs.length) % bs.length].focus(); bs[(j - 1 + bs.length) % bs.length].click(); }
      });
      tabs.appendChild(b);
    });

    draw(current, false);
    const o = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting && !drawn) { drawn = true; draw(current, true); o.disconnect(); } }), { threshold: .35 });
    o.observe(card);
    let rt; window.addEventListener("resize", () => { clearTimeout(rt); rt = setTimeout(() => draw(current, false), 150); });
  });

  /* ---------- Story nav: highlight current step ---------- */
  $$(".story").forEach((story) => {
    const links = $$(".story-nav a", story);
    const o = new IntersectionObserver((es) => es.forEach((e) => {
      if (e.isIntersecting) links.forEach((a) => a.classList.toggle("active", a.getAttribute("href") === "#" + e.target.id));
    }), { rootMargin: "-40% 0px -55% 0px" });
    $$(".story-body > section", story).forEach((s) => o.observe(s));
  });
})();
