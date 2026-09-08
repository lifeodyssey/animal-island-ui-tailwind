import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Background } from './Background';

const meta = {
    component: Background,
    tags: ['ai-generated'],
} satisfies Meta<typeof Background>;

export default meta;
type Story = StoryObj<typeof meta>;

/** type="dots"（默认）：两层错位波点壁纸，绿色系。 */
export const Dots: Story = {
    args: { type: 'dots' },
    render: (args) => (
        <Background {...args} style={{ height: 200, borderRadius: 12 }}>
            <div style={{ padding: '1.5rem', color: '#3a5a40', fontWeight: 600 }}>波点背景 · dots</div>
        </Background>
    ),
};

/** type="sprinkles"：圆柱形彩色针糖壁纸，甜甜圈糖霜风格，无外部图片。 */
export const Sprinkles: Story = {
    args: { type: 'sprinkles' },
    render: (args) => (
        <Background {...args} style={{ height: 200, borderRadius: 12 }}>
            <div style={{ padding: '1.5rem', color: '#5a3e2b', fontWeight: 600 }}>彩糖背景 · sprinkles</div>
        </Background>
    ),
};
