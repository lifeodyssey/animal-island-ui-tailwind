import type { StorybookConfig } from '@storybook/react-vite';
import { mergeConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = resolve(__dirname, '..');

const config: StorybookConfig = {
    stories: [
        '../stories/**/*.mdx',
        '../stories/**/*.stories.@(ts|tsx)',
        '../src/**/*.stories.@(ts|tsx)',
    ],
    staticDirs: ['../public'],
    addons: [
        '@storybook/addon-docs',
        '@storybook/addon-vitest',
        '@storybook/addon-a11y',
        '@storybook/addon-mcp',
    ],
    framework: {
        name: '@storybook/react-vite',
        options: {},
    },
    viteFinal: async (baseConfig) =>
        mergeConfig(baseConfig, {
            plugins: [tailwindcss()],
            resolve: {
                alias: {
                    '@': resolve(rootDir, 'src'),
                },
            },
        }),
};

export default config;
