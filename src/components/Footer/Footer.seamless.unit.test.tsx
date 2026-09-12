import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { Footer } from './Footer';

describe('Footer icon-chain', () => {
    it('renders root with animal-footer class', () => {
        const { container } = render(<Footer />);
        const root = container.firstChild as HTMLElement;
        expect(root).toHaveClass('animal-footer');
    });

    it('renders at least one cycle div', () => {
        const { container } = render(<Footer />);
        const cycles = container.querySelectorAll('.animal-footer-cycle');
        expect(cycles.length).toBeGreaterThanOrEqual(1);
    });

    it('accepts size and custom className', () => {
        const { container } = render(<Footer size={32} className="my-footer" />);
        const root = container.firstChild as HTMLElement;
        expect(root).toHaveClass('animal-footer');
        expect(root).toHaveClass('my-footer');
    });
});
