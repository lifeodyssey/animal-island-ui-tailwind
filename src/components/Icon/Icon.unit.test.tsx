import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { Icon, ICON_LIST } from './Icon';
import { HeartIcon } from './src';

describe('Icon', () => {
    it('ICON_LIST has 101 entries', () => {
        expect(ICON_LIST).toHaveLength(101);
    });

    it('renders SVG via name prop', () => {
        const { container } = render(<Icon name="Heart" />);
        expect(container.querySelector('svg')).toBeTruthy();
        expect(container.querySelector('.animal-icon')).toBeTruthy();
    });

    it('renders SVG via icon prop', () => {
        const { container } = render(<Icon icon={HeartIcon} />);
        expect(container.querySelector('svg')).toBeTruthy();
    });

    it('renders span with background-image for src prop', () => {
        const { container } = render(<Icon src="test.png" />);
        const span = container.firstChild as HTMLElement;
        expect(span.tagName.toLowerCase()).toBe('span');
        expect(span.style.backgroundImage).toMatch(/url\(/);
    });

    it('is decorative by default (aria-hidden)', () => {
        const { container } = render(<Icon name="Heart" />);
        const svg = container.querySelector('svg');
        expect(svg?.getAttribute('aria-hidden')).toBe('true');
    });

    it('becomes accessible with aria-label', () => {
        const { container } = render(<Icon name="Heart" aria-label="Favourite" />);
        const svg = container.querySelector('svg');
        expect(svg?.getAttribute('aria-hidden')).toBeNull();
        expect(svg?.getAttribute('role')).toBe('img');
    });

    it('applies animal-icon-bounce class when bounce=true', () => {
        const { container } = render(<Icon name="Flower" bounce />);
        expect(container.querySelector('.animal-icon-bounce')).toBeTruthy();
    });
});
