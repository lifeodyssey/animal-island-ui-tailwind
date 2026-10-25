import { expect, test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const storyUrl = '/iframe.html?id=regression-select-search--stable&viewMode=story';

test.describe('Select search and clear', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto(storyUrl);
        await expect(page.getByRole('combobox', { name: 'Controlled fruit', exact: true })).toBeVisible();
    });

    test('opens into search, filters without stealing focus, and selects by keyboard', async ({ page }) => {
        const trigger = page.getByRole('combobox', { name: 'Controlled fruit', exact: true });
        await trigger.focus();
        await page.keyboard.press('Enter');
        const search = page.getByPlaceholder('搜索...');
        await expect(search).toBeFocused();
        await page.keyboard.type('OR');
        await expect(search).toHaveValue('OR');
        await expect(search).toBeFocused();
        await expect(page.getByRole('option')).toHaveCount(1);
        await page.keyboard.press('ArrowDown');
        await expect(page.getByRole('option', { name: 'Orange', exact: true })).toBeFocused();
        await page.keyboard.press('Enter');
        await expect(trigger).toContainText('Orange');
        await expect(trigger).toBeFocused();
        await expect(page.getByLabel('Value changes')).toHaveText('["orange"]');
        await expect(page.getByLabel('Search changes')).toHaveText('["O","OR",""]');
    });

    test('search handles spaces, empty results, Escape, and resets on reopen', async ({ page }) => {
        const trigger = page.getByRole('combobox', { name: 'Controlled fruit', exact: true });
        await trigger.click();
        const search = page.getByPlaceholder('搜索...');
        await search.fill('no fruit');
        await expect(page.getByText('No matching fruit')).toBeVisible();
        await expect(page.locator('[role="option"]:not([aria-disabled="true"])')).toHaveCount(0);
        await expect(search).toBeFocused();
        await page.keyboard.press('Escape');
        await expect(search).toHaveCount(0);
        await expect(trigger).toBeFocused();
        await expect(page.getByLabel('Search changes')).toHaveText('["no fruit",""]');
        await trigger.click();
        await expect(search).toHaveValue('');
        await expect(page.getByRole('option')).toHaveCount(4);
    });

    test('Tab moves from search to options and Shift+Tab returns for editing', async ({ page }) => {
        await page.getByRole('combobox', { name: 'Controlled fruit', exact: true }).click();
        const search = page.getByPlaceholder('搜索...');
        await search.focus();
        await page.keyboard.press('Tab');
        await expect(page.getByRole('option', { name: 'Apple', exact: true })).toBeFocused();
        await page.keyboard.press('Shift+Tab');
        await expect(search).toBeFocused();
        await page.keyboard.type('Pear');
        await expect(page.getByRole('option')).toHaveCount(1);
        await page.keyboard.press('ArrowUp');
        await expect(page.getByRole('option', { name: 'Pear', exact: true })).toBeFocused();
    });

    test('clear is visible by keyboard and restores focus with exactly one notification', async ({ page }) => {
        const trigger = page.getByRole('combobox', { name: 'Controlled fruit', exact: true });
        await page.mouse.move(0, 0);
        await trigger.focus();
        await page.keyboard.press('Tab');
        const clear = page.getByRole('button', { name: 'Clear fruit', exact: true });
        await expect(clear).toBeFocused();
        await expect(clear).toHaveCSS('opacity', '1');
        await page.keyboard.press('Enter');
        await expect(page.getByLabel('Selected fruit')).toHaveText('empty');
        await expect(page.getByLabel('Value changes')).toHaveText('[""]');
        await expect(page.getByLabel('Clear count')).toHaveText('1');
        await expect(trigger).toContainText('Choose a fruit');
        await expect(trigger).toBeFocused();
        await expect(page.locator('[role="option"]:not([aria-disabled="true"])')).toHaveCount(0);
        await expect(clear).toHaveCount(0);
    });

    test('uncontrolled clearing works and controlled values stay owned by the parent', async ({ page }) => {
        const uncontrolled = page.getByRole('combobox', { name: 'Uncontrolled fruit', exact: true });
        await expect(uncontrolled).toContainText('Orange');
        await uncontrolled.hover();
        await page.getByRole('button', { name: 'Clear uncontrolled fruit' }).click();
        await expect(uncontrolled).toContainText('请选择');
        await uncontrolled.click();
        await page.getByPlaceholder('搜索...').fill('pear');
        await page.getByRole('option', { name: 'Pear', exact: true }).click();
        await expect(uncontrolled).toContainText('Pear');
        const controlled = page.getByRole('combobox', { name: 'Locked controlled fruit' });
        await controlled.hover();
        await page.getByRole('button', { name: 'Clear locked fruit' }).click();
        await expect(page.getByLabel('Requested value')).toHaveText('empty');
        await expect(controlled).toContainText('Pear');
    });

    test('disabled select cannot open or clear', async ({ page }) => {
        const trigger = page.getByRole('combobox', { name: 'Disabled fruit' });
        await expect(trigger).toBeDisabled();
        await trigger.click({ force: true });
        await expect(page.getByPlaceholder('搜索...')).toHaveCount(0);
        await expect(page.getByRole('button', { name: 'Clear disabled fruit' })).toHaveCount(0);
        await expect(trigger).toContainText('Apple');
    });

    test('filters by option keys and honors a custom filter', async ({ page }) => {
        await page.getByRole('combobox', { name: 'Filter by key' }).click();
        await page.getByPlaceholder('搜索...').fill('APPLE');
        await expect(page.getByRole('option')).toHaveCount(1);
        await expect(page.getByRole('option', { name: '苹果' })).toBeVisible();
        await page.keyboard.press('Escape');
        await page.getByRole('combobox', { name: 'Custom filter' }).click();
        await page.getByPlaceholder('搜索...').fill('P');
        await expect(page.getByRole('option')).toHaveCount(2);
        await page.getByPlaceholder('搜索...').fill('p');
        await expect(page.locator('[role="option"]:not([aria-disabled="true"])')).toHaveCount(0);
    });

    test('filterOption=false leaves remote results intact and value remains a key alias', async ({ page }) => {
        await page.getByRole('combobox', { name: 'Remote filter' }).click();
        await page.getByRole('searchbox', { name: '搜索选项' }).fill('No local match');
        await expect(page.getByRole('option')).toHaveCount(4);
        await page.keyboard.press('Escape');
        await page.getByRole('combobox', { name: 'Value filter alias' }).click();
        await page.getByRole('searchbox', { name: '搜索选项' }).fill('orange');
        await expect(page.getByRole('option')).toHaveCount(1);
        await expect(page.getByRole('option', { name: '橙子' })).toBeVisible();
    });

    test('text editing and Enter work without treating spaces as selection', async ({ page }) => {
        const trigger = page.getByRole('combobox', { name: 'Controlled fruit', exact: true });
        await trigger.click();
        const search = page.getByRole('searchbox', { name: '搜索选项' });
        await search.pressSequentially('a p');
        await expect(search).toHaveValue('a p');
        await expect(page.getByLabel('Value changes')).toHaveText('[]');
        await search.fill('pear');
        await search.click();
        await page.keyboard.press('Home');
        await page.keyboard.press('Delete');
        await expect(search).toHaveValue('ear');
        await expect(search).toBeFocused();
        await page.keyboard.press('Enter');
        await expect(trigger).toContainText('Pear');
        await expect(trigger).toBeFocused();
        await expect(page.getByLabel('Value changes')).toHaveText('[' + JSON.stringify('pear') + ']');
    });

    test('search popup and empty results have valid accessible structure', async ({ page }) => {
        const trigger = page.getByRole('combobox', { name: 'Controlled fruit', exact: true });
        await trigger.click();
        await expect(page.getByRole('dialog', { name: 'Controlled fruit', exact: true })).toBeVisible();
        await expect(page.getByRole('listbox', { name: 'Controlled fruit', exact: true })).toBeVisible();
        await expect(page.getByRole('searchbox', { name: '搜索选项' })).toBeFocused();
        for (const query of ['', 'not found']) {
            await page.getByRole('searchbox').fill(query);
            const results = await new AxeBuilder({ page })
                .include('.animal-select-content')
                .disableRules(['color-contrast'])
                .analyze();
            expect(results.violations).toEqual([]);
        }
        await expect(page.getByRole('option', { name: 'No matching fruit' })).toHaveAttribute('aria-disabled', 'true');
        await expect(page.getByRole('option', { name: 'No matching fruit' })).not.toHaveAttribute('tabindex');
        await page.keyboard.press('Enter');
        await expect(page.getByLabel('Value changes')).toHaveText('[]');
    });

});

