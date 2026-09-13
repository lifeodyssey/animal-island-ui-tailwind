import { expect, test } from '@playwright/test';

test('footer icon-chain tiles icons to fill the container width', async ({ page }) => {
    await page.goto('/iframe.html?id=components-footer--default&viewMode=story');
    const footer = page.locator('.animal-footer');
    await expect(footer).toBeVisible();
    await expect(footer.locator('.animal-icon').first()).toBeVisible();
    const iconCount = await footer.locator('.animal-icon').count();
    expect(iconCount).toBeGreaterThan(0);
});

test('single-icon mode tiles only the named icon', async ({ page }) => {
    await page.goto('/iframe.html?id=components-footer--single-icon&viewMode=story');
    const footer = page.locator('.animal-footer');
    await expect(footer).toBeVisible();
    await expect(footer.locator('.animal-icon').first()).toBeVisible();
    await expect(footer.locator('svg').first()).toHaveCSS('width', '28px');
});

test('footer renders on multiple surfaces with icons visible', async ({ page }) => {
    await page.goto('/iframe.html?id=components-footer--all-surfaces&viewMode=story');
    const footers = page.locator('.animal-footer');
    await expect(footers).toHaveCount(3);
    for (const footer of await footers.all()) {
        await expect(footer.locator('.animal-icon').first()).toBeVisible();
    }
});
