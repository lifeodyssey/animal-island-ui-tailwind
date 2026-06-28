import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, within } from 'storybook/test';
import { Tag, type TagColor, type TagVariant } from './Tag';

const meta = {
    component: Tag,
    tags: ['ai-generated'],
    argTypes: {
        size: { control: 'select', options: ['small', 'medium', 'large'] },
        variant: { control: 'select', options: ['solid', 'outlined', 'dashed'] },
        color: {
            control: 'select',
            options: [
                'default', 'app-pink', 'purple', 'app-blue', 'app-yellow',
                'app-orange', 'app-teal', 'app-green', 'app-red',
                'lime-green', 'yellow-green', 'brown', 'warm-peach-pink',
            ],
        },
        closable: { control: 'boolean' },
        disabled: { control: 'boolean' },
    },
} satisfies Meta<typeof Tag>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: { children: '标签' },
};

export const Sizes: Story = {
    render: () => (
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <Tag size="small">小号</Tag>
            <Tag size="medium">中号</Tag>
            <Tag size="large">大号</Tag>
        </div>
    ),
};

export const Variants: Story = {
    render: () => (
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <Tag variant="solid">实心</Tag>
            <Tag variant="outlined">描边</Tag>
            <Tag variant="dashed">虚线</Tag>
        </div>
    ),
};

const ALL_COLORS: TagColor[] = [
    'default', 'app-pink', 'purple', 'app-blue', 'app-yellow',
    'app-orange', 'app-teal', 'app-green', 'app-red',
    'lime-green', 'yellow-green', 'brown', 'warm-peach-pink',
];

export const AllColorsSolid: Story = {
    render: () => (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {ALL_COLORS.map((c) => (
                <Tag key={c} color={c} variant="solid">{c}</Tag>
            ))}
        </div>
    ),
};

export const AllColorsOutlined: Story = {
    render: () => (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {ALL_COLORS.map((c) => (
                <Tag key={c} color={c} variant="outlined">{c}</Tag>
            ))}
        </div>
    ),
};

export const AllColorsDashed: Story = {
    render: () => (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {ALL_COLORS.map((c) => (
                <Tag key={c} color={c} variant="dashed">{c}</Tag>
            ))}
        </div>
    ),
};

export const Closable: Story = {
    args: { children: '可关闭', closable: true, onClose: fn() },
    play: async ({ canvasElement, args }) => {
        const canvas = within(canvasElement);
        const closeBtn = canvas.getByRole('button', { name: 'close' });
        await userEvent.click(closeBtn);
        expect(args.onClose).toHaveBeenCalledTimes(1);
    },
};

export const Clickable: Story = {
    args: { children: '可点击', onClick: fn() },
    play: async ({ canvasElement, args }) => {
        const canvas = within(canvasElement);
        const tag = canvas.getByRole('button');
        await userEvent.click(tag);
        expect(args.onClick).toHaveBeenCalledTimes(1);
    },
};

export const Disabled: Story = {
    args: { children: '禁用', disabled: true, closable: true },
};

const ALL_VARIANTS: TagVariant[] = ['solid', 'outlined', 'dashed'];

export const AllVariantsGrid: Story = {
    render: () => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {ALL_VARIANTS.map((v) => (
                <div key={v} style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                    {ALL_COLORS.map((c) => (
                        <Tag key={c} color={c} variant={v}>{c}</Tag>
                    ))}
                </div>
            ))}
        </div>
    ),
};
