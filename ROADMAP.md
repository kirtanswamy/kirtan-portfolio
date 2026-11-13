# Portfolio Build Roadmap — The Maker's Notebook

This is the implementation plan and quality bar for the portfolio. The target is an original, character-led editorial experience informed by the interaction principles of Niccolò Miranda's live portfolio—not a copy of its artwork, exact layout, assets, or identity.

## North star

The site should feel like opening a beautifully art-directed, interactive maker's journal. The user should understand who Kirtan is, what he makes, why the work matters, and how to start a conversation within the first few scrolls.

**Design pillars**
1. Editorial composition: strong typographic scale, intentional asymmetry, columns, issue markers, captions, footnotes and paper-like surfaces.
2. Narrative navigation: the sections should read like chapters, not a stack of generic portfolio cards.
3. Interaction with purpose: motion reveals hierarchy, responds to input, and gives feedback. No animation exists only to decorate.
4. Original identity: bespoke graphic language and character art, never borrowed character designs or exact reference assets.
5. Performance and accessibility: responsive, keyboard-operable, reduced-motion aware, readable and fast.

## Reference-site design audit translated into original principles

| Reference mechanic / principle | Our original interpretation | Planned implementation |
|---|---|---|
| Newspaper / editorial world | The Maker's Notebook visual identity | Paper palette, masthead, issue labels, editorial grid, serif + grotesk + mono type |
| Illustrated designer identity | A future original Kirtan character | Character artwork system with multiple poses and section-specific cameos |
| Persistent side navigation | Chapter index / section progress | Sticky desktop chapter rail or compact progress marker; mobile drawer |
| Torn-paper navigation transition | Paper-fold / cutout chapter transition | CSS/SVG mask first; WebGL only if it materially improves the result |
| Rotated bookshelf and book-pull interaction | Project archive as a tactile filing cabinet / work shelf | GSAP draggable or scroll-driven project sequence; project detail transitions |
| Horizontal project exploration | Sideways project index with clear scroll affordance | Desktop horizontal gallery; touch-native swipe on mobile |
| Spiral / looping motion | Original orbit / ink-stamp motifs | SVG/CSS/GSAP; restrained, non-blocking, pause/reduced-motion support |
| Layered scroll choreography | Editorial reveal and scene changes | GSAP ScrollTrigger with pinned moments used sparingly |
| Strong soundless visual storytelling | Illustrated project covers and field notes | Custom vector/canvas visuals, real project screenshots when available |

The reference site has been reviewed at the level of its visual concept, content architecture and designer-described mechanics. Exact timing, easing curves and every live interaction have not been measured frame-by-frame. We will use the principles above as design input and test our own implementation rather than claim a pixel-perfect recreation.

## Build phases

### Phase 0 — Foundation and truth audit
- Keep the rebuild isolated on `feature/editorial-world-rebuild` until checks pass.
- Confirm project status, public links, role and contribution for each project.
- Confirm academic year/semester and latest CGPA before publishing numbers.
- Verify course names, dates, credential URLs and whether each item is a course, simulation, certificate or application.
- Add real contact email and LinkedIn only when supplied/verified.

**Exit gate:** no invented claims, dead links or placeholder copy presented as fact.

### Phase 1 — Editorial art direction and responsive system
- Lock colour tokens, typography scale, grid, spacing, border, paper grain and illustration style.
- Define desktop, tablet and mobile layouts independently; don't merely shrink desktop.
- Create reusable editorial primitives: masthead, eyebrow, folio, section index, chapter marker, project cover, pull quote, timeline row, field note.
- Establish hover, focus, pressed, loading and active states.

**Exit gate:** a consistent visual system across every section and all key viewport sizes.

### Phase 2 — Story and information architecture
1. Hero / opening cover: identity, value proposition, location and clear next action.
2. Manifesto: what motivates the work.
3. Selected work: strongest projects first, each with problem, role, process, outcome and links.
4. Viksit Bharat feature: selection, representation, theme and JanSeva One.
5. About: human story, working style, interests and perspective.
6. Journey: education, leadership, community, research and milestones.
7. Learning archive: verified courses, simulations and credentials.
8. Toolkit: skills grouped by how they are used, not a keyword dump.
9. Contact: direct and frictionless.

**Exit gate:** each section answers a distinct question; no repetitive filler.

