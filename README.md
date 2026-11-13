# Kirtan Swamy — The Maker's Notebook

An original editorial portfolio planned as a living newspaper / maker's notebook: cinematic 3D opening, torn-paper global index, tactile project bookshelf and a visual autobiography. The current build is the foundation; the approved motion-led redesign will be delivered milestone by milestone.

## Stack

- React 19 + Vite 8
- GSAP + ScrollTrigger for entrance and scroll reveals
- Lenis for smooth scrolling
- Lucide React icons
- Space Grotesk, Playfair Display and DM Mono

## Run locally

Requirements: Node.js 20.19+ or 22.12+.

```bash
npm install
npm run dev
```

Production build:

```bash
npm run build
npm run preview
```

## Approved experience architecture

1. Cinematic newspaper opening and front page
2. Horizontal project bookshelf and individual case studies
3. Recognition and leadership milestones
4. Cinematic About autobiography
5. Education and journey
6. Verified learning and certification archive
7. Skills and workshop
8. Contact and closing page

Featured projects: BUSHO, Varsity, ElectroLab, JanSeva One and Chhutti Ke Baad. Varsity is in development and is not deployed; ElectroLab and Varsity therefore link to source only. JanSeva One is an ideation-stage concept that was never implemented.

Global navigation is planned as a torn-paper INDEX; project navigation remains a separate tactile bookshelf. The existing newspaper-style character artwork is temporary until a custom likeness is created from a user-supplied portrait. The current opening is a CSS perspective prototype; WebGL paper displacement is a later milestone.

## Interactions and accessibility

- Eight-chapter desktop rail and full-screen torn-edge INDEX on desktop and mobile; Escape closes it, Tab focus is contained, and focus returns to the trigger.
- Current build: horizontal project archive with pointer drag, touch scrolling, keyboard arrows, Home and End. Next milestone: replace the grid-like shelf with a tactile bookshelf and book-open transitions.
- Project detail dialogs with Escape-to-close, focus trapping, focus restoration and backdrop dismissal.
- Scroll progress, GSAP section reveals and restrained hero parallax.
- Reduced-motion handling and keyboard-visible focus styles.

## Personal data accuracy

Some credential records are deliberately labelled as courses, simulations or items to verify. Do not relabel them as professional certifications until the certificate / credential itself has been checked. Academic grades and current semester are not published until the latest values are confirmed. The current newspaper-style character illustration is a temporary placeholder; the personal likeness version is deferred until a portrait is supplied.

Before launch:
- Verify current academic year / semester and CGPA if you want to publish them.
- Verify credential names, issue dates and certificate URLs.
- Add the exact LinkedIn profile URL and a public contact email.
- Confirm the current BUSHO and Varsity project status and live links.
- Supply real screenshots and evidence for BUSHO, Varsity, ElectroLab, JanSeva One and Chhutti Ke Baad.
- Replace the reserved hero illustration with the approved custom character.

## Deployment

Vercel defaults:
- Build command: `npm run build`
- Output directory: `dist`

The portfolio takes interaction inspiration from the live Niccolò Miranda website, but its copy, layout, illustrations and styling are implemented as an original identity. The approved roadmap is in `ROADMAP.md`.
