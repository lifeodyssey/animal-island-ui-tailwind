import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { Rate } from './Rate';

afterEach(cleanup);

describe('Rate keyboard and controlled behavior', () => {
    it.each([
        { value: 6, count: 5 },
        { value: 10, count: 3 },
    ])('clamps value $value to $count stars with one keyboard entry', ({ value, count }) => {
        const onChange = vi.fn();
        render(<Rate value={value} count={count} onChange={onChange} />);
        const radios = screen.getAllByRole('radio');
        const selected = screen.getByRole('radio', { checked: true });

        expect(radios).toHaveLength(count);
        expect(selected).toHaveAccessibleName(`${count} 星`);
        expect(radios.filter((radio) => radio.tabIndex === 0)).toEqual([selected]);
        expect(onChange).not.toHaveBeenCalled();
    });

    it('moves focus and selection together with arrows, Home and End', () => {
        const onChange = vi.fn();
        render(<Rate defaultValue={2} count={5} onChange={onChange} />);
        const radios = screen.getAllByRole('radio');
        radios[1].focus();
        fireEvent.keyDown(radios[1], { key: 'ArrowRight' });
        expect(radios[2]).toBeChecked();
        expect(radios[2]).toHaveFocus();
        expect(radios.map((radio) => radio.tabIndex)).toEqual([-1, -1, 0, -1, -1]);
        fireEvent.keyDown(radios[2], { key: 'End' });
        expect(radios[4]).toBeChecked();
        expect(radios[4]).toHaveFocus();
        fireEvent.keyDown(radios[4], { key: 'Home' });
        expect(radios[0]).toBeChecked();
        expect(radios[0]).toHaveFocus();
        expect(onChange.mock.calls.map(([value]) => value)).toEqual([3, 5, 1]);
    });

    it('leaves controlled selection unchanged until the parent accepts it', () => {
        const onChange = vi.fn();
        const { rerender } = render(<Rate value={2} onChange={onChange} />);
        fireEvent.click(screen.getByRole('radio', { name: '5 星' }));
        expect(onChange).toHaveBeenLastCalledWith(5);
        expect(screen.getByRole('radio', { name: '2 星' })).toBeChecked();
        rerender(<Rate value={5} onChange={onChange} />);
        expect(screen.getByRole('radio', { name: '5 星' })).toBeChecked();
    });

    it('clears the selected star only when allowClear is enabled', () => {
        const onChange = vi.fn();
        const { rerender } = render(<Rate defaultValue={3} allowClear={false} onChange={onChange} />);
        fireEvent.click(screen.getByRole('radio', { name: '3 星' }));
        expect(onChange).not.toHaveBeenCalled();
        rerender(<Rate defaultValue={3} allowClear onChange={onChange} />);
        fireEvent.click(screen.getByRole('radio', { name: '3 星' }));
        expect(onChange).toHaveBeenLastCalledWith(0);
        expect(screen.getAllByRole('radio').every((radio) => !(radio as HTMLInputElement).checked)).toBe(true);
        expect(screen.getByRole('radio', { name: '1 星' })).toHaveAttribute('tabindex', '0');
    });

    it('does not change a readonly rating through pointer or keyboard input', () => {
        const onChange = vi.fn();
        render(<Rate defaultValue={3} readonly onChange={onChange} />);
        const group = screen.getByRole('radiogroup');
        expect(group).toHaveAttribute('aria-readonly', 'true');
        screen.getAllByRole('radio').forEach((radio) => {
            expect(radio).toBeDisabled();
            expect(radio).toHaveAttribute('tabindex', '-1');
        });
        fireEvent.click(screen.getByRole('radio', { name: '5 星' }));
        fireEvent.keyDown(group, { key: 'End' });
        expect(onChange).not.toHaveBeenCalled();
        expect(screen.getByRole('radio', { name: '3 星' })).toBeChecked();
    });
});
