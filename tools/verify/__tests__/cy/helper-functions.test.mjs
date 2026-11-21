import assert from 'node:assert/strict';
import path from 'node:path';
import { describe, it } from 'node:test';
import { fileURLToPath } from 'node:url';
import { format } from '../../lib/cy/format.mjs';
import { transformSource } from '../../lib/cy/transform.mjs';

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../../..');

/** @param {string} src */
const t = (src) => transformSource(src, { sourcePath: 'x.cy.ts', basename: 'x' });

/** Code lines, trimmed, without blank lines. @param {string} code */
const lines = (code) =>
	code
		.split('\n')
		.map((l) => l.trim())
		.filter(Boolean);

/**
 * The lines from the one starting with `start` to the next line that is exactly `end`.
 * @param {string} code
 * @param {string} start
 * @param {string} [end]
 */
function section(code, start, end = '};') {
	const ls = lines(code);
	const i = ls.findIndex((l) => l.startsWith(start));
	assert.ok(i >= 0, `no line starting with ${start} in:\n${code}`);
	return ls.slice(i, ls.indexOf(end, i) + 1);
}

/** @param {ReturnType<typeof t>} r @param {string} title */
const status = (r, title) => r.tests.find((x) => x.title === title);

describe('helper emission', () => {
	it('a block-bodied describe-level helper becomes an async function taking page first', () => {
		const r = t(`describe('d', () => {
	/** Checks the label. */
	const verifyLabel = (labelText: string | RegExp) => {
		// first
		cy.findByText(labelText).should('exist');
	};
	it('x', () => {
		verifyLabel('Name');
	});
});`);
		assert.equal(status(r, 'x')?.status, 'converted');
		assert.deepEqual(section(r.code, 'const verifyLabel'), [
			'const verifyLabel = async (page: Page, labelText: string | RegExp) => {',
			'// first',
			'await expect(byText(page, labelText)).not.toHaveCount(0);',
			'};',
		]);
		assert.ok(r.code.includes('/** Checks the label. */\n\tconst verifyLabel'), 'comment kept above the helper');
		assert.ok(r.code.includes("await verifyLabel(page, 'Name');"));
		assert.match(r.code, /^import type \{ Page \} from '@playwright\/test';$/m);
		assert.deepEqual(r.helpers, { emitted: ['verifyLabel'], unsupported: [] });
	});

	it('an expression-bodied helper, and a test whose body is the call', () => {
		const r = t(`const verifyOn = () => cy.findByTestId('x').should('include.text', 'true');
describe('d', () => { it('x', () => verifyOn()); });`);
		assert.deepEqual(section(r.code, 'const verifyOn'), [
			'const verifyOn = async (page: Page) => {',
			"await expect(page.getByTestId('x')).toContainText('true');",
			'};',
		]);
		assert.deepEqual(section(r.code, "test('x'", '});'), [
			"test('x', async ({ page }) => {",
			'await verifyOn(page);',
			'});',
		]);
	});

	it('a function declaration becomes a const arrow function', () => {
		const r = t(`function open(sel: string) { cy.get(sel).click(); }
describe('d', () => { it('x', () => { open('.a'); }); });`);
		assert.deepEqual(section(r.code, 'const open'), [
			'const open = async (page: Page, sel: string) => {',
			'await page.locator(sel).click();',
			'};',
		]);
	});

	it('a helper calling a helper passes its parameter along; both are emitted in source order', () => {
		const r = t(`describe('d', () => {
	const setup = (label: RegExp) => { cy.findByRole('switch', { name: label }).should('exist'); };
	const run = (label: RegExp) => { setup(label); cy.realPress('Tab'); };
	it('x', () => { run(/a/i); });
});`);
		assert.equal(status(r, 'x')?.status, 'converted');
		assert.deepEqual(section(r.code, 'const run'), [
			'const run = async (page: Page, label: RegExp) => {',
			'await setup(page, label);',
			"await page.keyboard.press('Tab');",
			'};',
		]);
		assert.ok(r.code.indexOf('const setup') < r.code.indexOf('const run'));
		assert.deepEqual(r.helpers.emitted, ['setup', 'run']);
	});

	it('a helper nobody calls, or only skipped tests call, is not emitted', () => {
		const r = t(`describe('d', () => {
	const unused = () => { cy.get('.a').click(); };
	const onlySkipped = () => { cy.get('.b').click(); };
	it('x', () => { onlySkipped(); cy.get('a').then(() => {}); });
	it('y', () => { cy.get('.c').click(); });
});`);
		assert.equal(status(r, 'x')?.status, 'skipped');
		assert.ok(!r.code.includes('const unused'));
		assert.ok(!r.code.includes('const onlySkipped'));
		assert.ok(!r.code.includes('@playwright/test'), 'no Page import without a helper');
		assert.deepEqual(r.helpers, { emitted: [], unsupported: [] });
	});

	it('an unsupported helper skips the tests that call it and is reported', () => {
		const r = t(`describe('d', () => {
	const read = () => { cy.get('a').invoke('val'); };
	it('x', () => { read(); });
	it('y', () => { cy.get('a').click(); });
});`);
		assert.deepEqual(status(r, 'x')?.reasons, ['uses helper read (unsupported command .invoke)']);
		assert.equal(status(r, 'y')?.status, 'converted');
		assert.ok(!r.code.includes('const read'));
		assert.deepEqual(r.helpers.unsupported, [{ name: 'read', reasons: ['unsupported command .invoke'] }]);
	});

	it('a helper that calls an unsupported helper is unsupported too', () => {
		const r = t(`describe('d', () => {
	const inner = () => cy.get('a').its('length');
	const outer = () => { inner(); };
	it('x', () => { outer(); });
});`);
		assert.deepEqual(status(r, 'x')?.reasons, ['uses helper outer (uses helper inner (unsupported command .its))']);
	});

	it('a helper name that clashes with a name of the generated file is unsupported', () => {
		const r = t(`describe('d', () => {
	const checkA11y = () => cy.checkA11y('#storybook-root');
	it('x', () => { checkA11y(); });
});`);
		assert.match(status(r, 'x')?.reasons[0] ?? '', /^uses helper checkA11y \(name checkA11y clashes/);
	});
});

describe('helper parameters and bodies', () => {
	const select = `describe('d', () => {
	const verifySetup = ({ disabled = false, groups = false } = {}) => {
		const triggerId = 'hlm-select-trigger-0';
		cy.get('[brnselecttrigger]').should('have.id', triggerId);
		if (!disabled) {
			cy.get('[brnselecttrigger]').click();
			if (groups) {
				cy.get('hlm-select-group').should('exist');
			}
		} else if (groups === true) {
			cy.get('a').click();
		} else {
			// closed
			cy.get('[brnselecttrigger]').should('be.disabled');
		}
	};
	it('enabled', () => { verifySetup(); });
	it('disabled', () => { verifySetup({ disabled: true }); });
});`;

	it('destructured parameters with defaults are kept as written', () => {
		const r = t(select);
		assert.equal(status(r, 'enabled')?.status, 'converted');
		assert.equal(status(r, 'disabled')?.status, 'converted');
		assert.ok(
			r.code.includes('const verifySetup = async (page: Page, { disabled = false, groups = false } = {}) => {'),
		);
		assert.ok(r.code.includes('await verifySetup(page);'));
		assert.ok(r.code.includes('await verifySetup(page, { disabled: true });'));
	});

	it('if / else if / else with plain conditions, and a local const', () => {
		const r = t(select);
		assert.deepEqual(section(r.code, 'const verifySetup'), [
			'const verifySetup = async (page: Page, { disabled = false, groups = false } = {}) => {',
			"const triggerId = 'hlm-select-trigger-0';",
			"await expect(page.locator('[brnselecttrigger]').first()).toHaveId(triggerId);",
			'if (!disabled) {',
			"await page.locator('[brnselecttrigger]').click();",
			'if (groups) {',
			"await expect(page.locator('hlm-select-group')).not.toHaveCount(0);",
			'}',
			'} else if (groups === true) {',
			"await page.locator('a').click();",
			'} else {',
			'// closed',
			"await expect(page.locator('[brnselecttrigger]')).toBeDisabled();",
			'}',
			'};',
		]);
	});

	it('an if condition with a call, or an unsupported branch, makes the helper unsupported', () => {
		const r = t(`describe('d', () => {
	const a = (x: string) => { if (x.startsWith('#')) { cy.get('a').click(); } };
	const b = (x: boolean) => { if (x) { cy.get('a').then(() => {}); } };
	it('x', () => { a('#q'); });
	it('y', () => { b(true); });
});`);
		assert.deepEqual(status(r, 'x')?.reasons, ['uses helper a (unsupported if condition)']);
		assert.deepEqual(status(r, 'y')?.reasons, ['uses helper b (unsupported command .then)']);
	});

	it('an if statement in a test is still unsupported', () => {
		const r = t(`describe('d', () => { const on = true; it('x', () => { if (on) { cy.get('a').click(); } }); });`);
		assert.deepEqual(status(r, 'x')?.reasons, ['unsupported if statement']);
	});

	it('a local const built from a parameter', () => {
		const r = t(`describe('d', () => {
	const open = (id: string) => { const sel = \`#\${id}\`; cy.get(sel).should('have.attr', 'aria-expanded', 'true'); };
	it('x', () => { open('menu'); });
});`);
		assert.deepEqual(section(r.code, 'const open'), [
			'const open = async (page: Page, id: string) => {',
			'const sel = `#${id}`;',
			"await expect(page.locator(sel).first()).toHaveAttribute('aria-expanded', 'true');",
			'};',
		]);
	});
});

describe('consts passed to helpers', () => {
	it('a test-level const passed as an argument is emitted in the test', () => {
		const r = t(`describe('d', () => {
	const check = (label: RegExp) => { cy.findByLabelText(label).click(); };
	it('x', () => {
		const labelText = /Test Switch/i;
		check(labelText);
	});
});`);
		assert.deepEqual(section(r.code, "test('x'", '});'), [
			"test('x', async ({ page }) => {",
			'const labelText = /Test Switch/i;',
			'await check(page, labelText);',
			'});',
		]);
	});

	it('a describe-level const is emitted at describe level only when emitted code uses it', () => {
		const r = t(`describe('d', () => {
	const check = (label: RegExp) => { cy.findByLabelText(label).click(); };
	describe('used', () => {
		const labelText = /Used/i;
		const unused = 'x';
		it('x', () => check(labelText));
	});
	describe('only skipped', () => {
		const other = /Other/i;
		it('y', () => { check(other); cy.get('a').then(() => {}); });
	});
});`);
		assert.match(r.code, /test\.describe\('used', \(\) => \{\n\t\tconst labelText = \/Used\/i;\n/);
		assert.ok(!r.code.includes("const unused = 'x'"));
		assert.ok(!r.code.includes('const other'));
		assert.ok(r.code.includes('await check(page, labelText);'));
	});

	it('a file-level const used inside a helper is emitted', () => {
		const r = t(`const TRIGGER = '#trigger';
const open = () => { cy.get(TRIGGER).click(); };
describe('d', () => { it('x', () => { open(); }); });`);
		assert.deepEqual(lines(r.code).slice(4, 6), [
			"const TRIGGER = '#trigger';",
			'const open = async (page: Page) => {',
		]);
		assert.ok(r.code.includes('await page.locator(TRIGGER).click();'));
	});

	it('a const in a literal-only place (typed text) resolves through describe-level consts', () => {
		const r = t(`describe('d', () => { const name = 'John'; it('x', () => { cy.get('#a').type(name); }); });`);
		assert.equal(status(r, 'x')?.status, 'converted');
		assert.ok(r.code.includes("\tconst name = 'John';"));
		assert.ok(r.code.includes("await page.locator('#a').pressSequentially(name);"));
	});
});

describe('simple values as arguments', () => {
	/**
	 * Converts a helper body called with `arg`. Returns the helper's statement lines.
	 * @param {string} params
	 * @param {string} body
	 * @param {string} args
	 */
	const helper = (params, body, args) => {
		const r = t(`describe('d', () => { const h = (${params}) => { ${body} }; it('x', () => { h(${args}); }); });`);
		return { r, body: r.tests[0].status === 'converted' ? section(r.code, 'const h').slice(1, -1) : null };
	};

	/** @param {string} params @param {string} body @param {string} args @param {string[]} expected */
	const emits = (params, body, args, expected) => {
		const { r, body: out } = helper(params, body, args);
		assert.equal(r.tests[0].status, 'converted', r.tests[0].reasons.join('; '));
		assert.deepEqual(out, expected);
	};

	/** @param {string} params @param {string} body @param {string} args @param {string} reason */
	const refuses = (params, body, args, reason) => {
		const { r } = helper(params, body, args);
		assert.equal(r.tests[0].status, 'skipped');
		assert.ok(
			r.tests[0].reasons.some((x) => x.includes(reason)),
			`expected ${JSON.stringify(reason)} in ${JSON.stringify(r.tests[0].reasons)}`,
		);
	};

	it('findByText / findAllByText -> byText for a string or a RegExp', () => {
		emits('t: string', 'cy.findByText(t).click();', "'Open'", ['await byText(page, t).click();']);
		emits('t: RegExp', 'cy.findAllByText(t).should("have.length", 2);', '/open/i', [
			'await expect(byText(page, t)).toHaveCount(2);',
		]);
	});

	it('label, placeholder, title and alt text -> exact: true', () => {
		emits(
			'a: RegExp, b: string, c: string, d: string',
			'cy.findByLabelText(a).click(); cy.findByPlaceholderText(b).click(); cy.findByTitle(c).click(); cy.findByAltText(d).click();',
			"/n/, 'p', 't', 'alt'",
			[
				'await page.getByLabel(a, { exact: true }).click();',
				'await page.getByPlaceholder(b, { exact: true }).click();',
				'await page.getByTitle(c, { exact: true }).click();',
				'await page.getByAltText(d, { exact: true }).click();',
			],
		);
	});

	it('findByRole name -> name, exact: true', () =>
		emits('n: string | RegExp', "cy.findByRole('tab', { name: n }).click();", '/a/', [
			"await page.getByRole('tab', { name: n, exact: true }).click();",
		]));

	it('a text query argument that can be a number is refused', () =>
		refuses('n: number', 'cy.findByText(n).click();', '1', 'non-literal argument to findByText'));

	it('cy.get and .find with a parameter can match several elements', () => {
		emits('sel: string', "cy.get(sel).should('have.attr', 'a', 'b');", "'.x'", [
			"await expect(page.locator(sel).first()).toHaveAttribute('a', 'b');",
		]);
		emits('sel: string', "cy.get('ul').find(sel).should('have.attr', 'a', 'b');", "'#x'", [
			"await expect(page.locator('ul').locator(sel).first()).toHaveAttribute('a', 'b');",
		]);
	});

	it('`#${id}` is a single element when every id is plain', () => {
		emits('id: string', "cy.get(`#${id}`).should('have.attr', 'a', 'b');", "'x'", [
			"await expect(page.locator(`#${id}`)).toHaveAttribute('a', 'b');",
		]);
		emits('id: string', "cy.get(`#${id}`).should('have.attr', 'a', 'b');", "'x y'", [
			"await expect(page.locator(`#${id}`).first()).toHaveAttribute('a', 'b');",
		]);
	});

	it('a selector value that is not portable is refused', () => {
		refuses('sel: string', 'cy.get(sel).click();', "'li:first'", 'jQuery-only selector');
		refuses('sel: string', 'cy.get(sel).click();', "'#storybook-root'", "selector '#storybook-root' passed as a value");
	});

	it('assertion arguments: have.attr value, have.text, contain, have.value, have.length', () =>
		emits(
			'v: string, n: number',
			"cy.get('#a').should('have.attr', 'k', v); cy.get('#a').should('have.text', v).and('contain', v).and('have.value', v); cy.get('li').should('have.length', n);",
			"'x', 3",
			[
				"await expect(page.locator('#a')).toHaveAttribute('k', v);",
				"await expect(page.locator('#a')).toHaveText(v);",
				"await expect(page.locator('#a')).toContainText(v);",
				"await expect(page.locator('#a')).toHaveValue(v);",
				"await expect(page.locator('li')).toHaveCount(n);",
			],
		));

	it('an assertion argument whose values do not fit is refused', () => {
		refuses('v: RegExp', "cy.get('#a').should('have.attr', 'k', v);", '/x/', "unsupported assertion 'have.attr'");
		refuses('n: number', "cy.get('li').should('have.length', n);", '1.5', "unsupported assertion 'have.length'");
	});

	it('have.class still needs a literal', () =>
		refuses('c: string', "cy.get('#a').should('have.class', c);", "'on'", "unsupported assertion 'have.class'"));

	it('eq with an integer parameter', () =>
		emits('i: number', "cy.get('li').eq(i).click();", '1', ["await page.locator('li').nth(i).click();"]));

	it('key names and typed text stay literal-only', () => {
		refuses('k: string', 'cy.realPress(k);', "'Tab'", 'non-literal key in realPress');
		refuses('s: string', "cy.get('#a').type(s);", "'abc'", 'unsupported arguments to .type');
	});

	it('an argument that is not a simple value refuses the call', () => {
		const r = t(`describe('d', () => {
	const h = (s: string) => { cy.get(s).click(); };
	it('x', () => { h(String(1)); });
});`);
		assert.deepEqual(r.tests[0].reasons, ['uses helper h (argument 1 is not a simple value)']);
	});

	it('a refused call site does not count towards what a parameter can be', () => {
		const r = t(`describe('d', () => {
	const h = (sel: string) => { cy.get(sel).click(); };
	it('x', () => { h('.a'); });
	it('y', () => { cy.get('a').then(($el) => { h($el.attr('id')); }); });
});`);
		assert.equal(status(r, 'x')?.status, 'converted');
		assert.ok(status(r, 'y')?.reasons.includes('uses helper h (argument 1 is not a simple value)'));
	});

	it('a test-level const that shadows a describe-level one is the one used', () => {
		const r = t(`describe('d', () => {
	const label = /outer/;
	const h = (l: RegExp) => { cy.findByLabelText(l).click(); };
	it('x', () => { const label = /inner/; h(label); });
});`);
		assert.equal(r.tests[0].status, 'converted');
		assert.ok(!r.code.includes('/outer/'), 'the shadowed const is not emitted');
		assert.ok(r.code.includes('const label = /inner/;'));
	});

	it('missing and extra arguments refuse the call', () => {
		const r = t(`describe('d', () => {
	const h = (s: string) => { cy.get(s).click(); };
	it('x', () => { h(); });
	it('y', () => { h('.a', '.b'); });
});`);
		assert.deepEqual(status(r, 'x')?.reasons, ['uses helper h (missing arguments)']);
		assert.deepEqual(status(r, 'y')?.reasons, ['uses helper h (too many arguments)']);
	});
});

describe('the alias guard', () => {
	it('a helper whose selector parameter receives an alias at any call site is unsupported for every caller', () => {
		const r = t(`describe('d', () => {
	const verifyOpen = (item: string) => { cy.get(item).should('have.attr', 'data-state', 'open'); };
	it('plain', () => { verifyOpen('.first'); });
	it('alias', () => { cy.get('li').first().as('firstItem'); verifyOpen('@firstItem'); });
});`);
		assert.deepEqual(status(r, 'plain')?.reasons, ["uses helper verifyOpen (alias selector '@firstItem')"]);
		assert.ok(status(r, 'alias')?.reasons.includes("uses helper verifyOpen (alias selector '@firstItem')"));
		assert.ok(!r.code.includes('const verifyOpen'));
		assert.deepEqual(r.helpers.unsupported, [{ name: 'verifyOpen', reasons: ["alias selector '@firstItem'"] }]);
	});

	it('an alias passed through another helper is caught too', () => {
		const r = t(`describe('d', () => {
	const inner = (sel: string) => { cy.get(sel).click(); };
	const outer = (sel: string) => { inner(sel); };
	it('x', () => { outer('@a'); });
});`);
		assert.deepEqual(r.tests[0].reasons, ["uses helper outer (uses helper inner (alias selector '@a'))"]);
	});
});

describe('unsupported uses', () => {
	it('a chained helper result is unsupported', () => {
		const r = t(`describe('d', () => {
	const trigger = () => cy.get('#t');
	it('x', () => { trigger().should('contain.text', 'Aug'); });
});`);
		assert.deepEqual(r.tests[0].reasons, ['uses helper trigger (call result is chained)']);
	});

	it('a helper result used in an expression, or a helper passed as a value, is unsupported', () => {
		const r = t(`describe('d', () => {
	const h = () => { cy.get('#t').click(); };
	it('x', () => { const v = h(); });
	it('y', () => { cy.get('#a').then(h); });
});`);
		assert.ok(status(r, 'x')?.reasons.includes('uses helper h (call result is used in an expression)'));
		assert.ok(status(r, 'y')?.reasons.includes('uses helper h (referenced without being called)'));
	});

	it('direct and mutual recursion are unsupported', () => {
		const r = t(`describe('d', () => {
	const self = (n: number) => { cy.get('a').click(); self(n); };
	const ping = () => { pong(); };
	const pong = () => { ping(); };
	it('x', () => { self(1); });
	it('y', () => { ping(); });
});`);
		assert.deepEqual(status(r, 'x')?.reasons, ['uses helper self (recursive call)']);
		assert.deepEqual(status(r, 'y')?.reasons, ['uses helper ping (recursive call)']);
	});

	it('a parameter with a Cypress type is unsupported', () => {
		const r = t(`describe('d', () => {
	const h = ($el: JQuery<HTMLElement>) => { cy.get('a').click(); };
	it('x', () => { h(null); });
});`);
		assert.deepEqual(r.tests[0].reasons, ['uses helper h (unsupported parameter type JQuery<HTMLElement>)']);
	});
});

describe('helper determinism', () => {
	it('the same input gives byte-identical formatted output and the same report', async () => {
		const src = `const g = (s: string) => cy.get(s).click();
describe('d', () => {
	const labelText = /x/i;
	const v = (l: RegExp, s: string) => { cy.findByLabelText(l).should('exist'); g(s); };
	const bad = () => cy.get('@a');
	it('a', () => v(labelText, '.a'));
	it('b', () => { v(/y/, '#b'); bad(); });
});`;
		const outs = [];
		for (let i = 0; i < 3; i++) {
			const r = t(src);
			const f = await format(r.code, repoRoot, 'apps/ui-e2e/src/x/x.spec.ts');
			assert.ok(f.formatted, f.error);
			outs.push(JSON.stringify([f.code, r.tests, r.helpers]));
		}
		assert.equal(outs[0], outs[1]);
		assert.equal(outs[1], outs[2]);
		const r = t(src);
		assert.deepEqual(r.helpers, {
			emitted: ['g', 'v'],
			unsupported: [{ name: 'bad', reasons: ["alias selector '@a'"] }],
		});
	});
});
