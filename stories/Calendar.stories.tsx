import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { expect, within } from 'storybook/test';
import { Calendar } from '../src';
import type { CalendarEvent } from '../src';

const meta = {
    title: 'Components/Calendar',
    component: Calendar,
    parameters: { layout: 'padded' },
    tags: ['autodocs'],
} satisfies Meta<typeof Calendar>;

export default meta;
type Story = StoryObj<typeof meta>;

const today = new Date();
const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

const sampleEvents: CalendarEvent[] = [
    {
        id: 'ev1',
        title: '团队会议',
        startDate: todayStr,
        endDate: todayStr,
        color: 'teal',
    },
    {
        id: 'ev2',
        title: '产品评审',
        startDate: (() => {
            const d = new Date(today);
            d.setDate(d.getDate() + 1);
            return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
        })(),
        endDate: (() => {
            const d = new Date(today);
            d.setDate(d.getDate() + 3);
            return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
        })(),
        color: 'amber',
    },
    {
        id: 'ev3',
        title: '年度总结',
        startDate: (() => {
            const d = new Date(today);
            d.setDate(d.getDate() + 5);
            return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
        })(),
        endDate: (() => {
            const d = new Date(today);
            d.setDate(d.getDate() + 5);
            return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
        })(),
        color: 'green',
    },
];

export const Default: Story = {
    args: {
        events: sampleEvents,
    },
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        const header = canvas.getByRole('button', { name: /今天|Today/i });
        await expect(header).toBeInTheDocument();
    },
};

export const NoEvents: Story = {
    args: {
        events: [],
    },
};

export const Controlled: Story = {
    render: () => {
        const [selected, setSelected] = useState<string | null>(todayStr);
        return (
            <div>
                <p style={{ marginBottom: 8, color: '#8a7b66', fontSize: 14 }}>
                    Selected: {selected ?? 'none'}
                </p>
                <Calendar
                    value={selected}
                    onChange={setSelected}
                    events={sampleEvents}
                />
            </div>
        );
    },
};

export const Draggable: Story = {
    args: {
        events: sampleEvents,
        draggableEvents: true,
    },
};

export const NoPlay_Default: Story = {
    name: 'NoPlay/Default',
    tags: ['!dev', '!autodocs'],
    args: {
        events: sampleEvents,
    },
};