### Phase 3 — Motion and interaction system
- Intro: editorial title reveal with clipped masks and staggered lines.
- Scroll: subtle section entrances, image/cover parallax and chapter progress.
- Work: project shelf / horizontal browse with drag and touch affordances.
- Project detail: transition from cover to case study with clear back navigation.
- Navigation: mobile paper-panel transition with a torn-edge finish; persistent desktop chapter rail with active section tracking and hover labels.
- Micro-interactions: cursor feedback on desktop, link arrows, filter transitions, stamps, hover depth and tactile chapter controls.
- Character later: scroll-aware poses, contextual cameos and small reactions; no constant distracting movement.

**Motion tokens**
- Micro feedback: 140–220 ms.
- Standard interface transitions: 260–420 ms.
- Editorial entrances: 650–1000 ms, staggered.
- Large scene transitions: 800–1200 ms only when they have a narrative reason.
- Prefer power2/power3 easing for UI and power4 for expressive title entrances.
- Avoid animating layout-heavy properties; use transform and opacity.
- Never hijack normal scrolling or trap keyboard/touch users.
- Respect `prefers-reduced-motion`; provide static equivalents.

**Exit gate:** motion feels coherent, intentional, responsive and never blocks reading or navigation.

### Phase 4 — Project case studies and original visuals
- BUSHO: problem context, health-worker-to-supervisor workflow, architecture and honest prototype status.
- Varsity: student problem, feature set, contribution and screenshots from actual build.
- ElectroLab: diode model, solver, sweep visualisation and technical details.
- JanSeva One: civic problem, concept, presentation context and proposed pilot.
- Build custom visual covers from actual product screens, diagrams and photos—not generic stock graphics. First pass now includes original conceptual workflow / interface / circuit / civic diagrams; replace these with real product evidence when available.

**Exit gate:** every featured project has evidence, a clear role statement and working links.

### Phase 5 — Character design and integration
- Collect a clear reference portrait and choose a visual direction.
- Design a recognisable but stylised original character with a coherent silhouette, palette and expressions.
- Produce hero, neutral, thinking, building, presenting and waving poses.
- Integrate character as a storytelling device: opening cover, work shelf, field note, about and contact.
- Optimise assets (SVG/WebP/GLB as appropriate); lazy-load secondary scenes.
- Keep character optional on reduced-motion and low-power devices.

**Exit gate:** the character supports the narrative and does not compromise load time or legibility.

### Phase 6 — QA, accessibility and performance
- Test 1440px desktop, 1280px laptop, 1024px tablet, 768px tablet portrait, 390px and 360px mobile.
- Test Chrome, Firefox, Safari and mobile touch.
- Verify all navigation, project filters, external links, focus order, keyboard access and menu close behaviour.
- Check contrast, heading hierarchy, alt text, tap target size, skip navigation, keyboard dialog focus, mobile navigation completeness and reduced motion.
- Check no horizontal overflow, layout shifts, console errors or broken images.
- Run production build, Lighthouse / PageSpeed and Core Web Vitals review.
- Optimise fonts, images, code splitting and animation workload.

**Exit gate:** production build passes and visual QA is signed off across viewports.

### Phase 7 — Release
- Merge only after QA and CI pass.
- Connect / verify Vercel deployment and domain.
- Verify metadata, social preview, favicon and analytics/privacy choice.
- Test production URL and all outgoing links.
- Keep a post-launch backlog for content updates and new projects.


### Latest iteration — hero, character placeholder and story polish

- The original abstract newspaper-style maker character illustration is restored in the hero, matching the direction the user wants to retain for now.
- The placeholder is explicitly described as temporary; the personal likeness version will be created later from a portrait reference.
- The previous workbench experiment is no longer used in the hero.
- The About narrative includes collaboration, community spaces and learning through experimentation.
- Project-file metadata shows each project's contribution, stage, focus areas, year and category.

### Latest iteration — About chapter direction

- Added an original four-part intersection map connecting engineering, product thinking, visual design and public impact.
- The map places the common thread—curious builder—at the centre, with four surrounding editorial cards and connective lines.
- Reworked the About lede to describe cross-disciplinary curiosity without presenting every interest as a separate identity.
- Preserved the current newspaper-style character illustration as the hero placeholder.
- Responsive layout and reduced-motion fallback included; still requires live browser and device QA.

### Latest iteration — About narrative, turning point and builder evolution

