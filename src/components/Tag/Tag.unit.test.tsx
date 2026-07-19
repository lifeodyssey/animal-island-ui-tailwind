import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Tag } from './Tag';

describe('Tag', () => {
    describe('rendering', () => {
        it('renders children text', () => {
            render(<Tag>hello</Tag>);
            expect(screen.getByText('hello')).toBeInTheDocument();
        });

        it('applies base animal-tag class with default medium/solid', () => {
            const { container } = render(<Tag>x</Tag>);
            const root = container.firstChild as HTMLElement;
            expect(root).toHaveClass('animal-tag');
            expect(root).toHaveClass('animal-tag-medium');
            expect(root).toHaveClass('animal-tag-solid');
        });

        it('forwards className and style', () => {
            const { container } = render(
                <Tag className="x" style={{ marginLeft: 4 }}>
                    t
                </Tag>
            );
            const root = container.firstChild as HTMLElement;
            expect(root).toHaveClass('x');
            expect(root).toHaveStyle({ marginLeft: '4px' });
        });
    });

    describe('size', () => {
        it('size=small applies small class', () => {
            const { container } = render(<Tag size="small">x</Tag>);
            expect(container.firstChild).toHaveClass('animal-tag-small');
        });

        it('size=large applies large class', () => {
            const { container } = render(<Tag size="large">x</Tag>);
            expect(container.firstChild).toHaveClass('animal-tag-large');
        });
    });

    describe('variant', () => {
        it('variant=outlined applies outlined class', () => {
            const { container } = render(<Tag variant="outlined">x</Tag>);
            expect(container.firstChild).toHaveClass('animal-tag-outlined');
        });

        it('variant=dashed applies dashed class', () => {
            const { container } = render(<Tag variant="dashed">x</Tag>);
            expect(container.firstChild).toHaveClass('animal-tag-dashed');
        });
    });

    describe('color', () => {
        it('color=default adds no color class', () => {
            const { container } = render(<Tag color="default">x</Tag>);
            const root = container.firstChild as HTMLElement;
            expect(root.className).not.toMatch(/animal-tag-color-/);
        });

        it('color=app-pink + solid applies color-app-pink-solid class', () => {
            const { container } = render(
                <Tag color="app-pink" variant="solid">
                    x
                </Tag>
            );
            expect(container.firstChild).toHaveClass('animal-tag-color-app-pink-solid');
        });

        it('color=purple + outlined applies color-purple-outlined class', () => {
            const { container } = render(
                <Tag color="purple" variant="outlined">
                    x
                </Tag>
            );
            expect(container.firstChild).toHaveClass('animal-tag-color-purple-outlined');
        });

        it('color=app-blue + dashed applies color-app-blue-dashed class', () => {
            const { container } = render(
                <Tag color="app-blue" variant="dashed">
                    x
                </Tag>
            );
            expect(container.firstChild).toHaveClass('animal-tag-color-app-blue-dashed');
        });
    });

    describe('closable', () => {
        it('closable=true renders close button', () => {
            render(<Tag closable>x</Tag>);
            const btn = screen.getByRole('button', { name: 'close' });
            expect(btn).toBeInTheDocument();
        });

        it('clicking close button triggers onClose', () => {
            const onClose = vi.fn();
            render(
                <Tag closable onClose={onClose}>
                    x
                </Tag>
            );
            fireEvent.click(screen.getByRole('button', { name: 'close' }));
            expect(onClose).toHaveBeenCalledTimes(1);
        });

        it('disabled state: close button is disabled, onClose not called', () => {
            const onClose = vi.fn();
            render(
                <Tag closable disabled onClose={onClose}>
                    x
                </Tag>
            );
            const btn = screen.getByRole('button', { name: 'close' });
            expect(btn).toBeDisabled();
            fireEvent.click(btn);
            expect(onClose).not.toHaveBeenCalled();
        });
    });

    describe('clickable', () => {
        it('onClick makes tag a role=button with animal-tag-clickable class', () => {
            const onClick = vi.fn();
            render(<Tag onClick={onClick}>x</Tag>);
            const tag = screen.getByRole('button');
            expect(tag).toHaveClass('animal-tag-clickable');
            fireEvent.click(tag);
            expect(onClick).toHaveBeenCalledTimes(1);
        });

        it('disabled state: animal-tag-disabled class, onClick not called', () => {
            const onClick = vi.fn();
            const { container } = render(
                <Tag disabled onClick={onClick}>
                    x
                </Tag>
            );
            const root = container.firstChild as HTMLElement;
            expect(root).toHaveClass('animal-tag-disabled');
            fireEvent.click(root);
            expect(onClick).not.toHaveBeenCalled();
        });

        it('keyboard Enter triggers onClick', () => {
            const onClick = vi.fn();
            render(<Tag onClick={onClick}>x</Tag>);
            const tag = screen.getByRole('button');
            fireEvent.keyDown(tag, { key: 'Enter' });
            expect(onClick).toHaveBeenCalledTimes(1);
        });

        it('no onClick: root is not a button', () => {
            const { container } = render(<Tag>x</Tag>);
            const root = container.firstChild as HTMLElement;
            expect(root.getAttribute('role')).toBeNull();
        });
    });

    describe('event isolation', () => {
        it('clicking close button does not bubble to onClick', () => {
            const onClick = vi.fn();
            const onClose = vi.fn();
            render(
                <Tag closable onClose={onClose} onClick={onClick}>
                    x
                </Tag>
            );
            fireEvent.click(screen.getByRole('button', { name: 'close' }));
            expect(onClose).toHaveBeenCalledTimes(1);
            expect(onClick).not.toHaveBeenCalled();
        });
    });
});
