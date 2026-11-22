import type { Locator, Page } from '@playwright/test';
import { expect, gotoStory, settle, test } from '../support';

async function settled(content: Locator): Promise<void> {
	await expect(content).toBeVisible();
	await content.evaluate((element) => Promise.all(element.getAnimations().map((animation) => animation.finished)));
}

function boxes(
	page: Page,
	triggerSelector: string,
): Promise<{ trigger: DOMRect; content: DOMRect; innerWidth: number }> {
	return page.evaluate((selector) => {
		const plain = (rect: DOMRect) => rect.toJSON() as DOMRect;
		return {
			trigger: plain(document.querySelector(selector)!.getBoundingClientRect()),
			content: plain(document.querySelector('hlm-popover-content')!.getBoundingClientRect()),
			innerWidth: window.innerWidth,
		};
	}, triggerSelector);
}

test.describe('popover--near-viewport-edge', () => {
	test.beforeEach(async ({ page }) => {
		await gotoStory(page, 'popover--near-viewport-edge');
		await page.locator('#edge-trigger').click();
		await settled(page.locator('hlm-popover-content'));
	});

	test('keeps content at its own width rather than squeezing it into the space left', async ({ page }) => {
		const { trigger, content, innerWidth } = await boxes(page, '#edge-trigger');

		expect(content.width).toBeGreaterThan(innerWidth - trigger.left);
		expect(content.right).toBeLessThanOrEqual(innerWidth);
		expect(content.left).toBeGreaterThanOrEqual(0);
	});

	test('follows a trigger that scrolls out of view instead of holding itself against the edge', async ({ page }) => {
		for (const y of [400, 900, 1400]) {
			await page.evaluate((top) => window.scrollTo(0, top), y);
		}

		await expect(async () => {
			const { trigger, content } = await boxes(page, '#edge-trigger');
			expect(trigger.top, 'the trigger should have scrolled above the viewport').toBeLessThan(0);
			expect(content.top).toBeLessThan(0);
		}).toPass();
	});
});

test.describe('popover--close-on-scroll', () => {
	test.beforeEach(async ({ page }) => {
		await gotoStory(page, 'popover--close-on-scroll');
		await page.locator('#closing-trigger').scrollIntoViewIfNeeded();
		await settle(page);
		await page.locator('#closing-trigger').click();
		await expect(page.locator('hlm-popover-content')).toBeVisible();
	});

	test('honours the scroll strategy the wrapper now forwards', async ({ page }) => {
		await page.evaluate(() => window.scrollTo(0, 400));

		await expect(page.locator('hlm-popover-content')).toHaveCount(0);
	});
});

test.describe('popover--scroll-container', () => {
	test.beforeEach(async ({ page }) => {
		await gotoStory(page, 'popover--scroll-container');
		await page.locator('#scroll-trigger').click();
		await settled(page.locator('hlm-popover-content'));
	});

	const scrollContainer = (page: Page, top: number) =>
		page.locator('#scroll-container').evaluate((container, value) => {
			container.scrollTop = value;
		}, top);

	const gap = async (page: Page) => {
		const { trigger, content } = await boxes(page, '#scroll-trigger');
		return content.top - trigger.bottom;
	};

	test('keeps the panel on its trigger when the enclosing container scrolls', async ({ page }) => {
		await scrollContainer(page, 0);
		await expect(async () => {
			expect(Math.abs(await gap(page)), 'the panel should sit at its offset').toBeLessThan(12);
		}).toPass();
		const settledGap = await gap(page);

		await scrollContainer(page, 120);

		await expect(async () => {
			const scrollTop = await page.locator('#scroll-container').evaluate((container) => container.scrollTop);
			expect(scrollTop, 'the container should have scrolled').toBeGreaterThan(100);
			expect(Math.abs((await gap(page)) - settledGap)).toBeLessThan(8);
		}).toPass();
	});
});
