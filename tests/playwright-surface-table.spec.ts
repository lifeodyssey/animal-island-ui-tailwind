import { expect, test } from '@playwright/test';

const tableStableStoryUrl = '/iframe.html?id=regression-parity-surface-table--table-stable&viewMode=story';
const tableEmptyStoryUrl = '/iframe.html?id=regression-parity-surface-table--table-empty-stable&viewMode=story';

test.describe('reference Table parity', () => {
    test('covers table interactions and states', async ({ page }) => {
        await page.goto(tableStableStoryUrl);

        await expect(page.getByTestId('table-parity-region')).toBeVisible();
        await expect(page.getByRole('columnheader', { name: '岛民' })).toBeVisible();
        await expect(page.getByText('豆狸')).toBeVisible();

        const rowScope = page.getByTestId('table-parity-region');
        const secondRow = rowScope.locator('tbody tr').nth(1);
        await expect(secondRow).toHaveClass(/animal-table-row-striped/);

        await page.getByRole('button', { name: 'Toggle striped' }).click();
        await expect(secondRow).not.toHaveClass(/animal-table-row-striped/);

        const loadingButton = page.getByRole('button', { name: 'Show loading' });
        await loadingButton.click();
        await expect(loadingButton).toBeDisabled();
        await expect(loadingButton).toBeEnabled({ timeout: 3000 });

        await page.getByRole('button', { name: 'Toggle header' }).click();
        await expect(page.getByRole('columnheader', { name: '岛民' })).toHaveCount(0);
    });

    test('covers empty state', async ({ page }) => {
        await page.goto(tableEmptyStoryUrl);

        await expect(page.getByTestId('table-empty-region')).toBeVisible();
        await expect(page.getByText('暂时没有岛民数据')).toBeVisible();
        await expect(page.locator('.animal-table-empty-content svg')).toBeVisible();
    });
});
