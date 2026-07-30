import type { Meta, StoryObj } from '@storybook/react';
import type { CSSProperties } from 'react';
import { useState } from 'react';
import {
    BackTop,
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
    maxWidth: 980,
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
    fontSize: 14,
    fontWeight: 700,
} satisfies CSSProperties;

// ─── Tag ────────────────────────────────────────────────────────────────────

export const TagStory: Story = {
    name: 'Tag',
    render: () => (
        <div style={pageStyle}>
            <div style={sectionStyle}>
                <div style={labelStyle}>Variants</div>
                <div style={rowStyle}>
                    <Tag variant="solid">solid</Tag>
                    <Tag variant="soft">soft</Tag>
                    <Tag variant="outlined">outlined</Tag>
                    <Tag variant="dashed">dashed</Tag>
                </div>
            </div>
            <div style={sectionStyle}>
                <div style={labelStyle}>Sizes</div>
                <div style={rowStyle}>
                    <Tag size="small">small</Tag>
                    <Tag size="medium">medium</Tag>
                    <Tag size="large">large</Tag>
                </div>
            </div>
            <div style={sectionStyle}>
                <div style={labelStyle}>Colors (solid)</div>
                <div style={rowStyle}>
                    <Tag color="default">default</Tag>
                    <Tag color="app-pink">app-pink</Tag>
                    <Tag color="purple">purple</Tag>
                    <Tag color="app-blue">app-blue</Tag>
                    <Tag color="app-yellow">app-yellow</Tag>
                    <Tag color="app-teal">app-teal</Tag>
                    <Tag color="app-green">app-green</Tag>
                    <Tag color="app-red">app-red</Tag>
                </div>
            </div>
            <div style={sectionStyle}>
                <div style={labelStyle}>Closable</div>
                <div style={rowStyle}>
                    <Tag closable onClose={() => {}}>closable tag</Tag>
                    <Tag closable color="app-pink" onClose={() => {}}>pink closable</Tag>
                </div>
            </div>
            <div style={sectionStyle}>
                <div style={labelStyle}>Disabled</div>
                <div style={rowStyle}>
                    <Tag disabled>disabled tag</Tag>
                    <Tag disabled variant="outlined">disabled outlined</Tag>
                </div>
            </div>
        </div>
    ),
};

// ─── Progress ───────────────────────────────────────────────────────────────

export const ProgressStory: Story = {
    name: 'Progress',
    render: () => (
        <div style={pageStyle}>
            <div style={sectionStyle}>
                <div style={labelStyle}>Basic (inside info)</div>
                <Progress percent={30} />
                <Progress percent={60} />
                <Progress percent={100} />
            </div>
            <div style={sectionStyle}>
                <div style={labelStyle}>Info position: right</div>
                <Progress percent={45} infoPosition="right" />
            </div>
            <div style={sectionStyle}>
                <div style={labelStyle}>Info position: top</div>
                <Progress percent={70} infoPosition="top" />
            </div>
            <div style={sectionStyle}>
                <div style={labelStyle}>Sizes</div>
                <Progress percent={50} size="small" infoPosition="right" />
                <Progress percent={50} size="middle" infoPosition="right" />
                <Progress percent={50} size="large" infoPosition="right" />
            </div>
            <div style={sectionStyle}>
                <div style={labelStyle}>No info</div>
                <Progress percent={60} showInfo={false} />
            </div>
        </div>
    ),
};

// ─── Skeleton ───────────────────────────────────────────────────────────────

