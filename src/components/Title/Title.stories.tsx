import type { Meta, StoryObj } from '@storybook/react-vite';
import { Title, type TitleColor } from './Title';

const meta = {
    component: Title,
    tags: ['ai-generated'],
} satisfies Meta<typeof Title>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: { children: '标题' },
};

export const Small: Story = {
    args: { size: 'small', children: 'Small Title' },
};

export const Middle: Story = {
    args: { size: 'middle', children: 'Middle Title' },
};

export const Large: Story = {
    args: { size: 'large', children: 'Large Title' },
};

const ALL_COLORS: TitleColor[] = [
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

export const Colors: Story = {
    args: { children: 'Color' },
    render: () => (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, alignItems: 'center' }}>
            {ALL_COLORS.map((color) => (
                <Title key={color} color={color} size="middle">
                    {color}
                </Title>
            ))}
        </div>
    ),
};
