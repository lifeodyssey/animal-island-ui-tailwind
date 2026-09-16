import { expect, test } from '@playwright/test';

test('copyright bar renders default text and is centered', async ({ page }) => {
    await page.goto('/iframe.html?id=components-footer--default&viewMode=story');
    const footer = page.locator('.animal-footer');
    await expect(footer).toBeVisible();
    await expect(footer).toContainText('All Rights Reserved.');
    await expect(footer).toHaveCSS('text-align', 'center');
});

test('copyright bar renders custom text and year', async ({ page }) => {
    await page.goto('/iframe.html?id=components-footer--custom-year&viewMode=story');
    const footer = page.locator('.animal-footer');
    await expect(footer).toBeVisible();
    await expect(footer).toContainText('2020');
    await expect(footer).toContainText('Animal Island UI');
});

test('copyright bar renders custom text', async ({ page }) => {
    await page.goto('/iframe.html?id=components-footer--custom-text&viewMode=story');
    const footer = page.locator('.animal-footer');
    await expect(footer).toBeVisible();
    await expect(footer).toContainText('动物岛');
});

test('copyright bar fits mobile viewport without overflow', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 600 });
    await page.goto('/iframe.html?id=components-footer--default&viewMode=story');
    const footer = page.locator('.animal-footer');
    await expect(footer).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
});
