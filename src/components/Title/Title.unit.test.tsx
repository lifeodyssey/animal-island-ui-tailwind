import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { Title } from './Title';

describe('Title', () => {
    it('renders children text', () => {
        const { container } = render(<Title>Hello</Title>);
        expect(container.textContent).toContain('Hello');
    });

    it('default size=middle applies 20px font-size', () => {
        const { container } = render(<Title>X</Title>);
        const ribbon = container.querySelector('.animal-title-ribbon') as HTMLElement;
        expect(ribbon).toHaveStyle({ fontSize: '20px' });
    });

    it('renders ribbon structure by default', () => {
        const { container } = render(<Title>X</Title>);
        expect(container.querySelector('.animal-title-ribbon')).toBeTruthy();
    });

    it('size=large applies 28px font-size', () => {
        const { container } = render(<Title size="large">X</Title>);
        const ribbon = container.querySelector('.animal-title-ribbon') as HTMLElement;
        expect(ribbon).toHaveStyle({ fontSize: '28px' });
    });

    it('size=small applies 14px font-size', () => {
        const { container } = render(<Title size="small">X</Title>);
        const ribbon = container.querySelector('.animal-title-ribbon') as HTMLElement;
        expect(ribbon).toHaveStyle({ fontSize: '14px' });
    });

    it('color=app-pink applies animal-title-app-pink class', () => {
        const { container } = render(<Title color="app-pink">X</Title>);
        const ribbon = container.querySelector('.animal-title-ribbon') as HTMLElement;
        expect(ribbon).toHaveClass('animal-title-app-pink');
    });

    it('default color adds no color modifier class', () => {
        const { container } = render(<Title>X</Title>);
        const ribbon = container.querySelector('.animal-title-ribbon') as HTMLElement;
        expect(ribbon).not.toHaveClass('animal-title-app-pink');
        expect(ribbon).not.toHaveClass('animal-title-purple');
    });

    it('applies className and style to root span', () => {
        const { container } = render(
            <Title className="my-t" style={{ marginLeft: 4 }}>
                X
            </Title>
        );
        const root = container.firstChild as HTMLElement;
        expect(root).toHaveClass('my-t');
        expect(root).toHaveStyle({ marginLeft: '4px' });
    });

    it('ribbon has six-layer structure', () => {
        const { container } = render(<Title>X</Title>);
        const ribbon = container.querySelector('.animal-title-ribbon')!;
        expect(ribbon.querySelectorAll('.animal-title-ribbon-back')).toHaveLength(2);
        expect(ribbon.querySelector('.animal-title-ribbon-back-left')).toBeTruthy();
        expect(ribbon.querySelector('.animal-title-ribbon-back-right')).toBeTruthy();
        expect(ribbon.querySelectorAll('.animal-title-ribbon-fold')).toHaveLength(2);
        expect(ribbon.querySelector('.animal-title-ribbon-fold-left')).toBeTruthy();
        expect(ribbon.querySelector('.animal-title-ribbon-fold-right')).toBeTruthy();
        expect(ribbon.querySelector('.animal-title-ribbon-front')).toBeTruthy();
        expect(ribbon.querySelector('.animal-title-ribbon-text')).toBeTruthy();
    });
});
