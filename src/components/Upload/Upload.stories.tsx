import type { Meta, StoryObj } from '@storybook/react-vite';
import React from 'react';
import { Upload } from './Upload';
import type { UploadFile } from './Upload';

const meta = {
    component: Upload,
    tags: ['ai-generated'],
    args: {},
} satisfies Meta<typeof Upload>;

export default meta;
type Story = StoryObj<typeof meta>;

const wrapStyle: React.CSSProperties = { padding: 24, width: 460 };

export const Default: Story = {
    render: () => (
        <div style={wrapStyle}>
            <Upload />
        </div>
    ),
};

export const WithTip: Story = {
    render: () => (
        <div style={wrapStyle}>
            <Upload tip="支持 PNG、JPG、PDF，单文件不超过 10 MB" />
        </div>
    ),
};

export const Drag: Story = {
    render: () => (
        <div style={wrapStyle}>
            <Upload drag tip="支持 PNG、JPG、PDF，单文件不超过 10 MB" accept="image/*,.pdf" />
        </div>
    ),
};

export const PictureType: Story = {
    render: () => (
        <div style={wrapStyle}>
            <Upload listType="picture" multiple tip="行内缩略图 picture 模式" accept="image/*" />
        </div>
    ),
};

export const PictureCardType: Story = {
    render: () => (
        <div style={wrapStyle}>
            <Upload listType="picture-card" multiple accept="image/*" />
        </div>
    ),
};

export const Disabled: Story = {
    render: () => (
        <div style={wrapStyle}>
            <Upload disabled />
        </div>
    ),
};

const DEMO_FILES: UploadFile[] = [
    { uid: '1', name: 'photo.jpg', size: 102400, type: 'image/jpeg', status: 'done', percent: 100 },
    { uid: '2', name: 'report.pdf', size: 2048000, type: 'application/pdf', status: 'error', percent: 100 },
    { uid: '3', name: 'data.csv', size: 8192, type: 'text/csv', status: 'uploading', percent: 45 },
];

export const WithFileList: Story = {
    render: () => (
        <div style={wrapStyle}>
            <Upload fileList={DEMO_FILES} onChange={() => {}} />
        </div>
    ),
};
