// Ported by hand from apps/ui-storybook-e2e/src/integration/empty/empty.cy.ts.
// One test scopes its queries with `.within`, and the visual tests are made in a loop with the
// story name in the title. The transform converts neither. Titles match the originals.
import { expect, gotoStory, test } from '../support';

test.describe('Empty', () => {
	test.beforeEach(async ({ page }) => {
		await gotoStory(page, 'empty--default');
	});

	test.describe('Default Story', () => {
		test('should have proper structure', async ({ page }) => {
			// `.within` needs exactly one element to search in.
			const empty = page.locator('[hlmEmpty]');
			await expect(empty).toHaveCount(1);
			await expect(empty.locator('[hlmEmptyMedia]')).not.toHaveCount(0);
			await expect(empty.locator('[hlmEmptyContent]')).not.toHaveCount(0);
			await expect(empty.locator('[hlmEmptyHeader]')).not.toHaveCount(0);
		});
	});

	test.describe('Visual Regression', () => {
		const stories = [
			'default',
			'with-action',
			'search-results',
			'no-connection',
			'file-not-found',
			'minimal-text',
			'custom-layout',
		];

		for (const story of stories) {
			test(`should match visual snapshot for ${story}`, async ({ page }) => {
				await gotoStory(page, `empty--${story}`);
				await expect(page.locator('[hlmEmpty]')).toBeVisible();
				// Add visual regression testing if supported
				// cy.matchImageSnapshot(`empty-${story}`);
			});
		}
	});
});
