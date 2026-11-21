import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { transformSource } from '../../lib/cy/transform.mjs';
import { converts, skips } from './helpers.mjs';

/** @param {string} src */
const t = (src) => transformSource(src, { sourcePath: 'x.cy.ts', basename: 'x' });

/** Code lines, trimmed, without blank lines. @param {string} code */
const lines = (code) =>
	code
		.split('\n')
		.map((l) => l.trim())
		.filter(Boolean);

/**
 * The lines of the test titled `title`, from its opening line to its closing `});`.
 * @param {string} code
 * @param {string} title
 */
function testBody(code, title) {
	const ls = lines(code);
	const i = ls.findIndex((l) => l.startsWith(`test('${title}'`));
	assert.ok(i >= 0, `no test ${title} in:\n${code}`);
	return ls.slice(i + 1, ls.indexOf('});', i));
}

describe('aliases', () => {
	it('an alias used later in the same test becomes a const holding the locator', () =>
		converts(`cy.get('[hlmLabel]').as('label');\ncy.get('@label').should('have.attr', 'id', 'my-id');`, [
			`const label = page.locator('[hlmLabel]');`,
			`await expect(label).not.toHaveCount(0);`,
			`await expect(label.first()).toHaveAttribute('id', 'my-id');`,
		]));

	it('keeps whether the alias can hold one or several elements', () => {
		converts(`cy.findByText('Open').as('trigger');\ncy.get('@trigger').click();`, [
			`const trigger = byText(page, 'Open');`,
			`await expect(trigger).toHaveCount(1);`,
			`await trigger.click();`,
		]);
		converts(`cy.get('li').first().as('item');\ncy.get('@item').should('have.attr', 'a', 'b');`, [
			`const item = page.locator('li').first();`,
			`await expect(item).not.toHaveCount(0);`,
			`await expect(item).toHaveAttribute('a', 'b');`,
		]);
	});

	it('continues the chain on the const after .as', () =>
		converts(`cy.get('li').first().as('item').click();\ncy.get('@item').find('a').should('exist');`, [
			`const item = page.locator('li').first();`,
			`await item.click();`,
			`await expect(item.locator('a')).not.toHaveCount(0);`,
		]));

	it('an alias defined and used inside a helper', () => {
		const r = t(`describe('d', () => {
	const h = () => { cy.get('.a').as('x'); cy.get('@x').click(); };
	it('t', () => { h(); });
});`);
		assert.equal(r.tests[0].status, 'converted', r.tests[0].reasons.join('; '));
		assert.ok(r.code.includes(`const x = page.locator('.a');`));
	});

	it('refuses an alias of a subject after an action or assertion', () => {
		skips(`cy.get('.a').click().as('x');`, 'after an action or assertion');
		skips(`cy.get('.a').should('exist').as('x');`, 'after an action or assertion');
	});

	it('refuses an alias used before it is defined, or defined twice', () => {
		skips(`cy.get('@x').click();\ncy.get('.a').as('x');`, `alias selector '@x'`);
		skips(`cy.get('.a').as('x');\ncy.get('.b').as('x');`, `alias 'x' defined twice`);
	});

	it('refuses alias names that cannot be a const of the same name', () => {
		skips(`cy.get('.a').as('first-item');`, 'is not an identifier');
		skips(`const x = 'a';\ncy.get('.a').as('x');`, 'clashes with a name in the file');
		skips(`cy.get('.a').as('page');`, 'clashes with a name in the file');
		skips(`cy.get('.a').as('default');`, 'clashes with a name in the file');
	});

	it('refuses an alias that is not a literal name, or aliases a value', () => {
		skips(`cy.get('.a').as(name);`, 'unsupported arguments to .as');
		skips(`cy.get('.a').as('x', { type: 'value' });`, 'unsupported arguments to .as');
		skips(`cy.wrap(1).as('x');`, 'unsupported command cy.wrap');
	});

	it('refuses an alias used across a helper boundary', () => {
		const defined = t(`describe('d', () => {
	const h = () => { cy.get('.a').as('x'); };
	it('t', () => { h(); cy.get('@x').click(); });
});`);
		assert.ok(defined.tests[0].reasons.includes(`alias selector '@x'`));
		const used = t(`describe('d', () => {
	const h = () => { cy.get('@x').click(); };
	it('t', () => { cy.get('.a').as('x'); h(); });
});`);
		assert.ok(used.tests[0].reasons.some((r) => r.includes(`alias selector '@x'`)));
	});

	it('an alias defined in a branch of a helper is unknown after the branch', () => {
		const r = t(`describe('d', () => {
	const h = (on: boolean) => { if (on) { cy.get('.a').as('x'); } cy.get('@x').click(); };
	it('t', () => { h(true); });
});`);
		assert.ok(r.tests[0].reasons.some((x) => x.includes(`alias selector '@x'`)));
	});

	it('refuses this.alias', () => {
		const r = t(`describe('d', () => { it('t', function () { cy.get('.a').as('x'); this.x.click(); }); });`);
		assert.equal(r.tests[0].status, 'skipped');
	});
});

