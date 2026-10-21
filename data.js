/*
  PORTFOLIO DATA — every value below comes from the Oct 21, 2026 Google Ads audit.
  To protect client confidentiality, dollar-based metrics (spend, CPC, CPL) and lead
  volume are INDEXED, not absolute. Conversion rate is a ratio and shown as a real %.
  Do not replace these with raw client figures unless your employer approves it in writing.
*/
window.PORTFOLIO_DATA = {
  case1: {
    id: "case1",
    title: "Monthly performance, Jan–Sep 2026",
    baseLabel: "Q2 2026 avg = 100",
    months: ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep"],
    period: { before: [3,5], after: [6,8], beforeLabel: "Q2 · BASELINE", afterLabel: "Q3 · AFTER", name: "Q2 → Q3" },
    metrics: {
      leads: { label: "Leads", unit: "index", good: "up", desc: "Tracked conversions (calls from ads), indexed to the Q2 monthly average.",
               values: [112,105,98,105,90,105,225,311,266], change: "+168%" },
      cpl:   { label: "CPL", unit: "index", good: "down", desc: "Cost per lead: ad spend ÷ tracked conversions. Indexed, Q2 = 100. Lower is better.",
               values: [88,96,103,97,108,96,45,30,38], change: "−63%" },
      cpc:   { label: "CPC", unit: "index", good: "down", desc: "Average cost per click, indexed, Q2 = 100. Lower is better.",
               values: [64,63,86,93,107,101,79,82,84], change: "−18%" },
      cvr:   { label: "Conv. rate", unit: "pct", good: "up", desc: "Conversion rate: tracked conversions ÷ clicks.",
               values: [4.3,3.9,5.0,5.7,5.9,6.3,10.4,16.5,13.1], change: "5.9% → 13.2% (+7.3 pts)" },
      spend: { label: "Spend", unit: "index", good: "flat", desc: "Monthly ad spend, indexed, Q2 = 100. Shown to prove the budget stayed flat.",
               values: [99,101,101,102,97,101,101,93,101], change: "−2% (held flat)" }
    },
    annotations: [
      { i: 4, pos: 4.9, label: "1", text: "May 28 — Conversion goals cleaned up: page-view action removed from primary; lead-form submit made primary." },
      { i: 6, pos: 5.97, label: "2", text: "Jun 30 – Jul 1 — Keyword restructure in two ad groups, new ad assets on both Search campaigns." },
      { i: 6, pos: 6.5, label: "3", text: "July — Active budget rebalancing between campaigns; ad-schedule report built; RSA refresh; shared negative list expanded." }
    ]
  },
  case2: {
    id: "case2",
    title: "Monthly performance, first full months after launch",
    baseLabel: "Jun–Jul avg = 100",
    months: ["Jun","Jul","Aug","Sep"],
    period: { before: [0,1], after: [2,3], beforeLabel: "JUN–JUL · BASELINE", afterLabel: "AUG–SEP · AFTER", name: "Jun–Jul → Aug–Sep" },
    metrics: {
      leads: { label: "Leads", unit: "index", good: "up", desc: "Tracked conversions, indexed to the Jun–Jul monthly average.", values: [69,131,123,215], change: "+69%" },
      cpl:   { label: "CPL", unit: "index", good: "down", desc: "Cost per lead, indexed, Jun–Jul = 100. Lower is better.", values: [141,78,79,47], change: "−41%" },
      cpc:   { label: "CPC", unit: "index", good: "down", desc: "Average cost per click, indexed, Jun–Jul = 100.", values: [115,89,114,92], change: "+2%" },
      cvr:   { label: "Conv. rate", unit: "pct", good: "up", desc: "Tracked conversions ÷ clicks.", values: [2.4,3.3,4.2,5.7], change: "2.9% → 5.0% (+2.1 pts)" },
      spend: { label: "Spend", unit: "index", good: "flat", desc: "Monthly ad spend, indexed, Jun–Jul = 100.", values: [98,102,97,102], change: "0% (held flat)" }
    },
    annotations: [
      { i: 1, pos: 1.7, label: "1", text: "Jul 22 — Tracking cleanup: duplicate call conversions removed from primary goals; lead-form action tied to the thank-you page." }
    ]
  }
};
