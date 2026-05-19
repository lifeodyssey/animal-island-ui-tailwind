# Animal Island UI - Tailwind/Radix Modernization

<div align="center">
    <img src="img/readme-home.png" alt="animal-island-ui" style="border-radius: 12px; width: 40%; display: block; margin: 0 auto;" />
</div>

<div align="center">
    A Tailwind CSS v4 + Radix UI modernization of Animal Island UI that keeps the original visual language and package shape.
</div>

<br />

<div align="center">
    <a href="https://github.com/lifeodyssey/animal-island-ui"><img src="https://img.shields.io/github/stars/lifeodyssey/animal-island-ui?style=flat-square" alt="Stars"></a>
    <a href="https://github.com/lifeodyssey/animal-island-ui/actions/workflows/ci.yml"><img src="https://img.shields.io/github/actions/workflow/status/lifeodyssey/animal-island-ui/ci.yml?branch=main&style=flat-square" alt="CI"></a>
    <a href="../LICENSE"><img src="https://img.shields.io/badge/license-MIT-blue.svg?style=flat-square" alt="License"></a>
    <a href="https://www.npmjs.com/package/animal-island-ui-tailwind"><img src="https://img.shields.io/npm/dm/animal-island-ui-tailwind.svg?style=flat-square" alt="npm downloads"></a>
    <a href="https://github.com/guokaigdg/animal-island-ui"><img src="https://img.shields.io/badge/upstream-guokaigdg%2Fanimal--island--ui-19c8b9?style=flat-square" alt="Upstream"></a>
</div>

<br />

<p align="center">
    <a href="../README.md">简体中文</a> | English
</p>

## Project Positioning

