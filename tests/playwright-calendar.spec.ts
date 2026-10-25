import { expect, test, type Page } from '@playwright/test';

const cell = (page: Page, date: string) => page.locator(`[role="gridcell"][data-date="${date}"]`);

async function dragTo(page: Page, from: string, to: string) {
    const start = await cell(page, from).boundingBox();
    const end = await cell(page, to).boundingBox();
    if (!start || !end) throw new Error('Calendar drag cells are not visible');
    await page.mouse.move(start.x + start.width / 2, start.y + 18);
    await page.mouse.down();
    await page.mouse.move(end.x + end.width / 2, end.y + 18, { steps: 8 });
}

test.beforeEach(async ({ page }) => {
    await page.goto('/iframe.html?id=components-calendar--interactive&viewMode=story');
    await expect(page.getByTestId('calendar-interactive')).toBeVisible();
});

test('selection and month navigation preserve independent controlled values', async ({ page }) => {
    await expect(page.getByRole('gridcell')).toHaveCount(42);
    await cell(page, '2026-08-20').click();
    await expect(page.getByLabel('选中日期')).toHaveText('2026-08-20');
    await page.getByRole('button', { name: '下个月' }).click();
    await expect(page.getByLabel('显示月份')).toHaveText('2026-09');
    await expect(page.getByRole('gridcell', { selected: true })).toHaveCount(0);
    await page.getByRole('button', { name: '上个月' }).click();
    await expect(cell(page, '2026-08-20')).toHaveAttribute('aria-selected', 'true');
    await cell(page, '2026-07-31').click();
    await expect(page.getByLabel('显示月份')).toHaveText('2026-07');
    await expect(page.getByLabel('选中日期')).toHaveText('2026-07-31');
    await expect(cell(page, '2026-07-31')).toBeFocused();
});

test('keyboard navigation starts at the focused cell and crosses month boundaries', async ({ page }) => {
    await cell(page, '2026-08-30').focus();
    await page.keyboard.press('ArrowRight');
    await expect(cell(page, '2026-08-31')).toBeFocused();
    await page.keyboard.press('ArrowRight');
    await expect(cell(page, '2026-09-01')).toBeFocused();
    await page.keyboard.press('Space');
    await expect(page.getByLabel('选中日期')).toHaveText('2026-09-01');
    await page.keyboard.press('PageDown');
    await expect(cell(page, '2026-10-01')).toBeFocused();
    await expect(page.locator('[role="gridcell"][tabindex="0"]')).toHaveCount(1);
});

test('mouse dragging creates ordered date ranges', async ({ page }) => {
    await dragTo(page, '2026-08-20', '2026-08-18');
    await expect(page.locator('[data-preview="true"]')).toBeVisible();
    await page.mouse.up();
    await expect(page.getByLabel('创建的事项范围')).toHaveText('2026-08-18 → 2026-08-20');
    await expect(page.locator('[data-preview="true"]')).toHaveCount(0);
});

test('canceling a pointer gesture does not create an event', async ({ page }) => {
    await dragTo(page, '2026-08-18', '2026-08-20');
    await cell(page, '2026-08-20').dispatchEvent('pointercancel');
    await page.mouse.up();
    await expect(page.getByLabel('创建的事项范围')).toHaveText('尚未创建');
    await expect(page.locator('[data-preview="true"]')).toHaveCount(0);
});

test('disabling dragging still permits single date selection', async ({ page }) => {
    await page.getByRole('button', { name: '禁用拖拽' }).click();
    await dragTo(page, '2026-08-18', '2026-08-20');
    await page.mouse.up();
    await expect(page.getByLabel('创建的事项范围')).toHaveText('尚未创建');
    await cell(page, '2026-08-18').click();
    await expect(page.getByLabel('选中日期')).toHaveText('2026-08-18');
});

