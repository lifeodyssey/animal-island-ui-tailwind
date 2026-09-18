import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { Icon, ICON_LIST, HeartIcon } from './index';

describe('Icon', () => {
    it('name renders an SVG and has animal-icon class', () => {
        const { container } = render(<Icon name="Flower" />);
        const root = container.firstChild as SVGSVGElement;
        expect(root.tagName).toBe('svg');
        expect(root.classList.contains('animal-icon')).toBe(true);
    });

    it('all ICON_LIST names render', () => {
        for (const { name } of ICON_LIST) {
            const { container, unmount } = render(<Icon name={name} />);
            expect(container.firstChild).not.toBeNull();
            unmount();
        }
    });

    it('icon prop renders the passed component as SVG', () => {
        const { container } = render(<Icon icon={HeartIcon} />);
        const root = container.firstChild as HTMLElement;
        expect(root.tagName).toBe('svg');
        expect(root.classList.contains('animal-icon')).toBe(true);
    });

    it('color and strokeWidth are forwarded to SVG', () => {
        const { container } = render(<Icon name="Wifi" color="#123456" strokeWidth={2} />);
        const root = container.firstChild as SVGSVGElement;
        expect(root.tagName).toBe('svg');
        expect(root.getAttribute('stroke')).toBe('#123456');
        expect(root.getAttribute('stroke-width')).toBe('2');
    });

    it('src mode renders a span with background-image', () => {
        const { container } = render(<Icon src="https://example.com/x.png" />);
        const root = container.firstChild as HTMLElement;
        expect(root.tagName).toBe('SPAN');
        expect(root.style.backgroundImage).toMatch(/url\(/);
    });

    it('defaults to aria-hidden (decorative); aria-label exposes role=img', () => {
        const { container: plain } = render(<Icon name="Camera" />);
        expect((plain.firstChild as HTMLElement).getAttribute('aria-hidden')).toBe('true');

        const { container: labeled } = render(<Icon name="Camera" aria-label="Camera" />);
        const labeledRoot = labeled.firstChild as HTMLElement;
        expect(labeledRoot.getAttribute('aria-hidden')).toBeNull();
        expect(labeledRoot.getAttribute('role')).toBe('img');
    });
});
