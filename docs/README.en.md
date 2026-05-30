# Animal Island UI Tailwind

<div align="center">
    <img src="img/readme-home.png" alt="animal-island-ui-tailwind" style="border-radius: 12px; width: 40%; display: block; margin: 0 auto;" />
</div>

<div align="center">
    An Animal Crossing-themed React component library — built with Tailwind CSS v4 + Radix UI
</div>

<br />

<div align="center">
    <a href="https://github.com/lifeodyssey/animal-island-ui"><img src="https://img.shields.io/github/stars/lifeodyssey/animal-island-ui?style=flat-square" alt="Stars"></a>
    <a href="https://github.com/lifeodyssey/animal-island-ui/actions/workflows/ci.yml"><img src="https://img.shields.io/github/actions/workflow/status/lifeodyssey/animal-island-ui/ci.yml?branch=main&style=flat-square" alt="CI"></a>
    <a href="../LICENSE"><img src="https://img.shields.io/badge/license-MIT-blue.svg?style=flat-square" alt="License"></a>
    <a href="https://www.npmjs.com/package/animal-island-ui-tailwind"><img src="https://img.shields.io/npm/dm/animal-island-ui-tailwind.svg?style=flat-square" alt="npm downloads"></a>
</div>

<br />

<p align="center">
    <a href="../README.md">简体中文</a> | English
</p>

## What Is This

A React component library with Animal Crossing visual styling. Cream-colored backgrounds, rounded cards, 3D button shadows, hand-drawn fonts — if you want your interface to feel like a cozy island getaway, this is it.

The visual design is inspired by [guokaigdg/animal-island-ui](https://github.com/guokaigdg/animal-island-ui). The internals have been completely rewritten using Tailwind CSS v4 and Radix UI, and the library is published independently as `animal-island-ui-tailwind` on npm.

## Stack

| Category | Technology |
|----------|-----------|
| Framework | React 18+ + TypeScript |
| Styling | Tailwind CSS v4 + CSS custom properties |
| Interaction | Radix UI primitives |
| Build | Vite library mode (ESM + CJS) |
| Testing | Storybook 10 + Vitest + Playwright |

## Components

22 components included:

| Interactive | Surface / Content | Decorative / Special |
|-------------|-------------------|---------------------|
| Button | Card | Divider |
| Input | Modal | Icon |
| Switch | Collapse | Typewriter |
| Checkbox | CodeBlock | Phone |
| Radio | Footer | Time |
| Select | Loading | Cursor |
| Tabs | Table | Tooltip |
| | WeddingInvitation | |

## Quick Start

### Install

```bash
npm install animal-island-ui-tailwind
```

### Use

```tsx
// Import styles at app entry (once)
import 'animal-island-ui-tailwind/style';

// Use components
import { Button, Card } from 'animal-island-ui-tailwind';

export function App() {
    return (
        <Card color="app-blue">
            <Button type="primary">Start Adventure</Button>
        </Card>
    );
}
```

The style import is **required**. Without it, components render unstyled.

## Package Shape

| Entry | Path |
|-------|------|
| ESM | `dist/es/index.js` |
| CJS | `dist/cjs/index.cjs` |
| Types | `dist/types/index.d.ts` |
| Style | `animal-island-ui-tailwind/style` |
| Style (no fonts) | `animal-island-ui-tailwind/style/core` |
| Assets | `dist/files` |

## Local Development

```bash
git clone https://github.com/lifeodyssey/animal-island-ui.git
cd animal-island-ui
npm install

npm run storybook:test   # Start Storybook (port 6106)
npm run build            # Build library
npm run build:storybook  # Build static Storybook
```

## Testing

```bash
npm test                 # Run all tests
npx tsc --noEmit         # Type check
npm pack --dry-run       # Verify npm package contents
```

`npm test` runs:
- Migration structure and dependency checks
- Storybook/Vitest interaction tests
- Playwright component behavior tests
- Playwright visual regression screenshot comparison

## CI/CD

| Platform | Trigger | Purpose |
|----------|---------|---------|
| GitHub Actions CI | PR / main push | Type check + build + test + a11y scan + package verify |
| GitHub Actions Release | `v*.*.*` tag / manual | CI checks + npm Trusted Publishing |
| Cloudflare Pages | main push / PR | Auto-deploy Storybook to [animalcrossing.zhenjia.dev](https://animalcrossing.zhenjia.dev) |

See [PUBLISHING.md](../PUBLISHING.md) for the full release flow.

## Design Tokens

Components support theming via `--animal-*` CSS custom properties:

```css
:root {
    --animal-primary-color: #19c8b9;   /* Primary color */
    --animal-text-color: #794f27;      /* Text color */
    --animal-bg-color: #f8f8f0;        /* Background color */
}
```

See [CONTRIBUTING.md](../CONTRIBUTING.md#design-tokens) for the full token list.

## Documentation

| Document | Description |
|----------|-------------|
| [AI_USAGE.md](../AI_USAGE.md) | Component API reference for AI coding assistants |
| [DESIGN_PROMPT.md](../DESIGN_PROMPT.md) | Design tokens and AI design tool prompts |
| [skill/SKILL.md](../skill/SKILL.md) | Pixel-level style specification Skill |
| [CONTRIBUTING.md](../CONTRIBUTING.md) | Development and contribution guide |
| [PUBLISHING.md](../PUBLISHING.md) | npm publishing workflow |
| [CHANGELOG.md](../CHANGELOG.md) | Version history |
| [README.md](../README.md) | Chinese README |
| [SECURITY.md](../SECURITY.md) | Security issue reporting |
| [SUPPORT.md](../SUPPORT.md) | Support and issue submission |
| [CODE_OF_CONDUCT.md](../CODE_OF_CONDUCT.md) | Community code of conduct |

## Credits

Visual design inspiration and original component API from [guokaigdg/animal-island-ui](https://github.com/guokaigdg/animal-island-ui). Thank you to the original author for the foundational work.

## Disclaimer

- This project is open source under the MIT License.
- This project is not an official Nintendo product and has no association with Nintendo Co., Ltd.
- The visual style is used only as a learning and research reference.

## License

MIT
