import React, { useState, useEffect } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Progress } from './Progress';

const meta = {
    component: Progress,
    tags: ['ai-generated'],
    args: {
        percent: 50,
        size: 'middle',
        infoPosition: 'right',
        showInfo: true,
    },
} satisfies Meta<typeof Progress>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Default middle size, 50%, info on the right */
export const Default: Story = {
    args: { percent: 50 },
};

/** Various percentages */
export const Percentages: Story = {
    render: () => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 480 }}>
            {[0, 25, 50, 75, 100].map((p) => (
                <Progress key={p} percent={p} />
            ))}
        </div>
    ),
};

/** Three sizes */
export const Sizes: Story = {
    render: () => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 480 }}>
            <Progress percent={60} size="small" />
            <Progress percent={60} size="middle" />
            <Progress percent={60} size="large" />
        </div>
    ),
};

/** Info on top */
export const InfoTop: Story = {
    args: { percent: 65, infoPosition: 'top' },
};

/** Info inside the bar */
export const InfoInside: Story = {
    args: { percent: 65, size: 'large', infoPosition: 'inside' },
};

/** Inside info hidden when bar is too narrow (below 20%) */
export const InsideSmallPercent: Story = {
    args: { percent: 15, size: 'large', infoPosition: 'inside' },
};

/** Info hidden */
export const NoInfo: Story = {
    args: { percent: 40, showInfo: false },
};

/** Custom format */
export const CustomFormat: Story = {
    args: {
        percent: 75,
        format: (p) => `🐟 ${p}/100`,
    },
};

/** Custom stroke and trail colours */
export const CustomColors: Story = {
    render: () => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 480 }}>
            <Progress percent={70} strokeColor="#19c9b9" trailColor="#d9f4f2" />
            <Progress percent={45} strokeColor="#e07b54" trailColor="#fce3d9" />
            <Progress percent={90} strokeColor="#7bc87b" trailColor="#d9f0d9" />
        </div>
    ),
};

/** No transition (duration=0) */
export const NoTransition: Story = {
    args: { percent: 80, duration: 0 },
};

/** Animated progress (increments automatically) */
export const Animated: Story = {
    render: () => {
        const [percent, setPercent] = useState(0);
        useEffect(() => {
            const timer = setInterval(() => {
                setPercent((p) => (p >= 100 ? 0 : p + 5));
            }, 400);
            return () => clearInterval(timer);
        }, []);
        return (
            <div style={{ maxWidth: 480 }}>
                <Progress percent={percent} />
            </div>
        );
    },
};

/** All three info positions at once */
export const AllPositions: Story = {
    render: () => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24, maxWidth: 480 }}>
            <div>
                <p style={{ marginBottom: 4, fontSize: 12, opacity: 0.6 }}>right (default)</p>
                <Progress percent={55} infoPosition="right" />
            </div>
            <div>
                <p style={{ marginBottom: 4, fontSize: 12, opacity: 0.6 }}>top</p>
                <Progress percent={55} infoPosition="top" />
            </div>
            <div>
                <p style={{ marginBottom: 4, fontSize: 12, opacity: 0.6 }}>inside (large)</p>
                <Progress percent={55} size="large" infoPosition="inside" />
            </div>
        </div>
    ),
};
