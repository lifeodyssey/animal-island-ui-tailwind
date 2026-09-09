# Changelog

All notable changes to `animal-island-ui-tailwind` are documented here.

This project follows a lightweight Keep a Changelog style and uses semantic
versioning for npm releases.

## 1.10.0 - 2026-09-09

- Add the upstream Background component with dots and sprinkles patterns.
- Add `Cursor type="raindrop"`, preserving the redrawn default glove and
  semantic cursors in scoped mode (`forceAll={false}`).
- Sync upstream through `42fee8ac` while retaining the approved replacement artwork.

## 1.9.0 - 2026-09-09

This release aligns the version number with upstream `guokaigdg/animal-island-ui`
1.9.0 and completes this fork's artwork replacement pass following upstream's
DMCA remediation. Existing components remain available, including Phone, Wallet,
WeddingInvitation, Time and Loading. This is not a full port of subsequent
upstream features such as Background or the raindrop cursor.

### Breaking changes and migration

- Removed the 488-image game item catalog, `Icon.item`, `ITEM_LIST` and
  `ITEM_COUNT`. Supply your own licensed image with `<Icon src={url} />`, or
  use a built-in named icon or a Lucide component with `<Icon icon={Heart} />`.
- Rename `icon-miles` to `icon-travel` and `icon-critterpedia` to
  `icon-encyclopedia`. `icon-variant` now uses the passport illustration.
- Icon rendering uses a mix of raster artwork and SVG utility glyphs. Its ref
  is `HTMLElement`; consumers must not assume an `<img>` node. `color` and
  `strokeWidth` affect vector icons only. Use `.animal-icon` for shared styling.
- The minor version number is intentionally aligned with upstream despite
  these API removals; review the migration notes before upgrading from 1.8.0.

### Artwork and components

- Replaced Footer sea/tree scenes, Wallet pouch, WeddingInvitation couple,
  Divider waves and triangle strips, Phone app icons, and named Icon artwork.
- Redrew BackTop's helper, Tabs' leaf, the pointer cursor and the glove used in
  Select and Pagination menus. Utility glyphs use `lucide-react`.
- Replaced Loading's old SVG island scene with new palm/island and fish images,
  CSS floating/water/jump animations, reduced-motion support and a labeled
  loading status. The existing close/reopen behavior is preserved.
- Retained warm colors, rounded proportions, transparency and the approved
  visual compositions. Generated-art prompts and processing records are in
  `docs/artwork`. Reference-based generation is not a claim of legal clearance.

### Fixes and verification

- WeddingInvitation PNG export now includes the styled, embedded artwork.
- Select reserves space for the hover glove inside its scrolling viewport and
  at the browser edge, preventing clipping.
- Verified transparent artwork, responsive sizing, actual image decoding,
  keyboard interactions and Loading close/reopen behavior; refreshed local
  visual baselines for the approved designs.
- Release automation now includes unit tests and publishes this detailed
  changelog section as the GitHub Release body.

The current package assets have been replaced or removed; existing repository
history has not been rewritten.

## 1.8.0 - 2026-09-06

Syncs upstream `guokaigdg/animal-island-ui` 1.8.0 (commits `1f1f9b78..8ec5951d`).

### Added

- `Pagination` component: page navigation with prev/next and page-number items,
  size changer (`showSizeChanger` / `pageSizeOptions` / `onShowSizeChange`),
  quick jumper (`showQuickJumper`), `showTotal`, `disabled`, and `orange`/`teal`
  variants. Exported with `PaginationProps` and `PaginationVariant` types.
- `Table` gains a `pagination` prop for client-side pagination backed by
  `Pagination` (pass `false` or an omitted-total `PaginationProps` object).

### Fixed

- `Select` hover cursor pseudo-element positioning (`left: -12px` → `-22px`).
- `DatePicker` effect now responds to `picker` prop changes (dependency array).

### Changed

- `Table` row hover: dropped the `scale(1.01)` / `clip-path` transition in favor
  of rounded corners, and softened the hover gradient opacity (0.62 → 0.5).

