import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Carousel } from '../src';

const meta = {
    title: 'Components/Carousel',
    component: Carousel,
    parameters: { layout: 'padded' },
    tags: ['autodocs'],
} satisfies Meta<typeof Carousel>;

export default meta;
type Story = StoryObj<typeof meta>;

const slideStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: 200,
    fontSize: 32,
    fontFamily: 'var(--animal-font-family)',
    fontWeight: 700,
    color: '#8b7355',
};

export const Default: Story = {
    render: () => (
        <div style={{ maxWidth: 600 }}>
            <Carousel aria-label="岛屿风景">
                <div style={{ ...slideStyle, background: '#f7f3df' }}>🏖 海滩</div>
                <div style={{ ...slideStyle, background: '#e8f5e9' }}>🌳 广场</div>
                <div style={{ ...slideStyle, background: '#e3f2fd' }}>🏛 博物馆</div>
            </Carousel>
        </div>
    ),
};

export const Autoplay: Story = {
    render: () => (
        <div style={{ maxWidth: 600 }}>
            <Carousel aria-label="自动播放示例" autoplay interval={2000}>
                <div style={{ ...slideStyle, background: '#f7f3df' }}>🌸 春</div>
                <div style={{ ...slideStyle, background: '#e8f5e9' }}>☀️ 夏</div>
                <div style={{ ...slideStyle, background: '#fff3e0' }}>🍂 秋</div>
                <div style={{ ...slideStyle, background: '#e3f2fd' }}>❄️ 冬</div>
            </Carousel>
        </div>
    ),
};

export const NoLoop: Story = {
    render: () => (
        <div style={{ maxWidth: 600 }}>
            <Carousel aria-label="非循环示例" loop={false}>
                <div style={{ ...slideStyle, background: '#f7f3df' }}>第一张</div>
                <div style={{ ...slideStyle, background: '#e8f5e9' }}>第二张</div>
                <div style={{ ...slideStyle, background: '#e3f2fd' }}>第三张</div>
            </Carousel>
        </div>
    ),
};
