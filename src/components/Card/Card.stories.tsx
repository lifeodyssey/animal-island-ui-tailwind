import type { Meta, StoryObj } from '@storybook/react-vite';
import { Card, type CardColor, type CardType, type CardPattern } from './Card';

const meta = {
    component: Card,
    tags: ['ai-generated'],
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: { children: 'A simple card', style: { maxWidth: 400 } },
};

export const Title: Story = {
    args: { type: 'title', children: 'Title card variant', style: { maxWidth: 400 } },
};

export const Dashed: Story = {
    args: { type: 'dashed', children: 'Dashed card variant', style: { maxWidth: 400 } },
};

export const BlueAccent: Story = {
    args: { type: 'title', color: 'app-blue', children: 'Blue accent', style: { width: 240 } },
};

const ALL_TYPES: CardType[] = ['default', 'title', 'dashed'];

export const AllTypes: Story = {
    render: () => (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16 }}>
            {ALL_TYPES.map((type) => (
                <Card key={type} type={type} style={{ width: 200, padding: 16 }}>
                    <div style={{ fontWeight: 600, marginBottom: 4 }}>{type}</div>
                    <div>集合啦！动物森友会</div>
                </Card>
            ))}
        </div>
    ),
};

const ALL_COLORS: CardColor[] = [
    'default',
    'app-pink',
    'purple',
    'app-blue',
    'app-yellow',
    'app-orange',
    'app-teal',
    'app-green',
    'app-red',
    'lime-green',
    'yellow-green',
    'brown',
    'warm-peach-pink',
];

export const AllColors: Story = {
    render: () => (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16 }}>
            {ALL_COLORS.map((color) => (
                <Card key={color} color={color} style={{ width: 180, padding: 16 }}>
                    <div style={{ fontWeight: 600, marginBottom: 4 }}>{color}</div>
                    <div>岛民招募中 🌿</div>
                </Card>
            ))}
        </div>
    ),
};

const ALL_PATTERNS: CardPattern[] = [
    'default',
    'app-pink',
    'purple',
    'app-blue',
    'app-yellow',
    'app-orange',
    'app-teal',
    'app-green',
    'app-red',
    'lime-green',
    'yellow-green',
    'brown',
    'warm-peach-pink',
];

export const AllPatterns: Story = {
    render: () => (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16 }}>
            {ALL_PATTERNS.map((pattern) => (
                <Card key={pattern} pattern={pattern} style={{ width: 180, padding: 16 }}>
                    <div style={{ fontWeight: 600, marginBottom: 4 }}>{pattern}</div>
                    <div>圆点纹理底 🌿</div>
                </Card>
            ))}
        </div>
    ),
};

export const TypeColorCombos: Story = {
    render: () => (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16 }}>
            {ALL_TYPES.flatMap((type) =>
                ALL_COLORS.map((color) => (
                    <Card key={`${type}-${color}`} type={type} color={color} style={{ width: 180, padding: 12 }}>
                        <div style={{ fontSize: 12, fontWeight: 600 }}>{type}</div>
                        <div style={{ fontSize: 11, opacity: 0.75 }}>{color}</div>
                        <div style={{ marginTop: 4 }}>喵喵岛 🐱</div>
                    </Card>
                ))
            )}
        </div>
    ),
};