test.describe('Select clear with an empty-string option key', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/iframe.html?id=regression-select-search--empty-key-stable&viewMode=story');
    });

    test('uncontrolled clear shows the placeholder and still permits selecting and clearing the empty key', async ({ page }) => {
        const trigger = page.getByRole('combobox', { name: 'Uncontrolled empty key', exact: true });
        const clear = page.getByRole('button', { name: 'Clear uncontrolled empty key' });
        await trigger.focus();
        await clear.click();
        await expect(trigger).toHaveText('Choose an option');
        await expect(clear).toHaveCount(0);
        await expect(trigger).toBeFocused();
        await expect(page.getByLabel('Empty key changes')).toHaveText('[""]');
        await trigger.click();
        await page.getByRole('option', { name: 'Empty-key option' }).click();
        await expect(trigger).toHaveText('Empty-key option');
        await clear.click();
        await expect(trigger).toHaveText('Choose an option');
        await expect(clear).toHaveCount(0);
        await expect(page.getByLabel('Empty key changes')).toHaveText('["","",""]');
        await trigger.click();
        await page.getByRole('option', { name: 'Fruit' }).click();
        await expect(trigger).toHaveText('Fruit');
    });

    test('controlled clear is distinct from selecting the empty key and external value changes reset the distinction', async ({ page }) => {
        const trigger = page.getByRole('combobox', { name: 'Controlled empty key', exact: true });
        const clear = page.getByRole('button', { name: 'Clear controlled empty key' });
        await trigger.focus();
        await clear.click();
        await expect(trigger).toHaveText('Choose an option');
        await expect(page.getByLabel('Controlled empty key value')).toHaveText('""');
        await expect(clear).toHaveCount(0);
        await page.getByRole('button', { name: 'Set controlled fruit', exact: true }).click();
        await expect(trigger).toHaveText('Fruit');
        await page.getByRole('button', { name: 'Set controlled empty key', exact: true }).click();
        await expect(trigger).toHaveText('Empty-key option');
        await trigger.focus();
        await clear.click();
        await expect(trigger).toHaveText('Choose an option');
        await expect(page.getByLabel('Controlled empty key clears')).toHaveText('2');
        await trigger.click();
        await page.getByRole('option', { name: 'Empty-key option' }).click();
        await expect(trigger).toHaveText('Empty-key option');
        await expect(clear).toHaveCount(1);
    });

    test('a controlled parent can reject clearing and later select the empty key externally', async ({ page }) => {
        const trigger = page.getByRole('combobox', { name: 'Locked empty key', exact: true });
        const clear = page.getByRole('button', { name: 'Clear locked empty key' });
        await trigger.focus();
        await clear.click();
        await expect(page.getByLabel('Locked empty key request')).toHaveText('""');
        await expect(trigger).toHaveText('Fruit');
        await expect(clear).toHaveCount(1);
        await page.getByRole('button', { name: 'Set locked empty key externally' }).click();
        await expect(trigger).toHaveText('Empty-key option');
    });

    test('an initially selected empty key can be cleared and selected by search again', async ({ page }) => {
        const trigger = page.getByRole('combobox', { name: 'Initially empty key', exact: true });
        const clear = page.getByRole('button', { name: 'Clear initially empty key' });
        await expect(trigger).toHaveText('Empty-key option');
        await trigger.focus();
        await clear.click();
        await expect(trigger).toHaveText('Choose an option');
        await expect(clear).toHaveCount(0);
        await trigger.click();
        await page.getByRole('searchbox', { name: '搜索选项' }).fill('Empty');
        await page.keyboard.press('Enter');
        await expect(trigger).toHaveText('Empty-key option');
        await expect(clear).toHaveCount(1);
    });
});
