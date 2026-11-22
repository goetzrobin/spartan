import { chromium, type FullConfig } from '@playwright/test';

export default async function globalSetup(config: FullConfig): Promise<void> {
	const project = config.projects[0];
	const baseURL = project.use.baseURL ?? 'http://localhost:4200';
	const browser = await chromium.launch({ channel: project.use.channel });
	try {
		const page = await browser.newPage();
		await page.goto(`${baseURL}/test`, { timeout: 240_000 });
		await page.locator('#test-root[data-test-ready]').waitFor({ timeout: 240_000 });
	} finally {
		await browser.close();
	}
}
