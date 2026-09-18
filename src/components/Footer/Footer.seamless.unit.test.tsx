import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { Footer } from './Footer';

describe('Footer', () => {
    it('renders copyright text with current year', () => {
        const { container } = render(<Footer />);
        const root = container.firstChild as HTMLElement;
        expect(root.classList.contains('animal-footer')).toBe(true);
        expect(root.tagName.toLowerCase()).toBe('footer');
        expect(root.textContent).toContain('All Rights Reserved.');
    });

    it('renders custom year and text', () => {
        const { container } = render(<Footer year={2025} text="Animal Island" />);
        const root = container.firstChild as HTMLElement;
        expect(root.textContent).toContain('2025');
        expect(root.textContent).toContain('Animal Island');
    });
});
