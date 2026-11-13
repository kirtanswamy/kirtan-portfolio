# Kirtan Swamy — The Maker's Notebook

An original editorial portfolio built as a living newspaper / maker's notebook. The visual system uses warm paper, ink, cobalt and vermilion, oversized typography, field notes, project covers, and a character-artwork placeholder reserved for a future custom illustration.

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

## Sections

1. Opening cover and maker's manifesto
2. Selected work / horizontal project archive
3. Think · Create · Deliver
4. Recognition archive
5. Up Next / active work notebook
6. Viksit Bharat field note
7. About / personal story
8. Journey / education and community
9. Learning archive
10. Skills and tools
11. Contact and footer

## Interactions and accessibility

- Desktop chapter rail and mobile chapter navigation.
- Horizontal project archive with pointer drag, touch scrolling, keyboard arrows, Home and End.
- Project detail dialogs with Escape-to-close, focus trapping, focus restoration and backdrop dismissal.
- Scroll progress, GSAP section reveals and restrained hero parallax.
- Reduced-motion handling and keyboard-visible focus styles.

## Personal data accuracy

Some credential records are deliberately labelled as courses, simulations or items to verify. Do not relabel them as professional certifications until the certificate / credential itself has been checked. Academic grades and current semester are not published until the latest values are confirmed. The hero illustration is a designed placeholder and is not presented as a portrait; replace it with the original newspaper-style character artwork when ready.

Before launch:
- Verify current academic year / semester and CGPA if you want to publish them.
- Verify credential names, issue dates and certificate URLs.
- Add the exact LinkedIn profile URL and a public contact email.
- Confirm the current BUSHO and Varsity project status and live links.
- Replace the reserved hero illustration with the approved custom character.

## Deployment

Vercel defaults:
- Build command: `npm run build`
- Output directory: `dist`

The portfolio takes broad inspiration from experimental editorial web design, but its copy, layout, illustrations and styling are implemented as an original identity.
