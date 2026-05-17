import { expect, test, type Locator, type Page } from '@playwright/test';

const tabsStoryUrl = '/iframe.html?id=regression-parity-surface-tabs--tabs-parity&viewMode=story';
const surfaceStoryUrl = '/iframe.html?id=regression-parity-surface-tabs--surface-parity&viewMode=story';
const tabsMatrixStoryUrl = '/iframe.html?id=regression-parity-surface-tabs--tabs-matrix-parity&viewMode=story';
const surfaceEdgeStoryUrl = '/iframe.html?id=regression-parity-surface-tabs--surface-edge-parity&viewMode=story';

const tabByName = (scope: Locator | Page, name: RegExp) =>
    scope.getByRole('button', { name }).or(scope.getByRole('tab', { name }));

test.describe('reference Tabs parity', () => {
    test('covers tab variants, interactions, and active styles', async ({ page }) => {
        await page.goto(tabsStoryUrl);
        await expect(page.getByTestId('tabs-parity-region')).toBeVisible();
        await expect(page.getByText('leafAnimation=true (默认)')).toBeVisible();
        await expect(page.getByText('leafAnimation=false')).toBeVisible();

        const activeTab = tabByName(page, /鱼类/).first();
        await expect(activeTab).toHaveCSS('background-color', 'rgb(12, 192, 181)');
        await expect(activeTab).toHaveCSS('color', 'rgb(255, 249, 227)');

        await expect(page.getByTestId('tabs-selected-label')).toContainText('岛屿概况');
        await tabByName(page.getByTestId('tabs-parity-region'), /商店/).last().click();
        await expect(page.getByTestId('tabs-selected-label')).toContainText('商店');

        const uncontrolledBox = page.getByTestId('tabs-uncontrolled');
        await tabByName(uncontrolledBox, /海洋生物/).click();
        await expect(uncontrolledBox.getByText('海星、珊瑚、小丑鱼...')).toBeVisible();
        const box = await uncontrolledBox.boundingBox();
        expect(box?.height).toBeGreaterThanOrEqual(100);
    });

    test('covers Tabs matrix props and styles', async ({ page }) => {
        await page.goto(tabsMatrixStoryUrl);
        await expect(page.getByTestId('tabs-matrix-region')).toBeVisible();

        await expect(page.getByTestId('tabs-default-active-matrix')).toContainText('蝴蝶、瓢虫、蜻蜓');
        const shadowOffActive = tabByName(page.getByTestId('tabs-shadow-off-matrix'), /鱼类/).first();
        await expect(shadowOffActive).toHaveCSS('box-shadow', 'none');
        await expect(page.getByTestId('tabs-leaf-static-matrix').locator('img').first()).toHaveCSS('animation-name', 'none');

        await expect(page.getByTestId('tabs-matrix-selected-label')).toHaveText('selected: fish');
        await tabByName(page.getByTestId('tabs-controlled-matrix'), /博物馆/).click();
        await expect(page.getByTestId('tabs-matrix-selected-label')).toHaveText('selected: museum');
        await expect(page.getByTestId('tabs-controlled-matrix')).toContainText('化石、艺术品、海洋生物展区开放中。');
    });
});

