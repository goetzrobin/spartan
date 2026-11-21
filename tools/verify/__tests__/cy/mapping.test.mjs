import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { converts, run, skips } from './helpers.mjs';

describe('navigation and setup', () => {
	it('visit', () =>
		converts(`cy.visit('/iframe.html?id=popover--default');`, `await gotoStory(page, 'popover--default');`));
	it('visit with args', () =>
		converts(
			`cy.visit('/iframe.html?id=select--default&args=disabled:true;id:x');`,
			`await gotoStory(page, 'select--default', { args: 'disabled:true;id:x' });`,
		));
	it('other visit URLs are unsupported', () => {
		skips(`cy.visit('/');`, 'unsupported visit URL');
		skips(`cy.visit('/iframe.html?id=a&globals=x');`, 'unsupported visit URL');
		skips('cy.visit(`/iframe.html?id=${story}`);', 'non-literal URL');
	});
	it('injectAxe is dropped', () => {
		const r = converts(`cy.injectAxe();\ncy.realPress('Tab');`, `await page.keyboard.press('Tab');`);
		assert.ok(!r.code.includes('injectAxe'));
	});
	it('checkA11y with storybook root and options', () =>
		converts(
			`cy.checkA11y('#storybook-root', { rules: { 'landmark-one-main': { enabled: false } } });`,
			`await checkA11y(page, STORY_ROOT, { rules: { 'landmark-one-main': { enabled: false } } });`,
		));
	it('checkA11y without args, with other selector, with undefined', () => {
		converts(`cy.checkA11y();`, `await checkA11y(page);`);
		converts(`cy.checkA11y('hlm-item');`, `await checkA11y(page, 'hlm-item');`);
		converts(`cy.checkA11y(undefined, { rules: {} });`, `await checkA11y(page, undefined, { rules: {} });`);
	});
	it('checkA11y with non-literal options or callbacks is unsupported', () => {
		skips(`cy.checkA11y('#storybook-root', opts);`, 'non-literal options');
		skips(`cy.checkA11y('#storybook-root', {}, cb, true);`, 'unsupported arguments to cy.checkA11y');
	});
	it('viewport', () =>
		converts(`cy.viewport(1000, 800);`, `await page.setViewportSize({ width: 1000, height: 800 });`));
	it('viewport presets are unsupported', () => skips(`cy.viewport('iphone-6');`, 'cy.viewport'));
	it('wait', () => converts(`cy.wait(600);`, `await page.waitForTimeout(600);`));
	it('wait on alias is unsupported', () => skips(`cy.wait('@req');`, 'cy.wait'));
	it('the storybook root literal becomes STORY_ROOT', () =>
		converts(`cy.get('#storybook-root').click({ force: true });`, `await forceClick(page.locator(STORY_ROOT));`));
	it('a selector that only contains the storybook root is unsupported', () =>
		skips(`cy.get('#storybook-root button').click();`, 'storybook-root'));
});

