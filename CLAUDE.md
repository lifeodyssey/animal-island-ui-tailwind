# CLAUDE.md - Animal Island UI Tailwind

## Goal

Maintain and evolve `animal-island-ui-tailwind`, a Tailwind CSS v4 + Radix UI
component library with the Animal Island visual language. This is an
independently maintained project, originally forked from
`guokaigdg/animal-island-ui` (MIT) and now published under its own npm
package name.

The original Less implementation served as the reference source during the
initial migration. The migrated implementation is now the `main` branch
content and the single source of truth.

## Repository

- Package: `animal-island-ui-tailwind` on npm
- Repo: `lifeodyssey/animal-island-ui` on GitHub
- Storybook: `animalcrossing.zhenjia.dev` (Cloudflare Pages)
- Origin: forked from `guokaigdg/animal-island-ui` (MIT), now independent

## Stack

- React 18+ (peer dep >=18.0.0)
- TypeScript
- Tailwind CSS v4
- Radix UI primitives (peerDependencies, optional)
- Storybook 10 with Storybook/Vitest tests
- Playwright behavior tests and visual regression screenshots
- Vite library mode with preserveModules (tree-shakeable ESM)

## Component Inventory

The library exposes 22 components:

1. Button
2. Input
3. Switch
4. Checkbox
5. Radio
6. Select
7. Tabs
8. Card
9. Modal
10. Collapse
11. Divider
12. Icon
13. Typewriter
14. Phone
15. Footer
16. Time
17. Cursor
18. CodeBlock
19. Loading
20. Table
21. Tooltip
22. WeddingInvitation

## Implementation Rules

- CSS is split into modular files under `src/styles/` (theme, tokens, base,
  components, keyframes), assembled by `src/styles/index.css`.
- Use stable `animal-*` class names for component styling and testing hooks.
- Use `--animal-*` CSS custom properties for design tokens.
- Keep component class composition static enough for Tailwind v4 scanning.
- Prefer the local `cn` helper (`clsx` + `tailwind-merge`) for class merging.
- Use Radix UI for Switch, Checkbox, Select, Tabs, Collapse, and Modal behavior.
- Preserve the original visual details: warm brown text, cream surfaces, teal
  accents, pill inputs, 3D button shadows, organic card/modal shapes, and the
  original asset set.
- Do not reintroduce Less modules.

## Publishing Shape

Keep the single-package distribution model:

- npm package name: `animal-island-ui-tailwind`
- `main`: `dist/cjs/index.cjs`
- `module`: `dist/es/index.js`
- `types`: `dist/types/index.d.ts`
- `exports["."]`: `types`, `import`, and `require`
- `exports["./style"]`: `dist/index.css` (full, with fonts)
- `exports["./style/core"]`: `dist/core.css` (no fonts)
- `exports["./style/fonts"]`: `dist/fonts.css` (fonts only)
- `exports["./dist/index.css"]`: `dist/index.css`
- Assets emitted to `dist/files`
- npm `files`: `dist`, `README.md`, `AI_USAGE.md`, `DESIGN_PROMPT.md`, `skill`

Radix UI packages are peerDependencies (optional). `clsx` and `tailwind-merge`
are runtime dependencies. Only React, React DOM, and `react/jsx-runtime` plus
all `@radix-ui/*` and `gsap` are externalized from the bundle.

## Test And Release Checks

Use these checks before merging packaging, component, or visual parity changes:

```bash
npm run build
npm pack --dry-run
npm test
npm run build:storybook
npx tsc --noEmit
```

For consumer entry smoke tests, verify:

```ts
import { Button } from 'animal-island-ui-tailwind';
import 'animal-island-ui-tailwind/style';
```

and CJS:

```js
const { Button } = require('animal-island-ui-tailwind');
```

When CJS is checked directly in Node, stub browser asset extensions because this
UI package imports CSS, images, SVGs, and fonts.

## Testing Strategy

| Test | Where | Command |
|------|-------|---------|
| Migration structure | Local + CI | `npm run test:migration` |
| Storybook/Vitest interaction | Local + CI | `npm run test-storybook` |
| Playwright behavior | Local + CI | `npm run test:playwright` |
| Visual regression screenshots | **Local only** | `npm run test:visual` |
| Accessibility (axe-core) | Local + CI | `npm run test:a11y` |

Visual regression runs only locally because macOS and Linux render fonts
differently. The local baselines (macOS) are the source of truth, confirmed
by visual inspection against upstream.

## Release Workflow

To publish a new version:

```bash
npm version patch    # or minor / major
git push --follow-tags
```

This triggers the Release workflow which automatically:
1. Runs all CI tests
2. Publishes to npm (Trusted Publishing / OIDC)
3. Creates a GitHub Release with auto-generated notes

Do NOT manually create GitHub Releases or run `npm publish`.

## Storybook And Visual Parity

- Storybook parity stories live in `stories/`.
- Playwright behavior tests live in `tests/playwright-*.spec.ts`.
- Playwright screenshot tests live in `tests/visual-*.spec.ts`.
- Prefer scoped component-region screenshots over full-page screenshots.
- For stories with interactive `play` functions, add dedicated no-play stories
  for Playwright when needed to avoid test races.
- Visual baselines must match upstream behavior — do not "fix" upstream visual
  quirks without explicit approval. Document deviations as known differences.

## Skills Reference

When working on this project, use these installed skills for best-practice
guidance:

- `/tailwind-design-system` — Tailwind CSS v4 `@theme`, design tokens, utility
  patterns, responsive design system conventions.
- `/radix-ui-design-system` — Radix UI primitives, headless component patterns,
  accessibility, compound components, theming strategies.
- `/storybook-story-writing` — CSF3 story format, play functions, interaction
  testing, story organization.

## Upstream Sync Workflow

When porting new components from `guokaigdg/animal-island-ui`:

1. Run `npm run codex:upstream-check` to detect new upstream commits.
2. Create branch `codex/upstream-sync-<hash>`.
3. Write tests first (Storybook parity story + Playwright behavior + visual).
   Tests should FAIL at this stage.
4. Implement the component using Tailwind CSS v4 + Radix UI, matching upstream
   visual and behavioral output.
5. Verify: `npm run build && npm test && npx tsc --noEmit`.
6. Create draft PR with upstream commit range in the description.
