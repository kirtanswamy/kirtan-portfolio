# The Maker's Notebook — Implementation Roadmap

**Status:** Approved design specification; implementation proceeds one milestone at a time.
**Branch:** `feature/editorial-world-rebuild`
**Working rule:** Do not merge to the production branch or deploy a release until the user reviews the milestone previews and final QA passes.

## North star

An interactive, cinematic newspaper documenting the evolution of a builder. The experience combines editorial paper design, tactile book navigation, deliberate 3D scenes and concise personal storytelling. It is inspired by the interaction principles of Niccolò Miranda's live portfolio, but must use an original identity, artwork, content and implementation.

## Approved creative direction

- **Opening:** a cinematic 3D newspaper forms, unfolds and reveals the masthead, Kirtan's name, short introduction and the existing newspaper-style character placeholder. A personal likeness character is deferred until a portrait is supplied.
- **Global navigation:** full-screen INDEX overlay revealed with a torn-paper transition.
- **Project navigation:** horizontal, tactile bookshelf; five distinct books; a selected book pulls forward and opens into its own case study.
- **Visual identity:** retain warm paper and editorial typography; add controlled visual variety with ink, cobalt, vermilion, lime and dark scenes.
- **Motion:** rich and deliberate. Paper opening, torn masks, book pull/open, chapter transitions, cinematic autobiography and meaningful micro-interactions. No unnecessary movement or scroll hijacking.
- **About:** concise cinematic autobiography and visual timeline: JEE setback, reset at SRM, early HTML projects, technical growth into apps/APIs/backend/real-data workflows, Viksit Bharat, SQAC and BUSHO.
- **Location:** Hyderabad, India.
- **Projects:** BUSHO, VARSITY, ELECTROLAB, JANSEVA ONE and CHHUTTI KE BAAD.
- **Content discipline:** no invented metrics, awards, testimonials, production status, credentials or impact claims. Do not use the Viksit Bharat presentation topic as a headline/story. JanSeva One remains a separate civic-tech project.
- **Responsive experience:** desktop, tablet and mobile are designed deliberately; mobile is not a scaled desktop.
- **Character:** retain the current newspaper character as a temporary placeholder; create the user's likeness later from a supplied portrait.

## Experience architecture

1. **Front Page** — newspaper opening, identity, short positioning and featured-work invitation.
2. **Bookshelf** — five project books and individual case studies.
3. **Milestones** — Viksit Bharat, SQAC and Mineverse, supported by real evidence.
4. **Autobiography** — concise visual story and cinematic timeline.
5. **Journey** — education, leadership and selected milestones.
6. **Archive** — verified certificates, completed courses, simulations and ongoing applications, clearly distinguished.
7. **Workshop** — skills connected to actual projects and work.
8. **Final Page** — character-led closing and verified contact links.

## Motion and interaction requirements

| Interaction | Intended behaviour |
|---|---|
| Newspaper opening | Layered 3D paper unfold and perspective settle |
| Global INDEX | Full-screen dark overlay with irregular torn-paper reveal |
| Project bookshelf | Horizontal browse, touch swipe, keyboard support, clear affordance |
| Book selection | Pull forward, then open into a project-specific experience |
| Project exit | Reverse transition and restore the same shelf position |
| Chapter transitions | Contextual paper masks/folds; not every transition uses tearing |
| Autobiography | Scroll-linked scenes and timeline reveals |
| Character | Contextual, restrained reactions; no distracting perpetual animation |
| Micro-interactions | Tactile focus, hover, active, pressed and loading feedback |

### Motion timing guidance

- Micro feedback: 140–220 ms.
- Standard UI transitions: 260–420 ms.
- Editorial entrances: 650–1000 ms, staggered.
- Major scene transitions: 800–1200 ms only when narratively justified.
- Prefer transform and opacity over layout-triggering animation.
- Never hijack normal scrolling or trap keyboard/touch users.
- Respect `prefers-reduced-motion`; provide complete static alternatives.

## Technical direction

- React + Vite application foundation.
- Three.js / React Three Fiber for selected 3D scenes, not every section.
- GSAP + ScrollTrigger for sequenced motion.
- WebGL shaders, displacement maps and SVG masks for paper effects.
- Lenis only where it improves the experience and never at the expense of native accessibility.
- SVG/CSS/procedural artwork for lightweight editorial graphics.
- Structured project content; lazy-loaded media and 3D assets.
- Vercel preview deployments for milestone review; production release only after approval.

## Milestones and exit gates

### User direction update — mock visuals and JanSeva accuracy (13 November 2026)

