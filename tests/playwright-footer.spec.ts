import { expect, test } from '@playwright/test';

test('icon-chain footer renders icons and does not overflow its container', async ({ page }) => {
    await page.goto('/iframe.html?id=components-footer--default&viewMode=story');
    const footer = page.locator('.animal-footer');
    await expect(footer).toBeVisible();
    const icons = footer.locator('.animal-icon');
    await expect(icons).not.toHaveCount(0);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
});

test('footer with custom size uses the specified icon dimensions', async ({ page }) => {
    await page.goto('/iframe.html?id=components-footer--custom-size&viewMode=story');
    const footer = page.locator('.animal-footer');
    await expect(footer).toBeVisible();
    const icons = footer.locator('.animal-icon');
    await expect(icons.first()).toHaveCSS('width', '28px');
    await expect(icons.first()).toHaveCSS('height', '28px');
});

test('icon-chain footer stays within viewport at mobile width', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 600 });
    await page.goto('/iframe.html?id=components-footer--default&viewMode=story');
    const footer = page.locator('.animal-footer');
    await expect(footer).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
});
