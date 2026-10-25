import { expect, test } from '@playwright/test';
import { disableMotion } from './visual-helpers';

test('searchable Select retains its filtered menu layout', async ({ page }) => {
    await page.goto('/iframe.html?id=regression-select-search--stable&viewMode=story');
    await disableMotion(page);
    await page.getByRole('combobox', { name: 'Controlled fruit', exact: true }).click();
    await page.getByRole('searchbox').fill('Or');
    const menu = page.getByRole('dialog');
    await expect(menu.getByRole('option')).toHaveCount(1);
    await expect(menu).toHaveScreenshot('select-search-filtered.png');
});
