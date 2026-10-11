import { expect, test } from '@playwright/test';
import { disableMotion } from './visual-helpers';

test('captures new upstream component states', async ({ page }) => {
    await page.goto('/iframe.html?id=regression-parity-upstream-behavior--stable&viewMode=story');
    await disableMotion(page);
    const region = page.getByTestId('upstream-stable');
    await expect(region).toBeVisible();
    await expect(region.getByRole('img', { name: 'Island' })).toBeVisible();
    await expect(region).toHaveScreenshot('upstream-components.png');
});
