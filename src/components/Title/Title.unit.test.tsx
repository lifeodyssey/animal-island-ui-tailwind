import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, render } from '@testing-library/react';
import { Title } from './Title';

afterEach(cleanup);

describe('Title variants', () => {
    it.each(['ribbon', 'layer', 'tab'] as const)('forwards root className and style for %s', (variant) => {
        const { container } = render(
            <Title variant={variant} className="custom-title" style={{ marginTop: 12 }}>Island</Title>
        );
        expect(container.firstElementChild).toHaveClass('animal-title', 'custom-title');
        expect(container.firstElementChild).toHaveStyle({ marginTop: '12px' });
    });

    it.each([
        ['layer', 'small', 14],
        ['layer', 'middle', 20],
        ['layer', 'large', 28],
        ['tab', 'small', 14],
        ['tab', 'middle', 20],
        ['tab', 'large', 28],
    ] as const)('retains %s size %s and its selected color', (variant, size, fontSize) => {
        const { container, rerender } = render(
            <Title variant={variant} size={size} color="app-teal">Island</Title>
        );
        const body = container.querySelector(`.animal-title-${variant}`);
        expect(body).toHaveStyle({ fontSize: `${fontSize}px` });
        expect(body).toHaveClass('animal-title-app-teal');

        rerender(<Title variant={variant} size={size} color="default">Island</Title>);
        expect(body).not.toHaveClass('animal-title-app-teal');
        expect(body).toHaveStyle({ fontSize: `${fontSize}px` });
    });

    it('keeps the layer default while retaining explicit variants', () => {
        const { container, rerender } = render(<Title>Island</Title>);
        expect(container.querySelector('.animal-title-layer-front')).toHaveTextContent('Island');
        expect(container.querySelector('.animal-title-ribbon')).toBeNull();
        rerender(<Title variant="ribbon">Ribbon</Title>);
        expect(container.querySelector('.animal-title-ribbon-text')).toHaveTextContent('Ribbon');
        expect(container.querySelectorAll('.animal-title-ribbon-back')).toHaveLength(2);
        expect(container.querySelectorAll('.animal-title-ribbon-fold')).toHaveLength(2);
        rerender(<Title variant="tab">Tab</Title>);
        expect(container.querySelector('.animal-title-tab-text')).toHaveTextContent('Tab');
    });
});
