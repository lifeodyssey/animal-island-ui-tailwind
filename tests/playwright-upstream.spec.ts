import { expect, test } from '@playwright/test';

const story = '/iframe.html?id=regression-parity-upstream-behavior--interactive&viewMode=story';

test.beforeEach(async ({ page }) => {
    await page.goto(story);
    await expect(page.getByTestId('upstream-behavior')).toBeVisible();
});

test('rating supports keyboard navigation, clear, and readonly state', async ({ page }) => {
    const rating = page.getByRole('radiogroup', { name: 'Your rating' });
    await rating.getByRole('radio', { name: '2 星' }).focus();
    await page.keyboard.press('ArrowRight');
    await expect(rating.getByRole('radio', { name: '3 星' })).toBeChecked();
    await expect(page.getByLabel('Selected rating')).toHaveText('3');
    await page.keyboard.press('End');
    await expect(rating.getByRole('radio', { name: '5 星' })).toBeChecked();
    await rating.locator('label').nth(4).click();
    await expect(page.getByLabel('Selected rating')).toHaveText('0');
    const readonly = page.getByRole('radiogroup', { name: 'Readonly rating' });
    await expect(readonly.getByRole('radio', { name: '4 星' })).toBeChecked();
    await expect(readonly.getByRole('radio').first()).toBeDisabled();
});

test('upload handles synchronous completion and removal', async ({ page }) => {
    await page.locator('input[type=file]').first().setInputFiles({ name: 'island.txt', mimeType: 'text/plain', buffer: Buffer.from('hello') });
    await expect(page.getByLabel('Upload status')).toHaveText('done');
    await expect(page.getByText('island.txt', { exact: true })).toBeVisible();
    await page.getByRole('button', { name: '删除 island.txt' }).click();
    await expect(page.getByText('island.txt', { exact: true })).toHaveCount(0);
    await expect(page.getByLabel('Upload status')).toHaveText('removed');
});

test('image preview traps focus and returns it after Escape', async ({ page }) => {
    const trigger = page.getByRole('button', { name: '预览 island.svg' });
    await trigger.click();
    const dialog = page.getByRole('dialog', { name: '预览 island.svg' });
    await expect(dialog).toBeVisible();
    const close = dialog.getByRole('button', { name: '关闭预览' });
    await expect(close).toBeFocused();
    await page.keyboard.press('Tab');
    await expect(close).toBeFocused();
    await page.keyboard.press('Escape');
    await expect(dialog).toHaveCount(0);
    await expect(trigger).toBeFocused();
});

test('counter reaches its target and overflow content is available', async ({ page }) => {
    await expect(page.getByText('99+', { exact: true })).toBeVisible();
    await expect(page.getByText('+1', { exact: true })).toBeVisible();
    await page.getByRole('button', { name: 'Start counter' }).click();
    await expect(page.locator('.animal-count-up')).toContainText('42');
});
