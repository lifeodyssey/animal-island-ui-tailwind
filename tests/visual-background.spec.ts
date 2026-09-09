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
