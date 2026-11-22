import type { Locator, Page } from '@playwright/test';
import { STORY_ROOT, byText, caretToEnd, checkA11y, expect, gotoStory, test } from '../support';

const items = (page: Page) => page.locator('hlm-accordion-item');
const trigger = (item: Locator) => item.locator('[brnAccordionTrigger]');

function firstThree(page: Page): [Locator, Locator, Locator] {
	return [items(page).nth(0), items(page).nth(1), items(page).nth(2)];
}

async function verifyAccordionSetup(page: Page): Promise<void> {
	await expect(page.locator('hlm-accordion')).toHaveAttribute('data-state', 'closed');
	await expect(items(page)).toHaveCount(3);
	for (const item of firstThree(page)) {
		await expect(item).toHaveAttribute('data-state', 'closed');
	}
}

async function verifyStateOpen(item: Locator): Promise<void> {
	await expect(item).toHaveAttribute('data-state', 'open');
	await expect(trigger(item)).toHaveAttribute('data-state', 'open');
	await expect(trigger(item)).toHaveAttribute('aria-expanded', 'true');
	await expect(item.locator('hlm-accordion-content')).toHaveAttribute('data-state', 'open');
}

async function verifyStateClosed(item: Locator): Promise<void> {
	await expect(item).toHaveAttribute('data-state', 'closed');
	await expect(trigger(item)).toHaveAttribute('data-state', 'closed');
	await expect(trigger(item)).toHaveAttribute('aria-expanded', 'false');
	await expect(item.locator('hlm-accordion-content')).toHaveAttribute('data-state', 'closed');
}

