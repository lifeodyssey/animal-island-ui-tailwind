import { expect, test } from '@playwright/test';
import { disableMotion } from './visual-helpers';

for (const width of [1280, 390]) {
    test(`visible BackTop artwork at ${width}px`, async ({ page }) => {
        await page.setViewportSize({ width, height: 844 });
        await page.goto('/iframe.html?id=components-backtop--default&viewMode=story');
        await disableMotion(page);
        await page.getByTestId('backtop-scroll-area').evaluate((el) => { el.scrollTop = 300; });
        const button = page.locator('.animal-backtop-visible');
        await expect(button).toBeVisible();
        await button.locator('img').evaluate((el: HTMLImageElement) => el.decode());
        await expect(button).toHaveScreenshot(`backtop-${width}.png`);
    });
}

test('Select glove is visible beside a menu at the viewport edge', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 400 });
    await page.goto('/iframe.html?id=components-select--placeholder&viewMode=story');
    await disableMotion(page);
    await page.getByRole('combobox').click();
    const option = page.getByRole('option').first();
    await option.hover();
    await option.evaluate(async (el) => {
        const image = new Image();
        image.src = getComputedStyle(el, '::before').backgroundImage.match(/url\("([^"]+)"\)/)![1];
        await image.decode();
    });
    await expect(page).toHaveScreenshot('select-glove-edge.png');
});
