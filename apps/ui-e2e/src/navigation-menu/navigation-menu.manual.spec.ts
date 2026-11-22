import type { Page } from '@playwright/test';
import { STORY_ROOT, checkA11y, expect, gotoStory, test } from '../support';

type KeyInit = { key: string; shiftKey?: boolean };

const TAB: KeyInit = { key: 'Tab' };

// A dispatched keydown event gets no browser default action, such as moving focus.
async function pressKey(page: Page, init: KeyInit): Promise<void> {
	await expect(page.locator(':focus')).toHaveCount(1);
	await page.evaluate((eventInit) => {
		const focused = document.activeElement;
		if (!focused) throw new Error('Nothing has focus');
		focused.dispatchEvent(new KeyboardEvent('keydown', { bubbles: true, cancelable: true, ...eventInit }));
	}, init);
}

const a11y = (page: Page) =>
	checkA11y(page, STORY_ROOT, {
		rules: {
			'page-has-heading-one': { enabled: false },
			'landmark-one-main': { enabled: false },
		},
	});

async function openHome(page: Page): Promise<void> {
	await page.getByRole('button', { name: /home/i }).hover();
	await expect(page.getByRole('button', { name: /home/i })).toHaveAttribute('aria-expanded', 'true');
}

test.describe('navigation-menu', () => {
	test.describe('default (open on hover)', () => {
		test.beforeEach(async ({ page }) => {
			await gotoStory(page, 'navigation-menu--default');
			await page.setViewportSize({ width: 1000, height: 1000 });
		});

		test('has no a11y violations and wires aria-expanded/controls only while open', async ({ page }) => {
			await a11y(page);

			await expect(page.getByRole('button', { name: /home/i })).toHaveAttribute('aria-expanded', 'false');
			await expect(page.getByRole('button', { name: /home/i })).not.toHaveAttribute('aria-controls');

			await openHome(page);
			await expect(page.getByRole('link', { name: /introduction/i })).toBeVisible();
			await expect(page.getByRole('button', { name: /home/i })).toHaveAttribute('aria-controls');
		});

		test('enters the panel with ArrowDown', async ({ page }) => {
			await openHome(page);

			await page.getByRole('button', { name: /home/i }).focus();
			await pressKey(page, { key: 'ArrowDown' });
			await expect(page.getByRole('link', { name: /spartan\.ng/i })).toBeFocused();
		});

		test('enters the panel when tabbing from the trigger', async ({ page }) => {
			await openHome(page);

			await page.getByRole('button', { name: /home/i }).focus();
			await pressKey(page, TAB);
			await expect(page.getByRole('link', { name: /spartan\.ng/i })).toBeFocused();
		});

		test('walks through the panel items with Tab / Shift+Tab', async ({ page }) => {
			await openHome(page);

			await page.getByRole('link', { name: /spartan\.ng/i }).focus();
			await pressKey(page, TAB);
			await expect(page.getByRole('link', { name: /introduction/i })).toBeFocused();

			await pressKey(page, { ...TAB, shiftKey: true });
			await expect(page.getByRole('link', { name: /spartan\.ng/i })).toBeFocused();
		});

		test('keeps focus in the menu when tabbing past the last item (issue #1484)', async ({ page }) => {
			await openHome(page);

			await page.getByRole('link', { name: /typography/i }).focus();
			await pressKey(page, TAB);

			await expect(page.getByRole('button', { name: /components/i })).toBeFocused();
			await expect(page.getByRole('button', { name: /home/i })).toHaveAttribute('aria-expanded', 'false');
		});

		test('returns focus to the trigger on Shift+Tab from the first item', async ({ page }) => {
			await openHome(page);

			await page.getByRole('link', { name: /spartan\.ng/i }).focus();
			await pressKey(page, { ...TAB, shiftKey: true });
			await expect(page.getByRole('button', { name: /home/i })).toBeFocused();
		});

		test('closes on Escape and restores focus to the trigger', async ({ page }) => {
			await openHome(page);

			await page.getByRole('link', { name: /introduction/i }).focus();
			await pressKey(page, { key: 'Escape' });

			await expect(page.getByRole('button', { name: /home/i })).toBeFocused();
			await expect(page.getByRole('button', { name: /home/i })).toHaveAttribute('aria-expanded', 'false');
		});
	});
});
