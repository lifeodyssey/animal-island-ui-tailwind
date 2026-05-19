import { expect, test, type Page } from '@playwright/test';

const tableStableStoryUrl = '/iframe.html?id=regression-parity-surface-table--table-stable&viewMode=story';
const tableEmptyStoryUrl = '/iframe.html?id=regression-parity-surface-table--table-empty-stable&viewMode=story';

const disableMotion = async (page: Page) => {
    await page.addStyleTag({
        content: `*, *::before, *::after { animation: none !important; transition: none !important; caret-color: transparent !important; outline: none !important; }`,
    });
};

test.describe('reference Table visual parity', () => {
    test('captures stable table region and loading overlay', async ({ page }) => {
        await page.goto(tableStableStoryUrl);
        await disableMotion(page);

        await expect(page.getByTestId('table-parity-region')).toBeVisible();
        await expect(page.getByTestId('table-parity-region')).toHaveScreenshot('table-parity-region.png', {
            animations: 'disabled',
        });

        await page.getByRole('button', { name: 'Show loading' }).click();
        await expect(page.locator('.animal-table-loading-overlay')).toBeVisible();
        await expect(page.getByTestId('table-parity-region')).toHaveScreenshot('table-loading-region.png', {
            animations: 'disabled',
        });
    });

    test('captures empty table state', async ({ page }) => {
        await page.goto(tableEmptyStoryUrl);
        await disableMotion(page);

        await expect(page.getByTestId('table-empty-region')).toBeVisible();
        await expect(page.getByTestId('table-empty-region')).toHaveScreenshot('table-empty-region.png', {
            animations: 'disabled',
        });
    });
});
