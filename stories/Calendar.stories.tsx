import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';
import { useState } from 'react';
import { Calendar, type CalendarEvent, type CalendarProps } from '../src';

const events: CalendarEvent[] = [
    { title: '海岛野餐', start: '2026-08-08', end: '2026-08-10', color: 'teal' },
    { title: '博物馆参观', start: '2026-08-15T09:00', showTime: true, color: 'amber' },
    { title: '钓鱼大会', start: '2026-08-15T12:00', showTime: true, color: 'coral' },
    { title: '生日派对', start: '2026-08-15T18:00', color: 'purple' },
    { title: '周末集市', start: '2026-08-15T19:00', color: 'green' },
    { title: '海边散步', start: '2026-08-24', end: '2026-08-26', color: 'green' },
];

const meta = {
    title: 'Components/Calendar',
    component: Calendar,
    tags: ['autodocs'],
    args: { defaultValue: '2026-08-15', width: 750, 'aria-label': '海岛日历' },
    argTypes: {
        value: { control: 'text', description: '受控选中日期（YYYY-MM-DD）' },
        panelValue: { control: 'text', description: '受控显示月份（YYYY-MM）' },
        showEventTime: { control: 'boolean' },
        draggableEvents: { control: 'boolean', description: '用鼠标拖选日期范围创建事项' },
        width: { control: 'number' },
    },
} satisfies Meta<typeof Calendar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithEvents: Story = {
    args: { events },
    parameters: { docs: { description: { story: '跨周事项自动分段，超过两行的事项通过 +N 提示，完整事项名称包含在日期的无障碍标签中。' } } },
};

export const WithoutEventTime: Story = { args: { events, showEventTime: false } };

export const Controlled: Story = {
    args: { value: '2026-08-15', panelValue: '2026-08', events },
    parameters: { docs: { description: { story: '固定的受控值：点击或翻页触发回调，但需要调用方更新属性才会改变选中日期或月份。' } } },
};

function InteractiveCalendar(args: CalendarProps) {
    const [value, setValue] = useState('2026-08-15');
    const [panel, setPanel] = useState('2026-08');
    const [created, setCreated] = useState('尚未创建');
    const [draggable, setDraggable] = useState(true);
    return (
        <section data-testid="calendar-interactive" style={{ display: 'grid', gap: 12, width: 'fit-content', maxWidth: '100%' }}>
            <button type="button" onClick={() => setDraggable(!draggable)}>{draggable ? '禁用拖拽' : '启用拖拽'}</button>
            <Calendar
                {...args}
                value={value}
                panelValue={panel}
                events={events}
                draggableEvents={draggable}
                onChange={setValue}
                onPanelChange={setPanel}
                onEventCreate={(start, end) => setCreated(`${start} → ${end}`)}
            />
            <output aria-label="选中日期">{value}</output>
            <output aria-label="显示月份">{panel}</output>
            <output aria-label="创建的事项范围">{created}</output>
        </section>
    );
}

// No play function: browser behavior tests exercise this state independently.
export const Interactive: Story = { render: (args) => <InteractiveCalendar {...args} /> };

function DeferredControlledCalendar(args: CalendarProps) {
    const [value, setValue] = useState('2026-08-15');
    const [panel, setPanel] = useState('2026-08');
    const [requestedPanel, setRequestedPanel] = useState('');
    return (
        <section style={{ display: 'grid', gap: 12, width: 'fit-content' }}>
            <div style={{ display: 'flex', gap: 12 }}>
                <button type="button" onClick={() => setValue('2026-08-10')}>外部选择8月10日</button>
                <button type="button" disabled={!requestedPanel} onClick={() => setPanel(requestedPanel)}>应用请求月份</button>
                <input aria-label="日历外输入框" placeholder="日历外输入框" />
            </div>
            <Calendar {...args} value={value} panelValue={panel} onChange={setValue} onPanelChange={setRequestedPanel} />
            <output aria-label="选中日期">{value}</output>
            <output aria-label="显示月份">{panel}</output>
            <output aria-label="请求月份">{requestedPanel || '尚未请求'}</output>
        </section>
    );
}

export const DeferredControlled: Story = {
    render: (args) => <DeferredControlledCalendar {...args} />,
    parameters: { docs: { description: { story: '调用方可以外部更新选中值，或稍后再接受翻月请求；键盘焦点仍独立保留在当前日期。' } } },
};

export const KeyboardNavigation: Story = {
    render: (args) => <InteractiveCalendar {...args} />,
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        const cell = canvas.getByRole('gridcell', { name: '2026-08-20' });
        await userEvent.click(cell);
        await userEvent.keyboard('{ArrowRight}{Enter}');
        await expect(canvas.getByLabelText('选中日期')).toHaveTextContent('2026-08-21');
        await userEvent.keyboard('{PageDown}');
        await expect(canvas.getByLabelText('显示月份')).toHaveTextContent('2026-09');
        await expect(canvas.getByRole('gridcell', { name: '2026-09-21' })).toHaveFocus();
    },
};

export const Stable: Story = { args: { events } };
export const Narrow: Story = { args: { events, width: 420 } };
