import { defineConfig, mergeConfig } from 'vitest/config';
import { playwright } from '@vitest/browser-playwright';
import { storybookTest } from '@storybook/addon-vitest/vitest-plugin';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { existsSync } from 'node:fs';
import viteConfig from './vite.config';

// Pre-installed browser on claude.ai cloud runners (not present on GitHub Actions or macOS).
const cloudBrowserPath = '/opt/pw-browsers/chromium';
const cloudExecutablePath = existsSync(cloudBrowserPath) ? cloudBrowserPath : undefined;

const dirname = path.dirname(fileURLToPath(import.meta.url));

export default mergeConfig(
    viteConfig,
    defineConfig({
        test: {
            coverage: {
                provider: 'istanbul',
                include: ['src/**/*.{ts,tsx}'],
                exclude: [
                    'src/**/*.stories.tsx',
                    'src/**/index.ts',
                    'src/**/*.d.ts',
                    'src/components/WeddingInvitation/fonts.ts',
                ],
                reporter: ['text-summary', 'json-summary', 'html', 'lcov'],
            },
            projects: [
                {
                    // Node/jsdom unit tests for logic that can't be asserted in
                    // the browser story runner (e.g. spying gsap tween calls
                    // against the upstream animation spec). Files: *.unit.test.tsx
                    extends: true,
                    test: {
                        name: 'unit',
                        environment: 'jsdom',
                        include: ['src/**/*.unit.test.{ts,tsx}', 'src/components/Form/Form.test.tsx'],
                    },
                },
                {
                    extends: true,
                    plugins: [
                        storybookTest({
                            configDir: path.join(dirname, '.storybook'),
                            storybookScript: 'npm run storybook:test -- --no-open',
                            storybookUrl: 'http://127.0.0.1:6106',
                        }),
                    ],
                    test: {
                        name: 'storybook',
                        browser: {
                            enabled: true,
                            provider: playwright({
                                ...(cloudExecutablePath
                                    ? { launchOptions: { executablePath: cloudExecutablePath } }
                                    : {}),
                            }),
                            headless: true,
                            instances: [{ browser: 'chromium' }],
                        },
                        setupFiles: ['./.storybook/vitest.setup.ts'],
                    },
                },
            ],
        },
    }),
);
