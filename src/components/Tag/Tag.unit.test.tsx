import { describe, it, expect, vi } from 'vitest';
import { render, fireEvent } from '@testing-library/react';
import { Tag } from './Tag';

/**
 * Tag guardrail. Stable `animal-tag*` class names replace upstream Less-module
 * class hashes. Structural parity with upstream Tag tests.
 */
describe('Tag', () => {
    it('默认渲染 animal-tag、size-medium、variant-soft 类', () => {
        const { container } = render(<Tag>Hello</Tag>);
        const root = container.firstChild as HTMLElement;
        expect(root.classList.contains('animal-tag')).toBe(true);
        expect(root.classList.contains('animal-tag-size-medium')).toBe(true);
        expect(root.classList.contains('animal-tag-variant-soft')).toBe(true);
    });

    it('size=small 添加对应类', () => {
        const { container } = render(<Tag size="small">x</Tag>);
        const root = container.firstChild as HTMLElement;
        expect(root.classList.contains('animal-tag-size-small')).toBe(true);
    });

    it('size=large 添加对应类', () => {
        const { container } = render(<Tag size="large">x</Tag>);
        const root = container.firstChild as HTMLElement;
        expect(root.classList.contains('animal-tag-size-large')).toBe(true);
    });

    it('variant=outlined 添加 animal-tag-variant-outlined', () => {
        const { container } = render(<Tag variant="outlined">x</Tag>);
        const root = container.firstChild as HTMLElement;
        expect(root.classList.contains('animal-tag-variant-outlined')).toBe(true);
    });

    it('非 default color + soft variant 添加颜色类', () => {
        const { container } = render(<Tag color="app-pink" variant="soft">x</Tag>);
        const root = container.firstChild as HTMLElement;
        expect(root.classList.contains('animal-tag-color-app-pink-soft')).toBe(true);
    });

    it('非 default color + solid variant 添加 -solid 颜色类', () => {
        const { container } = render(<Tag color="purple" variant="solid">x</Tag>);
        const root = container.firstChild as HTMLElement;
        expect(root.classList.contains('animal-tag-color-purple-solid')).toBe(true);
    });

    it('default color 不添加颜色类', () => {
        const { container } = render(<Tag color="default">x</Tag>);
        const root = container.firstChild as HTMLElement;
        expect(root.className).not.toMatch(/animal-tag-color/);
    });

    it('closable=true 渲染关闭按钮', () => {
        const { container } = render(<Tag closable>x</Tag>);
        const btn = container.querySelector('.animal-tag-close');
        expect(btn).not.toBeNull();
    });

    it('closable=false 不渲染关闭按钮', () => {
        const { container } = render(<Tag>x</Tag>);
        expect(container.querySelector('.animal-tag-close')).toBeNull();
    });

    it('onClose 在点击关闭按钮时触发', () => {
        const onClose = vi.fn();
        const { container } = render(<Tag closable onClose={onClose}>x</Tag>);
        const btn = container.querySelector('.animal-tag-close') as HTMLElement;
        fireEvent.click(btn);
        expect(onClose).toHaveBeenCalledTimes(1);
    });

    it('disabled=true 添加 animal-tag-disabled，onClose 不触发', () => {
        const onClose = vi.fn();
        const { container } = render(<Tag closable disabled onClose={onClose}>x</Tag>);
        const root = container.firstChild as HTMLElement;
        expect(root.classList.contains('animal-tag-disabled')).toBe(true);
        const btn = container.querySelector('.animal-tag-close') as HTMLElement;
        fireEvent.click(btn);
        expect(onClose).not.toHaveBeenCalled();
    });

    it('有 onClick 且非 disabled 时添加 animal-tag-clickable，渲染 role=button', () => {
        const onClick = vi.fn();
        const { container } = render(<Tag onClick={onClick}>x</Tag>);
        const root = container.firstChild as HTMLElement;
        expect(root.classList.contains('animal-tag-clickable')).toBe(true);
        expect(root.getAttribute('role')).toBe('button');
    });

    it('onClick 点击触发', () => {
        const onClick = vi.fn();
        const { container } = render(<Tag onClick={onClick}>x</Tag>);
        fireEvent.click(container.firstChild as HTMLElement);
        expect(onClick).toHaveBeenCalledTimes(1);
    });

    it('disabled 时 onClick 不触发', () => {
        const onClick = vi.fn();
        const { container } = render(<Tag onClick={onClick} disabled>x</Tag>);
        fireEvent.click(container.firstChild as HTMLElement);
        expect(onClick).not.toHaveBeenCalled();
    });

    it('文本内容在 animal-tag-text span 内', () => {
        const { container } = render(<Tag>TagLabel</Tag>);
        const textSpan = container.querySelector('.animal-tag-text');
        expect(textSpan?.textContent).toBe('TagLabel');
    });
});
