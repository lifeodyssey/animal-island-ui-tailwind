# Approved upstream visual differences

These choices were approved on 2026-10-11 after comparing the pre-sync fork
(`9b7b629`) with the port of upstream `945cb5bb`. Preserve them in later syncs
unless the user explicitly requests a different appearance.

| Component | Selected appearance | Difference from upstream `945cb5bb` |
| --- | --- | --- |
| Title | Pre-sync: default `layer` (two paper layers) | Upstream defaults to `ribbon`. Explicit `ribbon` and `tab` variants remain available. |
| Progress | Pre-sync: animated diagonal stripes and original track, fill, sizes and percentage styling | Do not adopt the upstream mint gradient, dotted track, highlight or completion brightening. Preserve `infoPosition`, scene variants and custom colors. |
| Modal | Synced: default `game` | Keep the synced appearance; explicit `default` remains available. |
| Input | Synced: `#fffdf7` surface | Keep the synced appearance. |
| Cursor | Approved redrawn 48px glove for the default cursor | Preserve the local glove asset rather than replacing it with the newer upstream arrow. The raindrop variant remains available. |
| Form | Synced: 12px SVG close icon for error feedback | Use the fork's local SVG; pixel identity with upstream's `naive-icons` asset is not asserted. |

The `.upstream-sync` SHA remains the ported baseline. These intentional visual
differences do not mean the upstream range needs to be ported again. Existing
approved replacement artwork also remains in place; see the 1.9.0 changelog.

Visual regression baselines must reflect these selections. Do not regenerate
baselines to adopt a different design without a corresponding approved change.
