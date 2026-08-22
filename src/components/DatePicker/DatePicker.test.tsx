import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DatePicker } from './DatePicker';

function ControlledHost<V, C>({ initial, onChange, children }: { initial: V; onChange?: (v: C) => void; children: (props: { value: V; onChange: (v: C) => void }) => React.ReactNode }) {
    const [value, setValue] = React.useState(initial);
    return <>{children({ value, onChange: (v) => { setValue(v as unknown as V); onChange?.(v); } })}</>;
}

/** 面板带退场动效（0.2s），等待动画结束、面板真正卸载后再断言 */
const expectPanelClosed = async () => waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());

describe('DatePicker', () => {
    beforeEach(() => {
        vi.useFakeTimers({ toFake: ['Date'] });
        vi.setSystemTime(new Date('2026-08-10T12:00:00'));
    });

    describe('rendering', () => {
        it('渲染占位文本', () => {
            vi.useRealTimers();
            render(<DatePicker placeholder="选择生日" />);
            expect(screen.getByText('选择生日')).toBeInTheDocument();
        });

        it('按 format 展示受控值', () => {
            vi.useRealTimers();
            render(<DatePicker value="2026-08-10" format="YYYY年MM月DD日" />);
            expect(screen.getByText('2026年08月10日')).toBeInTheDocument();
        });

        it('非法 value 回退到占位文本', () => {
            vi.useRealTimers();
            render(<DatePicker value="not-a-date" />);
            expect(screen.getByText('请选择日期')).toBeInTheDocument();
        });

        it('应用 size / status 类', () => {
            vi.useRealTimers();
            render(<DatePicker size="large" status="error" />);
            const trigger = screen.getByRole('combobox');
            expect(trigger).toHaveClass('animal-datepicker-trigger-large');
            expect(trigger).toHaveClass('animal-datepicker-trigger-error');
        });

        it('支持 aria-label 无障碍标签', () => {
            vi.useRealTimers();
            render(<DatePicker aria-label="选择生日" />);
            expect(screen.getByRole('combobox', { name: '选择生日' })).toBeInTheDocument();
        });
    });

    describe('展开与选择', () => {
        it('点击触发区展开面板，点击外部关闭', async () => {
            const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime.bind(vi) });
            render(<DatePicker />);
            await user.click(screen.getByRole('combobox'));
            expect(screen.getByRole('dialog')).toBeInTheDocument();
            await user.click(document.body);
            await expectPanelClosed();
        });

        it('点选日期仅更新待选值，点击确定后提交并关闭', async () => {
            const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime.bind(vi) });
            const onChange = vi.fn();
            render(<DatePicker defaultValue="2026-08-10" onChange={onChange} />);
            await user.click(screen.getByRole('combobox'));
            await user.click(screen.getByRole('button', { name: '2026年8月15日' }));
            expect(screen.getByRole('dialog')).toBeInTheDocument();
            expect(onChange).not.toHaveBeenCalled();
            expect(screen.getByText('2026-08-15')).toBeInTheDocument();
            await user.click(screen.getByRole('button', { name: '确定' }));
            expect(onChange).toHaveBeenCalledWith('2026-08-15');
            await expectPanelClosed();
        });

        it('无待选值时确定仅关闭面板不回调', async () => {
            const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime.bind(vi) });
            const onChange = vi.fn();
            render(<DatePicker defaultValue="2026-08-10" onChange={onChange} />);
            await user.click(screen.getByRole('combobox'));
            await user.click(screen.getByRole('button', { name: '确定' }));
            expect(onChange).not.toHaveBeenCalled();
            await expectPanelClosed();
        });

        it('受控模式：选择后回调且不回写内部状态', async () => {
            const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime.bind(vi) });
            const onChange = vi.fn();
            render(
                <ControlledHost<string | null, import('./DatePicker').DatePickerValue> initial="2026-08-10" onChange={onChange}>
                    {({ value, onChange: set }) => <DatePicker value={value ?? undefined} onChange={(v) => set(v)} />}
                </ControlledHost>
            );
            await user.click(screen.getByRole('combobox'));
            await user.click(screen.getByRole('button', { name: '2026年8月15日' }));
            await user.click(screen.getByRole('button', { name: '确定' }));
            expect(onChange).toHaveBeenLastCalledWith('2026-08-15');
        });

        it('受控 open 直接展开面板', () => {
            vi.useRealTimers();
            render(<DatePicker open aria-label="选择日期" />);
            expect(screen.getByRole('dialog')).toBeInTheDocument();
        });
    });

    describe('disabled / clear', () => {
        it('disabled 禁用触发区且不可展开', async () => {
            const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime.bind(vi) });
            render(<DatePicker disabled />);
            const trigger = screen.getByRole('combobox');
            expect(trigger).toHaveAttribute('aria-disabled', 'true');
            expect(trigger.parentElement).toHaveClass('animal-datepicker-wrapper-disabled');
            await user.click(trigger);
            expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
        });

        it('allowClear 显示清除按钮，点击清空并触发 onChange(null)', async () => {
            vi.useRealTimers();
            const user = userEvent.setup();
            const onChange = vi.fn();
            render(<DatePicker defaultValue="2026-08-10" allowClear onChange={onChange} />);
            const clear = screen.getByRole('button', { name: '清除日期' });
            await user.click(clear);
            expect(onChange).toHaveBeenCalledWith(null);
            expect(screen.getByText('请选择日期')).toBeInTheDocument();
            expect(screen.queryByRole('button', { name: '清除日期' })).not.toBeInTheDocument();
        });

        it('allowClear 在空值时不渲染清除按钮', () => {
            vi.useRealTimers();
            render(<DatePicker allowClear />);
            expect(screen.queryByRole('button', { name: '清除日期' })).not.toBeInTheDocument();
        });
    });

    describe('月份选择模式', () => {
        it('展开后面板直接显示月份网格', async () => {
            const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime.bind(vi) });
            render(<DatePicker picker="month" />);
            await user.click(screen.getByRole('combobox'));
            expect(screen.getByRole('button', { name: '8月' })).toBeInTheDocument();
        });

        it('点击月份并确定后提交 YYYY-MM', async () => {
            const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime.bind(vi) });
            const onChange = vi.fn();
            render(<DatePicker picker="month" onChange={onChange} />);
            await user.click(screen.getByRole('combobox'));
            await user.click(screen.getByRole('button', { name: '8月' }));
            expect(screen.getByText('2026-08')).toBeInTheDocument();
            await user.click(screen.getByRole('button', { name: '确定' }));
            expect(onChange).toHaveBeenCalledWith('2026-08');
            await expectPanelClosed();
        });

        it('点击月份后该格出现选中高亮', async () => {
            const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime.bind(vi) });
            render(<DatePicker picker="month" />);
            await user.click(screen.getByRole('combobox'));
            await user.click(screen.getByRole('button', { name: '9月' }));
            expect(screen.getByRole('button', { name: '9月' })).toHaveClass('animal-datepicker-month-cell-selected');
        });
    });
});
