import type { Meta, StoryObj } from '@storybook/react-vite';
import { Card } from './Card';

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
