# AGENTS.md

This repository is the Tailwind CSS v4 + Radix UI migration of
`animal-island-ui`.

## Current project state

- `main` is the migrated implementation, not the original Less version.
- The local reference worktree at `../animal-island-ui-reference` is used only
  as a visual/API comparison source for the original library.
- The package is still published as one npm package named `animal-island-ui`.
- Runtime styling lives in `src/styles/tokens.css` and uses stable
  `animal-*` classes plus `--animal-*` CSS custom properties.
- Interactive primitives are backed by Radix UI where appropriate.
- Visual and behavioral parity is covered by Storybook/Vitest and Playwright.

## Development defaults

- Preserve the original library distribution shape:
  - `main`: `dist/cjs/index.cjs`
  - `module`: `dist/es/index.js`
  - `types`: `dist/types/index.d.ts`
  - style entry: `animal-island-ui/style`
  - assets emitted under `dist/files`
- Do not reintroduce Less modules or `variables.less`.
- Do not split the package into per-component subpaths unless explicitly asked.
- Keep React and React DOM as peer dependencies.
- Keep Radix UI, `classnames`, and `tailwind-merge` as runtime dependencies.
- Keep generated build outputs out of git.

## Verification

Run the relevant checks before claiming a packaging or migration change is done:

```bash
npm run build
npm pack --dry-run
npm test
npm run build:demo
npm run build:storybook
npx tsc --noEmit
```

For focused UI parity changes, also run the matching Playwright specs under
`tests/playwright-*.spec.ts` and `tests/visual-*.spec.ts`.
