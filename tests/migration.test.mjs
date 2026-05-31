import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join, relative } from 'node:path';
import test from 'node:test';
import assert from 'node:assert/strict';

const root = new URL('..', import.meta.url).pathname;

const read = (path) => readFileSync(join(root, path), 'utf8');

const walk = (dir, predicate, acc = []) => {
  for (const entry of readdirSync(join(root, dir))) {
    const full = join(root, dir, entry);
    const rel = relative(root, full);
    if (entry === 'node_modules' || entry === 'dist' || entry === 'demo-dist') continue;
    if (statSync(full).isDirectory()) {
      walk(rel, predicate, acc);
    } else if (predicate(rel)) {
      acc.push(rel);
    }
  }
  return acc;
};

test('migration dependencies include Tailwind, Radix, Storybook, Playwright, and React 19', () => {
  const pkg = JSON.parse(read('package.json'));
  const deps = { ...pkg.peerDependencies, ...pkg.dependencies, ...pkg.devDependencies };

  assert.equal(pkg.name, 'animal-island-ui-tailwind');
  assert.equal(pkg.exports['./style'], './dist/index.css');
  assert.equal(pkg.exports['./dist/index.css'], './dist/index.css');
  assert.equal(pkg.peerDependencies.react, '>=18.0.0');
  assert.equal(pkg.peerDependencies['react-dom'], '>=18.0.0');
  assert.match(pkg.devDependencies.react, /^\^19\./);
  assert.match(pkg.devDependencies['react-dom'], /^\^19\./);

  for (const name of [
    'tailwindcss',
    '@tailwindcss/vite',
    '@storybook/react-vite',
    '@playwright/test',
    '@radix-ui/react-accordion',
    '@radix-ui/react-checkbox',
    '@radix-ui/react-dialog',
    '@radix-ui/react-select',
    '@radix-ui/react-switch',
    '@radix-ui/react-tabs',
  ]) {
    assert.ok(deps[name], `${name} should be declared`);
  }
});

test('runtime style entry is Tailwind CSS, not Less modules', () => {
  assert.ok(existsSync(join(root, 'src/styles/index.css')), 'index.css should exist');
  assert.ok(existsSync(join(root, 'src/styles/tokens.css')), 'tokens.css should exist');
  assert.match(read('src/index.ts'), /import ['"]\.\/styles\/index\.css['"]/);
  assert.doesNotMatch(read('src/index.ts'), /\.less['"]/);

  const runtimeFiles = walk('src', (rel) => /\.(ts|tsx)$/.test(rel));
  const lessImports = runtimeFiles.flatMap((rel) => {
    const matches = read(rel).match(/from ['"][^'"]+\.module\.less['"]|import ['"][^'"]+\.less['"]/g);
    return matches ? matches.map((match) => `${rel}: ${match}`) : [];
  });
  assert.deepEqual(lessImports, []);
});

test('Radix primitives back the headless interactive components', () => {
  const expectedImports = {
    'src/components/Modal/Modal.tsx': '@radix-ui/react-dialog',
    'src/components/Switch/Switch.tsx': '@radix-ui/react-switch',
    'src/components/Checkbox/Checkbox.tsx': '@radix-ui/react-checkbox',
    'src/components/Select/Select.tsx': '@radix-ui/react-select',
    'src/components/Tabs/Tabs.tsx': '@radix-ui/react-tabs',
    'src/components/Collapse/Collapse.tsx': '@radix-ui/react-accordion',
  };

  for (const [path, importName] of Object.entries(expectedImports)) {
    assert.match(read(path), new RegExp(importName.replaceAll('/', '\\/')));
  }
});

test('Tailwind token file preserves the animal-island design variables', () => {
  const css = read('src/styles/tokens.css');
  for (const token of [
    '--animal-primary-color: #19c8b9',
    '--animal-primary-color-hover: #3dd4c6',
    '--animal-text-color: #794f27',
    '--animal-text-color-body: #725d42',
    '--animal-bg-color: #f8f8f0',
    '--animal-bg-color-content: rgb(247, 243, 223)',
    '--animal-focus-yellow: #ffcc00',
    '--animal-shadow-press: 0 5px 0 0 #bdaea0',
    '--animal-radius-pill: 50px',
    '--animal-border-radius-pill: var(--animal-radius-pill)',
    '--animal-motion-ease: cubic-bezier(0.4, 0, 0.2, 1)',
  ]) {
    assert.match(css, new RegExp(token.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
  }

  assert.doesNotMatch(css, /\n\s*body\s*\{/);
  assert.doesNotMatch(css, /\n\s*p\s*\{/);
});

test('WeddingInvitation public exports are wired when upstream sync adds the component', () => {
  assert.ok(
    existsSync(join(root, 'src/components/WeddingInvitation/WeddingInvitation.tsx')),
    'WeddingInvitation component source should exist',
  );
  assert.match(
    read('src/index.ts'),
    /export \{ WeddingInvitation, WeddingInvitationExportButton \} from '\.\/components\/WeddingInvitation';/,
  );
});
