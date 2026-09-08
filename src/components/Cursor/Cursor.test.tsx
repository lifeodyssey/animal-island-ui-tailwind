import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import React from 'react';
import { Cursor } from './Cursor';

describe('Cursor', () => {
    it('默认 forceAll=true：不带 scoped 类', () => {
        const { container } = render(<Cursor>x</Cursor>);
        expect(container.firstChild).toHaveClass('animal-cursor');
        expect(container.firstChild).not.toHaveClass('animal-cursor--scoped');
    });

    it('forceAll=false：带 scoped 类', () => {
        const { container } = render(<Cursor forceAll={false}>x</Cursor>);
        expect(container.firstChild).toHaveClass('animal-cursor--scoped');
    });

    it('type 未设置时（默认）不带 raindrop 类', () => {
        const { container } = render(<Cursor>x</Cursor>);
        expect(container.firstChild).not.toHaveClass('animal-cursor--raindrop');
    });

    it('type="raindrop" 应用 animal-cursor--raindrop', () => {
        const { container } = render(<Cursor type="raindrop">x</Cursor>);
        expect(container.firstChild).toHaveClass('animal-cursor--raindrop');
        expect(container.firstChild).not.toHaveClass('animal-cursor--scoped');
    });

    it('type="raindrop" 与 forceAll=false 组合', () => {
        const { container } = render(
            <Cursor type="raindrop" forceAll={false}>
                x
            </Cursor>
        );
        expect(container.firstChild).toHaveClass('animal-cursor--raindrop');
        expect(container.firstChild).toHaveClass('animal-cursor--scoped');
    });

    it('应用 className 与 style', () => {
        const { container } = render(
            <Cursor className="extra" style={{ padding: 4 }}>
                x
            </Cursor>
        );
        expect(container.firstChild).toHaveClass('extra');
        expect(container.firstChild).toHaveStyle({ padding: '4px' });
    });
});