test('overflow events remain accessible and multi-week events retain their dates', async ({ page }) => {
    const overflow = cell(page, '2026-08-15');
    await expect(overflow).toContainText('+2');
    await expect(overflow).toHaveAccessibleName('2026-08-15 4 项事项：博物馆参观，钓鱼大会，生日派对，周末集市');
    await expect(cell(page, '2026-08-10')).toHaveAccessibleName('2026-08-10 1 项事项：海岛野餐');
    await expect(page.locator('.animal-calendar-event').filter({ hasText: '海岛野餐' })).toHaveCount(2);
    await expect(page.locator('.animal-calendar-event-time').first()).toHaveText('09:00');
});

test('external selected value updates preserve the active date for keyboard navigation', async ({ page }) => {
    await page.goto('/iframe.html?id=components-calendar--deferred-controlled&viewMode=story');
    await cell(page, '2026-08-20').focus();
    await page.getByRole('button', { name: '外部选择8月10日' }).dispatchEvent('click');
    await expect(page.getByLabel('选中日期')).toHaveText('2026-08-10');
    await expect(cell(page, '2026-08-20')).toBeFocused();
    await expect(cell(page, '2026-08-20')).toHaveAttribute('tabindex', '0');
    await page.keyboard.press('Enter');
    await expect(page.getByLabel('选中日期')).toHaveText('2026-08-20');
    await page.keyboard.press('ArrowRight');
    await expect(cell(page, '2026-08-21')).toBeFocused();
});

test('a deferred controlled month change restores focus to the same date', async ({ page }) => {
    await page.goto('/iframe.html?id=components-calendar--deferred-controlled&viewMode=story');
    await cell(page, '2026-08-31').focus();
    await page.keyboard.press('ArrowRight');
    await expect(cell(page, '2026-09-01')).toBeFocused();
    await expect(page.getByLabel('显示月份')).toHaveText('2026-08');
    await expect(page.getByLabel('请求月份')).toHaveText('2026-09');
    await page.getByRole('button', { name: '应用请求月份' }).dispatchEvent('click');
    await expect(page.getByLabel('显示月份')).toHaveText('2026-09');
    await expect(cell(page, '2026-09-01')).toBeFocused();
    await page.keyboard.press('ArrowRight');
    await expect(cell(page, '2026-09-02')).toBeFocused();
});

test('external value and deferred panel updates never steal focus back from outside', async ({ page }) => {
    await page.goto('/iframe.html?id=components-calendar--deferred-controlled&viewMode=story');
    await cell(page, '2026-08-20').focus();
    await page.keyboard.press('PageDown');
    const outside = page.getByRole('textbox', { name: '日历外输入框' });
    await outside.focus();
    await page.getByRole('button', { name: '应用请求月份' }).dispatchEvent('click');
    await expect(page.getByLabel('显示月份')).toHaveText('2026-09');
    await expect(outside).toBeFocused();
    await page.getByRole('button', { name: '外部选择8月10日' }).dispatchEvent('click');
    await expect(page.getByLabel('选中日期')).toHaveText('2026-08-10');
    await expect(outside).toBeFocused();
});

test('deferred PageDown preserves the intended date beyond the current grid', async ({ page }) => {
    await page.goto('/iframe.html?id=components-calendar--deferred-controlled&viewMode=story');
    await cell(page, '2026-08-20').focus();
    await page.keyboard.press('PageDown');
    await expect(page.getByLabel('请求月份')).toHaveText('2026-09');
    await expect(cell(page, '2026-08-20')).toBeFocused();
    await expect(cell(page, '2026-08-20')).toHaveAttribute('tabindex', '0');
    await page.getByRole('button', { name: '应用请求月份' }).dispatchEvent('click');
    await expect(page.getByLabel('显示月份')).toHaveText('2026-09');
    await expect(cell(page, '2026-09-20')).toBeFocused();
    await page.keyboard.press('PageUp');
    await expect(page.getByLabel('请求月份')).toHaveText('2026-08');
    await page.getByRole('button', { name: '应用请求月份' }).dispatchEvent('click');
    await expect(cell(page, '2026-08-20')).toBeFocused();
});
