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
npx skills add lifeodyssey/animal-island-ui-tailwind --skill animal-island-ui-style
```

## Required Checks

Run these commands before publishing:

```bash
npm run build
npm pack --dry-run
npm test
npm run build:storybook
npx tsc --noEmit
```

## npm Trusted Publishing Setup

Log in locally if publishing by hand:

```bash
npm login
npm whoami
```

The npm package is configured to publish through GitHub Actions OIDC trusted
publishing:

- Package: `animal-island-ui-tailwind`
- Publisher: GitHub Actions
- Repository: `lifeodyssey/animal-island-ui-tailwind`
- Workflow file: `release.yml`

The package publishing access is set to "Require two-factor authentication and
disallow tokens". Trusted publishers continue to work with this setting, while
long-lived npm tokens cannot publish the package.

## Manual Publish

```bash
npm publish --access public
```

Local publishing still requires an interactive 2FA method. Provenance is
generated from supported CI providers, not from a normal local shell.

## GitHub Actions Publish

The `Release` workflow publishes after CI verification steps pass. Visual
snapshot regression remains part of local `npm test`; the hosted workflow runs
`npm run test:ci` so Linux runners do not require platform-specific snapshots.
Trigger it
by either:

- pushing a version tag such as `v0.9.0`
- running the workflow manually from GitHub Actions

Before triggering a release, confirm `package.json` has the intended version
and that `CHANGELOG.md` contains the release notes.

The workflow publishes with npm trusted publishing through GitHub Actions OIDC:

```bash
npm publish --access public
```

Do not pass `--provenance` here; npm generates provenance automatically for
trusted publishing.
