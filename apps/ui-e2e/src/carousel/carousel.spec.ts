import { expect, gotoStory, test } from '../support';

test.describe('label', () => {
	test.describe('default', () => {
		test.beforeEach(async ({ page }) => {
			await gotoStory(page, 'carousel--default');
		});

		test('should have correct aria attributes on the root element', async ({ page }) => {
			const carousel = page.locator('hlm-carousel');
			await expect(carousel).not.toHaveCount(0);
			await expect(carousel.first()).toHaveAttribute('role', 'region');
			await expect(carousel.first()).toHaveAttribute('aria-roledescription', 'carousel');
		});

		test('should have correct aria attributes on the item elements', async ({ page }) => {
			const carouselItem = page.locator('hlm-carousel-item');
			await expect(carouselItem).not.toHaveCount(0);
			await expect(carouselItem.first()).toHaveAttribute('role', 'group');
			await expect(carouselItem.first()).toHaveAttribute('aria-roledescription', 'slide');
		});
	});
});
