import { expect, gotoStory, test } from '../support';

test.describe('Slider', () => {
	test.beforeEach(async ({ page }) => {
		await gotoStory(page, 'slider--default');
	});

	test('should render the slider with the correct initial value', async ({ page }) => {
		await expect(page.locator('[role="slider"]')).toHaveCount(1);
		await expect(page.locator('[role="slider"]').first()).toHaveAttribute('aria-valuenow', '0');
	});
});
