import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { Footer } from './Footer';

describe('Footer', () => {
    it('renders with animal-footer class', () => {
        const { container } = render(<Footer />);
        const root = container.firstChild as HTMLElement;
        expect(root.classList.contains('animal-footer')).toBe(true);
    });

    it('renders at least one icon cycle div', () => {
        const { container } = render(<Footer />);
        const cycles = container.querySelectorAll('.animal-footer-cycle');
        expect(cycles.length).toBeGreaterThanOrEqual(1);
    });

    it('renders single icon when name is given', () => {
        const { container } = render(<Footer name="Fish" />);
        const icons = container.querySelectorAll('.animal-icon');
        expect(icons.length).toBeGreaterThanOrEqual(1);
    });
});
