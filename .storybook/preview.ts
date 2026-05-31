import type { Preview } from '@storybook/react-vite';
import React from 'react';
import { initialize, mswLoader } from 'msw-storybook-addon';
import { INITIAL_VIEWPORTS } from 'storybook/viewport';
import '../src/styles/index.css';
import { mswHandlers } from './msw-handlers';

// mockdate is installed as a dev dep so date-dependent stories can opt in via
// `parameters: { mockDate: '2024-08-15T13:45:00' }` and a beforeEach that calls
// MockDate.set/reset locally. The Time component's Playwright/visual tests
// freeze the clock via page.addInitScript on the browser side, so we
// intentionally do NOT set a global MockDate here — doing so would conflict.

initialize({ onUnhandledRequest: 'bypass' });

const preview: Preview = {
    // Generate an autodocs page for every component story (props table + preview).
    tags: ['autodocs'],
    decorators: [
        (Story) =>
            React.createElement(
                'div',
                { className: 'animal-storybook-scope' },
                React.createElement(Story)
            ),
    ],
    loaders: [mswLoader],
    parameters: {
        controls: {
            matchers: {
                color: /(background|color)$/i,
                date: /Date$/i,
            },
        },
        layout: 'padded',
        msw: { handlers: mswHandlers },
        // Accessibility addon. Runs axe-core on every story and surfaces results
        // in the Storybook "Accessibility" panel + the Vitest component test run.
        //
        // test: 'todo' reports violations without failing the run. The hard a11y
        // gate is the dedicated Playwright + @axe-core/playwright suite
        // (`npm run test:a11y`, executed in CI). This Vitest layer is the
        // fast in-Storybook feedback loop, which is Storybook's recommended way
        // to adopt a11y testing on a project that already has many stories.
        //
        // color-contrast is disabled outright as a known, accepted deviation:
        // the Animal Crossing visual language intentionally uses low-contrast
        // warm tones (cream surfaces, soft brown text, teal accents) that the
        // project is required to preserve (see CLAUDE.md).
        a11y: {
            test: 'todo',
            config: {
                rules: [{ id: 'color-contrast', enabled: false }],
            },
        },
        // Device presets selectable from the toolbar for manual responsive checks.
        viewport: { options: INITIAL_VIEWPORTS },
    },
};

export default preview;
