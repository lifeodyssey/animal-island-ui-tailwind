import type { Meta, StoryObj } from '@storybook/react';
import { Upload } from '../src';

const meta = {
    title: 'Components/Upload',
    component: Upload,
    parameters: {
        layout: 'padded',
    },
} satisfies Meta<typeof Upload>;

export default meta;
type Story = StoryObj<typeof Upload>;

export const Default: Story = {
    name: 'Default (text list)',
    render: () => (
        <div style={{ maxWidth: 480 }}>
            <Upload tip="支持单个或批量上传，支持各类文件格式" />
        </div>
    ),
};

export const DragZone: Story = {
    name: 'Drag zone',
    render: () => (
        <div style={{ maxWidth: 480 }}>
            <Upload drag tip="支持拖拽上传" multiple accept="image/*,.pdf" />
        </div>
    ),
};

export const PictureCard: Story = {
    name: 'Picture card',
    render: () => (
        <div style={{ maxWidth: 600 }}>
            <Upload listType="picture-card" multiple accept="image/*" />
        </div>
    ),
};

export const Disabled: Story = {
    name: 'Disabled',
    render: () => (
        <div style={{ maxWidth: 480 }}>
            <Upload disabled tip="上传已禁用" />
        </div>
    ),
};
