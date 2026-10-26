/**
 * Modal chrome must not be text-selectable (upstream fix 127a413).
 * The overlay inherits to everything inside, so body and form fields need
 * an explicit user-select:text re-declaration in CSS.
 *
 * JSDOM does not compute styles from external CSS files, so these tests
 * assert structural class assignments. The actual CSS values are verified
 * by the companion Playwright test (tests/playwright-overlays-userselect.spec.ts).
 */
import { describe, it, expect, afterEach } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import { Modal } from './Modal';

afterEach(cleanup);

describe('Modal text-selection class contract', () => {
    it('overlay carries animal-modal-overlay (CSS defines user-select:none)', () => {
        render(<Modal open title="岛屿设置" typewriter={false}>content</Modal>);
        const overlay = document.querySelector('.animal-modal-overlay');
        expect(overlay).not.toBeNull();
    });

    it('header carries animal-modal-header (CSS defines user-select:none)', () => {
        render(<Modal open title="岛屿设置" typewriter={false}>content</Modal>);
        const dialog = screen.getByRole('dialog');
        const header = dialog.querySelector('.animal-modal-header');
        expect(header).not.toBeNull();
    });

    it('title element carries animal-modal-title (CSS defines user-select:none)', () => {
        render(<Modal open title="岛屿设置" typewriter={false}>content</Modal>);
        const title = document.querySelector('.animal-modal-title');
        expect(title).not.toBeNull();
        expect(title!.textContent).toBe('岛屿设置');
    });

    it('body carries animal-modal-body (CSS defines user-select:text)', () => {
        render(<Modal open title="t" typewriter={false}>正文内容</Modal>);
        const dialog = screen.getByRole('dialog');
        const body = dialog.querySelector('.animal-modal-body');
        expect(body).not.toBeNull();
    });

    it('footer carries animal-modal-footer (CSS defines user-select:none)', () => {
        render(
            <Modal open title="t" typewriter={false} footer={<button>确定</button>}>
                content
            </Modal>
        );
        const dialog = screen.getByRole('dialog');
        const footer = dialog.querySelector('.animal-modal-footer');
        expect(footer).not.toBeNull();
    });
});
