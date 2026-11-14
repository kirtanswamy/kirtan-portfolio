# The Maker's Notebook — Workshop Foundation (M0)

Status: approved direction; M0 complete; M1 correction pass in progress  
Branch: `feature/editorial-world-rebuild`  
Scope: M0 visual foundation and M1 workshop prototype only  
Release policy: preview-only; no merge or production deployment without explicit approval.

## Creative direction

**The Maker's Workshop** is an immersive, tactile 3D workbench. The notebook is the central navigation object; project artifacts make the work discoverable. The environment creates curiosity, while semantic HTML carries the actual content and navigation.

Immersion is intentional, but the experience is not a game. No mandatory movement controls, no forced intro, no audio requirement, no scroll trap, and no essential hover-only interactions.

## M1 correction pass

The first desktop recording established that the scene and interactions render, but the scene lacked the visual weight and object specificity promised by the approved direction. The correction pass therefore:
- Enlarges the workbench and increases visible material depth, desk edging and supporting structure.
- Rebuilds the notebook as an open two-page object with a visible spine, cover thickness, page layers and restrained annotations.
- Gives the five artifacts distinct silhouettes: healthcare report folder, campus planner, electronics breadboard, civic map and CRT television with remote.
- Adds a practical desk lamp and a more legible monitor, with warmer key lighting and restrained cool fill.
- Improves overview framing and selection focus, keeps HTML project shortcuts as the keyboard/touch equivalent, and supports Escape to dismiss the notebook index.

These are procedural scene assets for the M1 prototype, not claims that the underlying project concepts are implemented.

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

## Interaction and accessibility

- Pointer: subtle parallax with a strict motion cap.
- Hover / focus: object lift and material highlight; labels remain visible.
- Click / tap: select an object, ease the camera toward it and expose an HTML detail panel.
- Notebook index: semantic HTML dialog; Escape and close button dismiss it.
- Keyboard and touch: native project shortcut buttons provide equivalent selection and opening.
- Reduced motion: static camera and no pointer parallax.
- Fallback: semantic HTML project list remains navigable if WebGL is unavailable.
- Focus-visible outlines are provided for interactive controls.

## Performance architecture

- React Three Fiber v9 / Three.js remain isolated in a lazy-loaded workshop component.
- Vite manual chunks separate Three.js core and React Three Fiber from the workshop application code; validate actual output sizes in the next preview build.
- Device pixel ratio is capped at 1.25.
- No external GLB models, large textures or post-processing in M1.
- The scene uses procedural geometry and a limited number of lights.

## M1 acceptance checklist

- [ ] Workshop scene renders in supported desktop and mobile browsers.
- [ ] Notebook opens a real HTML chapter index.
- [ ] Five project artifacts are selectable with mouse, touch and keyboard-equivalent controls.
- [ ] Selection moves the camera and opens an accessible HTML summary.
- [ ] Reduced-motion mode disables camera and pointer movement.
- [ ] WebGL fallback remains navigable.
- [x] Vercel Preview build succeeds for the previous prototype.
- [ ] New preview build succeeds with chunk sizes reviewed.
- [ ] No console/runtime errors are observed in tested browsers (interactive browser QA still pending).
- [ ] Mobile visual QA completed (not yet evidenced by the supplied desktop-only recording).
- [ ] Preview is shared for user review; no merge or production deployment.

## Verification record

The supplied 37-second desktop recording demonstrated the previous prototype's render, notebook-index opening, artifact selection/camera movement, selected-project panel and page scrolling. It did not establish mobile behavior, console cleanliness or the visual quality of this correction pass.

The previous preview build succeeded but emitted a 929.26 kB minified workshop chunk (245.63 kB gzip). The correction pass adds explicit vendor chunking; the new build output must be inspected rather than assuming the warning is resolved.
