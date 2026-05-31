import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';
import { Button, type ButtonType, type ButtonSize } from './Button';

const meta = {
    component: Button,
    tags: ['ai-generated'],
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

// ── Existing stories (kept as-is) ────────────────────────────────────────────

export const Primary: Story = { args: { children: 'Primary action', type: 'primary' } };
export const Default: Story = { args: { children: 'Default', type: 'default' } };
export const Dashed: Story = { args: { children: 'Dashed', type: 'dashed' } };

export const Loading: Story = {
    args: { children: 'Saving…', loading: true },
    play: async ({ canvas }) => {
        const btn = canvas.getByRole('button', { name: /saving/i });
        await expect(btn).toHaveAttribute('aria-busy', 'true');
        await expect(btn).toHaveAttribute('aria-disabled', 'true');
    },
};

export const CssCheck: Story = {
    args: { children: 'CSS Check', type: 'primary' },
    play: async ({ canvas }) => {
        const button = canvas.getByRole('button', { name: /css check/i });
        await expect(getComputedStyle(button).backgroundColor).toBe('rgb(248, 248, 240)');
    },
};

// ── New stories ───────────────────────────────────────────────────────────────

const ALL_TYPES: ButtonType[] = ['primary', 'default', 'dashed', 'text', 'link'];
const ALL_SIZES: ButtonSize[] = ['small', 'middle', 'large'];

/** All five button types side by side */
export const Types: Story = {
    render: () => (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center' }}>
            {ALL_TYPES.map((t) => (
                <Button key={t} type={t}>
                    {t === 'primary' ? '集合啦' : t === 'default' ? '岛民' : t === 'dashed' ? '喵喵' : t === 'text' ? '摇钱树' : '海边漫步'}
                </Button>
            ))}
        </div>
    ),
};

/** All three sizes */
export const Sizes: Story = {
    render: () => (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center' }}>
            {ALL_SIZES.map((s) => (
                <Button key={s} size={s} type="primary">
                    {s === 'small' ? '小岛民' : s === 'middle' ? '中岛民' : '大岛民'}
                </Button>
            ))}
        </div>
    ),
};

/** Danger variant across types */
export const Danger: Story = {
    render: () => (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center' }}>
            {ALL_TYPES.map((t) => (
                <Button key={t} type={t} danger>
                    危险 ({t})
                </Button>
            ))}
        </div>
    ),
};

/** Ghost variant — transparent background, visible on dark backgrounds */
export const Ghost: Story = {
    render: () => (
        <div
            style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: 12,
                alignItems: 'center',
                padding: 24,
                background: '#4a7c59',
                borderRadius: 8,
            }}
        >
            {ALL_TYPES.map((t) => (
                <Button key={t} type={t} ghost>
                    幽灵 ({t})
                </Button>
            ))}
        </div>
    ),
};

/** Block button stretches full width */
export const Block: Story = {
    render: () => (
        <div style={{ width: 320, display: 'flex', flexDirection: 'column', gap: 12 }}>
            <Button type="primary" block>
                全宽：集合啦！
            </Button>
            <Button type="default" block>
                全宽：岛民大会
            </Button>
        </div>
    ),
};

/** Disabled state */
export const Disabled: Story = {
    render: () => (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center' }}>
            {ALL_TYPES.map((t) => (
                <Button key={t} type={t} disabled>
                    禁用 ({t})
                </Button>
            ))}
        </div>
    ),
};

/** Button with an icon (no text) */
export const Icon: Story = {
    render: () => (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center' }}>
            <Button
                type="primary"
                icon={<span role="img" aria-label="leaf">🌿</span>}
            >
                摘叶子
            </Button>
            <Button
                type="default"
                icon={<span role="img" aria-label="fish">🐟</span>}
            >
                钓鱼
            </Button>
            <Button
                type="dashed"
                icon={<span role="img" aria-label="bug">🐛</span>}
            >
                抓虫
            </Button>
            {/* Icon-only button (no children) */}
            <Button
                type="primary"
                icon={<span role="img" aria-label="star">⭐</span>}
                aria-label="收藏"
            />
        </div>
    ),
};

/** htmlType variants: submit, reset, button */
export const HtmlType: Story = {
    render: () => (
        <form
            onSubmit={(e) => e.preventDefault()}
            onReset={() => {}}
            style={{ display: 'flex', gap: 12, alignItems: 'center' }}
        >
            <Button type="primary" htmlType="submit">
                提交 (submit)
            </Button>
            <Button type="default" htmlType="reset">
                重置 (reset)
            </Button>
            <Button type="dashed" htmlType="button">
                普通 (button)
            </Button>
        </form>
    ),
};

/** Text and Link types */
export const Text: Story = { args: { children: '文字按钮：赶海', type: 'text' } };
export const Link: Story = { args: { children: '链接按钮：去邻居岛', type: 'link' } };

/** Small size */
export const Small: Story = { args: { children: '小号', size: 'small', type: 'primary' } };

/** Large size */
export const Large: Story = { args: { children: '大号', size: 'large', type: 'primary' } };
