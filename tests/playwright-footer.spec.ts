import { expect, test } from '@playwright/test';

test('footer renders default copyright text and is visible', async ({ page }) => {
    await page.goto('/iframe.html?id=components-footer--default&viewMode=story');
    const footer = page.locator('.animal-footer');
    await expect(footer).toBeVisible();
    await expect(footer).toContainText('All Rights Reserved.');
    await expect(footer).toHaveCSS('text-align', 'center');
});

test('footer renders custom year and text', async ({ page }) => {
    await page.goto('/iframe.html?id=components-footer--custom-year&viewMode=story');
    const footer = page.locator('.animal-footer');
    await expect(footer).toBeVisible();
    await expect(footer).toContainText('2025');
    await expect(footer).toContainText('Animal Island UI');
});
