import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, waitFor, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { DatePicker } from './DatePicker';

afterEach(() => cleanup());

const setup = () => userEvent.setup();

/** 面板带退场动效（0.2s），等待动画结束、面板真正卸载后再断言 */
const expectPanelClosed = async () =>
    waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument(), { timeout: 1000 });

function ControlledDatePicker({ initial = null as string | null, onChange: onChangeCb = (_v: string | null) => {} }) {
    const [value, setValue] = useState<string | null>(initial);
    return (
        <DatePicker
            value={value ?? undefined}
            onChange={(v) => {
                setValue(typeof v === 'string' ? v : null);
                onChangeCb(typeof v === 'string' ? v : null);
            }}
        />
    );
}

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
            expect(trigger).toHaveClass('animal-date-picker-trigger-large');
            expect(trigger).toHaveClass('animal-date-picker-trigger-error');
        });

        it('支持 aria-label 无障碍标签', () => {
            render(<DatePicker aria-label="选择生日" />);
            expect(screen.getByRole('combobox', { name: '选择生日' })).toBeInTheDocument();
        });

        it('渲染 animal-date-picker 根类名', () => {
            const { container } = render(<DatePicker />);
            expect(container.querySelector('.animal-date-picker')).toBeInTheDocument();
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
            render(<ControlledDatePicker initial="2026-08-10" onChange={onChange} />);
            await user.click(screen.getByRole('combobox'));
            await user.click(screen.getByRole('button', { name: '2026年8月15日' }));
            await user.click(screen.getByRole('button', { name: '确定' }));
            expect(onChange).toHaveBeenLastCalledWith('2026-08-15');
        });

        it('受控 open 直接展开面板', () => {
            render(<DatePicker open aria-label="选择日期" />);
            expect(screen.getByRole('dialog')).toBeInTheDocument();
        });

        it('Escape 关闭面板', async () => {
            const user = setup();
            render(<DatePicker />);
            await user.click(screen.getByRole('combobox'));
            expect(screen.getByRole('dialog')).toBeInTheDocument();
            await user.keyboard('{Escape}');
            await expectPanelClosed();
        });
    });

    describe('disabled', () => {
        it('禁用时点击不展开面板', async () => {
            const user = setup();
            render(<DatePicker disabled />);
            await user.click(screen.getByRole('combobox'));
            expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
        });

        it('禁用时 wrapper 带有 animal-date-picker-disabled 类', () => {
            const { container } = render(<DatePicker disabled />);
            expect(container.firstChild).toHaveClass('animal-date-picker-disabled');
        });
    });

    describe('清空', () => {
        it('allowClear 且有值时显示清空按钮', async () => {
            const user = setup();
            const onChange = vi.fn();
            render(<DatePicker defaultValue="2026-08-10" allowClear onChange={onChange} />);
            const clearBtn = screen.getByRole('button', { name: '清除日期' });
            await user.click(clearBtn);
            expect(onChange).toHaveBeenCalledWith(null);
        });
    });
});
