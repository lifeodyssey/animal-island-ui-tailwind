import { describe, it, expect, afterEach } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import { Avatar, AvatarGroup } from './Avatar';

afterEach(() => {
    cleanup();
});

describe('Avatar', () => {
    describe('rendering', () => {
        it('渲染文字内容', () => {
            render(<Avatar>AB</Avatar>);
            expect(screen.getByText('AB')).toBeInTheDocument();
        });

        it('默认应用 animal-avatar 类', () => {
            const { container } = render(<Avatar />);
            expect(container.firstChild).toHaveClass('animal-avatar');
        });

        it('无图片时应用 animal-avatar-placeholder 类', () => {
            const { container } = render(<Avatar />);
            expect(container.firstChild).toHaveClass('animal-avatar-placeholder');
        });

        it('支持 className 与 style', () => {
            const { container } = render(
                <Avatar className="custom" style={{ marginLeft: 4 }} />
            );
            const root = container.firstChild as HTMLElement;
            expect(root).toHaveClass('custom');
            expect(root).toHaveStyle({ marginLeft: '4px' });
        });
    });

    describe('shape', () => {
        it('shape=square 应用对应类', () => {
            const { container } = render(<Avatar shape="square" />);
            expect(container.firstChild).toHaveClass('animal-avatar-shape-square');
        });

        it('shape=circle 不应用 square 类', () => {
            const { container } = render(<Avatar shape="circle" />);
            expect(container.firstChild).not.toHaveClass('animal-avatar-shape-square');
        });
    });

    describe('size', () => {
        it('number size 设置 width/height', () => {
            const { container } = render(<Avatar size={64} />);
            const root = container.firstChild as HTMLElement;
            expect(root.style.width).toBe('64px');
            expect(root.style.height).toBe('64px');
        });

        it('size=small 设置 32px', () => {
            const { container } = render(<Avatar size="small" />);
            const root = container.firstChild as HTMLElement;
            expect(root.style.width).toBe('32px');
        });

        it('size=large 设置 48px', () => {
            const { container } = render(<Avatar size="large" />);
            const root = container.firstChild as HTMLElement;
            expect(root.style.width).toBe('48px');
        });
    });

    describe('src', () => {
        it('有 src 时渲染 img 标签', () => {
            render(<Avatar src="https://example.com/a.png" alt="test" />);
            const img = document.querySelector('.animal-avatar-img') as HTMLImageElement;
            expect(img).not.toBeNull();
            expect(img.src).toContain('a.png');
        });

        it('有 src 时不应用 placeholder 类', () => {
            const { container } = render(<Avatar src="https://example.com/a.png" />);
            expect(container.firstChild).not.toHaveClass('animal-avatar-placeholder');
        });
    });
});

describe('AvatarGroup', () => {
    it('渲染所有子 Avatar', () => {
        const { container } = render(
            <AvatarGroup>
                <Avatar>A</Avatar>
                <Avatar>B</Avatar>
            </AvatarGroup>
        );
        expect(container.querySelectorAll('.animal-avatar')).toHaveLength(2);
    });

    it('超过 maxCount 显示溢出徽章', () => {
        const { container } = render(
            <AvatarGroup maxCount={2}>
                <Avatar>A</Avatar>
                <Avatar>B</Avatar>
                <Avatar>C</Avatar>
            </AvatarGroup>
        );
        // 2 shown avatars + 1 "more" badge (also has animal-avatar class) = 3 total
        expect(container.querySelectorAll('.animal-avatar:not(.animal-avatar-group-more)')).toHaveLength(2);
        expect(container.querySelector('.animal-avatar-group-more')).not.toBeNull();
        expect(container.querySelector('.animal-avatar-group-more')!.textContent).toBe('+1');
    });

    it('应用 animal-avatar-group 类', () => {
        const { container } = render(
            <AvatarGroup>
                <Avatar>A</Avatar>
            </AvatarGroup>
        );
        expect(container.firstChild).toHaveClass('animal-avatar-group');
    });
});
