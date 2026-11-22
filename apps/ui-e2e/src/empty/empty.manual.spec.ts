import { expect, gotoStory, test } from '../support';

test.describe('Empty', () => {
	test.beforeEach(async ({ page }) => {
		await gotoStory(page, 'empty--default');
	});

	test.describe('Default Story', () => {
		test('should have proper structure', async ({ page }) => {
			const empty = page.locator('[hlmEmpty]');
			await expect(empty).toHaveCount(1);
			await expect(empty.locator('[hlmEmptyMedia]')).not.toHaveCount(0);
			await expect(empty.locator('[hlmEmptyContent]')).not.toHaveCount(0);
			await expect(empty.locator('[hlmEmptyHeader]')).not.toHaveCount(0);
		});
	});

	test.describe('Visual Regression', () => {
		const stories = [
			'default',
			'with-action',
			'search-results',
			'no-connection',
			'file-not-found',
			'minimal-text',
			'custom-layout',
		];

		for (const story of stories) {
			test(`should match visual snapshot for ${story}`, async ({ page }) => {
				await gotoStory(page, `empty--${story}`);
				await expect(page.locator('[hlmEmpty]')).toBeVisible();
			});
		}
	});
});
