import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { BackTop } from './BackTop';

const meta = {
    component: BackTop,
    tags: ['ai-generated'],
    parameters: {
        docs: {
            description: {
                component:
                    'BackTop appears after scrolling past `visibilityHeight` pixels and smoothly returns the page to the top when clicked.',
            },
        },
    },
} satisfies Meta<typeof BackTop>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default usage: the button appears once you scroll down 400 px.
 * Scroll inside the preview iframe to see it.
 */
export const Default: Story = {
    render: () => (
        <div style={{ position: 'relative' }}>
            <div
                style={{
                    height: 1200,
                    background: 'linear-gradient(to bottom, #f8f8f0, #e8f4f0)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 40,
                    padding: 32,
                }}
            >
                <p style={{ fontSize: 14, opacity: 0.7 }}>
                    向下滚动以显示 BackTop 按钮 ↓
                </p>
                {Array.from({ length: 12 }).map((_, i) => (
                    <div
                        key={i}
                        style={{
                            padding: '16px 20px',
                            background: 'rgba(255,255,255,0.7)',
                            borderRadius: 10,
                            border: '1px solid #e8e3d8',
                        }}
                    >
                        第 {i + 1} 条岛屿日记 — 今天在海边捡了好多贝壳，还遇到了喵喵！
                    </div>
                ))}
            </div>
            <BackTop />
        </div>
    ),
};

/**
 * Low visibility height — button appears after just 100 px of scroll.
 */
export const EarlyAppearance: Story = {
    render: () => (
        <div style={{ position: 'relative' }}>
            <div
                style={{
                    height: 1200,
                    background: 'linear-gradient(to bottom, #f8f8f0, #fdf0e8)',
                    padding: 32,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 32,
                }}
            >
                <p style={{ fontSize: 14, opacity: 0.7 }}>
                    visibilityHeight=100 — 向下少许滚动即可看到按钮 ↓
                </p>
                {Array.from({ length: 10 }).map((_, i) => (
                    <p key={i} style={{ margin: 0 }}>
                        {i + 1}. 岛上的花都开了，今天摘了蒲公英和玫瑰各一束。
                    </p>
                ))}
            </div>
            <BackTop visibilityHeight={100} />
        </div>
    ),
};

/**
 * With onClick callback logged to console.
 */
export const WithCallback: Story = {
    render: () => (
        <div style={{ position: 'relative' }}>
            <div
                style={{
                    height: 1200,
                    background: 'linear-gradient(to bottom, #f0f8f0, #e8f0f8)',
                    padding: 32,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 32,
                }}
            >
                <p style={{ fontSize: 14, opacity: 0.7 }}>
                    向下滚动，点击 BackTop 后控制台会输出日志 ↓
                </p>
                {Array.from({ length: 10 }).map((_, i) => (
                    <p key={i} style={{ margin: 0 }}>
                        {i + 1}. 狸克镇长宣布：今日土地价格波动，请关注公告栏。
                    </p>
                ))}
            </div>
            <BackTop
                visibilityHeight={120}
                onClick={() => console.log('BackTop clicked — scrolling to top!')}
            />
        </div>
    ),
};
