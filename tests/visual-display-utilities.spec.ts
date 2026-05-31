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

const disableMotion = async (page: Page) => {
    await page.addStyleTag({
        content: `
            *, *::before, *::after { animation: none !important; transition: none !important; caret-color: transparent !important; outline: none !important; }
        `,
    });
    await page.evaluate(() => {
        const maybeGsap = (window as Window & { gsap?: { globalTimeline?: { pause: (time?: number) => void } } }).gsap;
        maybeGsap?.globalTimeline?.pause(0);
    });
};

test.describe('reference display utility visual parity', () => {
    test('captures Divider, Footer, and Icon regions', async ({ page }) => {
        await page.goto(assetsStoryUrl);
        await disableMotion(page);
        await expect(page.getByTestId('divider-footer-region')).toBeVisible();
        await expect(page.getByTestId('icon-region')).toBeVisible();

        await expect(page.getByTestId('divider-footer-region')).toHaveScreenshot('divider-footer-region.png', {
            animations: 'disabled',
        });
        await expect(page.getByTestId('icon-region')).toHaveScreenshot('icon-region.png', {
            animations: 'disabled',
        });
    });

    test('captures CodeBlock, Cursor, and Typewriter regions', async ({ page }) => {
        await page.goto(textStoryUrl);
        await disableMotion(page);
        await expect(page.getByTestId('code-block-region')).toBeVisible();
        await expect(page.getByTestId('typewriter-live')).toHaveText('Island typing');

        await expect(page.getByTestId('code-block-region')).toHaveScreenshot('code-block-region.png', {
            animations: 'disabled',
        });
        await expect(page.getByTestId('cursor-force-region')).toHaveScreenshot('cursor-force-region.png', {
            animations: 'disabled',
        });
        await expect(page.getByTestId('cursor-scoped-region')).toHaveScreenshot('cursor-scoped-region.png', {
            animations: 'disabled',
        });
        await expect(page.getByTestId('typewriter-region')).toHaveScreenshot('typewriter-region.png', {
            animations: 'disabled',
        });
    });

    test('captures Time, Phone, and Loading regions', async ({ page }) => {
        await freezeClock(page);
        await page.goto(statusStoryUrl);
        await disableMotion(page);
        await expect(page.getByTestId('time-region')).toContainText('13:45');
        await expect(page.getByTestId('phone-region')).toContainText('1:45PM');
        await expect(page.getByTestId('loading-region').locator('svg.illustration')).toBeVisible();

        await expect(page.getByTestId('time-region')).toHaveScreenshot('time-region.png', {
            animations: 'disabled',
        });
        await expect(page.getByTestId('phone-region')).toHaveScreenshot('phone-region.png', {
            animations: 'disabled',
        });
        await expect(page.getByTestId('loading-region')).toHaveScreenshot('loading-region.png', {
            animations: 'disabled',
        });
    });

    test('captures Time mobile region', async ({ page }) => {
        await page.setViewportSize({ width: 390, height: 844 });
        await freezeClock(page);
        await page.goto(statusStoryUrl);
        await disableMotion(page);
        await expect(page.getByTestId('time-region')).toContainText('13:45');

        await expect(page.getByTestId('time-region')).toHaveScreenshot('time-mobile-region.png', {
            animations: 'disabled',
        });
    });

    test('captures WeddingInvitation region', async ({ page }) => {
        await page.goto(weddingStoryUrl);
        await disableMotion(page);
        await expect(page.getByTestId('wedding-invitation-region')).toBeVisible();

        await expect(page.getByTestId('wedding-invitation-region')).toHaveScreenshot('wedding-invitation-region.png', {
            animations: 'disabled',
        });
    });
});
