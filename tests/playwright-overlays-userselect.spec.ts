/**
 * Verifies that overlay chrome (mask/header/title/close/footer) has user-select:none
 * and that the body zone has user-select:text (upstream fix 127a413).
 *
 * These checks run in a real Chromium browser where computed CSS is available.
 */
import { expect, test } from '@playwright/test';

const drawerStory =
    '/iframe.html?id=regression-parity-new-components--drawer-parity&viewMode=story';
const surfaceStory =
    '/iframe.html?id=regression-parity-surface-tabs--surface-parity&viewMode=story';

// ---------------------------------------------------------------------------
// Drawer
// ---------------------------------------------------------------------------
test.describe('Drawer chrome user-select', () => {
    test('mask, header chrome are not selectable; body is selectable', async ({ page }) => {
        await page.goto(drawerStory);
        await page.getByRole('button', { name: '打开抽屉' }).click();

        const dialog = page.getByRole('dialog');
        await expect(dialog).toBeVisible();

        // chrome elements must be non-selectable
        const mask = page.locator('.animal-drawer-mask');
        await expect(mask).toHaveCSS('user-select', 'none');

        const title = dialog.locator('.animal-drawer-title');
        await expect(title).toHaveCSS('user-select', 'none');

        const closeBtn = dialog.getByRole('button', { name: '关闭' });
        await expect(closeBtn).toHaveCSS('user-select', 'none');

        const footer = dialog.locator('.animal-drawer-footer');
        await expect(footer).toHaveCSS('user-select', 'none');

        // body must remain selectable
        const body = dialog.locator('.animal-drawer-body');
        await expect(body).toHaveCSS('user-select', 'text');
    });
});

// ---------------------------------------------------------------------------
// Modal
// ---------------------------------------------------------------------------
test.describe('Modal chrome user-select', () => {
    test('overlay, header chrome are not selectable; body is selectable', async ({ page }) => {
        await page.goto(surfaceStory);
        await page.getByRole('button', { name: '带标题 Modal' }).click();

        const dialog = page.getByRole('dialog');
        await expect(dialog).toBeVisible();

        // overlay (mask behind the dialog)
        const overlay = page.locator('.animal-modal-overlay');
        await expect(overlay).toHaveCSS('user-select', 'none');

        // title
        const title = dialog.locator('.animal-modal-title');
        await expect(title).toHaveCSS('user-select', 'none');

        // footer
        const footer = dialog.locator('.animal-modal-footer');
        await expect(footer).toHaveCSS('user-select', 'none');

        // body must remain selectable
        const body = dialog.locator('.animal-modal-body');
        await expect(body).toHaveCSS('user-select', 'text');

        // close modal
        await dialog.getByRole('button', { name: '取消' }).click();
        await expect(dialog).toHaveCount(0);
    });
});
