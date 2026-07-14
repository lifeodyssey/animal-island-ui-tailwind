import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from '@storybook/test';
import { Tag } from './Tag';
import type { TagColor, TagSize, TagVariant } from './Tag';

const meta = {
    component: Tag,
    tags: ['ai-generated'],
} satisfies Meta<typeof Tag>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: { children: '默认标签' },
};

export const Closable: Story = {
    args: { children: '可关闭', closable: true, onClose: fn() },
};

export const Clickable: Story = {
    args: { children: '可点击', onClick: fn() },
};

export const Disabled: Story = {
    args: { children: '禁用', disabled: true },
};

const ALL_SIZES: TagSize[] = ['small', 'medium', 'large'];

export const AllSizes: Story = {
    render: () => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            {ALL_SIZES.map((size) => (
                <Tag key={size} size={size}>{size}</Tag>
            ))}
        </div>
    ),
};

const ALL_VARIANTS: TagVariant[] = ['solid', 'outlined', 'dashed'];

export const AllVariants: Story = {
    render: () => (
        <div style={{ display: 'flex', gap: 12 }}>
            {ALL_VARIANTS.map((variant) => (
                <Tag key={variant} variant={variant}>{variant}</Tag>
            ))}
        </div>
    ),
};

const ALL_COLORS: TagColor[] = [
    'default', 'app-pink', 'purple', 'app-blue', 'app-yellow',
    'app-orange', 'app-teal', 'app-green', 'app-red',
    'lime-green', 'yellow-green', 'brown', 'warm-peach-pink',
];

export const AllColors: Story = {
    render: () => (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {ALL_COLORS.map((color) => (
                <Tag key={color} color={color}>{color}</Tag>
            ))}
        </div>
    ),
};

export const OutlinedColors: Story = {
    render: () => (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {ALL_COLORS.filter(c => c !== 'default').map((color) => (
                <Tag key={color} color={color} variant="outlined">{color}</Tag>
            ))}
        </div>
    ),
};
