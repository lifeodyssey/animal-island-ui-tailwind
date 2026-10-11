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

The npm package is configured to publish through GitHub Actions OIDC trusted
publishing:

- Package: `animal-island-ui-tailwind`
- Publisher: GitHub Actions
- Repository: `lifeodyssey/animal-island-ui-tailwind`
- Workflow file: `release.yml`

The package publishing access is set to "Require two-factor authentication and
disallow tokens". Trusted publishers continue to work with this setting, while
long-lived npm tokens cannot publish the package.

## GitHub Actions Release

Publish through the `Release` workflow in `.github/workflows/release.yml`.
Do not run `npm publish` locally or manually create a GitHub Release.

1. Merge the approved changes and run the required checks above.
2. Update `package.json` and `package-lock.json` to the intended version, and add
   a nonempty `## VERSION - YYYY-MM-DD` section to `CHANGELOG.md`. Update README
   release guidance at the same time.
3. Commit the release files and create an annotated `vVERSION` tag on that commit.
   `scripts/release-notes.mjs` extracts the matching changelog section and verifies
   that the tag version matches `package.json`.
4. Push the release commit to `main` and the new version tag. Pushing a tag matching
   `v*.*.*` triggers the workflow; it has no manual trigger.

The workflow runs type checking, builds, migration and unit tests, Storybook tests,
Playwright behavior tests, accessibility checks, and a package dry run. Visual
regression remains part of local `npm test` because its baselines are macOS-specific.
The separate CI workflow also audits dependencies.

After verification, the workflow publishes through npm trusted publishing with
GitHub Actions OIDC, then creates a GitHub Release from the matching changelog
section. npm generates provenance automatically for trusted publishing.

Confirm the workflow succeeds, npm serves the intended version with the `latest`
dist-tag, and the GitHub Release points to the expected tag before reporting the
release as complete.
