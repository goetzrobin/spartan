import type { Locator, Page } from '@playwright/test';
import { STORY_ROOT, byText, caretToEnd, checkA11y, expect, gotoStory, test } from '../support';

async function typeAtEnd(page: Page, input: Locator, keys: string[]): Promise<void> {
	await input.click();
	await caretToEnd(input);
	for (const key of keys) await page.keyboard.press(key);
}

async function joinedText(locator: Locator): Promise<string> {
	return (await locator.allTextContents()).join('');
}

test.describe('command', () => {
	test.describe('dynamic with ngModel', () => {
		test.beforeEach(async ({ page }) => {
			await gotoStory(page, 'command--dynamic-options');
		});

		test('should show items based on input value without error.', async ({ page }) => {
			await checkA11y(page, STORY_ROOT, {
				rules: {
					'page-has-heading-one': { enabled: false },
					'landmark-one-main': { enabled: false },
				},
			});

			const visible = page.locator('button[hlm-command-item]:not([data-hidden])');
			const selected = page.locator('button[hlm-command-item][data-selected]');
			const input = page.locator('input');

			await expect(visible).toHaveCount(1);

			await expect(byText(page, 'Profile')).toHaveCount(1);
			await typeAtEnd(page, input, ['Backspace']);
			await expect(visible).toHaveCount(4);
			await expect(selected).not.toHaveCount(0);
			await expect.poll(() => joinedText(selected)).toContain('Profile');

			await typeAtEnd(page, input, ['s']);
			await expect(selected).not.toHaveCount(0);
			await expect.poll(() => joinedText(selected)).toContain('Search Emoji');
			await typeAtEnd(page, input, ['e']);
			await typeAtEnd(page, input, ['t']);
			await expect(selected).toHaveCount(1);
			await expect.poll(() => joinedText(selected)).toContain('Settings');
		});
	});
});
