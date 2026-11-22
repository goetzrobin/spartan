import type { Page } from '@playwright/test';
import { caretToEnd, expect, gotoStory, test } from '../support';

const modelIsSet = async (page: Page) => {
	await expect(page.locator('#date-trigger')).not.toHaveAttribute('data-placeholder');
};
const modelIsEmpty = async (page: Page) => {
	await expect(page.locator('#date-trigger')).toHaveAttribute('data-placeholder');
};

const type = async (page: Page, value: string) => {
	const input = page.locator('#date-input');
	if (!(await input.evaluate((element) => element === document.activeElement))) {
		await input.click();
		await caretToEnd(input);
	}
	const enter = value.endsWith('{enter}');
	const text = enter ? value.slice(0, -'{enter}'.length) : value;
	await input.pressSequentially(text);
	if (enter) await input.press('Enter');
};
const blurInput = async (page: Page) => {
	await page.locator('#date-input').blur();
};

const typeNineAtStart = async (page: Page) => {
	const input = page.locator('#date-input');
	await input.evaluate((element: HTMLInputElement) => element.setSelectionRange(0, 0));
	await input.pressSequentially('9');
};
const selectionStart = (page: Page) =>
	page.locator('#date-input').evaluate((element: HTMLInputElement) => element.selectionStart);

const dayCell = (page: Page, day: string) =>
	page.locator('[brnCalendarCellButton]:not([data-outside])').filter({ hasText: new RegExp(`^\\s*${day}\\s*$`) });

const monthTrigger = (page: Page) => page.locator('hlm-calendar [brnCalendarMonthSelect] [data-slot="select-trigger"]');
const daysInMonth = (page: Page) => page.locator('hlm-calendar [brnCalendarCellButton]:not([data-outside])');

