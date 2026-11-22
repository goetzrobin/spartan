import { expect, gotoStory, test } from '../support';

test.describe('Empty', () => {
	test.beforeEach(async ({ page }) => {
		await gotoStory(page, 'empty--default');
	});

	test.describe('Default Story', () => {
		test('should display the empty state with icon and content', async ({ page }) => {
			await expect(page.locator('[hlmEmpty]')).toBeVisible();
			await expect(page.locator('[hlmEmptyMedia]')).toBeVisible();
			await expect(page.locator('ng-icon[name="lucideInbox"]')).toBeVisible();
			await expect(page.locator('[hlmEmptyContent]')).toBeVisible();
			await expect(page.locator('[hlmEmptyTitle]').filter({ hasText: /No items found/ })).not.toHaveCount(0);
			await expect(
				page
					.locator('[hlmEmptyDescription]')
					.filter({ hasText: /You don't have any items yet\. Create your first item to get started\./ }),
			).not.toHaveCount(0);
		});
	});

	test.describe('With Action Story', () => {
		test.beforeEach(async ({ page }) => {
			await gotoStory(page, 'empty--with-action');
		});

		test('should display empty state with action button', async ({ page }) => {
			await expect(page.locator('[hlmEmpty]')).toBeVisible();
			await expect(page.locator('[hlmEmptyTitle]').filter({ hasText: /No items found/ })).not.toHaveCount(0);
			await expect(page.locator('button[hlmBtn]')).toBeVisible();
			await expect(page.locator('button[hlmBtn]').filter({ hasText: /Add Item/ })).not.toHaveCount(0);
		});

		test('should have clickable action button', async ({ page }) => {
			await expect(page.locator('button[hlmBtn]')).not.toBeDisabled();
			await page.locator('button[hlmBtn]').click();
		});
	});

	test.describe('Search Results Story', () => {
		test.beforeEach(async ({ page }) => {
			await gotoStory(page, 'empty--search-results');
		});

		test('should display search results empty state', async ({ page }) => {
			await expect(page.locator('[hlmEmpty]')).toBeVisible();
			await expect(page.locator('ng-icon[name="lucideSearch"]')).toBeVisible();
			await expect(page.locator('[hlmEmptyTitle]').filter({ hasText: /No search results/ })).not.toHaveCount(0);
			await expect(
				page.locator('[hlmEmptyDescription]').filter({ hasText: /We couldn't find any results for your search/ }),
			).not.toHaveCount(0);
		});

		test('should display multiple action buttons', async ({ page }) => {
			await expect(page.locator('button[hlmBtn]')).toHaveCount(2);
			await expect(
				page.locator('button[hlmBtn][variant="outline"]').filter({ hasText: /Clear Search/ }),
			).not.toHaveCount(0);
			await expect(
				page.locator('button[hlmBtn]:not([variant="outline"])').filter({ hasText: /Browse All/ }),
			).not.toHaveCount(0);
		});

		test('should have clickable action buttons', async ({ page }) => {
			await expect(page.locator('button[hlmBtn][variant="outline"]')).not.toBeDisabled();
			await page.locator('button[hlmBtn][variant="outline"]').click();
			await expect(page.locator('button[hlmBtn]:not([variant="outline"])')).not.toBeDisabled();
			await page.locator('button[hlmBtn]:not([variant="outline"])').click();
		});
	});

	test.describe('No Connection Story', () => {
		test.beforeEach(async ({ page }) => {
			await gotoStory(page, 'empty--no-connection');
		});

		test('should display no connection empty state', async ({ page }) => {
			await expect(page.locator('[hlmEmpty]')).toBeVisible();
			await expect(page.locator('ng-icon[name="lucideWifi"]')).toBeVisible();
			await expect(page.locator('[hlmEmptyTitle]').filter({ hasText: /No internet connection/ })).not.toHaveCount(0);
			await expect(
				page.locator('[hlmEmptyDescription]').filter({ hasText: /Please check your internet connection/ }),
			).not.toHaveCount(0);
		});

		test('should display retry button', async ({ page }) => {
			await expect(page.locator('button[hlmBtn]')).toBeVisible();
			await expect(page.locator('button[hlmBtn]').filter({ hasText: /Retry/ })).not.toHaveCount(0);
		});
	});

	test.describe('File Not Found Story', () => {
		test.beforeEach(async ({ page }) => {
			await gotoStory(page, 'empty--file-not-found');
		});

		test('should display file not found empty state', async ({ page }) => {
			await expect(page.locator('[hlmEmpty]')).toBeVisible();
			await expect(page.locator('ng-icon[name="lucideFileX"]')).toBeVisible();
			await expect(page.locator('[hlmEmptyTitle]').filter({ hasText: /File not found/ })).not.toHaveCount(0);
			await expect(
				page.locator('[hlmEmptyDescription]').filter({ hasText: /The file you're looking for doesn't exist/ }),
			).not.toHaveCount(0);
		});

		test('should display navigation buttons', async ({ page }) => {
			await expect(page.locator('button[hlmBtn]')).toHaveCount(2);
			await expect(page.locator('button[hlmBtn][variant="outline"]').filter({ hasText: /Go Back/ })).not.toHaveCount(0);
			await expect(
				page.locator('button[hlmBtn]:not([variant="outline"])').filter({ hasText: /Go Home/ }),
			).not.toHaveCount(0);
		});
	});

	test.describe('Minimal Text Story', () => {
		test.beforeEach(async ({ page }) => {
			await gotoStory(page, 'empty--minimal-text');
		});

		test('should display minimal empty state without icon', async ({ page }) => {
			await expect(page.locator('[hlmEmpty]')).toBeVisible();
			await expect(page.locator('[hlmEmptyMedia]')).toHaveCount(0);
			await expect(page.locator('ng-icon')).toHaveCount(0);
			await expect(page.locator('[hlmEmptyTitle]').filter({ hasText: /Nothing here yet/ })).not.toHaveCount(0);
			await expect(page.locator('[hlmEmptyDescription]')).toHaveCount(0);
		});
	});

	test.describe('Custom Layout Story', () => {
		test.beforeEach(async ({ page }) => {
			await gotoStory(page, 'empty--custom-layout');
		});

		test('should display custom layout empty state', async ({ page }) => {
			await expect(page.locator('[hlmEmpty]')).toBeVisible();
			await expect(page.locator('[hlmEmptyTitle]').filter({ hasText: /Welcome to your dashboard/ })).not.toHaveCount(0);
			await expect(
				page
					.locator('[hlmEmptyDescription]')
					.filter({ hasText: /This is where you'll see all your important information/ }),
			).not.toHaveCount(0);
		});

		test('should display grid layout buttons', async ({ page }) => {
			await expect(page.locator('button[hlmBtn]')).toHaveCount(2);
			await expect(page.locator('.grid.grid-cols-2')).not.toHaveCount(0);
			await expect(
				page.locator('button[hlmBtn][variant="outline"]').filter({ hasText: /Import Data/ }),
			).not.toHaveCount(0);
			await expect(
				page.locator('button[hlmBtn]:not([variant="outline"])').filter({ hasText: /Create New/ }),
			).not.toHaveCount(0);
		});

		test('should have proper responsive layout', async ({ page }) => {
			await expect(page.locator('.max-w-md')).not.toHaveCount(0);
			await expect(page.locator('.grid-cols-2')).not.toHaveCount(0);
		});
	});

	test.describe('Accessibility', () => {
		test('should be accessible with proper ARIA attributes', async ({ page }) => {
			await gotoStory(page, 'empty--default');
			await expect(page.locator('[hlmEmpty]')).toBeVisible();

			await expect(page.locator('[hlmEmptyTitle]')).not.toBeEmpty();
			await expect(page.locator('[hlmEmptyTitle]').filter({ hasText: /No items found/ })).not.toHaveCount(0);
			await expect(page.locator('[hlmEmptyDescription]')).not.toBeEmpty();
			await expect(
				page.locator('[hlmEmptyDescription]').filter({ hasText: /You don't have any items yet/ }),
			).not.toHaveCount(0);
		});

		test('should support keyboard navigation for interactive elements', async ({ page }) => {
			await gotoStory(page, 'empty--with-action');
			await expect(page.locator('button[hlmBtn]')).toBeVisible();
			await page.locator('button[hlmBtn]').focus();
			await expect(page.locator(':focus')).toHaveAttribute('hlmBtn');
		});
	});
});
