# Divider wave artwork

Approved and integrated on 2026-09-09. The `wave-yellow` variant now uses an independently authored cubic curve in a CSS data SVG. Fifteen cycles occupy a centered 450 × 12 band, shrinking with narrower containers. The curve has a 3px #f0d85b stroke and transparent surroundings. It replaces the filled radial-gradient scallops; no extracted SVG path is reused. Public props and separator semantics are unchanged.

The user reviewed the original screenshot, previous implementation and new curve together in the local concept preview. Other Divider variants are outside this approval.

Validation: library build, TypeScript, npm pack dry-run, Storybook build and all 11 Divider Storybook cases passed. Three affected Divider story snapshots were updated. A browser check confirmed separator semantics, no-repeat rendering and no overflow in a 240px viewport (160px content area). This focused check does not clear the branch-wide legacy parity failures in other divider variants and unrelated components. No publish or push was performed.
