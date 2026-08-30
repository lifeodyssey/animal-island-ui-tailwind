import { expect, test } from '@playwright/test';
import { disableMotion } from './visual-helpers';

const carouselShowcaseUrl = '/iframe.html?id=regression-parity-pickers--carousel-showcase-parity&viewMode=story';
const countdownShowcaseUrl = '/iframe.html?id=regression-parity-pickers--countdown-showcase-parity&viewMode=story';
const datePickerShowcaseUrl = '/iframe.html?id=regression-parity-pickers--date-picker-showcase-parity&viewMode=story';
const datePickerOpenUrl = '/iframe.html?id=regression-parity-pickers--date-picker-playwright-parity&viewMode=story';
const datePickerRangeOpenUrl = '/iframe.html?id=regression-parity-pickers--date-picker-range-playwright-parity&viewMode=story';
const timePickerShowcaseUrl = '/iframe.html?id=regression-parity-pickers--time-picker-showcase-parity&viewMode=story';
const timePickerOpenUrl = '/iframe.html?id=regression-parity-pickers--time-picker-playwright-parity&viewMode=story';

// Freeze Date so Countdown renders a fixed remaining time (no per-second digit
// drift) and DatePicker's "today" highlight never moves between runs.
// Frozen at 2026-12-31T22:00:00 → the fixed 2027-01-01 target reads 02:00:00.
const FREEZE_CLOCK = `(() => {
    const fixed = new Date('2026-12-31T22:00:00').getTime();
    const RealDate = Date;
    class MockDate extends RealDate {
        constructor(...args) { super(...(args.length ? args : [fixed])); }
        static now() { return fixed; }
    }
    MockDate.UTC = RealDate.UTC; MockDate.parse = RealDate.parse;
    // @ts-expect-error override
    window.Date = MockDate;
})();`;

test.describe('pickers visual parity', () => {
    test.beforeEach(async ({ page }) => {
        await page.addInitScript(FREEZE_CLOCK);
    });

    test('captures Carousel showcase regions', async ({ page }) => {
        await page.goto(carouselShowcaseUrl);
        await disableMotion(page);

        await expect(page.getByTestId('carousel-default-region')).toHaveScreenshot('carousel-default-region.png', {
            animations: 'disabled',
        });
        await expect(page.getByTestId('carousel-autoplay-region')).toHaveScreenshot('carousel-autoplay-region.png', {
            animations: 'disabled',
        });
        await expect(page.getByTestId('carousel-no-arrows-region')).toHaveScreenshot('carousel-no-arrows-region.png', {
            animations: 'disabled',
        });
        await expect(page.getByTestId('carousel-no-dots-region')).toHaveScreenshot('carousel-no-dots-region.png', {
            animations: 'disabled',
        });
    });

    test('captures Countdown showcase regions with a fixed target', async ({ page }) => {
        await page.goto(countdownShowcaseUrl);
        await disableMotion(page);
        // 冻结时钟后倒计时不再跳动，sr-only 文本固定为 02:00:00
        await expect(page.getByRole('timer').first().locator('.animal-countdown-sr-only')).toHaveText('02:00:00');

        await expect(page.getByTestId('countdown-variants-region')).toHaveScreenshot('countdown-variants-region.png', {
            animations: 'disabled',
        });
        await expect(page.getByTestId('countdown-sizes-region')).toHaveScreenshot('countdown-sizes-region.png', {
            animations: 'disabled',
        });
        await expect(page.getByTestId('countdown-format-prefix-region')).toHaveScreenshot('countdown-format-prefix-region.png', {
            animations: 'disabled',
        });
    });

    test('captures DatePicker showcase regions and open panels', async ({ page }) => {
        await page.goto(datePickerShowcaseUrl);
        await disableMotion(page);

        await expect(page.getByTestId('datepicker-basic-region')).toHaveScreenshot('datepicker-basic-region.png', {
            animations: 'disabled',
        });
        await expect(page.getByTestId('datepicker-sizes-region')).toHaveScreenshot('datepicker-sizes-region.png', {
            animations: 'disabled',
        });
        await expect(page.getByTestId('datepicker-status-region')).toHaveScreenshot('datepicker-status-region.png', {
            animations: 'disabled',
        });

        // 打开单选面板（defaultValue 固定为 2026-08-15，视图停在 2026 年 8 月）
        await page.goto(datePickerOpenUrl);
        await disableMotion(page);
        await page.getByTestId('datepicker-single-region').getByRole('combobox').click();
        const panel = page.locator('.animal-datepicker-panel');
        await expect(panel).toHaveClass(/animal-datepicker-panel-visible/);
        await expect(panel).toHaveScreenshot('datepicker-open-panel.png', {
            animations: 'disabled',
        });

        // 打开范围面板（双月视图）
        await page.goto(datePickerRangeOpenUrl);
        await disableMotion(page);
        await page.getByRole('combobox').click();
        const rangePanel = page.locator('.animal-datepicker-panel');
        await expect(rangePanel).toHaveClass(/animal-datepicker-panel-visible/);
        await expect(rangePanel).toHaveScreenshot('datepicker-range-open-panel.png', {
            animations: 'disabled',
        });
    });

    test('captures TimePicker showcase regions and open panel', async ({ page }) => {
        await page.goto(timePickerShowcaseUrl);
        await disableMotion(page);

        await expect(page.getByTestId('timepicker-format-region')).toHaveScreenshot('timepicker-format-region.png', {
            animations: 'disabled',
        });
        await expect(page.getByTestId('timepicker-sizes-region')).toHaveScreenshot('timepicker-sizes-region.png', {
            animations: 'disabled',
        });
        await expect(page.getByTestId('timepicker-status-region')).toHaveScreenshot('timepicker-status-region.png', {
            animations: 'disabled',
        });

        // 打开面板（defaultValue 固定为 09:30:00，三列滚到固定位置）
        await page.goto(timePickerOpenUrl);
        await disableMotion(page);
        await page.getByRole('combobox').click();
        const panel = page.locator('.animal-timepicker-panel');
        await expect(panel).toHaveClass(/animal-timepicker-panel-visible/);
        await expect(panel).toHaveScreenshot('timepicker-open-panel.png', {
            animations: 'disabled',
        });
    });
});
