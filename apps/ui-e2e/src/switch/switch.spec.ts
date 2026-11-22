import type { Page } from '@playwright/test';
import { STORY_ROOT, byText, checkA11y, expect, gotoStory, test } from '../support';

test.describe('brn-switch accessibility and functionality tests', () => {
	const verifySwitchSetup = async (page: Page, labelText: string | RegExp) => {
		await checkA11y(page, STORY_ROOT, {
			rules: {
				'page-has-heading-one': { enabled: false },
				'landmark-one-main': { enabled: false },
			},
		});
		await expect(page.getByRole('switch', { name: labelText, exact: true })).not.toHaveCount(0);

		await expect(page.getByLabel(labelText, { exact: true })).not.toHaveCount(0);
		await expect(page.getByLabel(labelText, { exact: true })).toHaveAttribute('type', 'button');
	};

	const verifySwitchOff = async (page: Page, labelText: string | RegExp) => {
		await expect(page.getByRole('switch', { name: labelText, exact: true })).not.toHaveCount(0);
		await expect(page.getByRole('switch', { name: labelText, exact: true })).toHaveAttribute('aria-checked', 'false');

		await expect(page.getByLabel(labelText, { exact: true })).not.toHaveCount(0);
		await expect(page.getByLabel(labelText, { exact: true })).toHaveAttribute('value', 'off');

		await expect(page.locator('brn-switch').first()).toHaveAttribute('data-state', 'unchecked');
	};

	const verifySwitchOn = async (page: Page, labelText: string | RegExp) => {
		await expect(page.getByRole('switch', { name: labelText, exact: true })).toHaveAttribute('aria-checked', 'true');

		await expect(page.getByLabel(labelText, { exact: true })).not.toHaveCount(0);
		await expect(page.getByLabel(labelText, { exact: true })).toHaveAttribute('value', 'on');

		await expect(page.locator('brn-switch').first()).toHaveAttribute('data-state', 'checked');
	};

	const verifySwitchValueTrue = async (page: Page) => {
		await expect(page.getByTestId('switchValue')).toContainText('true');
	};

	const verifySwitchValueFalse = async (page: Page) => {
		await expect(page.getByTestId('switchValue')).toContainText('false');
	};

	const verifyChangedValueTrue = async (page: Page) => {
		await expect(page.getByTestId('changedValue')).toContainText('true');
	};

	const verifyChangedValueFalse = async (page: Page) => {
		await expect(page.getByTestId('changedValue')).toContainText('false');
	};

	const verifySwitchTouched = async (page: Page) => {
		await expect(page.locator('hlm-switch')).toHaveClass(/(^|\s)ng-touched(\s|$)/);
	};

	const executeTabEnterTests = async (page: Page, labelText: string | RegExp) => {
		await verifySwitchSetup(page, labelText);
		await verifySwitchOff(page, labelText);

		await page.keyboard.press('Tab');
		await page.keyboard.press('Enter');
		await verifySwitchOn(page, labelText);

		await page.keyboard.press('Enter');
		await verifySwitchOff(page, labelText);
	};

	const executeTabSpaceTests = async (page: Page, labelText: string | RegExp) => {
		await verifySwitchSetup(page, labelText);
		await verifySwitchOff(page, labelText);

		await page.keyboard.press('Tab');
		await page.keyboard.press('Space');
		await verifySwitchOn(page, labelText);

		await page.keyboard.press('Space');
		await verifySwitchOff(page, labelText);
	};

	const executeClickOnLabelTests = async (page: Page, labelText: string | RegExp) => {
		await verifySwitchSetup(page, labelText);
		await verifySwitchOff(page, labelText);

		await byText(page, labelText).click();
		await verifySwitchOn(page, labelText);

		await byText(page, labelText).click();
		await verifySwitchOff(page, labelText);
	};

	const executeClickOnThumb = async (page: Page, labelText: string | RegExp) => {
		await verifySwitchSetup(page, labelText);
		await verifySwitchOff(page, labelText);

		await page.getByRole('switch').click();
		await verifySwitchOn(page, labelText);

		await page.getByRole('switch').click();
		await verifySwitchOff(page, labelText);
	};

	test.describe('default', () => {
		const labelText = /Test Switch/i;

		test.beforeEach(async ({ page }) => {
			await gotoStory(page, 'switch--default');
		});

		test('should toggle switch state on thumb click', async ({ page }) => {
			await executeClickOnThumb(page, labelText);
		});

		test('should toggle switch state using [Tab][Enter] keys', async ({ page }) => {
			await executeTabEnterTests(page, labelText);
		});

		test('should toggle switch state using [Tab][Space] keys', async ({ page }) => {
			await executeTabSpaceTests(page, labelText);
		});
	});

	test.describe('inside label', () => {
		const labelText = /Test Switch/i;

		test.beforeEach(async ({ page }) => {
			await gotoStory(page, 'switch--inside-label');
		});

		test('should toggle switch state by clicking on the label', async ({ page }) => {
			await executeClickOnLabelTests(page, labelText);
		});

		test('should toggle switch state on thumb click', async ({ page }) => {
			await executeClickOnThumb(page, labelText);
		});

		test('should toggle switch state using [Tab][Enter] keys', async ({ page }) => {
			await executeTabEnterTests(page, labelText);
		});

		test('should toggle switch state using [Tab][Space] keys', async ({ page }) => {
			await executeTabSpaceTests(page, labelText);
		});
	});

	test.describe('labeled with aria-labelledby', () => {
		const labelText = /Test Switch/i;

		test.beforeEach(async ({ page }) => {
			await gotoStory(page, 'switch--labeled-with-aria-labeled-by');
		});

		test('should toggle switch state by clicking on the label', async ({ page }) => {
			await executeClickOnLabelTests(page, labelText);
		});

		test('should toggle switch state on thumb click', async ({ page }) => {
			await executeClickOnThumb(page, labelText);
		});

		test('should toggle switch state using [Tab][Enter] keys', async ({ page }) => {
			await executeTabEnterTests(page, labelText);
		});

		test('should toggle switch state using [Tab][Space] keys', async ({ page }) => {
			await executeTabSpaceTests(page, labelText);
		});
	});

	test.describe('form integration', () => {
		const labelText = /Test Switch/i;

		test.beforeEach(async ({ page }) => {
			await gotoStory(page, 'switch--form');
		});

		test('should reflect changes in form values and touched state', async ({ page }) => {
			await verifySwitchSetup(page, labelText);
			await verifySwitchOff(page, labelText);

			await page.getByRole('switch').click();
			await verifySwitchOn(page, labelText);
			await verifySwitchValueTrue(page);
			await verifyChangedValueTrue(page);

			await page.locator('brn-switch').locator('button').click();
			await verifySwitchOff(page, labelText);
			await verifySwitchValueFalse(page);
			await verifyChangedValueFalse(page);

			await page.keyboard.press('Tab');
			await page.keyboard.press('Tab');
			await verifySwitchTouched(page);
		});
	});
});
