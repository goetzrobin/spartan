import { STORY_ROOT, byText, checkA11y, expect, gotoStory, test } from '../support';

test.describe('command', () => {
	test.describe('default', () => {
		test.beforeEach(async ({ page }) => {
			await gotoStory(page, 'command--default');
		});

		test('\n\t  first option should be selected by default.\n\t  Typing bil, should show and select only billing\n\t  Typing BIL, should show and select only billing\n\t  Typing ca should show calendar and calculator and select calendar because it comes first\n\t  Typing CA should show calendar and calculator and select calendar because it comes first\n\t  Click on billing should select billing\n\t  ', async ({
			page,
		}) => {
			await checkA11y(page, STORY_ROOT, {
				rules: {
					'page-has-heading-one': { enabled: false },
					'landmark-one-main': { enabled: false },
				},
			});
			await page.keyboard.press('Tab');
			await page.keyboard.press('Tab');
			await expect(byText(page, /calendar/i)).toHaveAttribute('aria-selected', 'true');
			await expect(byText(page, /calendar/i)).toBeVisible();
			await expect(byText(page, /billing/i)).toHaveAttribute('aria-selected', 'false');
			await expect(byText(page, /billing/i)).toBeVisible();
			await page.locator('input').pressSequentially('bil');
			await expect(byText(page, /calendar/i)).toHaveAttribute('aria-selected', 'false');
			await expect(byText(page, /calendar/i)).toBeHidden();
			await expect(byText(page, /billing/i)).toHaveAttribute('aria-selected', 'true');
			await expect(byText(page, /billing/i)).toBeVisible();
			await page.locator('input').clear();
			await expect(byText(page, /calendar/i)).toHaveAttribute('aria-selected', 'true');
			await expect(byText(page, /calendar/i)).toBeVisible();
			await expect(byText(page, /billing/i)).toHaveAttribute('aria-selected', 'false');
			await expect(byText(page, /billing/i)).toBeVisible();
			await page.locator('input').pressSequentially('BIL');
			await expect(byText(page, /calendar/i)).toHaveAttribute('aria-selected', 'false');
			await expect(byText(page, /calendar/i)).toBeHidden();
			await expect(byText(page, /billing/i)).toHaveAttribute('aria-selected', 'true');
			await expect(byText(page, /billing/i)).toBeVisible();
			await page.locator('input').clear();
			await expect(byText(page, /calendar/i)).toHaveAttribute('aria-selected', 'true');
			await expect(byText(page, /calendar/i)).toBeVisible();
			await expect(byText(page, /billing/i)).toHaveAttribute('aria-selected', 'false');
			await expect(byText(page, /billing/i)).toBeVisible();
			await expect(byText(page, /calculator/i)).toHaveAttribute('aria-selected', 'false');
			await expect(byText(page, /calculator/i)).toBeVisible();
			await page.locator('input').pressSequentially('ca');
			await expect(byText(page, /calendar/i)).toHaveAttribute('aria-selected', 'true');
			await expect(byText(page, /calendar/i)).toBeVisible();
			await expect(byText(page, /billing/i)).toHaveAttribute('aria-selected', 'false');
			await expect(byText(page, /billing/i)).toBeHidden();
			await expect(byText(page, /calculator/i)).toHaveAttribute('aria-selected', 'false');
			await expect(byText(page, /calculator/i)).toBeVisible();
			await page.locator('input').clear();
			await expect(byText(page, /calendar/i)).toHaveAttribute('aria-selected', 'true');
			await expect(byText(page, /calendar/i)).toBeVisible();
			await expect(byText(page, /billing/i)).toHaveAttribute('aria-selected', 'false');
			await expect(byText(page, /billing/i)).toBeVisible();
			await expect(byText(page, /calculator/i)).toHaveAttribute('aria-selected', 'false');
			await expect(byText(page, /calculator/i)).toBeVisible();
			await page.locator('input').pressSequentially('CA');
			await expect(byText(page, /calendar/i)).toHaveAttribute('aria-selected', 'true');
			await expect(byText(page, /calendar/i)).toBeVisible();
			await expect(byText(page, /billing/i)).toHaveAttribute('aria-selected', 'false');
			await expect(byText(page, /billing/i)).toBeHidden();
			await expect(byText(page, /calculator/i)).toHaveAttribute('aria-selected', 'false');
			await expect(byText(page, /calculator/i)).toBeVisible();
			await page.locator('input').clear();
			await byText(page, /billing/i).click();
			await expect(byText(page, /billing/i)).toHaveAttribute('aria-selected', 'true');
		});

		test('\n\t  first option should be selected by default.\n\t  Typing bil, should show and select only billing\n\t  Typing BIL, should show and select only billing\n\t  Typing ca should show calendar and calculator and select calendar because it comes first\n\t  Typing CA should show calendar and calculator and select calendar because it comes first\n\t  Arrow down on billing should select billing\n\t  Arrow up to calculator should select calculator\n\t  Arrow up should skip disabled search emoji and select calendar\n\t  ', async ({
			page,
		}) => {
			await checkA11y(page, STORY_ROOT, {
				rules: {
					'page-has-heading-one': { enabled: false },
					'landmark-one-main': { enabled: false },
				},
			});
			await page.keyboard.press('Tab');
			await page.keyboard.press('Tab');
			await expect(byText(page, /calendar/i)).toHaveAttribute('aria-selected', 'true');
			await expect(byText(page, /calendar/i)).toBeVisible();
			await expect(byText(page, /billing/i)).toHaveAttribute('aria-selected', 'false');
			await expect(byText(page, /billing/i)).toBeVisible();
			await page.locator('input').pressSequentially('bil');
			await expect(byText(page, /calendar/i)).toHaveAttribute('aria-selected', 'false');
			await expect(byText(page, /calendar/i)).toBeHidden();
			await expect(byText(page, /billing/i)).toHaveAttribute('aria-selected', 'true');
			await expect(byText(page, /billing/i)).toBeVisible();
			await page.locator('input').clear();
			await expect(byText(page, /calendar/i)).toHaveAttribute('aria-selected', 'true');
			await expect(byText(page, /calendar/i)).toBeVisible();
			await expect(byText(page, /billing/i)).toHaveAttribute('aria-selected', 'false');
			await expect(byText(page, /billing/i)).toBeVisible();
			await page.locator('input').pressSequentially('BIL');
			await expect(byText(page, /calendar/i)).toHaveAttribute('aria-selected', 'false');
			await expect(byText(page, /calendar/i)).toBeHidden();
			await expect(byText(page, /billing/i)).toHaveAttribute('aria-selected', 'true');
			await expect(byText(page, /billing/i)).toBeVisible();
			await page.locator('input').clear();
			await expect(byText(page, /calendar/i)).toHaveAttribute('aria-selected', 'true');
			await expect(byText(page, /calendar/i)).toBeVisible();
			await expect(byText(page, /billing/i)).toHaveAttribute('aria-selected', 'false');
			await expect(byText(page, /billing/i)).toBeVisible();
			await expect(byText(page, /calculator/i)).toHaveAttribute('aria-selected', 'false');
			await expect(byText(page, /calculator/i)).toBeVisible();
			await page.locator('input').pressSequentially('ca');
			await expect(byText(page, /calendar/i)).toHaveAttribute('aria-selected', 'true');
			await expect(byText(page, /calendar/i)).toBeVisible();
			await expect(byText(page, /billing/i)).toHaveAttribute('aria-selected', 'false');
			await expect(byText(page, /billing/i)).toBeHidden();
			await expect(byText(page, /calculator/i)).toHaveAttribute('aria-selected', 'false');
			await expect(byText(page, /calculator/i)).toBeVisible();
			await page.locator('input').clear();
			await expect(byText(page, /calendar/i)).toHaveAttribute('aria-selected', 'true');
			await expect(byText(page, /calendar/i)).toBeVisible();
			await expect(byText(page, /billing/i)).toHaveAttribute('aria-selected', 'false');
			await expect(byText(page, /billing/i)).toBeVisible();
			await expect(byText(page, /calculator/i)).toHaveAttribute('aria-selected', 'false');
			await expect(byText(page, /calculator/i)).toBeVisible();
			await page.locator('input').pressSequentially('CA');
			await expect(byText(page, /calendar/i)).toHaveAttribute('aria-selected', 'true');
			await expect(byText(page, /calendar/i)).toBeVisible();
			await expect(byText(page, /billing/i)).toHaveAttribute('aria-selected', 'false');
			await expect(byText(page, /billing/i)).toBeHidden();
			await expect(byText(page, /calculator/i)).toHaveAttribute('aria-selected', 'false');
			await expect(byText(page, /calculator/i)).toBeVisible();
			await page.locator('input').clear();
			await page.keyboard.press('ArrowDown');
			await page.keyboard.press('ArrowDown');
			await page.keyboard.press('ArrowDown');
			await expect(byText(page, /billing/i)).toHaveAttribute('aria-selected', 'true');
			await page.keyboard.press('ArrowUp');
			await page.keyboard.press('ArrowUp');
			await expect(byText(page, /billing/i)).toHaveAttribute('aria-selected', 'false');
			await expect(byText(page, /calculator/i)).toHaveAttribute('aria-selected', 'true');
			await page.keyboard.press('ArrowUp');
			await expect(byText(page, /search emoji/i)).toHaveAttribute('aria-selected', 'false');
			await expect(byText(page, /calendar/i)).toHaveAttribute('aria-selected', 'true');
		});

		test('\n\tInput, list, and items should be accessible and have no WCAG A/AA violations.\n\t  ', async ({
			page,
		}) => {
			// Wait for the story to render before auditing; running axe immediately after
			// cy.visit scans an empty root and falsely passes.
			await expect(page.locator('input')).toBeVisible();
			await expect(page.locator('[role="listbox"]')).toBeVisible();
			await page.keyboard.press('Tab');
			await page.keyboard.press('Tab');
			await checkA11y(page, STORY_ROOT, {
				rules: {
					'page-has-heading-one': { enabled: false },
					'landmark-one-main': { enabled: false },
				},
			});
			await expect(page.locator('input')).not.toHaveCount(0);
			await expect(page.locator('input')).toBeVisible();
			await expect(page.getByRole('listbox')).toBeVisible();
			await expect(page.getByRole('option', { name: /calendar/i })).toBeVisible();
		});
	});
});
