import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Skeleton, SkeletonButton, SkeletonInput, SkeletonAvatar } from './Skeleton';

const meta = {
    component: Skeleton,
    tags: ['ai-generated'],
    args: {
        active: false,
        variant: 'text',
    },
} satisfies Meta<typeof Skeleton>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Single text line (default) */
export const TextVariant: Story = {
    args: { variant: 'text', width: 240 },
};

/** Active shimmer on text */
export const TextActive: Story = {
    args: { variant: 'text', active: true, width: 240 },
};

/** Circle (avatar placeholder) */
export const CircleVariant: Story = {
    args: { variant: 'circle', width: 48, height: 48 },
};

/** Rectangle (image/media placeholder) */
export const RectVariant: Story = {
    args: { variant: 'rect', width: 240, height: 120 },
};

/** Paragraph block (multiple text lines) */
export const ParagraphVariant: Story = {
    args: { variant: 'paragraph', rows: 4 },
    render: (args) => (
        <div style={{ maxWidth: 480 }}>
            <Skeleton {...args} />
        </div>
    ),
};

/** Paragraph with active shimmer */
export const ParagraphActive: Story = {
    render: () => (
        <div style={{ maxWidth: 480 }}>
            <Skeleton variant="paragraph" active rows={4} />
        </div>
    ),
};

/** All variants in a grid */
export const AllVariants: Story = {
    render: () => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            <div>
                <p style={{ marginBottom: 8, fontSize: 12, opacity: 0.6 }}>text</p>
                <Skeleton variant="text" width={280} />
            </div>
            <div>
                <p style={{ marginBottom: 8, fontSize: 12, opacity: 0.6 }}>circle</p>
                <Skeleton variant="circle" width={48} height={48} />
            </div>
            <div>
                <p style={{ marginBottom: 8, fontSize: 12, opacity: 0.6 }}>rect</p>
                <Skeleton variant="rect" width={240} height={100} />
            </div>
            <div>
                <p style={{ marginBottom: 8, fontSize: 12, opacity: 0.6 }}>paragraph (3 rows)</p>
                <div style={{ maxWidth: 400 }}>
                    <Skeleton variant="paragraph" rows={3} />
                </div>
            </div>
        </div>
    ),
};

/** SkeletonButton sub-component */
export const ButtonSkeleton: Story = {
    render: () => (
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
            <SkeletonButton width={80} height={32} />
            <SkeletonButton width={120} height={32} active />
            <SkeletonButton width={160} height={40} active />
        </div>
    ),
};

/** SkeletonInput sub-component */
export const InputSkeleton: Story = {
    render: () => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 320 }}>
            <SkeletonInput />
            <SkeletonInput active />
            <SkeletonInput width={200} active />
        </div>
    ),
};

/** SkeletonAvatar sub-component */
export const AvatarSkeleton: Story = {
    render: () => (
        <div style={{ display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap' }}>
            <SkeletonAvatar size={32} />
            <SkeletonAvatar size={48} active />
            <SkeletonAvatar size={64} active />
            <SkeletonAvatar size={48} shape="square" active />
        </div>
    ),
};

/** Typical card-loading layout */
export const CardLoading: Story = {
    render: () => (
        <div
            style={{
                display: 'flex',
                gap: 16,
                padding: 20,
                border: '1px solid #e8e3d8',
                borderRadius: 12,
                maxWidth: 480,
            }}
        >
            <SkeletonAvatar size={56} active />
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 12 }}>
                <Skeleton variant="text" active width="60%" />
                <Skeleton variant="paragraph" active rows={2} />
            </div>
        </div>
    ),
};
