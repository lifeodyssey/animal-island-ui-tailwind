# Sea Footer Artwork

The sea footer uses `src/components/Footer/assets/sea.svg`, a 552 × 80 vector
tile based on the visual concept approved during the September 2026 artwork
remediation review. The subsequent switch to SVG was explicitly approved.

## Design source

- `footer-sea-approved.png` preserves the approved AI-generated concept.
- `footer-sea-concept-prompt.txt` preserves the generation brief. The concept
  used a screenshot of the earlier sea footer and a rejected draft as references.
- The SVG paths were authored for this implementation, following that approved
  concept. No old game-extracted image, base64 payload, or upstream SVG path is
  embedded in the new asset.

The selected subjects are a pink sailboat, tilted message bottles, rounded
fish, branching coral, waves, and small seabird marks. The new asset keeps
their approved proportions, colors, and arrangement while removing raster
texture and making the area above the sea transparent. This provenance record
does not constitute a legal clearance determination.

## Rendering

- Default component height remains 80px.
- `seamless={true}` repeats the tile horizontally at `auto 100%`.
- `seamless={false}` displays one tile at the same scale, aligned bottom-left.
- The tile contains 23 complete wave periods; both horizontal boundaries meet
  at the same height and tangent. No motif crosses a tile boundary.
- The asset is loaded through the stylesheet and emitted into `dist/files`.
- The forest variant now has a separate [SVG candidate](footer-tree.md).

This is an approved visual departure from the upstream remediation's gradient
sea footer. The approved concept image is retained for design review only and
is excluded from the npm package by its existing `files` allowlist.

## Validation (2026-09-08)

- Library build, Storybook build, TypeScript check, and package dry-run passed.
  The emitted SVG is 6,000 bytes. The approved PNG is not in the package.
- ESM consumer build and browser render passed with the package's root import
  and full stylesheet. The browser loaded the emitted SVG at 552 × 80.
- CJS root import and React server render passed with browser asset extensions
  stubbed in Node.
- Both focused behavior checks passed, including transparent upper pixels,
  opaque water, byte-identical left/right edge pixels, mobile width, and
  non-repeating mode.
- Desktop and mobile visual baselines were inspected and passed a subsequent
  check without snapshot updates. Only the new Footer baselines were added.
- `npm test` passed migration, 204 unit tests, and 298 Storybook tests. The
  Playwright phase finished with 46 passed and 3 failed, so the aggregate
  command did not reach the full visual suite.

Remaining failures outside this change:

1. The Divider parity check expects `background-repeat: no-repeat`, but the
   earlier remediation renders `repeat`. This failure was reproduced before
   the sea SVG integration.
2. The Cursor check still expects a `cursor-icon` filename after the earlier
   replacement with an inline SVG data URL.
3. The Tabs check still selects `img` elements after the earlier switch to SVG.

These are remaining branch release gates, not a claim that the whole
remediation is ready to publish.
