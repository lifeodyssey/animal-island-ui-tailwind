import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import { DatePicker } from './DatePicker';

afterEach(cleanup);

describe('DatePicker upstream date parsing', () => {
    it.each([
        ['2026-8-9', '2026-08-09'],
        ['2026-8-05', '2026-08-05'],
        ['2026-08-5', '2026-08-05'],
    ])('accepts %s and formats it as %s', (value, expected) => {
        render(<DatePicker value={value} format="YYYY-MM-DD" />);
        expect(screen.getByRole('combobox')).toHaveTextContent(expected);
    });

    it('accepts non-padded month values in month mode', () => {
        render(<DatePicker picker="month" value="2026-8" />);
        expect(screen.getByRole('combobox')).toHaveTextContent('2026-08');
    });

    it('accepts non-padded endpoints in range mode', () => {
        render(<DatePicker range value={['2026-8-9', '2026-8-12']} />);
        expect(screen.getByRole('combobox')).toHaveTextContent('2026-08-09');
        expect(screen.getByRole('combobox')).toHaveTextContent('2026-08-12');
    });

    it.each(['2026-02-30', '2026-2-30', '2026-13-1', '2026-0-5'])(
        'rejects invalid date %s instead of normalizing it',
        (value) => {
            render(<DatePicker value={value} placeholder="Select a date" />);
            expect(screen.getByRole('combobox')).toHaveTextContent('Select a date');
        },
    );
});
