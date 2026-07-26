import type { Meta, StoryObj } from '@storybook/react';
import type { CSSProperties } from 'react';
import { useState } from 'react';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import {
    Button,
    Drawer,
    Notification,
    Progress,
    Skeleton,
    SkeletonAvatar,
    SkeletonButton,
    SkeletonInput,
    Tag,
} from '../src';

const meta = {
    title: 'Regression/Parity/New Components',
    tags: ['!dev', '!autodocs'],
    parameters: {
        layout: 'padded',
    },
} satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

const pageStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: 28,
    maxWidth: 860,
    fontFamily: 'var(--animal-font-family)',
} satisfies CSSProperties;

const sectionStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: 14,
} satisfies CSSProperties;

const rowStyle = {
    display: 'flex',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 12,
} satisfies CSSProperties;

const labelStyle = {
    color: '#a0936e',
    fontSize: 13,
    fontWeight: 700,
} satisfies CSSProperties;

// ────────────────────────────────────────────────────────────────────────────
// Tag
// ────────────────────────────────────────────────────────────────────────────

export const TagVariants: Story = {
    name: 'Tag – variants & sizes',
    render: () => (
        <div style={pageStyle}>
            <div style={sectionStyle}>
                <span style={labelStyle}>Variant: soft (default)</span>
                <div style={rowStyle}>
                    <Tag>Default</Tag>
                    <Tag color="app-pink">Pink</Tag>
                    <Tag color="purple">Purple</Tag>
                    <Tag color="app-blue">Blue</Tag>
                    <Tag color="app-teal">Teal</Tag>
                    <Tag color="app-green">Green</Tag>
                    <Tag color="app-red">Red</Tag>
                </div>
            </div>
            <div style={sectionStyle}>
                <span style={labelStyle}>Variant: solid</span>
                <div style={rowStyle}>
                    <Tag variant="solid">Default</Tag>
                    <Tag variant="solid" color="app-pink">Pink</Tag>
                    <Tag variant="solid" color="purple">Purple</Tag>
                    <Tag variant="solid" color="app-blue">Blue</Tag>
                </div>
            </div>
            <div style={sectionStyle}>
                <span style={labelStyle}>Variant: outlined</span>
                <div style={rowStyle}>
                    <Tag variant="outlined">Default</Tag>
                    <Tag variant="outlined" color="app-pink">Pink</Tag>
                    <Tag variant="outlined" color="app-teal">Teal</Tag>
                </div>
            </div>
            <div style={sectionStyle}>
                <span style={labelStyle}>Variant: dashed</span>
                <div style={rowStyle}>
                    <Tag variant="dashed">Default</Tag>
                    <Tag variant="dashed" color="brown">Brown</Tag>
                </div>
            </div>
            <div style={sectionStyle}>
                <span style={labelStyle}>Sizes</span>
                <div style={rowStyle}>
                    <Tag size="small">Small</Tag>
                    <Tag size="medium">Medium</Tag>
                    <Tag size="large">Large</Tag>
                </div>
            </div>
            <div style={sectionStyle}>
                <span style={labelStyle}>Closable</span>
                <div style={rowStyle}>
                    <Tag closable>Closable</Tag>
                    <Tag closable color="app-pink">Closable Pink</Tag>
                    <Tag closable disabled>Disabled Closable</Tag>
                </div>
            </div>
        </div>
    ),
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        const tags = canvas.getAllByText('Default');
        expect(tags.length).toBeGreaterThan(0);
        const closeBtns = canvas.getAllByRole('button', { name: 'close' });
        expect(closeBtns.length).toBeGreaterThan(0);
    },
};

export const TagNoPlay: Story = {
    name: 'Tag – no-play snapshot',
    render: () => (
        <div style={rowStyle}>
            <Tag>Default</Tag>
            <Tag color="app-pink">Pink</Tag>
            <Tag variant="solid" color="purple">Purple Solid</Tag>
            <Tag closable>Closable</Tag>
        </div>
    ),
};

// ────────────────────────────────────────────────────────────────────────────
// Progress
// ────────────────────────────────────────────────────────────────────────────

export const ProgressVariants: Story = {
    name: 'Progress – variants',
    render: () => (
        <div style={{ ...pageStyle, maxWidth: 540 }}>
            <div style={sectionStyle}>
                <span style={labelStyle}>Info position: inside (default)</span>
                <Progress percent={0} aria-label="0%" />
                <Progress percent={25} aria-label="25%" />
                <Progress percent={50} aria-label="50%" />
                <Progress percent={75} aria-label="75%" />
                <Progress percent={100} aria-label="100%" />
            </div>
            <div style={sectionStyle}>
                <span style={labelStyle}>Info position: right</span>
                <Progress percent={60} infoPosition="right" aria-label="60% right" />
            </div>
            <div style={sectionStyle}>
                <span style={labelStyle}>Info position: top</span>
                <Progress percent={45} infoPosition="top" aria-label="45% top" />
            </div>
            <div style={sectionStyle}>
                <span style={labelStyle}>Sizes</span>
                <Progress percent={55} size="small" aria-label="55% small" />
                <Progress percent={55} size="middle" aria-label="55% middle" />
                <Progress percent={55} size="large" aria-label="55% large" />
            </div>
            <div style={sectionStyle}>
                <span style={labelStyle}>showInfo=false</span>
                <Progress percent={70} showInfo={false} aria-label="70% no info" />
            </div>
        </div>
    ),
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        const bars = canvas.getAllByRole('progressbar');
        expect(bars.length).toBeGreaterThan(0);
        const bar50 = bars[2];
        expect(bar50.getAttribute('aria-valuenow')).toBe('50');
    },
};

