# Forest Footer Artwork

The forest footer uses `src/components/Footer/assets/tree.svg`, a 640 × 80
vector tile authored during the September 2026 artwork remediation. The user approved
this visual on September 8, 2026. Snapshot baselines remain a separate release step.

## Design source

The brief follows the approved sea footer's flat, compact silhouettes. The
earlier forest footer screenshot was inspected as a visual reference for its
subjects: fruit trees, firs, rounded trees, palms, a lighthouse, a tent, and
small grass marks. Paths were newly authored as SVG code; no original image,
embedded payload, or upstream SVG paths were copied into the asset.

The drawing changes individual contours, palm fronds, lighthouse details,
spacing, and the order of landmarks. It retains the green silhouette language
and familiar subjects. New path authorship alone does not establish legal
clearance; the relationship to the reference remains part of provenance.

## Rendering

- Natural tile size: 640 × 80; file size: 4,115 bytes.
- One green fill (`#58b88b`), without filters or raster textures.
- Fruit holes, lighthouse windows, and the tent opening are transparent.
- Horizontal repetition uses `auto 100%`; neither edge cuts through a motif.
- Non-repeating mode keeps one tile at the same scale, aligned bottom-left.
- The stylesheet emits the SVG into `dist/files` with the sea asset.

## Validation (2026-09-08)

- Library build, Storybook build, TypeScript, and package dry-run passed.
- All seven Footer Storybook checks passed.
- Four sea/forest browser behavior checks and both existing sea visual
  regression checks passed without updating snapshots.
- Desktop and mobile forest screenshots were visually inspected on white,
  cream, and pale green surfaces. The visual was subsequently approved; forest snapshot baselines are not yet recorded.
- The package includes both SVG tiles and excludes review documentation.
- An ESM consumer using the package root and full stylesheet built and rendered
  successfully. The browser loaded the sea tile at 552 × 80 and the default
  forest tile at 640 × 80.

The three previously recorded branch failures outside Footer remain release
gates; see [the sea validation record](footer-sea.md). This candidate does not
claim completion of the entire remediation or publication.
