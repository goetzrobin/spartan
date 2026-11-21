import ts from 'typescript';
import { isLiteralTree, literal, propName, quote } from './util.mjs';

/**
 * Conversion of one Cypress command chain (`cy.x(...).y(...)...;`) into Playwright statements.
 *
 * Every branch either emits a translation listed in the mapping table or returns a reason.
 * Nothing is guessed: unknown commands, unknown options and non-literal arguments are reasons.
 */

/** @typedef {import('./util.mjs').Literal} Literal */

/**
 * What is known about a "simple value" (a helper parameter, a const, a template or object built
 * from those): the kinds of value it can have and, when known, every value it can have. A helper
 * parameter's values are the arguments passed at its call sites. `null` means not known.
 * @typedef {{ kinds: Set<string> | null, values: Literal[] | null }} ValueInfo
 */

/**
 * @typedef {object} Env
 * @property {import('./util.mjs').ConstLookup} localConsts `const`s with a literal value that the output declares too
 * @property {Set<string>} uses support-module names used by the emitted code
 * @property {(expr: ts.Expression) => ValueInfo | null} [value] resolves a simple value, null when it is not one
 */

/**
 * An argument that is a literal (possibly through a const) or a simple value of known kind.
 * @typedef {{ kinds: Set<string>, values: unknown[] | null, text: string, lit: Literal | null }} Arg
 */

/**
 * @param {ts.Expression} node
 * @param {Env} env
 * @returns {Arg | null}
 */
function argOf(node, env) {
	const lit = literal(node, env.localConsts);
	if (lit) return { kinds: new Set([lit.kind]), values: [lit.value], text: lit.text, lit };
	const v = env.value?.(node);
	if (!v || !v.kinds) return null;
	return { kinds: v.kinds, values: v.values && v.values.map((l) => l.value), text: node.getText(), lit: null };
}

/**
 * Every kind the argument can have is one of `kinds`.
 * @param {Arg} arg
 * @param {string[]} kinds
 */
function only(arg, kinds) {
	return [...arg.kinds].every((k) => kinds.includes(k));
}

/**
 * @typedef {object} ChainResult
 * @property {string[]} statements emitted statements, without indentation
 * @property {string | null} reason why the chain cannot be converted, or null
 */

const STORYBOOK_ROOT = '#storybook-root';

/** Keys known to both cypress-real-events and Playwright's keyboard, with the same meaning. */
const KEYS = new Set([
	'Tab',
	'Enter',
	'Space',
	'Escape',
	'Backspace',
	'Delete',
	'ArrowUp',
	'ArrowDown',
	'ArrowLeft',
	'ArrowRight',
	'Home',
	'End',
	'PageUp',
	'PageDown',
	'Insert',
	'Shift',
	'Control',
	'Alt',
	'Meta',
	...Array.from({ length: 12 }, (_, i) => `F${i + 1}`),
]);
const MODIFIERS = new Set(['Shift', 'Control', 'Alt', 'Meta']);

/** Testing Library query suffix -> Playwright method for the text-like queries. */
const TEXT_QUERIES = /** @type {Record<string, string>} */ ({
	Text: 'getByText',
	LabelText: 'getByLabel',
	PlaceholderText: 'getByPlaceholder',
	Title: 'getByTitle',
	AltText: 'getByAltText',
});
const TL_QUERY = /^find(All)?By(Text|LabelText|PlaceholderText|Title|AltText|Role|TestId)$/;

/** jQuery-only pseudo selectors (Sizzle extensions) that Playwright's CSS engine lacks or reads differently. */
const JQUERY_PSEUDO =
	/:(first|last|eq|gt|lt|even|odd|contains|visible|hidden|input|button|text|password|radio|checkbox|submit|image|reset|file|header|parent|animated|selected)(?![\w-])/;

/** Commands that stand alone on `cy` and do not yield a subject we model. */
const STANDALONE = new Set(['visit', 'injectAxe', 'checkA11y', 'viewport', 'wait', 'realPress', 'realType']);

/** Assertions after which Cypress changes the subject to a value (attribute, property, css). */
const SUBJECT_CHANGING = new Set(['have.attr', 'have.prop', 'have.css']);

/**
 * @typedef {{ name: string, args: ts.Expression[], node: ts.CallExpression }} Link
 */

