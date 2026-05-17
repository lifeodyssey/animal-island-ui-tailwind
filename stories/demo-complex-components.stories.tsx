import type { Meta, StoryObj } from '@storybook/react-vite';
import ComponentPage from '../demo/ComponentPage';

const meta = {
    title: 'Demo/复杂组件',
    parameters: {
        layout: 'padded',
    },
} satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

const renderDemoPage = (activeKey: string) => () => <ComponentPage activeKey={activeKey} />;

export const Time: Story = {
    name: 'Time 时间',
    render: renderDemoPage('time'),
};

export const Phone: Story = {
    name: 'Phone 手机',
    render: renderDemoPage('phone'),
};
