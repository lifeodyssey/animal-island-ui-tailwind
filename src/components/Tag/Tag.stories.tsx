import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';
import { Tag, type TagColor, type TagVariant, type TagSize } from './Tag';

const ALL_COLORS: TagColor[] = [
    'default', 'app-pink', 'purple', 'app-blue', 'app-yellow', 'app-orange',
    'app-teal', 'app-green', 'app-red', 'lime-green', 'yellow-green', 'brown', 'warm-peach-pink',
];
const ALL_VARIANTS: TagVariant[] = ['solid', 'outlined', 'dashed'];
const ALL_SIZES: TagSize[] = ['small', 'medium', 'large'];

const meta = {
    component: Tag,
    tags: ['ai-generated'],
    argTypes: {
        size: { control: 'select', options: ALL_SIZES },
        variant: { control: 'select', options: ALL_VARIANTS },
        color: { control: 'select', options: ALL_COLORS },
        closable: { control: 'boolean' },
        disabled: { control: 'boolean' },
    },
} satisfies Meta<typeof Tag>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: { children: 'Animal Tag' },
};

export const Sizes: Story = {
    render: () => (
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            {ALL_SIZES.map((s) => (
                <Tag key={s} size={s}>{s}</Tag>
            ))}
        </div>
    ),
};

export const Variants: Story = {
    render: () => (
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            {ALL_VARIANTS.map((v) => (
                <Tag key={v} variant={v}>{v}</Tag>
            ))}
        </div>
    ),
};

export const Colors: Story = {
    render: () => (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {ALL_COLORS.map((c) => (
                <Tag key={c} color={c}>{c}</Tag>
            ))}
        </div>
    ),
};

export const AllVariantsAndColors: Story = {
    render: () => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {ALL_VARIANTS.map((v) => (
                <div key={v} style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                    {ALL_COLORS.map((c) => (
                        <Tag key={c} variant={v} color={c}>{c}</Tag>
                    ))}
                </div>
            ))}
        </div>
    ),
};

export const Closable: Story = {
    args: { children: 'Closable', closable: true },
    play: async ({ canvas }) => {
        const closeBtn = canvas.getByRole('button', { name: 'close' });
        await expect(closeBtn).toBeInTheDocument();
    },
};

export const Clickable: Story = {
    args: { children: 'Click me', onClick: () => {} },
    play: async ({ canvas }) => {
        const tag = canvas.getByRole('button');
        await expect(tag).toHaveClass('animal-tag-clickable');
        await userEvent.click(tag);
    },
};

export const Disabled: Story = {
    args: { children: 'Disabled', disabled: true },
    play: async ({ canvasElement }) => {
        const root = canvasElement.querySelector('.animal-tag') as HTMLElement;
        await expect(root).toHaveClass('animal-tag-disabled');
    },
};

export const DisabledClosable: Story = {
    args: { children: 'Disabled + Closable', closable: true, disabled: true },
    play: async ({ canvas }) => {
        const closeBtn = canvas.getByRole('button', { name: 'close' });
        await expect(closeBtn).toBeDisabled();
    },
};

export const ClassCheck: Story = {
    args: { children: 'CSS Check', color: 'app-pink', variant: 'solid' },
    play: async ({ canvasElement }) => {
        const root = canvasElement.querySelector('.animal-tag') as HTMLElement;
        await expect(root).toHaveClass('animal-tag');
        await expect(root).toHaveClass('animal-tag-solid');
        await expect(root).toHaveClass('animal-tag-app-pink-solid');
    },
};
