import type { Meta, StoryObj } from '@storybook/react';
import type { CSSProperties } from 'react';
import { useState } from 'react';
import { expect, screen, userEvent, within } from 'storybook/test';
import { Button, Drawer, notificationOpen } from '../src';

const meta = {
    title: 'Regression/Parity/Notification Drawer',
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
    maxWidth: 780,
    fontFamily: 'var(--animal-font-family)',
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
    gap: 10,
} satisfies CSSProperties;

const labelStyle = {
    color: '#a0936e',
    fontSize: 13,
    fontWeight: 700,
} satisfies CSSProperties;

const NOTIF_TYPES = ['success', 'info', 'warning', 'error'] as const;
const POSITIONS = ['top', 'topLeft', 'topRight', 'bottom', 'bottomLeft', 'bottomRight'] as const;
const DRAWER_PLACEMENTS = ['left', 'right', 'top', 'bottom'] as const;

function NotificationTriggers() {
    return (
        <div style={pageStyle}>
            <div style={sectionStyle}>
                <div style={labelStyle}>通知类型</div>
                <div style={rowStyle}>
                    {NOTIF_TYPES.map((type) => (
                        <Button
                            key={type}
                            size="small"
                            onClick={() =>
                                notificationOpen({
                                    type,
                                    message: `${type} 通知`,
                                    description: `这是一条 ${type} 消息`,
                                    position: 'topRight',
                                    duration: 2,
                                })
                            }
                        >
                            {type}
                        </Button>
                    ))}
                </div>
            </div>
            <div style={sectionStyle}>
                <div style={labelStyle}>位置</div>
                <div style={rowStyle}>
                    {POSITIONS.map((p) => (
                        <Button
                            key={p}
                            size="small"
                            onClick={() =>
                                notificationOpen({
                                    type: 'info',
                                    message: p,
                                    position: p,
                                    duration: 2,
                                })
                            }
                        >
                            {p}
                        </Button>
                    ))}
                </div>
            </div>
        </div>
    );
}

export const NotificationParity: Story = {
    name: 'Notification — types / placements',
    render: () => <NotificationTriggers />,
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        const successBtn = canvas.getByText('success');
        await userEvent.click(successBtn);
        const notifEl = await screen.findByText('success 通知', {}, { timeout: 3000 });
        expect(notifEl.closest('.animal-notification')).not.toBeNull();
    },
};

function DrawerShowcase() {
    const [openPlacement, setOpenPlacement] = useState<
        'left' | 'right' | 'top' | 'bottom' | null
    >(null);

    return (
        <div style={pageStyle}>
            <div style={sectionStyle}>
                <div style={labelStyle}>Placement</div>
                <div style={rowStyle}>
                    {DRAWER_PLACEMENTS.map((p) => (
                        <Button key={p} size="small" onClick={() => setOpenPlacement(p)}>
                            {p}
                        </Button>
                    ))}
                </div>
            </div>

            {DRAWER_PLACEMENTS.map((p) => (
                <Drawer
                    key={p}
                    open={openPlacement === p}
                    placement={p}
                    title={`${p} 抽屉`}
                    onClose={() => setOpenPlacement(null)}
                    footer={
                        <Button size="small" onClick={() => setOpenPlacement(null)}>
                            关闭
                        </Button>
                    }
                >
                    <p style={{ color: '#725d42' }}>这是 {p} 方向的 Drawer 内容。</p>
                </Drawer>
            ))}
        </div>
    );
}

export const DrawerParity: Story = {
    name: 'Drawer — placements / focus-trap / ESC',
    render: () => <DrawerShowcase />,
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        const rightBtn = canvas.getByText('right');
        await userEvent.click(rightBtn);
        const panel = await screen.findByRole('dialog', {}, { timeout: 3000 });
        expect(panel).not.toBeNull();
        await userEvent.keyboard('{Escape}');
        await expect(screen.queryByRole('dialog')).toBeNull();
    },
};

export const DrawerNoPlay: Story = {
    name: 'Drawer — static (no play, for Playwright)',
    render: () => {
        const [open, setOpen] = useState(false);
        return (
            <div style={{ padding: 24, fontFamily: 'var(--animal-font-family)' }}>
                <Button onClick={() => setOpen(true)}>打开抽屉</Button>
                <Drawer
                    open={open}
                    title="测试抽屉"
                    onClose={() => setOpen(false)}
                >
                    <p style={{ color: '#725d42' }}>抽屉内容</p>
                </Drawer>
            </div>
        );
    },
};
