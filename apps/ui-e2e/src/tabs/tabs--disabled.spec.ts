import type { Page } from '@playwright/test';
import { expect, gotoStory, test } from '../support';

test.describe('tabs--disabled', () => {
	const verifyTabsSetup = async (page: Page) => {
		await expect(page.getByRole('tablist')).not.toHaveCount(0);
		await expect(page.getByRole('tablist')).toHaveAttribute('aria-label');
		await expect(page.getByRole('tablist')).toHaveAttribute('data-orientation', 'horizontal');
		await expect(page.getByRole('tablist')).toHaveAttribute('aria-orientation', 'horizontal');
		await expect(page.getByRole('tab')).toHaveCount(2);
		await expect(page.getByRole('tab', { name: /account/i })).toHaveAttribute(
			'aria-controls',
			'brn-tabs-content-account',
		);
		await expect(page.getByRole('tab', { name: /password/i })).toHaveAttribute(
			'aria-controls',
			'brn-tabs-content-password',
		);
	};

	test.describe('default', () => {
		test.beforeEach(async ({ page }) => {
			await gotoStory(page, 'tabs--disabled');
		});

		test('click interactions should render with first tab selected and change to second tab when second tab is clicked', async ({
			page,
		}) => {
			await verifyTabsSetup(page);

			await page.getByRole('switch').click();

			await page.getByRole('tab', { name: /password/i }).click();

			await expect(page.getByRole('tab', { name: /password/i })).toHaveAttribute('aria-selected', 'true');
			await expect(page.getByRole('tab', { name: /account/i })).toHaveAttribute('aria-selected', 'false');

			await page.getByRole('tab', { name: /account/i }).click();

			await expect(page.getByRole('tab', { name: /account/i })).toHaveAttribute('aria-selected', 'true');
			await expect(page.getByRole('tab', { name: /password/i })).toHaveAttribute('aria-selected', 'false');
		});

		test('should default to disabled with aria tags', async ({ page }) => {
			await verifyTabsSetup(page);
			await expect(page.getByRole('tab', { name: /account/i })).toBeDisabled();
			await expect(page.getByRole('tab', { name: /account/i })).toHaveAttribute('aria-disabled', 'true');
			await expect(page.getByRole('tab', { name: /password/i })).toBeDisabled();
			await expect(page.getByRole('tab', { name: /password/i })).toHaveAttribute('aria-disabled', 'true');
		});

		test('should toggle to active with no disabled attributes or classes', async ({ page }) => {
			await verifyTabsSetup(page);

			await page.getByRole('switch').click();
			await expect(page.getByRole('tab', { name: /account/i })).not.toBeDisabled();
			await expect(page.getByRole('tab', { name: /account/i })).toHaveAttribute('aria-disabled', 'false');
			await expect(page.getByRole('tab', { name: /password/i })).not.toBeDisabled();
			await expect(page.getByRole('tab', { name: /password/i })).toHaveAttribute('aria-disabled', 'false');

			await page.getByRole('tab', { name: /password/i }).click();
			await expect(page.getByRole('tab', { name: /password/i })).toHaveAttribute('aria-selected', 'true');
			await expect(page.getByRole('tab', { name: /account/i })).toHaveAttribute('aria-selected', 'false');
		});
	});
});
