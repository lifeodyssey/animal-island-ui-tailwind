import { expect, test } from '@playwright/test';

test('Loading artwork decodes with transparency and animates independently in multiple instances', async ({ page }) => {
    await page.goto('/iframe.html?id=components-loading--artwork-surfaces&viewMode=story');
    const islands = page.locator('.animal-loading-island');
    await expect(islands).toHaveCount(3);
    const images = await page.locator('.animal-loading-artwork img').evaluateAll(async (elements) => {
        return Promise.all(elements.map(async (el) => {
            const image = el as HTMLImageElement;
            await image.decode();
            const canvas = document.createElement('canvas');
            canvas.width = image.naturalWidth;
            canvas.height = image.naturalHeight;
            const ctx = canvas.getContext('2d')!;
            ctx.drawImage(image, 0, 0);
            return { width: image.naturalWidth, alpha: ctx.getImageData(0, 0, 1, 1).data[3] };
        }));
    });
    expect(images.map((image) => image.width)).toEqual([96, 388, 96, 388, 96, 388]);
    expect(images.every((image) => image.alpha === 0)).toBe(true);
    for (const island of await islands.all()) {
        const initial = await island.evaluate((el) => getComputedStyle(el).transform);
        await expect.poll(() => island.evaluate((el) => getComputedStyle(el).transform)).not.toBe(initial);
        const scene = await island.locator('..').boundingBox();
        const box = await island.boundingBox();
        expect(box!.x).toBeGreaterThanOrEqual(scene!.x);
        expect(box!.y).toBeGreaterThanOrEqual(scene!.y);
        expect(box!.x + box!.width).toBeLessThanOrEqual(scene!.x + scene!.width);
    }
});

test('Loading can reopen during closing without the old timer hiding it', async ({ page }) => {
    await page.goto('/iframe.html?id=components-loading--toggle&viewMode=story');
    const loading = page.getByRole('status', { name: '正在加载' });
    await expect(loading).toBeVisible();
    await page.getByRole('button', { name: '喵喵再见 👋' }).click();
    await expect(loading).toHaveClass(/animal-loading-closing/);
    await page.getByRole('button', { name: '显示岛屿 🌴' }).click();
    await expect(loading).not.toHaveClass(/animal-loading-closing/);
    // Wait beyond the old close timeout to detect stale timer callbacks.
    await page.waitForTimeout(1000);
    await expect(loading).toBeVisible();
    await page.getByRole('button', { name: '喵喵再见 👋' }).click();
    await expect(loading).toBeHidden();
});

test('Loading honors reduced motion on a narrow viewport', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.setViewportSize({ width: 320, height: 600 });
    await page.goto('/iframe.html?id=components-loading--active&viewMode=story');
    const island = page.locator('.animal-loading-island');
    await expect(island).toBeVisible();
    await expect(island).toHaveCSS('animation-name', 'none');
    await expect(page.locator('.animal-loading-water-front')).toHaveCSS('animation-name', 'none');
    const box = await page.locator('.animal-loading-artwork').boundingBox();
    expect(box!.x).toBeGreaterThanOrEqual(0);
    expect(box!.x + box!.width).toBeLessThanOrEqual(320);
});
