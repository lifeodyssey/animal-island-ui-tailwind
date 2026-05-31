# Changelog

All notable changes to `animal-island-ui-tailwind` are documented here.

This project follows a lightweight Keep a Changelog style and uses semantic
versioning for npm releases.

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
