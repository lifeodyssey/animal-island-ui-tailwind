import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Upload } from './Upload';
import type { UploadFile } from './Upload';

const meta = {
    component: Upload,
    tags: ['autodocs'],
    argTypes: {
        listType: {
            control: 'select',
            options: ['text', 'picture', 'picture-card'],
            description: '文件列表展示形态',
            table: { defaultValue: { summary: 'text' } },
        },
        multiple: { control: 'boolean', description: '是否支持多选' },
        disabled: { control: 'boolean', description: '是否禁用' },
        drag: { control: 'boolean', description: '是否开启拖拽上传区域' },
        maxCount: { control: 'number', description: '最多上传文件数' },
        showUploadList: { control: 'boolean', description: '是否显示文件列表' },
        tip: { control: 'text', description: '触发区下方的提示文字' },
        accept: { control: 'text', description: '接受的文件类型 (如 "image/*")' },
    },
} satisfies Meta<typeof Upload>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {
        children: undefined,
        tip: '支持单个或批量上传',
    },
};

export const Multiple: Story = {
    args: {
        multiple: true,
        tip: '可同时选择多个文件',
    },
};

export const DragUpload: Story = {
    name: 'Drag Upload',
    args: {
        drag: true,
        multiple: true,
        tip: '支持拖拽或点击上传',
    },
};

export const PictureList: Story = {
    name: 'Picture List',
    args: {
        listType: 'picture',
        multiple: true,
        tip: '带缩略图的文件列表',
    },
};

export const PictureCard: Story = {
    name: 'Picture Card',
    args: {
        listType: 'picture-card',
        multiple: true,
    },
};

export const WithPreloadedFiles: Story = {
    name: 'With Preloaded Files',
    render: () => {
        const files: UploadFile[] = [
            { uid: '1', name: 'document.pdf', size: 102400, status: 'done' },
            { uid: '2', name: 'image.png', size: 51200, status: 'uploading', percent: 45 },
            { uid: '3', name: 'broken.txt', size: 1024, status: 'error' },
        ];
        return <Upload fileList={files} onChange={() => {}} />;
    },
};

export const Disabled: Story = {
    args: {
        disabled: true,
        tip: '当前上传已禁用',
    },
};

export const MaxCount: Story = {
    name: 'Max Count',
    args: {
        maxCount: 3,
        tip: '最多上传 3 个文件',
    },
};
