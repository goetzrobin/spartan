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
 * A Cypress alias of a query (`cy.get(sel).as('name')`), emitted as `const name = <locator>;`.
 * `code` is the locator expression the const holds, `uses` the support-module names it needs.
 * @typedef {{ code: string, many: boolean, singular: boolean, uses: string[] }} Alias
 */

/**
 * Aliases one body can see.
 * @typedef {object} AliasScope
 * @property {Map<string, Alias>} local defined earlier in the same test, hook or helper body
 * @property {Map<string, Alias | string>} inherited defined by a `beforeEach` of an enclosing describe, by name;
 *   a string is the reason the hook's alias cannot be used in a test
 * @property {string[]} usedInherited inherited aliases the body used, in order of first use
 * @property {Map<string, Alias>} exported aliases a hook defines with a plain query of literals
 * @property {(name: string) => string | null} problem why `name` cannot be a const in the output, or null
 */

/**
 * @typedef {object} Env
 * @property {import('./util.mjs').ConstLookup} localConsts `const`s with a literal value that the output declares too
 * @property {Set<string>} uses support-module names used by the emitted code
 * @property {(expr: ts.Expression) => ValueInfo | null} [value] resolves a simple value, null when it is not one
 * @property {AliasScope} [aliases] aliases; without it `.as` and `cy.get('@name')` are unsupported
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

/**
 * Assertions after which Cypress changes the subject to a value (attribute, property, css).
 * For `have.attr` that is only so with one argument: Cypress's chai-jquery `attr` sets the subject
 * to the attribute's value when called with a name alone and keeps the element when also given a
 * value (packages/driver/src/cypress/chai_jquery.ts, `if (arguments.length === 1) this._obj = actual`).
 */
const SUBJECT_CHANGING = new Set(['have.attr', 'have.prop', 'have.css']);

/** Cypress `.type()` key sequences whose Playwright key name is certain. */
const TYPE_KEYS = /** @type {Record<string, string>} */ ({
	enter: 'Enter',
	esc: 'Escape',
	backspace: 'Backspace',
	del: 'Delete',
	downarrow: 'ArrowDown',
	downArrow: 'ArrowDown',
	uparrow: 'ArrowUp',
	upArrow: 'ArrowUp',
	leftarrow: 'ArrowLeft',
	leftArrow: 'ArrowLeft',
	rightarrow: 'ArrowRight',
	rightArrow: 'ArrowRight',
	home: 'Home',
	end: 'End',
	pageup: 'PageUp',
	pageUp: 'PageUp',
	pagedown: 'PageDown',
	pageDown: 'PageDown',
});

/**
 * Keys whose effect in a text field depends on where the caret is. When `.type()` focuses a field,
 * Cypress puts the caret at the end of its text, Playwright's `press` and `pressSequentially` at
 * the start (`setSelectionRange(0, 0)` on an input that was not focused), so `{backspace}` on a
 * filled input deletes the last character in Cypress and nothing in Playwright.
 */
const CARET_KEYS = new Set(['backspace', 'del', 'leftarrow', 'leftArrow', 'rightarrow', 'rightArrow']);

/** @param {string} s */
const escapeRegex = (s) => s.replace(/[.*+?^${}()|[\]\\/]/g, '\\$&');

/**
 * A selector made of one compound selector: no combinator, comma or whitespace outside brackets,
 * parentheses and quotes. `:scope > ` in front of it then means "a child that matches it".
 * @param {string} sel
 */
