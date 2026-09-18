import { expect, test } from '@playwright/test';

test('phone artwork decodes with transparency while clock and badges remain visible', async ({ page }) => {
    await page.goto('/iframe.html?id=components-phone--default&viewMode=story');
    const icons = page.locator('.animal-phone-app-icon');
    await expect(icons).toHaveCount(9);
    const alpha = await icons.first().evaluate(async element => {
        const source = getComputedStyle(element).backgroundImage.slice(5, -2);
        const image = new Image();
        image.src = source;
        await image.decode();
        const canvas = document.createElement('canvas');
        canvas.width = image.width;
        canvas.height = image.height;
        const context = canvas.getContext('2d')!;
        context.drawImage(image, 0, 0);
        return {
            corner: context.getImageData(0, 0, 1, 1).data[3],
            camera: context.getImageData(200, 200, 1, 1).data[3],
        };
    });
    expect(alpha).toEqual({ corner: 0, camera: 255 });
    await expect(page.locator('.animal-phone-badge')).toHaveCount(2);
    await expect(page.locator('.animal-phone-status')).toContainText(/\d+:\d{2}[AP]M/);
    for (const icon of await icons.all()) await expect(icon).toBeVisible();
});

test('svg icons render on three surfaces at multiple sizes with accessible names', async ({ page }) => {
    // Showcase story: 8 icons × 3 backgrounds × 3 sizes = 72 animal-icon elements
    await page.goto('/iframe.html?id=components-icon--showcase&viewMode=story');
    await expect(page.locator('.animal-icon')).toHaveCount(72);
    // size-48 icons have aria-label set, one per background surface
    await expect(page.getByRole('img', { name: 'Heart', exact: true })).toHaveCount(3);
    for (const icon of await page.locator('.animal-icon').all()) {
        await expect(icon).toBeVisible();
    }
    await page.setViewportSize({ width: 390, height: 900 });
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});
