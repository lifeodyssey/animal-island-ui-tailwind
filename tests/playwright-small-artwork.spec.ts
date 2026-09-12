import { expect, test } from '@playwright/test';

test('BackTop artwork stays inside desktop and mobile viewports and returns its target to the top', async ({ page }) => {
    for (const width of [1280, 390]) {
        await page.setViewportSize({ width, height: 844 });
        await page.goto('/iframe.html?id=components-backtop--default&viewMode=story');
        const area = page.getByTestId('backtop-scroll-area');
        const button = page.getByRole('button', { name: '返回顶部' });
        await area.evaluate((el) => { el.scrollTop = 300; });
        await expect(button).toHaveClass(/animal-backtop-visible/);
        const dimensions = await button.locator('img').evaluate(async (el: HTMLImageElement) => {
            await el.decode();
            return [el.naturalWidth, el.naturalHeight];
        });
        expect(dimensions).toEqual([48, 48]);
        const box = await button.boundingBox();
        expect(box!.x).toBeGreaterThanOrEqual(0);
        expect(box!.x + box!.width).toBeLessThanOrEqual(width);
        expect(box!.y + box!.height).toBeLessThanOrEqual(844);
        if (width === 390) await button.press('Enter');
        else await button.click();
        await expect.poll(() => area.evaluate((el) => el.scrollTop)).toBe(0);
        await expect(button).toBeHidden();
    }
});

test('leaf and both glove assets load at their intended resolutions', async ({ page }) => {
    await page.goto('/iframe.html?id=components-tabs--default&viewMode=story');
    const leaf = page.locator('.animal-tab-leaf');
    await expect(leaf).toBeVisible();
    expect(await leaf.evaluate(async (el: HTMLImageElement) => {
        await el.decode();
        return el.naturalWidth;
    })).toBe(96);

    await page.goto('/iframe.html?id=regression-parity-display-utilities--text-utility-stable&viewMode=story');
    const cursor = page.getByTestId('cursor-force-button');
    await expect(cursor).toHaveCSS('cursor', /8 5, auto$/);
    const cursorWidth = await cursor.evaluate(async (el) => {
        const url = getComputedStyle(el).cursor.match(/url\("([^"]+)"\)/)![1];
        const image = new Image();
        image.src = url;
        await image.decode();
        return image.naturalWidth;
    });
    expect(cursorWidth).toBe(48);

    await page.goto('/iframe.html?id=components-select--placeholder&viewMode=story');
    await page.getByRole('combobox').click();
    const option = page.getByRole('option').first();
    await option.hover();
    const gloveWidth = await option.evaluate(async (el) => {
        const url = getComputedStyle(el, '::before').backgroundImage.match(/url\("([^"]+)"\)/)![1];
        const image = new Image();
        image.src = url;
        await image.decode();
        return image.naturalWidth;
    });
    expect(gloveWidth).toBe(72);
    const gutter = await option.evaluate((el) => {
        const optionBox = el.getBoundingClientRect();
        const viewportBox = el.parentElement!.getBoundingClientRect();
        return { gloveLeft: optionBox.left - 29, viewportLeft: viewportBox.left };
    });
    expect(gutter.gloveLeft).toBeGreaterThanOrEqual(0);
    expect(gutter.gloveLeft).toBeGreaterThanOrEqual(gutter.viewportLeft);
    await option.click();
    await expect(page.getByRole('combobox')).toContainText('苹果');
});
