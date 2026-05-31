// Storybook component tests run in browser mode against the dev server defined
// in vitest.config.ts (storybookScript + storybookUrl, port 6106). In this mode
// the project preview and addon preview annotations must be applied explicitly
// here via setProjectAnnotations — this is exactly the setup shown in
// Storybook's own accessibility-testing docs.
//
// Storybook prints an info hinting that addon-vitest can auto-apply these since
// 10.3 and that this call is "safe to remove". That auto-provisioning does NOT
// cover our storybookScript-based browser setup: removing this call also drops
// the React renderer annotations (setProjectAnnotations is imported from
// @storybook/react-vite and carries renderToCanvas), so every story then fails
// with "context.renderToCanvas is not a function". Keep it.
import { beforeAll } from 'vitest';
import { setProjectAnnotations } from '@storybook/react-vite';
import * as a11yAddonAnnotations from '@storybook/addon-a11y/preview';
import * as previewAnnotations from './preview';

const annotations = setProjectAnnotations([a11yAddonAnnotations, previewAnnotations]);

beforeAll(annotations.beforeAll);