describe('aliases from beforeEach', () => {
	it('a plain query is declared again at the top of each test that uses it', () => {
		const r = t(`describe('d', () => {
	beforeEach(() => {
		cy.visit('/iframe.html?id=a--b');
		cy.findAllByRole('tab').first().as('firstTab');
	});
	it('uses it', () => {
		cy.realPress('Tab');
		cy.get('@firstTab').should('have.focus');
	});
	it('does not', () => {
		cy.get('.b').click();
	});
});`);
		assert.deepEqual(
			r.tests.map((x) => x.status),
			['converted', 'converted'],
		);
		const hook = lines(r.code);
		assert.ok(hook.includes(`const firstTab = page.getByRole('tab').first();`));
		assert.ok(hook.includes(`await expect(firstTab).not.toHaveCount(0);`));
		assert.deepEqual(testBody(r.code, 'uses it'), [
			`const firstTab = page.getByRole('tab').first();`,
			`await page.keyboard.press('Tab');`,
			`await expect(firstTab).toBeFocused();`,
		]);
		assert.deepEqual(testBody(r.code, 'does not'), [`await page.locator('.b').click();`]);
	});

	it('reaches tests in nested describes; the innermost definition wins', () => {
		const r = t(`describe('d', () => {
	beforeEach(() => { cy.get('.outer').as('x'); });
	describe('n', () => {
		beforeEach(() => { cy.get('.inner').as('x'); });
		it('t', () => { cy.get('@x').click(); });
	});
	it('u', () => { cy.get('@x').click(); });
});`);
		assert.deepEqual(testBody(r.code, 't'), [`const x = page.locator('.inner');`, `await x.click();`]);
		assert.deepEqual(testBody(r.code, 'u'), [`const x = page.locator('.outer');`, `await x.click();`]);
	});

	it('refuses a hook alias whose query uses a value that is not a literal', () => {
		const r = t(`describe('d', () => {
	const sel = '.a';
	beforeEach(() => { cy.get(sel).as('x'); });
	it('t', () => { cy.get('@x').click(); });
});`);
		assert.deepEqual(r.tests[0].reasons, [`alias '@x' from beforeEach is not a plain query of literal arguments`]);
	});

	it('refuses a hook whose alias follows an action', () => {
		const r = t(`describe('d', () => {
	beforeEach(() => { cy.get('.a').click().as('x'); });
	it('t', () => { cy.get('.b').click(); });
});`);
		assert.ok(r.tests[0].reasons[0].startsWith('unsupported beforeEach: alias'));
	});

	it('refuses a test that defines an alias of the same name again', () => {
		const r = t(`describe('d', () => {
	beforeEach(() => { cy.get('.a').as('x'); });
	it('t', () => { cy.get('.b').as('x'); });
});`);
		assert.deepEqual(r.tests[0].reasons, [`alias 'x' defined twice`]);
	});

	it('an afterEach cannot use a beforeEach alias', () => {
		const r = t(`describe('d', () => {
	beforeEach(() => { cy.get('.a').as('x'); });
	afterEach(() => { cy.get('@x').click(); });
	it('t', () => { cy.get('.b').click(); });
});`);
		assert.ok(r.tests[0].reasons[0].includes(`unsupported afterEach: alias`));
	});
});

