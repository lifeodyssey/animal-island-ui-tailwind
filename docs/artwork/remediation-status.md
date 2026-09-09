# Artwork remediation status — 2026-09-09

Release is pending. A final comparison with upstream removal commit `740949bd31b8b804110d2123bd670d608507fa97` found Loading's original SVG island scene had been missed. The user then requested it be addressed: a new raster palm/island and fish, with CSS animation, are now integrated locally. The user approved the [Loading redraw](loading.md), completing the visual review.

## Completed and approved

- Footer sea and tree scenes.
- Wallet pouch and WeddingInvitation couple.
- Divider waves and triangle strips.
- Phone and named Icon pictograms; utility glyphs use Lucide.
- BackTop helper, Tabs leaf, Cursor glove and Select/Pagination glove.
- Removed the 488-image item catalog and its `item`, `ITEM_LIST` and `ITEM_COUNT` APIs.

Time is a text/CSS component and has no image asset requiring a redraw. Components remain available in this fork.

## Release follow-through

The user requested version alignment with upstream and release notes describing the work, conditional on no remaining components needing changes. The live upstream package version is 1.9.0 (main was `42fee8ac832b8ed013414dabb7aa447e0d3c0bc1` when checked). No release commit, version bump, push or publication has been performed.

- Loading is approved and retains the component API.
- Align to 1.9.0 as requested, documenting the item-catalog breaking changes.
- Update README imagery and stale Icon API guidance in AI_USAGE.md; review the bundled skill's old image-file references.
- Use the project's tag-triggered Release workflow. Add the detailed changelog section as its release body; it currently generates only automatic notes.
- Rebuild the upstream sync ledger against the remediation baseline, without claiming the subsequent Background/raindrop-cursor additions were ported.
- The existing local `v1.9.0` tag belongs to upstream commit `d0030803b2a6f3246a143a63f2ca61ad7c1dac7c`, not this package. Preserve that upstream reference before creating this fork's release tag. No matching tag existed on origin during this check; never force-push or rewrite a public tag.
- Keep `tests/compare-capture.spec.ts` untracked and retain local history, per prior decisions.

## Checks from this audit

All 302 Storybook cases and all 74 browser behavior/accessibility checks passed. Full visual-baseline refresh was interrupted after discovering the outstanding illustration: 114 passed, 2 skipped, 1 interrupted, 143 not run. Some approved baselines were refreshed, but full visual release validation remains incomplete.

Current Loading screenshot: `/tmp/animal-release/loading-still-original.png`.
