# Animal Island UI — Less → Tailwind v4 + Radix Migration & Automation Design

> Status: design (awaiting approval before execution).
>
> **Architecture verdict — the "daisyUI model":** distribute as an **npm + pre-compiled CSS** package; expose **semantic `animal-*` classes + `--animal-*` runtime tokens** as the consumer contract; author styles **internally** with Tailwind v4 best practice (`@theme` + `@utility` + CVA), compiled into `dist` — **utilities never appear in consumer markup**. Every styling change is guarded by a **pixel-exact (zero-diff) gate**. Automation is **Claude Code native** (skill + `/loop`/Workflow + daily `/schedule`).

---

## 0. Context (why)

This library is an independent Tailwind v4 + Radix fork of `guokaigdg/animal-island-ui` (Less). Feature parity with upstream 1.0.16 is already done (Form, Wallet, Card pattern, Icon item, Modal maskStyle, Radio/Checkbox animations, etc.). Three gaps remain:

1. Styles are **hand-written 3000-line global `animal-*` CSS**, not authored with Tailwind best practice.
2. The migration has **no provable visual-equivalence guarantee** ("looks the same" is asserted, not proven).
3. There is **no stable, repeatable migration / upstream-sync pipeline**.

This document settles the architecture and defines the migration + automation workflow.

### Why the daisyUI model (research-backed)

A web survey of strongly-themed/characterful UI libraries (NES.css, 98/7/XP.css, daisyUI, @joacod/pixel-ui, Pxlkit, Shopify Polaris, IBM Carbon, Vercel Geist, neobrutalism, Aceternity, Magic UI, Cult UI, Tremor, Park UI) found the architecture is decided by **distribution model, not by aesthetic**:

| Distribution | Examples | Consumer writes | Public hook | Theming |
|---|---|---|---|---|
| **npm + compiled CSS** | NES.css, 98/7/XP.css, **daisyUI**, @joacod/pixel-ui, Pxlkit, Polaris, Carbon, original animal-island-ui | **semantic class** (`.nes-btn`, `.btn`) | prefixed semantic class + `is-*` modifiers | runtime CSS variables |
| **copy-paste / shadcn registry** | neobrutalism, Aceternity, Magic UI, Cult UI, Park UI, RetroUI.dev, Tremor | **utility classes in JSX** | none (source is the API) | shadcn/Panda CSS vars |

- **"utilities-in-markup" ⇔ copy-paste distribution is effectively causal.** Every researched library that exposes utilities to consumers ships as copy-paste source.
- **No npm-compiled-CSS library exposes utilities to consumers** — once CSS is compiled and published, the consumer cannot edit it and need not install a Tailwind toolchain, so utilities-in-markup serve no purpose.
- We are **npm + compiled CSS** (`main`/`module`/`types`, `exports` → `./style`, `preserveModules`, `dist/index.css`). The closest analogue is **daisyUI**: Tailwind-driven internally, semantic classes + CSS-variable themes externally.

**Reconciling "utility-first":** "author internally with Tailwind best practice" = ✅. "Expose utilities in consumer markup" = ❌ for our distribution model. Pure utilities-to-consumer would only be correct if we switched to a copy-paste registry — which sacrifices import-and-go and pixel-parity control. Decision: **stay npm; daisyUI model.**

---

## 1. Goals & constraints

**Goal:** migrate every component's *style implementation* from the Less reference to Tailwind v4 best practice (`@theme` + `@utility` + CVA + `cn`) + Radix, with **byte-identical rendered pixels vs current `main` (zero-diff)**, and stand up an auditable, repeatable migration/upstream-sync pipeline.

**Hard constraints (verified against the repo):**

