import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Divider, type DividerType } from './Divider';
import { Icon } from '../Icon';

const meta = {
    component: Divider,
    tags: ['ai-generated'],
} satisfies Meta<typeof Divider>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: { type: 'dashed-brown' },
};

export const Thin: Story = {
    args: { type: 'thin' },
};

export const Hairline: Story = {
    args: { type: 'hairline' },
};

export const WaveYellow: Story = {
    args: { type: 'wave-yellow' },
};

export const Squiggle: Story = {
    args: { type: 'squiggle' },
};

const ALL_TYPES: DividerType[] = [
    'dashed-brown',
    'thin',
    'hairline',
    'wave-yellow',
    'squiggle',
];

export const AllTypes: Story = {
    render: () => (
        <div
            style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 24,
                padding: '24px',
                background: '#f5f0e8',
            }}
        >
            {ALL_TYPES.map((type) => (
                <div key={type}>
                    <p
                        style={{
                            marginBottom: 8,
                            fontSize: 12,
                            color: '#7a6652',
                            fontFamily: 'monospace',
                        }}
                    >
                        {type} — 集合啦动物森友会 🌿
                    </p>
                    <Divider type={type} />
                </div>
            ))}
        </div>
    ),
};

export const WithIcon: Story = {
    render: () => (
        <div style={{ padding: '24px', background: '#f5f0e8' }}>
            <p style={{ marginBottom: 8, fontSize: 12, color: '#7a6652' }}>
                icon divider — Fish 循环铺满
            </p>
            <Divider icon={<Icon name="Fish" size={20} color="#5b8c5a" />} iconSize={20} iconGap={8} />
        </div>
    ),
};

export const CustomWidth: Story = {
    render: () => (
        <div
            style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 24,
                padding: '24px',
                background: '#f5f0e8',
            }}
        >
            <div>
                <p style={{ marginBottom: 8, fontSize: 12, color: '#7a6652' }}>
                    宽度 50% — 喵喵的摊位
                </p>
                <Divider type="dashed-brown" style={{ width: '50%' }} />
            </div>
            <div>
                <p style={{ marginBottom: 8, fontSize: 12, color: '#7a6652' }}>
                    宽度 75% — 大头菜行情
                </p>
                <Divider type="wave-yellow" style={{ width: '75%' }} />
            </div>
            <div>
                <p style={{ marginBottom: 8, fontSize: 12, color: '#7a6652' }}>
                    宽度 100% — 全岛公告
                </p>
                <Divider type="squiggle" style={{ width: '100%' }} />
            </div>
        </div>
    ),
};
