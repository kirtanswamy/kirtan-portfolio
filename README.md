# Kirtan Swamy — Portfolio

An editorial, paper-inspired portfolio experience built with React, Vite, GSAP and Lenis. The visual direction takes cues from the magazine-like composition and oversized typography of the Niccolo Miranda reference while using original content, a responsive layout and a distinct identity.

## Stack

- React 19
- Vite 8
- GSAP + ScrollTrigger
- Lenis smooth scrolling
- Lucide React icons
- DM Sans, DM Mono and Playfair Display

## Run locally

Requirements: Node.js 20.19+ or 22.12+.

```bash
npm install
npm run dev
```

Create a production build:

```bash
npm run build
npm run preview
```

## Project structure

```
.
├── index.html
├── public/
│   └── favicon.svg
├── src/
│   ├── App.jsx
│   ├── main.jsx
│   └── styles.css
├── package.json
└── vite.config.js
```

## Personalization

Update project details and links in `src/App.jsx`. The BUSHO, Varsity, ElectroLab and JanSeva One entries are based on Kirtan's known projects. Replace the editorial placeholder portrait with a personal photograph before publishing. Add a verified email address and exact LinkedIn profile URL before enabling direct contact links.

## Development workflow

The stable baseline lives on `main`. Active editorial redesign work is developed separately on `feature/editorial-world-rebuild` and reviewed through [Pull Request #1](https://github.com/kirtanswamy/kirtan-portfolio/pull/1).

Before merging a release:

1. Run `npm ci` and `npm run build`.
2. Review the site at desktop, tablet and mobile widths.
3. Check keyboard navigation and the reduced-motion experience.
4. Verify project descriptions, credential status, academic details and contact links.
5. Merge the reviewed pull request into `main` only after those checks pass.

The current branch is a work in progress; it is not yet the published portfolio.

## Deployment

This repository is ready to import into Vercel. Use the default Vite settings:
- Build command: `npm run build`
- Output directory: `dist`

## Credits

The original design reference is the public [Niccolo Miranda clone](https://github.com/03aey/niccolo-miranda-clone). This project does not copy its code or assets; it recreates selected editorial design principles in an original implementation.
