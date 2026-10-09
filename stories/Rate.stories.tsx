import type { Meta, StoryObj } from '@storybook/react';
import { Rate } from '../src';

const meta = {
    title: 'Components/Rate',
    component: Rate,
    parameters: {
        layout: 'padded',
    },
} satisfies Meta<typeof Rate>;

export default meta;
type Story = StoryObj<typeof Rate>;

export const Default: Story = {
    name: 'Default',
    render: () => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <Rate defaultValue={3} />
            <Rate defaultValue={0} />
            <Rate defaultValue={5} />
        </div>
    ),
};

export const Sizes: Story = {
    name: 'Sizes',
    render: () => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <Rate size="small" defaultValue={3} />
            <Rate size="middle" defaultValue={3} />
            <Rate size="large" defaultValue={3} />
        </div>
    ),
};

export const Readonly: Story = {
    name: 'Readonly',
    render: () => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <Rate readonly defaultValue={4} />
            <Rate readonly defaultValue={2} size="small" />
            <Rate readonly defaultValue={5} size="large" />
        </div>
    ),
};
