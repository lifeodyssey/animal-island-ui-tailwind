import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Loading } from './Loading';

const meta = {
    component: Loading,
    tags: ['ai-generated'],
} satisfies Meta<typeof Loading>;

export default meta;
type Story = StoryObj<typeof meta>;

/** 默认状态：岛屿场景全屏展示（active=true）*/
export const Active: Story = {
    args: { active: true },
};

/** active=false：触发遮罩消散过渡动画 */
export const Inactive: Story = {
    args: { active: false },
};

/**
 * 集合啦！切换按钮演示：点击按钮在 active/inactive 之间切换，
 * 可以亲眼看到岛民加载画面的开启与关闭过渡效果。
 */
export const Toggle: Story = {
    render: () => {
        const [active, setActive] = React.useState(true);
        return (
            <div style={{ position: 'relative', width: '100%', height: '600px' }}>
                <Loading active={active} />
                <div
                    style={{
                        position: 'absolute',
                        bottom: '24px',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        zIndex: 9999,
                        display: 'flex',
                        gap: '12px',
                    }}
                >
                    <button
                        onClick={() => setActive(true)}
                        style={{
                            padding: '8px 20px',
                            borderRadius: '999px',
                            background: '#12b2da',
                            color: '#fff',
                            border: 'none',
                            cursor: 'pointer',
                            fontWeight: 600,
                        }}
                    >
                        显示岛屿 🌴
                    </button>
                    <button
                        onClick={() => setActive(false)}
                        style={{
                            padding: '8px 20px',
                            borderRadius: '999px',
                            background: '#fed09d',
                            color: '#7a5230',
                            border: 'none',
                            cursor: 'pointer',
                            fontWeight: 600,
                        }}
                    >
                        喵喵再见 👋
                    </button>
                </div>
            </div>
        );
    },
};
