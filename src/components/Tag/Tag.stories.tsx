import type { Meta, StoryObj } from '@storybook/react-vite';
import { Tag, type TagColor, type TagSize, type TagVariant } from './Tag';

const meta = {
    component: Tag,
    tags: ['ai-generated'],
    argTypes: {
        size: { control: 'select', options: ['small', 'medium', 'large'] as TagSize[] },
        variant: { control: 'select', options: ['solid', 'outlined', 'dashed'] as TagVariant[] },
        color: {
            control: 'select',
            options: [
                'default', 'app-pink', 'purple', 'app-blue', 'app-yellow',
                'app-orange', 'app-teal', 'app-green', 'app-red',
                'lime-green', 'yellow-green', 'brown', 'warm-peach-pink',
            ] as TagColor[],
        },
        closable: { control: 'boolean' },
        disabled: { control: 'boolean' },
    },
} satisfies Meta<typeof Tag>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: { children: '集合啦', size: 'medium', variant: 'solid', color: 'default' },
};

export const Closable: Story = {
    args: { children: '可关闭', closable: true },
};

export const Clickable: Story = {
    args: { children: '可点击' },
};

export const Disabled: Story = {
    args: { children: '禁用', disabled: true, closable: true },
};

const ALL_SIZES: TagSize[] = ['small', 'medium', 'large'];
const ALL_VARIANTS: TagVariant[] = ['solid', 'outlined', 'dashed'];
const ALL_COLORS: TagColor[] = [
    'default', 'app-pink', 'purple', 'app-blue', 'app-yellow',
    'app-orange', 'app-teal', 'app-green', 'app-red',
    'lime-green', 'yellow-green', 'brown', 'warm-peach-pink',
];

export const AllSizes: Story = {
    render: () => (
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            {ALL_SIZES.map((size) => (
                <Tag key={size} size={size} color="app-teal">
                    {size}
                </Tag>
            ))}
        </div>
    ),
};

export const AllVariants: Story = {
    render: () => (
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            {ALL_VARIANTS.map((variant) => (
                <Tag key={variant} variant={variant} color="purple">
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

export const AllColorsOutlined: Story = {
    render: () => (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {ALL_COLORS.filter((c) => c !== 'default').map((color) => (
                <Tag key={color} color={color} variant="outlined">
                    {color}
                </Tag>
            ))}
        </div>
    ),
};

export const AllColorsDashed: Story = {
    render: () => (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {ALL_COLORS.filter((c) => c !== 'default').map((color) => (
                <Tag key={color} color={color} variant="dashed">
                    {color}
                </Tag>
            ))}
        </div>
    ),
};
