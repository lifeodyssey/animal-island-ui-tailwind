# BackTop, Tabs and glove artwork

Approved on 2026-09-09 from `/tmp/animal-small-details/redraw/preview.html` and integrated into the local component library. The earlier bird concept is superseded.

## Artwork and provenance

Four reference-based generations replace the temporary vector artwork. The native image tool used the corresponding original image as a reference. It does not expose model selection or confirm GPT Image 2.5. Prompts and unprocessed outputs are archived in `small-details/`. Reference-based generation and user approval are not legal clearance.

| Asset | Source resolution | Display |
| --- | --- | --- |
| `BackTop/assets/helper.png` | 320 × 320 | 105px figure within a 128 × 110 badge; 80px figure within 98 × 84 on mobile |
| `Tabs/assets/leaf.png` | 96 × 96 | 18px animated active-tab leaf |
| `Cursor/assets/glove.png` | 48 × 48 | CSS cursor with fingertip hotspot at 8, 5 |
| `Select/assets/selection-glove.png` | 72 × 72 | 30px right-pointing indicator in Select and Pagination menus |

BackTop, leaf and cursor outputs used a #FF00FF background, removed with the transparent-visual-assets cleanup script (threshold 80, feather threshold 200). The selection glove already had native alpha. Transparent canvases were resized with Lanczos, retaining their padding. BackTop's bubble and Chinese text are rendered in CSS/HTML. Every production image has transparent corners.

## Integration

- BackTop keeps its target-container scrolling, click/keyboard activation, visibility threshold and hover feedback.
- Tabs keeps its active state, selection behavior and optional leaf animation.
- Cursor keeps forced and scoped modes, including semantic pointer/text/disabled overrides in scoped mode.
- Select reserves a 30px left gutter inside Radix's scrolling viewport so the external glove is not clipped. Popper's left collision padding also reserves space at the browser edge. Pagination shares the same image.
- All four PNGs are emitted once in `dist/files` and included in the package dry-run.

## Validation

All 205 unit tests, 59 browser behavior tests and 22 related Storybook cases passed. After the Select gutter correction, the 11 affected controls/artwork browser checks passed again. The focused artwork tests check image decoding, cursor hotspot, viewport containment, mobile keyboard activation, scroll-to-top behavior and menu-glove clipping.

Approved Tabs/Select visual baselines were updated, with new visible BackTop desktop/mobile and Select edge screenshots. All 22 focused visual checks then passed in normal comparison mode; the full branch visual suite remains separate. Library build, TypeScript, Storybook build and npm pack dry-run passed. Final local preview: `/tmp/animal-small-details/redraw/final-preview.html`.

No commit, push, npm publication or release was performed. Full branch release validation remains separate.
