# CLAUDE.md - Animal Island UI Tailwind/Radix Migration

## Goal

Maintain a 1:1 Tailwind CSS v4 + Radix UI implementation of
`animal-island-ui` while preserving the original package distribution shape.

The original Less implementation is used as the reference source for API,
visual parity, assets, colors, spacing, motion, and component behavior. The
migrated implementation is now the `main` branch content.

## Reference Source

- Upstream: `guokaigdg/animal-island-ui` (MIT)
- Fork/repo: `lifeodyssey/animal-island-ui`
- Local original-reference worktree: `../animal-island-ui-reference`
- Reference material:
  - original `src/components/*`
  - original demo pages
  - original package shape from `npm pack --dry-run`
  - jsDelivr package layout

## Stack

- React 19 + TypeScript
- Tailwind CSS v4
- Radix UI primitives for headless interactive behavior
- Storybook 10 with Storybook/Vitest tests
- Playwright behavior tests and visual regression screenshots
- Vite library mode

## Component Inventory

The library currently exposes 18 components:

1. Button
2. Input
3. Switch
4. Checkbox
5. Select
6. Tabs
7. Card
8. Modal
9. Collapse
10. Divider
11. Icon
12. Typewriter
13. Phone
14. Footer
15. Time
16. Cursor
17. CodeBlock
18. Loading

## Implementation Rules

- Runtime CSS belongs in `src/styles/tokens.css`.
- Use stable `animal-*` class names for component styling and testing hooks.
- Use `--animal-*` CSS custom properties for design tokens.
- Keep component class composition static enough for Tailwind v4 scanning.
- Prefer the local `cn` helper for class merging.
- Use Radix UI for Switch, Checkbox, Select, Tabs, Collapse, and Modal behavior.
- Preserve the original visual details: warm brown text, cream surfaces, teal
  accents, pill inputs, 3D button shadows, organic card/modal shapes, and the
  original asset set.
- Do not reintroduce Less modules.

## Publishing Shape

Keep the original single-package distribution model:

- `main`: `dist/cjs/index.cjs`
- `module`: `dist/es/index.js`
- `types`: `dist/types/index.d.ts`
- `exports["."]`: `types`, `import`, and `require`
- `exports["./style"]`: `dist/index.css`
- `exports["./dist/index.css"]`: `dist/index.css`
- Assets emitted to `dist/files`
- npm `files`: `dist`, `README.md`, `AI_USAGE.md`

Vite should continue to build ESM and CJS outputs. Only React, React DOM, and
`react/jsx-runtime` are externalized. Radix UI, `classnames`, and
`tailwind-merge` stay as runtime dependencies to preserve the original
"install and use" consumer experience.

## Test And Release Checks

Use these checks before merging packaging, component, or visual parity changes:

```bash
npm run build
npm pack --dry-run
npm test
npm run build:demo
npm run build:storybook
npx tsc --noEmit
```

For consumer entry smoke tests, verify:

```ts
import { Button } from 'animal-island-ui';
import 'animal-island-ui/style';
```

and CJS:

```js
const { Button } = require('animal-island-ui');
```

When CJS is checked directly in Node, stub browser asset extensions because this
UI package imports CSS, images, SVGs, and fonts.

## Storybook And Visual Parity

- Storybook parity stories live in `stories/`.
- Playwright behavior tests live in `tests/playwright-*.spec.ts`.
- Playwright screenshot tests live in `tests/visual-*.spec.ts`.
- Prefer scoped component-region screenshots over full-page screenshots.
- For stories with interactive `play` functions, add dedicated no-play stories
  for Playwright when needed to avoid test races.
