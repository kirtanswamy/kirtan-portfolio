# Quality Gates — THE MAKER'S NOTEBOOK

Use these checks before declaring a design or implementation task complete. Report any item not tested.

## Visual quality
- [ ] The result supports the cinematic newspaper, torn-paper INDEX and project-bookshelf creative premise.
- [ ] Hierarchy, spacing, typography, and alignment are consistent.
- [ ] No accidental clipping, overlap, awkward wrapping, or layout shift.
- [ ] Surfaces, shadows, textures, and accents are restrained and coherent.
- [ ] Real content and assets are used where available; placeholders are identified.

## Interaction and motion
- [ ] All interactive elements have clear affordances and states.
- [ ] Navigation works with pointer, touch, and keyboard.
- [ ] Motion communicates state and does not block task completion.
- [ ] Reduced-motion behavior is supported.
- [ ] Fast repeated input and interrupted transitions behave safely.

## Responsive behavior
- [ ] Narrow mobile width tested.
- [ ] Typical mobile width tested.
- [ ] Tablet width tested.
- [ ] Desktop width tested.
- [ ] Landscape orientation considered.
- [ ] Mobile interaction is intentionally designed, not merely scaled down.

## Accessibility
- [ ] Semantic structure and headings are meaningful.
- [ ] Keyboard focus is visible and logical.
- [ ] Controls have accessible names.
- [ ] Text and important UI meet contrast expectations.
- [ ] Essential content is not available only through hover or animation.

## 3D and performance
- [ ] Loading, failure, and fallback states exist.
- [ ] 3D scene complexity is appropriate for target devices.
- [ ] Assets are optimized and loaded intentionally.
- [ ] No obvious memory/resource leaks or unnecessary render loops.
- [ ] Representative mobile performance has been checked.

## Engineering and regression
- [ ] Existing architecture and conventions are respected.
- [ ] No unrelated files or functionality were changed.
- [ ] Relevant tests, lint, type checks, or build checks were run.
- [ ] Console/network errors were checked where practical.
- [ ] Known limitations and untested areas are explicitly reported.

## Completion report
Summarize: files changed, implementation decisions, checks performed and their results, known gaps, and whether any approval is still needed. Never claim a check passed unless it was actually run.
