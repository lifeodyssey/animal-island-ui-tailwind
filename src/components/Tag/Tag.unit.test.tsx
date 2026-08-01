import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { fireEvent } from '@testing-library/react';
import { Tag } from './Tag';

describe('Tag', () => {
    describe('rendering', () => {
        it('renders children text', () => {
            render(<Tag>hello</Tag>);
            expect(screen.getByText('hello')).toBeInTheDocument();
        });

        it('applies base animal-tag class and size-medium/variant-soft defaults', () => {
            const { container } = render(<Tag>x</Tag>);
            const root = container.firstChild as HTMLElement;
            expect(root).toHaveClass('animal-tag');
            expect(root).toHaveClass('animal-tag-size-medium');
            expect(root).toHaveClass('animal-tag-variant-soft');
        });

        it('supports className and style', () => {
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
        it('size=small applies animal-tag-size-small', () => {
            const { container } = render(<Tag size="small">x</Tag>);
            expect(container.firstChild).toHaveClass('animal-tag-size-small');
        });

        it('size=large applies animal-tag-size-large', () => {
            const { container } = render(<Tag size="large">x</Tag>);
            expect(container.firstChild).toHaveClass('animal-tag-size-large');
        });
    });

    describe('variant', () => {
        it('variant=outlined applies animal-tag-variant-outlined', () => {
            const { container } = render(<Tag variant="outlined">x</Tag>);
            expect(container.firstChild).toHaveClass('animal-tag-variant-outlined');
        });

        it('variant=dashed applies animal-tag-variant-dashed', () => {
            const { container } = render(<Tag variant="dashed">x</Tag>);
            expect(container.firstChild).toHaveClass('animal-tag-variant-dashed');
        });

        it('variant=solid applies animal-tag-variant-solid', () => {
            const { container } = render(<Tag variant="solid">x</Tag>);
            expect(container.firstChild).toHaveClass('animal-tag-variant-solid');
        });
    });

    describe('color', () => {
        it('color=app-pink + variant=solid applies animal-tag-color-app-pink-solid', () => {
            const { container } = render(
                <Tag color="app-pink" variant="solid">
                    x
                </Tag>
            );
            expect(container.firstChild).toHaveClass('animal-tag-color-app-pink-solid');
        });

        it('color=purple + variant=outlined applies animal-tag-color-purple-outlined', () => {
            const { container } = render(
                <Tag color="purple" variant="outlined">
                    x
                </Tag>
            );
            expect(container.firstChild).toHaveClass('animal-tag-color-purple-outlined');
        });

        it('color=default applies no animal-tag-color-* class', () => {
            const { container } = render(<Tag color="default">x</Tag>);
            const root = container.firstChild as HTMLElement;
            expect(root.className).not.toContain('animal-tag-color');
        });

        it('color=app-teal + variant=soft applies animal-tag-color-app-teal-soft', () => {
            const { container } = render(
                <Tag color="app-teal" variant="soft">
                    x
                </Tag>
            );
            expect(container.firstChild).toHaveClass('animal-tag-color-app-teal-soft');
        });
    });

    describe('closable', () => {
        it('renders close button when closable=true', () => {
            render(<Tag closable>x</Tag>);
            expect(screen.getByRole('button', { name: 'close' })).toBeInTheDocument();
        });

        it('calls onClose when close button clicked', () => {
            const onClose = vi.fn();
            render(
                <Tag closable onClose={onClose}>
                    x
                </Tag>
            );
            fireEvent.click(screen.getByRole('button', { name: 'close' }));
            expect(onClose).toHaveBeenCalledTimes(1);
        });

        it('does not render close button when closable=false', () => {
            render(<Tag closable={false}>x</Tag>);
            expect(screen.queryByRole('button', { name: 'close' })).toBeNull();
        });
    });

    describe('disabled', () => {
        it('adds animal-tag-disabled class when disabled=true', () => {
            const { container } = render(<Tag disabled>x</Tag>);
            expect(container.firstChild).toHaveClass('animal-tag-disabled');
        });

        it('does not call onClick when disabled', () => {
            const onClick = vi.fn();
            // When disabled, isInteractive = false, so it renders as non-interactive span
            const { container } = render(
                <Tag onClick={onClick} disabled>
                    x
                </Tag>
            );
            fireEvent.click(container.firstChild as HTMLElement);
            expect(onClick).not.toHaveBeenCalled();
        });
    });

    describe('interactive', () => {
        it('renders as role=button when onClick provided', () => {
            render(<Tag onClick={vi.fn()}>x</Tag>);
            expect(screen.getByRole('button')).toBeInTheDocument();
        });

        it('adds animal-tag-clickable class when onClick provided', () => {
            const { container } = render(<Tag onClick={vi.fn()}>x</Tag>);
            expect(container.firstChild).toHaveClass('animal-tag-clickable');
        });

        it('calls onClick when clicked', () => {
            const onClick = vi.fn();
            render(<Tag onClick={onClick}>x</Tag>);
            fireEvent.click(screen.getByRole('button'));
            expect(onClick).toHaveBeenCalledTimes(1);
        });

        it('does not render as role=button when onClick not provided', () => {
            render(<Tag>x</Tag>);
            expect(screen.queryByRole('button')).toBeNull();
        });
    });
});
