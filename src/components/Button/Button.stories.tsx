import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';
import { Button } from './Button';

const meta = {
    component: Button,
    tags: ['ai-generated'],
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = { args: { children: 'Primary action', type: 'primary' } };
export const Default: Story = { args: { children: 'Default', type: 'default' } };
export const Dashed: Story = { args: { children: 'Dashed', type: 'dashed' } };

export const Loading: Story = {
    args: { children: 'Saving…', loading: true },
    play: async ({ canvas }) => {
        const btn = canvas.getByRole('button', { name: /saving/i });
        await expect(btn).toHaveAttribute('aria-busy', 'true');
        await expect(btn).toHaveAttribute('aria-disabled', 'true');
    },
};

export const CssCheck: Story = {
    args: { children: 'CSS Check', type: 'primary' },
    play: async ({ canvas }) => {
        const button = canvas.getByRole('button', { name: /css check/i });
        await expect(getComputedStyle(button).backgroundColor).toBe('rgb(248, 248, 240)');
    },
};
