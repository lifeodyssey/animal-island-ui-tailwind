import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import { TimePicker } from './TimePicker';

afterEach(cleanup);

describe('TimePicker upstream time parsing', () => {
    it.each([
        ['9:5:2', '09:05:02'],
        ['09:5:02', '09:05:02'],
        ['9:05', '09:05:00'],
        ['0:0', '00:00:00'],
    ])('accepts %s and displays %s', (value, expected) => {
        render(<TimePicker value={value} />);
        expect(screen.getByRole('combobox')).toHaveTextContent(expected);
    });

    it.each(['24:00', '9:60', '9:5:60', '-1:05', '009:05'])(
        'rejects invalid time %s',
        (value) => {
            render(<TimePicker value={value} placeholder="Select a time" />);
            expect(screen.getByRole('combobox')).toHaveTextContent('Select a time');
        },
    );

    it.each(['s', 'ss'])('treats bracketed %s as display text without enabling the seconds column', (literal) => {
        render(<TimePicker defaultValue="09:05:02" format={`HH:mm [${literal}]`} open />);
        expect(screen.getByRole('combobox')).toHaveTextContent(`09:05 ${literal}`);
        expect(screen.getByRole('dialog')).toHaveClass('animal-timepicker-panel-no-seconds');
        expect(screen.queryByRole('button', { name: '2 秒' })).not.toBeInTheDocument();
    });

    it.each(['H:m:s', 'H:m:s [s]'])('enables the seconds column for single-letter seconds in %s', (format) => {
        render(<TimePicker defaultValue="09:05:02" format={format} open />);
        expect(screen.getByRole('combobox')).toHaveTextContent('9:5:2');
        expect(screen.getByRole('button', { name: '2 秒' })).toBeInTheDocument();
    });

    it('keeps the seconds column when ss occurs outside a bracketed literal', () => {
        render(<TimePicker defaultValue="09:05:02" format="HH:mm:ss [ss]" open />);
        expect(screen.getByRole('dialog')).not.toHaveClass('animal-timepicker-panel-no-seconds');
        expect(screen.getByRole('button', { name: '2 秒' })).toBeInTheDocument();
    });
});
