import { expect, test, type Page } from '@playwright/test';

const assetsStoryUrl = '/iframe.html?id=regression-parity-display-utilities--assets-parity&viewMode=story';
const textStoryUrl = '/iframe.html?id=regression-parity-display-utilities--text-utility-stable&viewMode=story';
const statusStoryUrl = '/iframe.html?id=regression-parity-display-utilities--status-scene-stable&viewMode=story';
const weddingStoryUrl = '/iframe.html?id=regression-parity-display-utilities--wedding-invitation-stable&viewMode=story';

const freezeClock = async (page: Page) => {
    await page.addInitScript(() => {
        const fixed = new Date('2024-08-15T13:45:00');
        const RealDate = Date;
        class MockDate extends RealDate {
            constructor(...args: ConstructorParameters<DateConstructor>) {
                super(...(args.length ? args : [fixed.getTime()]));
            }
            static now() {
                return fixed.getTime();
            }
        }
        MockDate.UTC = RealDate.UTC;
        MockDate.parse = RealDate.parse;
        window.Date = MockDate as DateConstructor;
    });
};

test.describe('reference display utility parity', () => {
    test('covers Divider, Footer, and Icon variants', async ({ page }) => {
        await page.goto(assetsStoryUrl);
        await expect(page.getByTestId('divider-footer-region')).toBeVisible();
        await expect(page.getByTestId('icon-region')).toBeVisible();

        const dividers = page.getByTestId('divider-matrix').locator('div[class*="divider"]');
        await expect(dividers).toHaveCount(10);
        const solidAndWaveDividers = page
            .getByTestId('divider-matrix')
            .locator(
                '.animal-divider:not(.animal-divider-dashed-brown):not(.animal-divider-dashed-teal):not(.animal-divider-dashed-white):not(.animal-divider-dashed-yellow)',
            );
        const dashedDividers = page
            .getByTestId('divider-matrix')
            .locator(
                '.animal-divider.animal-divider-dashed-brown, .animal-divider.animal-divider-dashed-teal, .animal-divider.animal-divider-dashed-white, .animal-divider.animal-divider-dashed-yellow',
            );

        for (const divider of await solidAndWaveDividers.all()) {
            await expect(divider).toHaveCSS('height', '12px');
            await expect(divider).toHaveCSS('background-repeat', 'no-repeat');
        }
        for (const divider of await dashedDividers.all()) {
            await expect(divider).toHaveCSS('height', '12px');
            await expect(divider).toHaveCSS('background-repeat', 'repeat-x');
            await expect(divider).toHaveCSS('background-size', '12px 2px');
        }
        await expect(dividers.last()).toHaveCSS('width', '220px');

        const footers = page.getByTestId('footer-matrix').locator('div[class*="footer"]');
        await expect(footers).toHaveCount(2);
        await expect(footers.first()).toHaveCSS('height', '80px');
        await expect(footers.last()).toHaveCSS('height', '80px');
        await expect(footers.last()).toHaveCSS('background-size', 'cover');

        const iconGrid = page.getByTestId('icon-grid');
        await expect(iconGrid.locator('span[class*="icon"]')).toHaveCount(10);
        await expect(page.getByText('NookMiles')).toBeVisible();
        const sizeIcons = page.getByTestId('icon-size-row').locator('span[class*="icon"]');
        await expect(sizeIcons).toHaveCount(3);
        await expect(sizeIcons.nth(0)).toHaveCSS('width', '24px');
        await expect(sizeIcons.nth(1)).toHaveCSS('width', '40px');
        await expect(sizeIcons.nth(2)).toHaveCSS('width', '56px');
    });

    test('covers CodeBlock, Cursor, and Typewriter behavior', async ({ page }) => {
        await page.goto(textStoryUrl);
        await expect(page.getByTestId('code-cursor-typewriter-region')).toBeVisible();

        const codeBlock = page.getByTestId('code-block-region').locator('pre');
        await expect(codeBlock).toContainText('useState');
        await expect(codeBlock).toHaveCSS('background-color', 'rgb(43, 33, 24)');
        await expect(codeBlock).toHaveCSS('border-radius', '20px');
        await expect(codeBlock.locator('span')).toHaveCount(72);
        await expect(codeBlock.locator('span').filter({ hasText: 'React' }).first()).toHaveCSS('color', 'rgb(224, 108, 117)');

        await expect(page.getByTestId('cursor-force-button')).toHaveCSS('cursor', /cursor-icon/);
        await expect(page.getByTestId('cursor-scoped-region')).toHaveCSS('cursor', /cursor-icon/);
        await expect(page.getByTestId('cursor-scoped-button')).toHaveCSS('cursor', 'pointer');
        await expect(page.getByTestId('cursor-scoped-input')).toHaveCSS('cursor', 'text');
        await expect(page.getByTestId('cursor-scoped-disabled')).toHaveCSS('cursor', 'not-allowed');
        await expect(page.getByTestId('typewriter-static')).toHaveText('Instant message');
        await expect(page.getByTestId('typewriter-live')).toHaveText('Island typing');
        await expect(page.getByTestId('typewriter-done-count')).toHaveText('done: 1');
        await page.getByRole('button', { name: 'Replay typewriter' }).click();
        await expect(page.getByTestId('typewriter-done-count')).toHaveText('done: 2');
    });

    test('covers Time, Phone, and Loading states', async ({ page }) => {
        await freezeClock(page);
        await page.goto(statusStoryUrl);
        await expect(page.getByTestId('status-scene-region')).toBeVisible();

        await expect(page.getByTestId('time-region')).toContainText('Thursday');
        await expect(page.getByTestId('time-region')).toContainText('Aug 15');
        await expect(page.getByTestId('time-region')).toContainText('13:45');
        await expect(page.getByTestId('time-region').locator('[class*="time"], [class*="acDatetime"]').first()).toHaveCSS('border-radius', '18px');

        const phone = page.getByTestId('phone-region');
        await expect(phone).toContainText('Welcome!');
        await expect(phone).toContainText('1:45PM');
        await expect(phone.locator('div[style*="background-color"]')).toHaveCount(9);
        await expect(phone.locator('span[class*="badge"], .animal-phone-badge')).toHaveCount(2);
        await expect(phone.locator('.animal-phone, div[class*="phone-"]:not([class*="phoneContainer"]):not(.animal-phone-container)').first()).toHaveCSS('width', '527px');

        const loading = page.getByTestId('loading-region');
        await expect(loading.locator('svg.illustration')).toBeVisible();
        await expect(loading.locator('[class*="container"], .animal-loading-container').first()).toHaveCSS('background-color', 'rgb(0, 0, 0)');
        await page.getByRole('button', { name: 'Hide loading' }).click();
        await expect(loading.locator('.parity-loading')).toBeHidden({ timeout: 1500 });
    });

    test('covers Time responsive layout', async ({ page }) => {
        await page.setViewportSize({ width: 390, height: 844 });
        await freezeClock(page);
        await page.goto(statusStoryUrl);

        const timeRoot = page.getByTestId('time-region').locator('[class*="acDatetime"], .animal-time').first();
        await expect(timeRoot).toContainText('Thursday');
        await expect(timeRoot).toContainText('13:45');
        await expect(timeRoot).toHaveCSS('padding', '12px 20px');
        await expect(timeRoot).toHaveCSS('gap', '12px');
        await expect(timeRoot.locator('[class*="acWeekday"], .animal-time-weekday').first()).toHaveCSS('font-size', '11px');
        await expect(timeRoot.locator('[class*="acMonthday"], .animal-time-monthday').first()).toHaveCSS('font-size', '16px');
        await expect(timeRoot.locator('[class*="acTime"], .animal-time-clock').first()).toHaveCSS('font-size', '32px');
        await expect(timeRoot.locator('[class*="acColon"], .animal-time-colon').first()).toHaveCSS('font-size', '32px');
    });

    test('covers WeddingInvitation structure and export affordance', async ({ page }) => {
        await page.goto(weddingStoryUrl);
        await expect(page.getByTestId('wedding-invitation-region')).toBeVisible();

        const card = page.getByTestId('wedding-invitation-card');
        await expect(card).toContainText('Wedding Invitation');
        await expect(card).toContainText('婚礼时间');
        await expect(card).toContainText('彩虹岛 · 樱花广场');
        await expect(card).toContainText('婚礼抽奖券');

        const weddingRoot = card.locator('.animal-wedding-invitation').first();
        await expect(weddingRoot).toHaveCSS('max-width', '420px');
        await expect(weddingRoot).toHaveCSS('border-radius', '16px');

        const exportButton = page.getByRole('button', { name: '保存为图片' });
        await expect(exportButton).toBeVisible();
        await expect(exportButton).toBeEnabled();
    });
});
