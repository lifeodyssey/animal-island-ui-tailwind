import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, waitFor, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { TimePicker } from './TimePicker';

afterEach(() => cleanup());

const setup = () => userEvent.setup();

/** 面板带退场动效（0.2s），等待动画结束、面板真正卸载后再断言 */
const expectPanelClosed = async () =>
    waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument(), { timeout: 1000 });

function ControlledTimePicker({ initial = null as string | null, onChange: onChangeCb = (_v: string | null) => {} }) {
    const [value, setValue] = useState<string | null>(initial);
    return (
        <TimePicker
            value={value ?? undefined}
            onChange={(v) => {
                setValue(typeof v === 'string' ? v : null);
                onChangeCb(typeof v === 'string' ? v : null);
            }}
        />
    );
}

describe('TimePicker', () => {
    describe('rendering', () => {
        it('渲染占位文本', () => {
            render(<TimePicker placeholder="选择时间" />);
            expect(screen.getByText('选择时间')).toBeInTheDocument();
        });

        it('按 format 展示受控值', () => {
            render(<TimePicker value="09:30:45" format="HH时mm分ss秒" />);
            expect(screen.getByText('09时30分45秒')).toBeInTheDocument();
        });

        it('非法 value 回退到占位文本', () => {
            render(<TimePicker value="not-a-time" />);
            expect(screen.getByText('请选择时间')).toBeInTheDocument();
        });

        it('应用 size / status 类', () => {
            render(<TimePicker size="large" status="error" />);
            const trigger = screen.getByRole('combobox');
            expect(trigger).toHaveClass('animal-time-picker-trigger-large');
            expect(trigger).toHaveClass('animal-time-picker-trigger-error');
        });

        it('支持 aria-label 无障碍标签', () => {
            render(<TimePicker aria-label="选择时间" />);
            expect(screen.getByRole('combobox', { name: '选择时间' })).toBeInTheDocument();
        });

        it('渲染 animal-time-picker 根类名', () => {
            const { container } = render(<TimePicker />);
            expect(container.querySelector('.animal-time-picker')).toBeInTheDocument();
        });
    });

    describe('展开与选择', () => {
        it('点击触发区展开面板，点击外部关闭', async () => {
            const user = setup();
            render(<TimePicker />);
            await user.click(screen.getByRole('combobox'));
            expect(screen.getByRole('dialog')).toBeInTheDocument();
            await user.click(document.body);
            await expectPanelClosed();
        });

        it('面板展示时、分、秒列', async () => {
            const user = setup();
            render(<TimePicker />);
            await user.click(screen.getByRole('combobox'));
            expect(screen.getByText('时')).toBeInTheDocument();
            expect(screen.getByText('分')).toBeInTheDocument();
            expect(screen.getByText('秒')).toBeInTheDocument();
        });

        it('format 无 ss 时不显示秒列', async () => {
            const user = setup();
            render(<TimePicker format="HH:mm" />);
            await user.click(screen.getByRole('combobox'));
            expect(screen.getByText('时')).toBeInTheDocument();
            expect(screen.getByText('分')).toBeInTheDocument();
            expect(screen.queryByText('秒')).not.toBeInTheDocument();
        });

        it('点选小时选项并确定后回调正确值', async () => {
            const user = setup();
            const onChange = vi.fn();
            render(<TimePicker defaultValue="09:30:00" onChange={onChange} />);
            await user.click(screen.getByRole('combobox'));
            await user.click(screen.getByRole('button', { name: '10 时' }));
            await user.click(screen.getByRole('button', { name: '确定' }));
            expect(onChange).toHaveBeenCalledWith('10:30:00');
            await expectPanelClosed();
        });

        it('无变化时确定仅关闭面板不重复回调', async () => {
            const user = setup();
            const onChange = vi.fn();
            render(<TimePicker defaultValue="09:30:00" onChange={onChange} />);
            await user.click(screen.getByRole('combobox'));
            await user.click(screen.getByRole('button', { name: '确定' }));
            expect(onChange).not.toHaveBeenCalled();
            await expectPanelClosed();
        });

        it('受控模式：选择后回调', async () => {
            const user = setup();
            const onChange = vi.fn();
            render(<ControlledTimePicker initial="09:30:00" onChange={onChange} />);
            await user.click(screen.getByRole('combobox'));
            await user.click(screen.getByRole('button', { name: '11 时' }));
            await user.click(screen.getByRole('button', { name: '确定' }));
            expect(onChange).toHaveBeenLastCalledWith('11:30:00');
        });

        it('受控 open 直接展开面板', () => {
            render(<TimePicker open aria-label="选择时间" />);
            expect(screen.getByRole('dialog')).toBeInTheDocument();
        });

        it('Escape 关闭面板', async () => {
            const user = setup();
            render(<TimePicker />);
            await user.click(screen.getByRole('combobox'));
            expect(screen.getByRole('dialog')).toBeInTheDocument();
            await user.keyboard('{Escape}');
            await expectPanelClosed();
        });
    });

    describe('disabled', () => {
        it('禁用时点击不展开面板', async () => {
            const user = setup();
            render(<TimePicker disabled />);
            await user.click(screen.getByRole('combobox'));
            expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
        });

        it('禁用时 wrapper 带有 animal-time-picker-disabled 类', () => {
            const { container } = render(<TimePicker disabled />);
            expect(container.firstChild).toHaveClass('animal-time-picker-disabled');
        });
    });

    describe('清空', () => {
        it('allowClear 且有值时显示清空按钮，点击后回调 null', async () => {
            const user = setup();
            const onChange = vi.fn();
            render(<TimePicker defaultValue="09:30:00" allowClear onChange={onChange} />);
            const clearBtn = screen.getByRole('button', { name: '清除时间' });
            await user.click(clearBtn);
            expect(onChange).toHaveBeenCalledWith(null);
        });
    });
});
