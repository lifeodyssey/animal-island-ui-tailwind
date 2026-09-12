import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Background } from './Background';

describe('Background', () => {
    it('renders with root class', () => {
        const { container } = render(<Background />);
        expect(container.firstChild).toHaveClass('animal-background');
    });

    it('default type applies no modifier class', () => {
        const { container } = render(<Background />);
        const root = container.firstChild as HTMLElement;
        expect(root.className.trim()).toBe('animal-background');
    });

    it('type=sprinkles applies sprinkles modifier', () => {
        const { container } = render(<Background type="sprinkles" />);
        expect(container.firstChild).toHaveClass('animal-background--sprinkles');
    });

    it('type=dots applies backward-compat dots modifier', () => {
        const { container } = render(<Background type="dots" />);
        expect(container.firstChild).toHaveClass('animal-background--dots');
    });

    it('type=dots-dark-green applies dots-dark-green modifier', () => {
        const { container } = render(<Background type="dots-dark-green" />);
        expect(container.firstChild).toHaveClass('animal-background--dots-dark-green');
    });

    it('type=grid applies grid modifier', () => {
        const { container } = render(<Background type="grid" />);
        expect(container.firstChild).toHaveClass('animal-background--grid');
    });

    it('type=dots-pink applies dots-pink modifier', () => {
        const { container } = render(<Background type="dots-pink" />);
        expect(container.firstChild).toHaveClass('animal-background--dots-pink');
    });

    it('type=dots-teal applies dots-teal modifier', () => {
        const { container } = render(<Background type="dots-teal" />);
        expect(container.firstChild).toHaveClass('animal-background--dots-teal');
    });

    it('type=dots-warm-peach-pink applies the long modifier', () => {
        const { container } = render(<Background type="dots-warm-peach-pink" />);
        expect(container.firstChild).toHaveClass('animal-background--dots-warm-peach-pink');
    });

    it('renders children above background', () => {
        render(
            <Background>
                <p>island content</p>
            </Background>
        );
        expect(screen.getByText('island content')).toBeInTheDocument();
    });

    it('accepts className and style', () => {
        const { container } = render(<Background className="custom" style={{ height: 100 }} />);
        const root = container.firstChild as HTMLElement;
        expect(root).toHaveClass('custom');
        expect(root).toHaveStyle({ height: '100px' });
    });
});
