import { STORY_ROOT, byText, checkA11y, expect, gotoStory, test } from '../support';

test.describe('command', () => {
	test.describe('dynamic with reactive form', () => {
		test.beforeEach(async ({ page }) => {
			await gotoStory(page, 'command--reactive-form');
		});

		test('should show items based on input value without error.', async ({ page }) => {
			await checkA11y(page, STORY_ROOT, {
				rules: {
					'page-has-heading-one': { enabled: false },
					'landmark-one-main': { enabled: false },
				},
			});

			/**       TEST initially it should only show Profile and Search Emoji    */
			await expect(page.locator('button[hlm-command-item]:not([data-hidden])')).toHaveCount(2);

			await expect(byText(page, 'Profile')).toHaveCount(1);
			await expect(byText(page, 'Search Emoji')).toHaveCount(1);
		});
	});

	test.describe('dynamic with direct value binding', () => {
		test.beforeEach(async ({ page }) => {
			await gotoStory(page, 'command--bound-value');
		});

		test('should show items based on input value without error.', async ({ page }) => {
			await checkA11y(page, STORY_ROOT, {
				rules: {
					'page-has-heading-one': { enabled: false },
					'landmark-one-main': { enabled: false },
				},
			});

			/**       TEST initially it should only show Search and Settings   */
			await expect(page.locator('button[hlm-command-item]:not([data-hidden])')).toHaveCount(2);
			await expect(byText(page, 'Search Emoji')).toHaveCount(1);
			await expect(byText(page, 'Settings')).toHaveCount(1);
		});
	});
});
