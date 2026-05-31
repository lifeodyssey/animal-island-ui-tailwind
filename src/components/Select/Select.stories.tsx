import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';
import { Select } from './Select';
import type { SelectOption } from './Select';

const fruits: SelectOption[] = [
    { label: '🍎 苹果', key: 'apple' },
    { label: '🍊 橙子', key: 'orange' },
    { label: '🍐 梨子', key: 'pear' },
];

const meta = {
    component: Select,
    tags: ['ai-generated'],
} satisfies Meta<typeof Select>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Placeholder: Story = { args: { options: fruits, placeholder: '选择水果' } };
export const Preselected: Story = { args: { options: fruits, defaultValue: 'orange' } };
export const Disabled: Story = {
    args: { options: fruits, defaultValue: 'apple', disabled: true },
};

export const OpensPortal: Story = {
    args: { options: fruits, placeholder: '选择水果' },
    play: async ({ canvas, canvasElement, userEvent }) => {
        const trigger = canvas.getByRole('combobox');
        await userEvent.click(trigger);
        const docBody = within(canvasElement.ownerDocument.body);
        const option = await docBody.findByRole('option', { name: /苹果/ });
        await expect(option).toHaveTextContent('苹果');
    },
};
