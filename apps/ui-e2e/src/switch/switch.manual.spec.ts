import type { Locator, Page } from '@playwright/test';
import { STORY_ROOT, byText, checkA11y, expect, forceClick, gotoStory, test } from '../support';

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

// The outermost pixel of a pill's rounded end is outside the button, and Playwright refuses to click there.
async function clickEdge(locator: Locator, edge: 'left' | 'right'): Promise<void> {
	const box = await locator.boundingBox();
	if (!box) throw new Error('The element to click has no box');
	await locator.click({ position: { x: edge === 'left' ? 1 : box.width - 2, y: box.height / 2 } });
}

const executeClickOnComponent = async (page: Page, labelText: string | RegExp) => {
	await verifySwitchSetup(page, labelText);
	await verifySwitchOff(page, labelText);

	await clickEdge(page.locator('brn-switch').locator('button'), 'right');
	await verifySwitchOn(page, labelText);

	await clickEdge(page.locator('brn-switch').locator('button'), 'left');
	await verifySwitchOff(page, labelText);
};

test.describe('brn-switch accessibility and functionality tests', () => {
	test.describe('default', () => {
		const labelText = /Test Switch/i;

		test.beforeEach(async ({ page }) => {
			await gotoStory(page, 'switch--default');
		});

		test('should toggle switch state on component click', async ({ page }) => {
			await executeClickOnComponent(page, labelText);
		});

		test('should show visible focus indication for keyboard users', async ({ page }) => {
			const labelText = /Test Switch/i;
			const control = page.getByRole('switch', { name: labelText, exact: true });

			await expect(control).not.toBeFocused();

			await page.keyboard.press('Tab');

			await expect(async () => {
				await expect(control).toBeFocused({ timeout: 0 });
				const styles = await control.evaluate((element) => {
					const computed = window.getComputedStyle(element);
					return { outline: computed.outline, boxShadow: computed.boxShadow, borderColor: computed.borderColor };
				});
				const hasOutline = styles.outline !== 'none' && styles.outline !== '';
				const hasBoxShadow = styles.boxShadow !== 'none' && styles.boxShadow !== '';
				const hasBorder = styles.borderColor !== 'transparent';

				expect(hasOutline || hasBoxShadow || hasBorder).toBe(true);
			}).toPass();

			await page.keyboard.press('Tab');
			await expect(control).not.toBeFocused();
		});
	});

	test.describe('inside label', () => {
		const labelText = /Test Switch/i;

		test.beforeEach(async ({ page }) => {
			await gotoStory(page, 'switch--inside-label');
		});

		test('should toggle switch state on component click', async ({ page }) => {
			await executeClickOnComponent(page, labelText);
		});
	});

	test.describe('labeled with aria-labelledby', () => {
		const labelText = /Test Switch/i;

		test.beforeEach(async ({ page }) => {
			await gotoStory(page, 'switch--labeled-with-aria-labeled-by');
		});

		test('should toggle switch state on component click', async ({ page }) => {
			await executeClickOnComponent(page, labelText);
		});
	});

	test.describe('disabled switch', () => {
		const labelText = /Disabled Switch/i;

		test.beforeEach(async ({ page }) => {
			await gotoStory(page, 'switch--disabled');
		});

		test('should not be interactive when disabled', async ({ page }) => {
			await verifySwitchSetup(page, labelText);
			await verifySwitchOff(page, labelText);

			await expect(page.getByRole('switch', { name: labelText, exact: true })).toBeDisabled();

			await expect(page.getByLabel(labelText, { exact: true })).toBeDisabled();

			await forceClick(page.locator('brn-switch').locator('button'));
			await verifySwitchOff(page, labelText);

			await page.keyboard.press('Tab');
			await expect(page.getByRole('switch', { name: labelText, exact: true })).not.toBeFocused();

			await expect(byText(page, labelText).locator('xpath=ancestor-or-self::label[1]')).toHaveAttribute(
				'data-disabled',
				'true',
			);
		});
	});
});
