import { test as base, expect, selectors, type Locator, type Page } from '@playwright/test';
import { createRequire } from 'node:module';

export { expect };

export const STORY_ROOT = '#test-root';

// Testing Library's ByText matches an element's own text; Playwright's getByText matches its whole text.
export function byText(scope: Page | Locator, text: string | RegExp): Locator {
	const matcher = typeof text === 'string' ? { text } : { source: text.source, flags: text.flags.replace(/[gy]/g, '') };
	return scope.locator(`own-text=${encodeURIComponent(JSON.stringify(matcher))}`);
}

const ownTextEngine = () => ({
	queryAll(root: Element | Document, body: string): Element[] {
		const matcher = JSON.parse(decodeURIComponent(body)) as { text?: string; source?: string; flags?: string };
		const pattern = matcher.source === undefined ? undefined : new RegExp(matcher.source, matcher.flags);
		const ownText = (element: Element): string => {
			if (element instanceof HTMLInputElement && ['submit', 'button', 'reset'].includes(element.type)) {
				return element.value;
			}
			let text = '';
			for (const node of Array.from(element.childNodes)) {
				if (node.nodeType === Node.TEXT_NODE) text += node.textContent ?? '';
			}
			return text;
		};
		return Array.from(root.querySelectorAll('*')).filter((element) => {
			if (element.matches('script, style')) return false;
			const text = ownText(element).trim().replace(/\s+/g, ' ');
			return pattern ? pattern.test(text) : text === matcher.text;
		});
	},
	query(root: Element | Document, body: string): Element | undefined {
		return this.queryAll(root, body)[0];
	},
});

const ownTextRegistered = selectors.register('own-text', ownTextEngine);

const AXE_SOURCE = createRequire(import.meta.url).resolve('axe-core/axe.min.js');

type AxeViolation = {
	id: string;
	impact?: string | null;
	help: string;
	helpUrl: string;
	nodes: { target: unknown[]; failureSummary?: string }[];
};

type A11yRecord = { context: string; violations: AxeViolation[]; passes: number };

const PLACEHOLDER_IMAGE = Buffer.from(
	'iVBORw0KGgoAAAANSUhEUgAAAAgAAAAICAIAAABLbSncAAAAD0lEQVR4nGNYgAMwDC0JAON6eAHQIWnvAAAAAElFTkSuQmCC',
	'base64',
);

export const test = base.extend<{ a11yLog: A11yRecord[]; ownNetworkOnly: void }, { ownTextSelector: void }>({
	ownNetworkOnly: [
		async ({ context, baseURL }, use) => {
			const own = new URL(baseURL ?? 'http://localhost').host;
			await context.route(
				(url) => url.protocol.startsWith('http') && url.host !== own,
				(route) =>
					route.request().resourceType() === 'image'
						? route.fulfill({ contentType: 'image/png', body: PLACEHOLDER_IMAGE })
						: route.abort(),
			);
			await use();
		},
		{ auto: true },
	],

	ownTextSelector: [
		async ({}, use) => {
			await ownTextRegistered;
			await use();
		},
		{ scope: 'worker', auto: true },
	],

	a11yLog: [
		async ({ page }, use, testInfo) => {
			const log: A11yRecord[] = [];
			a11yLogs.set(testInfo.testId, log);
			await use(log);
			a11yLogs.delete(testInfo.testId);
			if (log.length > 0) {
				await testInfo.attach('a11y.json', { body: JSON.stringify(log, null, 2), contentType: 'application/json' });
			}
			try {
				await settle(page);
				const file = testInfo.outputPath('final.png');
				await page.screenshot({
					path: file,
					animations: 'disabled',
					caret: 'hide',
					style: 'x-pw-glass { display: none !important; }',
				});
				await testInfo.attach('final', { path: file, contentType: 'image/png' });
			} catch {
				// Playwright may have closed the page already when a test failed hard.
			}
		},
		{ auto: true },
	],
});

const a11yLogs = new Map<string, A11yRecord[]>();