1. **Pixel-first (rule #1).** Rendered DOM, class list, and cascade must not change visibly. This is a **refactor with an invariant**, not a redesign.
2. **`animal-*` is the public contract.** It is the styling host, the test hook (~51 selectors; Title alone ~28), and a consumer-facing API. **Never delete or rename** (deprecate via aliases only).
3. **Pre-compiled CSS distribution unchanged.** Keep emitting `dist/index.css` / `core.css` / `fonts.css`; keep `exports`, `preserveModules`, and the no-preflight `@layer` order.
4. **Irreducible visuals stay raw CSS/JS:** clip-paths (`ISLAND_BLOB_PATH`, Modal/Tooltip per-instance `useSafeId` clipPath), all `@keyframes` (**enumerate by file — ~20**, incl. multi-shadow `animal-control-splash`), multi-layer box-shadows, ~28 `::before/::after`, GSAP (Loading).
5. **Visual gate is macOS-local; CI skips screenshots** (Linux font rendering differs; `test:ci` already excludes `test:visual`).
6. **Radix already covers most a11y/behavior** — do not re-implement.

**The three migration rules (from the maintainer):**
- **#1 same function → reuse** (prefer git-level reuse, §5.0);
- **#2 styling → Tailwind best practice** (internal authoring only);
- **#3 behavior → Storybook `play` tests + Playwright** as the consistency contract.

---

## 2. Style architecture — daisyUI model, four tiers

**Chosen:** internal Tailwind authoring → compiled semantic classes. Rejected: utilities-in-consumer-markup (wrong for npm distribution, deletes hooks); `@apply`-rebuilding semantic classes (Tailwind anti-pattern). Four tiers, mutually exclusive responsibilities:

### Tier 1 — Tokens in `@theme` (single source of truth)
Move `tokens.css`'s ~69 `:root` custom properties + `form.css`'s 7 form tokens into `theme.css`'s `@theme` (today only `--font-animal` + `--mask-r @property`). Use Tailwind v4 namespaces (`--color-animal-*`, `--shadow-animal-*`, `--ease-animal-*`, `--animate-*`, `--radius-animal-*`) so tokens auto-generate internal utilities AND become the consumer's single retheme entry point.

> **Parity guards:**
> - **Keep hex verbatim — never convert to oklch** (byte-identical color is the first line of defense).
> - **Renaming is consumer-visible → keep old `--animal-*` names as `var()` aliases for one release** + documented deprecation.
> - **Collapse hardcoded hex only when the computed value is byte-identical.** `#c4b89e` (53 occurrences) → `var(--color-animal-text-disabled)` is safe; near values (e.g. `#fc736d` vs error `#e05a5a`) are **not** collapsed — keep the original + a comment. This rule prevents the subtlest 1-bit drift.

### Tier 2 — Variant logic via CVA + `cn` (already have `clsx` + `twMerge`)
Replace the hand-written `xxxClassName` lookup objects in `Button/Input/Card` with `cva()` matrices whose values are **byte-identical `animal-*` literals** (not utility strings, not template concatenation). Rendered class strings stay byte-identical; the `animal-*` hook is produced by CVA.

### Tier 3 — Semantic `animal-*` CSS in `@layer components`, reading Tier 1 tokens
Home of parity and irreducible visuals. Radix state styling uses `data-[state=…]` / `aria-*` attribute selectors (19 existing usages are correct) — **never recompute conditional classes in JS**. `@utility` carries reusable heavy visuals (3D shadow, pill radius). Each `@keyframes` lives **co-located with its `--animate-*`** (avoids the v4 multi-config keyframe-loss footgun, GH#17709). `@apply` is limited to base reset + pseudo-elements JSX cannot reach (`::placeholder`, `::selection`).

### Tier 4 — Theming increment (learn from daisyUI)
Systematize the token set (semantic colors + `-content` pairings, `--radius-*`, `--border`) and add an **optional `data-theme` whole-skin switch** for dark/multi-theme support, mirroring daisyUI's `<html data-theme="…">`. This is additive and does not affect default rendering (pixel gate stays green).

> **Explicitly NOT adopting `data-slot`.** Research found no npm-compiled-CSS themed library uses `data-slot` as a styling contract — it is a shadcn copy-paste artifact. We already have stable `animal-*` sub-element hooks. (Radix `[data-state]` for behavior is unrelated and stays.)

### Before / After (Button)
```tsx
// Before: scattered ternaries + lookup objects
const buttonTypeClassName = { primary: 'animal-btn-primary', /* … */ };
className={cn('animal-btn', buttonTypeClassName[type], buttonSizeClassName[size],
  danger && 'animal-btn-danger', className)}
```
```tsx
// After: CVA emits byte-identical animal-* literals (no utilities leak to markup)
const buttonVariants = cva('animal-btn', {
  variants: {
    type: { primary: 'animal-btn-primary', default: 'animal-btn-default' /* … */ },
    size: { small: 'animal-btn-small', middle: 'animal-btn-middle', large: 'animal-btn-large' },
  },
  defaultVariants: { type: 'default', size: 'middle' },
});
className={cn(buttonVariants({ type, size }), danger && 'animal-btn-danger', className)}
```
```css
/* @layer components — rendered output byte-identical; hex → token (same computed value) */
.animal-btn-primary {
  background: var(--color-animal-primary);   /* was #19c8b9 */
  box-shadow: var(--shadow-animal-press);    /* was 0 5px 0 0 #bdaea0 */
}
```
Rendered DOM and class list unchanged → pixel gate stays green; test selectors and Title references survive structurally.

---

## 3. Pixel-exact gate

**Mechanism:** tighten the existing Playwright harness — no Chromatic/SaaS (it runs Linux, violating the macOS-baseline rule). macOS-local.

`playwright.config.ts`:
```ts
expect: { toHaveScreenshot: { maxDiffPixels: 0, threshold: 0, animations: 'disabled' } },
use: { deviceScaleFactor: 1 },   // lock DPI subpixels
```
Mandatory determinism helper (every visual spec):
```ts
const disableMotion = async (page) => {
  await page.addStyleTag({ content: `*,*::before,*::after{
    animation:none!important;transition:none!important;caret-color:transparent!important;
    outline:none!important;-webkit-font-smoothing:antialiased!important;-moz-osx-font-smoothing:grayscale!important;}` });
  await page.evaluate(() => document.fonts.ready);
  await page.waitForLoadState('networkidle');
};
```
> Font-load AA races are the #1 false-positive under `maxDiffPixels:0`: `document.fonts.ready` + `networkidle` + smoothing normalization + `deviceScaleFactor:1` are all required.

**Coverage:** only ~12/177 stories are gated today. Add `tests/visual-auto-generate.spec.ts` that globs `src/components/*/*.stories.tsx`, derives Storybook ids, drives `/iframe.html?id=…`, screenshots `#storybook-root`; **cross-check story count against Storybook `index.json`** (regex misses factory/loop-driven CSF3). Animation components (Typewriter/Loading/dropdowns) get dedicated no-play parity stories with frozen animation.

**Baseline lifecycle (keep committed baselines):** the repo already commits 54 baseline PNGs as the shared source of truth. **Keep the committed-baseline model** — any PNG changing in a diff is a review red flag requiring human visual approval.

**Loop:** PIN (`test:visual-baseline --update` on `main`, commit) → REFACTOR (branch) → VERIFY (`test:visual-check`, any non-zero blocks) → re-baselining is **never automatic**. New scripts: `test:visual-baseline`, `test:visual-check`.

---

## 4. Behavior contract (rule #3)

Storybook `play` tests + Playwright are the behavior gate, independent of pixels (so the screenshot gate can never give false confidence about behavior). See §7 for the Storybook system. CI runs `toHaveCSS()` token-value assertions (§9.4) as the cross-platform backstop because screenshots are local-only.

### Animation-driven components (Loading/GSAP, Typewriter, Cursor) — test the wiring, not the frames

Pixel snapshots are for **static appearance only**. An infinite or JS-driven animation has no stable frame, so it must NOT be pinned in the pixel gate. Layer its tests instead:

1. **Spy the animation engine (unit).** Canonical example: `src/components/Loading/Loading.gsap.unit.test.tsx` — `vi.mock('gsap')`, render, capture every `to`/`fromTo`/`set` call, assert each target gets the expected method + params (the upstream tween set). Deterministic, frame-free; this is the real regression net.
2. **Behavior (play/Playwright).** Structure renders; `active`/`trigger` toggles mount/visibility; a11y (`role="status"`/`aria-busy`/`aria-live`); cleanup on unmount (gsap `context.revert()`).
3. **Visual — frozen frame only.** Pin a deterministic frame (GSAP `pause(0)`, fake timers, or a static first-frame no-play story), never the live loop. `toHaveScreenshot`'s stabilization polling settles *finite* animations (Typewriter typing out, Cursor slide-in) — so those ARE auto-pinned in `tests/visual-auto-generate.spec.ts`. Only truly infinite loops (the Loading island GSAP timeline) sit in that spec's documented `DENYLIST` — excluded from the pixel gate by design, with correctness covered by layers 1+2. This is consistent with §1 constraint #4 (GSAP is irreducible) and not a coverage gap.

**Rule of thumb:** static states → pixel snapshot; dynamic/infinite animation → engine-spy + behavior assertions.

---

## 5. Per-component migration loop

Follows rules #1/#2/#3, **gating after every sub-step** (sub-step isolation = best regression localization).

### 5.0 Reuse decision (git-level) — three tiers, reuse-biased
For each changed file, first ask "can this be reused from upstream via git?":
- **A — byte-identical reuse:** assets (png/svg/webp/fonts), Less-agnostic pure-logic TS (`useForm.ts`, `validators.ts`, `types.ts`, `formatValue`, …) → `git checkout upstream/<sha> -- <path>`, **no edits**.
- **B — reuse-then-modify (default preference):** files that can use the upstream version as a base → **`git checkout`/cherry-pick the upstream file as a base commit first, then apply Tailwind adaptation on top** (swap `import styles from './x.module.less'` → `cn('animal-*')`). Upstream-as-base is the commit; our change is a visible diff — preserves provenance, minimizes drift.
- **C — rewrite:** only when Less-bound with no reusable base.
- Reuse upstream tests as behavior baselines; don't invent cases from scratch.

### 5.1 Steps
0. **PIN:** build on `main` + `test:visual-baseline` for the component's stories; confirm existing play + Playwright behavior tests are green.
1. **BRANCH:** `codex/restyle-<Component>`.
2. **REUSE + BEHAVIOR FREEZE (rules #1+#3):** apply §5.0 to reusable files; don't touch logic/props/handlers; confirm play + Playwright cover upstream behavior (keyboard, `useControllableState` controlled/uncontrolled, Radix `data-state`, form submit). **If coverage is thin, add assertions and see them pass on current code first** — lock behavior before moving styles.
3. **TOKENIZE:** hex → token only where the computed value is byte-identical; near values keep original + comment. → `test:visual-check` must be 0-diff.
4. **VARIANTS (rule #2):** lookup objects → `cva()` emitting identical `animal-*` literals. → tsc + 0-diff; play/Playwright still green (DOM unchanged).
5. **STATE:** all Radix state styling via `data-*`/`aria-*` selectors.
6. **PROMOTE:** reusable heavy visuals → `@utility` / `@theme --animate-*` / `@custom-variant`, only if output is byte-identical; re-gate.
7. **IRREDUCIBLE:** clip-path/keyframes/multi-shadow/GSAP/pseudo stay raw CSS — **explicitly out of scope, zero edits**.
8. **VERIFY:** `build && pack --dry-run` (publish shape unchanged) `&& tsc --noEmit && test:migration && test-storybook && test:playwright && test:a11y`; `test:visual-check` is the local merge gate.
9. **PR draft** with upstream commit range + "zero-pixel verified locally on macOS".

**Special case — Modal (the only behavior-forked component):** do a standalone **behavior reconciliation PR** first (Radix Dialog + `useSafeId` vs upstream `createPortal` + manual focus trap; ESC/Tab/focus-trap/maskStyle), gated by play tests; only **after it passes**, do styling. Never mix behavior and styling in one commit. Per-instance clip-path stays raw.

---

## 6. Radix primitive adoption (parity-safe)

8/25 components already use Radix excellently (Switch/Checkbox/Radio/Select/Tabs/Modal/Collapse/Tooltip) — leave them. Two high-value, zero-visual-impact adoptions (Wave 1):

- **Divider → `@radix-ui/react-separator`** (currently hand-rolls `role="separator"`; `Separator.Root` renders `<div role="separator">`; `className` keeps `animal-divider-*`).
- **Form label → `@radix-ui/react-label`** (`Label.Root` renders `<label>`; also settles the label↔input `htmlFor`↔`id` association — verify the current state empirically during implementation; the code-review and Radix audit disagreed on whether it's already correct).
- Add two optional **peerDependencies**: `@radix-ui/react-separator`, `@radix-ui/react-label`.
- Everything else is presentational or animation-driven — no suitable primitive; keep as-is.

---

## 7. Storybook system (docs + behavior parity)

**Already:** global autodocs, a11y addon (`test:'todo'`), vitest browser project, parity stories hidden via `!dev/!autodocs`, `play` on 5/25.

**Adopt (alongside each component migration):**
- **`argTypes` + controls (currently none):** per component, add prop descriptions + control types + `table.type/defaultValue` so autodocs become interactive (also serves the docs rewrite).
- **`play` behavior tests everywhere:** from 5/25 to all interactive components (Tabs/Collapse/Select/Switch/Checkbox/Modal/Tooltip/Table…), using `storybook/test` `expect/userEvent/within/waitFor` — this is the executor for rule #3.
- **autodocs / MDX:** simple components via `tags:['autodocs']` + `argTypes`; complex ones (Form/Table/Modal/Select) add `Component.mdx` (`<Meta of>`/`<Controls>`/`<Stories>`) with usage + design notes.
- **tag taxonomy:** `ui`/`display`/`parity`/`test` for clear sidebar grouping.
- **Pixel gate stays on Playwright** (Storybook v10 native visual addon is immature); Storybook owns behavior + docs, Playwright owns pixels.

---

## 8. Documentation update & rewrite

| File | Verdict |
|------|---------|
| `AI_USAGE.md` | **Full rewrite:** add Form/Wallet/Radio/Tooltip/Table/Title + Card.pattern/Modal.maskStyle/Icon.item; verify against `src/index.ts`. |
| `skill/SKILL.md` | **Rewrite + split:** inventory → 25; add new-component pixel specs; move Storybook-layout content to a separate guide. |
| `CLAUDE.md` | Add "pixel-exact parity strategy + Radix/Storybook conventions + git 3-tier reuse + daisyUI model" sections (inventory already 25). |
| `README.md` / `DESIGN_PROMPT.md` / `CONTRIBUTING.md` | Light updates (new-component examples + docs map + pixel-gate workflow). |
| `PUBLISHING.md` / `CHANGELOG.md` / community files | No change. |
| **NEW `docs/MIGRATION_METHODOLOGY.md`** | Less→Tailwind rules + git 3-tier reuse + pixel-gate workflow + case studies (this doc is the source). |
| **NEW `docs/KNOWN_DEVIATIONS.md`** | Intentional fork divergences (Card title kept, Japanese fonts removed, Icon 488 items, Modal maskStyle, etc.). |

---

## 9. Automation — Claude Code native

Replace the legacy `codex:`-prefixed scripts with CC-native primitives. Split by **deterministic (thin script) vs judgment (CC-native skill/agent)**.

### 9.1 Delta detection — thin git plumbing (deterministic)
`scripts/check-upstream-sync.mjs` uses `git fetch --depth=1` → only fetches the upstream HEAD → multi-commit deltas are silently under-reported (it reported 1 commit when there were 55). New neutral `scripts/upstream-delta.mjs` (drop `codex:` naming): full `git fetch upstream main` → real `merge-base` (fallback to root) → `rev-list mergeBase..upstream/main` → per-commit `git show --name-only`, bucket by `^src/components/([^/]+)` into a **per-component worklist JSON** (`component, files, commits, commitRange` — feeds §5.0 git reuse), plus `totalUpstreamCommits` for human sanity-check. Keep the old script as a human-readable summary.

### 9.2 Migration runbook — CC-native skill `.claude/skills/port-upstream-component/`
Encodes §5 as an executable runbook. The **judgment** parts (A/B/C reuse classification, hex-collapse safety, what becomes `@utility`) live in the skill's reasoning, not a rigid script. Invoke `/port-upstream-component <Component>`.
- **MUST FAIL if:** `test:migration` fails / not exported in `src/index.ts` / any `.less` import remains / `tsc` errors / `test:visual-check` non-zero.
- **MUST PASS:** play + Playwright + a11y green; publish shape unchanged; root `animal-*` class actually renders.

### 9.3 Driver — CC-native `/loop` or Workflow
`/loop` repeatedly runs the skill across the worklist; or a Workflow batch driver (git worktree per component, separate PRs) for parallelism, topologically ordered (Icon before Button/Input/Checkbox…).

### 9.4 Trigger — CC-native daily `/schedule` routine
A daily cron routine: run `upstream-delta` → if delta, open a branch + draft PR (or invoke the migration loop) → notify; silent when no delta. Fully CC-native, no Codex runtime.

### 9.5 CI / Release (mostly unchanged, already correct)
- `ci.yml` runs `test:migration + test:coverage + test:playwright + test:a11y`, correctly skipping visual.
- **New cross-platform backstop (the judges' top reinforcement):** add `toHaveCSS()` token-value assertions to CI Playwright behavior tests (e.g. button `background-color` === the rgb of `--color-animal-primary`). Since screenshots are local-only/skipped in CI, `toHaveCSS()` is the **only** mechanism that catches token/color-substitution regressions on the Linux runner.
- `release.yml` stays tag-triggered OIDC publish.

---

## 10. Component migration order (risk-first waves)

- **WAVE 0 — Harness + foundation (no component visual change):** `@theme` token migration + `--animal-*` aliases, delta-fix, tighten pixel gate, `visual-auto-generate.spec.ts`, `toHaveCSS()` CI assertions, the skill. **Prove the zero-diff loop works end-to-end on unchanged code (baseline→check green) before touching any component.** Highest leverage.
- **WAVE 1 — pure-style low-coupling + Radix quick wins:** Divider(→Separator), Title, Footer, Wallet, Time. Validates `animal-*` hooks survive a refactor and clears the noisiest test references (Title).
- **WAVE 2 — Token+CVA exemplars:** Button, Card, Input (`#c4b89e` ×53 concentrated here; become the skill's CVA reference).
- **WAVE 3 — Radix state-driven controls:** Switch, Checkbox, Radio, Select, Tabs, Collapse, Tooltip (`data-[state]` + `@custom-variant`; gate that pseudo-element splash stays byte-identical).
- **WAVE 4 — mixed/irreducible-dominant:** Loading (GSAP), Cursor, CodeBlock, Phone, WeddingInvitation, Table, Icon — tokenize only the thin shell.
- **WAVE 5 — Form + Modal last:** Form adds Radix Label + full play/argTypes; Modal does behavior reconciliation PR before styling, per-instance clip-path stays raw.

---

## 11. Risks & mitigations

| Risk | Mitigation |
|---|---|
| Local gate not CI-enforced; devs may forget to run | `toHaveCSS()` CI backstop; committed baselines (PNG change = review flag); PR checklist. |
| Font/AA nondeterminism causing `maxDiffPixels:0` flapping | `disableMotion` enforced (fonts.ready+networkidle+smoothing+DPR=1); pin macOS + Playwright version. |
| `@theme` token rename is consumer-visible | Keep old `--animal-*` names as `var()` aliases for one release + documented deprecation. |
| CVA output not byte-identical (kebab/camel, story-id regex bugs) | Variant values are static `animal-*` literals, no concatenation; cross-check story count vs `index.json`; assert by role/`data-testid`/`toHaveCSS`, not literal className. |
| Near-hex mis-collapse | Collapse only when computed value is byte-identical; near values keep original + comment; gate backstops. |
| v4 keyframe loss (GH#17709); keyframes are ~20 by file, not 9 | Co-locate each `@keyframes` with its `--animate-*`; enumerate by file; verify computed animation. |
| Modal reconciliation is a real behavior change, invisible to screenshots | Standalone behavior PR, play-gated, before styling. |
| delta-fix merge-base misjudged (upstream rebase) | Fallback to root; emit `totalUpstreamCommits` for human sanity-check; handle renames. |

---

## 12. Verification (proving it works end-to-end)

- **A Gate self-test:** on unchanged `main`, `test:visual-baseline` then `test:visual-check` must be all green; then a deliberate 1px change must FAIL and produce a diff PNG.
- **B Delta-fix self-test:** when known to be several commits behind, run `upstream-delta`, confirm `totalUpstreamCommits` matches `git rev-list --count mergeBase..upstream/main` and the worklist covers all changed components.
- **C Per-component:** each PR must pass `test:visual-check` 0-diff (local) + CI green + `tsc` + `pack --dry-run` unchanged shape.
- **D Hook survival:** the migration test asserts each component's root `animal-*` actually renders; the existing ~51 selectors pass unchanged (needing changes = parity regression, blocked).
- **E Cross-platform backstop:** deliberately change a token to a near color; confirm CI `toHaveCSS()` FAILs on Linux.
- **F Consumer smoke:** after completion, `npm pack` and verify ESM + CJS entry (`import { Button }` + `import '…/style'`; stub browser asset extensions for CJS).
- **G Full regression:** after all waves, 177-story `test:visual-check` all green + `build:storybook` succeeds = whole-library zero-diff migration complete.

---

## Appendix — locked decisions

1. Distribution: **stay npm + compiled CSS** (daisyUI model).
2. Consumer contract: **semantic `animal-*` classes + `--animal-*` tokens**; utilities internal only; **no `data-slot`**.
3. Utility-first interpretation: internal authoring (`@theme`/`@utility`/CVA) — not consumer markup.
4. Visual guarantee: **pixel-exact zero-diff** Playwright gate, macOS-local, committed baselines.
5. Reuse: **git 3-tier** (byte-identical / reuse-then-modify / rewrite), reuse-biased.
6. Theming increment: tokenize + optional `data-theme` (daisyUI-style).
7. Automation: **CC-native** — thin git delta script + `port-upstream-component` skill + `/loop`/Workflow + daily `/schedule`.
8. Radix: add Separator (Divider) + Label (Form).
9. Storybook: argTypes + `play` everywhere + autodocs/MDX.
10. Docs: rewrite AI_USAGE + skill; add MIGRATION_METHODOLOGY + KNOWN_DEVIATIONS.
