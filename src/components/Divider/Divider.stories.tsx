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
