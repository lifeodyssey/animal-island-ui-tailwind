import { expect, test } from '@playwright/test';

test('Background renders both patterns from the component stylesheet', async ({ page }) => {
    await page.goto('/iframe.html?id=regression-parity-new-components--background-stable&viewMode=story');
    const patterns = page.locator('.animal-background');
    await expect(patterns).toHaveCount(2);
    await expect(patterns.nth(0)).toHaveCSS('background-image', /radial-gradient/);
    await expect(patterns.nth(1)).toHaveCSS('background-image', /data:image\/svg\+xml/);
});

test('raindrop scoped mode preserves semantic cursors on descendants', async ({ page }) => {
    await page.goto('/iframe.html?id=regression-parity-new-components--cursor-raindrop-scoped&viewMode=story');
    await expect(page.getByTestId('cursor-scoped')).toHaveCSS('cursor', /16 6, default$/);
    await expect(page.getByText('Ordinary text')).toHaveCSS('cursor', 'auto');
    await expect(page.getByRole('button', { name: 'Action', exact: true })).toHaveCSS('cursor', 'pointer');
    await expect(page.getByRole('textbox')).toHaveCSS('cursor', 'text');
    await expect(page.getByRole('button', { name: 'Unavailable' })).toHaveCSS('cursor', 'not-allowed');
});

test('raindrop force mode uses a decodable SVG and default mode keeps the glove', async ({ page }) => {
    await page.goto('/iframe.html?id=regression-parity-new-components--cursor-raindrop&viewMode=story');
    const drop = page.getByTestId('cursor-raindrop');
    await expect(drop).toHaveCSS('cursor', /16 6, default$/);
    const width = await drop.evaluate(async (element) => {
        const image = new Image();
        image.src = getComputedStyle(element).cursor.match(/url\("([^"]+)"\)/)![1];
        await image.decode();
        return image.naturalWidth;
    });
    expect(width).toBe(32);
    await drop.evaluate(element => {
        const button = document.createElement('button');
        button.textContent = 'Forced child';
        element.append(button);
    });
    await expect(page.getByRole('button', { name: 'Forced child' })).toHaveCSS('cursor', /16 6, default$/);
    await expect(page.getByTestId('cursor-default')).toHaveCSS('cursor', /8 5, auto$/);
});
