import { expect, test } from '@playwright/test';

test('icon chain footer renders icons and stays within the viewport', async ({ page }) => {
    for (const width of [1280, 390]) {
        await page.setViewportSize({ width, height: 600 });
        await page.goto('/iframe.html?id=components-footer--default&viewMode=story');
        const footer = page.locator('.animal-footer').first();
        await expect(footer).toBeVisible();
        const icons = footer.locator('.animal-icon');
        const count = await icons.count();
        expect(count).toBeGreaterThan(0);
        expect(
            await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)
        ).toBe(true);
    }
});

test('single-icon footer renders icons in a cycle', async ({ page }) => {
    await page.goto('/iframe.html?id=components-footer--single-icon&viewMode=story');
    const footer = page.locator('.animal-footer');
    await expect(footer).toBeVisible();
    const cycle = footer.locator('.animal-footer-cycle');
    await expect(cycle).toBeVisible();
    const icons = footer.locator('.animal-icon');
    const count = await icons.count();
    expect(count).toBeGreaterThan(0);
});
