# 3D Guidelines — THE MAKER'S NOTEBOOK

## Art direction
Use 3D to express the physical notebook/workshop world: books, shelves, paper, desk objects, light, and depth. Keep the scene composition readable and avoid adding objects solely to demonstrate technical capability.

## Scene design
- Define scene purpose, camera framing, focal point, interaction bounds, and fallback before building.
- Keep important text and controls outside complex 3D surfaces when readability or accessibility would suffer.
- Use consistent physical scale and material response.
- Light for legibility and atmosphere; avoid over-dark scenes and uncontrolled bloom.
- Maintain visual hierarchy across desktop and mobile camera framing.

## Runtime and assets
- Prefer optimized GLTF/GLB assets where appropriate.
- Compress geometry and textures; choose texture dimensions based on actual display size.
- Load noncritical assets lazily and provide loading feedback for required assets.
- Reuse materials and geometries; instance repeated objects where suitable.
- Dispose of GPU resources when scenes or assets are no longer needed.
- Avoid excessive transparent layers, large shadow maps, high-cost post-processing, and unnecessary real-time physics.

## Interaction
- Define picking/raycasting targets carefully and prevent invisible objects from blocking controls.
- Support touch gestures without conflicting with page scrolling.
- Provide keyboard-accessible alternatives to 3D-only navigation.
- Include a non-3D or reduced-complexity fallback where device capability or user preference requires it.

## Performance checks
- Monitor frame rate, memory, load time, and layout stability on representative devices.
- Test with constrained GPU/mobile hardware and throttled network conditions.
- Reduce scene complexity responsively when required.
- Ensure the page remains usable while 3D assets are loading or if WebGL fails.
