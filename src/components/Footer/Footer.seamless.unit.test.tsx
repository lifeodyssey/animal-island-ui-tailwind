import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { Footer } from './Footer';

describe('Footer', () => {
    it('renders with animal-footer class', () => {
        const { container } = render(<Footer />);
        const root = container.firstChild as HTMLElement;
        expect(root.classList.contains('animal-footer')).toBe(true);
    });

    it('accepts a custom className', () => {
        const { container } = render(<Footer className="my-footer" />);
        const root = container.firstChild as HTMLElement;
        expect(root.classList.contains('my-footer')).toBe(true);
    });
});