function isCompound(sel) {
	let depth = 0;
	/** @type {string | null} */
	let q = null;
	for (let i = 0; i < sel.length; i++) {
		const c = sel[i];
		if (q) {
			if (c === '\\') i++;
			else if (c === q) q = null;
			continue;
		}
		if (c === '\\') i++;
		else if (c === '"' || c === "'") q = c;
		else if (c === '[' || c === '(') depth++;
		else if (c === ']' || c === ')') depth--;
		else if (depth === 0 && /[\s,>+~]/.test(c)) return false;
	}
	return depth === 0 && q === null;
}

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
 * Convert `.contains(text)` on `scope` (`page` for `cy.contains`). Returns the locator or a reason.
 *
 * Cypress's `contains` tests each element's text (textContent with runs of whitespace collapsed to
 * one space) and yields the first match in document order, then the deepest match inside it.
 * Playwright's `getByText(regex)` tests each element's raw text, keeps the scope element and the
 * elements in it that match while no child element matches, so `.first()` is that same element as
 * long as an element's text matching implies its parent's text matches too. That holds when the
 * pattern does not depend on whitespace, anchors or word boundaries: a string becomes a case-
 * sensitive substring pattern with each space matching a run of whitespace; a RegExp is only taken
 * when it is plain text (letters, digits, `_`, `-`, escaped punctuation), optionally with `i`.
 *
 * One known difference: Cypress yields an enclosing `button`, `a`, `label` or submit input instead
 * of the deepest element when there is one. Only a click and the checks for existence and
 * visibility may follow, where that difference does not change the outcome: a click on the text
 * inside a button lands on the same control.
 * @param {string} scope
 * @param {ts.Expression[]} args
 * @param {Env} env
 * @param {string} name
 * @returns {string | { reason: string }}
 */
function contains(scope, args, env, name) {
	if (args.length !== 1) return { reason: `unsupported arguments to ${name}` };
	const lit = literal(args[0], env.localConsts);
	if (!lit || (lit.kind !== 'string' && lit.kind !== 'regex')) return { reason: `non-literal text in ${name}` };
	if (lit.kind === 'string') {
		const text = /** @type {string} */ (lit.value);
		if (!text || /[^\S ]| {2}/.test(text)) return { reason: `unsupported text in ${name} ${quote(text)}` };
		return `${scope}.getByText(/${escapeRegex(text).replace(/ /g, '\\s+')}/).first()`;
	}
	const src = /** @type {string} */ (lit.value);
	const slash = src.lastIndexOf('/');
	const body = src.slice(1, slash);
	const flags = src.slice(slash + 1);
	if (!/^(?:[A-Za-z0-9_-]|\\[^A-Za-z0-9\s])+$/.test(body) || !/^i?$/.test(flags))
		return { reason: `unsupported pattern in ${name} ${src}` };
	return `${scope}.getByText(${lit.text}).first()`;
}

/**
 * What may follow `.contains` (see `contains`).
 * @param {Link} link
 */
function allowedAfterContains(link) {
	if (link.name === 'click') return link.args.length === 0;
	if (link.name !== 'should' && link.name !== 'and') return false;
	const ch = link.args.length === 1 ? literal(link.args[0]) : null;
	return !!ch && (ch.value === 'be.visible' || ch.value === 'exist');
}

/**
 * Convert `.type(text)`. Plain text is typed; Cypress's special sequences (`{enter}`) become key
 * presses, in order. Returns the statements or a reason.
 * @param {ts.Expression[]} args
 * @param {string} loc
 * @param {Env} env
 * @returns {string[] | { reason: string }}
 */
function typeText(args, loc, env) {
	const fail = { reason: 'unsupported arguments to .type' };
	if (args.length !== 1) return fail;
	const lit = literal(args[0], env.localConsts);
	/** @param {unknown} s */
	const plain = (s) => typeof s === 'string' && s.length > 0 && !/[{}\n\r]/.test(s);
	if (!lit) {
		// A parameter or const: only when every value it can have is plain text.
		const v = argOf(args[0], env);
		if (!v || !only(v, ['string']) || !v.values) return fail;
		if (!v.values.every(plain)) return { reason: 'type with special key sequences' };
		return [`await ${loc}.pressSequentially(${v.text});`];
	}
	if (lit.kind !== 'string') return fail;
	const text = /** @type {string} */ (lit.value);
	if (plain(text)) return [`await ${loc}.pressSequentially(${lit.text});`];
	if (!text || /[\n\r]/.test(text)) return { reason: 'type with special key sequences' };
	/** @type {string[]} */
	const out = [];
	const re = /\{([^{}]*)\}|([^{}]+)|([{}])/g;
	for (let m = re.exec(text); m; m = re.exec(text)) {
		if (m[2] !== undefined) out.push(`await ${loc}.pressSequentially(${quote(m[2])});`);
		else if (m[1] !== undefined && CARET_KEYS.has(m[1]))
			return { reason: `key sequence ${quote(m[0])} in .type depends on the caret position` };
		else if (m[1] !== undefined && Object.hasOwn(TYPE_KEYS, m[1]))
			out.push(`await ${loc}.press(${quote(TYPE_KEYS[m[1]])});`);
		else return { reason: `unsupported key sequence ${quote(m[0])} in .type` };
	}
	return out;
}

