# Artwork remediation — v1.9.0

All replacement illustrations were visually approved on 2026-09-09, including the final Loading island. No existing component was removed from this fork. The 488-image item catalog and its API were removed.

## Completed artwork

- Footer sea/tree scenes; Wallet pouch; WeddingInvitation couple.
- Divider waves and triangle strips.
- Phone and named Icon pictograms, with Lucide utility glyphs.
- BackTop helper, Tabs leaf, Cursor glove and Select/Pagination glove.
- Loading palm/island and fish, with CSS floating/water/jump motion and reduced-motion support.

Time uses text/CSS and did not require replacement artwork. Original unused showcase images and the stale item-catalog screenshot were also removed. Current package assets have been replaced; existing git history remains intact per the user's decision. Generated image records are retained under `docs/artwork`; these records and the reference-based drawings are not legal clearance.

## Version and release scope

The user requested alignment with upstream 1.9.0 and detailed release notes. The sync ledger records upstream remediation commit `d0030803b2a6f3246a143a63f2ca61ad7c1dac7c`, not later upstream additions such as Background or the raindrop cursor. The older upstream v1.9.0 reference is preserved separately before creating this fork's own tag; no public tag is rewritten.

CHANGELOG.md documents the redraws, retained components, export and menu-clipping fixes, item-catalog removal, and icon-name migration. The tag-triggered release workflow runs verification, publishes through npm Trusted Publishing, and uses the matching changelog section as its GitHub Release body. Publication success must be verified from the workflow and registry, not inferred from this preparation record.

## Release validation

- Library build and TypeScript passed.
- Five migration checks, 192 unit tests, 303 Storybook tests and 77 browser behavior/accessibility checks passed.
- All 261 visual comparisons passed in normal verification mode against the approved local baselines.
- npm pack dry-run passed; all 15 source artwork files matched the packaged bytes, and the old item catalog was absent.
- A packed-package CJS consumer verified component exports and rendering; a built ESM consumer loaded the actual assets with no browser errors.
- Release-note extraction was checked for the correct version and rejected a mismatched tag.

Initial local checks encountered disk exhaustion and load-related timeouts; the task's disposable cache/build outputs were cleaned and affected checks were rerun successfully. Visual baseline refresh retried two development-server navigation interruptions; the final comparison run is the release gate.

`tests/compare-capture.spec.ts` remains intentionally untracked. No unrelated files or existing commit history were rewritten.

The first cloud attempt stopped before publication on a BackTop test that queried a visible role after the button had hidden. The assertion was corrected to test hidden state; three local repeats passed. npm and GitHub Release both returned 404 for 1.9.0 before recovery. The freshly created failed candidate tag was retained under a local recovery reference and updated with an exact remote lease; the original commit remains in main history.
