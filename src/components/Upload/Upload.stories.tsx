import type { Meta, StoryObj } from '@storybook/react';
import { Upload } from './Upload';
import type { UploadFile } from './Upload';

const meta: Meta<typeof Upload> = {
    title: 'Components/Upload',
    component: Upload,
    parameters: {
        layout: 'padded',
    },
};

export default meta;
type Story = StoryObj<typeof Upload>;

export const Default: Story = {
    args: {
        'aria-label': '上传文件',
    },
};

export const WithTip: Story = {
    args: {
        tip: '支持 JPG、PNG、PDF，单文件不超过 10MB',
        'aria-label': '上传文件',
    },
};

export const Drag: Story = {
    args: {
        drag: true,
        'aria-label': '拖拽上传',
    },
};

export const DragWithTip: Story = {
    args: {
        drag: true,
        tip: '支持 JPG、PNG、PDF，单文件不超过 10MB',
        'aria-label': '拖拽上传',
    },
};

export const PictureList: Story = {
    args: {
        listType: 'picture',
        'aria-label': '上传图片',
    },
};

export const PictureCard: Story = {
    args: {
        listType: 'picture-card',
        'aria-label': '上传图片卡片',
    },
};

export const Disabled: Story = {
    args: {
        disabled: true,
        'aria-label': '上传文件（已禁用）',
    },
};

export const DisabledWithFiles: Story = {
    args: {
        disabled: true,
        defaultFileList: [
            { uid: 'f1', name: 'document.pdf', size: 204800, status: 'done' },
            { uid: 'f2', name: 'image.png', size: 51200, status: 'done' },
        ],
        'aria-label': '上传文件（已禁用）',
    },
};

export const WithExistingFiles: Story = {
    args: {
        defaultFileList: [
            { uid: 'f1', name: 'annual-report.pdf', size: 1024 * 1024 * 2.4, status: 'done' },
            { uid: 'f2', name: 'photo.jpg', size: 1024 * 512, status: 'error' },
            { uid: 'f3', name: 'notes.txt', size: 1024 * 8, status: 'uploading', percent: 65 },
        ],
        'aria-label': '上传文件',
    },
};

export const MaxCount: Story = {
    args: {
        maxCount: 3,
        tip: '最多上传 3 个文件',
        'aria-label': '上传文件（最多3个）',
    },
};

export const AcceptImages: Story = {
    args: {
        accept: 'image/*',
        tip: '仅支持图片格式',
        'aria-label': '上传图片',
    },
};

export const Multiple: Story = {
    args: {
        multiple: true,
        tip: '可多选文件',
        'aria-label': '多选上传',
    },
};

export const WithPreviewFiles: Story = {
    args: {
        listType: 'picture-card',
        defaultFileList: [
            {
                uid: 'img1',
                name: 'sample.jpg',
                size: 1024 * 45,
                status: 'done',
                thumbUrl: 'https://images.unsplash.com/photo-1518717758536-85ae29035b6d?w=84',
            } as UploadFile,
        ],
        'aria-label': '图片列表',
    },
};
