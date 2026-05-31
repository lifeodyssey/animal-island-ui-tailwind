import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';
import { Checkbox } from './Checkbox';
import type { CheckboxOption } from './Checkbox';

const islands: CheckboxOption[] = [
    { label: '🏖️ 海滩', value: 'beach' },
    { label: '🌳 森林', value: 'forest' },
    { label: '🌸 花园', value: 'garden' },
];

const meta = {
    component: Checkbox,
    tags: ['ai-generated'],
} satisfies Meta<typeof Checkbox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Horizontal: Story = { args: { options: islands, defaultValue: ['beach'] } };
export const Vertical: Story = {
    args: { options: islands, defaultValue: ['forest'], direction: 'vertical' },
};
export const Large: Story = { args: { options: islands, defaultValue: ['garden'], size: 'large' } };

export const PicksForest: Story = {
    args: { options: islands },
    play: async ({ canvas, userEvent }) => {
        await userEvent.click(canvas.getByText('🌳 森林'));
        const checkboxes = canvas.getAllByRole('checkbox');
        await expect(checkboxes[1]).toHaveAttribute('aria-checked', 'true');
    },
};

export const KeyboardToggle: Story = {
    args: { options: islands },
    play: async ({ canvas, userEvent }) => {
        // Upstream toggles a checkbox on Space/Enter (Checkbox.tsx:92 onKeyDown
        // guards e.key === ' ' || 'Enter'); our Radix checkbox toggles on Space
        // natively. Assert the keyboard contract holds.
        const first = canvas.getAllByRole('checkbox')[0];
        await expect(first).toHaveAttribute('aria-checked', 'false');
        first.focus();
        await userEvent.keyboard(' ');
        await expect(first).toHaveAttribute('aria-checked', 'true');
    },
};
