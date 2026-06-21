import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { Wallet } from './Wallet';

/**
 * Wallet guardrail. Source of truth: upstream Wallet @6689394 — a bell pouch
 * pill that formats numbers with a thousand separator (strings pass through),
 * with small/medium/large size presets and a default item-022 pouch icon.
 */
describe('Wallet', () => {
    const valueText = (c: HTMLElement) =>
        (c.querySelector('.animal-wallet-value') as HTMLElement).textContent;

    it('数字按千分位格式化', () => {
        const { container } = render(<Wallet value={1234567} />);
        expect(valueText(container)).toBe('1,234,567');
    });

    it('thousandSeparator="" 关闭格式化', () => {
        const { container } = render(<Wallet value={1234567} thousandSeparator="" />);
        expect(valueText(container)).toBe('1234567');
    });

    it('负数保留符号', () => {
        const { container } = render(<Wallet value={-12345} />);
        expect(valueText(container)).toBe('-12,345');
    });

    it('小数部分保留', () => {
        const { container } = render(<Wallet value={1234.56} />);
        expect(valueText(container)).toBe('1,234.56');
    });

    it('字符串原样展示', () => {
        const { container } = render(<Wallet value="∞" />);
        expect(valueText(container)).toBe('∞');
    });

    it('value 缺省时显示占位 00,000', () => {
        const { container } = render(<Wallet />);
        expect(valueText(container)).toBe('00,000');
    });

    it('size 映射到尺寸类', () => {
        const { container: small } = render(<Wallet size="small" />);
        expect((small.firstChild as HTMLElement).classList.contains('animal-wallet-small')).toBe(true);
        const { container: large } = render(<Wallet size="large" />);
        expect((large.firstChild as HTMLElement).classList.contains('animal-wallet-large')).toBe(true);
    });

    it('钱袋插槽为装饰性 aria-hidden', () => {
        const { container } = render(<Wallet />);
        const slot = container.querySelector('.animal-wallet-bag-slot') as HTMLElement;
        expect(slot.getAttribute('aria-hidden')).toBe('true');
    });

    it('自定义 icon 覆盖默认钱袋', () => {
        const { container } = render(<Wallet icon={<span data-testid="custom">💰</span>} />);
        expect(container.querySelector('[data-testid="custom"]')).not.toBeNull();
    });
});