describe('contains', () => {
	it('cy.contains(string) is a case-sensitive substring of the text, any whitespace between words', () => {
		const r = converts(`cy.contains('Sync Desktop & Documents.').should('be.visible');`, [
			`await expect(page.getByText(/Sync\\s+Desktop\\s+&\\s+Documents\\./).first()).toBeVisible();`,
		]);
		const re = eval(/getByText\((\/.*\/)\)/.exec(r.code)?.[1] ?? '');
		assert.ok(re.test('x Sync\n   Desktop & Documents. y'));
		assert.ok(!re.test('sync desktop & documents.'));
		assert.ok(!re.test('Sync Desktop & DocumentsX'));
	});

	it('chained .contains scopes to the subject; a bare one asserts existence', () => {
		converts(`cy.get('[hlmBreadcrumb] li').eq(0).contains('Home');`, [
			`await expect(page.locator('[hlmBreadcrumb] li').nth(0).getByText(/Home/).first()).not.toHaveCount(0);`,
		]);
		converts(`cy.get('hlm-item').contains('Doc Brown').click();`, [
			`await page.locator('hlm-item').getByText(/Doc\\s+Brown/).first().click();`,
		]);
	});

	it('a plain RegExp is passed through', () =>
		converts(`cy.findByText(/Cities selected/i).contains(/sparta/i);`, [
			`await expect(byText(page, /Cities selected/i).getByText(/sparta/i).first()).not.toHaveCount(0);`,
		]));

	it('refuses text that is not a literal', () => {
		skips(`cy.contains(label).click();`, 'non-literal text in cy.contains');
		skips(`cy.get('a').contains(1).click();`, 'non-literal text in .contains');
	});

	it('refuses patterns and strings whose match could depend on whitespace or position', () => {
		skips(`cy.contains(/^Home$/).click();`, 'unsupported pattern');
		skips(`cy.contains(/a\\sb/).click();`, 'unsupported pattern');
		skips(`cy.contains(/a b/).click();`, 'unsupported pattern');
		skips(`cy.contains(/\\bHome/).click();`, 'unsupported pattern');
		skips(`cy.contains(/home/g).click();`, 'unsupported pattern');
		skips(`cy.contains('a  b').click();`, 'unsupported text');
		skips(`cy.contains('a\\nb').click();`, 'unsupported text');
		skips(`cy.contains('').click();`, 'unsupported text');
	});

	it('refuses a selector, options, or more than one argument', () => {
		skips(`cy.contains('li', 'apples').click();`, 'unsupported arguments to cy.contains');
		skips(`cy.get('a').contains('Apple', { matchCase: false });`, 'unsupported arguments to .contains');
	});

	it('only a click and existence or visibility checks may follow', () => {
		converts(`cy.contains('x').should('exist').and('be.visible');`, [
			`await expect(page.getByText(/x/).first()).not.toHaveCount(0);`,
			`await expect(page.getByText(/x/).first()).toBeVisible();`,
		]);
		skips(`cy.contains('x').should('have.attr', 'a', 'b');`, 'after .contains');
		skips(`cy.contains('x').should('not.be.visible');`, 'after .contains');
		skips(`cy.contains('x').click({ force: true });`, 'after .contains');
		skips(`cy.contains('x').parent().click();`, 'after .contains');
		skips(`cy.contains('x').as('y');`, 'after .contains');
	});
});

