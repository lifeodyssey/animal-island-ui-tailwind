import { afterEach, describe, it, expect, vi } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';

afterEach(cleanup);
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { Rate, type RateProps } from './Rate';

const setup = (props: Partial<RateProps> = {}) => {
    const onChange = vi.fn();
    const utils = render(<Rate onChange={onChange} {...props} />);
    const getInputs = () => screen.getAllByRole('radio') as HTMLInputElement[];
    const getLabels = () => getInputs().map((input) => input.closest('label') as HTMLLabelElement);
    const activeCount = () => getLabels().filter((label) => label.classList.contains('animal-rate-active')).length;
    return { onChange, getInputs, getLabels, activeCount, user: userEvent.setup(), ...utils };
};

const ControlledHost = ({ initial = 0, onChange }: { initial?: number; onChange?: (v: number) => void }) => {
    const [val, setVal] = useState(initial);
    return (
        <Rate
            value={val}
            onChange={(v) => {
                setVal(v);
                onChange?.(v);
            }}
        />
    );
};

describe('Rate', () => {
    describe('rendering', () => {
        it('默认渲染 5 颗星且都未选中', () => {
            const { getInputs, activeCount } = setup();
            expect(getInputs()).toHaveLength(5);
            getInputs().forEach((input) => expect(input).not.toBeChecked());
            expect(activeCount()).toBe(0);
        });

        it('count 自定义星星数量', () => {
            const { getInputs } = setup({ count: 10 });
            expect(getInputs()).toHaveLength(10);
        });

        it('defaultValue 点亮前 N 颗星并选中第 N 颗', () => {
            const { getInputs, activeCount } = setup({ defaultValue: 3 });
            expect(activeCount()).toBe(3);
            expect(getInputs()[2]).toBeChecked();
        });

        it('value 受控点亮前 N 颗星', () => {
            const { activeCount, getInputs } = setup({ value: 4 });
            expect(activeCount()).toBe(4);
            expect(getInputs()[3]).toBeChecked();
        });

        it('value 超出 count 时夹取选中态，且仍有一颗星可 Tab 到达', () => {
            const { getInputs, activeCount } = setup({ count: 3, value: 5 });
            expect(activeCount()).toBe(3);
            const tabStops = getInputs().filter((i) => i.tabIndex === 0);
            expect(tabStops).toHaveLength(1);
        });

        it('应用 size class', () => {
            const { container } = setup({ size: 'large' });
            expect(container.firstChild).toHaveClass('animal-rate-large');
        });

        it('readonly 时添加 readonly class 且 inputs 置 disabled', () => {
            const { container, getInputs } = setup({ readonly: true });
            expect(container.firstChild).toHaveClass('animal-rate-readonly');
            getInputs().forEach((i) => expect(i).toBeDisabled());
        });
    });

    describe('interaction', () => {
        it('点击第 3 颗星时调用 onChange(3)', async () => {
            const { getInputs, onChange, user } = setup();
            await user.click(getInputs()[2]);
            expect(onChange).toHaveBeenCalledWith(3);
        });

        it('点击已选中的星星时清空（allowClear=true）', async () => {
            const { getInputs, onChange, user } = setup({ defaultValue: 3 });
            await user.click(getInputs()[2]);
            expect(onChange).toHaveBeenCalledWith(0);
        });

        it('allowClear=false 时点击已选中的星星不清空', async () => {
            const { getInputs, onChange, user } = setup({ defaultValue: 3, allowClear: false });
            await user.click(getInputs()[2]);
            expect(onChange).not.toHaveBeenCalled();
        });
    });

    describe('keyboard', () => {
        it('ArrowRight 递增评分', async () => {
            const { onChange, user, container } = setup({ defaultValue: 2 });
            const group = container.firstChild as HTMLElement;
            group.focus();
            await user.keyboard('{ArrowRight}');
            expect(onChange).toHaveBeenCalledWith(3);
        });

        it('ArrowLeft 递减评分', async () => {
            const { onChange, user, container } = setup({ defaultValue: 3 });
            const group = container.firstChild as HTMLElement;
            group.focus();
            await user.keyboard('{ArrowLeft}');
            expect(onChange).toHaveBeenCalledWith(2);
        });

        it('End 跳到最后一颗', async () => {
            const { onChange, user, container } = setup({ defaultValue: 2, count: 5 });
            const group = container.firstChild as HTMLElement;
            group.focus();
            await user.keyboard('{End}');
            expect(onChange).toHaveBeenCalledWith(5);
        });

        it('Home 跳到第一颗', async () => {
            const { onChange, user, container } = setup({ defaultValue: 3, count: 5 });
            const group = container.firstChild as HTMLElement;
            group.focus();
            await user.keyboard('{Home}');
            expect(onChange).toHaveBeenCalledWith(1);
        });
    });

    describe('controlled', () => {
        it('受控模式：点击后父级 state 更新 → 组件跟随', async () => {
            const onChange = vi.fn();
            const user = userEvent.setup();
            render(<ControlledHost initial={2} onChange={onChange} />);
            const inputs = screen.getAllByRole('radio') as HTMLInputElement[];
            await user.click(inputs[4]);
            expect(onChange).toHaveBeenCalledWith(5);
        });
    });

    describe('accessibility', () => {
        it('存在 radiogroup role', () => {
            setup();
            expect(screen.getByRole('radiogroup')).toBeInTheDocument();
        });

        it('每颗星都有 aria-label', () => {
            setup({ count: 3 });
            expect(screen.getByRole('radio', { name: '1 星' })).toBeInTheDocument();
            expect(screen.getByRole('radio', { name: '2 星' })).toBeInTheDocument();
            expect(screen.getByRole('radio', { name: '3 星' })).toBeInTheDocument();
        });
    });
});