describe('queries', () => {
	it('findByText string -> exact', () =>
		converts(`cy.findByText('Open').click();`, `await byText(page, 'Open').click();`));
	it('findByText regex passes through', () =>
		converts(`cy.findByText(/open/i).click();`, `await byText(page, /open/i).click();`));
	it('findAllByText', () =>
		converts(`cy.findAllByText(/x/).should('have.length', 2);`, `await expect(byText(page, /x/)).toHaveCount(2);`));
	it('findByRole with string name adds exact', () =>
		converts(
			`cy.findByRole('button', { name: 'Close' }).click();`,
			`await page.getByRole('button', { name: 'Close', exact: true }).click();`,
		));
	it('findByRole with regex name', () =>
		converts(`cy.findByRole('tab', { name: /a/i }).click();`, `await page.getByRole('tab', { name: /a/i }).click();`));
	it('findByRole options: hidden, selected, checked, pressed, expanded, level', () =>
		converts(
			`cy.findByRole('x', { hidden: true, selected: true, checked: false, pressed: true, expanded: false, level: 2 }).click();`,
			`await page.getByRole('x', { includeHidden: true, selected: true, checked: false, pressed: true, expanded: false, level: 2 }).click();`,
		));
	it('findByRole with other options is unsupported', () =>
		skips(`cy.findByRole('x', { description: 'y' }).click();`, "unsupported option 'description'"));
	it('findAllByRole', () =>
		converts(
			`cy.findAllByRole('tab').should('have.length', 2);`,
			`await expect(page.getByRole('tab')).toHaveCount(2);`,
		));
	it('findByLabelText / findAllByLabelText -> getByLabel', () => {
		converts(`cy.findByLabelText('Name').focus();`, `await page.getByLabel('Name', { exact: true }).focus();`);
		converts(`cy.findAllByLabelText(/n/).first().focus();`, `await page.getByLabel(/n/).first().focus();`);
	});
	it('findByPlaceholderText -> getByPlaceholder', () =>
		converts(
			`cy.findByPlaceholderText('Search').clear();`,
			`await page.getByPlaceholder('Search', { exact: true }).clear();`,
		));
	it('findByTestId -> getByTestId', () =>
		converts(`cy.findByTestId('v').should('have.text', '1');`, `await expect(page.getByTestId('v')).toHaveText('1');`));
	it('findByTitle -> getByTitle', () =>
		converts(`cy.findByTitle('Hi').click();`, `await page.getByTitle('Hi', { exact: true }).click();`));
	it('findByAltText -> getByAltText', () =>
		converts(`cy.findByAltText(/logo/).click();`, `await page.getByAltText(/logo/).click();`));
	it('text query options are unsupported', () => skips(`cy.findByText('a', { selector: 'b' }).click();`, 'findByText'));
	it('get -> locator', () => converts(`cy.get('.a').click();`, `await page.locator('.a').click();`));
	it('get chained after a subject ignores the subject', () =>
		converts(
			`cy.findByRole('dialog').get('button[data-slot="dialog-close"]').click();`,
			`await page.locator('button[data-slot="dialog-close"]').click();`,
		));
	it('focused -> :focus', () =>
		converts(
			`cy.focused().should('have.attr', 'id', 'a');`,
			`await expect(page.locator(':focus')).toHaveAttribute('id', 'a');`,
		));
	it('find -> locator', () =>
		converts(
			`cy.get('brn-checkbox').find('button').click();`,
			`await page.locator('brn-checkbox').locator('button').click();`,
		));
	it('chained findBy* on a subject', () =>
		converts(
			`cy.findByRole('dialog').findByRole('button', { name: /^close$/i }).should('exist');`,
			`await expect(page.getByRole('dialog').getByRole('button', { name: /^close$/i })).not.toHaveCount(0);`,
		));
	it('first, last, eq, parent', () =>
		converts(
			[
				`cy.get('li').first().click();`,
				`cy.get('li').last().click();`,
				`cy.get('li').eq(2).click();`,
				`cy.findByText(/x/).parent().click();`,
			].join('\n'),
			[
				`await page.locator('li').first().click();`,
				`await page.locator('li').last().click();`,
				`await page.locator('li').nth(2).click();`,
				`await byText(page, /x/).locator('..').click();`,
			],
		));
	it('alias selectors are unsupported', () => {
		skips(`cy.get('@item').click();`, 'alias selector');
		skips(`cy.get('li').as('item');`, 'unsupported command .as');
	});
	it('jQuery-only selectors are unsupported', () => skips(`cy.get('li:first').click();`, 'jQuery-only selector'));
	it('a bare singular query asserts exactly one match', () =>
		converts(`cy.findByRole('dialog');`, `await expect(page.getByRole('dialog')).toHaveCount(1);`));
	it('a bare get / findAll asserts at least one match', () =>
		converts(`cy.get('#x');\ncy.findAllByText(/a/);`, [
			`await expect(page.locator('#x')).not.toHaveCount(0);`,
			`await expect(byText(page, /a/)).not.toHaveCount(0);`,
		]));
});

