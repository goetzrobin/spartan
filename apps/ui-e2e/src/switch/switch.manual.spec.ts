// Ported by hand from apps/ui-storybook-e2e/src/integration/switch/switch.cy.ts.
// The transform could not convert these tests: they click at the left or right edge of the
// switch, check computed focus styles in an assertion callback, or use `.closest`.
// Titles and describe blocks match the originals so the transform knows they are covered.
// The helpers repeat the ones in switch.spec.ts, which cannot be imported without its tests.
import type { Locator, Page } from '@playwright/test';
import { STORY_ROOT, byText, checkA11y, expect, forceClick, gotoStory, test } from '../support';

/** Checks the page for accessibility violations and that the switch has its accessible name. */
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

/**
 * Cypress's `click('left')` and `click('right')` click the middle of the element's left or right
 * edge. The switch is a pill, and the browser places the outermost pixel of its rounded ends
 * outside the button, where Playwright (rightly) refuses to click because the click would land on
 * the parent. One pixel further in is on the button and still at its far left or right.
 */
async function clickEdge(locator: Locator, edge: 'left' | 'right'): Promise<void> {
	const box = await locator.boundingBox();
	if (!box) throw new Error('The element to click has no box');
	await locator.click({ position: { x: edge === 'left' ? 1 : box.width - 2, y: box.height / 2 } });
}

/** Toggles the switch by clicking on its right side, then back by clicking on its left side. */
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

			// Start with no element focused
			await expect(control).not.toBeFocused();

			// Move focus to the switch using keyboard navigation (how keyboard users would interact)
			await page.keyboard.press('Tab');

			// The switch must have visible focus indicator that meets WCAG requirements.
			// The original checks focus and styles in one retried assertion; so does this.
			await expect(async () => {
				await expect(control).toBeFocused({ timeout: 0 });
				const styles = await control.evaluate((element) => {
					const computed = window.getComputedStyle(element);
					return { outline: computed.outline, boxShadow: computed.boxShadow, borderColor: computed.borderColor };
				});
				const hasOutline = styles.outline !== 'none' && styles.outline !== '';
				const hasBoxShadow = styles.boxShadow !== 'none' && styles.boxShadow !== '';
				const hasBorder = styles.borderColor !== 'transparent';

				// At least one focus indicator should be present
				expect(hasOutline || hasBoxShadow || hasBorder).toBe(true);
			}).toPass();

			// Ensure focus styles disappear when focus moves away
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
			// Verify basic setup still applies to disabled switch
			await verifySwitchSetup(page, labelText);
			await verifySwitchOff(page, labelText);

			// A disabled switch must have proper attributes for screen readers
			await expect(page.getByRole('switch', { name: labelText, exact: true })).toBeDisabled();

			// The hidden input should also have the disabled attribute
			await expect(page.getByLabel(labelText, { exact: true })).toBeDisabled();

			// Clicking should not toggle the switch when disabled (forced, as in the original)
			await forceClick(page.locator('brn-switch').locator('button'));
			await verifySwitchOff(page, labelText);

			// Keyboard users should not be able to focus disabled controls
			// First tab should skip the disabled control and go to next focusable element
			await page.keyboard.press('Tab');
			await expect(page.getByRole('switch', { name: labelText, exact: true })).not.toBeFocused();

			// Label should also indicate the switch is disabled via data-disabled attribute
			await expect(byText(page, labelText).locator('xpath=ancestor-or-self::label[1]')).toHaveAttribute(
				'data-disabled',
				'true',
			);
		});
	});
});
