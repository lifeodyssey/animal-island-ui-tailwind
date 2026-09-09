# Wedding couple artwork

The user approved the human couple candidate on 2026-09-09. It replaces the inline cat/rabbit illustration in `WeddingInvitation` with `assets/couple.png` (640 × 800 RGBA). The rendered height remains the approved 250 CSS pixels; the title and card structure are unchanged.

## Provenance

Generated with the native image generation tool using the original bride-and-groom artwork as a visual reference. The tool does not expose a model selector or confirm GPT Image 2.5. The archived prompt and generated cyan-background image record this reference-based workflow. User visual approval and regeneration are not a legal clearance determination.

Source generation: `exec-9400ff10-32fe-4e1c-abf3-b7ca18758cc3.png`.

Background cleanup used the transparent-visual-assets script with cyan #00FFFF, threshold 40 and feather threshold 160; Pillow Lanczos reduced the unchanged canvas to 640 × 800. Production imports only the final PNG. The unused reference-era `img/wedding.png` and `img/brideandgroom.png` files were removed during final artwork cleanup on 2026-09-09. Git history was not rewritten.

## Export

The PNG export now embeds image data and computed element styles into its SVG snapshot. The SVG uses a data URL to avoid Chromium canvas taint from blob-backed foreignObjects; page-layout offsets are reset on the snapshot root. Browser coverage verifies the actual downloaded PNG contains the couple, in addition to checking mobile containment. This does not add arbitrary CSS pseudo-element or external background-image export support.

## Validation

- TypeScript, library build and Storybook build passed.
- All 204 unit tests and five migration checks passed.
- Eight wedding screenshot baselines updated to the approved artwork.
- Seven WeddingInvitation Storybook cases passed.
- Two browser checks passed, including the actual PNG download and artwork pixels.
- Production asset inclusion checked with npm pack dry-run.
- No npm publication, push, or release is performed by this artwork change.
