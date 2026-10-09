import type { Meta, StoryObj } from '@storybook/react';
import { User } from 'lucide-react';
import { Avatar, AvatarGroup } from '../src';

const meta = {
    title: 'Components/Avatar',
    component: Avatar,
    parameters: {
        layout: 'padded',
    },
} satisfies Meta<typeof Avatar>;

export default meta;
type Story = StoryObj<typeof Avatar>;

export const Default: Story = {
    name: 'Icon & Text avatars',
    render: () => (
        <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
            <Avatar />
            <Avatar icon={<User size={20} />} />
            <Avatar>AN</Avatar>
            <Avatar>岛</Avatar>
        </div>
    ),
};

export const Sizes: Story = {
    name: 'Sizes',
    render: () => (
        <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
            <Avatar size="small">S</Avatar>
            <Avatar size="middle">M</Avatar>
            <Avatar size="large">L</Avatar>
            <Avatar size={64}>64</Avatar>
        </div>
    ),
};

export const Shapes: Story = {
    name: 'Shapes',
    render: () => (
        <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
            <Avatar shape="circle">C</Avatar>
            <Avatar shape="square">S</Avatar>
            <Avatar shape="circle" size="large">AC</Avatar>
            <Avatar shape="square" size="large">AC</Avatar>
        </div>
    ),
};

export const Group: Story = {
    name: 'AvatarGroup',
    render: () => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <AvatarGroup>
                <Avatar>A</Avatar>
                <Avatar>B</Avatar>
                <Avatar>C</Avatar>
            </AvatarGroup>
            <AvatarGroup maxCount={3}>
                <Avatar>A</Avatar>
                <Avatar>B</Avatar>
                <Avatar>C</Avatar>
                <Avatar>D</Avatar>
                <Avatar>E</Avatar>
            </AvatarGroup>
        </div>
    ),
};
