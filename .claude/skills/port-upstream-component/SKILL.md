---
name: port-upstream-component
description: Use when migrating one animal-island-ui-tailwind component's styling from hand-written CSS to Tailwind v4 internal authoring (@theme + @utility + CVA) while keeping the semantic animal-* contract and rendered pixels unchanged, OR when porting a changed upstream component. Drives the per-component loop with a pixel gate and behavior tests.
---

# Port / restyle one component (Less → Tailwind v4 + Radix, pixel-stable)

The full rationale lives in `docs/MIGRATION_DESIGN.md`. This skill is the executable runbook for ONE component. Run it once per component; drive many via `/loop` or a Workflow batch.

## Model of the work

This is a **refactor with an invariant**, not a redesign. Distribution stays **npm + compiled CSS** (the "daisyUI model"): author with Tailwind internally, expose semantic `animal-*` classes + `--animal-*` tokens. **Utilities never appear in consumer markup. Do NOT add `data-slot`.**

## Inputs

- `<Component>` name (e.g. `Button`).
- Optional upstream commit range from `npm run upstream:delta` (JSON worklist) when syncing upstream changes.

## The three rules (do not violate)

1. **Same function → reuse.** Don't touch behavior/props/handlers. Prefer git-level reuse (see step 2).
2. **Styling → Tailwind best practice**, internal only (`@theme` tokens, `@utility`, CVA variants via `cn`).
3. **Behavior → Storybook `play` + Playwright** prove it's unchanged.

## Loop (gate after every sub-step)

0. **PIN.** On a clean tree: `npm run test:visual-baseline` for this component's stories; confirm its `play` + `tests/playwright-*.spec.ts` are green on current code. If behavior coverage is thin, ADD assertions and see them pass on the CURRENT code first — lock behavior before moving style.
1. **BRANCH** `codex/restyle-<Component>`.
2. **REUSE decision (git, 3-tier)** for each upstream changed file:
   - **A byte-identical** (assets, Less-agnostic pure-logic TS): `git checkout upstream/<sha> -- <path>`, no edits.
   - **B reuse-then-modify** (default preference): `git checkout`/cherry-pick the upstream file as a base commit FIRST, then apply Tailwind adaptation on top (swap `import styles from './x.module.less'` → `cn('animal-*')`).
   - **C rewrite**: only when Less-bound with no reusable base.
3. **TOKENIZE.** Replace hardcoded hex with `--animal-*` / `@theme` tokens ONLY where the computed value is byte-identical. Near values (e.g. `#fc736d` vs error `#e05a5a`) keep original + comment. → `npm run test:visual-check` MUST be 0-diff (within the gate tolerance).
4. **VARIANTS.** Convert lookup objects to `cva()` emitting **byte-identical `animal-*` literals** (no utility strings, no template concatenation). → `tsc --noEmit` + 0-diff; `play`/Playwright still green (DOM unchanged).
5. **STATE.** Ensure all Radix state styling uses `data-[state=…]` / `aria-*` selectors — never recompute conditional classes in JS.
6. **PROMOTE.** Lift reusable heavy visuals into `@utility` / `@theme --animate-*` / `@custom-variant` ONLY if output is byte-identical; re-gate.
7. **IRREDUCIBLE — zero edits.** clip-path (`ISLAND_BLOB_PATH`, per-instance `useSafeId` clipPath), `@keyframes`, multi-layer box-shadows, GSAP, `::before/::after` stay raw CSS. Explicitly out of scope.
8. **STORYBOOK.** Add `argTypes` (descriptions + controls + `table`) and, for interactive components, `play` interaction tests. Complex components get a `Component.mdx`.
9. **VERIFY** (all must pass): `npm run build && npm pack --dry-run` (publish shape unchanged) `&& npx tsc --noEmit && npm run test:migration && npm run test-storybook && npm run test:playwright && npm run test:a11y`; `npm run test:visual-check` is the local 0-diff merge gate.
10. **PR draft** with the upstream commit range and "zero-pixel verified locally on macOS".

## Guardrails — MUST FAIL the task if any holds
- `test:migration` fails, or the component is not exported from `src/index.ts`.
- Any `.less` import remains under `src/components/<Component>/`.
- `tsc --noEmit` errors.
- `test:visual-check` is not green (a real pixel change leaked in).
- A `utility` class string was added to a component's consumer-facing markup, or a `data-slot` attribute was introduced as a styling contract.
- An `animal-*` class was renamed/removed (it is the public + test contract).

## MUST PASS before PR
- `play` + Playwright + a11y green; publish shape (`exports`/`dist/index.css`/`preserveModules`) unchanged; the component's root `animal-*` class actually renders (migration test asserts this).

## After merging an upstream sync
Update the `.upstream-sync` ledger to the synced upstream SHA: `git rev-parse upstream/main > .upstream-sync`.

## Notes
- Pixel gate tolerance lives in `playwright.config.ts` (`maxDiffPixels` / `threshold`). It is "effectively pixel-perfect" — absolute 0 flaps on macOS font AA; see the config comment and `docs/MIGRATION_DESIGN.md` §3.
- Baselines are committed; a baseline PNG changing in a diff is a review red flag requiring human visual approval — never auto-update on merge.