This repository is a modernization fork of [`guokaigdg/animal-island-ui`](https://github.com/guokaigdg/animal-island-ui), published under the new npm package name `animal-island-ui-tailwind`. The goal is not to redesign the UI. The goal is to preserve the original component API, visual appearance, static assets, and npm distribution shape while migrating the internals to Tailwind CSS v4 + Radix UI and adding a reproducible Storybook / Playwright verification workflow.

This is not an official upstream release. We opened an upstream RFC issue, [`guokaigdg/animal-island-ui#8`](https://github.com/guokaigdg/animal-island-ui/issues/8), to ask whether the maintainer is interested in this direction and how future PRs should be split.

## Relationship To The Original Library

- Original implementation: React + TypeScript + Less CSS Modules.
- Current implementation: React 19 + TypeScript + Tailwind CSS v4 + Radix UI primitives.
- Visual goal: preserve the Animal Island style as closely as possible, including color, radius, shadow, motion, fonts, and assets.
- Package goal: keep the original single-package npm distribution model instead of introducing per-component packages or subpath builds.
- Contribution strategy: maintain this as a fork first; if upstream is interested, split the work into tests, docs, and implementation PRs.

## Stack

- React 19
- TypeScript
- Tailwind CSS v4
- Radix UI primitives
- Vite library mode
- Storybook 10
- Storybook/Vitest interaction tests
- Playwright behavior tests
- Playwright visual regression screenshots

## Components

The library currently covers 18 components:

| Interactive | Surface / Content | Decorative / Special |
|---|---|---|
| Button | Card | Divider |
| Input | Modal | Icon |
| Switch | Collapse | Typewriter |
| Checkbox | CodeBlock | Phone |
| Select | Footer | Time |
| Tabs | Loading | Cursor |

## Installation And Usage

If this version has been published to npm, install it with the new package name:

```bash
npm install animal-island-ui-tailwind
```

The style entry is required. Without it, components will not include styles, tokens, or fonts:

```tsx
import { Button, Card } from 'animal-island-ui-tailwind';
import 'animal-island-ui-tailwind/style';

export function App() {
    return (
        <Card color="app-blue">
            <Button type="primary">Start Adventure</Button>
        </Card>
    );
}
```

To verify the fork before publishing, build and pack it locally:

```bash
npm install
npm run build
npm pack
```

## Package Shape

This fork publishes under a new package name while intentionally preserving the
original `animal-island-ui` distribution model:

- Single npm package: `animal-island-ui-tailwind`
- ESM entry: `dist/es/index.js`
- CJS entry: `dist/cjs/index.cjs`
- Type declarations: `dist/types/index.d.ts`
- Style entry: `animal-island-ui-tailwind/style`
- Compatibility style entry: `animal-island-ui-tailwind/dist/index.css`
- Static assets: `dist/files`

The `package.json` publish whitelist includes only:

- `dist`
- `README.md`
- `AI_USAGE.md`
- `DESIGN_PROMPT.md`
- `skill`

Storybook, Playwright tests, screenshot baselines, demo build output, and local development files are not included in the npm tarball.

`skill/SKILL.md` is kept in both the repository and the npm tarball. Per the `skills` CLI documentation, Skills are installed from a GitHub, Git URL, or local source; after the repository is pushed, install it with:

```bash
npx skills add lifeodyssey/animal-island-ui --skill animal-island-ui-style
```

## CI/CD And Release

The repository includes two GitHub Actions workflows:

- `CI`: runs type checking, the library build, `npm run test:ci`, demo build,
  Storybook build, and `npm pack --dry-run` on pull requests and `main` pushes.
  Visual screenshot regression stays in local `npm test` so Linux runners do not
  block releases when platform snapshots are absent.
- `Release`: runs the same verification when a `v*.*.*` tag is pushed or the
  workflow is triggered manually. The first publish can use an `NPM_TOKEN` with
  bypass 2FA, and later releases can use npm trusted publishing / GitHub OIDC
  without a long-lived token.

Before the first automated release, add an npm granular token as the GitHub
repository secret `NPM_TOKEN`. After the package exists, configure npm trusted
publishing and remove the long-lived token if desired. See [`PUBLISHING.md`](../PUBLISHING.md) for the publishing flow.

## Local Development

```bash
npm install

# Demo
npm run dev

# Storybook verification server; port 6106 avoids the default 6006
npm run storybook:test

# Library build
npm run build

# Demo build
npm run build:demo

# Storybook static build
npm run build:storybook
```

## Verification

Full verification:

```bash
npm test
npx tsc --noEmit
npm pack --dry-run
```

`npm test` runs:

- `tests/migration.test.mjs`: migration structure and dependency invariants.
- Storybook/Vitest: stories and play-function interaction tests.
- Playwright behavior tests: DOM, state, and interaction behavior.
- Playwright visual regression: scoped pixel-to-pixel screenshot comparisons.

Visual tests prefer stable component-region screenshots over full-page screenshots. For stories with auto-running `play` functions, Playwright uses dedicated no-play stories where needed to avoid state races.

## Upstream Contribution

This work is a modernization proposal, not a small CSS swap. To contribute it upstream, use an RFC / proposal flow:

1. Ask whether the maintainer is interested in the Tailwind/Radix direction.
2. If yes, split out the Storybook / Playwright parity test infrastructure first.
3. Then split out package/docs cleanup.
4. Finally submit the Tailwind/Radix rewrite as a `next`, `v1`, or experimental-branch PR.

Current RFC: [`guokaigdg/animal-island-ui#8`](https://github.com/guokaigdg/animal-island-ui/issues/8).

## Documentation

| Document | Purpose |
|---|---|
| [`AI_USAGE.md`](../AI_USAGE.md) | API handbook for AI coding assistants, including props, types, defaults, and strict usage rules. |
| [`DESIGN_PROMPT.md`](../DESIGN_PROMPT.md) | Visual reproduction prompt and design token reference. |
| [`skill/SKILL.md`](../skill/SKILL.md) | Pixel-level style specification Skill for component CSS, tokens, demo layout, and new-component checklist. |
| [`CONTRIBUTING.md`](../CONTRIBUTING.md) | Development and contribution guide for this fork. |
| [`PUBLISHING.md`](../PUBLISHING.md) | npm publishing steps, GitHub Actions release flow, and release prerequisites. |
| [`CHANGELOG.md`](../CHANGELOG.md) | Version history. |
| [`SECURITY.md`](../SECURITY.md) | Security reporting policy. |
| [`SUPPORT.md`](../SUPPORT.md) | Support and issue guidance. |
| [`CODE_OF_CONDUCT.md`](../CODE_OF_CONDUCT.md) | Community collaboration expectations. |
| [`README.md`](../README.md) | Chinese README. |

## Copyright And Disclaimer

- This project inherits the original MIT License.
- This project is not an official Nintendo product and has no association, authorization, or partnership with Nintendo Co., Ltd.
- The style is used only as a learning and research reference. This repository does not include official Nintendo art, code, or assets.
- Credit for the original project and upstream maintenance belongs to [`guokaigdg/animal-island-ui`](https://github.com/guokaigdg/animal-island-ui).

## License

MIT