test.describe('date picker', () => {
	test.describe('single - trigger', () => {
		test.beforeEach(async ({ page }) => {
			await gotoStory(page, 'date-picker--default');
		});

		test('opens the calendar and selects a date', async ({ page }) => {
			await expect(page.locator('#date')).toHaveAttribute('data-placeholder');
			await page.locator('#date').click();
			await expect(page.locator('hlm-calendar')).not.toHaveCount(0);

			await dayCell(page, '15').first().click();

			await expect(page.locator('#date')).not.toHaveAttribute('data-placeholder');
		});
	});

	test.describe('single - trigger - navigating from a month-end date', () => {
		test.beforeEach(async ({ page }) => {
			await gotoStory(page, 'date-picker--preselected-end-of-month');
		});

		test('keeps the focused month when navigating to a shorter month via the dropdown', async ({ page }) => {
			await expect(page.locator('#date')).not.toHaveAttribute('data-placeholder');
			await page.locator('#date').click();
			await expect(page.locator('hlm-calendar')).not.toHaveCount(0);

			await expect(monthTrigger(page).filter({ hasText: /Aug/ })).not.toHaveCount(0);
			await expect(daysInMonth(page)).toHaveCount(31);

			await monthTrigger(page).click();
			await page.locator('hlm-select-content').locator('hlm-select-item').getByText(/Nov/).first().click();

			await expect(monthTrigger(page).filter({ hasText: /Nov/ })).not.toHaveCount(0);
			await expect(daysInMonth(page)).toHaveCount(30);
			await expect(daysInMonth(page).filter({ hasText: /^\s*30\s*$/ })).not.toHaveCount(0);
		});
	});

	test.describe('single - trigger - navigating to a month whose same day is before min', () => {
		test.beforeEach(async ({ page }) => {
			await gotoStory(page, 'date-picker--preselected-with-min-date');
		});

		test('shows the picked month and focuses the min date instead of staying on the old month', async ({ page }) => {
			await page.locator('#date').click();
			await expect(page.locator('hlm-calendar')).not.toHaveCount(0);

			await monthTrigger(page).click();
			await page.locator('hlm-select-content').locator('hlm-select-item').getByText(/Aug/).first().click();

			await expect(monthTrigger(page).filter({ hasText: /Aug/ })).not.toHaveCount(0);
			await expect(daysInMonth(page)).toHaveCount(31);
			await expect
				.poll(() =>
					page.locator('hlm-calendar [brnCalendarCellButton][tabindex="0"]').evaluateAll((elements) =>
						elements
							.map((element) => element.textContent ?? '')
							.join('')
							.trim(),
					),
				)
				.toBe('22');
		});
	});

	test.describe('single - input', () => {
		test.beforeEach(async ({ page }) => {
			await gotoStory(page, 'date-picker--input');
		});

		test('keeps the caret position while editing in the middle', async ({ page }) => {
			await type(page, '15/06/2024');
			await typeNineAtStart(page);
			await expect(page.locator('#date-input')).toHaveValue('915/06/2024');
			expect(await selectionStart(page)).toBe(1);
		});

		test('commits a typed date on blur and shows the display format', async ({ page }) => {
			await type(page, '15/06/2024');
			await blurInput(page);
			await expect(page.locator('#date-input')).toHaveValue('Sat Jun 15 2024');
			await modelIsSet(page);
		});

		test('commits on Enter and keeps focus, then blur shows the display format', async ({ page }) => {
			await page.locator('#date-input').focus();
			await page.locator('#date-input').press('ArrowDown');
			await expect(page.locator('hlm-calendar')).not.toHaveCount(0);
			await type(page, '15/06/2024{enter}');
			await expect(page.locator('hlm-calendar')).toHaveCount(0);
			await expect(page.locator('#date-input')).toHaveValue('15/06/2024');
			await modelIsSet(page);
			await blurInput(page);
			await expect(page.locator('#date-input')).toHaveValue('Sat Jun 15 2024');
			await modelIsSet(page);
		});

		test('keeps the value when blurring after Enter (regression)', async ({ page }) => {
			await type(page, '15/06/2024{enter}');
			await expect(page.locator('#date-input')).toHaveValue('15/06/2024');
			await blurInput(page);
			await expect(page.locator('#date-input')).toHaveValue('Sat Jun 15 2024');
			await modelIsSet(page);
		});

		test('clears the value with the clear button', async ({ page }) => {
			await type(page, '15/06/2024');
			await blurInput(page);
			await modelIsSet(page);
			await page.locator('button[aria-label="Clear date"]').click();
			await expect(page.locator('#date-input')).toHaveValue('');
			await modelIsEmpty(page);
		});

		test('keeps invalid text but leaves the model empty', async ({ page }) => {
			await type(page, 'not a date');
			await blurInput(page);
			await expect(page.locator('#date-input')).toHaveValue('not a date');
			await modelIsEmpty(page);
		});
	});

	test.describe('multi - trigger', () => {
		test.beforeEach(async ({ page }) => {
			await gotoStory(page, 'date-picker-multi--default');
		});

		test('opens the calendar and selects a date', async ({ page }) => {
			await page.locator('#date').click();
			await expect(page.locator('hlm-calendar-multi')).not.toHaveCount(0);
			await dayCell(page, '15').first().click();
			await expect(page.locator('#date')).not.toHaveAttribute('data-placeholder');
		});
	});

	test.describe('multi - input', () => {
		test.beforeEach(async ({ page }) => {
			await gotoStory(page, 'date-picker-multi--input');
		});

		test('keeps the caret position while editing in the middle', async ({ page }) => {
			await type(page, '15/06/2024');
			await typeNineAtStart(page);
			await expect(page.locator('#date-input')).toHaveValue('915/06/2024');
			expect(await selectionStart(page)).toBe(1);
		});

		test('commits typed dates on blur and shows the display format', async ({ page }) => {
			await type(page, '15/06/2024');
			await blurInput(page);
			await expect(page.locator('#date-input')).toHaveValue('Sat Jun 15 2024');
			await modelIsSet(page);
		});

		test('keeps the value when blurring after Enter (regression)', async ({ page }) => {
			await type(page, '15/06/2024{enter}');
			await expect(page.locator('#date-input')).toHaveValue('15/06/2024');
			await blurInput(page);
			await expect(page.locator('#date-input')).toHaveValue('Sat Jun 15 2024');
			await modelIsSet(page);
		});

		test('keeps invalid text but leaves the model empty', async ({ page }) => {
			await type(page, 'not a date');
			await blurInput(page);
			await expect(page.locator('#date-input')).toHaveValue('not a date');
			await modelIsEmpty(page);
		});
	});

	test.describe('range - trigger', () => {
		test.beforeEach(async ({ page }) => {
			await gotoStory(page, 'date-range-picker--default');
		});

		test('opens the calendar and selects a range', async ({ page }) => {
			await page.locator('#date').click();
			await expect(page.locator('hlm-calendar-range')).not.toHaveCount(0);

			await dayCell(page, '15').first().click();
			await dayCell(page, '20').first().click();

			await expect(page.locator('#date')).not.toHaveAttribute('data-placeholder');
		});
	});

	test.describe('range - input', () => {
		test.beforeEach(async ({ page }) => {
			await gotoStory(page, 'date-range-picker--input');
		});

		test('keeps the caret position while editing in the middle', async ({ page }) => {
			await type(page, '15/06/2024 - 20/06/2024');
			await typeNineAtStart(page);
			await expect(page.locator('#date-input')).toHaveValue('915/06/2024 - 20/06/2024');
			expect(await selectionStart(page)).toBe(1);
		});

		test('commits a typed range on blur and shows the display format', async ({ page }) => {
			await type(page, '15/06/2024 - 20/06/2024');
			await blurInput(page);
			await expect(page.locator('#date-input')).toHaveValue('Sat Jun 15 2024 to Thu Jun 20 2024');
			await modelIsSet(page);
		});

		test('keeps the value when blurring after Enter (regression)', async ({ page }) => {
			await type(page, '15/06/2024 - 20/06/2024{enter}');
			await expect(page.locator('#date-input')).toHaveValue('15/06/2024 - 20/06/2024');
			await blurInput(page);
			await expect(page.locator('#date-input')).toHaveValue('Sat Jun 15 2024 to Thu Jun 20 2024');
			await modelIsSet(page);
		});

		test('keeps invalid text but leaves the model empty', async ({ page }) => {
			await type(page, 'not a range');
			await blurInput(page);
			await expect(page.locator('#date-input')).toHaveValue('not a range');
			await modelIsEmpty(page);
		});
	});

	test.describe('month-year - input', () => {
		test.beforeEach(async ({ page }) => {
			await gotoStory(page, 'month-year-picker--input');
		});

		test('keeps the caret position while editing in the middle', async ({ page }) => {
			await type(page, '06/2024');
			await typeNineAtStart(page);
			await expect(page.locator('#date-input')).toHaveValue('906/2024');
			expect(await selectionStart(page)).toBe(1);
		});

		test('commits a typed month/year on blur and shows the display format', async ({ page }) => {
			await type(page, '06/2024');
			await blurInput(page);
			await expect(page.locator('#date-input')).toHaveValue('06.2024');
			await modelIsSet(page);
		});

		test('keeps the value when blurring after Enter (regression)', async ({ page }) => {
			await type(page, '06/2024{enter}');
			await expect(page.locator('#date-input')).toHaveValue('06/2024');
			await blurInput(page);
			await expect(page.locator('#date-input')).toHaveValue('06.2024');
			await modelIsSet(page);
		});

		test('keeps invalid text but leaves the model empty', async ({ page }) => {
			await type(page, '13/2024');
			await blurInput(page);
			await expect(page.locator('#date-input')).toHaveValue('13/2024');
			await modelIsEmpty(page);
		});
	});
});