export const ProgressNoPlay: Story = {
    name: 'Progress – no-play snapshot',
    render: () => (
        <div style={{ maxWidth: 400 }}>
            <Progress percent={65} aria-label="65% progress" />
        </div>
    ),
};

// ────────────────────────────────────────────────────────────────────────────
// Skeleton
// ────────────────────────────────────────────────────────────────────────────

export const SkeletonVariants: Story = {
    name: 'Skeleton – variants',
    render: () => (
        <div style={{ ...pageStyle, maxWidth: 500 }}>
            <div style={sectionStyle}>
                <span style={labelStyle}>Text (default)</span>
                <Skeleton />
                <Skeleton width="60%" />
            </div>
            <div style={sectionStyle}>
                <span style={labelStyle}>Paragraph</span>
                <Skeleton variant="paragraph" rows={3} />
            </div>
            <div style={sectionStyle}>
                <span style={labelStyle}>Rect</span>
                <Skeleton variant="rect" widthValue="100%" heightValue={100} />
            </div>
            <div style={sectionStyle}>
                <span style={labelStyle}>Circle</span>
                <div style={rowStyle}>
                    <Skeleton variant="circle" widthValue={40} />
                    <Skeleton variant="circle" widthValue={56} />
                </div>
            </div>
            <div style={sectionStyle}>
                <span style={labelStyle}>Sub-components</span>
                <div style={rowStyle}>
                    <SkeletonAvatar size="small" />
                    <SkeletonAvatar size="middle" />
                    <SkeletonAvatar size="large" />
                    <SkeletonAvatar size="middle" shape="square" />
                </div>
                <div style={rowStyle}>
                    <SkeletonButton size="small" />
                    <SkeletonButton size="middle" />
                    <SkeletonButton size="large" />
                </div>
                <div style={rowStyle}>
                    <SkeletonInput size="small" />
                    <SkeletonInput size="middle" />
                    <SkeletonInput size="large" />
                </div>
            </div>
            <div style={sectionStyle}>
                <span style={labelStyle}>loading=false shows children</span>
                <Skeleton loading={false}>
                    <span>Loaded content</span>
                </Skeleton>
            </div>
        </div>
    ),
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        const loadedText = canvas.getByText('Loaded content');
        expect(loadedText).toBeTruthy();
    },
};

export const SkeletonNoPlay: Story = {
    name: 'Skeleton – no-play snapshot',
    render: () => (
        <div style={{ maxWidth: 400 }}>
            <Skeleton variant="paragraph" rows={3} />
        </div>
    ),
};

// ────────────────────────────────────────────────────────────────────────────
// Notification
// ────────────────────────────────────────────────────────────────────────────

const NotificationDemo = () => {
    return (
        <div style={rowStyle}>
            <Button
                onClick={() =>
                    Notification.success({ message: 'Success!', description: 'Operation completed.', duration: 3 })
                }
            >
                Success
            </Button>
            <Button
                onClick={() =>
                    Notification.info({ message: 'Info', description: 'Something to know.', duration: 3 })
                }
            >
                Info
            </Button>
            <Button
                onClick={() =>
                    Notification.warning({ message: 'Warning', description: 'Check this.', duration: 3 })
                }
            >
                Warning
            </Button>
            <Button
                onClick={() =>
                    Notification.error({ message: 'Error', description: 'Something went wrong.', duration: 3 })
                }
            >
                Error
            </Button>
        </div>
    );
};

export const NotificationVariants: Story = {
    name: 'Notification – imperative API',
    render: () => <NotificationDemo />,
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        const successBtn = canvas.getByRole('button', { name: 'Success' });
        await userEvent.click(successBtn);
        await waitFor(
            () => {
                const note = document.querySelector('.animal-notification');
                expect(note).not.toBeNull();
            },
            { timeout: 2000 }
        );
    },
};

// ────────────────────────────────────────────────────────────────────────────
// Drawer
// ────────────────────────────────────────────────────────────────────────────

const DrawerDemo = ({ placement }: { placement: 'left' | 'right' | 'top' | 'bottom' }) => {
    const [open, setOpen] = useState(false);
    return (
        <>
            <Button onClick={() => setOpen(true)}>Open {placement}</Button>
            <Drawer open={open} title={`Drawer (${placement})`} placement={placement} onClose={() => setOpen(false)}>
                <p>Drawer content for placement: {placement}</p>
            </Drawer>
        </>
    );
};

export const DrawerVariants: Story = {
    name: 'Drawer – placements',
    render: () => (
        <div style={rowStyle}>
            <DrawerDemo placement="right" />
            <DrawerDemo placement="left" />
            <DrawerDemo placement="top" />
            <DrawerDemo placement="bottom" />
        </div>
    ),
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        const openBtn = canvas.getByRole('button', { name: 'Open right' });
        await userEvent.click(openBtn);
        await waitFor(
            () => {
                const dialog = document.querySelector('[role="dialog"]');
                expect(dialog).not.toBeNull();
            },
            { timeout: 2000 }
        );
        const closeBtn = document.querySelector('.animal-drawer-close') as HTMLElement | null;
        if (closeBtn) await userEvent.click(closeBtn);
    },
};

export const DrawerNoPlay: Story = {
    name: 'Drawer – no-play snapshot',
    render: () => {
        const [open, setOpen] = useState(false);
        return (
            <>
                <Button onClick={() => setOpen(true)}>Open Drawer</Button>
                <Drawer open={open} title="My Drawer" onClose={() => setOpen(false)}>
                    <p>Drawer body content.</p>
                </Drawer>
            </>
        );
    },
};

