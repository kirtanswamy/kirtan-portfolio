# Editorial Motion & Visual Refinement — Design

**Date:** 2026-11-24  
**Branch:** `feature/editorial-world-rebuild`

## Intent
Elevate the existing Maker's Notebook portfolio from a solid editorial concept into a more art-directed, modern, high-craft web experience. Preserve the existing identity, content, project stories, newspaper opening, torn-paper INDEX, five-book shelf, section architecture and working interactions. This is a refinement of visual execution and motion quality, not a replacement or a new template.

## Goals
- Improve visual hierarchy, composition, spacing, typography, depth and material detail without flattening the editorial identity.
- Make transitions and micro-interactions feel responsive, intentional and physically coherent.
- Give project books and major sections more visual distinction while maintaining one design system.
- Improve responsive motion and ensure mobile is deliberately art-directed.
- Respect reduced motion, keyboard access, touch, loading and performance.

## Non-goals
- No generic SaaS/AI-template redesign, random gradients, gratuitous floating objects or motion for motion's sake.
- No content rewrites, invented metrics/credentials, project status changes, or unrelated functionality.
- No production deployment, production-domain changes, merge to the production branch, or changes to Vercel production settings.
- No new animation dependency unless a concrete gap cannot be solved well with the existing GSAP 3.15.1 + Lenis stack.

## Approved direction
**The Living Newspaper, refined with selective cinematic motion.** Keep the existing paper/ink/book metaphor and use art-directed typography, deliberate whitespace, tactile material, confident composition, purposeful depth and clear interaction feedback. Treat MotionSites.ai examples, Awwwards work and Godly's curated galleries as inspiration, not templates.

## Research and implementation calls
- MotionSites Studio exposes portfolio directions such as Portfolio Shelf Hero, Portfolio Bookshop and 3D Jack Portfolio. These are useful interaction/composition references; do not copy their branding or layout mechanically: https://studio.motionsites.ai/
- Awwwards' editorial reference is Niccolò Miranda's Paper Portfolio. Its newspaper metaphor, global components and ripped-paper transitions are useful precedents; translate the underlying craft into an original Maker's Notebook: https://www.niccolomiranda.com/ and https://www.commarts.com/webpicks/niccolo-miranda-1
- Godly is a curated website and section gallery; use it to inspect current hierarchy, transitions and section craft: https://godly.design/ and https://godly.design/sections/
- GSAP remains the primary choreography and scroll-sequencing tool: https://github.com/greensock/GSAP
- Lenis remains the existing smooth-scroll layer; preserve native scroll semantics, nested-scroll behavior and reduced-motion handling: https://github.com/darkroomengineering/lenis
- Motion for React is a credible alternative for component-level gestures/layout transitions, but do not add it alongside GSAP without a specific need: https://github.com/motiondivision/motion
- React Three Fiber + Drei are available for React-managed 3D scenes, but only introduce them if the existing CSS/WebGL paper shader cannot deliver a verified, worthwhile result within the performance budget: https://github.com/pmndrs/react-three-fiber and https://github.com/pmndrs/drei

## Scope and implementation approach
1. Inspect the current rendering and motion lifecycle; identify the highest-impact visual opportunities and regressions.
2. Add a small, isolated visual refinement layer rather than appending another large collection of conflicting overrides to the existing stylesheet.
3. Refine the existing hero, project bookshelf/cards, chapter navigation and key editorial section transitions first; preserve all content and semantics.
4. Use the existing GSAP/ScrollTrigger/Lenis stack and CSS transforms/opacity where possible. Avoid continuous high-cost shader work and scroll hijacking.
5. Add focused automated checks for key visual behavior hooks, reduced-motion fallbacks and interactive navigation where the existing test harness supports them.
6. Run the production build and existing E2E suite, then deploy a Vercel Preview from this feature branch.
7. Visually compare preview and production at desktop and mobile sizes, inspect console/network behavior, and report all gaps. Do not promote or merge.

## Constraints and acceptance
- Existing project facts, links, status labels and content remain unchanged.
- No new dependency by default.
- Existing opening, INDEX, shelf, dialogs, section navigation and project filters continue to work.
- Reduced-motion users can complete all tasks without motion-dependent information.
- No horizontal overflow, clipped content, competing scroll containers, or obstructive overlays at 360px, 390px, 768px, 1024px, 1280px and 1440px.
- Preview must be a non-production deployment tied to the feature branch and exact commit.
- Production stays untouched until the user separately authorizes a release after visual verification.