- Keep all project visuals as mockups / illustrative placeholders for this phase. Real project screenshot collection and the broader portfolio asset database will be a later content pass.
- A BUSHO visual asset was recovered from the prior BUSHO material in the user's Library: the cinematic “From Field Reports to Actionable Health Insights” banner showing a frontline worker and workflow overlays. The BUSHO repository README also references `assets/busho-github-banner.jpg`; the portfolio now uses that existing repository-hosted banner as the BUSHO card visual. It is a concept/mock visual, not evidence of a live deployed workflow.
- The BUSHO live URL is `https://busho.de5.net/`.
- JanSeva One is **ideation only and was never implemented**. It must not be described as a built prototype or a working project. The concept was JanSeva One / UCAP: citizen-first civic transparency and action; a proposed geo-tagged road / PMGSY issue-reporting pilot; issue categories such as potholes, flooding and surface damage; routing to the responsible jurisdiction; public-works context (department, contractor, timelines and milestones); status and repair evidence; repair-history trail; assisted reporting through CSCs, Panchayat offices and youth volunteers. Later concept extensions included drainage, sanitation, PHCs, schools and wider village infrastructure. The suggested MVP was one Gram Panchayat in Chhattisgarh with simulated data only. No app, backend, deployed prototype, pilot or government integration exists.
- Keep mock visuals for Varsity and other projects until the user supplies or approves updated source material. Ask for Varsity's public website URL and repository URL before writing a more detailed case study; the current project description is provisional.

### M0 — Foundation and truth audit
- Review the existing portfolio code and current project data.
- Inspect project repositories and authoritative READMEs where accessible.
- Create a content registry separating verified facts, user-supplied claims and items needing confirmation.
- Add CHHUTTI KE BAAD to the project inventory using its actual repository documentation.
- Reconcile outdated project descriptions, location labels and the old section architecture in documentation.
- Identify missing screenshots, photos, certificate evidence and contact details.
- Do not redesign or modify application UI during M0.

**Exit gate:** approved project inventory and content/evidence checklist; no unsupported claims silently promoted to fact.

### M1 — Editorial system and responsive shell
- Define colour, typography, grid, spacing, paper texture, borders and material tokens.
- Build masthead, front-page layout, reusable editorial primitives and responsive foundations.
- Replace the conventional nav with the INDEX entry point and full-screen overlay shell.
- Keep the existing character placeholder.
- Establish accessible focus, keyboard, loading, active and reduced-motion states.

**Exit gate:** complete responsive shell and navigation structure, without the full 3D opening yet.

### M2 — Newspaper opening and paper-motion engine
- Build the 3D cover/opening sequence.
- Implement torn-paper INDEX reveal and close.
- Prototype paper displacement, grain, fold and optional charred/burning edge as a rare effect.
- Tune timing, easing, material response and fallback behaviour.

**Exit gate:** polished opening and navigation transitions, smooth on target devices and usable without WebGL.

### M3 — Bookshelf and five project worlds
- Build five individual book covers and tactile horizontal bookshelf.
- Implement pointer, touch and keyboard browsing.
- Implement pull-forward, book-open and return-to-shelf transitions.
- Build individual case studies for BUSHO, VARSITY, ELECTROLAB, JANSEVA ONE and CHHUTTI KE BAAD.
- Use real product evidence where available; label conceptual artwork honestly.

**Exit gate:** all five projects are navigable, factually accurate and have working, verified links or clear link-pending states.

### M4 — Milestones and cinematic autobiography
- Build Viksit Bharat, SQAC and Mineverse recognition modules.
- Build concise visual autobiography and timeline.
- Integrate supplied photos and artefacts where available.
- Remove the old long, repetitive About essay.

**Exit gate:** coherent, concise story with fact-checked milestones and no invented claims.

### M5 — Journey, learning archive, workshop and contact
- Verify education and academic figures.
- Distinguish earned certificates, completed courses, simulations and applications.
- Connect skills to project evidence.
- Add verified contact and social links.
- Build the final-page closing scene.

**Exit gate:** complete content, no placeholder contact details or unverified credentials presented as earned.

### M6 — Quality assurance and release candidate
- Test 1440px, 1280px, 1024px, 768px, 390px and 360px widths.
- Test Chrome, Firefox, Safari and touch interaction where available.
- Verify navigation, bookshelf, book transitions, dialogs, focus, external links and browser console.
- Check reduced motion, contrast, headings, alt text, keyboard operation and tap targets.
- Check overflow, layout shifts, image loading, GPU load and performance.
- Run production build and performance audits.

**Exit gate:** user-approved preview, successful CI, no blocking accessibility or responsive defects.

### M7 — Release
- Merge only after user sign-off and all QA gates pass.
- Verify production deployment, metadata, social previews and all external links.
- Keep a post-launch improvement backlog.

**Exit gate:** production site verified end-to-end.

## M0 content truth register

See [CONTENT_REGISTRY.md](./CONTENT_REGISTRY.md). That file is the source of truth for project facts, current evidence and outstanding confirmations. Where repository access is unavailable or details are not documented, the website must not invent them.

## Current status

| Milestone | Status |
|---|---|
| Specification and direction | Approved |
| M0 — Foundation and truth audit | In progress |
| M1–M7 | Not started |

## Repository working agreement

- Keep changes isolated on `feature/editorial-world-rebuild`.
- Work in small, reviewable commits.
- Run CI after each meaningful change.
- Preserve a preview link for milestone review when available.
- Do not merge or publish a production release without the user's explicit approval.
