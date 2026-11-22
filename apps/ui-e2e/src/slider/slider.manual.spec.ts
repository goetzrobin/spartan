import type { Locator } from '@playwright/test';
import { expect, gotoStory, test } from '../support';

type PointerInit = { pointerId: number; clientX: number; clientY: number };

// Chromium does not grant pointer capture to synthetic pointer events, so drags use the real mouse.
async function trigger(locator: Locator, type: string, init: PointerInit): Promise<void> {
	const mouse = locator.page().mouse;
	if (type === 'pointerup') {
		await mouse.up();
		return;
	}
	await mouse.move(init.clientX, init.clientY);
	if (type === 'pointerdown') await mouse.down();
}

async function centre(locator: Locator): Promise<{ x: number; y: number }> {
	return locator.evaluate((element) => {
		const rect = element.getBoundingClientRect();
		return { x: Math.round(rect.left + rect.width / 2), y: Math.round(rect.top + rect.height / 2) };
	});
}

async function scrollIntoView(locator: Locator): Promise<void> {
	await locator.evaluate((element) => element.scrollIntoView());
}

async function valueNow(slider: Locator): Promise<number> {
	return Number(await slider.getAttribute('aria-valuenow'));
}

test.describe('Slider', () => {
	test.beforeEach(async ({ page }) => {
		await gotoStory(page, 'slider--default');
	});

	test('should allow dragging to change the value', async ({ page }) => {
		const thumbs = page.locator('[data-slot="slider-thumb"]');
		const slider = page.locator('[role="slider"]').nth(0);

		await expect(thumbs.first()).toBeVisible();

		const start = await valueNow(slider);

		await scrollIntoView(thumbs);
		await expect(thumbs.first()).toBeVisible();

		const thumb = thumbs.nth(0);
		const { x: x0, y: y0 } = await centre(thumb);
		const x1 = x0 + 60;
		const x2 = x0 + 120;

		await trigger(thumb, 'pointerdown', { pointerId: 1, clientX: x0, clientY: y0 });
		await trigger(thumb, 'pointermove', { pointerId: 1, clientX: x1, clientY: y0 });
		await trigger(thumb, 'pointermove', { pointerId: 1, clientX: x2, clientY: y0 });
		await trigger(thumb, 'pointerup', { pointerId: 1, clientX: x2, clientY: y0 });

		await expect.poll(() => valueNow(slider)).not.toBe(start);
	});

	test('should support keyboard interactions', async ({ page }) => {
		const slider = page.locator('[role="slider"]');

		await slider.focus();

		await page.keyboard.press('ArrowRight');
		await expect(slider).toHaveAttribute('aria-valuenow', '1');

		await page.keyboard.press('ArrowLeft');
		await expect(slider).toHaveAttribute('aria-valuenow', '0');

		await page.keyboard.press('Shift+ArrowRight');
		await expect(slider).toHaveAttribute('aria-valuenow', '10');

		await page.keyboard.press('Shift+ArrowLeft');
		await expect(slider).toHaveAttribute('aria-valuenow', '0');

		await page.keyboard.press('End');
		await expect(slider).toHaveAttribute('aria-valuenow', '100');

		await page.keyboard.press('Home');
		await expect(slider).toHaveAttribute('aria-valuenow', '0');
	});

	test('should drag the whole range when draggableRange is enabled', async ({ page }) => {
		await gotoStory(page, 'slider--draggable-range');

		const sliders = page.locator('[role="slider"]');
		const range = page.locator('[data-slot="slider-range"]');

		await expect(sliders).toHaveCount(2);
		const start0 = await valueNow(sliders.nth(0));
		const start1 = await valueNow(sliders.nth(1));

		await scrollIntoView(range);
		await expect(range).toBeVisible();

		const { x: x0, y: y0 } = await centre(range);
		const x1 = x0 + 80;
		const x2 = x0 + 160;

		await trigger(range, 'pointerdown', { pointerId: 1, clientX: x0, clientY: y0 });
		await trigger(range, 'pointermove', { pointerId: 1, clientX: x1, clientY: y0 });
		await trigger(range, 'pointermove', { pointerId: 1, clientX: x2, clientY: y0 });
		await trigger(range, 'pointerup', { pointerId: 1, clientX: x2, clientY: y0 });

		await expect(async () => {
			const end0 = await valueNow(sliders.nth(0));
			expect(end0).not.toBe(start0);

			const end1 = await valueNow(sliders.nth(1));
			expect(end1).not.toBe(start1);
			expect(end1 - end0).toBe(start1 - start0);
		}).toPass();
	});

	test('should drag all thumbs together when draggableRangeOnly is enabled', async ({ page }) => {
		await gotoStory(page, 'slider--draggable-range-only');

		const sliders = page.locator('[role="slider"]');
		const thumbs = page.locator('[data-slot="slider-thumb"]');

		await expect(sliders).toHaveCount(3);
		await expect(thumbs).toHaveCount(3);
		await expect(thumbs.first()).toBeVisible();

		const start0 = await valueNow(sliders.nth(0));
		const start1 = await valueNow(sliders.nth(1));
		const start2 = await valueNow(sliders.nth(2));

		const middle = thumbs.nth(1);
		await scrollIntoView(middle);
		await expect(middle).toBeVisible();

		const { x: x0Viewport, y: yViewport } = await centre(middle);
		const x1Viewport = x0Viewport + 80;
		const x2Viewport = x0Viewport + 160;

		await trigger(middle, 'pointerdown', { pointerId: 1, clientX: x0Viewport, clientY: yViewport });
		await trigger(middle, 'pointermove', { pointerId: 1, clientX: x1Viewport, clientY: yViewport });
		await trigger(middle, 'pointermove', { pointerId: 1, clientX: x2Viewport, clientY: yViewport });
		await trigger(middle, 'pointerup', { pointerId: 1, clientX: x2Viewport, clientY: yViewport });

		await expect(async () => {
			const end0 = await valueNow(sliders.nth(0));
			expect(end0).not.toBe(start0);

			const end1 = await valueNow(sliders.nth(1));
			expect(end1).not.toBe(start1);

			const end2 = await valueNow(sliders.nth(2));
			expect(end2).not.toBe(start2);

			expect(end1 - end0).toBe(start1 - start0);
			expect(end2 - end1).toBe(start2 - start1);
		}).toPass();
	});
});
