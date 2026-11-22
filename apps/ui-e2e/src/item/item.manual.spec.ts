import { checkA11y, expect, gotoStory, test } from '../support';

test.describe('item', () => {
	test.describe('Group', () => {
		test.beforeEach(async ({ page }) => {
			await gotoStory(page, 'item--group');
		});

		test('should pass accessibility checks', async ({ page }) => {
			await expect(page.locator('hlm-item-group')).not.toHaveCount(0);
			await checkA11y(page, 'hlm-item-group');
		});
	});
});