/**
 * Convert an assertion on an attribute's value, after `should('have.attr', name)` made it the
 * subject. The attribute is read from `first`. Returns the statement or a reason.
 * @param {ts.Expression[]} args
 * @param {{ name: string, first: string }} attr
 * @param {Env} env
 * @returns {string | { reason: string }}
 */
function attrValueAssertion(args, attr, env) {
	const ch = args.length ? literal(args[0]) : null;
	if (!ch || ch.kind !== 'string') return { reason: 'unsupported assertion on an attribute value' };
	const chainer = /** @type {string} */ (ch.value);
	const bad = { reason: `unsupported assertion '${chainer}' on an attribute value` };
	const rest = args.slice(1);
	/** @param {string} value */
	const out = (value) => `await expect(${attr.first}).toHaveAttribute(${attr.name}, ${value});`;
	env.uses.add('expect');
	if (chainer === 'not.be.empty') return rest.length === 0 ? out('/[\\s\\S]/') : bad;
	if (rest.length !== 1) return bad;
	switch (chainer) {
		case 'equal':
		case 'equals':
		case 'eq': {
			const v = argOf(rest[0], env);
			return v && only(v, ['string']) ? out(v.text) : bad;
		}
		case 'match': {
			const re = literal(rest[0], env.localConsts);
			if (!re || re.kind !== 'regex' || /[gy]/.test(String(re.value).slice(String(re.value).lastIndexOf('/'))))
				return bad;
			return out(re.text);
		}
		case 'contain':
		case 'include': {
			const s = literal(rest[0], env.localConsts);
			if (!s || s.kind !== 'string' || !s.value || /[\n\r\u2028\u2029]/.test(String(s.value))) return bad;
			return out(`/${escapeRegex(/** @type {string} */ (s.value))}/`);
		}
	}
	return bad;
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
 * @returns {{ statement: string, chainer: string, attr?: { name: string, first: string } } | string}
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
			if (arity(1, 'string'))
				return {
					...onFirst(`toHaveAttribute(${vals[0].text})`),
					attr: negated ? undefined : { name: vals[0].text, first },
				};
			if (arity(2, 'string')) return onFirst(`toHaveAttribute(${vals[0].text}, ${vals[1].text})`);
			// Cypress compares an attribute with a finite number as the number's string
			// (chai_jquery.ts: `if (acc === 'attr') val = maybeCastNumberToString(val)`).
			if (
				vals.length === 2 &&
				only(vals[0], ['string']) &&
				vals[1].lit?.kind === 'number' &&
				Number.isFinite(vals[1].lit.value)
			)
				return onFirst(`toHaveAttribute(${vals[0].text}, ${quote(String(vals[1].lit.value))})`);
			return bad;
		case 'have.length':
			if (
				arity(1, 'number') &&
				vals[0].values !== null &&
				vals[0].values.every((n) => Number.isInteger(n) && /** @type {number} */ (n) >= 0)
			)
				return out(`toHaveCount(${vals[0].text})`);
			return bad;
		case 'have.length.gt':
		case 'have.length.greaterThan':
		case 'have.length.above':
		case 'have.length.gte':
		case 'have.length.at.least':
		case 'have.length.least': {
			// "more than n" is "element n (counted from 0) exists", which retries like Cypress does.
			// Only the positive forms: the negated ones allow zero elements, where Cypress's own
			// check that the query found something may also apply.
			const n = vals.length === 1 ? vals[0].lit : null;
			if (negated || !n || n.kind !== 'number') return bad;
			const count = /** @type {number} */ (n.value);
			const atLeast = /gte|least/.test(chainer);
			const index = atLeast ? count - 1 : count;
			if (!Number.isInteger(count) || index < 0) return bad;
			if (index === 0) return { statement: `await expect(${loc}).not.toHaveCount(0);`, chainer };
			return { statement: `await expect(${loc}.nth(${index})).toBeAttached();`, chainer };
		}
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
		case 'include.text': {
			if (!arity(1, 'string')) return bad;
			// With several elements jQuery joins their text, so the assertion holds when any of them
			// contains the string. Playwright would refuse the locator as ambiguous.
			const wanted = vals[0].lit?.value;
			if (many && typeof wanted === 'string' && wanted.length > 0) {
				const escaped = wanted.replace(/[.*+?^${}()|[\]\\/]/g, '\\$&');
				const filtered = `${loc}.filter({ hasText: /${escaped}/ })`;
				return {
					statement: `await expect(${filtered})${negated ? '' : '.not'}.toHaveCount(0);`,
					chainer,
				};
			}
			return out(`toContainText(${vals[0].text})`);
		}
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
 * @returns {string | string[] | { reason: string }}
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
		case 'type':
			return typeText(args, loc, env);
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
	/** Set after `should('have.attr', name)`: the subject is that attribute's value. */
	/** @type {{ name: string, first: string } | null} */
	let attrValue = null;
	/** Set after `.contains`: only what `allowedAfterContains` accepts may follow. */
	let afterContains = false;
	/** An action or assertion was emitted: an alias here would not be a plain query. */
	let acted = false;
	/** Every query so far has literal arguments only (an alias a hook can hand to its tests). */
	let literalQuery = true;

	/**
	 * `cy.get('@name')` / `.get('@name')`: the const the alias was emitted as, a reason, or null
	 * when the argument is not an alias.
	 * @param {ts.Expression[]} args
	 * @returns {Alias | string | null}
	 */
	const aliasRef = (args) => {
		const lit = args.length === 1 ? literal(args[0], env.localConsts) : null;
		if (!lit || lit.kind !== 'string' || !String(lit.value).startsWith('@')) return null;
		const name = String(lit.value).slice(1);
		const a = env.aliases;
		const local = a?.local.get(name);
		if (local) return { ...local, code: name };
		const inherited = a?.inherited.get(name);
		if (typeof inherited === 'string') return inherited;
		if (inherited && a) {
			if (!a.usedInherited.includes(name)) a.usedInherited.push(name);
			for (const u of inherited.uses) env.uses.add(u);
			return { ...inherited, code: name };
		}
		return `alias selector ${quote(String(lit.value))}`;
	};
	/** @param {Link} link */
	const isLiteralLink = (link) => link.args.every((a) => isLiteralTree(a));

	if (first.name === 'get') {
		const alias = aliasRef(first.args);
		if (typeof alias === 'string') return fail(alias);
		if (alias) {
			loc = alias.code;
			many = alias.many;
			singular = alias.singular;
			literalQuery = false;
		} else {
			const r = selectorArg(first.args, env, 'cy.get');
			if (typeof r === 'string') return fail(r);
			loc = `page.locator(${r.code})`;
			many = r.many;
		}
	} else if (first.name === 'focused') {
		if (first.args.length) return fail('unsupported arguments to cy.focused');
		loc = `page.locator(':focus')`;
	} else if (TL_QUERY.test(first.name)) {
		const r = tlQuery(first.name, first.args, env);
		if (typeof r === 'string') return fail(r);
		loc = queryOn('page', r, env);
		singular = r.singular;
		many = !r.singular;
	} else if (first.name === 'contains') {
		const r = contains('page', first.args, env, 'cy.contains');
		if (typeof r !== 'string') return fail(r.reason);
		loc = r;
		afterContains = true;
	} else {
		return fail(`unsupported command cy.${first.name}`);
	}
	if (!isLiteralLink(first)) literalQuery = false;

	for (const link of links.slice(1)) {
		const { name, args } = link;
		if (afterContains && !allowedAfterContains(link))
			return fail(`command .${name} after .contains (Cypress may yield the enclosing button, link or label)`);
		if (attrValue) {
			if (name !== 'should' && name !== 'and')
				return fail(`command .${name} after subject-changing assertion 'have.attr'`);
			const r = attrValueAssertion(args, attrValue, env);
			if (typeof r !== 'string') return fail(r.reason);
			statements.push(r);
			continue;
		}
		if (changedBy) return fail(`command .${name} after subject-changing assertion '${changedBy}'`);
		if (name === 'should' || name === 'and') {
			const r = assertion(name, args, loc, env, many);
			if (typeof r === 'string') return fail(r);
			statements.push(r.statement);
			if (r.chainer === 'have.attr') {
				// One argument: the subject becomes the attribute's value (see SUBJECT_CHANGING).
				if (args.length === 2) {
					if (r.attr) attrValue = r.attr;
					else changedBy = r.chainer;
				}
			} else if (SUBJECT_CHANGING.has(r.chainer)) changedBy = r.chainer;
			pending = false;
			acted = true;
			continue;
		}
		if (ACTIONS.has(name)) {
			const r = action(link, loc, env);
			if (typeof r === 'object' && !Array.isArray(r)) return fail(r.reason);
			statements.push(...(Array.isArray(r) ? r : [r]));
			pending = false;
			acted = true;
			continue;
		}
		if (name === 'as') {
			const a = env.aliases;
			const lit = args.length === 1 ? literal(args[0]) : null;
			if (!a || !lit || lit.kind !== 'string') return fail('unsupported arguments to .as');
			const alias = String(lit.value);
			if (acted) return fail(`alias '${alias}' of a subject after an action or assertion`);
			if (a.local.has(alias) || a.inherited.has(alias)) return fail(`alias '${alias}' defined twice`);
			const problem = a.problem(alias);
			if (problem) return fail(problem);
			/** @type {Alias} */
			const info = {
				code: loc,
				many,
				singular,
				uses: ['STORY_ROOT', 'byText'].filter((u) => new RegExp(`\\b${u}\\b`).test(loc)),
			};
			a.local.set(alias, info);
			if (literalQuery) a.exported.set(alias, info);
			statements.push(`const ${alias} = ${loc};`);
			// Cypress re-runs an alias's query each time it is used, as a Playwright locator does.
			loc = alias;
			continue;
		}
		if (!isLiteralLink(link)) literalQuery = false;
		// Queries on the subject.
		if (name === 'get') {
			// `.get()` ignores the subject and queries the whole document.
			const alias = aliasRef(args);
			if (typeof alias === 'string') return fail(alias);
			if (alias) {
				loc = alias.code;
				singular = alias.singular;
				many = alias.many;
				literalQuery = false;
			} else {
				const r = selectorArg(args, env, '.get');
				if (typeof r === 'string') return fail(r);
				loc = `page.locator(${r.code})`;
				singular = false;
				many = r.many;
			}
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
		} else if (name === 'contains') {
			const r = contains(loc, args, env, '.contains');
			if (typeof r !== 'string') return fail(r.reason);
			loc = r;
			singular = false;
			many = false;
			afterContains = true;
		} else if (name === 'children') {
			// jQuery's `.children(sel)`: the child elements of each subject that match `sel`.
			if (args.length === 0) {
				loc = `${loc}.locator(':scope > *')`;
			} else {
				const sel = args.length === 1 ? literal(args[0], env.localConsts) : null;
				if (!sel || sel.kind !== 'string') return fail('unsupported arguments to .children');
				const value = String(sel.value);
				const problem = selectorProblem(value);
				if (problem) return fail(problem);
				if (value.includes('storybook-root') || value.includes(':scope') || !isCompound(value))
					return fail(`unsupported selector in .children ${quote(value)}`);
				loc = `${loc}.locator(${quote(`:scope > ${value}`)})`;
			}
			singular = false;
			many = true;
		} else if (name === 'filter') {
			// jQuery's `.filter(sel)` keeps the subjects that match `sel`, which is what intersecting
			// with every element of the page that matches it does.
			if (args.length === 1 && (ts.isArrowFunction(args[0]) || ts.isFunctionExpression(args[0])))
				return fail('unsupported callback in .filter');
			const sel = args.length === 1 ? literal(args[0], env.localConsts) : null;
			if (!sel || sel.kind !== 'string') return fail('unsupported arguments to .filter');
			const value = String(sel.value);
			const problem = selectorProblem(value);
			if (problem) return fail(problem);
			if (value.includes('storybook-root') || value.includes(':scope'))
				return fail(`unsupported selector in .filter ${quote(value)}`);
			loc = `${loc}.and(page.locator(${sel.text}))`;
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