## 1.1.0 - 2026-06-21

Syncs the upstream feature set up to `guokaigdg/animal-island-ui` 1.0.16,
adapted to this Tailwind v4 + Radix fork.

### Added

- `Form` component: `Form` / `Form.Item` / `Form.useForm` with field store,
  validation rules (required/type/min/max/len/pattern/whitespace/custom-async),
  and horizontal/vertical/inline layouts.
- `Wallet` component: bell-pouch pill with thousand-separator formatting and
  small/medium/large size presets.
- `Icon` now accepts an `item` prop backed by the full 488-glyph item sheet;
  `name` is now optional. New `ITEM_LIST` / `ITEM_COUNT` exports.
- `Card` gains a `pattern` prop (dotted texture, orthogonal to `color`) and an
  exported `CardPattern` type.
- `Modal` gains a `maskStyle` prop and a `--animal-mask-bg` token.
- `Radio` and `Checkbox` now play a check "splash" animation.
- `Switch` exposes `aria-busy` while loading.

### Changed

- Zen Maru Gothic is no longer bundled in the default style / global font stack
  (follows upstream). It remains available to the `WeddingInvitation` loader.

## 0.8.2 - 2026-05-20

### Fixed

- GitHub Actions CI and release workflows now use Node 24 so the bundled npm
  CLI supports npm Trusted Publishing through OIDC.
- GitHub Actions CI and release workflows now explicitly upgrade to npm 11.14.1
  before installing dependencies or publishing.
- Package lock metadata now matches the intended npm release version.

## 0.8.1 - 2026-05-19

### Added

- Table component with striped rows, loading overlay, empty state, and scroll support.
- Automated accessibility testing with @axe-core/playwright (WCAG 2.0 AA).
- Select now supports uncontrolled mode via `defaultValue` prop.
- Storybook deployed to Cloudflare Pages at animalcrossing.zhenjia.dev.
- Optional font loading: `style/core` (no fonts) and `style/fonts` (fonts only).
- Per-component ESM output for tree-shaking (`preserveModules`).

### Changed

- Radix UI packages moved to peerDependencies (optional) — eliminates duplicate
  bundling when consumers also use Radix.
- React peer dependency widened from >=19 to >=18.
- CJS bundle reduced from 248KB to 64KB by externalizing dependencies.
- Loading component refactored from inline script injection to proper gsap
  ES module import with animation cleanup.
- Storybook story imports updated to `@storybook/react` (from `@storybook/react-vite`).
- CSS tokens.css split into modular files for contributor DX.
- classnames (12KB) replaced with clsx (0.7KB).
- Documentation rewritten for independent project status.

### Fixed

- Select: removed aria-label override that masked selected value for screen readers.
- Select: added ItemIndicator for visual selected-item feedback.
- Select: replaced index-based value mapping with key-based mapping.
- Tabs: separated controlled/uncontrolled code paths to avoid Radix anti-pattern.
- Tabs: added aria-label support on Tabs.List.
- Modal: Dialog.Description no longer wraps entire body content.
- Modal: Cursor wrapper moved outside Dialog.Portal to preserve focus trap.
- Collapse: removed forceMount, switched to keyframe animation for proper DOM cleanup.
- Typewriter: onDone stale closure fixed via useRef.
- CodeBlock: added useMemo to highlightJSX for render performance.
- Hardcoded hex values in CSS replaced with design token references.
- Storybook play functions: added waitFor guards, fixed unsafe casts, added
  no-play stable stories for Playwright isolation.

## 0.8.0 - 2026-05-19

### Added

- First npm-ready Tailwind CSS v4 + Radix UI modernization release under the
  `animal-island-ui-tailwind` package name.
- GitHub Actions CI for type checking, library build, tests, demo build,
  Storybook build, and npm tarball verification.
- GitHub Actions release workflow for provenance-enabled npm publishing.
- Repository documentation for publishing, security, support, and contribution
  workflows.

### Changed

- Package metadata now points at the maintained fork repository while preserving
  the original public distribution shape: ESM, CJS, declarations, one CSS entry,
  and extracted assets.
