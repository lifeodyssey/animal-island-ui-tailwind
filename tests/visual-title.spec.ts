import { expect, test, type Page } from '@playwright/test';

const defaultStoryUrl = '/iframe.html?id=components-title--default&viewMode=story';
const colorsStoryUrl = '/iframe.html?id=components-title--colors&viewMode=story';

const sizeStories = [
    { url: '/iframe.html?id=components-title--small&viewMode=story', screenshot: 'title-small-region.png' },
    { url: '/iframe.html?id=components-title--middle&viewMode=story', screenshot: 'title-middle-region.png' },
    { url: '/iframe.html?id=components-title--large&viewMode=story', screenshot: 'title-large-region.png' },
] as const;

const disableMotion = async (page: Page) => {
    await page.addStyleTag({
        content: `*, *::before, *::after { animation: none !important; transition: none !important; caret-color: transparent !important; outline: none !important; }`,
    });
};

test.describe('Title visual parity', () => {
    test('captures default and size ribbon regions', async ({ page }) => {
        await page.goto(defaultStoryUrl);
        await disableMotion(page);
        await expect(page.locator('.animal-title')).toBeVisible();
        await expect(page.locator('.animal-title')).toHaveScreenshot('title-default-region.png', {
            animations: 'disabled',
        });

        for (const story of sizeStories) {
            await page.goto(story.url);
            await disableMotion(page);
            await expect(page.locator('.animal-title')).toBeVisible();
            await expect(page.locator('.animal-title')).toHaveScreenshot(story.screenshot, {
                animations: 'disabled',
            });
        }
    });

    test('captures color variant ribbon region', async ({ page }) => {
        await page.goto(colorsStoryUrl);
        await disableMotion(page);
        await expect(page.locator('.animal-title-ribbon')).toHaveCount(13);

        await expect(page.locator('#storybook-root > div')).toHaveScreenshot('title-colors-region.png', {
            animations: 'disabled',
        });
    });
});
