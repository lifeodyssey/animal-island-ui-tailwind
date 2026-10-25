import { expect, test } from '@playwright/test';
import { disableMotion } from './visual-helpers';

for (const pattern of ['dots', 'sprinkles']) {
    test(`Background ${pattern}`, async ({ page }) => {
        await page.goto(`/iframe.html?id=regression-parity-new-components--background-${pattern}&viewMode=story`);
        const background = page.getByTestId(`background-${pattern}`);
        await expect(background).toBeVisible();
        await disableMotion(page);
        await expect(background).toHaveScreenshot(`background-${pattern}.png`);
    });
}

test('Background gray dots', async ({ page }) => {
    await page.goto('/iframe.html?id=components-background--dots-gray&viewMode=story');
    const background = page.locator('.animal-background');
    await expect(background).toHaveCSS('background-color', 'rgb(255, 255, 255)');
    await expect(background).toHaveCSS('background-image', /radial-gradient/);
    await disableMotion(page);
    await expect(background).toHaveScreenshot('background-dots-gray.png');
});
