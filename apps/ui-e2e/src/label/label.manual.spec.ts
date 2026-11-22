import { expect, gotoStory, test } from '../support';

test.describe('label', () => {
	test.describe('default', () => {
		test('should override default id if one is defined', async ({ page }) => {
			await gotoStory(page, 'label--custom-id');

			const label = page.locator('[hlmLabel]');
			await expect(label).not.toHaveCount(0);
			await expect(label.first()).toHaveAttribute('id', 'my-id');
		});
	});
});
