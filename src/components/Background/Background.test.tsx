import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { Background } from './Background';

describe('Background', () => {
    it('默认 type=dots：应用基础 animal-background 类', () => {
        const { container } = render(<Background />);
        expect(container.firstChild).toHaveClass('animal-background');
        expect(container.firstChild).not.toHaveClass('animal-background--sprinkles');
    });

    it('type="sprinkles"：应用 animal-background--sprinkles 类', () => {
        const { container } = render(<Background type="sprinkles" />);
        expect(container.firstChild).toHaveClass('animal-background');
        expect(container.firstChild).toHaveClass('animal-background--sprinkles');
    });

    it('渲染 children 于背景之上', () => {
        render(
            <Background>
                <p>岛屿内容</p>
            </Background>
        );
        expect(screen.getByText('岛屿内容')).toBeInTheDocument();
    });

    it('应用 className 与 style', () => {
        const { container } = render(<Background className="x" style={{ height: 100 }} />);
        expect(container.firstChild).toHaveClass('x');
        expect(container.firstChild).toHaveStyle({ height: '100px' });
    });
});
