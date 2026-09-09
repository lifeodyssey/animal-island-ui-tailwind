import { expect, test } from '@playwright/test';
import { readFile } from 'node:fs/promises';

test('wedding artwork loads and remains inside the invitation on mobile', async ({ page }) => {
    await page.goto('/iframe.html?id=components-weddinginvitation--default&viewMode=story');
    const artwork = page.getByRole('img', { name: 'bride and groom' });
    await expect(artwork).toBeVisible();
    expect(await artwork.evaluate(async (image: HTMLImageElement) => {
        await image.decode();
        return image.naturalWidth;
    })).toBe(640);
    await page.setViewportSize({ width: 390, height: 900 });
    const card = await page.locator('.animal-wedding-invitation').boundingBox();
    const picture = await artwork.boundingBox();
    expect(picture!.x).toBeGreaterThanOrEqual(card!.x);
    expect(picture!.x + picture!.width).toBeLessThanOrEqual(card!.x + card!.width);
});

test('downloaded invitation includes the styled couple artwork', async ({ page }, testInfo) => {
    test.setTimeout(60_000);
    await page.goto('/iframe.html?id=components-weddinginvitation--export-button-idle&viewMode=story');
    const artwork = page.getByRole('img', { name: 'bride and groom' });
    await expect(artwork).toBeVisible();
    const card = await page.locator('.animal-wedding-invitation').boundingBox();
    const picture = await artwork.boundingBox();
    const downloadEvent = page.waitForEvent('download');
    await page.getByRole('button', { name: '保存为图片' }).click();
    const download = await downloadEvent;
    expect(download.suggestedFilename()).toBe('wedding-invitation.png');
    const path = testInfo.outputPath('invitation.png');
    await download.saveAs(path);
    const dataUrl = `data:image/png;base64,${(await readFile(path)).toString('base64')}`;
    const result = await page.evaluate(async ({ dataUrl, card, picture }) => {
        const image = new Image();
        image.src = dataUrl;
        await image.decode();
        const canvas = document.createElement('canvas');
        canvas.width = image.width;
        canvas.height = image.height;
        const context = canvas.getContext('2d')!;
        context.drawImage(image, 0, 0);
        const region = context.getImageData(Math.round((picture.x - card.x) * 2), Math.round((picture.y - card.y) * 2), Math.round(picture.width * 2), Math.round(picture.height * 2));
        let brownPixels = 0;
        for (let i = 0; i < region.data.length; i += 4) {
            const [r, g, b, a] = region.data.slice(i, i + 4);
            if (r > g && g > b && r < 170 && a > 200) brownPixels++;
        }
        return { width: image.width, brownPixels };
    }, { dataUrl, card: card!, picture: picture! });
    expect(result.width).toBe(Math.ceil(card!.width) * 2);
    // Hair, glasses and shoes must survive the foreignObject snapshot.
    expect(result.brownPixels).toBeGreaterThan(1500);
    await expect(page.getByRole('button', { name: '保存为图片' })).toBeEnabled();
});
