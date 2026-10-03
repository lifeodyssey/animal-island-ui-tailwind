import { describe, it, expect, afterEach, vi } from 'vitest';
import { cleanup, render, screen, fireEvent } from '@testing-library/react';
import { Rate } from './Rate';

afterEach(() => {
    cleanup();
});

describe('Rate', () => {
    describe('rendering', () => {
        it('默认渲染 5 个星星', () => {
            const { container } = render(<Rate />);
            expect(container.querySelectorAll('.animal-rate-item')).toHaveLength(5);
        });

        it('count 控制星星数量', () => {
            const { container } = render(<Rate count={3} />);
            expect(container.querySelectorAll('.animal-rate-item')).toHaveLength(3);
        });

        it('应用 animal-rate 类', () => {
            const { container } = render(<Rate />);
            expect(container.firstChild).toHaveClass('animal-rate');
        });

        it('size=small 应用对应类', () => {
            const { container } = render(<Rate size="small" />);
            expect(container.firstChild).toHaveClass('animal-rate-small');
        });

        it('size=large 应用对应类', () => {
            const { container } = render(<Rate size="large" />);
            expect(container.firstChild).toHaveClass('animal-rate-large');
        });

        it('size=middle 应用对应类（默认）', () => {
            const { container } = render(<Rate />);
            expect(container.firstChild).toHaveClass('animal-rate-middle');
        });
    });

    describe('value display', () => {
        it('defaultValue=3 时 3 个星为 active', () => {
            const { container } = render(<Rate defaultValue={3} />);
            const active = container.querySelectorAll('.animal-rate-active');
            expect(active).toHaveLength(3);
        });

        it('受控 value=2 时 2 个星为 active', () => {
            const { container } = render(<Rate value={2} onChange={() => {}} />);
            expect(container.querySelectorAll('.animal-rate-active')).toHaveLength(2);
        });
    });

    describe('readonly', () => {
        it('readonly 时应用 animal-rate-readonly 类', () => {
            const { container } = render(<Rate readonly />);
            expect(container.firstChild).toHaveClass('animal-rate-readonly');
        });

        it('readonly 时 input 为 disabled', () => {
            const { container } = render(<Rate readonly />);
            const inputs = container.querySelectorAll('input[type="radio"]');
            inputs.forEach((inp) => {
                expect((inp as HTMLInputElement).disabled).toBe(true);
            });
        });
    });

    describe('interaction', () => {
        it('点击星星触发 onChange', () => {
            const onChange = vi.fn();
            const { container } = render(<Rate onChange={onChange} />);
            const inputs = container.querySelectorAll('input[type="radio"]');
            fireEvent.click(inputs[2]);
            expect(onChange).toHaveBeenCalledWith(3);
        });

        it('allowClear=true 再次点击已选星星清零', () => {
            const onChange = vi.fn();
            const { container } = render(<Rate defaultValue={3} allowClear onChange={onChange} />);
            const inputs = container.querySelectorAll('input[type="radio"]');
            fireEvent.click(inputs[2]);
            expect(onChange).toHaveBeenCalledWith(0);
        });

        it('allowClear=false 再次点击不清零', () => {
            const onChange = vi.fn();
            const { container } = render(<Rate defaultValue={3} allowClear={false} onChange={onChange} />);
            const inputs = container.querySelectorAll('input[type="radio"]');
            fireEvent.click(inputs[2]);
            expect(onChange).not.toHaveBeenCalled();
        });
    });

    describe('keyboard', () => {
        it('ArrowRight 增加评分', () => {
            const onChange = vi.fn();
            const { container } = render(<Rate defaultValue={2} onChange={onChange} />);
            fireEvent.keyDown(container.firstChild as Element, { key: 'ArrowRight' });
            expect(onChange).toHaveBeenCalledWith(3);
        });

        it('ArrowLeft 减少评分', () => {
            const onChange = vi.fn();
            const { container } = render(<Rate defaultValue={3} onChange={onChange} />);
            fireEvent.keyDown(container.firstChild as Element, { key: 'ArrowLeft' });
            expect(onChange).toHaveBeenCalledWith(2);
        });
    });
});
