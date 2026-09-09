# Loading island redraw

Implemented and visually approved on 2026-09-09. This replaces the remaining old SVG island scene. No release was performed in this step.

## Artwork

- `src/components/Loading/assets/island.png`: 388 × 480 RGBA, rendered 132px wide.
- `src/components/Loading/assets/fish.png`: 96 × 49 RGBA, rendered 24px wide.
- Water ellipses and ripple are simple CSS shapes. The composition remains 180 × 200px in the lower-right corner of the loading surface.
- The old island illustration was used as a reference for palm/island proportions and colors. New silhouettes replace its SVG paths; a separate fish illustration was generated without a reference image.

The built-in image tool was used, with the gpt-image-2 skill in Host-Native mode. The tool does not confirm an exact model version. Initial transparency artifacts were corrected by image-tool edits to a flat magenta background. Chroma-key removal used threshold 80, feather threshold 200, trimming and 10px padding; the assets were resized with Lanczos. All production corners have zero alpha. Reference-based redrawing is not legal clearance.

Prompts: [island](loading/island-prompt.txt), [fish](loading/fish-prompt.txt), [cleanup edits](loading/cleanup-edits.txt). The keyed outputs and cleanup reports are archived in `loading/`.

## Behavior

The public `active`, `className` and `style` props are preserved. The existing circular reveal and hide-timer behavior remains. Idle animation now uses CSS: the complete palm/island gently bobs, water stretches, and the fish follows a periodic jump. Individual leaves no longer have separate animations. This removes the old SVG markup, global element IDs, MotionPath plugin and the GSAP tween table. Animations are paused while closing, and reduced-motion users see a static island. The loading surface exposes a labeled status; the illustration is decorative.

The Active and Inactive stories now supply a 360px parent height so they demonstrate the component correctly. The ArtworkSurfaces story shows three simultaneously animated instances on black, cream and dark green backgrounds.

## Validation

- 192 unit tests passed. The 13 obsolete tests pinning the removed GSAP tween table were retired; close-animation tests remain.
- Eight focused browser tests passed, including real asset decode/alpha, simultaneous instances, motion, narrow viewports, reduced motion and reopening during a pending close timer.
- Eleven related Storybook tests passed.
- Library build, TypeScript, Storybook build and npm pack dry-run passed.
- Exact production images are included once each as `dist/files/island.d24eb937.png` and `dist/files/fish.00eacc8f.png`.

Interactive comparison: `/tmp/animal-loading-concept/preview.html`.
The user approved this final illustration. Full release validation and version alignment are tracked in remediation-status.md.
