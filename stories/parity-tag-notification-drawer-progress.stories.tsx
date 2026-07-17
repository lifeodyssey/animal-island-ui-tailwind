import type { Meta, StoryObj } from '@storybook/react';
import type { CSSProperties } from 'react';
import { useState } from 'react';
import { Tag, Drawer, Progress } from '../src';

const meta = {
    title: 'Regression/Parity/Tag Notification Drawer Progress',
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
    maxWidth: 760,
} satisfies CSSProperties;

const sectionStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
} satisfies CSSProperties;

const rowStyle = {
    display: 'flex',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 12,
} satisfies CSSProperties;

const titleStyle = {
    margin: 0,
    color: 'var(--animal-text-color)',
    fontFamily: 'var(--animal-font-family)',
    fontSize: 18,
    fontWeight: 700,
} satisfies CSSProperties;

// ─── Tag ─────────────────────────────────────────────────────────────────────

export const TagStory: Story = {
    name: 'Tag',
    render: () => (
        <div style={pageStyle}>
            <div style={sectionStyle}>
                <h3 style={titleStyle}>Sizes</h3>
                <div style={rowStyle}>
                    <Tag size="small">Small</Tag>
                    <Tag size="medium">Medium</Tag>
                    <Tag size="large">Large</Tag>
                </div>
            </div>
            <div style={sectionStyle}>
                <h3 style={titleStyle}>Variants</h3>
                <div style={rowStyle}>
                    <Tag variant="solid">Solid</Tag>
                    <Tag variant="outlined">Outlined</Tag>
                    <Tag variant="dashed">Dashed</Tag>
                </div>
            </div>
            <div style={sectionStyle}>
                <h3 style={titleStyle}>Colors (solid)</h3>
                <div style={rowStyle}>
                    <Tag color="app-pink">Pink</Tag>
                    <Tag color="purple">Purple</Tag>
                    <Tag color="app-blue">Blue</Tag>
                    <Tag color="app-yellow">Yellow</Tag>
                    <Tag color="app-teal">Teal</Tag>
                    <Tag color="app-green">Green</Tag>
                </div>
            </div>
            <div style={sectionStyle}>
                <h3 style={titleStyle}>Closable</h3>
                <div style={rowStyle}>
                    <Tag closable>Closable</Tag>
                    <Tag closable color="app-pink">Pink Closable</Tag>
                    <Tag closable disabled>Disabled Closable</Tag>
                </div>
            </div>
            <div style={sectionStyle}>
                <h3 style={titleStyle}>Clickable + Disabled</h3>
                <div style={rowStyle}>
                    {/* eslint-disable-next-line no-alert */}
                    <Tag onClick={() => alert('clicked')}>Clickable</Tag>
                    <Tag disabled onClick={() => undefined}>Disabled</Tag>
                </div>
            </div>
        </div>
    ),
};

// ─── Drawer ───────────────────────────────────────────────────────────────────

function DrawerDemo() {
    const [open, setOpen] = useState(false);
    const [placement, setPlacement] = useState<'left' | 'right'>('right');
    return (
        <div style={pageStyle}>
            <div style={sectionStyle}>
                <h3 style={titleStyle}>Drawer</h3>
                <div style={rowStyle}>
                    <button
                        type="button"
                        onClick={() => { setPlacement('right'); setOpen(true); }}
                        style={{ padding: '8px 16px', cursor: 'pointer' }}
                    >
                        Open Right
                    </button>
                    <button
                        type="button"
                        onClick={() => { setPlacement('left'); setOpen(true); }}
                        style={{ padding: '8px 16px', cursor: 'pointer' }}
                    >
                        Open Left
                    </button>
                </div>
                <Drawer
                    open={open}
                    title="Drawer Title"
                    placement={placement}
                    onClose={() => setOpen(false)}
                    footer={
                        <div style={rowStyle}>
                            <button type="button" onClick={() => setOpen(false)}>Cancel</button>
                        </div>
                    }
                >
                    <p>Drawer body content goes here.</p>
                    <p>More content...</p>
                </Drawer>
            </div>
        </div>
    );
}

export const DrawerStory: Story = {
    name: 'Drawer',
    render: () => <DrawerDemo />,
};

// ─── Progress ─────────────────────────────────────────────────────────────────

export const ProgressStory: Story = {
    name: 'Progress',
    render: () => (
        <div style={pageStyle}>
            <div style={sectionStyle}>
                <h3 style={titleStyle}>Sizes</h3>
                <Progress percent={60} size="small" />
                <Progress percent={60} size="middle" />
                <Progress percent={60} size="large" />
            </div>
            <div style={sectionStyle}>
                <h3 style={titleStyle}>Info Positions</h3>
                <Progress percent={75} infoPosition="inside" />
                <Progress percent={75} infoPosition="right" />
                <Progress percent={75} infoPosition="top" />
            </div>
            <div style={sectionStyle}>
                <h3 style={titleStyle}>Edge Cases</h3>
                <Progress percent={0} />
                <Progress percent={100} />
                <Progress percent={50} showInfo={false} />
                <Progress percent={50} infoFormat={(p) => `${p} pts`} />
            </div>
        </div>
    ),
};
