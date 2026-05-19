# Publishing

`animal-island-ui-tailwind` is published as a single public npm package.

## Package Name

- npm package: `animal-island-ui-tailwind`
- JavaScript entry: `animal-island-ui-tailwind`
- Style entry: `animal-island-ui-tailwind/style`
- Compatibility style entry: `animal-island-ui-tailwind/dist/index.css`

The package intentionally keeps the original Animal Island UI distribution
shape: ESM, CJS, TypeScript declarations, one CSS bundle, and assets under
`dist/files`. It also ships the project Skill in the tarball, but `npx skills`
installs Skills from repository, Git URL, or local sources rather than publishing
to a separate registry. After pushing this repository, agent users can install
the visual-language guide with:

```bash
npx skills add lifeodyssey/animal-island-ui --skill animal-island-ui-style
```

## Required Checks

Run these commands before publishing:

```bash
npm run build
npm pack --dry-run
npm test
npm run build:demo
npm run build:storybook
npx tsc --noEmit
```

## First-Time npm Setup

Log in locally if publishing by hand:

```bash
npm login
npm whoami
```

All new npm packages require either 2FA or a granular access token with
`Bypass 2FA` enabled. For the first CI publish of this new package, create a
granular npm token with:

- read and write access
- access to all packages, or at least permission to create/publish this package
- `Bypass 2FA` enabled
- a short expiration date

Add it to the GitHub repository as the secret `NPM_TOKEN`.

## Manual Publish

```bash
npm publish --access public
```

Local publishing still requires an interactive 2FA method or a bypass-2FA
token. Provenance is generated from supported CI providers, not from a normal
local shell.

## GitHub Actions Publish

The `Release` workflow publishes after CI verification steps pass. Visual
snapshot regression remains part of local `npm test`; the hosted workflow runs
`npm run test:ci` so Linux runners do not require platform-specific snapshots.
Trigger it
by either:

- pushing a version tag such as `v0.8.0`
- running the workflow manually from GitHub Actions

Before triggering a release, confirm `package.json` has the intended version
and that `CHANGELOG.md` contains the release notes.

The workflow supports two npm authentication modes:

- If `NPM_TOKEN` is present, it publishes with `npm publish --access public --provenance`.
- If `NPM_TOKEN` is absent, it attempts npm trusted publishing through GitHub
  Actions OIDC and runs `npm publish --access public`.

For trusted publishing after the first package version exists, configure npm:

1. Open the `animal-island-ui-tailwind` package on npmjs.com.
2. Go to Settings -> Trusted publishing.
3. Select GitHub Actions.
4. Set Organization or user to `lifeodyssey`.
5. Set Repository to `animal-island-ui`.
6. Set Workflow filename to `release.yml`.
7. Save, then remove the `NPM_TOKEN` secret if you want token-free publishing.
