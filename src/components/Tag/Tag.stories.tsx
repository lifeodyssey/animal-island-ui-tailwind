import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { Tag, type TagColor, type TagSize, type TagVariant } from './Tag';

const meta = {
    component: Tag,
    tags: ['ui'],
    args: { onClose: fn(), onClick: fn() },
} satisfies Meta<typeof Tag>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: { children: 'Animal Island' },
};

export const Closable: Story = {
    args: { children: 'Closable', closable: true },
};

export const Clickable: Story = {
    args: { children: 'Clickable' },
};

export const Disabled: Story = {
    args: { children: 'Disabled', disabled: true, closable: true },
};

const ALL_SIZES: TagSize[] = ['small', 'medium', 'large'];
const ALL_VARIANTS: TagVariant[] = ['solid', 'outlined', 'dashed'];
const ALL_COLORS: TagColor[] = [
    'default',
    'app-pink',
    'purple',
    'app-blue',
    'app-yellow',
    'app-orange',
    'app-teal',
    'app-green',
    'app-red',
    'lime-green',
    'yellow-green',
    'brown',
    'warm-peach-pink',
];

export const AllSizes: Story = {
    render: () => (
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            {ALL_SIZES.map((size) => (
                <Tag key={size} size={size}>
                    {size}
                </Tag>
            ))}
        </div>
    ),
};

export const AllVariants: Story = {
    render: () => (
        <div style={{ display: 'flex', gap: 8 }}>
            {ALL_VARIANTS.map((variant) => (
                <Tag key={variant} variant={variant}>
                    {variant}
                </Tag>
            ))}
        </div>
    ),
};

export const AllColors: Story = {
    render: () => (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {ALL_COLORS.map((color) => (
                <Tag key={color} color={color}>
                    {color}
                </Tag>
            ))}
        </div>
    ),
};

export const OutlinedColors: Story = {
    render: () => (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {ALL_COLORS.map((color) => (
                <Tag key={color} color={color} variant="outlined">
                    {color}
                </Tag>
            ))}
        </div>
    ),
};