describe('actions', () => {
	const L = `cy.get('#a')`;
	const P = `page.locator('#a')`;
	it('click', () => converts(`${L}.click();`, `await ${P}.click();`));
	it('click force', () => converts(`${L}.click({ force: true });`, `await forceClick(${P});`));
	it('click with other options is unsupported', () => {
		skips(`${L}.click({ multiple: true });`, 'unsupported arguments to .click');
		skips(`${L}.click('topLeft');`, 'unsupported arguments to .click');
	});
	it('realClick', () => converts(`${L}.realClick();`, `await ${P}.click({ force: true });`));
	it('realClick right / rightclick', () => {
		converts(`${L}.realClick({ button: 'right' });`, `await ${P}.click({ button: 'right', force: true });`);
		converts(`${L}.rightclick();`, `await ${P}.click({ button: 'right' });`);
	});
	it('realClick with position is unsupported', () => skips(`${L}.realClick({ position: 'top' });`, 'realClick'));
	it('dblclick', () => converts(`${L}.dblclick();`, `await ${P}.dblclick();`));
	it('realHover', () => converts(`${L}.realHover();`, `await ${P}.hover({ force: true });`));
	it('focus, blur, clear, check, uncheck', () =>
		converts(
			['focus', 'blur', 'clear', 'check', 'uncheck'].map((a) => `${L}.${a}();`).join('\n'),
			['focus', 'blur', 'clear', 'check', 'uncheck'].map((a) => `await ${P}.${a}();`),
		));
	it('scrollIntoView', () => converts(`${L}.scrollIntoView();`, `await ${P}.scrollIntoViewIfNeeded();`));
	it('select', () => converts(`${L}.select('apple');`, `await ${P}.selectOption('apple');`));
	it('type plain text', () => converts(`${L}.type('John Doe');`, `await ${P}.pressSequentially('John Doe');`));
	it('type with special sequences is unsupported', () => {
		skips(`${L}.type('{enter}');`, 'special key sequences');
		skips(`${L}.type('a\\nb');`, 'special key sequences');
	});
	it('trigger with one event name', () =>
		converts(`${L}.trigger('mouseenter');`, `await ${P}.dispatchEvent('mouseenter');`));
	it('trigger with more arguments is unsupported', () =>
		skips(`${L}.trigger('keydown', { key: 'a' });`, 'unsupported arguments to .trigger'));
	it('realPress single key and combination', () =>
		converts(`cy.realPress('Tab');\ncy.realPress(['Shift', 'Tab']);`, [
			`await page.keyboard.press('Tab');`,
			`await page.keyboard.press('Shift+Tab');`,
		]));
	it('realPress with cypress-style or unknown keys is unsupported', () => {
		skips(`cy.realPress('{enter}');`, 'unsupported key');
		skips(`cy.realPress(['Tab', 'Tab']);`, 'unsupported key combination');
	});
	it('realType', () => converts(`cy.realType('abc');`, `await page.keyboard.type('abc');`));
	it('realType with special keys is unsupported', () => skips(`cy.realType('a{enter}');`, 'special key'));
	it('an action followed by more commands continues on the same locator', () =>
		converts(`${L}.click().should('have.attr', 'aria-expanded', 'true');`, [
			`await ${P}.click();`,
			`await expect(${P}).toHaveAttribute('aria-expanded', 'true');`,
		]));
});

describe('assertions', () => {
	const L = `cy.get('#a')`;
	const E = `await expect(page.locator('#a'))`;
	/** @type {[string, string][]} */
	const rows = [
		[`'have.attr', 'k', 'v'`, `.toHaveAttribute('k', 'v')`],
		[`'have.attr', 'k'`, `.toHaveAttribute('k')`],
		[`'not.have.attr', 'k'`, `.not.toHaveAttribute('k')`],
		[`'have.length', 3`, `.toHaveCount(3)`],
		[`'have.focus'`, `.toBeFocused()`],
		[`'be.focused'`, `.toBeFocused()`],
		[`'not.have.focus'`, `.not.toBeFocused()`],
		[`'be.visible'`, `.toBeVisible()`],
		[`'not.be.visible'`, `.toBeHidden()`],
		[`'exist'`, `.not.toHaveCount(0)`],
		[`'not.exist'`, `.toHaveCount(0)`],
		[`'have.text', 't'`, `.toHaveText('t')`],
		[`'contain', 't'`, `.toContainText('t')`],
		[`'contain.text', 't'`, `.toContainText('t')`],
		[`'include.text', 't'`, `.toContainText('t')`],
		[`'not.contain.text', 't'`, `.not.toContainText('t')`],
		[`'have.value', 'v'`, `.toHaveValue('v')`],
		[`'have.id', 'v'`, `.toHaveId('v')`],
		[`'have.class', 'ng-touched'`, `.toHaveClass(/(^|\\s)ng-touched(\\s|$)/)`],
		[`'have.class', 'a.b'`, `.toHaveClass(/(^|\\s)a\\.b(\\s|$)/)`],
		[`'be.disabled'`, `.toBeDisabled()`],
		[`'not.be.disabled'`, `.not.toBeDisabled()`],
		[`'be.enabled'`, `.toBeEnabled()`],
		[`'be.checked'`, `.toBeChecked()`],
		[`'be.empty'`, `.toBeEmpty()`],
		[`'have.css', 'color', 'red'`, `.toHaveCSS('color', 'red')`],
		[`'have.prop', 'checked', true`, `.toHaveJSProperty('checked', true)`],
	];
	for (const [args, matcher] of rows) {
		it(`should(${args})`, () => converts(`${L}.should(${args});`, `${E}${matcher};`));
	}
	it('and() is the same as should()', () =>
		converts(`${L}.should('be.visible').and('have.text', 'x');`, [`${E}.toBeVisible();`, `${E}.toHaveText('x');`]));
	it('the class regex is a valid RegExp that matches whole class names', () => {
		const r = converts(`${L}.should('have.class', 'a.b');`, `${E}.toHaveClass(/(^|\\s)a\\.b(\\s|$)/);`);
		const re = eval(/toHaveClass\((.*)\);/.exec(r.code)?.[1] ?? '');
		assert.ok(re.test('x a.b y') && !re.test('xa.b') && !re.test('aXb'));
	});
	/** @type {[string, string][]} */
	const unsupported = [
		[`'have.length.greaterThan', 1`, 'have.length.greaterThan'],
		[`'have.length.gt', 1`, 'have.length.gt'],
		[`'have.data', 'k', 'v'`, 'have.data'],
		[`'match', /x/`, 'match'],
		[`'equal', 1`, 'equal'],
		[`'contain.value', 'x'`, 'contain.value'],
		[`'have.attr', 'k', /v/`, 'have.attr'],
		[`'have.class', 'a b'`, 'have.class'],
		[`'have.text', someVar`, 'non-literal argument'],
	];
	for (const [args, reason] of unsupported) {
		it(`should(${args}) is unsupported`, () => skips(`${L}.should(${args});`, reason));
	}
	it('should(callback) is unsupported', () =>
		skips(`${L}.should(($el) => expect($el).to.exist);`, 'assertion callback'));
	it('assertions after a subject-changing chainer are unsupported', () =>
		skips(`${L}.should('have.attr', 'href').and('include', 'x');`, 'subject-changing'));
});

