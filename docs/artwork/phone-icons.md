# Phone and Icon artwork

Approved on 2026-09-09 from the three-column original/current/candidate preview. Nine generated pictograms are shared through `Icon/artwork.ts` and `Icon/assets/island-icons.png`. Phone uses 112px atlas cells, matching the approved preview exactly. Each cell retains its original transparent padding. The image is a 1254 × 1254 RGBA atlas, not nine independent downloads.

## Provenance

The native image tool generated `exec-94f4f4ae-ffaf-4aea-a3a9-7e0bbacb9af7.png` with the original phone screenshot as a style reference. The tool does not expose model selection or confirm GPT Image 2.5. The prompt and magenta-background output are archived alongside this note. The transparent-visual-assets cleanup script removed #FF00FF with threshold 80 and feather threshold 200; no other visual edits were made. This reference-based generation and user approval are not legal clearance.

## Component behavior

- Phone reuses the approved nine pictograms on its existing colored tiles. The status bar, page glyph, badges and clock remain unchanged.
- Named Icon artwork: camera, chat, encyclopedia, design, map, DIY and variant. `icon-variant` uses the passport illustration, consistent with the original visual subject.
- New named options: `icon-travel`, `icon-passport` and `icon-helicopter`. Passport and variant intentionally share a cell.
- Left/right arrows, location, page, Wi-Fi and shopping retain Lucide glyphs. `icon={...}` continues to accept arbitrary Lucide components; `color` and `strokeWidth` apply to vectors, not colored bitmap art. `src`, dimensions, styles, ref and accessibility attributes remain supported.
- Labeled raster icons expose role=img. Decorative instances remain aria-hidden.
- The deleted item catalog is not restored. Its obsolete visual-test story entry was removed; the new artwork surfaces story was added.

## Validation

Six Icon unit cases, eight Phone/Icon Storybook cases and two focused browser checks passed. Browser coverage includes actual atlas decode, alpha transparency, clock and badges, accessible names and small icons on white, cream and dark-green surfaces. Library build, TypeScript, Storybook build and npm pack dry-run passed. The exact atlas is emitted once as `dist/files/island-icons.bc4028f2.png`. CJS SSR and a built ESM consumer both passed; the latter loaded the actual packaged image.

All 205 unit tests and five migration checks passed. Eight Phone/Icon visual checks passed after updating the approved baselines, including the new surfaces story.

No push, publication or release. Full branch release validation remains separate.
