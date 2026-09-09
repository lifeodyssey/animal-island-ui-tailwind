import { expect, test } from '@playwright/test';

test('the wallet artwork loads with real transparency at all three sizes', async ({ page }) => {
    await page.goto('/iframe.html?id=components-wallet--artwork-surfaces&viewMode=story');
    const images = page.locator('.animal-wallet-bag-slot img');
    await expect(images).toHaveCount(9);

    const alpha = await images.first().evaluate(async (element) => {
        const image = element as HTMLImageElement;
        await image.decode();
        const canvas = document.createElement('canvas');
        canvas.width = image.naturalWidth;
        canvas.height = image.naturalHeight;
        const context = canvas.getContext('2d')!;
        context.drawImage(image, 0, 0);
        const at = (x: number, y: number) => context.getImageData(x, y, 1, 1).data[3];
        return {
            corners: [at(0, 0), at(canvas.width - 1, 0), at(0, canvas.height - 1), at(canvas.width - 1, canvas.height - 1)],
            center: at(Math.floor(canvas.width / 2), Math.floor(canvas.height / 2)),
        };
    });
    expect(alpha.corners).toEqual([0, 0, 0, 0]);
    expect(alpha.center).toBe(255);

    for (const image of await images.all()) {
        await expect(image).toHaveAttribute('alt', '');
        await expect(image).toBeVisible();
    }
    await expect(page.locator('.animal-wallet-value')).toHaveText(['1,280', '12,800', '128,000', '1,280', '12,800', '128,000', '1,280', '12,800', '128,000']);
    await page.setViewportSize({ width: 390, height: 900 });
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});

test('a custom wallet icon replaces the default image', async ({ page }) => {
    await page.goto('/iframe.html?id=components-wallet--custom-icon&viewMode=story');
    await expect(page.locator('.animal-wallet-bag-slot')).toHaveText('💰');
    await expect(page.locator('.animal-wallet-bag-slot img')).toHaveCount(0);
});
