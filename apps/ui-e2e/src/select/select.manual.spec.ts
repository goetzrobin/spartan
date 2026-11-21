// Ported by hand from apps/ui-storybook-e2e/src/integration/select/select.cy.ts.
// These tests share the helper verifySelectSetup, which loops over the option groups, and some
// read an option's value in the middle of the test. The transform cannot convert either, so they
// are written out here. Titles match the originals so the transform leaves them out of
// select.spec.ts.
import type { Locator, Page } from '@playwright/test';
import { expect, forceClick, gotoStory, test } from '../support';

/** Reads an attribute once, as Cypress's `.then(($el) => $el.attr(name))` does. */
async function attribute(locator: Locator, name: string): Promise<string> {
	const value = await locator.getAttribute(name);
	if (value === null) throw new Error(`Expected the element to have the attribute ${name}`);
	return value;
}

/** Cypress's `contains(text, { matchCase: false })`. */
function caseless(text: string): RegExp {
	return new RegExp(text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
}

async function verifySelectSetup(page: Page, { disabled = false, groups = false } = {}): Promise<void> {
	const trigger = page.locator('[brnselecttrigger]');

	// Trigger
	await expect(trigger.first()).toHaveId('hlm-select-trigger-0');
	await expect(trigger.first()).toHaveAttribute('role', 'combobox');
	await expect(trigger.first()).toHaveAttribute('aria-haspopup', 'listbox');
	await expect(trigger.first()).toHaveAttribute('aria-expanded', 'false');

	if (!disabled) {
		// Open select
		await trigger.click();

		// Listbox
		await expect(page.locator('hlm-select-content>div').first()).toHaveAttribute('role', 'listbox');

		// Item
		const item = page.locator('hlm-select-item').first();
		await expect(item).toHaveAttribute('role', 'option');
		await expect(item).toHaveAttribute('aria-selected', 'false');
		await expect(item).toHaveAttribute('aria-disabled', 'false');

		if (groups) {
			// validate groups and labels
			const group = page.locator('hlm-select-group');
			await expect(group).not.toHaveCount(0);
			const count = await group.count();
			for (let index = 0; index < count; index++) {
				await expect(group.nth(index)).toHaveAttribute('role', 'group');
				const labelId = await attribute(group.nth(index).locator('hlm-select-label').first(), 'id');
				await expect(group.nth(index)).toHaveAttribute('aria-labelledby', labelId);
			}
		}

		// close select
		await page.locator('body').click();
		await expect(trigger).toBeFocused();
		await expect(trigger.first()).toHaveAttribute('aria-expanded', 'false');
	}
}

test.describe('select', () => {
	test.describe('default', () => {
		test.beforeEach(async ({ page }) => {
			await gotoStory(page, 'select--default');
		});

		test('click on trigger should open and close it content', async ({ page }) => {
			await verifySelectSetup(page);
			await page.locator('[brnselecttrigger]').click();
			await expect(page.locator('[brnselecttrigger]').first()).toHaveAttribute('aria-expanded', 'true');
			await page.locator('body').click();
			await expect(page.locator('[brnselecttrigger]').first()).toHaveAttribute('aria-expanded', 'false');
		});

		test('click outside should close the content', async ({ page }) => {
			await verifySelectSetup(page);
			await page.locator('[brnselecttrigger]').click();
			await expect(page.locator('[brnselecttrigger]').first()).toHaveAttribute('aria-expanded', 'true');
			await page.locator('body').click();
			await expect(page.locator('[brnselecttrigger]').first()).toHaveAttribute('aria-expanded', 'false');
		});

		test('second click on trigger should close the content', async ({ page }) => {
			await verifySelectSetup(page);
			await page.locator('[brnselecttrigger]').click();
			await expect(page.locator('[brnselecttrigger]').first()).toHaveAttribute('aria-expanded', 'true');
			await page.locator('[brnselecttrigger]').click();
			await expect(page.locator('[brnselecttrigger]').first()).toHaveAttribute('aria-expanded', 'false');
		});

		test('should close after selecting an option in single mode', async ({ page }) => {
			await verifySelectSetup(page);
			await page.locator('[brnselecttrigger]').click();

			const optionValue = await attribute(page.locator('hlm-select-item').nth(0), 'value');
			await page.locator('hlm-select-item').nth(0).click();
			await expect(page.locator('hlm-select-content')).toHaveCount(0);
			await expect(page.locator('[brnselecttrigger]').first()).toHaveAttribute('aria-expanded', 'false');
			await expect(page.locator('hlm-select-value').filter({ hasText: caseless(optionValue) })).not.toHaveCount(0);
		});
	});

	test.describe('multiple', () => {
		// The original file has this test twice under the same title, the second closing the panel
		// with the trigger instead of a click outside. Playwright needs distinct titles, so the
		// second is numbered as the transform numbers it.
		test('should stay open after selecting an option in multi mode', async ({ page }) => {
			await gotoStory(page, 'select--multiple');
			await verifySelectSetup(page);
			await page.locator('[brnselecttrigger]').click();
			await expect(page.locator('hlm-select-content')).not.toHaveCount(0);
			await page.locator('hlm-select-item').nth(0).click();
			await expect(page.locator('hlm-select-content')).not.toHaveCount(0);

			const optionValue = await attribute(page.locator('hlm-select-item').nth(0), 'value');
			await page.locator('hlm-select-item').nth(1).click();
			const optionValue2 = await attribute(page.locator('hlm-select-item').nth(1), 'value');
			await expect(page.locator('hlm-select-trigger').filter({ hasText: caseless(optionValue) })).not.toHaveCount(0);
			await expect(page.locator('hlm-select-trigger').filter({ hasText: caseless(optionValue2) })).not.toHaveCount(0);

			await page.locator('body').click();
			await expect(page.locator('hlm-select-content')).toHaveCount(0);
			await expect(page.locator('[brnselecttrigger]').first()).toHaveAttribute('aria-expanded', 'false');
		});

		test('should stay open after selecting an option in multi mode (2)', async ({ page }) => {
			await gotoStory(page, 'select--multiple');
			await verifySelectSetup(page);
			await page.locator('[brnselecttrigger]').click();
			await expect(page.locator('hlm-select-content')).not.toHaveCount(0);
			await page.locator('hlm-select-item').nth(0).click();
			await expect(page.locator('hlm-select-content')).not.toHaveCount(0);

			const optionValue = await attribute(page.locator('hlm-select-item').nth(0), 'value');
			await page.locator('hlm-select-item').nth(1).click();
			const optionValue2 = await attribute(page.locator('hlm-select-item').nth(1), 'value');
			await expect(page.locator('hlm-select-trigger').filter({ hasText: caseless(optionValue) })).not.toHaveCount(0);
			await expect(page.locator('hlm-select-trigger').filter({ hasText: caseless(optionValue2) })).not.toHaveCount(0);

			await page.locator('[brnselecttrigger]').click();
			await expect(page.locator('hlm-select-content')).toHaveCount(0);
			await expect(page.locator('[brnselecttrigger]').first()).toHaveAttribute('aria-expanded', 'false');
		});

		test('should toggle an item on keypress', async ({ page }) => {
			await gotoStory(page, 'select--multiple');
			await verifySelectSetup(page);
			await page.locator('[brnselecttrigger]').click();

			// select the first item (realType sends the key to whatever has focus, as here)
			await expect(page.locator('hlm-select-item').nth(0)).toBeAttached();
			await page.keyboard.press('Enter');
			await expect(page.locator('hlm-select-item').nth(0)).toHaveAttribute('aria-selected', 'true');

			await expect(page.locator('hlm-select-trigger').filter({ hasText: /Apple/i })).not.toHaveCount(0);

			// deselect the first item
			await expect(page.locator('hlm-select-item').nth(0)).toBeAttached();
			await page.keyboard.press('Enter');

			// check if the first item is deselected
			await expect(page.locator('hlm-select-item').nth(0)).toHaveAttribute('aria-selected', 'false');

			await expect(page.locator('hlm-select-trigger')).not.toContainText('Apple');
		});
	});

	test.describe('disabled', () => {
		test.beforeEach(async ({ page }) => {
			await gotoStory(page, 'select--default', { args: 'disabled:true' });
		});

		test('should not open if disabled', async ({ page }) => {
			await verifySelectSetup(page, { disabled: true });
			await expect(page.locator('[brnselecttrigger]')).toBeDisabled();
			await forceClick(page.locator('hlm-select-trigger'));
			await expect(page.locator('hlm-select-content')).toHaveCount(0);
		});
	});

	test.describe('scrollable', () => {
		test.beforeEach(async ({ page }) => {
			await gotoStory(page, 'select--scrollable');
		});

		/** cypress-real-events' realMouseWheel: a real wheel event at the centre of the element. */
		const wheel = async (page: Page, deltaY: number) => {
			const content = page.locator('hlm-select-content');
			await content.scrollIntoViewIfNeeded();
			const box = await content.boundingBox();
			if (!box) throw new Error('hlm-select-content has no box');
			await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
			await page.mouse.wheel(0, deltaY);
		};

		test('should be scrollable', async ({ page }) => {
			await verifySelectSetup(page, { groups: true });
			await page.locator('[brnselecttrigger]').click();
			await expect(page.locator('hlm-select-content')).not.toHaveCount(0);
			await expect(page.locator('hlm-select-scroll-up').first()).toHaveAttribute('data-hidden', '');
			await expect(page.locator('hlm-select-scroll-down')).not.toHaveCount(0);

			// Scroll a down from top
			await wheel(page, 500);
			await expect(page.locator('hlm-select-scroll-up')).not.toHaveCount(0);
			await expect(page.locator('hlm-select-scroll-down')).not.toHaveCount(0);

			// Scroll to bottom
			await wheel(page, 2000);
			await expect(page.locator('hlm-select-scroll-up')).not.toHaveCount(0);
			await expect(page.locator('hlm-select-scroll-down').first()).toHaveAttribute('data-hidden', '');

			// Scroll back up a bit
			await wheel(page, -500);
			await expect(page.locator('hlm-select-scroll-up')).not.toHaveCount(0);
			await expect(page.locator('hlm-select-scroll-down')).not.toHaveCount(0);
		});
	});
});
