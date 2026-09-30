import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Upload, UploadFile } from './Upload';

const meta = {
    component: Upload,
    tags: ['ai-generated'],
} satisfies Meta<typeof Upload>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {},
};

export const PictureCard: Story = {
    args: { listType: 'picture-card' },
};

export const Picture: Story = {
    args: { listType: 'picture' },
};

export const Multiple: Story = {
    args: { multiple: true },
};

export const Disabled: Story = {
    args: { disabled: true },
};

export const DragZone: Story = {
    args: { drag: true },
};

export const WithMaxCount: Story = {
    args: { maxCount: 3, multiple: true },
};

export const Controlled: Story = {
    args: {},
    render: () => {
        const [fileList, setFileList] = useState<UploadFile[]>([
            { uid: 'u1', name: 'example.png', status: 'done', percent: 100 },
        ]);
        return (
            <Upload
                fileList={fileList}
                onChange={({ fileList: nextList }) => setFileList(nextList)}
            />
        );
    },
};

export const CustomChildren: Story = {
    args: {},
    render: () => (
        <Upload>
            <button
                type="button"
                style={{
                    padding: '8px 20px',
                    background: '#19c8b9',
                    color: '#fff',
                    border: 'none',
                    borderRadius: 20,
                    cursor: 'pointer',
                }}
            >
                选择文件
            </button>
        </Upload>
    ),
};
