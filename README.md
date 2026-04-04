# Kuldeepsinh Jhala — Portfolio

A **React + Vite** personal portfolio with a **JSON-first content model**: update data in `src/data/*.json` and the UI reflects it—no layout or component edits required for routine content changes.

<p align="center">
  <img src="https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black" alt="React" />
  <img src="https://img.shields.io/badge/Vite-7-646CFF?logo=vite&logoColor=white" alt="Vite" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-4-38B2AC?logo=tailwind-css&logoColor=white" alt="Tailwind" />
</p>

---

## Highlights

- **Section-level JSON** — One file per area (projects, experience, education, journey, skills, achievements, contact, landing, blog, resume).
- **Composable UI** — `sections/` render pages; `components/` hold cards, media grids, and shared widgets.
- **Unified scroll & routes** — Tab-style navigation with `UnifiedPortfolioScroll` / `AppRoutes` (`src/routes/`).
- **Media pipeline** — Bundled logos under `src/assets/`, optional **absolute URLs** (e.g. CloudFront) in JSON for certificates and remote images; helpers in `utils/projectMedia.js` and `utils/resolveJourneyLogo.js`.
- **CDN catalog** — `src/data/s3_urls.json` maps **stable keys → CloudFront URLs** for private S3–backed assets (use these URLs in JSON where you want a single source of truth for long-lived links).

---

## Tech stack

| Layer | Choice |
|--------|--------|
| UI | React 19, Tailwind CSS 4 |
| Build | Vite 7 |
| Routing | React Router 7 |
| Icons | Heroicons |
| Analytics | Vercel Speed Insights |

---

## Repository layout (`src/`)

```
src/
├── App.jsx                 # Shell + terminal loader gate
├── main.jsx
├── styles/
│   └── global.css          # Global styles & theme
├── data/                   # ★ Content — edit these to update the site
│   ├── landing.json
│   ├── project.json
│   ├── experience.json
│   ├── education.json
│   ├── journey.json
│   ├── skills.json
│   ├── achievements.json
│   ├── contact.json
│   ├── blog.json
│   ├── resume.json
│   ├── s3_urls.json        # Key → CloudFront URL map (CDN catalog)
│   └── …
├── assets/                 # Local images/logos (imported / resolved by filename)
├── sections/               # Page-level views (Landing, Projects, Experience, …)
├── components/             # Reusable UI (cards, Navbar, SearchBar, media, …)
├── routes/                 # Route table + unified scroll experience
├── config/                 # Section flow, site search index
├── context/                # Tab / navbar / copilot state
└── utils/                  # Media normalization, logo resolution, search helpers
```

---

## Content workflow (JSON → UI)

1. Pick the section file in **`src/data/`** (e.g. `project.json`, `experience.json`).
2. Edit structured fields: titles, descriptions, `sequence` (ordering), `media.images` / `documents` / `links`, etc.
3. Run **`npm run dev`** and verify locally, then **`npm run build`** before deploy.

**Ordering:** Several sections sort by `sequence` (e.g. projects, experience, education, journey). Adjust numbers in JSON to change display order—no code change.

**Media shapes:** Prefer structured entries where supported, e.g. `{ "url", "alt", "label" }` for gallery items; image-like document URLs (e.g. `.jpg` certificates) can appear under `documents` and render in the same gallery as images.

---

## Assets: local vs CloudFront

| Source | Use case |
|--------|-----------|
| **`src/assets/`** | Logos and images referenced by **filename** in JSON; resolved at build time via `resolveJourneyLogo` / Vite glob. |
| **Absolute URLs in JSON** | Certificates, screenshots, or files served from **CloudFront** (private S3 origin, public access blocked on the bucket). |
| **`s3_urls.json`** | Human-readable **aliases** (`"keshav-encon-internship-certificate"` → full URL). Paste the URL from here into `experience.json` / `achievements.json` / `media` blocks when you want to avoid duplicating long URLs—keep this file in sync when URLs rotate. |

Example (conceptual) for the portfolio project: long-form copy and links live in `project.json`; production deployment and S3/CloudFront behavior are described there and mirrored in your infrastructure—not hardcoded in JSX.

---

## Scripts

```bash
npm install    # dependencies
npm run dev    # local dev server
npm run build  # production build → dist/
npm run preview# preview production build
npm run lint   # ESLint
```

---

## Deployment

Configured for **Vercel** (CI/CD on push to `main`). The portfolio describes **JSON-driven** updates and fast deploys; asset delivery for sensitive files uses **private S3 + CloudFront** as documented in your `project.json` and `s3_urls.json`.

---

## License

Private / all rights reserved unless you add an explicit license file.

---

<p align="center">
  Built with a data-driven mindset — <strong>change JSON, ship content.</strong>
</p>
