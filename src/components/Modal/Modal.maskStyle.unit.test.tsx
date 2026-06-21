import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { Modal } from './Modal';

/**
 * Modal maskStyle guardrail. Source of truth: upstream Modal @ce1151b/0eb727f —
 * a `maskStyle` prop forwards inline styles onto the mask overlay, and the
 * default mask background moves to the --animal-mask-bg token. This fork applies
 * the style to the Radix Dialog overlay (stable class animal-modal-overlay).
 */
describe('Modal maskStyle', () => {
    it('maskStyle 应用到遮罩层', () => {
        render(
            <Modal open title="t" maskStyle={{ backgroundColor: 'rgb(10, 20, 30)' }}>
                body
            </Modal>
        );
        const overlay = document.querySelector('.animal-modal-overlay') as HTMLElement;
        expect(overlay).not.toBeNull();
        expect(overlay.style.backgroundColor).toBe('rgb(10, 20, 30)');
    });
});
