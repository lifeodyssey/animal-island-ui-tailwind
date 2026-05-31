import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';
import { CodeBlock } from './CodeBlock';

const meta = {
    component: CodeBlock,
    tags: ['ai-generated'],
} satisfies Meta<typeof CodeBlock>;

export default meta;
type Story = StoryObj<typeof meta>;

const sample = `const greet = (name) => {\n  return 'Hi ' + name;\n};`;

export const Basic: Story = { args: { code: sample } };

export const StyleOverride: Story = {
    args: {
        code: sample,
        style: { borderRadius: 5, backgroundColor: 'rgb(36, 44, 70)' },
    },
    play: async ({ canvasElement }) => {
        // Upstream applies the user style on top of the base (CodeBlock.tsx:96
        // `style={{ ...codeBlockStyle, ...style }}`). Our base lives in the
        // .animal-code-block class and the style prop overrides it inline.
        // Either way the contract is: a passed style must win on the <pre>.
        const pre = canvasElement.querySelector('pre.animal-code-block') as HTMLElement | null;
        await expect(pre).not.toBeNull();
        const cs = getComputedStyle(pre as HTMLElement);
        await expect(cs.borderRadius).toBe('5px');
        await expect(cs.backgroundColor).toBe('rgb(36, 44, 70)');
    },
};