/**
 * Flatten `cy.a(..).b(..)` into links. Returns null when the expression is not a call chain
 * rooted at the identifier `cy`.
 * @param {ts.Expression} expr
 * @returns {Link[] | null}
 */
export function flattenCyChain(expr) {
	/** @type {Link[]} */
	const links = [];
	let e = expr;
	while (ts.isCallExpression(e) && ts.isPropertyAccessExpression(e.expression) && !e.questionDotToken) {
		links.unshift({ name: e.expression.name.text, args: [...e.arguments], node: e });
		e = e.expression.expression;
	}
	if (links.length && ts.isIdentifier(e) && e.text === 'cy') return links;
	return null;
}

/**
 * Check a selector string passed to `cy.get` / `.find`. Returns a reason or null.
 * @param {string} sel
 */
function selectorProblem(sel) {
	if (sel.startsWith('@')) return `alias selector ${quote(sel)}`;
	if (sel !== STORYBOOK_ROOT && sel.includes('storybook-root')) return `selector mixes #storybook-root ${quote(sel)}`;
	if (JQUERY_PSEUDO.test(sel)) return `jQuery-only selector ${quote(sel)}`;
	if (sel.includes('>>') || /^\s*(\/|\.\.|[>+~])/.test(sel) || /^[\w+:*-]+=/.test(sel))
		return `selector not portable to Playwright ${quote(sel)}`;
	if (!sel.trim()) return 'empty selector';
	return null;
}

/**
 * @param {Literal} lit
 * @param {Env} env
 */
function selectorCode(lit, env) {
	if (lit.value === STORYBOOK_ROOT) {
		env.uses.add('STORY_ROOT');
		return 'STORY_ROOT';
	}
	return lit.text;
}

/**
 * Apply a converted Testing Library query to the thing it searches in (`page` or a locator).
 * @param {string} scope
 * @param {{ code: string, helper?: string }} query
 * @param {Env} env
 */
function queryOn(scope, query, env) {
	if (!query.helper) return `${scope}.${query.code}`;
	env.uses.add(query.helper);
	return `${query.helper}(${scope}, ${query.code})`;
}

/**
 * Convert a Testing Library query. Returns `{ code, singular }` or a reason string.
 * @param {string} name
 * @param {ts.Expression[]} args
 * @param {Env} env
 * @returns {{ code: string, singular: boolean, helper?: string } | string}
 */
function tlQuery(name, args, env) {
	const m = TL_QUERY.exec(name);
	if (!m) return `unsupported command .${name}`;
	const singular = !m[1];
	const kind = m[2];
	if (kind === 'Role') {
		if (args.length < 1 || args.length > 2) return `unsupported arguments to ${name}`;
		const role = literal(args[0], env.localConsts);
		if (!role || role.kind !== 'string') return `non-literal role in ${name}`;
		if (args.length === 1) return { code: `getByRole(${role.text})`, singular };
		const opts = args[1];
		if (!ts.isObjectLiteralExpression(opts)) return `non-literal options in ${name}`;
		/** @type {string[]} */
		const parts = [];
		for (const p of opts.properties) {
			if (!ts.isPropertyAssignment(p)) return `unsupported option syntax in ${name}`;
			const key = propName(p.name);
			const val = literal(p.initializer, env.localConsts);
			if (key === 'name' && !val) {
				// A parameter or const: `exact` makes a string match exactly and is ignored for a RegExp.
				const v = argOf(p.initializer, env);
				if (!v || !only(v, ['string', 'regex'])) return `non-literal option in ${name}`;
				parts.push(`name: ${v.text}`, 'exact: true');
				continue;
			}
			if (key === null || !val) return `non-literal option in ${name}`;
			if (key === 'name') {
				if (val.kind === 'string') parts.push(`name: ${val.text}`, 'exact: true');
				else if (val.kind === 'regex') parts.push(`name: ${val.text}`);
				else return `unsupported name option in ${name}`;
			} else if (key === 'hidden') {
				if (val.kind !== 'boolean') return `unsupported hidden option in ${name}`;
				parts.push(`includeHidden: ${val.text}`);
			} else if (['selected', 'checked', 'pressed', 'expanded'].includes(key)) {
				if (val.kind !== 'boolean') return `unsupported ${key} option in ${name}`;
				parts.push(`${key}: ${val.text}`);
			} else if (key === 'level') {
				if (val.kind !== 'number') return `unsupported level option in ${name}`;
				parts.push(`level: ${val.text}`);
			} else {
				return `unsupported option '${key}' in ${name}`;
			}
		}
		return {
			code: parts.length ? `getByRole(${role.text}, { ${parts.join(', ')} })` : `getByRole(${role.text})`,
			singular,
		};
	}
	if (args.length !== 1) return `unsupported arguments to ${name}`;
	const arg = literal(args[0], env.localConsts);
	if (!arg) {
		// A parameter or const holding a string or a RegExp. `byText` takes both; Playwright ignores
		// `exact` for a RegExp, so `exact: true` is right for either.
		const v = argOf(args[0], env);
		if (!v || !only(v, ['string', 'regex'])) return `non-literal argument to ${name}`;
		if (kind === 'TestId') return { code: `getByTestId(${v.text})`, singular };
		if (kind === 'Text') return { helper: 'byText', code: v.text, singular };
		return { code: `${TEXT_QUERIES[kind]}(${v.text}, { exact: true })`, singular };
	}
	if (arg.kind !== 'string' && arg.kind !== 'regex') return `non-literal argument to ${name}`;
	if (kind === 'TestId') return { code: `getByTestId(${arg.text})`, singular };
	// Testing Library matches an element by its OWN text ("Print" in `<button>Print <kbd>P</kbd></button>`),
	// Playwright's getByText by the element's whole text. `byText` in the support module keeps the
	// Testing Library meaning, for strings (exact) and regular expressions alike.
	if (kind === 'Text') return { helper: 'byText', code: arg.text, singular };
	const method = TEXT_QUERIES[kind];
	return {
		code: arg.kind === 'string' ? `${method}(${arg.text}, { exact: true })` : `${method}(${arg.text})`,
		singular,
	};
}