describe('children and filter', () => {
	it('.children() and .children(sel) select direct children and can match several', () => {
		converts(`cy.findByRole('group').children('button').should('have.length', 4);`, [
			`await expect(page.getByRole('group').locator(':scope > button')).toHaveCount(4);`,
		]);
		converts(`cy.get('#g').children().should('have.attr', 'a', 'b');`, [
			`await expect(page.locator('#g').locator(':scope > *').first()).toHaveAttribute('a', 'b');`,
		]);
		converts(`cy.get('#g').children('[data-x="a b"]').click();`, [
			`await page.locator('#g').locator(':scope > [data-x="a b"]').click();`,
		]);
	});

	it('refuses .children with a selector that is not one compound selector', () => {
		skips(`cy.get('#g').children('a b').click();`, 'unsupported selector in .children');
		skips(`cy.get('#g').children('a, b').click();`, 'unsupported selector in .children');
		skips(`cy.get('#g').children('a > b').click();`, 'unsupported selector in .children');
		skips(`cy.get('#g').children(':visible').click();`, 'jQuery-only selector');
		skips(`cy.get('#g').children(sel).click();`, 'unsupported arguments to .children');
	});

	it('.filter(sel) keeps the subjects that also match sel', () =>
		converts(`cy.get('hlm-field-error').filter(':not(:empty)').should('have.length', 2);`, [
			`await expect(page.locator('hlm-field-error').and(page.locator(':not(:empty)'))).toHaveCount(2);`,
		]));

	it('refuses .filter with a jQuery-only selector, a callback or a value; and .not', () => {
		skips(`cy.get('li').filter(':visible').click();`, 'jQuery-only selector');
		skips(`cy.get('li').filter(':contains("a")').click();`, 'jQuery-only selector');
		skips(`cy.get('li').filter((_, el) => el.id === 'a').click();`, 'unsupported callback in .filter');
		skips(`cy.get('li').filter(sel).click();`, 'unsupported arguments to .filter');
		skips(`cy.get('li').not('.a').click();`, 'unsupported command .not');
	});
});

describe('have.attr and what follows it', () => {
	const L = `cy.get('#a')`;
	const E = `await expect(page.locator('#a'))`;

	it('with a name and a value the subject stays the element', () => {
		converts(`${L}.should('have.attr', 'type', 'button').should('have.id', 'x');`, [
			`${E}.toHaveAttribute('type', 'button');`,
			`${E}.toHaveId('x');`,
		]);
		converts(`${L}.should('have.attr', 'aria-expanded', 'false').and('not.have.attr', 'aria-controls');`, [
			`${E}.toHaveAttribute('aria-expanded', 'false');`,
			`${E}.not.toHaveAttribute('aria-controls');`,
		]);
		converts(`${L}.should('have.attr', 'aria-checked', 'true').realClick();`, [
			`${E}.toHaveAttribute('aria-checked', 'true');`,
			`await page.locator('#a').click({ force: true });`,
		]);
	});

	it('a number value is compared as its string, as Cypress does for attributes', () =>
		converts(`${L}.should('have.attr', 'aria-valuemax', 100).and('have.attr', 'data-value', 0);`, [
			`${E}.toHaveAttribute('aria-valuemax', '100');`,
			`${E}.toHaveAttribute('data-value', '0');`,
		]));

	it('with a name alone the subject becomes the value: equal, match, contain, not.be.empty', () => {
		converts(`${L}.should('have.attr', 'id').and('match', /^brn-/);`, [
			`${E}.toHaveAttribute('id');`,
			`${E}.toHaveAttribute('id', /^brn-/);`,
		]);
		converts(`${L}.should('have.attr', 'id').and('equal', 'x').and('eq', 'x');`, [
			`${E}.toHaveAttribute('id');`,
			`${E}.toHaveAttribute('id', 'x');`,
			`${E}.toHaveAttribute('id', 'x');`,
		]);
		converts(`${L}.should('have.attr', 'href').and('include', '/a.b').and('contain', 'a');`, [
			`${E}.toHaveAttribute('href');`,
			`${E}.toHaveAttribute('href', /\\/a\\.b/);`,
			`${E}.toHaveAttribute('href', /a/);`,
		]);
		converts(`${L}.should('have.attr', 'id').and('not.be.empty');`, [
			`${E}.toHaveAttribute('id');`,
			`${E}.toHaveAttribute('id', /[\\s\\S]/);`,
		]);
	});

	it('reads the value from the first element when the subject can hold several', () =>
		converts(`cy.get('li').should('have.attr', 'id').and('equal', 'x');`, [
			`await expect(page.locator('li').first()).toHaveAttribute('id');`,
			`await expect(page.locator('li').first()).toHaveAttribute('id', 'x');`,
		]));

	it('refuses other assertions on the value', () => {
		skips(`${L}.should('have.attr', 'id').and('have.length', 2);`, `'have.length' on an attribute value`);
		skips(`${L}.should('have.attr', 'id').and('not.equal', 'x');`, `'not.equal' on an attribute value`);
		skips(`${L}.should('have.attr', 'id').and('match', /x/g);`, `'match' on an attribute value`);
		skips(`${L}.should('have.attr', 'id').and('equal', 1);`, `'equal' on an attribute value`);
		skips(`${L}.should('have.attr', 'id').and('include', '');`, `'include' on an attribute value`);
		skips(`${L}.should('have.attr', 'id').and('be.empty');`, `'be.empty' on an attribute value`);
		skips(`${L}.should('have.attr', 'k', 1e999);`, `unsupported assertion 'have.attr'`);
	});
});

