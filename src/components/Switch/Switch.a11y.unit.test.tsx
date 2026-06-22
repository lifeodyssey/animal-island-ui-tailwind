import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { Switch } from './Switch';

/**
 * Switch a11y guardrail. Source of truth: upstream WAI-ARIA APG pass @5221c3c —
 * loading switches expose aria-busy, and consumers can label them. Radix Switch
 * already supplies role="switch"/aria-checked; this fork only adds aria-busy and
 * relies on prop passthrough for aria-label.
 */
describe('Switch a11y', () => {
    it('loading 时设置 aria-busy', () => {
        const { container } = render(<Switch loading />);
        const root = container.querySelector('.animal-switch') as HTMLElement;
        expect(root.getAttribute('aria-busy')).toBe('true');
    });

    it('非 loading 时不设置 aria-busy', () => {
        const { container } = render(<Switch />);
        const root = container.querySelector('.animal-switch') as HTMLElement;
        expect(root.getAttribute('aria-busy')).toBeNull();
    });

    it('透传 aria-label 到底层按钮', () => {
        const { container } = render(<Switch aria-label="静音开关" />);
        const root = container.querySelector('.animal-switch') as HTMLElement;
        expect(root.getAttribute('aria-label')).toBe('静音开关');
    });
});
