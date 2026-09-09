# Wallet Pouch Artwork

## Integrated asset (2026-09-09)

The user approved updating the component library with the star-rotated
version. `src/components/Wallet/assets/pouch.png` is now the default Wallet
artwork. It is a 256 × 256 RGBA PNG, 38,662 bytes, derived from the selected
`wallet-star-rotated.png`. Its SHA-256 is
`479bd388e7447799d7908a7481395fb57a20ae5b8ba552716c92ea8d8325a931`.

The image tool produced the illustration and star rotation. Asset preparation
removed cyan using the transparent-visual-assets cleanup script with background
`#00FFFF`, threshold 100 and feather threshold 260, without cropping. The
result was downsampled with Pillow Lanczos to 256 × 256 and saved with PNG
optimization. The source geometry and colors were not redrawn. Edge alpha was
softened; the production image was checked against white, cream and dark green.
No visible cyan pixels remained under the recorded color check
(`G > R + 15`, `B > R + 15`, `alpha > 128`).

The component uses a decorative, non-draggable image at 88% of the existing
icon slot with `object-fit: contain`. Public props, formatting, size presets,
custom icons and hover behavior retain their implementation. The PNG is emitted
to `dist/files`; review images and provenance documents remain excluded from
the package's existing allowlist.

Validation for this integration:

- Library build, Storybook build, TypeScript and package dry-run passed.
- Nine Wallet unit checks, seven Wallet Storybook checks and two focused
  browser checks passed. Browser checks decode the actual PNG and inspect alpha.
- ESM package consumer build/browser rendering and CJS root import/server
  rendering passed, including the emitted image path.
- Desktop and 390px mobile screenshots were visually inspected.
- Wallet's own visual baselines were refreshed for the approved asset; other
  components' baselines were not updated in this step. All six Wallet visual
  checks then passed again without snapshot updates.

This is a local component update, not a release or legal-clearance finding.
The unrelated branch release failures recorded in the sea review remain.

## Current selection and requested adjustment (2026-09-09)

The user selected the fresh cyan-background generation preserved in
`wallet-cyan-selected.png` and requested a slight rotation of the star.
`wallet-star-rotated.png` preserves the resulting native image-tool edit:
the star leans counterclockwise while the pouch retains the selected overall
appearance. The edit prompt requested approximately 18 degrees, but this is
a generative edit, not a verified exact geometric rotation. Both files are
unmodified tool outputs retained for review.

This selection supersedes the earlier checkerboard concept below. The user
agreed to the available native image tool after being informed it cannot
explicitly select GPT Image 2.5. Do not attribute these files to a verified
2.5 model. Background removal and component integration were subsequently
completed as recorded above.

## Approved visual direction (2026-09-09)

The user approved `wallet-approved-concept.png`, generated with the native
image tool using `wallet-approved-concept-prompt.txt`. This approval supersedes
the SVG candidates below as the visual target. Preserve the large left/front
star, small folded opening at the upper right, short red tie, apricot body,
orange shadow patch, and dark brown contour. The user explicitly prefers GPT
Image 2 for drawing this asset over further hand-authored SVG iterations.

The generation directly referenced the original `item-022.png`, inspected from
the local `main` branch. This is a close visual recreation, not evidence of an
independently designed replacement or legal clearance.

The approved file is the unmodified 1254 × 1254 RGB PNG. Its gray checkerboard
is painted into the image, not an alpha channel. At that review checkpoint,
background cleanup and raster integration were pending and the component still
rendered the third SVG candidate. That checkerboard concept was subsequently
superseded by the cyan-background selection.

## Earlier SVG candidates

The earlier Wallet candidate was an inline SVG authored in
`src/components/Wallet/Wallet.tsx`. This September 2026 candidate replaces the
initial remediation's narrow, star-marked pouch with a side-gathered cloth
pouch, a red cord, and a small brown flower stamp.

## Design source and scope

The original Wallet screenshots were inspected for scale, warmth, and the
pouch's placement above the amount. New paths define the body, fabric folds,
bow, and stamp. No original raster asset or upstream SVG paths are embedded.
The original reference remains part of this provenance; authored geometry
does not by itself establish legal clearance.

The revised artwork uses a body weighted toward the lower left, a gathered
opening at the upper right, warm gold fabric, and a vermilion cord. The amount
pill, formatting, size presets, custom icon
API, and hover animation retain their implementation. The Sizes story now
wraps its examples on narrow screens, and ArtworkSurfaces demonstrates all
three sizes against white and cream backgrounds.

## Validation (2026-09-08)

- All nine existing Wallet unit checks passed.
- All seven Wallet Storybook checks passed.
- Library build, Storybook build, TypeScript check, and package dry-run passed.
- Actual desktop and 390px mobile component screenshots were inspected.
  The surface examples wrap without horizontal overflow.
- No Wallet visual regression baseline has been replaced. The candidate is
  awaiting visual approval and has not been published.

## Revision after user feedback (2026-09-09)

The user rejected the first candidate's pale palette and upright balance.
The revision moves the gathered neck to the upper right and the body mass to
the lower left. It replaces the green bow with red, deepens the body color,
and removes the cream patch in favor of a direct brown sprout stamp.

The nine existing unit checks, seven Wallet Storybook checks, and library
build passed again. Desktop and 390px mobile screenshots were inspected.
The revised visual remains a candidate, without a new visual baseline.

## Third candidate (2026-09-09)

The user also rejected the second candidate's appearance. The third candidate
shortens the folded opening, widens the lower body, lightens the outline, and
replaces the large sprout with a smaller flower mark. The red tie and offset
composition remain. This is a new proposal, not user-approved artwork.

The nine unit checks, seven Wallet Storybook checks, and library build passed
for this revision. Desktop and mobile rendering were checked again without
replacing visual regression baselines.

The unrelated branch release failures recorded in
[the sea footer review](footer-sea.md) remain outside this artwork change.