describe('type with key sequences', () => {
	const L = `cy.get('#a')`;
	const P = `page.locator('#a')`;

	it('splits text and special keys, in order', () => {
		converts(`${L}.type('15/06/2024{enter}');`, [
			`await ${P}.pressSequentially('15/06/2024');`,
			`await ${P}.press('Enter');`,
		]);
		converts(`${L}.type('a{esc}b');`, [
			`await ${P}.pressSequentially('a');`,
			`await ${P}.press('Escape');`,
			`await ${P}.pressSequentially('b');`,
		]);
	});

	it('maps the up, down, home, end and page keys, in both spellings Cypress documents', () =>
		converts(
			`${L}.type('{downarrow}{downArrow}{uparrow}{upArrow}{home}{end}{pageUp}{pagedown}');`,
			['ArrowDown', 'ArrowDown', 'ArrowUp', 'ArrowUp', 'Home', 'End', 'PageUp', 'PageDown'].map(
				(k) => `await ${P}.press('${k}');`,
			),
		));

	it('refuses keys whose effect depends on the caret, which Cypress and Playwright place differently', () => {
		for (const k of ['{backspace}', '{del}', '{leftarrow}', '{leftArrow}', '{rightarrow}', '{rightArrow}'])
			skips(`${L}.type('${k}');`, `key sequence '${k}' in .type depends on the caret position`);
	});

	it('refuses modifiers, selection and cursor sequences, unknown spellings and options', () => {
		skips(`${L}.type('{shift}{rightarrow}');`, `unsupported key sequence '{shift}'`);
		skips(`${L}.type('{ctrl}a');`, `unsupported key sequence '{ctrl}'`);
		skips(`${L}.type('{selectall}');`, `unsupported key sequence '{selectall}'`);
		skips(`${L}.type('{moveToStart}9');`, `unsupported key sequence '{moveToStart}'`);
		skips(`${L}.type('{DownArrow}');`, `unsupported key sequence '{DownArrow}'`);
		skips(`${L}.type('{{}');`, 'unsupported key sequence');
		skips(`${L}.type('a}');`, 'unsupported key sequence');
		skips(`${L}.type('{enter}', { delay: 0 });`, 'unsupported arguments to .type');
		skips(`${L}.type('a', { force: true });`, 'unsupported arguments to .type');
	});
});

describe('have.length comparisons', () => {
	const L = `cy.get('li')`;
	it('more than n is "element n exists", which retries', () => {
		converts(`${L}.should('have.length.gt', 1);`, `await expect(page.locator('li').nth(1)).toBeAttached();`);
		converts(`${L}.should('have.length.greaterThan', 3);`, `await expect(page.locator('li').nth(3)).toBeAttached();`);
		converts(`${L}.should('have.length.above', 0);`, `await expect(page.locator('li')).not.toHaveCount(0);`);
	});
	it('at least n is "element n - 1 exists"', () => {
		converts(`${L}.should('have.length.at.least', 2);`, `await expect(page.locator('li').nth(1)).toBeAttached();`);
		converts(`${L}.should('have.length.gte', 1);`, `await expect(page.locator('li')).not.toHaveCount(0);`);
	});
	it('refuses negations, upper bounds and values that are not whole numbers', () => {
		skips(`${L}.should('not.have.length.gt', 1);`, 'not.have.length.gt');
		skips(`${L}.should('have.length.lt', 3);`, 'have.length.lt');
		skips(`${L}.should('have.length.lte', 3);`, 'have.length.lte');
		skips(`${L}.should('have.length.at.most', 3);`, 'have.length.at.most');
		skips(`${L}.should('have.length.at.least', 0);`, 'have.length.at.least');
		skips(`${L}.should('have.length.gt', 1.5);`, 'have.length.gt');
		skips(`${L}.should('have.length.gt', n);`, 'have.length.gt');
	});
});
