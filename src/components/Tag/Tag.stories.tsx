import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';
import { Tag, type TagColor, type TagSize, type TagVariant } from './Tag';

const meta = {
    component: Tag,
    tags: ['ai-generated'],
} satisfies Meta<typeof Tag>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { args: { children: '岛民' } };

export const Sizes: Story = {
    render: () => (
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            {(['small', 'medium', 'large'] as TagSize[]).map((s) => (
                <Tag key={s} size={s}>{s}</Tag>
            ))}
        </div>
    ),
};

export const Variants: Story = {
    render: () => (
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            {(['solid', 'outlined', 'dashed'] as TagVariant[]).map((v) => (
                <Tag key={v} variant={v}>{v}</Tag>
            ))}
        </div>
    ),
};

const ALL_COLORS: TagColor[] = [
    'default', 'app-pink', 'purple', 'app-blue', 'app-yellow', 'app-orange',
    'app-teal', 'app-green', 'app-red', 'lime-green', 'yellow-green', 'brown', 'warm-peach-pink',
];

export const AllColors: Story = {
    render: () => (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {ALL_COLORS.map((c) => (
                <Tag key={c} color={c}>{c}</Tag>
            ))}
        </div>
    ),
};

export const Closable: Story = {
    args: { children: '可关闭', closable: true },
    play: async ({ canvas }) => {
        const closeBtn = canvas.getByRole('button', { name: 'close' });
        await expect(closeBtn).toBeInTheDocument();
    },
};

export const Disabled: Story = {
    args: { children: '禁用', disabled: true },
    play: async ({ canvas }) => {
        const root = canvas.getByText('禁用').closest('.animal-tag') as HTMLElement;
        await expect(root).toHaveClass('animal-tag-disabled');
    },
};

export const Clickable: Story = {
    args: { children: '可点击', onClick: () => {} },
    play: async ({ canvas }) => {
        const tag = canvas.getByRole('button');
        await expect(tag).toHaveClass('animal-tag-clickable');
        await userEvent.click(tag);
    },
};

export const ClassCheck: Story = {
    args: { children: 'Class Check', size: 'large', variant: 'outlined', color: 'app-pink' },
    play: async ({ canvas }) => {
        const root = canvas.getByText('Class Check').closest('.animal-tag') as HTMLElement;
        await expect(root).toHaveClass('animal-tag-large');
        await expect(root).toHaveClass('animal-tag-outlined');
        await expect(root).toHaveClass('animal-tag-color-app-pink-outlined');
    },
};
