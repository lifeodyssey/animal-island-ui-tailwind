import { expect, test } from '@playwright/test';

for (const width of [1280, 390]) {
    test(`sea footer on three page surfaces at ${width}px`, async ({ page }) => {
        await page.setViewportSize({ width, height: 600 });
        await page.goto('/iframe.html?id=components-footer--sea-surfaces&viewMode=story');
        const footer = page.locator('.animal-footer').first();
        await expect(footer).toBeVisible();
        await footer.evaluate(async (element) => {
            const image = new Image();
            image.src = getComputedStyle(element).backgroundImage.slice(5, -2);
            await image.decode();
        });
        await expect(page.locator('.animal-storybook-scope')).toHaveScreenshot(`sea-surfaces-${width}.png`);
    });
}