test.describe('reference surface parity', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto(surfaceStoryUrl);
        await expect(page.getByTestId('card-parity-region')).toBeVisible();
        await expect(page.getByTestId('collapse-parity-region')).toBeVisible();
        await expect(page.getByTestId('modal-parity-region')).toBeVisible();
    });

    test('covers Card variants and styles', async ({ page }) => {
        const defaultCard = page.getByText('基础卡片').locator('xpath=ancestor::div[contains(@class, "card")][1]');
        await expect(page.getByText('Title标题卡片')).toBeVisible();
        await expect(page.getByText('虚线边框卡片')).toBeVisible();
        for (const label of ['Default', 'App Pink', 'Purple', 'App Blue', 'App Yellow', 'App Orange', 'App Teal', 'App Green', 'App Red', 'Lime Green', 'Yellow-Green', 'Brown', 'Warm Peach Pink']) {
            await expect(page.getByTestId('card-parity-region').getByText(label, { exact: true })).toBeVisible();
        }
        await expect(defaultCard).toHaveCSS('background-color', 'rgb(247, 243, 223)');
        await expect(defaultCard).toHaveCSS('border-radius', '20px');
    });

    test('covers Collapse and Modal interactions', async ({ page }) => {
        const firstCollapse = page.getByRole('button', { name: /1個島嶼可以登錄多少名用戶/ });
        await expect(firstCollapse).toHaveAttribute('aria-expanded', 'false');
        await firstCollapse.click();
        await expect(firstCollapse).toHaveAttribute('aria-expanded', 'true');
        await firstCollapse.click();
        await expect(firstCollapse).toHaveAttribute('aria-expanded', 'false');

        await expect(page.getByText('答案已经展示出来了！可以点击收起。')).toBeVisible();
        await expect(page.getByRole('button', { name: /这个问题已被禁用/ })).toBeDisabled();

        await expect(page.getByText('钓到')).toHaveCount(0);
        await page.getByRole('button', { name: '基础 Modal' }).click();
        await expect(page.getByRole('dialog')).toBeVisible();
        // The default modal enables a typewriter effect which can cause continuous layout shifts.
        // Close it via Escape to avoid flakiness from clicking an animating footer button.
        await page.keyboard.press('Escape');
        await expect(page.getByRole('dialog')).toHaveCount(0);

        await page.getByRole('button', { name: '带标题 Modal' }).click();
        await expect(page.getByText('博物馆捐赠')).toBeVisible();
        await page.keyboard.press('Escape');
        await expect(page.getByText('博物馆捐赠')).toHaveCount(0);

        await page.getByRole('button', { name: '自定义 Footer' }).click();
        await expect(page.getByText('确认搬家')).toBeVisible();
        await page.getByRole('button', { name: '再想想' }).click();
        await expect(page.getByText('确认搬家')).toHaveCount(0);

        await page.getByRole('button', { name: '关闭打字机效果' }).click();
        await expect(page.getByText('天气预报')).toBeVisible();
        await expect(page.getByText('明天天气晴朗')).toBeVisible();
        await expect(page.locator('[class*="mask"], [class*="overlay"]').first()).toHaveCSS('background-color', 'rgba(0, 0, 0, 0.35)');
        // Exercise the default footer close path using the stable no-typewriter modal.
        await page.getByRole('button', { name: '确定' }).click();
        await expect(page.getByText('天气预报')).toHaveCount(0);
    });

    test('covers Card, rich Collapse, and Modal edge props', async ({ page }) => {
        await page.goto(surfaceEdgeStoryUrl);
        await expect(page.getByTestId('card-edge-region')).toBeVisible();
        await expect(page.getByTestId('collapse-rich-region')).toBeVisible();
        await expect(page.getByTestId('modal-edge-region')).toBeVisible();

        const restCard = page.getByTestId('card-rest-props');
        await expect(restCard).toHaveAttribute('class', /parity-extra-card/);
        await expect(restCard).toHaveCSS('width', '220px');
        await expect(page.getByTestId('card-dashed-color')).toContainText('dashed + color');
        await expect(page.getByTestId('card-title-color')).toContainText('title + color');

        const richRegion = page.getByTestId('collapse-rich-region');
        await expect(richRegion.getByRole('button', { name: /富文本答案如何展示/ })).toHaveAttribute('aria-expanded', 'true');
        const manualLink = richRegion.getByRole('link', { name: '岛民手册' });
        await expect(manualLink).toHaveCSS('color', 'rgb(25, 200, 185)');
        await expect(manualLink).toHaveCSS('text-decoration-line', 'none');
        await expect(richRegion.locator('ul')).toHaveCSS('padding-left', '24px');
        await expect(richRegion.locator('li').first()).toHaveCSS('margin-bottom', '4px');

        await page.getByRole('button', { name: 'footer null' }).click();
        let dialog = page.getByRole('dialog');
        await expect(dialog).toBeVisible();
        await expect(dialog.getByRole('button', { name: '取消' })).toHaveCount(0);
        await expect(dialog.getByRole('button', { name: '确定' })).toHaveCount(0);
        await page.keyboard.press('Escape');
        await expect(dialog).toHaveCount(0);

        await page.getByRole('button', { name: 'mask locked' }).click();
        dialog = page.getByRole('dialog');
        await expect(dialog).toBeVisible();
        await page.mouse.click(10, 10);
        await expect(dialog).toBeVisible();
        await page.keyboard.press('Escape');
        await expect(dialog).toHaveCount(0);

        await page.getByRole('button', { name: 'narrow width' }).click();
        dialog = page.getByRole('dialog');
        await expect(dialog).toBeVisible();
        const dialogBox = await dialog.boundingBox();
        expect(dialogBox?.width).toBeGreaterThanOrEqual(330);
        expect(dialogBox?.width).toBeLessThanOrEqual(370);
        await page.getByRole('button', { name: '确定' }).click();
    });
});
