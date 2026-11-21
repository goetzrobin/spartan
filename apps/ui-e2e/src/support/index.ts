import { test as base, expect, selectors, type Locator, type Page } from '@playwright/test';
import { createRequire } from 'node:module';

export { expect };

/** The element every test page wraps its case in. Replaces Storybook's `#storybook-root`. */
export const STORY_ROOT = '#test-root';

/**
 * Finds elements the way Testing Library's `ByText` queries do: by an element's OWN text (its
 * direct text nodes, trimmed, with runs of whitespace collapsed). A string must match that text
 * exactly; a regular expression is tested against it.
 *
 * Playwright's `getByText` looks at an element's whole text instead, so `/^print$/i` would not
 * find `<button>Print <kbd>Cmd+P</kbd></button>`. The Cypress tests were written against the
 * Testing Library meaning, and the converted tests keep it.
 */
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

export const test = base.extend<{ a11yLog: A11yRecord[] }, { ownTextSelector: void }>({
	ownTextSelector: [
		async ({}, use) => {
			await ownTextRegistered;
			await use();
		},
		{ scope: 'worker', auto: true },
	],

	// Collects every accessibility check a test makes and attaches the results, so the proof
	// posted on a pull request can show what was checked and not only that nothing failed.
	// Also takes the test's final screenshot once the page has stopped moving, so the same code
	// gives the same picture on every run and a difference from the base commit means something.
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
				await page.screenshot({ path: file, animations: 'disabled', caret: 'hide' });
				await testInfo.attach('final', { path: file, contentType: 'image/png' });
			} catch {
				// The page can already be gone when a test failed hard; the failure itself is reported.
			}
		},
		{ auto: true },
	],
});

const a11yLogs = new Map<string, A11yRecord[]>();

/** Waits until running animations and transitions have finished and the page has painted. */
export async function settle(page: Page): Promise<void> {
	await page.evaluate(async () => {
		const finished = Promise.all(
			document.getAnimations().map((animation) => animation.finished.catch(() => undefined)),
		);
		await Promise.race([finished, new Promise((resolve) => setTimeout(resolve, 2000))]);
		await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
	});
}

/**
 * Opens the test page for a story id in Storybook's format (`popover--near-viewport-edge`)
 * and waits until the page has rendered in the browser and its fonts have loaded.
 * `args` uses the old Storybook URL format: `disabled:true;value:apple`.
 */
export async function gotoStory(page: Page, storyId: string, options: { args?: string } = {}): Promise<void> {
	const separator = storyId.indexOf('--');
	if (separator < 1) throw new Error(`Not a story id: ${storyId}`);
	const route = `/test/${storyId.slice(0, separator)}/${storyId.slice(separator + 2)}`;
	const query = options.args ? `?${new URLSearchParams({ args: options.args })}` : '';

	await page.goto(route + query);
	await page.locator(`${STORY_ROOT}[data-test-ready]`).waitFor();
	await page.evaluate(() => document.fonts.ready);
}

/**
 * Runs axe on the page, or on the part of it matched by `selector`, and fails on any violation.
 * `options` are axe's run options, the same object the Cypress tests passed to `cy.checkA11y`.
 */
export async function checkA11y(page: Page, selector?: string, options: Record<string, unknown> = {}): Promise<void> {
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

	const summary = result.violations
		.map(
			(violation: AxeViolation) =>
				`${violation.id} (${violation.impact ?? 'no impact'}): ${violation.help}\n` +
				violation.nodes.map((node) => `    ${JSON.stringify(node.target)}`).join('\n'),
		)
		.join('\n');
	expect(result.violations, `Accessibility violations in ${selector ?? 'the document'}:\n${summary}`).toHaveLength(0);
}

/**
 * Cypress's `click({ force: true })` fires the click events on the element itself, wherever it
 * is and whatever covers it. Playwright's `force` still clicks a point on screen, which lands
 * on whatever is on top there (for a backdrop, that is the dialog). This reproduces the Cypress
 * behaviour so converted tests keep their meaning.
 */
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
