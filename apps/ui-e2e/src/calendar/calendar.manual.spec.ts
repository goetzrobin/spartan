// Ported by hand from apps/ui-storybook-e2e/src/integration/calendar/calendar.cy.ts.
// The originals pick a day cell with a `.filter` callback (the cell's trimmed text, and not a day
// from another month) and keep it under an alias, which the transform cannot convert. Titles match
// the originals so the transform leaves them out of calendar.spec.ts.
import type { Page } from '@playwright/test';
import { expect, gotoStory, test } from '../support';

/** The day cell whose trimmed text is `day` and that has no `data-outside` attribute. */
const dayCell = (page: Page, day: string) =>
	page.locator('[brnCalendarCellButton]:not([data-outside])').filter({ hasText: new RegExp(`^\\s*${day}\\s*$`) });

test.describe('calendar', () => {
	test.describe('default', () => {
		test.beforeEach(async ({ page }) => {
			await gotoStory(page, 'calendar--default');
		});

		test('should select the date', async ({ page }) => {
			const dateButton = dayCell(page, '1');
			await expect(dateButton.first()).toHaveAttribute('aria-selected', 'true');
			await expect(dateButton.first()).toHaveAttribute('data-selected-single', 'true');
		});

		test('should select a date when clicked', async ({ page }) => {
			const dateButton = dayCell(page, '5');

			await dateButton.click();
			await expect(dateButton.first()).toHaveAttribute('aria-selected', 'true');
		});

		test('should select the date when the enter key is pressed', async ({ page }) => {
			const dateButton = dayCell(page, '5');

			await dateButton.focus();
			await dateButton.press('Enter');
			await expect(dateButton.first()).toHaveAttribute('aria-selected', 'true');
		});

		test('should allow keyboard navigation on arrow right', async ({ page }) => {
			const dateButton = dayCell(page, '1');

			await dateButton.focus();
			await dateButton.dispatchEvent('keydown', { key: 'ArrowRight' });
			await expect(dayCell(page, '2')).toBeFocused();
		});

		test('should allow keyboard navigation on arrow left', async ({ page }) => {
			const dateButton = dayCell(page, '1');

			await dateButton.focus();
			await dateButton.dispatchEvent('keydown', { key: 'ArrowLeft' });
			await expect(dayCell(page, '31')).toBeFocused();
		});

		test('should allow keyboard navigation on arrow up', async ({ page }) => {
			const dateButton = dayCell(page, '1');

			await dateButton.focus();
			await dateButton.dispatchEvent('keydown', { key: 'ArrowUp' });
			await expect(dayCell(page, '25')).toBeFocused();
		});

		test('should allow keyboard navigation on arrow down', async ({ page }) => {
			const dateButton = dayCell(page, '1');

			await dateButton.focus();
			await dateButton.dispatchEvent('keydown', { key: 'ArrowDown' });
			await expect(dayCell(page, '8')).toBeFocused();
		});

		test('should allow keyboard navigation on home and end', async ({ page }) => {
			const dateButton = dayCell(page, '1');

			await dateButton.focus();
			await dateButton.dispatchEvent('keydown', { key: 'End' });
			await expect(dayCell(page, '30')).toBeFocused();

			await dateButton.focus();
			await dateButton.dispatchEvent('keydown', { key: 'Home' });
			await expect(dayCell(page, '1')).toBeFocused();
		});
	});
});
