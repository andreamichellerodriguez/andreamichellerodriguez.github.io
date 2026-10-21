# Andrea Michelle Rodriguez — Paid Media Portfolio

This is a static website: plain HTML, CSS, and JavaScript. There's no build step, no framework, and no paid fonts or plugins. The fonts (Cormorant Garamond and Inter, both under the free SIL Open Font License) are stored in `/fonts`, so the site doesn't depend on any third-party service.

## What's inside

| File | What it does |
|---|---|
| `index.html` | All 8 sections of the page |
| `styles.css` | Brand colors, typography, layout, responsive rules, reduced-motion support |
| `main.js` | Animated counters, scroll reveals, interactive charts (metric tabs, hover and keyboard tooltips), case-study step navigation |
| `data.js` | Chart data. It's indexed (no raw client dollars or lead counts) |
| `assets/Andrea-Rodriguez-Paid-Media-Portfolio.pdf` | The matching 6-page PDF portfolio |
| `fonts/` | Self-hosted web fonts |

## Before you publish: fill these placeholders

1. ~~Email, LinkedIn, résumé~~ — done.

3. Your portrait (optional): replace the "AMR" block in the About section with `<img src="assets/portrait.jpg" alt="Andrea Michelle Rodriguez">`.
4. SWE Homes details: your title, dates, and 2–3 approved creative samples.
5. Get written employer approval for the exact metrics shown (see the evidence table you received separately).

## Preview it on your computer

Double-click `index.html`, or for the most accurate result run a tiny local server from inside this folder:

```
python3 -m http.server 8000
```

Then open http://localhost:8000

## Publish it for free on GitHub Pages ($0)

1. Create a free account at github.com if you don't have one.
2. Click **New repository** and name it `your-username.github.io` to get the cleanest URL. Any name works, though: `portfolio` becomes `your-username.github.io/portfolio`. Set it to **Public**.
3. Click **Add file → Upload files**, drag in *everything inside this folder* (index.html, styles.css, main.js, data.js, fonts/, assets/), then click **Commit changes**.
4. Go to **Settings → Pages**. Under "Build and deployment," choose **Deploy from a branch**, branch **main**, folder **/(root)**, then **Save**.
5. Wait 1–2 minutes and your site is live at `https://your-username.github.io`.

To update it later, upload the changed files again. Other free options that work the same way: Netlify Drop (drag the folder onto app.netlify.com/drop) and Cloudflare Pages.

## Accessibility and performance notes

- Fully keyboard navigable. Chart tabs respond to arrow keys, and focused charts let you step through months with ← →.
- Respects `prefers-reduced-motion`: animations are turned off and numbers show instantly.
- Every chart has a "View as table" option, a source line, its date range, and a methodology note.
- No images, so the page is lightweight: about 200 KB of fonts plus about 40 KB of code.
