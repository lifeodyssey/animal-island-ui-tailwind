import { afterEach, describe, it, expect, vi } from 'vitest';
import { cleanup, render, screen, waitFor } from '@testing-library/react';
import { DatePicker, type DatePickerValue } from './DatePicker';
import { setup } from '@test/utils';
import { ControlledHost } from '@test/components';

const expectPanelClosed = async () => waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());

afterEach(() => { cleanup(); });

describe('DatePicker', () => {
    describe('rendering', () => {
        it('渲染占位文本', () => {
            render(<DatePicker placeholder="选择生日" />);
            expect(screen.getByText('选择生日')).toBeInTheDocument();
        });

        it('按 format 展示受控值', () => {
            render(<DatePicker value="2026-08-10" format="YYYY年MM月DD日" />);
            expect(screen.getByText('2026年08月10日')).toBeInTheDocument();
        });

        it('非法 value 回退到占位文本', () => {
            render(<DatePicker value="not-a-date" />);
            expect(screen.getByText('请选择日期')).toBeInTheDocument();
        });

        it('应用 size / status 类', () => {
            render(<DatePicker size="large" status="error" />);
            const trigger = screen.getByRole('combobox');
            expect(trigger).toHaveClass('animal-datepicker-trigger-large');
            expect(trigger).toHaveClass('animal-datepicker-trigger-error');
        });

        it('支持 aria-label 无障碍标签', () => {
            render(<DatePicker aria-label="选择生日" />);
            expect(screen.getByRole('combobox', { name: '选择生日' })).toBeInTheDocument();
        });
    });

    describe('展开与选择', () => {
        it('点击触发区展开面板，点击外部关闭', async () => {
            const user = setup();
            render(<DatePicker />);
            await user.click(screen.getByRole('combobox'));
            expect(screen.getByRole('dialog')).toBeInTheDocument();
            await user.click(document.body);
            await expectPanelClosed();
        });

        it('点击弹窗内部空白区域不关闭面板', async () => {
            const user = setup();
            render(<DatePicker defaultValue="2026-08-10" />);
            await user.click(screen.getByRole('combobox'));
            await user.click(screen.getByRole('dialog'));
            expect(screen.getByRole('dialog')).toBeInTheDocument();
        });

        it('点选日期仅更新待选值，点击确定后提交并关闭', async () => {
            const user = setup();
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
            const user = setup();
            const onChange = vi.fn();
            render(<DatePicker defaultValue="2026-08-10" onChange={onChange} />);
            await user.click(screen.getByRole('combobox'));
            await user.click(screen.getByRole('button', { name: '确定' }));
            expect(onChange).not.toHaveBeenCalled();
            await expectPanelClosed();
        });

        it('受控模式：选择后回调且不回写内部状态', async () => {
            const user = setup();
            const onChange = vi.fn();
            render(
                <ControlledHost<string | null, DatePickerValue> initial="2026-08-10" onChange={onChange}>
                    {({ value, onChange: set }) => <DatePicker value={value ?? undefined} onChange={(v) => set(v)} />}
                </ControlledHost>
            );
            await user.click(screen.getByRole('combobox'));
            await user.click(screen.getByRole('button', { name: '2026年8月15日' }));
            await user.click(screen.getByRole('button', { name: '确定' }));
            expect(onChange).toHaveBeenLastCalledWith('2026-08-15');
        });

        it('受控 open 直接展开面板', () => {
            render(<DatePicker open aria-label="选择日期" />);
            expect(screen.getByRole('dialog')).toBeInTheDocument();
        });
    });

    describe('disabled / clear', () => {
        it('disabled 禁用触发区且不可展开', async () => {
            const user = setup();
            render(<DatePicker disabled />);
            const trigger = screen.getByRole('combobox');
            expect(trigger).toHaveAttribute('aria-disabled', 'true');
            expect(trigger.parentElement).toHaveClass('animal-datepicker-wrapper-disabled');
            await user.click(trigger);
            expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
        });

        it('disabledDate 禁用周末日期且不可选中', async () => {
            const user = setup();
            const onChange = vi.fn();
            render(
                <DatePicker
                    defaultValue="2026-08-01"
                    onChange={onChange}
                    disabledDate={(d) => d.getDay() === 0 || d.getDay() === 6}
                />
            );
            await user.click(screen.getByRole('combobox'));
            const weekend = screen.getByRole('button', { name: '2026年8月1日' });
            expect(weekend).toHaveClass('animal-datepicker-day-disabled');
            expect(weekend).toBeDisabled();
            await user.click(weekend);
            expect(onChange).not.toHaveBeenCalled();
        });

        it('allowClear 显示清除按钮，点击清空并触发 onChange(null)', async () => {
            const user = setup();
            const onChange = vi.fn();
            render(<DatePicker defaultValue="2026-08-10" allowClear onChange={onChange} />);
            const clear = screen.getByRole('button', { name: '清除日期' });
            await user.click(clear);
            expect(onChange).toHaveBeenCalledWith(null);
            expect(screen.getByText('请选择日期')).toBeInTheDocument();
            expect(screen.queryByRole('button', { name: '清除日期' })).not.toBeInTheDocument();
        });

        it('allowClear 在空值时不渲染清除按钮', () => {
            render(<DatePicker allowClear />);
            expect(screen.queryByRole('button', { name: '清除日期' })).not.toBeInTheDocument();
        });
    });

    describe('键盘交互', () => {
        it('Tab 聚焦后 Enter 展开、Esc 关闭', async () => {
            const user = setup();
            render(<DatePicker />);
            await user.tab();
            await user.keyboard('{Enter}');
            expect(screen.getByRole('dialog')).toBeInTheDocument();
            await user.keyboard('{Escape}');
            await expectPanelClosed();
        });

        it('方向键移动焦点日期，Enter 设为待选，确定提交', async () => {
            const user = setup();
            const onChange = vi.fn();
            render(<DatePicker defaultValue="2026-08-10" onChange={onChange} />);
            await user.tab();
            await user.keyboard('{Enter}');
            await user.keyboard('{ArrowRight}');
            await user.keyboard('{Enter}');
            await user.click(screen.getByRole('button', { name: '确定' }));
            expect(onChange).toHaveBeenCalledWith('2026-08-11');
        });

        it('PageDown 切换到下个月视图', async () => {
            const user = setup();
            render(<DatePicker defaultValue="2026-08-10" />);
            await user.tab();
            await user.keyboard('{Enter}');
            await user.keyboard('{PageDown}');
            expect(screen.getByRole('button', { name: '2026年9月' })).toBeInTheDocument();
        });
    });

    describe('年 / 月 / 日视图切换', () => {
        it('点击标签进入年份选择，选中年份后进入月份选择，选中月份回到日期视图', async () => {
            const user = setup();
            render(<DatePicker defaultValue="2026-08-10" />);
            await user.click(screen.getByRole('combobox'));
            await user.click(screen.getByRole('button', { name: '2026年8月' }));
            await user.click(screen.getByRole('button', { name: '2028年' }));
            await user.click(screen.getByRole('button', { name: '3月' }));
            expect(screen.getByRole('button', { name: '2028年3月' })).toBeInTheDocument();
        });

        it('今天按钮：把今天设为待选日期，确定后提交', async () => {
            const user = setup();
            const onChange = vi.fn();
            render(<DatePicker defaultValue="2026-01-05" onChange={onChange} />);
            await user.click(screen.getByRole('combobox'));
            await user.click(screen.getByRole('button', { name: '今天' }));
            expect(screen.getByRole('dialog')).toBeInTheDocument();
            expect(onChange).not.toHaveBeenCalled();
            await user.click(screen.getByRole('button', { name: '确定' }));
            expect(onChange).toHaveBeenCalled();
            await expectPanelClosed();
        });

        it('单日期模式圈出今天', async () => {
            const user = setup();
            const today = new Date();
            const fmt = (d: Date) =>
                `${d.getFullYear()}-${`${d.getMonth() + 1}`.padStart(2, '0')}-${`${d.getDate()}`.padStart(2, '0')}`;
            render(<DatePicker defaultValue={fmt(today)} />);
            await user.click(screen.getByRole('combobox'));
            const todayCell = screen.getAllByRole('button', {
                name: `${today.getFullYear()}年${today.getMonth() + 1}月${today.getDate()}日`,
            })[0];
            expect(todayCell).toHaveClass('animal-datepicker-day-today');
        });
    });

    describe('范围选择模式', () => {
        it('分栏展示开始与结束日期', () => {
            render(<DatePicker range defaultValue={['2026-08-10', '2026-08-12']} />);
            expect(screen.getByText('2026-08-10')).toBeInTheDocument();
            expect(screen.getByText('2026-08-12')).toBeInTheDocument();
        });

        it('两次点选待选开始与结束日期，点击确定后提交并关闭', async () => {
            const user = setup();
            const onChange = vi.fn();
            render(<DatePicker range defaultValue={['2026-08-10', '2026-08-12']} onChange={onChange} />);
            await user.click(screen.getByRole('combobox'));
            await user.click(screen.getByRole('button', { name: '2026年8月15日' }));
            expect(screen.getByRole('dialog')).toBeInTheDocument();
            expect(screen.getByText('2026-08-15')).toBeInTheDocument();
            expect(screen.getByText('请选择日期')).toBeInTheDocument();
            await user.click(screen.getByRole('button', { name: '2026年8月20日' }));
            expect(screen.getByRole('dialog')).toBeInTheDocument();
            expect(onChange).not.toHaveBeenCalled();
            await user.click(screen.getByRole('button', { name: '确定' }));
            expect(onChange).toHaveBeenCalledWith(['2026-08-15', '2026-08-20']);
            await expectPanelClosed();
        });

        it('第二次点击早于开始日期时重置为新的开始日期', async () => {
            const user = setup();
            const onChange = vi.fn();
            render(<DatePicker range defaultValue={['2026-08-10', '2026-08-12']} onChange={onChange} />);
            await user.click(screen.getByRole('combobox'));
            await user.click(screen.getByRole('button', { name: '2026年8月15日' }));
            await user.click(screen.getByRole('button', { name: '2026年8月10日' }));
            expect(onChange).not.toHaveBeenCalled();
            await user.click(screen.getByRole('button', { name: '2026年8月12日' }));
            await user.click(screen.getByRole('button', { name: '确定' }));
            expect(onChange).toHaveBeenCalledWith(['2026-08-10', '2026-08-12']);
        });

        it('范围模式只选开始未选结束时确定仅关闭', async () => {
            const user = setup();
            const onChange = vi.fn();
            render(<DatePicker range defaultValue={['2026-08-10', '2026-08-12']} onChange={onChange} />);
            await user.click(screen.getByRole('combobox'));
            await user.click(screen.getByRole('button', { name: '2026年8月15日' }));
            await user.click(screen.getByRole('button', { name: '确定' }));
            expect(onChange).not.toHaveBeenCalled();
            await expectPanelClosed();
        });

        it('键盘回车依次待选开始与结束日期，确定后提交', async () => {
            const user = setup();
            const onChange = vi.fn();
            render(<DatePicker range defaultValue={['2026-08-10', '2026-08-12']} onChange={onChange} />);
            await user.tab();
            await user.keyboard('{Enter}');
            await user.keyboard('{ArrowRight}');
            await user.keyboard('{Enter}');
            await user.keyboard('{ArrowRight}');
            await user.keyboard('{Enter}');
            await user.click(screen.getByRole('button', { name: '确定' }));
            expect(onChange).toHaveBeenCalledWith(['2026-08-11', '2026-08-12']);
        });

        it('allowClear 清空范围', async () => {
            const user = setup();
            const onChange = vi.fn();
            render(<DatePicker range defaultValue={['2026-08-10', '2026-08-12']} allowClear onChange={onChange} />);
            await user.click(screen.getByRole('button', { name: '清除日期' }));
            expect(onChange).toHaveBeenCalledWith(null);
            expect(screen.getByText('请选择日期')).toBeInTheDocument();
        });

        it('选中范围端点与区间应用高亮类', async () => {
            const user = setup();
            render(<DatePicker range defaultValue={['2026-08-10', '2026-08-12']} />);
            await user.click(screen.getByRole('combobox'));
            expect(screen.getByRole('button', { name: '2026年8月10日' })).toHaveClass('animal-datepicker-day-range-start');
            expect(screen.getByRole('button', { name: '2026年8月12日' })).toHaveClass('animal-datepicker-day-range-end');
            expect(screen.getByRole('button', { name: '2026年8月11日' })).toHaveClass('animal-datepicker-day-in-range');
        });

        it('范围模式不圈出今天', async () => {
            const user = setup();
            const today = new Date();
            const fmt = (d: Date) =>
                `${d.getFullYear()}-${`${d.getMonth() + 1}`.padStart(2, '0')}-${`${d.getDate()}`.padStart(2, '0')}`;
            render(
                <DatePicker
                    range
                    defaultValue={[
                        fmt(today),
                        fmt(new Date(today.getFullYear(), today.getMonth(), today.getDate() + 2)),
                    ]}
                />
            );
            await user.click(screen.getByRole('combobox'));
            const todayCell = screen.getAllByRole('button', {
                name: `${today.getFullYear()}年${today.getMonth() + 1}月${today.getDate()}日`,
            })[0];
            expect(todayCell).not.toHaveClass('animal-datepicker-day-today');
        });
    });

    describe('月份选择模式', () => {
        it('展开后面板直接显示月份网格', async () => {
            const user = setup();
            render(<DatePicker picker="month" />);
            await user.click(screen.getByRole('combobox'));
            expect(screen.getByRole('button', { name: '8月' })).toBeInTheDocument();
            expect(screen.queryByRole('button', { name: /2026年8月15日/ })).not.toBeInTheDocument();
        });

        it('点击月份并确定后提交 YYYY-MM', async () => {
            const user = setup();
            const onChange = vi.fn();
            render(<DatePicker picker="month" onChange={onChange} />);
            await user.click(screen.getByRole('combobox'));
            await user.click(screen.getByRole('button', { name: '8月' }));
            expect(screen.getByText('2026-08')).toBeInTheDocument();
            await user.click(screen.getByRole('button', { name: '确定' }));
            expect(onChange).toHaveBeenCalledWith('2026-08');
            await expectPanelClosed();
        });

        it('展示受控月份值', () => {
            render(<DatePicker picker="month" value="2026-08" />);
            expect(screen.getByText('2026-08')).toBeInTheDocument();
        });

        it('非法月份值回退到占位文本', () => {
            render(<DatePicker picker="month" value="2026-13" />);
            expect(screen.getByText('请选择日期')).toBeInTheDocument();
        });

        it('月份模式下可切换年份并返回月份网格', async () => {
            const user = setup();
            render(<DatePicker picker="month" />);
            await user.click(screen.getByRole('combobox'));
            await user.click(screen.getByRole('button', { name: '2026年' }));
            await user.click(screen.getByRole('button', { name: '2028年' }));
            expect(screen.getByRole('button', { name: '2028年' })).toBeInTheDocument();
            expect(screen.getByRole('button', { name: '8月' })).toBeInTheDocument();
        });

        it('点击月份后该格出现选中高亮', async () => {
            const user = setup();
            render(<DatePicker picker="month" />);
            await user.click(screen.getByRole('combobox'));
            await user.click(screen.getByRole('button', { name: '9月' }));
            expect(screen.getByRole('button', { name: '9月' })).toHaveClass('animal-datepicker-month-selected');
        });
    });
});
