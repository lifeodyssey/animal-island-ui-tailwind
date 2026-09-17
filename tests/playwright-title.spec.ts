import { expect, test } from '@playwright/test';

const defaultStoryUrl = '/iframe.html?id=components-title--default&viewMode=story';
const ribbonStoryUrl = '/iframe.html?id=components-title--ribbon&viewMode=story';
const colorsStoryUrl = '/iframe.html?id=components-title--colors&viewMode=story';

const sizeStories = [
    { name: 'small', url: '/iframe.html?id=components-title--small&viewMode=story', fontSize: '14px' },
    { name: 'middle', url: '/iframe.html?id=components-title--middle&viewMode=story', fontSize: '20px' },
    { name: 'large', url: '/iframe.html?id=components-title--large&viewMode=story', fontSize: '28px' },
] as const;

const colorVariants = [
    { label: 'app-pink', className: 'animal-title-app-pink', rf: '#f8a6b2', rb: '#e06880', rk: '#a03060', rt: '#fff' },
    { label: 'purple', className: 'animal-title-purple', rf: '#b77dee', rb: '#9050d0', rk: '#5a1a9a', rt: '#fff' },
    { label: 'app-blue', className: 'animal-title-app-blue', rf: '#889df0', rb: '#5068d8', rk: '#2030a0', rt: '#fff' },
    { label: 'app-yellow', className: 'animal-title-app-yellow', rf: '#f7cd67', rb: '#d4a030', rk: '#8a6010', rt: '#725d42' },
    { label: 'app-orange', className: 'animal-title-app-orange', rf: '#e59266', rb: '#c06a30', rk: '#7a3a10', rt: '#fff' },
    { label: 'app-teal', className: 'animal-title-app-teal', rf: '#82d5bb', rb: '#40a880', rk: '#186048', rt: '#fff' },
    { label: 'app-green', className: 'animal-title-app-green', rf: '#8ac68a', rb: '#509050', rk: '#205020', rt: '#fff' },
    { label: 'app-red', className: 'animal-title-app-red', rf: '#fc736d', rb: '#d43030', rk: '#900010', rt: '#fff' },
    { label: 'lime-green', className: 'animal-title-lime-green', rf: '#d1da49', rb: '#90a010', rk: '#485800', rt: '#3d5a1a' },
    { label: 'yellow-green', className: 'animal-title-yellow-green', rf: '#ecdf52', rb: '#c0b010', rk: '#706800', rt: '#725d42' },
    { label: 'brown', className: 'animal-title-brown', rf: '#9a835a', rb: '#705830', rk: '#3a2810', rt: '#fff' },
    { label: 'warm-peach-pink', className: 'animal-title-warm-peach-pink', rf: '#e18c6f', rb: '#b85a30', rk: '#6a2a10', rt: '#fff' },
] as const;

test.describe('Title', () => {
    test('default variant is layer', async ({ page }) => {
        await page.goto(defaultStoryUrl);
        const title = page.locator('.animal-title');
        await expect(title).toContainText('标题');
        const layer = title.locator('.animal-title-layer');
        await expect(layer).toBeVisible();
        await expect(layer.locator('.animal-title-layer-front')).toHaveText('标题');
        // no ribbon structure when variant=layer
        await expect(title.locator('.animal-title-ribbon')).toHaveCount(0);
    });

    test('ribbon variant renders upstream six-layer structure', async ({ page }) => {
        await page.goto(ribbonStoryUrl);

        const title = page.locator('.animal-title');
        const ribbon = title.locator('.animal-title-ribbon');
        await expect(title).toContainText('标题');
        await expect(ribbon).toBeVisible();
        await expect(ribbon.locator('.animal-title-ribbon-text')).toHaveText('标题');

        await expect(ribbon.locator('.animal-title-ribbon-back')).toHaveCount(2);
        await expect(ribbon.locator('.animal-title-ribbon-back-left')).toHaveCount(1);
        await expect(ribbon.locator('.animal-title-ribbon-back-right')).toHaveCount(1);
        await expect(ribbon.locator('.animal-title-ribbon-fold')).toHaveCount(2);
        await expect(ribbon.locator('.animal-title-ribbon-fold-left')).toHaveCount(1);
        await expect(ribbon.locator('.animal-title-ribbon-fold-right')).toHaveCount(1);
        await expect(ribbon.locator('.animal-title-ribbon-front')).toHaveCount(1);

        await expect(ribbon).toHaveCSS('font-size', '20px');
        await expect(ribbon.locator('.animal-title-ribbon-front')).toHaveCSS('border-radius', '4px');
        expect(await ribbon.evaluate((el) => {
            const style = getComputedStyle(el);
            return {
                rf: style.getPropertyValue('--rf').trim(),
                rb: style.getPropertyValue('--rb').trim(),
                rk: style.getPropertyValue('--rk').trim(),
                rt: style.getPropertyValue('--rt').trim(),
            };
        })).toEqual({ rf: '#27d039', rb: '#20992a', rk: '#115017', rt: '#fff' });
    });

    test('maps size stories to the upstream font-size scale', async ({ page }) => {
        for (const story of sizeStories) {
            await page.goto(story.url);
            // size applies regardless of variant
            const inner = page.locator('.animal-title-layer, .animal-title-ribbon');
            await expect(inner.first()).toHaveCSS('font-size', story.fontSize);
        }
    });

    test('applies every named color variant class and token layer (ribbon colors)', async ({ page }) => {
        await page.goto(colorsStoryUrl);

        const ribbons = page.locator('.animal-title-ribbon, .animal-title-layer');
        await expect(ribbons).toHaveCount(colorVariants.length + 1);

        for (const [index, variant] of colorVariants.entries()) {
            const el = ribbons.nth(index + 1);
            await expect(el).toHaveClass(new RegExp(`(^| )${variant.className}( |$)`));
            expect(await el.evaluate((element) => {
                const style = getComputedStyle(element);
                return {
                    rf: style.getPropertyValue('--rf').trim(),
                    rb: style.getPropertyValue('--rb').trim(),
                    rk: style.getPropertyValue('--rk').trim(),
                    rt: style.getPropertyValue('--rt').trim(),
                };
            })).toEqual({
                rf: variant.rf,
                rb: variant.rb,
                rk: variant.rk,
                rt: variant.rt,
            });
        }
    });
});