- Rewrote the About narrative around the user's own arc: JEE setback, reset at SRM, Viksit Bharat representation, SQAC App Development leadership and BUSHO.
- Kept the language grounded: the JEE phase is framed as a difficult chapter and reset, not a simplistic triumph claim.
- Added an editorial turning-point block and a four-stage visual evolution from basic HTML pages to interfaces, API/backend integration and real-data workflows.
- Retained the four-part intersection map and the current newspaper-style character placeholder.
- All biographical copy is based on the user's account; role names and event details should receive a final factual review before release.
- Responsive layout and reduced-motion fallback included; live browser/device QA remains outstanding.

### Latest iteration — Impact archive

- Expanded the journey timeline with dedicated BUSHO and Varsity milestones.
- Added a three-part impact ledger to the Viksit Bharat feature: national dialogue, SQAC team leadership and independent product building.
- The ledger uses restrained editorial cards and responsive layouts; all claims stay within the user's supplied context.
- Kept the existing newspaper-style character illustration unchanged.
- Certification titles, academic figures, project outcome metrics and external evidence remain subject to verification.
- CI and live visual QA are release gates; no deployment has been made.

### Latest iteration — Learning and skills archive refinement

- Refined the skills taxonomy into frontend/apps, programming, and product/systems, reflecting the user's supplied toolset.
- Added a verification-first editorial note to the learning archive; credential status remains clearly distinguished from course and simulation completion.
- Refined the responsive learning archive and skills index presentation.
- No additional certificates or skill proficiency claims were invented.
- Actual credential titles, issue dates, public verification links and current proficiency remain to be confirmed.
- The current newspaper-style character placeholder remains unchanged.

### Latest iteration — Contact chapter and motion refinement

- Reworked the contact action into a clearer invitation for thoughtful collaborations, useful problems and product conversations.
- Added an editorial orbit stamp with a reduced-motion fallback, responsive contact composition and visible keyboard focus treatment.
- Refined the footer layout for smaller screens.
- The original newspaper-style character remains unchanged.
- The website remains a draft implementation; browser QA, accessibility checks and deployment are still release gates.

### Latest iteration — release metadata and contact polish

- Added author, application, Open Graph and Twitter summary metadata for clearer link previews when the portfolio is shared.
- Tightened the page description to reflect engineering, software, product design and public-impact interests.
- Contact chapter now has a direct invitation, orbit stamp, responsive layout, keyboard focus styling and reduced-motion fallback.
- Latest CI is queued; previous contact and motion implementation builds passed.
- Full browser/device visual QA and verification of live project, certificate, academic and contact evidence remain before release.

### Latest iteration — release audit and link integrity

- Scoped the GSAP animation lifecycle with `gsap.context()`; teardown now reverts portfolio-owned animations instead of globally killing all page tweens and ScrollTriggers.
- Audited project repository actions and corrected the JanSeva One card: with no verified repository URL, it now shows a non-interactive “link pending” label rather than a dead clickable link.
- Verified the production build for the GSAP lifecycle fix passed.
- Latest project-link integrity change is committed; its CI run is pending.
- Browser/device QA, final copy verification, credentials and contact details still require review before release.

### Latest iteration — reference architecture alignment

- Added a dedicated **Think / Create / Deliver** chapter, inspired by the reference site's process-storytelling structure but written around Kirtan's own approach to problem framing, product design, engineering and iteration.
- Added a three-column editorial process spread with responsive mobile stacking and reduced-motion-safe presentation.
- Added the new chapter to the persistent desktop rail and mobile navigation; chapter numbering now runs 01–09.
- Preserved the current newspaper-style character and the existing featured-work shelf.
- Still to build: an upcoming-work feature, richer full-width project storytelling, and genuine proof/recognition material where supplied.
- This is a structural and visual iteration, not a pixel-perfect copy of proprietary reference assets or animations.

### Latest iteration — upcoming work / open notebook

- Added a dedicated **Up Next** chapter with BUSHO as the lead feature and follow-on work directions for ElectroLab and Varsity.
- The section is explicitly labelled as work in progress; it does not imply unfinished features are shipped or that future plans are completed achievements.
- Added an original dark editorial feature spread, project status language and responsive stacked layout.
- Added the new chapter to persistent navigation and updated the chapter count to ten.
- Preserved the current illustrated newspaper character.
- Remaining: a richer full project detail experience, proof/recognition archive, real project imagery, browser QA and release checks.

