import { defineConfig, mergeConfig } from 'vitest/config';
import { playwright } from '@vitest/browser-playwright';
import { storybookTest } from '@storybook/addon-vitest/vitest-plugin';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import viteConfig from './vite.config';

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
                            provider: playwright({}),
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
