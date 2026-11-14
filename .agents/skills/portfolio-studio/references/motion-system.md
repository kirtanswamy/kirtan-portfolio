# Motion System — THE MAKER'S NOTEBOOK

## Purpose
Motion should make the digital notebook feel tangible and understandable. It should explain what changed, where an object went, and what the user can do next.

## Motion vocabulary
- **Reveal:** paper, note, label, or content enters the reading plane.
- **Turn:** a page or section transitions with a clear origin and destination.
- **Slide:** an index or navigation layer moves into or out of focus.
- **Settle:** an object lands gently into a stable state.
- **Focus:** camera, lighting, scale, or contrast shifts attention without disorienting the user.

## Choreography
- Establish a small set of durations and easing curves as tokens in implementation.
- Use short feedback for direct manipulation and slightly longer transitions for scene or page changes.
- Sequence related elements; do not animate every element independently.
- Keep input responsive during transitions and prevent accidental double activation.
- Use consistent motion direction for related navigation actions.

## Interaction rules
- Every animated control needs clear hover, focus, pressed, active, and disabled states as applicable.
- Provide keyboard and touch equivalents for pointer interactions.
- Make animations interruptible or settle safely when navigation changes quickly.
- Do not rely on hover to reveal essential information.
- Avoid forced scrolling and motion that prevents users from reaching content.

## Accessibility and performance
- Respect `prefers-reduced-motion`; offer simpler fades or immediate state changes.
- Avoid flashing, rapid scale oscillations, strong camera roll, and excessive parallax.
- Prefer transform and opacity animation when possible.
- Avoid animating layout properties continuously.
- Verify frame pacing on mid-range mobile hardware, not only a powerful development machine.

## Review checklist
- Is the motion meaningful?
- Is the start/end state clear?
- Does it preserve user control?
- Can the task be completed without motion?
- Is reduced-motion behavior implemented?
- Does it remain smooth on touch devices?
