# Editorial Motion & Visual Refinement Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Refine the existing Maker's Notebook portfolio into a more modern, art-directed and fluid editorial experience without replacing its identity or content.

**Architecture:** Preserve the React/Vite application and its GSAP, ScrollTrigger, Lenis and custom paper shader architecture. Add a small, isolated motion/visual refinement layer with focused component hooks and responsive CSS rather than layering further conflicting global overrides. Keep every existing project and navigation flow intact.

**Tech Stack:** React 19, Vite 8, GSAP 3.15.1, Lenis 1.3.27, Lucide React, Playwright.

**Spec:** `docs/superpowers/specs/2026-11-24-editorial-motion-visual-refinement-design.md`

## Global Constraints

- Preserve the newspaper opening, torn-paper INDEX, bookshelf, all existing project content and chapter architecture.
- Do not invent facts, outcomes, credentials, links or project statuses.
- Do not add Motion or React Three Fiber unless an implementation gap is demonstrated and the benefit is measured.
- Respect `prefers-reduced-motion`, touch, keyboard and semantic accessibility.
- No merge, production deployment, production domain change or production settings modification.
- Work only on `feature/editorial-world-rebuild`.

## Review Focus

- Opening transition and first-paint experience: no blank/blocked first viewport.
- Reduced-motion and touch: all navigation and content remain available without hover or animated states.
- Narrow layouts: 360px/390px no horizontal overflow, clipping or illegible labels.
- Nested scrolling and overlay states: INDEX and project dialogs remain operable with one clear scroll owner.
- WebGL failure and low-power devices: shader failure falls back cleanly and motion remains responsive.

---

### Task 1: Establish a visual/motion regression baseline

**Files:**
- Inspect: `src/App.jsx`, `src/styles.css`, `src/components/PaperShader.jsx`, `playwright.config.*`, existing tests.
- Create or modify: focused Playwright tests only where existing test conventions support them.

**Interfaces:**
- Preserve existing App component state and event handlers.
- Tests should target observable behavior, not private implementation details.

- [ ] Write/extend tests for opening skip/close, INDEX open/close, project dialog open/close and section navigation.
- [ ] Run the focused tests and confirm the expected baseline.
- [ ] Record existing test failures without silently changing unrelated behavior.

### Task 2: Refine visual system without replacing identity

**Files:**
- Create: `src/styles/editorial-refinement.css` (or follow the existing CSS import structure after inspection).
- Modify: `src/main.jsx` only if needed to import the isolated stylesheet.
- Test: responsive visual smoke coverage.

**Interfaces:**
- CSS layer consumes existing classes and design tokens; no React API changes.
- Keep existing CSS as the source of current layout behavior; new layer should be narrow and documented.

- [ ] Add a failing visual smoke assertion for the targeted hero/project elements where supported.
- [ ] Implement refined typography rhythm, responsive whitespace, fine borders, surface depth and consistent focus/hover/pressed feedback.
- [ ] Refine the hero and bookshelf without changing copy, project data or information hierarchy.
- [ ] Add mobile-specific overrides at 600px and 950px breakpoints.
- [ ] Verify no horizontal overflow at 360, 390, 768, 1024, 1280 and 1440px.

### Task 3: Improve motion choreography

**Files:**
- Modify: `src/App.jsx` only at the existing GSAP lifecycle and interaction points.
- Modify: `src/styles/editorial-refinement.css` for transform/opacity-only transitions and reduced-motion behavior.
- Test: Playwright interaction and reduced-motion cases.

**Interfaces:**
- Continue using existing GSAP/ScrollTrigger/Lenis imports.
- No new animation package.
- Avoid multiple concurrent loops and avoid animating layout properties.

- [ ] Add tests for reduced-motion completion of opening, navigation and project dialogs.
- [ ] Verify tests fail for the missing/incorrect behavior before changing code.
- [ ] Refine animation durations/easing/stagger for clear causality and interruptibility.
- [ ] Ensure hover tilt is disabled on touch and reduced-motion devices.
- [ ] Ensure Lenis and ScrollTrigger cleanup remains correct on unmount and overlay states.
- [ ] Run all existing tests and inspect browser console output.

### Task 4: Preview deployment and visual verification

**Files:**
- No production configuration changes.
- Update: `ROADMAP.md` with the actual preview URL, commit and QA findings after verification.

- [ ] Run `npm run build`.
- [ ] Run the full `npm run test:e2e` suite.
- [ ] Deploy a Preview for the feature branch only.
- [ ] Confirm Vercel deployment metadata references the feature branch and exact commit.
- [ ] Visually inspect preview at desktop and mobile viewports; compare with production.
- [ ] Inspect console/network failures, layout shifts, overflow, motion smoothness and reduced-motion mode.
- [ ] Record verified findings and unresolved gaps in the roadmap.
- [ ] Keep production untouched; do not merge or promote.
