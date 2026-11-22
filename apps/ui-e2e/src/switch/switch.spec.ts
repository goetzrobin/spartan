import type { Page } from '@playwright/test';
import { STORY_ROOT, byText, checkA11y, expect, gotoStory, test } from '../support';

test.describe('brn-switch accessibility and functionality tests', () => {
	/**
	 * Utility function to verify the initial setup of the switch component.
	 * Ensures that the switch is present and has the correct accessible name.
	 */
	const verifySwitchSetup = async (page: Page, labelText: string | RegExp) => {
		// Check for accessibility violations on the page
		await checkA11y(page, STORY_ROOT, {
			rules: {
				'page-has-heading-one': { enabled: false },
				'landmark-one-main': { enabled: false },
			},
		});
		// Verify that the switch with the specified accessible name exists and has correct role
		await expect(page.getByRole('switch', { name: labelText, exact: true })).not.toHaveCount(0);

		// Verify that button exists and is properly associated
		await expect(page.getByLabel(labelText, { exact: true })).not.toHaveCount(0);
		await expect(page.getByLabel(labelText, { exact: true })).toHaveAttribute('type', 'button');
	};

	/**
	 * Utility function to verify that the switch is in the 'off' state.
	 * Checks both the visual state and the underlying input value.
	 */
	const verifySwitchOff = async (page: Page, labelText: string | RegExp) => {
		// The switch should have aria-checked set to 'false' for screen readers
		await expect(page.getByRole('switch', { name: labelText, exact: true })).not.toHaveCount(0);
		await expect(page.getByRole('switch', { name: labelText, exact: true })).toHaveAttribute('aria-checked', 'false');

		// The hidden input should have value 'off' and not be checked
		await expect(page.getByLabel(labelText, { exact: true })).not.toHaveCount(0);
		await expect(page.getByLabel(labelText, { exact: true })).toHaveAttribute('value', 'off');

		// The component should have data-state attribute set to 'unchecked'
		await expect(page.locator('brn-switch').first()).toHaveAttribute('data-state', 'unchecked');
	};

	/**
	 * Utility function to verify that the switch is in the 'on' state.
	 * Checks both the visual state and the underlying input value.
	 */
	const verifySwitchOn = async (page: Page, labelText: string | RegExp) => {
		// The switch should have aria-checked set to 'true' for screen readers
		await expect(page.getByRole('switch', { name: labelText, exact: true })).toHaveAttribute('aria-checked', 'true');

		// The hidden input should have value 'on' and be checked
		await expect(page.getByLabel(labelText, { exact: true })).not.toHaveCount(0);
		await expect(page.getByLabel(labelText, { exact: true })).toHaveAttribute('value', 'on');

		// The component should have data-state attribute set to 'checked'
		await expect(page.locator('brn-switch').first()).toHaveAttribute('data-state', 'checked');
	};

	/**
	 * Utility function to verify that the switch value is 'true' in the UI.
	 */
	const verifySwitchValueTrue = async (page: Page) => {
		await expect(page.getByTestId('switchValue')).toContainText('true');
	};

	/**
	 * Utility function to verify that the switch value is 'false' in the UI.
	 */
	const verifySwitchValueFalse = async (page: Page) => {
		await expect(page.getByTestId('switchValue')).toContainText('false');
	};

	/**
	 * Utility function to verify that the 'changed' value is 'true' in the UI.
	 */
	const verifyChangedValueTrue = async (page: Page) => {
		await expect(page.getByTestId('changedValue')).toContainText('true');
	};

	/**
	 * Utility function to verify that the 'changed' value is 'false' in the UI.
	 */
	const verifyChangedValueFalse = async (page: Page) => {
		await expect(page.getByTestId('changedValue')).toContainText('false');
	};

	/**
	 * Utility function to verify that the switch has been touched (i.e., interacted with).
	 */
	const verifySwitchTouched = async (page: Page) => {
		await expect(page.locator('hlm-switch')).toHaveClass(/(^|\s)ng-touched(\s|$)/);
	};

	/**
	 * Executes tests for toggling the switch using [Tab] and [Enter] keys.
	 */
	const executeTabEnterTests = async (page: Page, labelText: string | RegExp) => {
		await verifySwitchSetup(page, labelText);
		await verifySwitchOff(page, labelText);

		// Focus on the switch using Tab and toggle using Enter
		await page.keyboard.press('Tab');
		await page.keyboard.press('Enter');
		await verifySwitchOn(page, labelText);

		// Toggle back to 'off' state
		await page.keyboard.press('Enter');
		await verifySwitchOff(page, labelText);
	};

	/**
	 * Executes tests for toggling the switch using [Tab] and [Space] keys.
	 */
	const executeTabSpaceTests = async (page: Page, labelText: string | RegExp) => {
		await verifySwitchSetup(page, labelText);
		await verifySwitchOff(page, labelText);

		// Focus on the switch using Tab and toggle using Space
		await page.keyboard.press('Tab');
		await page.keyboard.press('Space');
		await verifySwitchOn(page, labelText);

		// Toggle back to 'off' state
		await page.keyboard.press('Space');
		await verifySwitchOff(page, labelText);
	};

	/**
	 * Executes tests for toggling the switch by clicking on the associated label.
	 */
	const executeClickOnLabelTests = async (page: Page, labelText: string | RegExp) => {
		await verifySwitchSetup(page, labelText);
		await verifySwitchOff(page, labelText);

		// Click on the label to toggle the switch
		await byText(page, labelText).click();
		await verifySwitchOn(page, labelText);

		// Click again to toggle back to 'off' state
		await byText(page, labelText).click();
		await verifySwitchOff(page, labelText);
	};

	/**
	 * Executes tests for toggling the switch by clicking on the thumb.
	 */
	const executeClickOnThumb = async (page: Page, labelText: string | RegExp) => {
		await verifySwitchSetup(page, labelText);
		await verifySwitchOff(page, labelText);

		// Click on the label to toggle the switch
		await page.getByRole('switch').click();
		await verifySwitchOn(page, labelText);

		// Click again to toggle back to 'off' state
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

			// Click on the switch thumb to toggle
			await page.getByRole('switch').click();
			await verifySwitchOn(page, labelText);
			await verifySwitchValueTrue(page);
			await verifyChangedValueTrue(page);

			// Click on the switch to toggle back
			await page.locator('brn-switch').locator('button').click();
			await verifySwitchOff(page, labelText);
			await verifySwitchValueFalse(page);
			await verifyChangedValueFalse(page);

			// Navigate through form fields to trigger touched state
			await page.keyboard.press('Tab');
			await page.keyboard.press('Tab');
			await verifySwitchTouched(page);
		});
	});
});
