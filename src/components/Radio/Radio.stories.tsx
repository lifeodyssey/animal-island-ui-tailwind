import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, waitFor } from 'storybook/test';
import { Radio } from './Radio';
import type { RadioOption } from './Radio';

const seasons: RadioOption[] = [
    { label: '🌸 春天', value: 'spring' },
    { label: '☀️ 夏天', value: 'summer' },
    { label: '🍁 秋天', value: 'autumn' },
    { label: '❄️ 冬天', value: 'winter' },
];

const meta = {
    component: Radio,
    tags: ['ai-generated'],
} satisfies Meta<typeof Radio>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Horizontal: Story = { args: { options: seasons, defaultValue: 'spring' } };
export const Vertical: Story = {
    args: { options: seasons, defaultValue: 'summer', direction: 'vertical' },
    play: async ({ canvas }) => {
        // Guardrail for the uncontrolled-selection regression: with only
        // defaultValue (no value prop), the selected item must still carry the
        // stable `animal-radio-checked` class that renders the teal fill.
        const summerRadio = canvas.getAllByRole('radio')[1];
        await expect(summerRadio).toHaveAttribute('aria-checked', 'true');
        const summerItem = summerRadio.closest('.animal-radio-item');
        await expect(summerItem).toHaveClass(/animal-radio-checked/);
    },
};
export const DisabledGroup: Story = {
    args: { options: seasons, defaultValue: 'autumn', disabled: true },
};

export const PicksSummer: Story = {
    args: { options: seasons, defaultValue: 'spring' },
    play: async ({ canvas, userEvent }) => {
        const radios = canvas.getAllByRole('radio');
        await expect(radios[0]).toHaveAttribute('aria-checked', 'true');
        await userEvent.click(radios[1]);
        await waitFor(async () => {
            await expect(radios[1]).toHaveAttribute('aria-checked', 'true');
        });
    },
};