test.describe('accordion', () => {
	test.describe('ARIA semantics', () => {
		test.beforeEach(async ({ page }) => {
			await gotoStory(page, 'accordion--default');
		});

		test('buttons act as headers with proper ARIA attributes', async ({ page }) => {
			const button = page.locator('hlm-accordion-trigger').first().locator('[brnAccordionTrigger]');

			expect(await button.evaluate((element) => element.tagName)).toBe('BUTTON');

			await expect(button).toHaveAttribute('aria-expanded', 'false');

			await button.click();
			await expect(button).toHaveAttribute('aria-expanded', 'true');

			const controlsId = await button.getAttribute('aria-controls');
			expect(controlsId).toMatch(/^brn-accordion-content-/);
			await expect(page.locator(`#${controlsId}`)).not.toHaveCount(0);
		});

		test('header button is wrapped in semantic heading', async ({ page }) => {
			const heading = await page
				.locator('[brnAccordionTrigger]')
				.first()
				.evaluate((button) => {
					const found = button.closest('h1,h2,h3,h4,h5,h6,[role="heading"]');
					return found ? { role: found.getAttribute('role'), level: found.getAttribute('aria-level') } : null;
				});
			expect(heading).not.toBeNull();

			if (heading?.role === 'heading') {
				expect(heading.level).not.toBeNull();
			}
		});

		test('panel uses role="region" with aria-labelledby when open', async ({ page }) => {
			const firstItem = items(page).first();

			await expect(page.locator('[role="region"]').first()).toHaveAttribute('data-state', 'closed');

			await trigger(firstItem).click();
			await expect(firstItem.locator('[role="region"]')).toHaveAttribute('data-state', 'open');

			const triggerId = await trigger(firstItem).getAttribute('id');
			const region = firstItem.locator('[role="region"]');
			if (triggerId === null) await expect(region).toHaveAttribute('aria-labelledby');
			else await expect(region).toHaveAttribute('aria-labelledby', triggerId);

			await trigger(firstItem).click();
			await expect(firstItem.locator('[role="region"]')).toHaveAttribute('data-state', 'closed');
		});
	});

	test.describe('single accordion (default)', () => {
		test.beforeEach(async ({ page }) => {
			await gotoStory(page, 'accordion--default');
			await verifyAccordionSetup(page);
		});

		test('starts closed and is vertical by default', async ({ page }) => {
			const [firstItem, secondItem, thirdItem] = firstThree(page);

			await expect(page.locator('hlm-accordion')).toHaveAttribute('data-orientation', 'vertical');
			await verifyStateClosed(firstItem);
			await verifyStateClosed(secondItem);
			await verifyStateClosed(thirdItem);
		});

		test('only one open at a time (click)', async ({ page }) => {
			const [firstItem, secondItem, thirdItem] = firstThree(page);

			await trigger(firstItem).click();
			await verifyStateOpen(firstItem);
			await verifyStateClosed(secondItem);
			await verifyStateClosed(thirdItem);

			await trigger(secondItem).click();
			await verifyStateClosed(firstItem);
			await verifyStateOpen(secondItem);
			await verifyStateClosed(thirdItem);

			await trigger(secondItem).click();
			await verifyStateClosed(firstItem);
			await verifyStateClosed(secondItem);
			await verifyStateClosed(thirdItem);

			await trigger(thirdItem).click();
			await verifyStateClosed(firstItem);
			await verifyStateClosed(secondItem);
			await verifyStateOpen(thirdItem);
		});

		test('Space/Enter toggles like a button', async ({ page }) => {
			const [firstItem] = firstThree(page);

			await trigger(firstItem).focus();

			await page.keyboard.press('Space');
			await verifyStateOpen(firstItem);

			await page.keyboard.press('Space');
			await verifyStateClosed(firstItem);

			await page.keyboard.press('Enter');
			await verifyStateOpen(firstItem);

			await page.keyboard.press('Enter');
			await verifyStateClosed(firstItem);
		});
	});

	test.describe('multiple accordion', () => {
		test.beforeEach(async ({ page }) => {
			await gotoStory(page, 'accordion--multiple');
			await expect(items(page)).toHaveCount(3);
		});

		test('allows multiple items to remain open', async ({ page }) => {
			const [firstItem, secondItem, thirdItem] = firstThree(page);

			await verifyStateClosed(firstItem);
			await verifyStateClosed(secondItem);
			await verifyStateClosed(thirdItem);

			await trigger(firstItem).click();
			await verifyStateOpen(firstItem);
			await verifyStateClosed(secondItem);
			await verifyStateClosed(thirdItem);

			await trigger(secondItem).click();
			await verifyStateOpen(firstItem);
			await verifyStateOpen(secondItem);
			await verifyStateClosed(thirdItem);

			await trigger(thirdItem).click();
			await verifyStateOpen(firstItem);
			await verifyStateOpen(secondItem);
			await verifyStateOpen(thirdItem);

			await trigger(secondItem).click();
			await verifyStateOpen(firstItem);
			await verifyStateClosed(secondItem);
			await verifyStateOpen(thirdItem);
		});
	});

	test.describe('keyboard navigation between headers', () => {
		test.beforeEach(async ({ page }) => {
			await gotoStory(page, 'accordion--default');
			await verifyAccordionSetup(page);
		});

		test('ArrowDown/ArrowUp move focus between headers (vertical)', async ({ page }) => {
			const [firstItem, secondItem, thirdItem] = firstThree(page);

			await trigger(firstItem).focus();

			await page.keyboard.press('ArrowDown');
			await expect(trigger(secondItem)).toBeFocused();

			await page.keyboard.press('ArrowUp');
			await expect(trigger(firstItem)).toBeFocused();

			await page.keyboard.press('ArrowUp');
			await expect(trigger(thirdItem)).toBeFocused();

			await page.keyboard.press('ArrowDown');
			await expect(trigger(firstItem)).toBeFocused();
		});

		test('Home to first; End to last', async ({ page }) => {
			const [firstItem, secondItem, thirdItem] = firstThree(page);

			await trigger(secondItem).focus();

			await page.keyboard.press('Home');
			await expect(trigger(firstItem)).toBeFocused();

			await page.keyboard.press('End');
			await expect(trigger(thirdItem)).toBeFocused();
		});

		test('Tab/Shift+Tab include inner focusables in page order', async ({ page }) => {
			const [firstItem, secondItem] = firstThree(page);

			await trigger(firstItem).click();
			await trigger(firstItem).focus();

			await page.keyboard.press('Tab');
			await expect(trigger(secondItem)).toBeFocused();

			await page.keyboard.press('Shift+Tab');
			await expect(trigger(firstItem)).toBeFocused();
		});
	});

	test.describe('keyboard guarding with form inputs', () => {
		test.beforeEach(async ({ page }) => {
			await gotoStory(page, 'accordion--with-form-inputs');
		});

		test('typing in an input does not toggle accordion', async ({ page }) => {
			const firstItem = items(page).first();
			const input = firstItem.locator('input');

			await trigger(firstItem).click();
			await verifyStateOpen(firstItem);

			await input.click();
			await input.pressSequentially('John Doe');
			await expect(input).toHaveValue('John Doe');

			await verifyStateOpen(firstItem);

			await input.press('Enter');
			await verifyStateOpen(firstItem);
		});

		test('textarea accepts newlines and accordion stays open', async ({ page }) => {
			const firstItem = items(page).first();
			const textarea = firstItem.locator('textarea');

			await trigger(firstItem).click();
			await verifyStateOpen(firstItem);

			await textarea.click();
			await textarea.pressSequentially('Line 1');
			await page.keyboard.press('Enter');
			await textarea.pressSequentially('Line 2');
			await expect(textarea).toHaveValue('Line 1\nLine 2');

			await verifyStateOpen(firstItem);
		});

		test('select changes with arrows and does not toggle', async ({ page }) => {
			const firstItem = items(page).first();

			await trigger(firstItem).click();
			await verifyStateOpen(firstItem);

			await firstItem.locator('select').focus();
			await firstItem.locator('select').selectOption('Option Two');

			await verifyStateOpen(firstItem);
		});

		test('contenteditable text edits do not toggle', async ({ page }) => {
			const firstItem = items(page).first();
			const editable = firstItem.locator('[contenteditable="true"]');

			await trigger(firstItem).click();
			await verifyStateOpen(firstItem);

			await editable.click();
			await caretToEnd(editable);
			await editable.pressSequentially(' hello');
			await expect(editable).toContainText('hello');

			await verifyStateOpen(firstItem);
		});

		test('modifier combos (Ctrl/Meta/Alt) do not toggle', async ({ page }) => {
			const firstItem = items(page).first();

			await trigger(firstItem).click();
			await verifyStateOpen(firstItem);
			await trigger(firstItem).focus();

			await page.keyboard.press('Control+ArrowDown');
			await verifyStateOpen(firstItem);

			await page.keyboard.press('Meta+ArrowDown');
			await verifyStateOpen(firstItem);

			await page.keyboard.press('Alt+ArrowDown');
			await verifyStateOpen(firstItem);
		});
	});

	test.describe('inert behavior for closed panels', () => {
		test.beforeEach(async ({ page }) => {
			await gotoStory(page, 'accordion--with-tapable');
		});

		test('button should not be focusable when panel is closed (inert)', async ({ page }) => {
			const firstItem = items(page).nth(0);
			const secondItem = items(page).nth(1);

			await verifyStateClosed(firstItem);

			await page.keyboard.press('Tab');
			await expect(trigger(firstItem)).toBeFocused();
			await page.keyboard.press('Tab');
			await expect(trigger(secondItem)).toBeFocused();

			await trigger(firstItem).click();
			await verifyStateOpen(firstItem);
			await trigger(firstItem).focus();
			await page.keyboard.press('Tab');
			await expect(page.locator('[data-testid="not-tapable-when-closed"]')).toBeFocused();

			await trigger(secondItem).click();
			await verifyStateOpen(secondItem);
			await trigger(secondItem).focus();
			await page.keyboard.press('Tab');
			await expect(page.locator('[data-testid="tapable-when-open"]')).toBeFocused();
		});
	});

	test.describe('button state sync', () => {
		test.beforeEach(async ({ page }) => {
			await gotoStory(page, 'accordion--button-state-sync');
			await expect(items(page)).toHaveCount(3);
		});

		test('should have the first item open by default, toggle all 3 items by pressing on them, close third item on button click, open third item on button click, close third item on click on its own trigger', async ({
			page,
		}) => {
			const [firstItem, secondItem, thirdItem] = firstThree(page);

			await verifyStateOpen(firstItem);
			await verifyStateClosed(secondItem);
			await verifyStateClosed(thirdItem);

			await trigger(firstItem).click();
			await verifyStateClosed(firstItem);
			await trigger(secondItem).click();

			await verifyStateOpen(secondItem);
			await trigger(secondItem).click();
			await verifyStateClosed(secondItem);

			await trigger(thirdItem).click();
			await verifyStateOpen(thirdItem);
			await byText(page, /toggle third item/i).click();
			await verifyStateClosed(thirdItem);
			await byText(page, /toggle third item/i).click();
			await verifyStateOpen(thirdItem);
			await trigger(thirdItem).click();
			await verifyStateClosed(thirdItem);
		});
	});

	test.describe('default accessibility', () => {
		for (const story of ['default', 'multiple', 'with-form-inputs', 'with-tapable', 'button-state-sync']) {
			test(`should have no accessibility violations in ${story} story`, async ({ page }) => {
				await gotoStory(page, `accordion--${story}`);
				await checkA11y(page, STORY_ROOT, {
					rules: {
						'page-has-heading-one': { enabled: false },
						'landmark-one-main': { enabled: false },
					},
				});
			});
		}
	});
});