export const SkeletonStory: Story = {
    name: 'Skeleton',
    render: () => (
        <div style={pageStyle}>
            <div style={sectionStyle}>
                <div style={labelStyle}>Text (default)</div>
                <Skeleton />
            </div>
            <div style={sectionStyle}>
                <div style={labelStyle}>Paragraph</div>
                <Skeleton variant="paragraph" rows={4} />
            </div>
            <div style={sectionStyle}>
                <div style={labelStyle}>Circle</div>
                <Skeleton variant="circle" widthValue={56} />
            </div>
            <div style={sectionStyle}>
                <div style={labelStyle}>Rect</div>
                <Skeleton variant="rect" heightValue={80} />
            </div>
            <div style={sectionStyle}>
                <div style={labelStyle}>Sub-components</div>
                <div style={rowStyle}>
                    <SkeletonAvatar size="small" />
                    <SkeletonAvatar size="middle" />
                    <SkeletonAvatar size="large" />
                    <SkeletonAvatar shape="square" />
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
        </div>
    ),
};

// ─── Notification ───────────────────────────────────────────────────────────

const NotificationDemo = () => (
    <div style={pageStyle}>
        <div style={sectionStyle}>
            <div style={labelStyle}>Types</div>
            <div style={rowStyle}>
                <button
                    onClick={() => Notification.success({ message: 'Success!', description: 'Operation completed.' })}
                    style={{ padding: '8px 16px', cursor: 'pointer' }}
                >
                    Success
                </button>
                <button
                    onClick={() => Notification.info({ message: 'Info', description: 'Just so you know.' })}
                    style={{ padding: '8px 16px', cursor: 'pointer' }}
                >
                    Info
                </button>
                <button
                    onClick={() => Notification.warning({ message: 'Warning!', description: 'Check this out.' })}
                    style={{ padding: '8px 16px', cursor: 'pointer' }}
                >
                    Warning
                </button>
                <button
                    onClick={() => Notification.error({ message: 'Error', description: 'Something went wrong.' })}
                    style={{ padding: '8px 16px', cursor: 'pointer' }}
                >
                    Error
                </button>
            </div>
        </div>
        <div style={sectionStyle}>
            <div style={labelStyle}>Positions</div>
            <div style={rowStyle}>
                {(['top', 'topLeft', 'topRight', 'bottom', 'bottomLeft', 'bottomRight'] as const).map((pos) => (
                    <button
                        key={pos}
                        onClick={() => Notification.info({ message: pos, position: pos })}
                        style={{ padding: '8px 12px', cursor: 'pointer' }}
                    >
                        {pos}
                    </button>
                ))}
            </div>
        </div>
    </div>
);

export const NotificationStory: Story = {
    name: 'Notification',
    render: () => <NotificationDemo />,
};

// ─── Drawer ─────────────────────────────────────────────────────────────────

const DrawerDemo = () => {
    const [open, setOpen] = useState(false);
    const [placement, setPlacement] = useState<'left' | 'right' | 'top' | 'bottom'>('right');
    return (
        <div style={pageStyle}>
            <div style={sectionStyle}>
                <div style={labelStyle}>Placements</div>
                <div style={rowStyle}>
                    {(['left', 'right', 'top', 'bottom'] as const).map((p) => (
                        <button
                            key={p}
                            onClick={() => { setPlacement(p); setOpen(true); }}
                            style={{ padding: '8px 16px', cursor: 'pointer' }}
                        >
                            {p}
                        </button>
                    ))}
                </div>
            </div>
            <Drawer
                open={open}
                title="Animal Island Drawer"
                placement={placement}
                onClose={() => setOpen(false)}
                footer={
                    <button onClick={() => setOpen(false)} style={{ padding: '8px 16px', cursor: 'pointer' }}>
                        Close
                    </button>
                }
            >
                <p>Drawer content for placement: {placement}</p>
            </Drawer>
        </div>
    );
};

export const DrawerStory: Story = {
    name: 'Drawer',
    render: () => <DrawerDemo />,
};

// ─── BackTop ────────────────────────────────────────────────────────────────

export const BackTopStory: Story = {
    name: 'BackTop',
    render: () => (
        <div style={{ height: 1200, position: 'relative' }}>
            <div style={{ padding: 24, color: '#8a7b66', fontFamily: 'var(--animal-font-family)' }}>
                Scroll down to see the BackTop button appear.
            </div>
            <BackTop visibilityHeight={200} />
        </div>
    ),
};
