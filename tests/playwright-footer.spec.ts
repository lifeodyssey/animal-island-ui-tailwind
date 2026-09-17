import { expect, test } from '@playwright/test';

test('Footer renders copyright bar with year and text', async ({ page }) => {
    await page.goto('/iframe.html?id=components-footer--default&viewMode=story');
    const footer = page.locator('.animal-footer');
    await expect(footer).toHaveCount(1);
    await expect(footer).toContainText('All Rights Reserved.');
    await expect(footer).toContainText(String(new Date().getFullYear()));
});

test('Footer uses <footer> element', async ({ page }) => {
    await page.goto('/iframe.html?id=components-footer--default&viewMode=story');
    const footer = page.locator('footer.animal-footer');
    await expect(footer).toHaveCount(1);
});

test('Footer custom year and text', async ({ page }) => {
    await page.goto('/iframe.html?id=components-footer--custom-year&viewMode=story');
    const footer = page.locator('.animal-footer');
    await expect(footer).toContainText('Animal Island Co., Ltd.');
    await expect(footer).toContainText('2025');
});
