import type { Preview } from '@storybook/react-vite';
import React from 'react';
import { initialize, mswLoader } from 'msw-storybook-addon';
import '../src/styles/index.css';
import { mswHandlers } from './msw-handlers';

// mockdate is installed as a dev dep so date-dependent stories can opt in via
// `parameters: { mockDate: '2024-08-15T13:45:00' }` and a beforeEach that calls
// MockDate.set/reset locally. The Time component's Playwright/visual tests
// freeze the clock via page.addInitScript on the browser side, so we
// intentionally do NOT set a global MockDate here — doing so would conflict.

initialize({ onUnhandledRequest: 'bypass' });

const preview: Preview = {
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
    },
};

export default preview;
