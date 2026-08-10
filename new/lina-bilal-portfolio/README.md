# Lina Bilal — Full Stack Developer Portfolio

Production-ready, single-purpose marketing site for a full stack developer.
Static front end (HTML/CSS/JS) — no build step, no framework required to run it.

---

## 1. Project Architecture

```
lina-bilal-portfolio/
├── index.html          # Semantic HTML5 structure, all 7 sections
├── css/
│   └── style.css       # Design tokens (CSS variables), components, responsive rules
├── js/
│   └── main.js         # Small independent modules (IIFE pattern), no globals leaked
├── assets/
│   └── icons/          # Drop real project screenshots / icons here
└── README.md           # This file
```

**Why this structure:** HTML, CSS, and JS are separated so each can be cached,
minified, or replaced independently, and so a future React migration can lift
the CSS design tokens and copy directly without touching markup logic.

### Technology choices

| Concern            | Choice                          | Why |
|---------------------|----------------------------------|-----|
| Markup              | Semantic HTML5 (`header`, `main`, `section`, `article`, `footer`) | SEO + accessibility for free, no ARIA needed for landmark roles |
| Styling             | Vanilla CSS, custom properties, Grid + Flexbox | No build tooling required; instant load; easy to theme (see `:root` and `[data-theme="light"]`) |
| Interactivity       | Vanilla JS, IIFE module pattern  | No framework overhead for a mostly-static page; each module (`Preloader`, `MobileNav`, `ThemeToggle`, etc.) is independently testable and removable |
| Fonts               | JetBrains Mono (display/labels) + Plus Jakarta Sans (body) | Monospace reinforces the "developer" identity without resorting to a generic gradient hero |

This page is intentionally a **static front end**. Your listed stack — React,
Flask, PostgreSQL — is showcased *as content* (the pipeline diagram, skills,
projects) rather than used to build the portfolio itself, since a portfolio
site has no need for a database. If you later want the contact form to
actually deliver mail, see §4 below for the minimal Flask endpoint to pair
with it.

---

## 2. Component Guide

| Component | File location | Notes |
|---|---|---|
| Preloader | `index.html` `#preloader`, `style.css` §2, `main.js` `Preloader` | Hides after `window.load`; respects `prefers-reduced-motion` |
| Navigation | `.site-nav` | Sticky, blurred glass background; collapses to a slide-in panel under 720px (`MobileNav` module) |
| Theme toggle | `#themeToggle` | Swaps `data-theme` attribute on `<body>`; all colors are CSS variables so no other code needs to change |
| Hero / pipeline diagram | `.hero`, `.pipeline` | Signature visual: animated packets traveling Client → React → Flask → PostgreSQL, built with layered `<div>`s and CSS keyframes — no JS or canvas needed |
| Role typewriter | `#roleText`, `RoleTyper` | Cycles through role strings, character by character |
| Scroll reveal | `.reveal` class, `ScrollReveal` | One `IntersectionObserver` handles every animated element on the page |
| Active nav highlight | `ActiveNav` | A second `IntersectionObserver` tracks which section is in view |
| Skills | `.skills-grid` | Grouped by architecture layer (Frontend / Backend / Data / Tooling), not a flat tag list |
| Projects | `.projects-grid` | Each `<article>` has a thumbnail, description, tags, and **Live Demo / Source Code** links — replace `href="#"` with real URLs |
| Testimonials | `.testimonial-slider`, `TestimonialSlider` | Auto-advancing carousel, pauses on hover, dot navigation |
| Contact form | `#contactForm`, `ContactForm` | Client-side validation (name, email format, message required); currently simulates a send — wire to a real endpoint per §4 |

---

## 3. Responsive & Performance Notes

- Breakpoints: **980px** (tablet — grids collapse from 3–4 columns to 2/1) and
  **720px** (mobile — nav becomes a slide-in panel, forms stack to one column).
- Tested visually at 375px (mobile), 768px (tablet), 1440px (desktop) viewport widths.
- Fonts load via `<link rel="preconnect">` to reduce Google Fonts latency.
- No render-blocking JS: `main.js` is loaded at the end of `<body>`.
- All animation respects `prefers-reduced-motion: reduce`.
- No external JS frameworks/libraries are loaded — first paint is essentially
  just the HTML + CSS you see here, plus two font families.
- Images: none are hard-coded yet — the design uses CSS gradients and emoji
  as placeholders for thumbnails/avatars so the page has zero image weight
  out of the box. Add real screenshots to `assets/` and swap the
  `<span class="thumb-icon">` elements for `<img loading="lazy">` tags.

### Before shipping, run:
- Lighthouse (Performance / Accessibility / SEO / Best Practices) in Chrome DevTools.
- A keyboard-only pass: Tab through the whole page and confirm every
  interactive element (nav links, theme toggle, project links, form fields,
  slider dots) gets a visible focus ring.
- `git diff --stat` style content review: replace placeholder testimonial
  names, GitHub/LinkedIn links, and demo/source links before publishing.

---

## 4. Deployment Guide

This is a static site — it can be deployed anywhere that serves static files.

### Option A — Netlify / Vercel (recommended, free tier)
1. Push this folder to a GitHub repository.
2. Import the repo in Netlify or Vercel.
3. Build command: none. Publish directory: `/` (project root).
4. Done — you'll get a live HTTPS URL and automatic redeploys on every push.

### Option B — GitHub Pages
1. Push to a repository named `<username>.github.io`, or enable Pages on any
   repo (Settings → Pages → Deploy from branch → `main` → `/root`).
2. Site will be live at `https://<username>.github.io/<repo>/`.

### Option C — Any traditional web host
Upload `index.html`, `css/`, and `js/` via FTP/SFTP to your host's public
directory (often `public_html/`). No server-side runtime is required.

### Wiring the contact form to a real backend (optional, matches your stated stack)
Since you listed Flask + PostgreSQL, here's the minimal pairing if you want
the form to actually deliver messages instead of simulating it:

```python
# app.py — minimal Flask endpoint
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # restrict origins in production

@app.post("/api/contact")
def contact():
    data = request.get_json()
    name, email, message = data.get("name"), data.get("email"), data.get("message")
    if not all([name, email, message]):
        return jsonify(error="Missing fields"), 400
    # TODO: insert into PostgreSQL (e.g. via SQLAlchemy) and/or send an email
    return jsonify(ok=True), 200
```

Then in `js/main.js`, replace the `setTimeout` inside `ContactForm.init()`
with a real `fetch('/api/contact', { method: 'POST', body: JSON.stringify(fields), headers: {'Content-Type':'application/json'} })` call.

---

## 5. Future Improvement Ideas

- **CMS-driven projects/testimonials**: move project and testimonial data into
  a small JSON file or Flask+PostgreSQL-backed API so new entries don't
  require editing HTML.
- **Blog section**: a `/blog` route (Flask + Jinja or a static generator) to
  publish write-ups, which also helps SEO.
- **Case study pages**: link each project card to a dedicated page with more
  screenshots, the problem statement, and technical decisions.
- **Analytics**: add a privacy-respecting analytics snippet (e.g. Plausible)
  to see which sections get engagement.
- **i18n**: the copy is in English; an Amharic translation toggle would suit
  a wider audience given your context.
- **Automated testing**: Playwright/Cypress smoke test that checks nav,
  theme toggle, and form validation on every deploy.
- **Real persistence for theme preference**: if hosting outside a sandboxed
  preview, persist the light/dark choice with `localStorage` (intentionally
  left in-memory-only here).
