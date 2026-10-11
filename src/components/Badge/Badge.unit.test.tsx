import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { Badge } from './Badge';

afterEach(cleanup);

describe('Badge count visibility', () => {
    it.each([null, undefined, '', '  '])('hides an empty count %j without hiding children', (count) => {
        const { container } = render(<Badge count={count}>Inbox</Badge>);
        expect(container.querySelector('sup')).not.toBeInTheDocument();
        expect(screen.getByText('Inbox')).toBeInTheDocument();
    });

    it.each([
        { count: 98, display: '98' },
        { count: 99, display: '99' },
        { count: 100, display: '99+' },
        { count: '99', display: '99' },
        { count: '100', display: '99+' },
    ])('displays count $count at the overflow boundary as $display', ({ count, display }) => {
        render(<Badge count={count} overflowCount={99} />);
        expect(screen.getByText(display)).toHaveAttribute('title', String(count));
    });

    it('caps numeric strings while keeping the original count in the title', () => {
        render(<Badge count="1000" overflowCount={999}>Inbox</Badge>);
        expect(screen.getByText('999+')).toHaveAttribute('title', '1000');
        expect(screen.getByText('Inbox')).toBeInTheDocument();
    });

    it.each([0, '0'])('hides zero %s unless showZero is enabled', (count) => {
        const { container, rerender } = render(<Badge count={count} />);
        expect(container.querySelector('sup')).not.toBeInTheDocument();
        rerender(<Badge count={count} showZero />);
        expect(screen.getByText('0')).toBeInTheDocument();
    });

    it('shows a dot without a count but hides it for an explicit zero', () => {
        const { container, rerender } = render(<Badge dot />);
        expect(container.querySelector('sup')).toBeEmptyDOMElement();
        rerender(<Badge dot count={0} />);
        expect(container.querySelector('sup')).not.toBeInTheDocument();
    });

    it('preserves custom content without numeric truncation', () => {
        render(<Badge count={<span>New</span>} overflowCount={1} />);
        expect(screen.getByText('New')).toBeInTheDocument();
    });
});
