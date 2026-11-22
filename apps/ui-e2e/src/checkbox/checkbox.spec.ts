import type { Page } from '@playwright/test';
import { STORY_ROOT, byText, checkA11y, expect, gotoStory, test } from '../support';

test.describe('checkbox', () => {
	const verifyCheckboxSetup = async (page: Page, id: string) => {
		await checkA11y(page, STORY_ROOT, {
			rules: {
				'page-has-heading-one': { enabled: false },
				'landmark-one-main': { enabled: false },
			},
		});
		await expect(page.getByRole('checkbox')).not.toHaveCount(0);
		await expect(page.getByRole('checkbox')).toHaveAttribute('type', 'button');
		await expect(page.getByRole('checkbox')).toHaveId(id);
	};

	const verifyCheckboxOff = async (page: Page) => {
		await expect(page.getByLabel(/test checkbox/i)).toHaveAttribute('aria-checked', 'false');
		await expect(page.locator('brn-checkbox').first()).toHaveAttribute('data-state', 'unchecked');
		await expect(page.getByRole('checkbox')).toHaveAttribute('aria-checked', 'false');
	};

	const verifyCheckboxOn = async (page: Page) => {
		await expect(page.getByLabel(/test checkbox/i)).toHaveAttribute('aria-checked', 'true');
		await expect(page.locator('brn-checkbox').first()).toHaveAttribute('data-state', 'checked');
		await expect(page.getByRole('checkbox')).toHaveAttribute('aria-checked', 'true');
	};

	const verifyIndeterminateAttr = async (page: Page) => {
		await expect(page.locator('brn-checkbox').first()).toHaveAttribute('data-state', 'indeterminate');
		await expect(page.getByRole('checkbox')).toHaveAttribute('aria-checked', 'mixed');
	};

	const executeTabEnterTests = async (page: Page, id: string) => {
		await verifyCheckboxSetup(page, id);
		await verifyCheckboxOff(page);

		await page.keyboard.press('Tab');
		await page.keyboard.press('Enter');
		await verifyCheckboxOn(page);

		await page.keyboard.press('Enter');
		await verifyCheckboxOff(page);
	};

	const executeTabSpaceTests = async (page: Page, id: string) => {
		await verifyCheckboxSetup(page, id);
		await verifyCheckboxOff(page);

		await page.keyboard.press('Tab');
		await page.keyboard.press('Space');
		await verifyCheckboxOn(page);

		await page.keyboard.press('Space');
		await verifyCheckboxOff(page);
	};

	const executeClickOnLabelTests = async (page: Page, id: string) => {
		await verifyCheckboxSetup(page, id);
		await verifyCheckboxOff(page);

		await byText(page, /test checkbox/i).click();
		await verifyCheckboxOn(page);

		await byText(page, /test checkbox/i).click();
		await verifyCheckboxOff(page);
	};

	test.describe('default', () => {
		test.beforeEach(async ({ page }) => {
			await gotoStory(page, 'checkbox--default');
		});

		test('click interactions should render as unchecked, become checked on label click, become unchecked on checkbox click', async ({
			page,
		}) => {
			await verifyCheckboxSetup(page, 'testCheckbox');
			await verifyCheckboxOff(page);

			await page.getByLabel(/test checkbox/i).click();
			await verifyCheckboxOn(page);

			await page.locator('brn-checkbox').locator('button').click();
			await verifyCheckboxOff(page);
		});

		test('[Tab][Enter] interactions should render as unchecked, become checked when pressing enter, become unchecked when pressing enter again', async ({
			page,
		}) => {
			await executeTabEnterTests(page, 'testCheckbox');
		});

		test('[Tab][Space] interactions should render as unchecked, become checked when pressing space, become unchecked when pressing enter space', async ({
			page,
		}) => {
			await executeTabSpaceTests(page, 'testCheckbox');
		});
	});

	test.describe('inside label', () => {
		test.beforeEach(async ({ page }) => {
			await gotoStory(page, 'checkbox--inside-label');
		});

		test('click interactions should render as unchecked, become checked on label click, become unchecked on checkbox click', async ({
			page,
		}) => {
			await executeClickOnLabelTests(page, 'testCheckbox');
		});

		test('[Tab][Enter] interactions should render as unchecked, become checked when pressing enter, become unchecked when pressing enter again', async ({
			page,
		}) => {
			await executeTabEnterTests(page, 'testCheckbox');
		});

		test('[Tab][Space] interactions should render as unchecked, become checked when pressing space, become unchecked when pressing enter space', async ({
			page,
		}) => {
			await executeTabSpaceTests(page, 'testCheckbox');
		});
	});

	test.describe('labeled with aria-labelledby', () => {
		test.beforeEach(async ({ page }) => {
			await gotoStory(page, 'checkbox--labeled-with-aria-labeled-by');
		});

		test('click interactions should render as unchecked, become checked on label click, become unchecked on checkbox click', async ({
			page,
		}) => {
			await executeClickOnLabelTests(page, 'testCheckboxAria');
		});

		test('[Tab][Enter] interactions should render as unchecked, become checked when pressing enter, become unchecked when pressing enter again', async ({
			page,
		}) => {
			await executeTabEnterTests(page, 'testCheckboxAria');
		});

		test('[Tab][Space] interactions should render as unchecked, become checked when pressing space, become unchecked when pressing enter space', async ({
			page,
		}) => {
			await executeTabSpaceTests(page, 'testCheckboxAria');
		});
	});

	test.describe('indeterminate', () => {
		test.beforeEach(async ({ page }) => {
			await gotoStory(page, 'checkbox--indeterminate');
		});

		test('click interactions should render as indeterminate, become checked on label click, become unchecked on checkbox click', async ({
			page,
		}) => {
			await verifyCheckboxSetup(page, 'testCheckboxIndeterminate');
			await verifyIndeterminateAttr(page);

			await byText(page, /test checkbox/i).click();
			await verifyCheckboxOn(page);

			await byText(page, /test checkbox/i).click();
			await verifyCheckboxOff(page);
		});

		test('[Tab][Enter] interactions should render as indeterminate, become checked when pressing enter, become unchecked when pressing enter again', async ({
			page,
		}) => {
			await verifyCheckboxSetup(page, 'testCheckboxIndeterminate');
			await verifyIndeterminateAttr(page);

			await page.keyboard.press('Tab');
			await page.keyboard.press('Enter');
			await verifyCheckboxOn(page);

			await page.keyboard.press('Enter');
			await verifyCheckboxOff(page);
		});

		test('[Tab][Space] interactions should render as indeterminate, become checked when pressing space, become unchecked when pressing enter space', async ({
			page,
		}) => {
			await verifyCheckboxSetup(page, 'testCheckboxIndeterminate');
			await verifyIndeterminateAttr(page);

			await page.keyboard.press('Tab');
			await page.keyboard.press('Space');
			await verifyCheckboxOn(page);

			await page.keyboard.press('Space');
			await verifyCheckboxOff(page);
		});
	});
});
