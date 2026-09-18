import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { Footer } from './Footer';

describe('Footer', () => {
    it('renders copyright text with current year', () => {
        const { container } = render(<Footer />);
        const root = container.firstChild as HTMLElement;
        expect(root.tagName).toBe('FOOTER');
        expect(root.classList.contains('animal-footer')).toBe(true);
        expect(root.textContent).toContain('All Rights Reserved.');
        expect(root.textContent).toContain(String(new Date().getFullYear()));
    });

    it('renders custom text and year', () => {
        const { container } = render(<Footer text="Animal Island" year={2025} />);
        const root = container.firstChild as HTMLElement;
        expect(root.textContent).toContain('Animal Island');
        expect(root.textContent).toContain('2025');
    });
});