describe('unsupported constructs', () => {
	for (const [code, reason] of [
		[`cy.get('a').then(($a) => $a);`, 'unsupported command .then'],
		[`cy.get('a').each(($a) => cy.wrap($a).click());`, 'unsupported command .each'],
		[`cy.get('a').invoke('val');`, 'unsupported command .invoke'],
		[`cy.get('a').its('length');`, 'unsupported command .its'],
		[`cy.get('a').within(() => cy.get('b'));`, 'unsupported command .within'],
		[`cy.wrap(1).should('equal', 1);`, 'unsupported command cy.wrap'],
		[`cy.window().then(() => {});`, 'unsupported command cy.window'],
		[`cy.document().then(() => {});`, 'unsupported command cy.document'],
		[`cy.scrollTo(0, 100);`, 'unsupported command cy.scrollTo'],
		[`cy.contains('x').click();`, 'unsupported command cy.contains'],
		[`Cypress.$('a');`, 'unsupported Cypress.$'],
		[`expect(1).to.equal(1);`, 'unsupported call expect()'],
		[`const el = document.body;`, 'unsupported variable declaration'],
		[`if (true) { cy.get('a'); }`, 'unsupported if statement'],
	]) {
		it(code, () => skips(code, reason));
	}
	it('the original code is preserved and */ is made safe', () => {
		const r = skips(`cy.get('a').then(() => { /* x */ });`, '.then');
		assert.ok(r.code.includes(`cy.get('a').then(() => { /* x *\\/ });`));
		assert.ok(r.code.includes('// SKIPPED by the transform: unsupported command .then'));
	});
	it('all reasons are listed, in order', () => {
		const r = skips(`cy.window();\ncy.get('a').then(() => {});`, 'cy.window');
		assert.deepEqual(r.tests[0].reasons, ['unsupported command cy.window', 'unsupported command .then']);
	});
	it('a skipped test does not pull imports into the file', () => {
		const r = skips(`cy.visit('/iframe.html?id=a');\ncy.get('a').then(() => {});`, '.then');
		assert.match(r.code, /import \{ test \} from '\.\.\/support';/);
	});
});

describe('literal consts', () => {
	it('test-local literal consts are kept and may be used as arguments', () =>
		converts(`const name = 'John';\ncy.get('#a').type(name);`, [
			`const name = 'John';`,
			`await page.locator('#a').pressSequentially(name);`,
		]));
	it('a const that resolves to a special type sequence is still unsupported', () =>
		skips(`const k = '{enter}';\ncy.get('#a').type(k);`, 'special key sequences'));
	it('a const string used in findByText still gets exact', () =>
		converts(`const t = 'Open';\ncy.findByText(t).click();`, [`const t = 'Open';`, `await byText(page, t).click();`]));
});

describe('comments', () => {
	it('keeps comments between statements, including trailing ones', () => {
		const r = run(
			`\t\t// first\n\t\tcy.get('a').click(); // after\n\n\t\t/* block */\n\t\tcy.injectAxe();\n\t\t// last`,
		);
		const code = r.code;
		for (const c of ['// first', '// after', '/* block */', '// last']) assert.ok(code.includes(c), c);
	});
});
