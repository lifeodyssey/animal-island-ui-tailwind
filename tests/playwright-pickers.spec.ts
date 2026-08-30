import { expect, test } from '@playwright/test';

const carouselStoryUrl = '/iframe.html?id=regression-parity-pickers--carousel-playwright-parity&viewMode=story';
const carouselNoLoopStoryUrl = '/iframe.html?id=regression-parity-pickers--carousel-no-loop-playwright-parity&viewMode=story';
const countdownStoryUrl = '/iframe.html?id=regression-parity-pickers--countdown-playwright-parity&viewMode=story';
const datePickerStoryUrl = '/iframe.html?id=regression-parity-pickers--date-picker-playwright-parity&viewMode=story';
const datePickerRangeStoryUrl = '/iframe.html?id=regression-parity-pickers--date-picker-range-playwright-parity&viewMode=story';
const timePickerStoryUrl = '/iframe.html?id=regression-parity-pickers--time-picker-playwright-parity&viewMode=story';

test.describe('pickers behavior parity', () => {
    test('covers Carousel arrow, dot, and keyboard navigation', async ({ page }) => {
        await page.goto(carouselStoryUrl);
        const label = page.getByTestId('carousel-index-label');
        const prev = page.getByRole('button', { name: '上一张' });
        const next = page.getByRole('button', { name: '下一张' });

        await expect(label).toHaveText('当前索引: 0');
        await expect(page.getByRole('group', { name: '第 1 张，共 3 张' })).toBeVisible();

        await next.click();
        await expect(label).toHaveText('当前索引: 1');
        await expect(page.getByRole('group', { name: '第 2 张，共 3 张' })).toBeVisible();

        await page.getByRole('button', { name: '转到第 3 张' }).click();
        await expect(label).toHaveText('当前索引: 2');
        await expect(page.getByRole('button', { name: '转到第 3 张' })).toHaveAttribute('aria-current', 'true');

        // loop=true: 最后一张点下一张回到第一张，第一张点上一张跳到最后一张
        await next.click();
        await expect(label).toHaveText('当前索引: 0');
        await prev.click();
        await expect(label).toHaveText('当前索引: 2');

        // 键盘导航：ArrowLeft / ArrowRight / Home / End
        const region = page.getByRole('region', { name: 'parity 轮播' });
        await region.focus();
        await page.keyboard.press('ArrowRight');
        await expect(label).toHaveText('当前索引: 0');
        await page.keyboard.press('ArrowLeft');
        await expect(label).toHaveText('当前索引: 2');
        await page.keyboard.press('Home');
        await expect(label).toHaveText('当前索引: 0');
        await page.keyboard.press('End');
        await expect(label).toHaveText('当前索引: 2');
    });

    test('covers Carousel loop=false boundary arrows disabled', async ({ page }) => {
        await page.goto(carouselNoLoopStoryUrl);
        const label = page.getByTestId('carousel-no-loop-index-label');
        const prev = page.getByRole('button', { name: '上一张' });
        const next = page.getByRole('button', { name: '下一张' });

        await expect(label).toHaveText('当前索引: 0');
        await expect(prev).toBeDisabled();
        await expect(next).toBeEnabled();

        await next.click();
        await expect(label).toHaveText('当前索引: 1');
        await expect(prev).toBeEnabled();

        await next.click();
        await expect(label).toHaveText('当前索引: 2');
        await expect(next).toBeDisabled();

        await prev.click();
        await expect(label).toHaveText('当前索引: 1');
        await expect(next).toBeEnabled();
    });

    test('covers Countdown role=timer and sr-only readable text', async ({ page }) => {
        await page.goto(countdownStoryUrl);
        const timer = page.getByRole('timer');
        await expect(timer).toBeVisible();
        await expect(timer.locator('.animal-countdown-prefix')).toHaveText('距打烊');
        const srText = await timer.locator('.animal-countdown-sr-only').textContent();
        expect(srText).toMatch(/^\d{2}:\d{2}:\d{2}$/);
    });

    test('covers DatePicker open, pick, confirm, and Escape close', async ({ page }) => {
        await page.goto(datePickerStoryUrl);
        const region = page.getByTestId('datepicker-single-region');
        const trigger = region.getByRole('combobox');
        const label = page.getByTestId('datepicker-value-label');

        await expect(label).toHaveText('选中: 2026-08-15');
        await expect(trigger).toHaveAttribute('aria-expanded', 'false');
        await trigger.click();
        const dialog = page.getByRole('dialog');
        await expect(dialog).toBeVisible();
        await expect(trigger).toHaveAttribute('aria-expanded', 'true');

        // 点选仅更新待选值，确定后才提交并关闭
        await dialog.getByRole('button', { name: '2026年8月20日' }).click();
        await expect(label).toHaveText('选中: 2026-08-15');
        await dialog.getByRole('button', { name: '确定' }).click();
        await expect(label).toHaveText('选中: 2026-08-20');
        await expect(page.getByRole('dialog')).toHaveCount(0);

        // 重新打开后 Escape 关闭面板
        await trigger.click();
        await expect(page.getByRole('dialog')).toBeVisible();
        await page.keyboard.press('Escape');
        await expect(page.getByRole('dialog')).toHaveCount(0);
    });

    test('covers DatePicker disabledDate cells not clickable', async ({ page }) => {
        await page.goto(datePickerStoryUrl);
        const region = page.getByTestId('datepicker-disabled-date-region');
        const trigger = region.getByRole('combobox');

        await trigger.click();
        const dialog = page.getByRole('dialog');
        await expect(dialog).toBeVisible();

        const disabledCell = dialog.getByRole('button', { name: '2026年8月10日' });
        await expect(disabledCell).toBeDisabled();
        await expect(disabledCell).toHaveClass(/animal-datepicker-day-disabled/);
        await disabledCell.click({ force: true });
        // 禁用日期不会成为待选值，trigger 仍显示原值
        await expect(trigger).toContainText('2026-08-15');

        const enabledCell = dialog.getByRole('button', { name: '2026年8月20日' });
        await expect(enabledCell).toBeEnabled();
        await enabledCell.click();
        await expect(trigger).toContainText('2026-08-20');
    });

    test('covers DatePicker range two-click selection', async ({ page }) => {
        await page.goto(datePickerRangeStoryUrl);
        const label = page.getByTestId('datepicker-range-label');

        await expect(label).toHaveText('范围: 2026-08-10 ~ 2026-08-20');
        await page.getByRole('combobox').click();
        const dialog = page.getByRole('dialog', { name: '选择日期范围' });
        await expect(dialog).toBeVisible();

        await dialog.getByRole('button', { name: '2026年8月12日' }).click();
        await expect(label).toHaveText('范围: 2026-08-10 ~ 2026-08-20');
        await dialog.getByRole('button', { name: '2026年8月18日' }).click();
        await dialog.getByRole('button', { name: '确定' }).click();
        await expect(label).toHaveText('范围: 2026-08-12 ~ 2026-08-18');
        await expect(page.getByRole('dialog')).toHaveCount(0);
    });

    test('covers TimePicker open, column pick, confirm, and clear', async ({ page }) => {
        await page.goto(timePickerStoryUrl);
        const trigger = page.getByRole('combobox');
        const label = page.getByTestId('timepicker-value-label');

        await expect(label).toHaveText('选中: 09:30:00');
        await trigger.click();
        const dialog = page.getByRole('dialog', { name: '选择时间' });
        await expect(dialog).toBeVisible();

        await dialog.getByRole('button', { name: '10 时' }).click();
        await dialog.getByRole('button', { name: '45 分' }).click();
        // 确定前不提交
        await expect(label).toHaveText('选中: 09:30:00');
        await dialog.getByRole('button', { name: '确定' }).click();
        await expect(label).toHaveText('选中: 10:45:00');
        await expect(page.getByRole('dialog')).toHaveCount(0);

        await page.getByRole('button', { name: '清除时间' }).click();
        await expect(label).toHaveText('选中: 无');
        await expect(trigger).toContainText('请选择时间');
    });
});
