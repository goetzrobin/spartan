import { expect, gotoStory, test } from '../support';

test.describe('calendar', () => {
	test.describe('default', () => {
		test.beforeEach(async ({ page }) => {
			await gotoStory(page, 'calendar--default');
		});

		test('should select focus the selected date', async ({ page }) => {
			const header = page.locator('[brnCalendarHeader]');
			await expect(header).not.toHaveCount(0);
			await expect(header.filter({ hasText: /June 2024/ })).not.toHaveCount(0);
		});

		test('should navigate to the previous month', async ({ page }) => {
			const header = page.locator('[brnCalendarHeader]');
			await expect(header).not.toHaveCount(0);
			await expect(header.filter({ hasText: /June 2024/ })).not.toHaveCount(0);
			await page.locator('[brnCalendarPreviousButton]').click();
			await expect(header.filter({ hasText: /May 2024/ })).not.toHaveCount(0);
		});

		test('should navigate to the next month', async ({ page }) => {
			const header = page.locator('[brnCalendarHeader]');
			await expect(header).not.toHaveCount(0);
			await expect(header.filter({ hasText: /June 2024/ })).not.toHaveCount(0);
			await page.locator('[brnCalendarNextButton]').click();
			await expect(header.filter({ hasText: /July 2024/ })).not.toHaveCount(0);
		});
	});
});
