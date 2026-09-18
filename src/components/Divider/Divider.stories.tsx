import type { Meta, StoryObj } from '@storybook/react-vite';
import { Divider, type DividerType } from './Divider';

const meta = {
    component: Divider,
    tags: ['ai-generated'],
} satisfies Meta<typeof Divider>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: { type: 'line-brown' },
};

export const LineTeal: Story = {
    args: { type: 'line-teal' },
};

export const LineWhite: Story = {
    args: { type: 'line-white' },
    decorators: [
        (Story) => (
            <div style={{ background: '#b5e0b5', padding: '16px' }}>
                <Story />
            </div>
        ),
    ],
};

export const LineYellow: Story = {
    args: { type: 'line-yellow' },
};

export const WaveYellow: Story = {
    args: { type: 'wave-yellow' },
};

export const Thin: Story = {
    args: { type: 'thin' },
};

export const Hairline: Story = {
    args: { type: 'hairline' },
};

export const Squiggle: Story = {
    args: { type: 'squiggle' },
};

const fishIcon = (
    <svg
        viewBox="0 0 48 48"
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        fill="none"
        aria-hidden
    >
        <path d="M6 24 C 8 14 22 10 30 14 C 38 18 38 30 30 34 C 22 38 8 34 6 24 Z" fill="#2A9D8F" />
        <path d="M30 24 L42 14 L42 34 Z" fill="#E76F51" />
        <circle cx="14" cy="22" r="2" fill="#FFFFFF" />
        <circle cx="14" cy="22" r="1" fill="#2A2A2A" />
    </svg>
);

/** 图标 + 连接线循环拼接，按容器宽度自动铺满整行。 */
export const IconStrip: Story = {
    render: () => (
        <div style={{ padding: '24px', background: '#f5f0e8' }}>
            <div style={{ marginBottom: 24 }}>
                <p style={{ marginBottom: 8, fontSize: 12, color: '#7a6652' }}>默认（24px 图标 + 8px 连接线）</p>
                <Divider icon={fishIcon} />
            </div>
            <div style={{ marginBottom: 24 }}>
                <p style={{ marginBottom: 8, fontSize: 12, color: '#7a6652' }}>大图标长连接线（32px + 16px）</p>
                <Divider icon={fishIcon} iconSize={32} iconGap={16} />
            </div>
            <div style={{ width: '50%' }}>
                <p style={{ marginBottom: 8, fontSize: 12, color: '#7a6652' }}>50% 宽度容器</p>
                <Divider icon={fishIcon} />
            </div>
        </div>
    ),
};

export const DashedBrown: Story = {
    args: { type: 'dashed-brown' },
};

export const DashedTeal: Story = {
    args: { type: 'dashed-teal' },
};

export const DashedWhite: Story = {
    args: { type: 'dashed-white' },
    decorators: [
        (Story) => (
            <div style={{ background: '#b5e0b5', padding: '16px' }}>
                <Story />
            </div>
        ),
    ],
};

export const DashedYellow: Story = {
    args: { type: 'dashed-yellow' },
};

const ALL_TYPES: DividerType[] = [
    'line-brown',
    'line-teal',
    'line-white',
    'line-yellow',
    'wave-yellow',
    'dashed-brown',
    'dashed-teal',
    'dashed-white',
    'dashed-yellow',
    'thin',
    'hairline',
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
                    宽度 25% — 岛民聚会
                </p>
                <Divider type="line-brown" style={{ width: '25%' }} />
            </div>
            <div>
                <p style={{ marginBottom: 8, fontSize: 12, color: '#7a6652' }}>
                    宽度 50% — 喵喵的摊位
                </p>
                <Divider type="dashed-teal" style={{ width: '50%' }} />
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
                <Divider type="line-teal" style={{ width: '100%' }} />
            </div>
        </div>
    ),
};
