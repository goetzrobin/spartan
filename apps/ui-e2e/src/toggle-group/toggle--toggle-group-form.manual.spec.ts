// Ported by hand from apps/ui-storybook-e2e/src/integration/toggle-group/toggle--toggle-group-form.cy.ts.
// The transform could not convert these tests: they check every other button with
// `.not(':contains("...")').each(...)`. Titles match the originals so the transform knows they
// are covered.
import type { Page } from '@playwright/test';
import { STORY_ROOT, byText, checkA11y, expect, gotoStory, test } from '../support';

const group = (page: Page) => page.getByRole('group');
const selected = (page: Page) => page.getByTestId(/selectedCity/i);

/** `findByRole('group').findByText(name)` has aria-pressed="true" and data-state="on". */
async function expectOn(page: Page, name: RegExp): Promise<void> {
	await expect(byText(group(page), name)).toHaveAttribute('aria-pressed', 'true');
	await expect(byText(group(page), name)).toHaveAttribute('data-state', 'on');
}

/**
 * `findByRole('group').children('button').not(':contains("A")')...each(... aria-pressed false)`.
 * jQuery's `:contains` is case-sensitive, so the names are matched as case-sensitive patterns.
 * Cypress expects the filtered set to be non-empty before `.each` runs.
 */
async function expectOthersOff(page: Page, ...except: string[]): Promise<void> {
	let others = group(page).locator(':scope > button');
	for (const name of except) others = others.filter({ hasNotText: new RegExp(name) });
	await expect(others).not.toHaveCount(0);
	for (const button of await others.all()) {
		await expect(button).toHaveAttribute('aria-pressed', 'false');
	}
}

test.describe('toggle-group--toggle-group-single', () => {
	test.describe('default', () => {
		test.beforeEach(async ({ page }) => {
			await gotoStory(page, 'toggle-group--toggle-group-form');
		});

		const verifyToggleGroupSetup = async (page: Page) => {
			await checkA11y(page, STORY_ROOT, {
				rules: {
					'page-has-heading-one': { enabled: false },
					'landmark-one-main': { enabled: false },
				},
			});
			await expect(selected(page)).toContainText(/sparta/i);
			await expect(group(page)).not.toHaveCount(0);
			await expect(group(page).locator(':scope > button')).toHaveCount(4);
			await expectOthersOff(page, 'Sparta');
			await expectOn(page, /sparta/i);
		};

		test('\n    1. should sparta selected by default.\n    2. should have toggle-group with role=group and 3 buttons toggled off and sparta toggled on.\n    3. click on sparta should not unselect sparta.\n    4. click on syracuse should unselect sparta and select syracuse\n    ', async ({
			page,
		}) => {
			// 1. + 2.
			await verifyToggleGroupSetup(page);
			// 3.
			await byText(group(page), /sparta/i).click();
			await expectOn(page, /sparta/i);
			await expectOthersOff(page, 'Sparta');
			await expect(selected(page)).toContainText(/sparta/i);
			// 4.
			await byText(group(page), /syracuse/i).click();
			await expectOn(page, /syracuse/i);
			await expectOthersOff(page, 'Syracuse');
			await expect(selected(page)).toContainText(/syracuse/i);
		});
	});
});
