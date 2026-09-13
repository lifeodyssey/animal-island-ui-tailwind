import type { Meta, StoryObj } from '@storybook/react-vite';
import { Divider, type DividerType } from './Divider';

const meta = {
    component: Divider,
    tags: ['ai-generated'],
} satisfies Meta<typeof Divider>;

export default meta;
type Story = StoryObj<typeof meta>;

export const DashedBrown: Story = {
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

export const WithIcon: Story = {
    args: { icon: 'Heart', iconSize: 20, iconGap: 8 },
};

export const WithIconLarge: Story = {
    args: { icon: 'Star', iconSize: 32, iconGap: 12 },
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
                <Divider type="dashed-brown" style={{ width: '25%' }} />
            </div>
            <div>
                <p style={{ marginBottom: 8, fontSize: 12, color: '#7a6652' }}>
                    宽度 50% — 喵喵的摊位
                </p>
                <Divider type="thin" style={{ width: '50%' }} />
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
                <Divider type="hairline" style={{ width: '100%' }} />
            </div>
        </div>
    ),
};
