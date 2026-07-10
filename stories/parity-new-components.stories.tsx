import type { Meta, StoryObj } from '@storybook/react';
import type { CSSProperties } from 'react';
import { useState } from 'react';
import { expect, userEvent, within } from 'storybook/test';
import {
    Button,
    Drawer,
    Notification,
    Progress,
    Tag,
    notificationOpen,
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

// ─────────────────────────────────────────────────
// Tag
// ─────────────────────────────────────────────────

export const TagParity: Story = {
    name: 'Tag',
    render: () => (
        <div style={pageStyle}>
            <div style={sectionStyle}>
                <div style={labelStyle}>Sizes</div>
                <div style={rowStyle}>
                    <Tag size="small">small</Tag>
                    <Tag size="medium">medium</Tag>
                    <Tag size="large">large</Tag>
                </div>
            </div>
            <div style={sectionStyle}>
                <div style={labelStyle}>Variants</div>
                <div style={rowStyle}>
                    <Tag variant="solid" color="app-pink">solid</Tag>
                    <Tag variant="outlined" color="app-pink">outlined</Tag>
                    <Tag variant="dashed" color="app-pink">dashed</Tag>
                </div>
            </div>
            <div style={sectionStyle}>
                <div style={labelStyle}>Colors (solid)</div>
                <div style={rowStyle}>
                    {(
                        [
                            'app-pink',
                            'purple',
                            'app-blue',
                            'app-yellow',
                            'app-orange',
                            'app-teal',
                            'app-green',
                            'app-red',
                            'lime-green',
                            'yellow-green',
                            'brown',
                            'warm-peach-pink',
                        ] as const
                    ).map((c) => (
                        <Tag key={c} color={c}>
                            {c}
                        </Tag>
                    ))}
                </div>
            </div>
            <div style={sectionStyle}>
                <div style={labelStyle}>Closable</div>
                <div style={rowStyle}>
                    <Tag closable color="app-teal">
                        closable
                    </Tag>
                    <Tag closable disabled color="purple">
                        disabled closable
                    </Tag>
                </div>
            </div>
            <div style={sectionStyle}>
                <div style={labelStyle}>Clickable</div>
                <div style={rowStyle}>
                    <Tag onClick={() => {}} color="app-green">
                        clickable
                    </Tag>
                    <Tag onClick={() => {}} disabled color="app-blue">
                        disabled clickable
                    </Tag>
                </div>
            </div>
        </div>
    ),
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        const solidTag = canvas.getAllByText('solid')[0];
        await expect(solidTag.closest('.animal-tag')).toHaveClass('animal-tag-solid');
        const outlinedTag = canvas.getAllByText('outlined')[0];
        await expect(outlinedTag.closest('.animal-tag')).toHaveClass('animal-tag-outlined');
    },
};

// ─────────────────────────────────────────────────
// Progress
// ─────────────────────────────────────────────────

export const ProgressParity: Story = {
    name: 'Progress',
    render: () => (
        <div style={{ ...pageStyle, maxWidth: 480 }}>
            <div style={sectionStyle}>
                <div style={labelStyle}>Sizes</div>
                <Progress percent={60} size="small" />
                <Progress percent={60} size="middle" />
                <Progress percent={60} size="large" />
            </div>
            <div style={sectionStyle}>
                <div style={labelStyle}>Info positions</div>
                <Progress percent={40} infoPosition="inside" />
                <Progress percent={40} infoPosition="right" />
                <Progress percent={40} infoPosition="top" />
            </div>
            <div style={sectionStyle}>
                <div style={labelStyle}>Edge values</div>
                <Progress percent={0} />
                <Progress percent={100} />
                <Progress percent={50} showInfo={false} />
            </div>
            <div style={sectionStyle}>
                <div style={labelStyle}>Custom format</div>
                <Progress percent={75} infoFormat={(p) => `${p} pts`} infoPosition="right" />
            </div>
        </div>
    ),
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        const bars = canvas.getAllByRole('progressbar');
        await expect(bars.length).toBeGreaterThan(0);
        await expect(bars[0]).toHaveAttribute('aria-valuemin', '0');
        await expect(bars[0]).toHaveAttribute('aria-valuemax', '100');
    },
};

// ─────────────────────────────────────────────────
// Notification
// ─────────────────────────────────────────────────

function NotificationDemo() {
    return (
        <div style={rowStyle}>
            {(['success', 'info', 'warning', 'error'] as const).map((type) => (
                <Button
                    key={type}
                    type="primary"
                    onClick={() =>
                        notificationOpen({
                            type,
                            message: `${type} notification`,
                            description: `This is a ${type} message.`,
                            duration: 2,
                        })
                    }
                >
                    {type}
                </Button>
            ))}
            <Notification />
        </div>
    );
}

export const NotificationParity: Story = {
    name: 'Notification',
    render: () => (
        <div style={pageStyle}>
            <div style={sectionStyle}>
                <div style={labelStyle}>Imperative API</div>
                <NotificationDemo />
            </div>
        </div>
    ),
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        const btn = canvas.getByRole('button', { name: 'success' });
        await userEvent.click(btn);
        await new Promise((r) => setTimeout(r, 100));
        const toast = document.querySelector('.animal-notification');
        await expect(toast).toBeTruthy();
    },
};

// ─────────────────────────────────────────────────
// Drawer
// ─────────────────────────────────────────────────

function DrawerDemo({ placement }: { placement: 'left' | 'right' | 'top' | 'bottom' }) {
    const [open, setOpen] = useState(false);
    return (
        <>
            <Button onClick={() => setOpen(true)}>{placement}</Button>
            <Drawer
                open={open}
                title={`${placement} Drawer`}
                placement={placement}
                onClose={() => setOpen(false)}
                footer={<Button onClick={() => setOpen(false)}>Close</Button>}
            >
                <p>Drawer content — placement: {placement}</p>
            </Drawer>
        </>
    );
}

export const DrawerParity: Story = {
    name: 'Drawer',
    render: () => (
        <div style={pageStyle}>
            <div style={sectionStyle}>
                <div style={labelStyle}>Placements</div>
                <div style={rowStyle}>
                    {(['right', 'left', 'top', 'bottom'] as const).map((p) => (
                        <DrawerDemo key={p} placement={p} />
                    ))}
                </div>
            </div>
        </div>
    ),
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        const btn = canvas.getByRole('button', { name: 'right' });
        await userEvent.click(btn);
        await new Promise((r) => setTimeout(r, 100));
        const dialog = document.querySelector('.animal-drawer-panel');
        await expect(dialog).toBeTruthy();
        await expect(dialog).toHaveClass('animal-drawer-panel-right');
        await expect(dialog).toHaveClass('animal-drawer-panel-open');
        const closeBtn = document.querySelector('.animal-drawer-close');
        await userEvent.click(closeBtn as HTMLElement);
    },
};
