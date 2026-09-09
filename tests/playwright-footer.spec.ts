import { expect, test } from '@playwright/test';

for (const type of ['sea', 'tree'] as const) {
    const surfacesUrl = `/iframe.html?id=components-footer--${type}-surfaces&viewMode=story`;

    test(`${type} artwork loads with transparency and matching repeat boundaries`, async ({ page }) => {
        await page.goto(surfacesUrl);
        const footers = page.locator('.animal-footer');
        await expect(footers).toHaveCount(3);

        const artwork = await footers.first().evaluate(async (element) => {
            const background = getComputedStyle(element).backgroundImage;
            const image = new Image();
            image.src = background.slice(5, -2);
            await image.decode();

            const canvas = document.createElement('canvas');
            canvas.width = image.naturalWidth;
            canvas.height = image.naturalHeight;
            const context = canvas.getContext('2d')!;
            context.drawImage(image, 0, 0);

            const left = context.getImageData(0, 0, 1, canvas.height).data;
            const right = context.getImageData(canvas.width - 1, 0, 1, canvas.height).data;
            return {
                transparentBackground: context.getImageData(0, 0, 1, 1).data[3] === 0,
                opaqueBottom: context.getImageData(0, canvas.height - 1, 1, 1).data[3] === 255,
                matchingEdges: left.every((value, index) => value === right[index]),
                height: canvas.height,
            };
        });

        expect(artwork).toEqual({
            transparentBackground: true,
            opaqueBottom: type === 'sea',
            matchingEdges: true,
            height: 80,
        });
        for (const footer of await footers.all()) {
            await expect(footer).toHaveCSS('height', '80px');
            await expect(footer).toHaveCSS('background-repeat', 'repeat-x');
            await expect(footer).toHaveCSS('background-size', 'auto 100%');
        }

        await page.setViewportSize({ width: 390, height: 600 });
        await expect(footers.first()).toHaveCSS('height', '80px');
        expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
    });

    test(`a non-repeating ${type} footer keeps the artwork at its natural height`, async ({ page }) => {
        await page.goto(`/iframe.html?id=components-footer--${type}-without-repeat&viewMode=story`);
        const footer = page.locator('.animal-footer');
        await expect(footer).toHaveCSS('height', '80px');
        await expect(footer).toHaveCSS('background-repeat', 'no-repeat');
        await expect(footer).toHaveCSS('background-size', 'auto 100%');
    });
}
