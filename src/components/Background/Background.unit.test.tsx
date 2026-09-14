import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Background } from './Background';

describe('Background', () => {
    it('renders with root class', () => {
        const { container } = render(<Background />);
        expect(container.firstChild).toHaveClass('animal-background');
    });

    it('default type=default applies animal-background-default class', () => {
        const { container } = render(<Background />);
        const root = container.firstChild as HTMLElement;
        expect(root).toHaveClass('animal-background-default');
    });

    it('type=sprinkles applies animal-background-sprinkles class', () => {
        const { container } = render(<Background type="sprinkles" />);
        expect(container.firstChild).toHaveClass('animal-background-sprinkles');
    });

    it('type=dots-pink applies animal-background-dots-pink class', () => {
        const { container } = render(<Background type="dots-pink" />);
        expect(container.firstChild).toHaveClass('animal-background-dots-pink');
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
