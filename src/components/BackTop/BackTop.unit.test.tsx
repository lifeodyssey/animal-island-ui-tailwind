import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BackTop } from './BackTop';

beforeEach(() => {
    vi.spyOn(window, 'scrollTo').mockImplementation(() => {});
});

afterEach(() => {
    vi.restoreAllMocks();
    cleanup();
});

describe('BackTop', () => {
    it('renders a button element', () => {
        const { container } = render(<BackTop />);
        const el = container.querySelector('button');
        expect(el).not.toBeNull();
    });

    it('applies base animal-backtop class', () => {
        const { container } = render(<BackTop />);
        expect(container.querySelector('.animal-backtop')).not.toBeNull();
    });

    it('is initially hidden (no animal-backtop-visible class)', () => {
        const { container } = render(<BackTop />);
        expect(container.querySelector('.animal-backtop-visible')).toBeNull();
    });

    it('renders an image with animal-backtop-img class', () => {
        const { container } = render(<BackTop />);
        const img = container.querySelector('img.animal-backtop-img');
        expect(img).not.toBeNull();
    });

    it('has aria-label for accessibility', () => {
        const { container } = render(<BackTop />);
        const btn = container.querySelector('button');
        expect(btn).toHaveAttribute('aria-label');
    });

    it('applies custom className', () => {
        const { container } = render(<BackTop className="custom-btn" />);
        expect(container.querySelector('.custom-btn')).not.toBeNull();
    });

    it('applies custom style', () => {
        const { container } = render(<BackTop style={{ bottom: 100 }} />);
        const btn = container.querySelector('.animal-backtop') as HTMLElement;
        expect(btn.style.bottom).toBe('100px');
    });

    it('calls onClick when clicked', async () => {
        const user = userEvent.setup();
        const onClick = vi.fn();
        const { container } = render(<BackTop onClick={onClick} />);
        const btn = container.querySelector('button')!;
        await user.click(btn);
        expect(onClick).toHaveBeenCalledTimes(1);
    });

    it('has type=button on the button element', () => {
        const { container } = render(<BackTop />);
        const btn = container.querySelector('button');
        expect(btn).toHaveAttribute('type', 'button');
    });
});