/**
 * A selector argument. `many` is set when it can match several elements.
 * @param {ts.Expression[]} args
 * @param {Env} env
 * @param {string} name
 * @returns {{ code: string, many: boolean } | string}
 */
function selectorArg(args, env, name) {
	if (args.length !== 1) return `unsupported arguments to ${name}`;
	const lit = literal(args[0], env.localConsts);
	if (lit) {
		if (lit.kind !== 'string') return `non-literal selector in ${name}`;
		const problem = selectorProblem(/** @type {string} */ (lit.value));
		if (problem) return problem;
		const code = selectorCode(lit, env);
		return { code, many: !isPlainId(code) };
	}
	// A parameter or const: every value it can have (from the call sites) must be a usable
	// selector. That also refuses a helper that some call site passes a Cypress alias.
	const v = argOf(args[0], env);
	if (!v || !only(v, ['string']) || !v.values) return `non-literal selector in ${name}`;
	for (const value of v.values) {
		const sel = String(value);
		const problem = selectorProblem(sel);
		if (problem) return problem;
		if (sel === STORYBOOK_ROOT) return `selector ${quote(sel)} passed as a value`;
	}
	// `#${id}` can only match one element when every id it is built from is a plain id.
	const node = args[0];
	const single =
		ts.isTemplateExpression(node) &&
		node.head.text === '#' &&
		node.templateSpans.length === 1 &&
		node.templateSpans[0].literal.text === '' &&
		v.values.every((value) => /^#[\w-]+$/.test(String(value)));
	return { code: v.text, many: !single };
}

/**
 * Convert a key (or key combination) for `realPress`. Returns `{ key }` or a reason.
 * @param {ts.Expression} arg
 * @param {Env} env
 * @returns {{ key: string } | string}
 */
function realPressKey(arg, env) {
	/** @param {unknown} k */
	const valid = (k) => typeof k === 'string' && (KEYS.has(k) || /^[a-zA-Z0-9]$/.test(k));
	if (ts.isArrayLiteralExpression(arg)) {
		const keys = arg.elements.map((e) => literal(e, env.localConsts));
		if (keys.some((k) => !k || k.kind !== 'string')) return 'non-literal key in realPress';
		const values = keys.map((k) => /** @type {string} */ (k?.value));
		const bad = values.find((k) => !valid(k));
		if (bad !== undefined) return `unsupported key ${quote(bad)}`;
		if (values.length === 0) return 'empty key list in realPress';
		const mods = values.slice(0, -1);
		if (mods.some((k) => !MODIFIERS.has(k)) || (values.length > 1 && MODIFIERS.has(values[values.length - 1])))
			return `unsupported key combination ${quote(values.join('+'))}`;
		return { key: values.join('+') };
	}
	const lit = literal(arg, env.localConsts);
	if (!lit || lit.kind !== 'string') return 'non-literal key in realPress';
	if (!valid(lit.value)) return `unsupported key ${quote(/** @type {string} */ (lit.value))}`;
	return { key: /** @type {string} */ (lit.value) };
}

/**
 * Standalone `cy.<cmd>(...)` commands.
 * @param {Link} link
 * @param {Env} env
 * @returns {{ statements: string[] } | string}
 */
function standalone(link, env) {
	const { name, args } = link;
	switch (name) {
		case 'visit': {
			if (args.length !== 1) return 'unsupported arguments to cy.visit';
			const url = literal(args[0], env.localConsts);
			if (!url || url.kind !== 'string') return 'non-literal URL in cy.visit';
			const m = /^\/iframe\.html\?id=([A-Za-z0-9_-]+)(?:&args=([^&#]*))?$/.exec(/** @type {string} */ (url.value));
			if (!m) return `unsupported visit URL ${quote(/** @type {string} */ (url.value))}`;
			env.uses.add('gotoStory');
			if (m[2] === undefined) return { statements: [`await gotoStory(page, ${quote(m[1])});`] };
			return { statements: [`await gotoStory(page, ${quote(m[1])}, { args: ${quote(m[2])} });`] };
		}
		case 'injectAxe':
			if (args.length) return 'unsupported arguments to cy.injectAxe';
			return { statements: [] };
		case 'checkA11y': {
			if (args.length > 2) return 'unsupported arguments to cy.checkA11y';
			env.uses.add('checkA11y');
			if (args.length === 0) return { statements: ['await checkA11y(page);'] };
			const sel = literal(args[0], env.localConsts);
			let selCode;
			if (sel && sel.kind === 'string') {
				if (sel.value !== STORYBOOK_ROOT && String(sel.value).includes('storybook-root'))
					return `selector mixes #storybook-root ${quote(String(sel.value))}`;
				selCode = selectorCode(sel, env);
			} else if (sel && (sel.kind === 'undefined' || sel.kind === 'null')) {
				selCode = sel.text;
			} else {
				return 'non-literal context in cy.checkA11y';
			}
			if (args.length === 1) return { statements: [`await checkA11y(page, ${selCode});`] };
			if (!isLiteralTree(args[1])) return 'non-literal options in cy.checkA11y';
			return { statements: [`await checkA11y(page, ${selCode}, ${args[1].getText()});`] };
		}
		case 'viewport': {
			const w = literal(args[0], env.localConsts);
			const h = literal(args[1], env.localConsts);
			if (args.length !== 2 || w?.kind !== 'number' || h?.kind !== 'number')
				return 'unsupported arguments to cy.viewport';
			return { statements: [`await page.setViewportSize({ width: ${w.text}, height: ${h.text} });`] };
		}
		case 'wait': {
			const n = literal(args[0], env.localConsts);
			if (args.length !== 1 || n?.kind !== 'number') return 'unsupported arguments to cy.wait';
			return { statements: [`await page.waitForTimeout(${n.text});`] };
		}
		case 'realPress': {
			if (args.length !== 1) return 'unsupported arguments to cy.realPress';
			const key = realPressKey(args[0], env);
			if (typeof key === 'string') return key;
			return { statements: [`await page.keyboard.press(${quote(key.key)});`] };
		}
		case 'realType': {
			const s = literal(args[0], env.localConsts);
			if (args.length !== 1 || s?.kind !== 'string') return 'unsupported arguments to cy.realType';
			if (/[{\n\r]/.test(String(s.value))) return 'realType with special key sequences';
			return { statements: [`await page.keyboard.type(${s.text});`] };
		}
	}
	return `unsupported command cy.${name}`;
}

/** `'#edit-profile'` can only match one element; any other selector may match several. */
function isPlainId(selectorCode) {
	return /^['"`]#[\w-]+['"`]$/.test(selectorCode) || selectorCode === 'STORY_ROOT';
}

/**
 * Convert `.should(chainer, ...args)` on locator `loc`. Returns the statement or a reason.
 * @param {string} cmd should | and
 * @param {ts.Expression[]} args
 * @param {string} loc
 * @param {Env} env
 * @param {boolean} [many] the subject can hold several elements
 * @returns {{ statement: string, chainer: string } | string}
 */
function assertion(cmd, args, loc, env, many = false) {
	if (!args.length) return `unsupported arguments to .${cmd}`;
	if (ts.isArrowFunction(args[0]) || ts.isFunctionExpression(args[0]))
		return `unsupported assertion callback .${cmd}(fn)`;
	const ch = literal(args[0]);
	if (!ch || ch.kind !== 'string') return `non-literal chainer in .${cmd}`;
	let chainer = /** @type {string} */ (ch.value);
	const negated = chainer.startsWith('not.');
	if (negated) chainer = chainer.slice(4);
	const rest = args.slice(1).map((a) => argOf(a, env));
	if (rest.some((r) => !r)) return `non-literal argument in assertion '${ch.value}'`;
	const vals = /** @type {Arg[]} */ (rest);
	const not = negated ? '.not' : '';
	const bad = `unsupported assertion '${ch.value}'`;
	/** @param {number} n @param {...string} kinds */
	const arity = (n, ...kinds) => vals.length === n && vals.every((v) => only(v, kinds));
	/** @param {string} matcher @param {string} [prefix] */
	const out = (matcher, prefix = not) => ({ statement: `await expect(${loc})${prefix}.${matcher};`, chainer });
	// jQuery reads an attribute, property, value, id or style from the FIRST matched element.
	const first = many ? `${loc}.first()` : loc;
	/** @param {string} matcher */
	const onFirst = (matcher) => ({ statement: `await expect(${first})${not}.${matcher};`, chainer });
	env.uses.add('expect');
	switch (chainer) {
		case 'have.attr':
			if (arity(1, 'string')) return onFirst(`toHaveAttribute(${vals[0].text})`);
			if (arity(2, 'string')) return onFirst(`toHaveAttribute(${vals[0].text}, ${vals[1].text})`);
			return bad;
		case 'have.length':
			if (
				arity(1, 'number') &&
				vals[0].values !== null &&
				vals[0].values.every((n) => Number.isInteger(n) && /** @type {number} */ (n) >= 0)
			)
				return out(`toHaveCount(${vals[0].text})`);
			return bad;
		case 'have.focus':
		case 'be.focused':
			if (!arity(0)) return bad;
			// With several elements jQuery asks whether ANY of them has focus.
			if (many) {
				return {
					statement: `await expect(${loc}.and(page.locator(':focus'))).toHaveCount(${negated ? 0 : 1});`,
					chainer,
				};
			}
			return out('toBeFocused()');
		case 'be.visible':
			if (!arity(0)) return bad;
			return negated ? out('toBeHidden()', '') : out('toBeVisible()');
		case 'exist':
			if (!arity(0)) return bad;
			return negated ? out('toHaveCount(0)', '') : out('toHaveCount(0)', '.not');
		case 'have.text':
			return arity(1, 'string') ? out(`toHaveText(${vals[0].text})`) : bad;
		case 'contain':
		case 'contain.text':
		case 'include.text':
			return arity(1, 'string') ? out(`toContainText(${vals[0].text})`) : bad;
		case 'have.value':
			return arity(1, 'string') ? onFirst(`toHaveValue(${vals[0].text})`) : bad;
		case 'have.id':
			return arity(1, 'string') ? onFirst(`toHaveId(${vals[0].text})`) : bad;
		case 'have.class': {
			// The class goes into a regex literal, so it must be known here.
			if (!arity(1, 'string') || !vals[0].lit) return bad;
			const cls = /** @type {string} */ (vals[0].lit.value);
			if (!cls || /\s/.test(cls)) return bad;
			const escaped = cls.replace(/[.*+?^${}()|[\]\\/]/g, '\\$&');
			return out(`toHaveClass(/(^|\\s)${escaped}(\\s|$)/)`);
		}
		case 'be.disabled':
			return arity(0) ? out('toBeDisabled()') : bad;
		case 'be.enabled':
			return arity(0) ? out('toBeEnabled()') : bad;
		case 'be.checked':
			return arity(0) ? out('toBeChecked()') : bad;
		case 'be.empty':
			return arity(0) ? out('toBeEmpty()') : bad;
		case 'have.css':
			return arity(2, 'string') ? onFirst(`toHaveCSS(${vals[0].text}, ${vals[1].text})`) : bad;
		case 'have.prop':
			return vals.length === 2 && only(vals[0], ['string']) && only(vals[1], ['string', 'number', 'boolean', 'null'])
				? onFirst(`toHaveJSProperty(${vals[0].text}, ${vals[1].text})`)
				: bad;
	}
	return bad;
}

/**
 * Convert an action applied to locator `loc`. Returns the statement or a reason.
 * @param {Link} link
 * @param {string} loc
 * @param {Env} env
 * @returns {string | { reason: string }}
 */
function action(link, loc, env) {
	const { name, args } = link;
	/** @param {string} r */
	const fail = (r) => ({ reason: r });
	const noArgs = () => args.length === 0;
	switch (name) {
		case 'click': {
			if (noArgs()) return `await ${loc}.click();`;
			const o = args[0];
			if (
				args.length === 1 &&
				ts.isObjectLiteralExpression(o) &&
				o.properties.length === 1 &&
				ts.isPropertyAssignment(o.properties[0]) &&
				propName(o.properties[0].name) === 'force' &&
				o.properties[0].initializer.kind === ts.SyntaxKind.TrueKeyword
			) {
				env.uses.add('forceClick');
				return `await forceClick(${loc});`;
			}
			return fail('unsupported arguments to .click');
		}
		case 'realClick': {
			// A real click from cypress-real-events moves the pointer to the element and presses, whatever
			// state the element is in (tests use it to click disabled controls). Playwright's click waits
			// for the element to be enabled unless forced, so `force` keeps the meaning.
			if (noArgs()) return `await ${loc}.click({ force: true });`;
			const o = args[0];
			if (args.length === 1 && ts.isObjectLiteralExpression(o) && o.properties.length === 1) {
				const p = o.properties[0];
				const v = ts.isPropertyAssignment(p) ? literal(p.initializer) : null;
				if (ts.isPropertyAssignment(p) && propName(p.name) === 'button' && v?.value === 'right')
					return `await ${loc}.click({ button: 'right', force: true });`;
			}
			return fail('unsupported arguments to .realClick');
		}
		case 'rightclick':
			return noArgs() ? `await ${loc}.click({ button: 'right' });` : fail('unsupported arguments to .rightclick');
		case 'dblclick':
			return noArgs() ? `await ${loc}.dblclick();` : fail('unsupported arguments to .dblclick');
		case 'realHover':
			return noArgs() ? `await ${loc}.hover({ force: true });` : fail('unsupported arguments to .realHover');
		case 'focus':
		case 'blur':
		case 'clear':
		case 'check':
		case 'uncheck':
			return noArgs() ? `await ${loc}.${name}();` : fail(`unsupported arguments to .${name}`);
		case 'scrollIntoView':
			return noArgs() ? `await ${loc}.scrollIntoViewIfNeeded();` : fail('unsupported arguments to .scrollIntoView');
		case 'select': {
			const v = literal(args[0], env.localConsts);
			if (args.length !== 1 || v?.kind !== 'string') return fail('unsupported arguments to .select');
			return `await ${loc}.selectOption(${v.text});`;
		}
		case 'type': {
			const v = literal(args[0], env.localConsts);
			if (args.length !== 1 || v?.kind !== 'string') return fail('unsupported arguments to .type');
			if (/[{\n\r]/.test(String(v.value))) return fail('type with special key sequences');
			return `await ${loc}.pressSequentially(${v.text});`;
		}
		case 'trigger': {
			const v = literal(args[0], env.localConsts);
			if (args.length !== 1 || v?.kind !== 'string') return fail('unsupported arguments to .trigger');
			return `await ${loc}.dispatchEvent(${v.text});`;
		}
	}
	return fail(`unsupported command .${name}`);
}

const ACTIONS = new Set([
	'click',
	'realClick',
	'rightclick',
	'dblclick',
	'realHover',
	'focus',
	'blur',
	'clear',
	'check',
	'uncheck',
	'scrollIntoView',
	'select',
	'type',
	'trigger',
]);

/**
 * Convert one cy chain.
 * @param {Link[]} links
 * @param {Env} env
 * @returns {ChainResult}
 */
export function convertChain(links, env) {
	/** @type {string[]} */
	const statements = [];
	/** @param {string} reason */
	const fail = (reason) => ({ statements: [], reason });
	const first = links[0];

	if (STANDALONE.has(first.name)) {
		if (links.length > 1) return fail(`unsupported command .${links[1].name} after cy.${first.name}`);
		const r = standalone(first, env);
		return typeof r === 'string' ? fail(r) : { statements: r.statements, reason: null };
	}

	/** Locator expression of the current subject. */
	let loc;
	/** Whether the last query yields at most one element per Testing Library (findBy*). */
	let singular = false;
	/**
	 * Whether the subject can hold several elements (findAll*, or a selector that is not a plain
	 * id). Cypress assertions then follow jQuery: an attribute is read from the first element and
	 * focus is true when any element has it. Playwright would refuse the locator as ambiguous.
	 */
	let many = false;
	/** A query was added and nothing has used it yet: a bare query is an existence assertion. */
	let pending = true;
	/** Set after an assertion that makes Cypress yield a value instead of the element. */
	let changedBy = null;

	if (first.name === 'get') {
		const r = selectorArg(first.args, env, 'cy.get');
		if (typeof r === 'string') return fail(r);
		loc = `page.locator(${r.code})`;
		many = r.many;
	} else if (first.name === 'focused') {
		if (first.args.length) return fail('unsupported arguments to cy.focused');
		loc = `page.locator(':focus')`;
	} else if (TL_QUERY.test(first.name)) {
		const r = tlQuery(first.name, first.args, env);
		if (typeof r === 'string') return fail(r);
		loc = queryOn('page', r, env);
		singular = r.singular;
		many = !r.singular;
	} else {
		return fail(`unsupported command cy.${first.name}`);
	}

	for (const link of links.slice(1)) {
		const { name, args } = link;
		if (changedBy) return fail(`command .${name} after subject-changing assertion '${changedBy}'`);
		if (name === 'should' || name === 'and') {
			const r = assertion(name, args, loc, env, many);
			if (typeof r === 'string') return fail(r);
			statements.push(r.statement);
			if (SUBJECT_CHANGING.has(r.chainer)) changedBy = r.chainer;
			pending = false;
			continue;
		}
		if (ACTIONS.has(name)) {
			const r = action(link, loc, env);
			if (typeof r !== 'string') return fail(r.reason);
			statements.push(r);
			pending = false;
			continue;
		}
		// Queries on the subject.
		if (name === 'get') {
			// `.get()` ignores the subject and queries the whole document.
			const r = selectorArg(args, env, '.get');
			if (typeof r === 'string') return fail(r);
			loc = `page.locator(${r.code})`;
			singular = false;
			many = r.many;
		} else if (name === 'find') {
			const r = selectorArg(args, env, '.find');
			if (typeof r === 'string') return fail(r);
			loc = `${loc}.locator(${r.code})`;
			singular = false;
			many = r.many;
		} else if (TL_QUERY.test(name)) {
			const r = tlQuery(name, args, env);
			if (typeof r === 'string') return fail(r);
			loc = queryOn(loc, r, env);
			singular = r.singular;
			many = !r.singular;
		} else if (name === 'first' || name === 'last') {
			if (args.length) return fail(`unsupported arguments to .${name}`);
			loc = `${loc}.${name}()`;
			singular = false;
			many = false;
		} else if (name === 'eq') {
			const n = args.length === 1 ? argOf(args[0], env) : null;
			if (!n || !only(n, ['number']) || !n.values || !n.values.every((v) => Number.isInteger(v)))
				return fail('unsupported arguments to .eq');
			loc = `${loc}.nth(${n.text})`;
			singular = false;
			many = false;
		} else if (name === 'parent') {
			if (args.length) return fail('unsupported arguments to .parent');
			loc = `${loc}.locator('..')`;
			singular = false;
		} else {
			return fail(`unsupported command .${name}`);
		}
		pending = true;
	}

	if (pending) {
		env.uses.add('expect');
		statements.push(singular ? `await expect(${loc}).toHaveCount(1);` : `await expect(${loc}).not.toHaveCount(0);`);
	}
	return { statements, reason: null };
}
