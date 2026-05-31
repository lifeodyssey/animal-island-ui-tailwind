import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';
import { Switch } from './Switch';

const meta = {
    component: Switch,
    tags: ['ai-generated'],
    // A switch with no visible text label needs an accessible name; demonstrate
    // the correct usage so the stories themselves pass axe button-name.
    args: { 'aria-label': '示例开关' },
} satisfies Meta<typeof Switch>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Off: Story = { args: {} };
export const On: Story = { args: { defaultChecked: true } };
export const WithLabels: Story = {
    args: { defaultChecked: true, checkedChildren: '开', unCheckedChildren: '关' },
};

export const Toggle: Story = {
    args: {},
    play: async ({ canvas, userEvent }) => {
        const sw = canvas.getByRole('switch');
        await expect(sw).toHaveAttribute('aria-checked', 'false');
        await userEvent.click(sw);
        await expect(sw).toHaveAttribute('aria-checked', 'true');
    },
};
