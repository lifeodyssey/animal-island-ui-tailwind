import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { Icon, ITEM_LIST, ITEM_COUNT } from './Icon';

/**
 * Icon `item` prop guardrail. Source of truth: upstream Icon @12607c9 — `name`
 * becomes optional and an `item` number renders the matching glyph from the
 * "Items" sheet via a background-image URL. This fork bundles the same asset
 * set under src/assets/img/icons/items and keys it by numeric id.
 */
describe('Icon item', () => {
    it('暴露与资源数量一致的 ITEM_LIST / ITEM_COUNT', () => {
        expect(ITEM_COUNT).toBeGreaterThan(0);
        expect(ITEM_LIST).toHaveLength(ITEM_COUNT);
        expect([...ITEM_LIST].sort((a, b) => a - b)).toEqual(ITEM_LIST);
    });

    it('item 渲染为内联 background-image', () => {
        const { container } = render(<Icon item={ITEM_LIST[0]} />);
        const root = container.firstChild as HTMLElement;
        expect(root.classList.contains('animal-icon')).toBe(true);
        expect(root.style.backgroundImage).toMatch(/url\(/);
    });

    it('未知 item 编号不设置 background-image', () => {
        const { container } = render(<Icon item={99999} />);
        const root = container.firstChild as HTMLElement;
        expect(root.style.backgroundImage).toBe('');
    });

    it('name 仍可单独使用并保持 animal-<name> 类', () => {
        const { container } = render(<Icon name="icon-map" />);
        const root = container.firstChild as HTMLElement;
        expect(root.classList.contains('animal-icon-map')).toBe(true);
        expect(root.style.backgroundImage).toBe('');
    });

    it('item 模式下默认 aria-hidden(装饰性)', () => {
        const { container } = render(<Icon item={ITEM_LIST[0]} />);
        const root = container.firstChild as HTMLElement;
        expect(root.getAttribute('aria-hidden')).toBe('true');
    });
});
