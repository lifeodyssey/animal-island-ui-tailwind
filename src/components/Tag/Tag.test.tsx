import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { Tag } from './Tag';

/**
 * Tag unit tests. Adapted from upstream guokaigdg/animal-island-ui.
 * All styles.xxx references replaced with literal animal-tag-* class names.
 *
 * jsdom + RTL — runs under the `unit` vitest project.
 */
describe('Tag', () => {
    afterEach(() => {
        cleanup();
    });

    describe('基础渲染', () => {
        it('渲染为 <span> 并包含 animal-tag 类', () => {
            const { container } = render(<Tag>hello</Tag>);
            const root = container.firstElementChild as HTMLElement;
            expect(root.tagName).toBe('SPAN');
            expect(root.classList.contains('animal-tag')).toBe(true);
        });

        it('默认尺寸为 medium', () => {
            const { container } = render(<Tag>hello</Tag>);
            const root = container.firstElementChild as HTMLElement;
            expect(root.classList.contains('animal-tag-medium')).toBe(true);
        });

        it('默认变体为 soft', () => {
            const { container } = render(<Tag>hello</Tag>);
            const root = container.firstElementChild as HTMLElement;
            expect(root.classList.contains('animal-tag-soft')).toBe(true);
        });

        it('默认颜色为 default，不带颜色专属 class', () => {
            const { container } = render(<Tag>hello</Tag>);
            const root = container.firstElementChild as HTMLElement;
            expect(root.className).not.toMatch(/animal-tag-default/);
        });

        it('渲染子文本', () => {
            render(<Tag>标签文字</Tag>);
            expect(screen.getByText('标签文字')).toBeTruthy();
        });

        it('文字包裹在 animal-tag-text 内', () => {
            const { container } = render(<Tag>text</Tag>);
            expect(container.querySelector('.animal-tag-text')).toBeTruthy();
        });
    });

    describe('size prop', () => {
        it('size=small 应用 animal-tag-small', () => {
            const { container } = render(<Tag size="small">s</Tag>);
            expect((container.firstElementChild as HTMLElement).classList.contains('animal-tag-small')).toBe(true);
        });

        it('size=medium 应用 animal-tag-medium', () => {
            const { container } = render(<Tag size="medium">m</Tag>);
            expect((container.firstElementChild as HTMLElement).classList.contains('animal-tag-medium')).toBe(true);
        });

        it('size=large 应用 animal-tag-large', () => {
            const { container } = render(<Tag size="large">l</Tag>);
            expect((container.firstElementChild as HTMLElement).classList.contains('animal-tag-large')).toBe(true);
        });
    });

    describe('variant prop', () => {
        it('variant=soft 应用 animal-tag-soft', () => {
            const { container } = render(<Tag variant="soft">t</Tag>);
            expect((container.firstElementChild as HTMLElement).classList.contains('animal-tag-soft')).toBe(true);
        });

        it('variant=outlined 应用 animal-tag-outlined', () => {
            const { container } = render(<Tag variant="outlined">t</Tag>);
            expect((container.firstElementChild as HTMLElement).classList.contains('animal-tag-outlined')).toBe(true);
        });

        it('variant=dashed 应用 animal-tag-dashed', () => {
            const { container } = render(<Tag variant="dashed">t</Tag>);
            expect((container.firstElementChild as HTMLElement).classList.contains('animal-tag-dashed')).toBe(true);
        });

        it('variant=solid 应用 animal-tag-solid', () => {
            const { container } = render(<Tag variant="solid">t</Tag>);
            expect((container.firstElementChild as HTMLElement).classList.contains('animal-tag-solid')).toBe(true);
        });
    });

    describe('color + variant 组합', () => {
        it('color=app-pink + variant=solid → animal-tag-app-pink-solid', () => {
            const { container } = render(
                <Tag color="app-pink" variant="solid">
                    t
                </Tag>,
            );
            expect(
                (container.firstElementChild as HTMLElement).classList.contains('animal-tag-app-pink-solid'),
            ).toBe(true);
        });

        it('color=purple + variant=outlined → animal-tag-purple-outlined', () => {
            const { container } = render(
                <Tag color="purple" variant="outlined">
                    t
                </Tag>,
            );
            expect(
                (container.firstElementChild as HTMLElement).classList.contains('animal-tag-purple-outlined'),
            ).toBe(true);
        });

        it('color=app-blue + variant=dashed → animal-tag-app-blue-dashed', () => {
            const { container } = render(
                <Tag color="app-blue" variant="dashed">
                    t
                </Tag>,
            );
            expect(
                (container.firstElementChild as HTMLElement).classList.contains('animal-tag-app-blue-dashed'),
            ).toBe(true);
        });

        it('color=app-pink + variant=soft → animal-tag-app-pink-soft', () => {
            const { container } = render(
                <Tag color="app-pink" variant="soft">
                    t
                </Tag>,
            );
            expect(
                (container.firstElementChild as HTMLElement).classList.contains('animal-tag-app-pink-soft'),
            ).toBe(true);
        });

        it('color=app-green + variant=soft → animal-tag-app-green-soft', () => {
            const { container } = render(
                <Tag color="app-green" variant="soft">
                    t
                </Tag>,
            );
            expect(
                (container.firstElementChild as HTMLElement).classList.contains('animal-tag-app-green-soft'),
            ).toBe(true);
        });

        it('color=default 时不带颜色 class', () => {
            const { container } = render(
                <Tag color="default" variant="solid">
                    t
                </Tag>,
            );
            expect((container.firstElementChild as HTMLElement).className).not.toMatch(/animal-tag-default/);
        });
    });

    describe('closable', () => {
        it('closable=false 时不渲染关闭按钮', () => {
            const { container } = render(<Tag>t</Tag>);
            expect(container.querySelector('.animal-tag-close')).toBeNull();
        });

        it('closable=true 时渲染关闭按钮', () => {
            const { container } = render(<Tag closable>t</Tag>);
            expect(container.querySelector('.animal-tag-close')).toBeTruthy();
        });

        it('点击关闭按钮触发 onClose', () => {
            const onClose = vi.fn();
            const { container } = render(
                <Tag closable onClose={onClose}>
                    t
                </Tag>,
            );
            fireEvent.click(container.querySelector('.animal-tag-close') as HTMLElement);
            expect(onClose).toHaveBeenCalledTimes(1);
        });

        it('点击关闭按钮不冒泡到 onClick', () => {
            const onClick = vi.fn();
            const onClose = vi.fn();
            const { container } = render(
                <Tag closable onClick={onClick} onClose={onClose}>
                    t
                </Tag>,
            );
            fireEvent.click(container.querySelector('.animal-tag-close') as HTMLElement);
            expect(onClose).toHaveBeenCalledTimes(1);
            expect(onClick).not.toHaveBeenCalled();
        });

        it('disabled 时点击关闭按钮不触发 onClose', () => {
            const onClose = vi.fn();
            const { container } = render(
                <Tag closable disabled onClose={onClose}>
                    t
                </Tag>,
            );
            fireEvent.click(container.querySelector('.animal-tag-close') as HTMLElement);
            expect(onClose).not.toHaveBeenCalled();
        });
    });

    describe('onClick / isInteractive', () => {
        it('提供 onClick 时变为可交互，带 role=button 和 animal-tag-clickable', () => {
            const onClick = vi.fn();
            const { container } = render(<Tag onClick={onClick}>t</Tag>);
            const root = container.firstElementChild as HTMLElement;
            expect(root.getAttribute('role')).toBe('button');
            expect(root.classList.contains('animal-tag-clickable')).toBe(true);
        });

        it('点击可交互 tag 触发 onClick', () => {
            const onClick = vi.fn();
            render(<Tag onClick={onClick}>t</Tag>);
            fireEvent.click(screen.getByRole('button'));
            expect(onClick).toHaveBeenCalledTimes(1);
        });

        it('按 Enter 键触发 onClick', () => {
            const onClick = vi.fn();
            render(<Tag onClick={onClick}>t</Tag>);
            fireEvent.keyDown(screen.getByRole('button'), { key: 'Enter' });
            expect(onClick).toHaveBeenCalledTimes(1);
        });

        it('按 Space 键触发 onClick', () => {
            const onClick = vi.fn();
            render(<Tag onClick={onClick}>t</Tag>);
            fireEvent.keyDown(screen.getByRole('button'), { key: ' ' });
            expect(onClick).toHaveBeenCalledTimes(1);
        });

        it('无 onClick 时不带 role=button', () => {
            const { container } = render(<Tag>t</Tag>);
            expect((container.firstElementChild as HTMLElement).getAttribute('role')).toBeNull();
        });
    });

    describe('disabled', () => {
        it('disabled 时带 animal-tag-disabled 类', () => {
            const { container } = render(<Tag disabled>t</Tag>);
            expect((container.firstElementChild as HTMLElement).classList.contains('animal-tag-disabled')).toBe(true);
        });

        it('disabled + onClick：不触发 onClick，无 role=button', () => {
            const onClick = vi.fn();
            const { container } = render(
                <Tag disabled onClick={onClick}>
                    t
                </Tag>,
            );
            const root = container.firstElementChild as HTMLElement;
            expect(root.getAttribute('role')).toBeNull();
            fireEvent.click(root);
            expect(onClick).not.toHaveBeenCalled();
        });
    });

    describe('className / style', () => {
        it('额外 className 合并到根元素', () => {
            const { container } = render(<Tag className="custom-cls">t</Tag>);
            expect((container.firstElementChild as HTMLElement).classList.contains('custom-cls')).toBe(true);
        });

        it('style 透传到根元素', () => {
            const { container } = render(<Tag style={{ color: 'red' }}>t</Tag>);
            expect((container.firstElementChild as HTMLElement).style.color).toBe('red');
        });
    });
});
