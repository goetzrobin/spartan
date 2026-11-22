import { STORY_ROOT, checkA11y, expect, gotoStory, test } from '../support';

test.describe('field', () => {
	test.describe('default', () => {
		test.beforeEach(async ({ page }) => {
			await gotoStory(page, 'field--default');
		});

		test('should render field with label, input, and description', async ({ page }) => {
			await expect(page.locator('[hlmfield]')).not.toHaveCount(0);
			await expect(page.locator('[hlmfieldlabel]')).not.toHaveCount(0);
			await expect(page.locator('[hlminput]')).not.toHaveCount(0);
			await expect(page.locator('[hlmfielddescription]')).not.toHaveCount(0);

			await expect(page.getByLabel('Full name', { exact: true })).not.toHaveCount(0);
			await expect(page.getByLabel('Username', { exact: true })).not.toHaveCount(0);

			await expect(page.getByLabel('Full name', { exact: true })).toHaveAttribute('id', 'field-fullname');
			await expect(page.getByLabel('Username', { exact: true })).toHaveAttribute('id', 'field-username');

			await expect(page.getByText(/This\s+appears\s+on\s+invoices\s+and\s+emails\./).first()).toBeVisible();
		});

		test('should allow typing in inputs', async ({ page }) => {
			await page.getByLabel('Full name', { exact: true }).pressSequentially('John Doe');
			await expect(page.getByLabel('Full name', { exact: true })).toHaveValue('John Doe');

			await page.getByLabel('Username', { exact: true }).pressSequentially('john_doe_99');
			await expect(page.getByLabel('Username', { exact: true })).toHaveValue('john_doe_99');
		});

		test('should support keyboard navigation', async ({ page }) => {
			await page.getByLabel('Full name', { exact: true }).focus();
			await expect(page.getByLabel('Full name', { exact: true })).toBeFocused();

			await page.keyboard.press('Tab');
			await expect(page.getByLabel('Username', { exact: true })).toBeFocused();
		});
	});

	test.describe('with input', () => {
		test.beforeEach(async ({ page }) => {
			await gotoStory(page, 'field--with-input');
		});

		test('should render multiple fields with descriptions', async ({ page }) => {
			await expect(page.getByLabel('Username', { exact: true })).not.toHaveCount(0);
			await expect(page.getByLabel('Password', { exact: true })).not.toHaveCount(0);

			await expect(page.getByText(/Choose\s+a\s+unique\s+username\s+for\s+your\s+account\./).first()).toBeVisible();
			await expect(page.getByText(/Must\s+be\s+at\s+least\s+8\s+characters\s+long\./).first()).toBeVisible();
		});

		test('should allow input in password field', async ({ page }) => {
			await page.getByLabel('Password', { exact: true }).pressSequentially('secretpassword123');
			await expect(page.getByLabel('Password', { exact: true })).toHaveValue('secretpassword123');
			await expect(page.getByLabel('Password', { exact: true })).toHaveAttribute('type', 'password');
		});
	});

	test.describe('with checkbox', () => {
		test.beforeEach(async ({ page }) => {
			await gotoStory(page, 'field--with-checkbox');
		});

		test('should render fieldset with legend and checkboxes', async ({ page }) => {
			await expect(page.locator('[hlmfieldset]')).not.toHaveCount(0);
			await expect(
				page.locator('[hlmfieldlegend]').filter({ hasText: /Show these items on the desktop/ }),
			).not.toHaveCount(0);
			await expect(
				page.locator('[hlmfielddescription]').filter({ hasText: /Select the items you want to show on the desktop\./ }),
			).not.toHaveCount(0);

			await expect(page.getByLabel('Hard disks', { exact: true })).not.toHaveCount(0);
			await expect(page.getByLabel('External disks', { exact: true })).not.toHaveCount(0);
			await expect(page.getByLabel('CDs, DVDs, and IPods', { exact: true })).not.toHaveCount(0);
			await expect(page.getByLabel('Connected servers', { exact: true })).not.toHaveCount(0);
		});

		test('should allow checking and unchecking checkboxes', async ({ page }) => {
			await page.getByLabel('Hard disks', { exact: true }).click();
			await expect(page.getByLabel('Hard disks', { exact: true })).toHaveAttribute('aria-checked', 'true');

			await page.getByLabel('Hard disks', { exact: true }).click();
			await expect(page.getByLabel('Hard disks', { exact: true })).toHaveAttribute('aria-checked', 'false');
		});

		test('should render checkbox with field content', async ({ page }) => {
			await expect(page.locator('[hlmfieldcontent]')).not.toHaveCount(0);
			await expect(page.getByText(/Sync\s+Desktop\s+&\s+Documents\s+folders/).first()).toBeVisible();
			await expect(
				page
					.getByText(/Your\s+Desktop\s+&\s+Documents\s+folders\s+are\s+being\s+synced\s+with\s+iCloud\s+Drive/)
					.first(),
			).toBeVisible();
		});

		test('should have separator between field groups', async ({ page }) => {
			await expect(page.locator('hlm-field-separator')).not.toHaveCount(0);
		});
	});

	test.describe('with switch', () => {
		test.beforeEach(async ({ page }) => {
			await gotoStory(page, 'field--with-switch');
		});

		test('should render field with switch in horizontal orientation', async ({ page }) => {
			await expect(page.getByLabel('Multi-factor authentication', { exact: true })).not.toHaveCount(0);
			await expect(page.getByRole('switch', { name: /multi-factor authentication/i })).not.toHaveCount(0);

			await expect(page.getByText(/Enable\s+multi-factor\s+authentication/).first()).toBeVisible();
			await expect(page.getByText(/If\s+you\s+do\s+not\s+have\s+a\s+two-factor\s+device/).first()).toBeVisible();
		});

		test('should toggle switch', async ({ page }) => {
			await expect(page.getByRole('switch', { name: /multi-factor authentication/i })).toHaveAttribute(
				'aria-checked',
				'false',
			);
			await page.getByRole('switch', { name: /multi-factor authentication/i }).click();
			await expect(page.getByRole('switch', { name: /multi-factor authentication/i })).toHaveAttribute(
				'aria-checked',
				'true',
			);
		});
	});

	test.describe('with radio', () => {
		test.beforeEach(async ({ page }) => {
			await gotoStory(page, 'field--with-radio');
		});

		test('should render fieldset with radio group', async ({ page }) => {
			await expect(page.locator('[hlmfieldset]')).not.toHaveCount(0);
			await expect(page.locator('[hlmfieldlabel]').filter({ hasText: /Subscription Plan/ })).not.toHaveCount(0);
			await expect(
				page.getByText(/Yearly\s+and\s+lifetime\s+plans\s+offer\s+significant\s+savings/).first(),
			).toBeVisible();

			await expect(page.getByLabel(/Monthly/i)).not.toHaveCount(0);
			await expect(page.getByLabel(/Yearly/i)).not.toHaveCount(0);
			await expect(page.getByLabel(/Lifetime/i)).not.toHaveCount(0);
		});
	});

	test.describe('with select', () => {
		test.beforeEach(async ({ page }) => {
			await gotoStory(page, 'field--with-select');
		});

		test('should allow selecting an option', async ({ page }) => {
			await page.locator('hlm-select-trigger').click();
			await page
				.getByText(/United\s+States/)
				.first()
				.click();
			await expect(page.locator('hlm-select-trigger').filter({ hasText: /us/ })).not.toHaveCount(0);
		});
	});

	test.describe('with textarea', () => {
		test.beforeEach(async ({ page }) => {
			await gotoStory(page, 'field--with-textarea');
		});

		test('should render field with textarea', async ({ page }) => {
			await expect(page.getByLabel('Comments', { exact: true })).not.toHaveCount(0);
			await expect(page.getByLabel('Comments', { exact: true })).toHaveAttribute('id', 'field-comments');
			await expect(page.getByText(/Please\s+provide\s+any\s+additional\s+information\./).first()).toBeVisible();
		});
	});

	test.describe('with error', () => {
		test.beforeEach(async ({ page }) => {
			await gotoStory(page, 'field--with-error');
		});

		test('should render fields with error states', async ({ page }) => {
			await checkA11y(page, STORY_ROOT, {
				rules: {
					'page-has-heading-one': { enabled: false },
					'landmark-one-main': { enabled: false },
					'color-contrast': { enabled: false },
				},
			});

			await page.locator('button#validate').click();

			await expect(page.getByText(/Email\s+must\s+be\s+entered\./).first()).toBeVisible();
			await expect(page.getByText(/Username\s+must\s+be\s+entered\./).first()).toBeVisible();

			await expect(page.getByLabel('Email', { exact: true })).toHaveAttribute('aria-invalid', 'true');
			await expect(page.getByLabel('Username', { exact: true })).toHaveAttribute('aria-invalid', 'true');

			await expect(page.locator('hlm-field-error').and(page.locator(':not(:empty)'))).toHaveCount(2);
		});

		test('should have data-invalid attribute on field wrapper', async ({ page }) => {
			await expect(page.locator('[hlmfield][data-invalid="true"]')).toHaveCount(2);
		});
	});

	test.describe('field group', () => {
		test.beforeEach(async ({ page }) => {
			await gotoStory(page, 'field--field-group');
		});

		test('should handle disabled checkbox in first group', async ({ page }) => {
			await expect(page.locator('[hlmfield]').first().locator('hlm-checkbox').first()).toHaveAttribute('disabled');
		});
	});

	test.describe('horizontal orientation', () => {
		test.beforeEach(async ({ page }) => {
			await gotoStory(page, 'field--horizontal-orientation');
		});

		test('should render fields with horizontal layout', async ({ page }) => {
			await expect(page.locator('[hlmfield][orientation="horizontal"]')).toHaveCount(3);

			await expect(page.getByRole('switch', { name: /Enable notifications/i })).not.toHaveCount(0);

			await expect(page.getByLabel(/Receive marketing emails/i)).not.toHaveCount(0);
			await expect(page.getByLabel(/Product updates/i)).not.toHaveCount(0);
		});

		test('should allow interaction with horizontal fields', async ({ page }) => {
			await page.getByRole('switch', { name: /Enable notifications/i }).click();
			await expect(page.getByRole('switch', { name: /Enable notifications/i })).toHaveAttribute('aria-checked', 'true');

			await page.getByLabel(/Receive marketing emails/i).click();
			await expect(page.getByLabel(/Receive marketing emails/i)).toHaveAttribute('aria-checked', 'true');
		});
	});

	test.describe('with field content', () => {
		test.beforeEach(async ({ page }) => {
			await gotoStory(page, 'field--with-field-content');
		});

		test('should render field content with label and description', async ({ page }) => {
			await expect(page.locator('[hlmfieldcontent]')).toHaveCount(2);

			await expect(page.getByText(/Security\s+Updates/).first()).toBeVisible();
			await expect(page.getByText(/Receive\s+emails\s+about\s+your\s+account\s+security/).first()).toBeVisible();

			await expect(page.getByText(/Two-Factor\s+Authentication/).first()).toBeVisible();
			await expect(
				page.getByText(/Add\s+an\s+extra\s+layer\s+of\s+security\s+to\s+your\s+account/).first(),
			).toBeVisible();
		});

		test('should have checkbox checked by default', async ({ page }) => {
			await expect(page.getByLabel('Security Updates', { exact: true })).toHaveAttribute('aria-checked', 'true');
		});
	});

	test.describe('with field title', () => {
		test.beforeEach(async ({ page }) => {
			await gotoStory(page, 'field--with-field-title');
		});

		test('should render field title above fieldset', async ({ page }) => {
			await expect(page.locator('[hlmfieldtitle]')).not.toHaveCount(0);
			await expect(page.locator('[hlmfieldtitle]').filter({ hasText: /Account Settings/ })).not.toHaveCount(0);

			await expect(
				page.getByText(/Manage\s+your\s+account\s+preferences\s+and\s+security\s+settings/).first(),
			).toBeVisible();

			await expect(page.getByLabel('Username', { exact: true })).not.toHaveCount(0);
			await expect(page.getByLabel('Email', { exact: true })).not.toHaveCount(0);
		});

		test('should allow input in fields under title', async ({ page }) => {
			await page.getByLabel('Username', { exact: true }).pressSequentially('johndoe');
			await page.getByLabel('Email', { exact: true }).pressSequentially('john@example.com');

			await expect(page.getByLabel('Username', { exact: true })).toHaveValue('johndoe');
			await expect(page.getByLabel('Email', { exact: true })).toHaveValue('john@example.com');
		});
	});
});
