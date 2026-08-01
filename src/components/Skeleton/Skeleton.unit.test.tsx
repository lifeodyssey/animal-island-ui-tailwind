import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { Skeleton, SkeletonButton, SkeletonInput, SkeletonAvatar } from './Skeleton';

describe('Skeleton', () => {
    describe('rendering', () => {
        it('renders skeleton element with base class', () => {
            const { container } = render(<Skeleton />);
            expect(container.querySelector('.animal-skeleton')).not.toBeNull();
        });

        it('applies active class when active=true', () => {
            const { container } = render(<Skeleton active />);
            expect(container.querySelector('.animal-skeleton-active')).not.toBeNull();
        });

        it('does not apply active class when active=false', () => {
            const { container } = render(<Skeleton active={false} />);
            expect(container.querySelector('.animal-skeleton-active')).toBeNull();
        });
    });

    describe('variants', () => {
        it('applies text variant class by default', () => {
            const { container } = render(<Skeleton variant="text" />);
            expect(container.querySelector('.animal-skeleton-text')).not.toBeNull();
        });

        it('applies circle variant class', () => {
            const { container } = render(<Skeleton variant="circle" />);
            expect(container.querySelector('.animal-skeleton-circle')).not.toBeNull();
        });

        it('applies rect variant class', () => {
            const { container } = render(<Skeleton variant="rect" />);
            expect(container.querySelector('.animal-skeleton-rect')).not.toBeNull();
        });

        it('applies paragraph variant class', () => {
            const { container } = render(<Skeleton variant="paragraph" />);
            expect(container.querySelector('.animal-skeleton-paragraph')).not.toBeNull();
        });

        it('renders rows for paragraph variant', () => {
            const { container } = render(<Skeleton variant="paragraph" rows={4} />);
            const lines = container.querySelectorAll('.animal-skeleton-line');
            expect(lines.length).toBe(4);
        });
    });

    describe('custom className and style', () => {
        it('applies custom className', () => {
            const { container } = render(<Skeleton className="my-sk" />);
            expect(container.querySelector('.my-sk')).not.toBeNull();
        });

        it('applies custom style', () => {
            const { container } = render(<Skeleton style={{ width: 200 }} />);
            const el = container.querySelector('.animal-skeleton') as HTMLElement;
            expect(el.style.width).toBe('200px');
        });
    });
});

describe('SkeletonButton', () => {
    it('renders with skeleton-btn class', () => {
        const { container } = render(<SkeletonButton />);
        expect(container.querySelector('.animal-skeleton-btn')).not.toBeNull();
    });

    it('applies active class when active=true', () => {
        const { container } = render(<SkeletonButton active />);
        expect(container.querySelector('.animal-skeleton-active')).not.toBeNull();
    });
});

describe('SkeletonInput', () => {
    it('renders with skeleton class', () => {
        const { container } = render(<SkeletonInput />);
        expect(container.querySelector('.animal-skeleton')).not.toBeNull();
    });

    it('applies active class when active=true', () => {
        const { container } = render(<SkeletonInput active />);
        expect(container.querySelector('.animal-skeleton-active')).not.toBeNull();
    });
});

describe('SkeletonAvatar', () => {
    it('renders with skeleton class', () => {
        const { container } = render(<SkeletonAvatar />);
        expect(container.querySelector('.animal-skeleton')).not.toBeNull();
    });

    it('applies circle class for circle shape', () => {
        const { container } = render(<SkeletonAvatar shape="circle" />);
        expect(container.querySelector('.animal-skeleton-circle')).not.toBeNull();
    });

    it('applies rect class for square shape', () => {
        const { container } = render(<SkeletonAvatar shape="square" />);
        expect(container.querySelector('.animal-skeleton-rect')).not.toBeNull();
    });
});
