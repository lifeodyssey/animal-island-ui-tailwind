import type { Meta, StoryObj } from '@storybook/react';
import { Bell } from 'lucide-react';
import { Avatar, Badge } from '../src';

const meta = {
    title: 'Components/Badge',
    component: Badge,
    parameters: {
        layout: 'padded',
    },
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof Badge>;

export const Default: Story = {
    name: 'Default (wrapped)',
    render: () => (
        <div style={{ display: 'flex', gap: 24, alignItems: 'center', flexWrap: 'wrap' }}>
            <Badge count={5}>
                <Avatar>U</Avatar>
            </Badge>
            <Badge count={99}>
                <Avatar>U</Avatar>
            </Badge>
            <Badge count={100}>
                <Avatar>U</Avatar>
            </Badge>
            <Badge count={0} showZero>
                <Avatar>U</Avatar>
            </Badge>
        </div>
    ),
};

export const Dot: Story = {
    name: 'Dot variant',
    render: () => (
        <div style={{ display: 'flex', gap: 24, alignItems: 'center' }}>
            <Badge dot>
                <Avatar>U</Avatar>
            </Badge>
            <Badge dot color="app-teal">
                <Avatar>U</Avatar>
            </Badge>
            <Badge dot color="app-green">
                <Bell size={20} />
            </Badge>
        </div>
    ),
};

export const Standalone: Story = {
    name: 'Standalone',
    render: () => (
        <div style={{ display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap' }}>
            <Badge count={3} />
            <Badge count={12} color="app-pink" />
            <Badge count={99} color="app-orange" />
            <Badge count={7} color="app-teal" />
            <Badge count={5} color="app-green" />
            <Badge count={2} color="app-blue" />
            <Badge count={8} color="purple" />
            <Badge count={1} color="lime-green" />
            <Badge count={4} color="yellow-green" />
            <Badge count={6} color="brown" />
            <Badge count={9} color="warm-peach-pink" />
        </div>
    ),
};

export const Sizes: Story = {
    name: 'Sizes',
    render: () => (
        <div style={{ display: 'flex', gap: 24, alignItems: 'center' }}>
            <Badge count={5} size="medium">
                <Avatar>M</Avatar>
            </Badge>
            <Badge count={5} size="small">
                <Avatar>S</Avatar>
            </Badge>
        </div>
    ),
};
