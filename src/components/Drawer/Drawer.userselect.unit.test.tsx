/**
 * Drawer chrome must not be text-selectable (upstream fix 127a413).
 * The mask inherits user-select:none to everything inside, so body
 * and form fields need an explicit user-select:text re-declaration in CSS.
 *
 * JSDOM does not compute styles from external CSS files, so these tests
 * assert structural class assignments. The actual CSS values are verified
 * by the companion Playwright test (tests/playwright-overlays-userselect.spec.ts).
 *
 * NOTE: We use querySelector (not getByRole) because the panel has
 * aria-hidden="true" when closed, hiding it from accessible queries.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { cleanup, render } from '@testing-library/react';
import { Drawer } from './Drawer';

afterEach(cleanup);

describe('Drawer text-selection class contract', () => {
    it('mask carries animal-drawer-mask (CSS defines user-select:none)', () => {
        render(<Drawer open={false} title="t" onClose={() => {}} />);
        const panel = document.querySelector('[role="dialog"]')!;
        expect(panel).not.toBeNull();
        expect(panel.parentElement!.classList.contains('animal-drawer-mask')).toBe(true);
    });

    it('header carries animal-drawer-header (CSS defines user-select:none)', () => {
        render(<Drawer open={false} title="侧边栏标题" onClose={() => {}} />);
        const panel = document.querySelector('[role="dialog"]')!;
        expect(panel.querySelector('.animal-drawer-header')).not.toBeNull();
    });

    it('title element carries animal-drawer-title (CSS defines user-select:none)', () => {
        render(<Drawer open={false} title="侧边栏标题" onClose={() => {}} />);
        const title = document.querySelector('.animal-drawer-title');
        expect(title).not.toBeNull();
        expect(title!.textContent).toBe('侧边栏标题');
    });

    it('close button carries animal-drawer-close (CSS defines user-select:none)', () => {
        render(<Drawer open={false} title="t" onClose={() => {}} />);
        const closeBtn = document.querySelector('.animal-drawer-close');
        expect(closeBtn).not.toBeNull();
    });

    it('body carries animal-drawer-body (CSS defines user-select:text)', () => {
        render(
            <Drawer open={false} title="t" onClose={() => {}}>
                <p>正文内容</p>
            </Drawer>
        );
        const panel = document.querySelector('[role="dialog"]')!;
        expect(panel.querySelector('.animal-drawer-body')).not.toBeNull();
    });

    it('footer carries animal-drawer-footer (CSS defines user-select:none)', () => {
        render(
            <Drawer open={false} title="t" onClose={() => {}} footer={<button>确定</button>} />
        );
        const panel = document.querySelector('[role="dialog"]')!;
        expect(panel.querySelector('.animal-drawer-footer')).not.toBeNull();
    });
});