### Latest iteration — recognition and impact archive

- Added a dedicated recognition chapter for Viksit Bharat Young Leaders Dialogue 2026, SQAC App Development leadership and Mineverse event leadership.
- Framed these as selected experiences and responsibilities, not fabricated awards or trophy counts.
- Added editorial feature/card layouts, responsive breakpoints and an eleven-chapter navigation update.
- The existing newspaper character remains unchanged.
- Still required: documentary evidence/photos where the user wants them shown, a deeper full-page project detail experience, final factual verification, browser QA and release readiness.

### Latest iteration — immersive project file detail

- Deepened the project dialog with an editorial thesis statement, clearer project-stage metadata, four-part case-study structure and a Question → Design → Build → Learn sequence.
- Styled the detail view as a scrollable project feature with responsive case-study layout and clearer external action links.
- Added mobile-specific dialog sizing and stacked content/actions.
- Existing project facts and stages remain as previously supplied; no fabricated metrics, user counts or launch claims added.
- Browser-level interaction testing and real project screenshots remain required before release.

### Latest iteration — About chapter art direction

- Added a distinctive cobalt-blue “north star” pull quote to give the personal story an emotional centre: the joy of turning difficult problems into something useful.
- Kept the longer JEE → SRM → Viksit Bharat → SQAC → BUSHO story and the build-evolution timeline intact.
- Styled the statement as a responsive editorial feature with decorative orbit detail and no additional unsupported personal claims.
- The immersive project-file detail and recognition chapters remain in place.
- Browser QA, real project imagery, credential evidence and final factual review remain release gates.

### Latest iteration — featured work interaction and accessibility

- Added keyboard support to the horizontal project shelf: Left/Right to move between project cards, Home to return to the first and End to reach the last.
- Added a labelled, focusable region so the horizontal archive can be discovered and operated without a pointer.
- Refined drag cursor, scroll snapping, scrollbar treatment and visible keyboard focus.
- Preserved touch scrolling and the existing previous/next shelf controls.
- Latest changes are committed; CI and browser/device interaction QA remain required.

## Current implementation status

| Area | Status | Notes |
|---|---|---|
| React/Vite foundation | In place | Existing stack retained |
| Editorial visual direction | First pass implemented | Paper, ink, cobalt, vermilion, typography |
| Main content sections | Enhanced first pass | Hero, work, Viksit Bharat feature with JanSeva One civic journey concept map, About with working principles and a four-part intersection map, annotated journey timeline with BUSHO and Varsity milestones, filterable learning archive with verification-first credential note, skills, contact |
| Project filter | Implemented | Four project categories; filter transitions and shelf counter wired |
| GSAP / Lenis | First pass implemented | Intro, scroll reveals, orbit details, reading progress; needs motion QA |
| Responsive layouts | First pass implemented | Eight-item navigation, keyboard skip link and global reduced-motion fallback added; still needs real device/browser testing |
| Custom character | Intentionally deferred | Placeholder only; original artwork later |
| Project case studies | Structured first pass | Project dialogs explain problem, approach, honest current state and next iteration; original conceptual diagrams added; real screenshots, evidence and outcome metrics still needed |
| Desktop horizontal work shelf | First pass implemented | Horizontal snap shelf, touch scrolling, drag affordance, previous/next controls and position counter; needs browser QA |
| Chapter navigation | First pass implemented | Persistent desktop rail, active chapter tracking, hover labels; mobile torn-edge panel; WebGL intentionally not required |
| Project detail transitions | Enhanced first pass | Accessible project-file dialog with Escape, backdrop close, focus trap and focus return; book-opening transition, structured mini case studies and original conceptual diagrams |
| Content verification | Partially structured; source checks pending | Learning records now distinguish course, simulation and unverified entries; final titles, evidence, academic details, roles and contact links still require user confirmation |
| Browser visual QA | Pending | Code and CI checks only so far; visual QA across viewports remains a release gate |
| Production deploy | Not done | Do not treat draft branch as live site |

## Current branch and working agreement

- Branch: `feature/editorial-world-rebuild`
- Draft PR: #1
- Main branch remains untouched until build and QA gates pass.
- Keep the original site as a reference for design analysis, not as a source of copied assets or exact components.
