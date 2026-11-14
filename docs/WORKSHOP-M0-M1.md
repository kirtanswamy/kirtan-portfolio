# The Maker's Notebook — Workshop Foundation (M0)

Status: approved direction; implementation foundation  
Branch: `feature/editorial-world-rebuild`  
Scope: M0 visual foundation and M1 workshop prototype only  
Release policy: preview-only; no merge or production deployment without explicit approval.

## Creative direction

**The Maker's Workshop** is an immersive, tactile 3D workbench. The notebook is the central navigation object; project artifacts make the work discoverable. The environment creates curiosity, while semantic HTML carries the actual content and navigation.

Immersion is intentional, but the experience is not a game. No mandatory movement controls, no forced intro, no audio requirement, no scroll trap, and no essential hover-only interactions.

## Reference board

These references are used for principles, not copied assets or layouts:

- Bruno Simon — interaction clarity and discoverable 3D navigation: https://bruno-simon.com/
- Active Theory — visual craft, spatial storytelling and motion restraint: https://activetheory.net/
- Lusion — integrated 3D art direction and digital storytelling: https://lusion.co/

Original visual language: dark walnut, charcoal, warm paper, aged brass, glass, restrained electric-blue focus states, technical annotations and editorial typography.

## Visual tokens

| Token | Value / direction |
| --- | --- |
| Workshop background | `#171817` |
| Secondary surface | `#242522` |
| Paper | `#EDE6D8` |
| Ink | `#25251F` |
| Accent | `#557BFF` |
| Warm highlight | `#B99A66` |
| UI typography | Existing DM Sans / Space Grotesk pairing |
| Metadata typography | Existing DM Mono |
| Display typography | Existing Space Grotesk, with serif accents where appropriate |

The accent is reserved for active selection, focus, and a few navigation details. The workshop should not become a blue UI with decorative 3D objects.

## Scene composition

The initial workshop scene uses a three-quarter camera view over a dark workbench:

1. Open notebook at the visual centre — brand and index.
2. Five distinct project artifacts — the work archive.
3. Monitor / technical note area — current experiments and maker context.
4. Desk lamp and warm practical lighting — scene focus.
5. A few quiet personal artifacts — secondary details only.

M1 uses carefully composed procedural geometry and materials to prove the scene, camera, responsive composition and interaction. It does not attempt final photorealistic Blender assets or the five fully developed project dioramas; those belong to later project-archive work.

## Project artifact language

- BUSHO: field folder / report clipboard.
- VARSITY: campus planner / course notebook.
- ELECTROLAB: breadboard / diode / test instrument.
- JANSEVA ONE: civic blueprint / road map.
- CHHUTTI KE BAAD: CRT television / remote.

All status and project claims remain sourced from the existing project records in `src/App.jsx`. A concept render is never presented as evidence that a feature has been implemented.

## Interaction contract

- Pointer: subtle parallax with a strict motion cap.
- Hover / focus: object lift, material highlight and visible label.
- Click / tap: select object, move camera toward it, expose a concise HTML detail panel.
- Notebook: opens a real HTML chapter index.
- Keyboard: Tab / Shift+Tab, Enter / Space, Escape to dismiss; visible focus.
- Mobile: same object set and destinations, touch-friendly controls and a vertically composed camera. No hover dependency.
- Reduced motion: static camera, no ambient movement, immediate selection state.
- Fallback: semantic HTML workshop index and project buttons remain usable if WebGL is unavailable.

## Motion language

| Class | Target |
| --- | ---: |
| Micro feedback | 140–220 ms |
| UI panel | 260–420 ms |
| Editorial reveal | 650–1,000 ms |
| Camera focus | 800–1,200 ms |
| Chapter transition | 900–1,400 ms |

Motion uses eased transforms and opacity. The camera eases to selected objects; it does not orbit indefinitely or hijack page scroll.

## Technical architecture

- Keep the existing React 19 / Vite 8 application.
- Add stable React Three Fiber v9 (React 19 pairing) and Three.js.
- Keep the 3D scene in a lazily loaded component, separate from project content and page navigation.
- Keep project data in the existing React data model; the scene receives records and emits selected project IDs.
- Keep all headings, labels, links, panels and chapter navigation in semantic HTML.
- Use a device-aware pixel ratio and restrained lighting; avoid heavy post-processing in M1.
- Provide a 2D fallback and respect `prefers-reduced-motion`.
- Defer external GLB models and texture pipeline until the scene prototype is approved.

## M0 acceptance checklist

- [x] Creative direction and interaction principles recorded.
- [x] Visual tokens and material palette defined.
- [x] Scene composition and project artifact language defined.
- [x] Desktop/mobile interaction contract defined.
- [x] Motion, accessibility, fallback and performance constraints defined.
- [x] Existing React application and project content audited.
- [ ] M1 prototype visually and functionally verified.

## M1 acceptance checklist

- [ ] Workshop scene renders in supported desktop and mobile browsers.
- [ ] Notebook opens a real HTML chapter index.
- [ ] Five project artifacts are selectable with mouse, touch and keyboard.
- [ ] Selection moves the camera and opens an accessible HTML summary.
- [ ] Reduced-motion mode disables camera and ambient movement.
- [ ] WebGL fallback remains navigable.
- [ ] Production build succeeds and no console/runtime errors are observed in tested environments.
- [ ] Preview is shared for user review; no merge or production deployment.