export async function settle(page: Page): Promise<void> {
	await page.evaluate(async () => {
		const finished = Promise.all(
			document.getAnimations().map((animation) => animation.finished.catch(() => undefined)),
		);
		await Promise.race([finished, new Promise((resolve) => setTimeout(resolve, 2000))]);
		await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
	});
}

export async function gotoStory(page: Page, storyId: string, options: { args?: string } = {}): Promise<void> {
	const separator = storyId.indexOf('--');
	if (separator < 1) throw new Error(`Not a story id: ${storyId}`);
	const route = `/test/${storyId.slice(0, separator)}/${storyId.slice(separator + 2)}`;
	const query = options.args ? `?${new URLSearchParams({ args: options.args })}` : '';

	await page.goto(route + query);
	await page.locator(`${STORY_ROOT}[data-test-ready]`).waitFor();
	await page.evaluate(() => document.fonts.ready);
}

async function runAxe(page: Page, selector: string | undefined, options: Record<string, unknown>) {
	const loaded = await page.evaluate(() => 'axe' in window);
	if (!loaded) await page.addScriptTag({ path: AXE_SOURCE });

	const result = await page.evaluate(
		async ([context, runOptions]) => {
			type AxeResults = { passes: unknown[]; violations: AxeViolation[] };
			const axe = (window as unknown as { axe: { run: (c: unknown, o: unknown) => Promise<AxeResults> } }).axe;
			const { violations, passes } = await axe.run(context ?? document, runOptions);
			return {
				passes: passes.length,
				violations: violations.map((violation) => ({
					id: violation.id,
					impact: violation.impact,
					help: violation.help,
					helpUrl: violation.helpUrl,
					nodes: violation.nodes.map((node) => ({ target: node.target, failureSummary: node.failureSummary })),
				})),
			};
		},
		[selector ?? null, options] as const,
	);

	a11yLogs.get(test.info().testId)?.push({ context: selector ?? 'document', ...result });

	return result;
}

export async function recordA11y(page: Page, selector?: string, options: Record<string, unknown> = {}): Promise<void> {
	await runAxe(page, selector, options);
}

export async function checkA11y(page: Page, selector?: string, options: Record<string, unknown> = {}): Promise<void> {
	const result = await runAxe(page, selector, options);
	const summary = result.violations
		.map(
			(violation: AxeViolation) =>
				`${violation.id} (${violation.impact ?? 'no impact'}): ${violation.help}\n` +
				violation.nodes.map((node) => `    ${JSON.stringify(node.target)}`).join('\n'),
		)
		.join('\n');
	expect(result.violations, `Accessibility violations in ${selector ?? 'the document'}:\n${summary}`).toHaveLength(0);
}

// Playwright's force click still clicks a point on screen, so it lands on whatever covers the element.
export async function forceClick(locator: Locator): Promise<void> {
	await locator.evaluate((element) => {
		const box = element.getBoundingClientRect();
		const init = {
			bubbles: true,
			cancelable: true,
			composed: true,
			view: window,
			button: 0,
			clientX: box.left + box.width / 2,
			clientY: box.top + box.height / 2,
		};
		element.dispatchEvent(new PointerEvent('pointerdown', { ...init, pointerId: 1, pointerType: 'mouse', buttons: 1 }));
		element.dispatchEvent(new MouseEvent('mousedown', { ...init, buttons: 1 }));
		element.dispatchEvent(new PointerEvent('pointerup', { ...init, pointerId: 1, pointerType: 'mouse' }));
		element.dispatchEvent(new MouseEvent('mouseup', init));
		element.dispatchEvent(new MouseEvent('click', init));
	});
}

export async function caretToEnd(locator: Locator): Promise<void> {
	await locator.evaluate((element) => {
		if (element instanceof HTMLInputElement || element instanceof HTMLTextAreaElement) {
			try {
				element.setSelectionRange(element.value.length, element.value.length);
			} catch {
				// Chromium throws on setSelectionRange for input types such as email and number.
			}
			return;
		}
		const range = document.createRange();
		range.selectNodeContents(element);
		range.collapse(false);
		const selection = window.getSelection();
		selection?.removeAllRanges();
		selection?.addRange(range);
	});
}
