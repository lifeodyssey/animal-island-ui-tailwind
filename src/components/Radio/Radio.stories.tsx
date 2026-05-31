import React, { useState } from 'react';
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

const islandActivities: RadioOption[] = [
    { label: '🎣 钓鱼', value: 'fishing' },
    { label: '🦋 捉虫', value: 'bugs' },
    { label: '🌺 种花', value: 'flowers' },
    { label: '🏠 建设', value: 'build', disabled: true },
];

const meta = {
    component: Radio,
    tags: ['ai-generated'],
    args: {
        options: seasons,
    },
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

// size: small
export const SizeSmall: Story = {
    args: { options: seasons, defaultValue: 'winter', size: 'small' },
};

// size: large
export const SizeLarge: Story = {
    args: { options: seasons, defaultValue: 'spring', size: 'large' },
};

// All three sizes side by side for comparison
export const AllSizes: Story = {
    render: () => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {(['small', 'middle', 'large'] as const).map((size) => (
                <div key={size} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{ width: 48, fontSize: 12, color: '#888' }}>{size}</span>
                    <Radio options={seasons} defaultValue="spring" size={size} />
                </div>
            ))}
        </div>
    ),
};

// per-option disabled: 建设 (build) is disabled, others are selectable
export const PerOptionDisabled: Story = {
    args: { options: islandActivities, defaultValue: 'fishing' },
};

// direction: vertical layout
export const DirectionVertical: Story = {
    args: { options: islandActivities, defaultValue: 'bugs', direction: 'vertical' },
};

// controlled: value driven by parent state
export const Controlled: Story = {
    render: () => {
        const [selected, setSelected] = useState<string | number>('summer');
        return (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <Radio
                    options={seasons}
                    value={selected}
                    onChange={(v) => setSelected(v)}
                />
                <p style={{ fontSize: 13, color: '#6b7280' }}>
                    当前选中（受控）：{String(selected)}
                </p>
            </div>
        );
    },
};

// uncontrolled: no value prop, only defaultValue
export const Uncontrolled: Story = {
    args: { options: seasons, defaultValue: 'autumn' },
};

// checked: a pre-checked item is visible on load
export const Checked: Story = {
    args: { options: seasons, defaultValue: 'winter' },
    play: async ({ canvas }) => {
        const winterRadio = canvas.getAllByRole('radio')[3];
        await expect(winterRadio).toHaveAttribute('aria-checked', 'true');
        const winterItem = winterRadio.closest('.animal-radio-item');
        await expect(winterItem).toHaveClass(/animal-radio-checked/);
    },
};
