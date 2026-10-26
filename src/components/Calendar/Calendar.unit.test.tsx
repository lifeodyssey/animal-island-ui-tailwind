import { act, cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import dayjs from 'dayjs';
import { Calendar, type CalendarEvent } from './Calendar';

afterEach(cleanup);

const dateCell = (date: string) => screen.getByRole('gridcell', { name: new RegExp(`^${date}(?: |$)`) });
const startDrag = (from: string, to: string) => {
    fireEvent.mouseDown(dateCell(from), { button: 0 });
    fireEvent.mouseEnter(dateCell(to));
};

describe('Calendar', () => {
    it('renders a six-week grid and navigates months and years without changing the selection', () => {
        const onChange = vi.fn();
        const onPanelChange = vi.fn();
        render(<Calendar defaultValue="2026-08-15" onChange={onChange} onPanelChange={onPanelChange} />);
        expect(screen.getAllByRole('gridcell')).toHaveLength(42);
        expect(dateCell('2026-08-15')).toHaveAttribute('aria-selected', 'true');
        fireEvent.click(screen.getByRole('button', { name: '下个月' }));
        expect(screen.getByText('2026年9月')).toBeInTheDocument();
        expect(onPanelChange).toHaveBeenLastCalledWith('2026-09');
        expect(screen.queryByRole('gridcell', { selected: true })).not.toBeInTheDocument();
        fireEvent.click(screen.getByRole('button', { name: '上一年' }));
        expect(screen.getByText('2025年9月')).toBeInTheDocument();
        expect(onChange).not.toHaveBeenCalled();
    });

    it('does not highlight a boundary date when a controlled selection is outside the visible grid', () => {
        render(<Calendar value="2020-01-01" panelValue="2026-08" />);
        expect(screen.queryByRole('gridcell', { selected: true })).not.toBeInTheDocument();
    });

    it('selects an adjacent-month date and reports both selection and panel changes', () => {
        const onChange = vi.fn();
        const onPanelChange = vi.fn();
        render(<Calendar defaultValue="2026-08-15" onChange={onChange} onPanelChange={onPanelChange} />);
        act(() => dateCell('2026-07-31').focus());
        fireEvent.click(dateCell('2026-07-31'));
        expect(onChange).toHaveBeenLastCalledWith('2026-07-31');
        expect(onPanelChange).toHaveBeenCalledExactlyOnceWith('2026-07');
        expect(screen.getByText('2026年7月')).toBeInTheDocument();
        expect(dateCell('2026-07-31')).toHaveAttribute('aria-selected', 'true');
        expect(dateCell('2026-07-31')).toHaveFocus();
    });

    it('keeps controlled values unchanged until the parent accepts callbacks', () => {
        const onChange = vi.fn();
        const onPanelChange = vi.fn();
        const { rerender } = render(<Calendar value="2026-08-15" panelValue="2026-08" onChange={onChange} onPanelChange={onPanelChange} />);
        fireEvent.click(dateCell('2026-08-20'));
        expect(onChange).toHaveBeenLastCalledWith('2026-08-20');
        expect(dateCell('2026-08-15')).toHaveAttribute('aria-selected', 'true');
        fireEvent.click(screen.getByRole('button', { name: '下个月' }));
        expect(onPanelChange).toHaveBeenLastCalledWith('2026-09');
        expect(screen.getByText('2026年8月')).toBeInTheDocument();
        rerender(<Calendar value="2026-09-20" panelValue="2026-09" />);
        expect(dateCell('2026-09-20')).toHaveAttribute('aria-selected', 'true');
    });

    it('updates an uncontrolled panel when the controlled selected value changes', () => {
        const { rerender } = render(<Calendar value="2026-08-15" />);
        rerender(<Calendar value="2026-10-02" />);
        expect(screen.getByText('2026年10月')).toBeInTheDocument();
        expect(dateCell('2026-10-02')).toHaveAttribute('tabindex', '0');
    });

    it('moves keyboard focus from the actual focused cell and selects with Enter', () => {
        const onChange = vi.fn();
        render(<Calendar defaultValue="2026-08-15" onChange={onChange} />);
        act(() => dateCell('2026-08-20').focus());
        fireEvent.keyDown(dateCell('2026-08-20'), { key: 'ArrowRight' });
        expect(dateCell('2026-08-21')).toHaveFocus();
        fireEvent.keyDown(dateCell('2026-08-21'), { key: 'Enter' });
        expect(onChange).toHaveBeenLastCalledWith('2026-08-21');
        expect(dateCell('2026-08-21')).toHaveAttribute('aria-selected', 'true');
    });

    it('keeps navigation and selection on the focused cell after an external value update', () => {
        const onChange = vi.fn();
        const { rerender } = render(<Calendar value="2026-08-15" panelValue="2026-08" onChange={onChange} />);
        act(() => dateCell('2026-08-20').focus());
        rerender(<Calendar value="2026-08-10" panelValue="2026-08" onChange={onChange} />);
        expect(dateCell('2026-08-20')).toHaveFocus();
        expect(dateCell('2026-08-20')).toHaveAttribute('tabindex', '0');
        fireEvent.keyDown(dateCell('2026-08-20'), { key: 'Enter' });
        expect(onChange).toHaveBeenLastCalledWith('2026-08-20');
        fireEvent.keyDown(dateCell('2026-08-20'), { key: 'ArrowRight' });
        expect(dateCell('2026-08-21')).toHaveFocus();
    });

    it('preserves date focus when a controlled month change is accepted later', () => {
        const onPanelChange = vi.fn();
        const { rerender } = render(<Calendar value="2026-08-15" panelValue="2026-08" onPanelChange={onPanelChange} />);
        act(() => dateCell('2026-08-31').focus());
        fireEvent.keyDown(dateCell('2026-08-31'), { key: 'ArrowRight' });
        expect(onPanelChange).toHaveBeenLastCalledWith('2026-09');
        expect(screen.getByText('2026年8月')).toBeInTheDocument();
        expect(dateCell('2026-09-01')).toHaveFocus();
        rerender(<Calendar value="2026-08-15" panelValue="2026-09" onPanelChange={onPanelChange} />);
        expect(screen.getByText('2026年9月')).toBeInTheDocument();
        expect(dateCell('2026-09-01')).toHaveFocus();
        fireEvent.keyDown(dateCell('2026-09-01'), { key: 'ArrowRight' });
        expect(dateCell('2026-09-02')).toHaveFocus();
    });

    it('waits for a deferred PageDown target outside the current grid without clamping it', () => {
        const onPanelChange = vi.fn();
        const { rerender } = render(<Calendar value="2026-08-15" panelValue="2026-08" onPanelChange={onPanelChange} />);
        act(() => dateCell('2026-08-20').focus());
        fireEvent.keyDown(dateCell('2026-08-20'), { key: 'PageDown' });
        expect(onPanelChange).toHaveBeenLastCalledWith('2026-09');
        expect(dateCell('2026-08-20')).toHaveFocus();
        expect(dateCell('2026-08-20')).toHaveAttribute('tabindex', '0');
        rerender(<Calendar value="2026-08-15" panelValue="2026-09" onPanelChange={onPanelChange} />);
        expect(dateCell('2026-09-20')).toHaveFocus();
        fireEvent.keyDown(dateCell('2026-09-20'), { key: 'PageUp' });
        expect(onPanelChange).toHaveBeenLastCalledWith('2026-08');
        expect(dateCell('2026-09-20')).toHaveFocus();
        rerender(<Calendar value="2026-08-15" panelValue="2026-08" onPanelChange={onPanelChange} />);
        expect(dateCell('2026-08-20')).toHaveFocus();
    });

    it('does not steal outside focus when an external value or pending month update arrives', () => {
        const view = (value: string, panel: string) => (
            <><button type="button">Outside</button><Calendar value={value} panelValue={panel} /></>
        );
        const { rerender } = render(view('2026-08-15', '2026-08'));
        const outside = screen.getByRole('button', { name: 'Outside' });
        act(() => outside.focus());
        rerender(view('2026-08-10', '2026-08'));
        expect(outside).toHaveFocus();
        expect(dateCell('2026-08-10')).toHaveAttribute('tabindex', '0');
        act(() => dateCell('2026-08-31').focus());
        fireEvent.keyDown(dateCell('2026-08-31'), { key: 'ArrowRight' });
        expect(dateCell('2026-09-01')).toHaveFocus();
        act(() => outside.focus());
        rerender(view('2026-08-10', '2026-09'));
        expect(outside).toHaveFocus();
    });

    it('abandons pending focus when the user leaves before a deferred PageDown is accepted', () => {
        const view = (panel: string) => (
            <><button type="button">Outside</button><Calendar value="2026-08-15" panelValue={panel} /></>
        );
        const { rerender } = render(view('2026-08'));
        act(() => dateCell('2026-08-20').focus());
        fireEvent.keyDown(dateCell('2026-08-20'), { key: 'PageDown' });
        const outside = screen.getByRole('button', { name: 'Outside' });
        act(() => outside.focus());
        rerender(view('2026-09'));
        expect(outside).toHaveFocus();
    });

    it('keeps one tab stop and moves focus across month boundaries and PageDown', () => {
        render(<Calendar defaultValue="2026-08-31" />);
        act(() => dateCell('2026-08-31').focus());
        fireEvent.keyDown(dateCell('2026-08-31'), { key: 'ArrowRight' });
        expect(screen.getByText('2026年9月')).toBeInTheDocument();
        expect(dateCell('2026-09-01')).toHaveFocus();
        fireEvent.keyDown(dateCell('2026-09-01'), { key: 'PageDown' });
        expect(dateCell('2026-10-01')).toHaveFocus();
        expect(screen.getAllByRole('gridcell').filter((cell) => cell.tabIndex === 0)).toHaveLength(1);
    });

    it('creates a chronologically ordered range on drag completion', () => {
        const onEventCreate = vi.fn();
        render(<Calendar defaultValue="2026-08-15" draggableEvents onEventCreate={onEventCreate} />);
        startDrag('2026-08-20', '2026-08-18');
        fireEvent.pointerUp(dateCell('2026-08-18'));
        expect(onEventCreate).toHaveBeenCalledExactlyOnceWith('2026-08-18', '2026-08-20');
    });

    it('cancels a pointer gesture without creating an event', () => {
        const onEventCreate = vi.fn();
        const onPointerCancel = vi.fn();
        const { container } = render(<Calendar defaultValue="2026-08-15" draggableEvents onEventCreate={onEventCreate} onPointerCancel={onPointerCancel} />);
        startDrag('2026-08-18', '2026-08-20');
        expect(container.querySelector('[data-preview]')).toBeInTheDocument();
        fireEvent.pointerCancel(dateCell('2026-08-20'));
        expect(onEventCreate).not.toHaveBeenCalled();
        expect(onPointerCancel).toHaveBeenCalledTimes(1);
        expect(container.querySelector('[data-preview]')).not.toBeInTheDocument();
    });

    it('cancels a drag when released outside and ignores disabled dragging or single-day clicks', () => {
        const onEventCreate = vi.fn();
        const { rerender } = render(<Calendar defaultValue="2026-08-15" draggableEvents onEventCreate={onEventCreate} />);
        startDrag('2026-08-18', '2026-08-20');
        fireEvent.pointerUp(document.body);
        fireEvent.pointerUp(dateCell('2026-08-20'));
        startDrag('2026-08-18', '2026-08-18');
        fireEvent.pointerUp(dateCell('2026-08-18'));
        rerender(<Calendar defaultValue="2026-08-15" draggableEvents={false} onEventCreate={onEventCreate} />);
        startDrag('2026-08-18', '2026-08-20');
        fireEvent.pointerUp(dateCell('2026-08-20'));
        expect(onEventCreate).not.toHaveBeenCalled();
    });

    it('cancels an in-flight drag when the visible month changes', () => {
        const onEventCreate = vi.fn();
        const { rerender, container } = render(<Calendar panelValue="2026-08" draggableEvents onEventCreate={onEventCreate} />);
        startDrag('2026-08-18', '2026-08-20');
        rerender(<Calendar panelValue="2026-09" draggableEvents onEventCreate={onEventCreate} />);
        fireEvent.pointerUp(dateCell('2026-09-20'));
        expect(onEventCreate).not.toHaveBeenCalled();
        expect(container.querySelector('[data-preview]')).not.toBeInTheDocument();
    });

    it('keeps hidden event counts accurate while previewing a range', () => {
        const events: CalendarEvent[] = [
            { title: 'A', start: '2026-08-18' },
            { title: 'B', start: '2026-08-18' },
            { title: 'C', start: '2026-08-18' },
        ];
        render(<Calendar defaultValue="2026-08-15" events={events} draggableEvents />);
        expect(dateCell('2026-08-18')).toHaveTextContent('+1');
        startDrag('2026-08-17', '2026-08-18');
        expect(dateCell('2026-08-18')).toHaveTextContent('+2');
        expect(dateCell('2026-08-18')).toHaveAccessibleName('2026-08-18 3 项事项：A，B，C');
    });

    it('clips events to the grid, splits week crossings, and shows time only on the first segment', () => {
        const { container } = render(<Calendar defaultValue="2026-08-15" events={[
            { title: 'Island trip', start: '2026-08-01T09:30', end: '2026-08-03', showTime: true },
            { title: 'Outside', start: '2026-01-01', end: '2026-01-30' },
        ]} />);
        expect(container.querySelectorAll('.animal-calendar-event')).toHaveLength(2);
        expect(screen.getAllByText('Island trip')).toHaveLength(2);
        expect(screen.getAllByText('09:30')).toHaveLength(1);
        expect(dateCell('2026-08-03')).toHaveAccessibleName('2026-08-03 1 项事项：Island trip');
        expect(screen.queryByText('Outside')).not.toBeInTheDocument();
    });

    it('ignores invalid event starts instead of inventing an event on today', () => {
        const today = dayjs().format('YYYY-MM-DD');
        render(<Calendar defaultValue={today} events={[{ title: 'Invalid', start: 'not-a-date' }]} />);
        expect(dateCell(today)).toHaveAccessibleName(today);
        expect(screen.queryByText('Invalid')).not.toBeInTheDocument();
    });
});
