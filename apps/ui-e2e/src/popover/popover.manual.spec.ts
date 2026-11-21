// Ported by hand from apps/ui-storybook-e2e/src/integration/popover/popover.cy.ts.
// These are the tests the transform could not convert (they measure positions through helper
// functions). Titles match the originals so the transform knows they are covered.
import type { Locator, Page } from '@playwright/test';
import { expect, gotoStory, settle, test } from '../support';

/** Reading geometry before the opening animation ends is off by a pixel. */
async function settled(content: Locator): Promise<void> {
	await expect(content).toBeVisible();
	await content.evaluate((element) => Promise.all(element.getAnimations().map((animation) => animation.finished)));
}

/** Both boxes read in one frame, so a scroll between two reads cannot skew the result. */
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

		// Without push the overlay is confined to the gap between the trigger and the
		// viewport edge, which collapses 288px of content down to about 68px.
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
			// This is the drift #955 removed: an overlay pushed back on every reposition stays
			// against the top edge while its trigger keeps travelling away from it.
			expect(content.top).toBeLessThan(0);
		}).toPass();
	});
});

test.describe('popover--close-on-scroll', () => {
	test.beforeEach(async ({ page }) => {
		await gotoStory(page, 'popover--close-on-scroll');
		// The trigger starts below the fold. Bring it into view and let that scroll finish before
		// opening: a click scrolls first, and a late scroll event would close the popover again.
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

	/** Distance from the bottom of the trigger to the top of the panel. */
	const gap = async (page: Page) => {
		const { trigger, content } = await boxes(page, '#scroll-trigger');
		return content.top - trigger.bottom;
	};

	test('keeps the panel on its trigger when the enclosing container scrolls', async ({ page }) => {
		// Start from a known scroll position: opening the popover leaves the container where the
		// click scrolled it, so this makes the distance moved by the trigger below deterministic.
		await scrollContainer(page, 0);
		await expect(async () => {
			expect(Math.abs(await gap(page)), 'the panel should sit at its offset').toBeLessThan(12);
		}).toPass();
		const settledGap = await gap(page);

		await scrollContainer(page, 120);

		await expect(async () => {
			const scrollTop = await page.locator('#scroll-container').evaluate((container) => container.scrollTop);
			expect(scrollTop, 'the container should have scrolled').toBeGreaterThan(100);
			// Without following the container the panel stays put and the gap grows by about the
			// scroll distance instead of holding the offset it settled at above.
			expect(Math.abs((await gap(page)) - settledGap)).toBeLessThan(8);
		}).toPass();
	});
});
