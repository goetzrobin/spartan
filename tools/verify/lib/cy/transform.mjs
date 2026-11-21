import ts from 'typescript';
import { convertChain, flattenCyChain } from './chain.mjs';
import {
	calleeText,
	dedent,
	indentComment,
	leadingComments,
	literal,
	propName,
	pushReason,
	quote,
	staticString,
	trailingComments,
} from './util.mjs';

/** @typedef {import('./chain.mjs').ValueInfo} ValueInfo */
/** @typedef {import('./chain.mjs').Env} Env */

/**
 * @typedef {object} TestRecord
 * @property {string} title static title, or the raw source of a non-static title
 * @property {string[]} describePath
 * @property {'converted' | 'skipped' | 'ported'} status
 * @property {string[]} reasons
 */

/**
 * @typedef {object} HelperReport
 * @property {string[]} emitted helpers written into the output, in source order
 * @property {{ name: string, reasons: string[] }[]} unsupported helpers that cannot be converted, in source order
 */

/**
 * @typedef {object} TransformResult
 * @property {string} code unformatted Playwright source
 * @property {TestRecord[]} tests
 * @property {HelperReport} helpers
 */

/**
 * A function declared at file or describe level: `const name = (...) => ...`,
 * `const name = function (...) {...}` or `function name(...) {...}`.
 * @typedef {object} Helper
 * @property {string} name
 * @property {ts.VariableDeclaration | ts.FunctionDeclaration} decl
 * @property {ts.Statement} stmt the statement that declares it
 * @property {ts.ArrowFunction | ts.FunctionExpression | ts.FunctionDeclaration} fn
 * @property {boolean} escapes referenced other than by calling it
 */

/**
 * @typedef {object} HelperResult
 * @property {boolean} ok
 * @property {string[]} reasons why it cannot be converted
 * @property {string[]} lines the emitted declaration
 * @property {Set<ts.Node>} refs file/describe-level declarations it uses
 * @property {Set<string>} uses support-module names its code uses
 */

/**
 * @typedef {object} BodyResult
 * @property {string[]} lines
 * @property {string[]} reasons
 * @property {boolean} usesPage
 * @property {boolean} hasStatements
 * @property {Set<ts.Node>} refs file/describe-level declarations the code uses
 */

/**
 * @typedef {object} TransformOptions
 * @property {string} sourcePath repo-relative path of the Cypress file, used in the header
 * @property {string} basename output basename, e.g. `popover` for popover.spec.ts
 * @property {Set<string>} [manualTitles] titles already ported by hand in `<basename>.manual.spec.ts`
 */

/**
 * @typedef {object} Scope
 * @property {string[]} describePath
 * @property {string[]} skipReasons reasons that skip every test in the scope
 */

const SUPPORT_NAMES = ['STORY_ROOT', 'byText', 'checkA11y', 'expect', 'forceClick', 'gotoStory', 'test'];
/** Names the generated file binds itself; a helper, parameter or const may not use them. */
const RESERVED = new Set([...SUPPORT_NAMES, 'page', 'Page']);
/** Operators allowed in the condition of an `if` inside a helper. */
const CONDITION_OPERATORS = new Set([
	ts.SyntaxKind.EqualsEqualsEqualsToken,
	ts.SyntaxKind.ExclamationEqualsEqualsToken,
	ts.SyntaxKind.EqualsEqualsToken,
	ts.SyntaxKind.ExclamationEqualsToken,
	ts.SyntaxKind.LessThanToken,
	ts.SyntaxKind.LessThanEqualsToken,
	ts.SyntaxKind.GreaterThanToken,
	ts.SyntaxKind.GreaterThanEqualsToken,
	ts.SyntaxKind.AmpersandAmpersandToken,
	ts.SyntaxKind.BarBarToken,
	ts.SyntaxKind.QuestionQuestionToken,
]);
/** More possible values than this and a value counts as unknown. */
const MAX_VALUES = 64;
const IT_NAMES = new Set(['it', 'specify', 'test']);
const DESCRIBE_NAMES = new Set(['describe', 'context', 'suite']);
const HOOK_NAMES = new Set(['beforeEach', 'afterEach', 'before', 'after']);

/**
 * Split `it.only(...)` style callees into base name and modifier.
 * @param {ts.Expression} callee
 * @returns {{ base: string, modifier: string | null } | null}
 */
function calleeParts(callee) {
	if (ts.isIdentifier(callee)) return { base: callee.text, modifier: null };
	if (ts.isPropertyAccessExpression(callee) && ts.isIdentifier(callee.expression))
		return { base: callee.expression.text, modifier: callee.name.text };
	return null;
}

/**
 * Classify a statement at describe level.
 * @param {ts.Statement} stmt
 */
function classify(stmt) {
	if (!ts.isExpressionStatement(stmt) || !ts.isCallExpression(stmt.expression)) return null;
	const call = stmt.expression;
	const parts = calleeParts(call.expression);
	if (!parts) return null;
	const { base, modifier } = parts;
	if (DESCRIBE_NAMES.has(base) && (modifier === null || modifier === 'only' || modifier === 'skip'))
		return { kind: 'describe', call, modifier };
	if (IT_NAMES.has(base) && (modifier === null || modifier === 'only' || modifier === 'skip'))
		return { kind: 'it', call, modifier };
	if (HOOK_NAMES.has(base) && modifier === null) return { kind: 'hook', call, name: base };
	return null;
}

/**
 * An initializer is inert when evaluating it at definition time has no effect on the page:
 * functions, literals, literal containers and simple values.
 * @param {ts.Expression | undefined} e
 * @param {(e: ts.Expression) => boolean} simple
 * @returns {boolean}
 */
function isInert(e, simple) {
	if (!e) return true;
	if (ts.isArrowFunction(e) || ts.isFunctionExpression(e)) return true;
	if (literal(e) || staticString(e) !== null) return true;
	if (simple(e)) return true;
	if (ts.isAsExpression(e) || ts.isSatisfiesExpression(e) || ts.isParenthesizedExpression(e))
		return isInert(e.expression, simple);
	if (ts.isArrayLiteralExpression(e)) return e.elements.every((x) => !ts.isSpreadElement(x) && isInert(x, simple));
	if (ts.isObjectLiteralExpression(e))
		return e.properties.every((p) =>
			ts.isPropertyAssignment(p) ? isInert(p.initializer, simple) : ts.isMethodDeclaration(p),
		);
	return false;
}

/**
 * Whether an identifier is used as a value reference (not a property name or declaration name).
 * @param {ts.Identifier} id
 */
function isReference(id) {
	const p = id.parent;
	if (!p) return true;
	if (ts.isPropertyAccessExpression(p) && p.name === id) return false;
	if (ts.isPropertyAssignment(p) && p.name === id) return false;
	if ((ts.isVariableDeclaration(p) || ts.isParameter(p) || ts.isBindingElement(p)) && p.name === id) return false;
	if (ts.isBindingElement(p) && p.propertyName === id) return false;
	if ((ts.isFunctionDeclaration(p) || ts.isFunctionExpression(p) || ts.isMethodDeclaration(p)) && p.name === id)
		return false;
	if (ts.isPropertySignature(p) || ts.isTypeReferenceNode(p) || ts.isQualifiedName(p)) return false;
	if (ts.isLabeledStatement(p) || ts.isBreakOrContinueStatement(p)) return false;
	return true;
}

/**
 * The callback of a describe/it/hook call, if it has the plain `() => {}` / `function () {}` shape.
 * @param {ts.CallExpression} call
 * @param {number} index expected argument index of the callback
 */
function plainCallback(call, index) {
	if (call.arguments.length !== index + 1) return null;
	const fn = call.arguments[index];
	if (!ts.isArrowFunction(fn) && !ts.isFunctionExpression(fn)) return null;
	if (fn.parameters.length) return null;
	if (fn.modifiers?.some((m) => m.kind === ts.SyntaxKind.AsyncKeyword)) return null;
	if (fn.asteriskToken) return null;
	return fn;
}

/**
 * @param {ts.Node} node
 * @returns {boolean}
 */
function usesThis(node) {
	if (node.kind === ts.SyntaxKind.ThisKeyword) return true;
	if (ts.isFunctionDeclaration(node) || ts.isFunctionExpression(node)) return false;
	return ts.forEachChild(node, usesThis) ?? false;
}

/**
 * @param {ts.Node} node
 * @returns {boolean}
 */
function usesArguments(node) {
	if (ts.isIdentifier(node) && node.text === 'arguments' && isReference(node)) return true;
	return ts.forEachChild(node, usesArguments) ?? false;
}

/**
 * Describe a statement that is not a supported cy chain, for the skip reason.
 * @param {ts.Statement} stmt
 * @param {(id: ts.Identifier) => boolean} isOuter the identifier names a file/describe-level declaration
 */
function statementReason(stmt, isOuter) {
	if (ts.isExpressionStatement(stmt)) {
		let e = stmt.expression;
		while (ts.isCallExpression(e) || ts.isPropertyAccessExpression(e)) {
			if (ts.isIdentifier(e.expression)) {
				const name = e.expression.text;
				if (isOuter(e.expression)) return null; // reported as "uses helper"
				if (name === 'cy') break;
				if (name === 'Cypress') return `unsupported Cypress.${ts.isPropertyAccessExpression(e) ? e.name.text : '*'}`;
				return `unsupported call ${name}()`;
			}
			e = e.expression;
		}
		return `unsupported expression statement`;
	}
	if (ts.isVariableStatement(stmt)) return 'unsupported variable declaration';
	if (ts.isIfStatement(stmt)) return 'unsupported if statement';
	if (ts.isForStatement(stmt) || ts.isForOfStatement(stmt) || ts.isForInStatement(stmt) || ts.isWhileStatement(stmt))
		return 'unsupported loop';
	return `unsupported statement ${ts.SyntaxKind[stmt.kind]}`;
}

/**
 * The callback of a describe call that `block` reproduces.
 * @param {ts.Node | undefined} fn
 */
function isDescribeCallback(fn) {
	if (!fn || !(ts.isArrowFunction(fn) || ts.isFunctionExpression(fn))) return false;
	const call = fn.parent;
	if (!call || !ts.isCallExpression(call) || call.arguments[1] !== fn) return false;
	const parts = calleeParts(call.expression);
	return (
		!!parts &&
		DESCRIBE_NAMES.has(parts.base) &&
		(parts.modifier === null || parts.modifier === 'only' || parts.modifier === 'skip')
	);
}

/**
 * A statement directly in the file or directly in a describe callback.
 * @param {ts.Node} stmt
 */
function isScopeLevel(stmt) {
	const p = stmt.parent;
	if (!p) return false;
	if (ts.isSourceFile(p)) return true;
	return ts.isBlock(p) && isDescribeCallback(p.parent);
}

/**
 * How many describe callbacks a node is nested in: its indentation in the output.
 * @param {ts.Node} node
 */
function levelOf(node) {
	let depth = 0;
	for (let n = node.parent; n; n = n.parent) if (ts.isBlock(n) && isDescribeCallback(n.parent)) depth++;
	return depth;
}

/**
 * The statement of a `const` declaration with an initializer and a plain name, else null.
 * @param {ts.Node} decl
 * @returns {ts.VariableStatement | null}
 */
function constStatement(decl) {
	if (!ts.isVariableDeclaration(decl) || !ts.isIdentifier(decl.name) || !decl.initializer) return null;
	const list = decl.parent;
	if (!ts.isVariableDeclarationList(list) || !(list.flags & ts.NodeFlags.Const)) return null;
	return ts.isVariableStatement(list.parent) ? list.parent : null;
}

/**
 * @param {ts.Expression | undefined} e
 * @returns {e is ts.ArrowFunction | ts.FunctionExpression}
 */
function isFunctionInit(e) {
	return !!e && (ts.isArrowFunction(e) || ts.isFunctionExpression(e));
}

/**
 * Type annotations that mean the same thing in a Playwright spec: primitives, literal types,
 * RegExp, and unions, arrays and object types of those.
 * @param {ts.TypeNode} t
 * @returns {boolean}
 */
function typeOk(t) {
	switch (t.kind) {
		case ts.SyntaxKind.StringKeyword:
		case ts.SyntaxKind.NumberKeyword:
		case ts.SyntaxKind.BooleanKeyword:
		case ts.SyntaxKind.UndefinedKeyword:
		case ts.SyntaxKind.NullKeyword:
		case ts.SyntaxKind.AnyKeyword:
		case ts.SyntaxKind.UnknownKeyword:
		case ts.SyntaxKind.LiteralType:
			return true;
	}
	if (ts.isUnionTypeNode(t)) return t.types.every(typeOk);
	if (ts.isParenthesizedTypeNode(t)) return typeOk(t.type);
	if (ts.isArrayTypeNode(t)) return typeOk(t.elementType);
	if (ts.isTypeReferenceNode(t)) return ts.isIdentifier(t.typeName) && t.typeName.text === 'RegExp' && !t.typeArguments;
	if (ts.isTypeLiteralNode(t))
		return t.members.every((m) => ts.isPropertySignature(m) && !m.questionToken && (!m.type || typeOk(m.type)));
	return false;
}

/**
 * Names bound by a parameter or binding pattern.
 * @param {ts.BindingName} n
 * @returns {string[]}
 */
function bindingNames(n) {
	if (ts.isIdentifier(n)) return [n.text];
	return n.elements.flatMap((el) => (ts.isOmittedExpression(el) ? [] : bindingNames(el.name)));
}

/** @returns {ValueInfo} */
const unknownValue = () => ({ kinds: null, values: null });
/** @returns {ValueInfo} */
const noValue = () => ({ kinds: new Set(), values: [] });
/** @type {import('./util.mjs').Literal} */
const UNDEFINED = { kind: 'undefined', value: undefined, text: 'undefined' };

/**
 * Everything either value can be.
 * @param {ValueInfo} a
 * @param {ValueInfo} b
 * @returns {ValueInfo}
 */
function join(a, b) {
	const kinds = a.kinds && b.kinds ? new Set([...a.kinds, ...b.kinds]) : null;
	/** @type {import('./util.mjs').Literal[] | null} */
	let values = null;
	if (a.values && b.values) {
		const seen = new Set();
		values = [];
		for (const l of [...a.values, ...b.values]) {
			const key = `${l.kind}:${String(l.value)}`;
			if (seen.has(key)) continue;
			seen.add(key);
			values.push(l);
		}
		if (values.length > MAX_VALUES) values = null;
	}
	return { kinds, values };
}

/** @param {ValueInfo} v */
function valueKey(v) {
	return JSON.stringify([
		v.kinds ? [...v.kinds].sort() : null,
		v.values ? v.values.map((l) => `${l.kind}:${String(l.value)}`) : null,
	]);
}

/**
 * A type checker over the one file, used only to find the declaration an identifier refers to.
 * @param {ts.SourceFile} sf
 */
function createChecker(sf) {
	/** @type {ts.CompilerHost} */
	const host = {
		getSourceFile: (name) => (name === sf.fileName ? sf : undefined),
		getDefaultLibFileName: () => 'lib.d.ts',
		writeFile: () => undefined,
		getCurrentDirectory: () => '/',
		getCanonicalFileName: (f) => f,
		useCaseSensitiveFileNames: () => true,
		getNewLine: () => '\n',
		fileExists: (f) => f === sf.fileName,
		readFile: () => undefined,
	};
	const program = ts.createProgram([sf.fileName], { noLib: true, noResolve: true, types: [] }, host);
	return program.getTypeChecker();
}

/**
 * Converts one Cypress spec file.
 */
class FileTransformer {
	/**
	 * @param {string} text
	 * @param {TransformOptions} options
	 */
	constructor(text, options) {
		this.text = text;
		this.options = options;
		this.sf = ts.createSourceFile(options.sourcePath, text, ts.ScriptTarget.Latest, true, ts.ScriptKind.TS);
		this.checker = createChecker(this.sf);
		/** @type {Set<string>} */
		this.uses = new Set();
		/** @type {TestRecord[]} */
		this.tests = [];
		/** @type {Map<string, number>} */
		this.titleCounts = new Map();
		/** @type {Helper[]} in source order */
		this.helperList = [];
		/** @type {Map<ts.Node, Helper>} by declaration */
		this.helpers = new Map();
		/** @type {Map<ts.Node, Helper>} by function node */
		this.helperByFn = new Map();
		/** @type {Map<Helper, Set<Helper>>} helpers each helper's body refers to */
		this.calls = new Map();
		/** @type {Map<Helper, HelperResult>} */
		this.helperResults = new Map();
		/** @type {Map<ts.Node, ValueInfo>} what each helper parameter can be, from the call sites */
		this.paramValues = new Map();
		this.analyse();
	}

	/**
	 * Cypress allows two tests with the same title in one group, Playwright refuses the file.
	 * The second one gets " (2)", the third " (3)", in source order.
	 * @param {string[]} describePath
	 * @param {string} title
	 */
	uniqueTitle(describePath, title) {
		const key = JSON.stringify([...describePath, title]);
		const count = (this.titleCounts.get(key) ?? 0) + 1;
		this.titleCounts.set(key, count);
		return count === 1 ? title : `${title} (${count})`;
	}

	/** @returns {TransformResult} */
	run() {
		const scope = { describePath: [], skipReasons: [] };
		const { lines: body, refs } = this.block(this.sf.statements, scope, 0, this.sf.endOfFileToken.pos);
		const emitted = this.helperList.filter((h) => refs.has(h.decl));
		for (const h of emitted) for (const u of this.helperResult(h).uses) this.uses.add(u);
		const { sourcePath, basename } = this.options;
		const names = SUPPORT_NAMES.filter((n) => this.uses.has(n));
		const header = [
			`// @generated by tools/verify/cypress-to-playwright.mjs from ${sourcePath}`,
			`// Do not edit. Port skipped tests by hand in ${basename}.manual.spec.ts (same test title), then re-run the tool.`,
		];
		if (emitted.length) header.push(`import type { Page } from '@playwright/test';`);
		if (names.length) header.push(`import { ${names.join(', ')} } from '../support';`);
		const code = [...header, '', ...body]
			.join('\n')
			.replace(/\n{3,}/g, '\n\n')
			.replace(/\n*$/, '\n');
		const helpers = {
			emitted: emitted.map((h) => h.name),
			unsupported: this.helperList
				.filter((h) => !this.helperResult(h).ok)
				.map((h) => ({ name: h.name, reasons: [...this.helperResult(h).reasons] })),
		};
		return { code, tests: this.tests, helpers };
	}

	// ---------------------------------------------------------------- analysis

	/**
	 * Finds the helpers, who calls them and with what, before anything is converted: a helper's
	 * parameter can be anything its call sites pass, and the call sites are all over the file.
	 */
	analyse() {
		/** @param {ts.Node} n */
		const collect = (n) => {
			/** @type {Helper | null} */
			let h = null;
			if (ts.isFunctionDeclaration(n) && n.name && n.body && isScopeLevel(n)) {
				h = { name: n.name.text, decl: n, stmt: n, fn: n, escapes: false };
			} else if (ts.isVariableDeclaration(n) && isFunctionInit(n.initializer)) {
				const stmt = constStatement(n);
				if (stmt && stmt.declarationList.declarations.length === 1 && isScopeLevel(stmt))
					h = { name: /** @type {ts.Identifier} */ (n.name).text, decl: n, stmt, fn: n.initializer, escapes: false };
			}
			if (h) {
				this.helperList.push(h);
				this.helpers.set(h.decl, h);
				this.helperByFn.set(h.fn, h);
				this.calls.set(h, new Set());
			}
			ts.forEachChild(n, collect);
		};
		collect(this.sf);

		/** @type {{ h: Helper, call: ts.CallExpression }[]} */
		const callSites = [];
		/** @param {ts.Node} n */
		const visit = (n) => {
			if (ts.isIdentifier(n) && isReference(n)) {
				const h = this.helperOf(n);
				if (h) {
					const p = n.parent;
					if (ts.isCallExpression(p) && p.expression === n) callSites.push({ h, call: p });
					else h.escapes = true;
					const owner = this.enclosingHelper(n);
					if (owner) this.calls.get(owner)?.add(h);
				}
			}
			ts.forEachChild(n, visit);
		};
		visit(this.sf);

		for (const h of this.helperList)
			for (const p of h.fn.parameters)
				if (ts.isIdentifier(p.name))
					this.paramValues.set(p, h.escapes || p.dotDotDotToken ? unknownValue() : noValue());

		// Grow every parameter's values from the call sites until nothing changes. A call site with
		// an argument that is not a simple value is left out: the code around it is never emitted.
		for (let round = 0; round < 1000; round++) {
			let changed = false;
			for (const { h, call } of callSites) {
				if (h.escapes || call.arguments.some((a) => ts.isSpreadElement(a)) || this.arityProblem(h, call)) continue;
				const args = call.arguments.map((a) => this.valueOf(a));
				if (args.some((a) => !a)) continue;
				h.fn.parameters.forEach((p, i) => {
					if (!ts.isIdentifier(p.name) || p.dotDotDotToken) return;
					const fallback = p.initializer ? (this.valueOf(p.initializer) ?? unknownValue()) : null;
					/** @type {ValueInfo} */
					let v;
					if (i < args.length) {
						v = /** @type {ValueInfo} */ (args[i]);
						if (fallback && (!v.kinds || v.kinds.has('undefined'))) v = join(v, fallback);
					} else {
						v = fallback ?? { kinds: new Set(['undefined']), values: [UNDEFINED] };
					}
					const old = this.paramValues.get(p) ?? noValue();
					const next = join(old, v);
					if (valueKey(next) !== valueKey(old)) {
						this.paramValues.set(p, next);
						changed = true;
					}
				});
			}
			if (!changed) break;
		}
	}

	/**
	 * The declaration an identifier refers to, if it is in this file.
	 * @param {ts.Identifier} id
	 * @returns {ts.Declaration | undefined}
	 */
	declOf(id) {
		const p = id.parent;
		const sym =
			p && ts.isShorthandPropertyAssignment(p) && p.name === id
				? this.checker.getShorthandAssignmentValueSymbol(p)
				: this.checker.getSymbolAtLocation(id);
		const d = sym?.valueDeclaration ?? sym?.declarations?.[0];
		return d && d.getSourceFile() === this.sf ? d : undefined;
	}

	/**
	 * @param {ts.Identifier} id
	 * @returns {Helper | undefined}
	 */
	helperOf(id) {
		const d = this.declOf(id);
		return d ? this.helpers.get(d) : undefined;
	}

	/**
	 * The innermost helper whose function contains `node`.
	 * @param {ts.Node} node
	 */
	enclosingHelper(node) {
		for (let n = node.parent; n; n = n.parent) {
			const h = this.helperByFn.get(n);
			if (h) return h;
		}
		return undefined;
	}

	/**
	 * The helper a parameter (or a name destructured from one) belongs to.
	 * @param {ts.Node} d
	 */
	paramOwner(d) {
		/** @type {ts.Node | undefined} */
		let n = d;
		while (n && ts.isBindingElement(n)) n = n.parent.parent;
		if (!n || !ts.isParameter(n)) return undefined;
		return this.helperByFn.get(n.parent);
	}

	/**
	 * Whether a helper can reach itself through its calls.
	 * @param {Helper} h
	 */
	isRecursive(h) {
		const seen = new Set();
		const stack = [...(this.calls.get(h) ?? [])];
		while (stack.length) {
			const c = /** @type {Helper} */ (stack.pop());
			if (c === h) return true;
			if (seen.has(c)) continue;
			seen.add(c);
			stack.push(...(this.calls.get(c) ?? []));
		}
		return false;
	}

	/**
	 * A declaration made directly in the file or in a describe callback (what the generated file
	 * declares at the same place, or what a test cannot see when it is not declared there).
	 * @param {ts.Node} d
	 */
	isOuterDecl(d) {
		/** @type {ts.Node | undefined} */
		let n = d;
		while (
			n &&
			!ts.isSourceFile(n) &&
			!ts.isVariableStatement(n) &&
			!ts.isFunctionDeclaration(n) &&
			!ts.isClassDeclaration(n) &&
			!ts.isEnumDeclaration(n) &&
			!ts.isImportDeclaration(n)
		) {
			if (ts.isFunctionLike(n) || ts.isBlock(n)) return false;
			n = n.parent;
		}
		return !!n && !ts.isSourceFile(n) && isScopeLevel(n);
	}

	/**
	 * A file/describe-level `const` (one declarator, not a function) that may be emitted.
	 * @param {ts.Node} d
	 */
	isScopeConst(d) {
		const stmt = constStatement(d);
		return (
			!!stmt &&
			stmt.declarationList.declarations.length === 1 &&
			!isFunctionInit(/** @type {ts.VariableDeclaration} */ (d).initializer) &&
			isScopeLevel(stmt)
		);
	}

	/**
	 * What a "simple value" can be: a literal, a helper parameter, a `const` holding a simple
	 * value, or a template or object literal built from those. Null when the expression is not one.
	 * @param {ts.Expression} expr
	 * @param {Set<ts.Node>} [visiting]
	 * @returns {ValueInfo | null}
	 */
	valueOf(expr, visiting = new Set()) {
		if (ts.isParenthesizedExpression(expr)) return this.valueOf(expr.expression, visiting);
		const lit = literal(expr);
		if (lit) return { kinds: new Set([lit.kind]), values: [lit] };
		if (ts.isIdentifier(expr)) {
			if (RESERVED.has(expr.text)) return null;
			const d = this.declOf(expr);
			if (!d) return null;
			if ((ts.isParameter(d) || ts.isBindingElement(d)) && this.paramOwner(d))
				return this.paramValues.get(d) ?? unknownValue();
			if (!constStatement(d)) return null;
			const decl = /** @type {ts.VariableDeclaration} */ (d);
			if (isFunctionInit(decl.initializer) || (decl.type && !typeOk(decl.type)) || visiting.has(d)) return null;
			visiting.add(d);
			const v = this.valueOf(/** @type {ts.Expression} */ (decl.initializer), visiting);
			visiting.delete(d);
			return v;
		}
		if (ts.isTemplateExpression(expr)) {
			const parts = expr.templateSpans.map((span) => this.valueOf(span.expression, visiting));
			if (parts.some((p) => !p)) return null;
			/** @type {string[] | null} */
			let strings = [expr.head.text];
			expr.templateSpans.forEach((span, i) => {
				const v = /** @type {ValueInfo} */ (parts[i]);
				if (!strings || !v.values || v.values.some((l) => l.kind === 'regex')) {
					strings = null;
					return;
				}
				/** @type {string[]} */
				const next = [];
				for (const s of strings) for (const l of v.values) next.push(s + String(l.value) + span.literal.text);
				strings = next.length > MAX_VALUES ? null : next;
			});
			const values = /** @type {string[] | null} */ (strings);
			return {
				kinds: new Set(['string']),
				values: values && values.map((s) => ({ kind: /** @type {const} */ ('string'), value: s, text: quote(s) })),
			};
		}
		if (ts.isObjectLiteralExpression(expr)) {
			for (const p of expr.properties) {
				if (ts.isPropertyAssignment(p)) {
					if (propName(p.name) === null || !this.valueOf(p.initializer, visiting)) return null;
				} else if (ts.isShorthandPropertyAssignment(p)) {
					if (p.objectAssignmentInitializer || !this.valueOf(p.name, visiting)) return null;
				} else return null;
			}
			return { kinds: new Set(['object']), values: null };
		}
		return null;
	}

	/**
	 * Resolves identifiers to the literal initializer of the `const` they name, for the places
	 * that need a literal (typed text, keys, URLs). Shadowing is handled by the type checker.
	 * @returns {import('./util.mjs').ConstLookup}
	 */
	constLookup() {
		return {
			get: (name, node) => {
				if (!node || RESERVED.has(name)) return undefined;
				const d = this.declOf(node);
				if (!d || !constStatement(d)) return undefined;
				const decl = /** @type {ts.VariableDeclaration} */ (d);
				if (decl.type && !typeOk(decl.type)) return undefined;
				return decl.initializer;
			},
		};
	}

	/**
	 * @param {Set<string>} uses
	 * @returns {Env}
	 */
	makeEnv(uses) {
		return { localConsts: this.constLookup(), uses, value: (e) => this.valueOf(e) };
	}

	// ---------------------------------------------------------------- helpers

	/**
	 * Why a reference to a helper cannot be converted, or null for `helper(args);` that can.
	 * @param {ts.Identifier} id
	 * @param {Helper} h
	 * @returns {string | null}
	 */
	callProblem(id, h) {
		const call = id.parent;
		if (!ts.isCallExpression(call) || call.expression !== id) return 'referenced without being called';
		const p = call.parent;
		const statement = ts.isExpressionStatement(p) || (ts.isArrowFunction(p) && p.body === call);
		if (!statement)
			return ts.isPropertyAccessExpression(p) && p.expression === call
				? 'call result is chained'
				: 'call result is used in an expression';
		const res = this.helperResult(h);
		if (!res.ok) return res.reasons.join(', ');
		if (call.questionDotToken || call.typeArguments) return 'unsupported call syntax';
		const args = call.arguments;
		if (args.some((a) => ts.isSpreadElement(a))) return 'spread argument';
		const bad = args.findIndex((a) => this.valueOf(a) === null);
		if (bad >= 0) return `argument ${bad + 1} is not a simple value`;
		return this.arityProblem(h, call);
	}

	/**
	 * @param {Helper} h
	 * @param {ts.CallExpression} call
	 * @returns {string | null}
	 */
	arityProblem(h, call) {
		const params = h.fn.parameters;
		let required = 0;
		params.forEach((param, i) => {
			if (!param.initializer && !param.questionToken && !param.dotDotDotToken) required = i + 1;
		});
		if (call.arguments.length < required) return 'missing arguments';
		if (call.arguments.length > params.length) return 'too many arguments';
		return null;
	}

	/**
	 * Convert a helper into `const name = async (page: Page, <params>) => { ... };`, once.
	 * @param {Helper} h
	 * @returns {HelperResult}
	 */
	helperResult(h) {
		const cached = this.helperResults.get(h);
		if (cached) return cached;
		/** @type {HelperResult} */
		const res = { ok: false, reasons: [], lines: [], refs: new Set(), uses: new Set() };
		this.helperResults.set(h, res);
		const { fn, name } = h;
		const reasons = res.reasons;
		if (RESERVED.has(name)) pushReason(reasons, `name ${name} clashes with a name the generated file uses`);
		if (fn.modifiers?.some((m) => m.kind === ts.SyntaxKind.AsyncKeyword) || fn.asteriskToken)
			pushReason(reasons, 'async or generator function');
		if (fn.typeParameters) pushReason(reasons, 'type parameters');
		const body = /** @type {ts.ConciseBody} */ (fn.body);
		if (usesThis(body) || usesArguments(body)) pushReason(reasons, 'uses this or arguments');
		for (const p of fn.parameters) {
			if (p.dotDotDotToken) {
				pushReason(reasons, 'rest parameter');
				continue;
			}
			for (const n of bindingNames(p.name))
				if (RESERVED.has(n)) pushReason(reasons, `parameter name ${n} clashes with a name the generated file uses`);
			if (p.type && !typeOk(p.type)) pushReason(reasons, `unsupported parameter type ${p.type.getText()}`);
			if (p.initializer && !this.valueOf(p.initializer))
				pushReason(reasons, `default of ${p.name.getText()} is not a simple value`);
			if (!ts.isIdentifier(p.name)) {
				const ok =
					ts.isObjectBindingPattern(p.name) &&
					p.name.elements.every(
						(el) =>
							!el.dotDotDotToken &&
							ts.isIdentifier(el.name) &&
							(!el.propertyName || ts.isIdentifier(el.propertyName)) &&
							(!el.initializer || this.valueOf(el.initializer)),
					);
				if (!ok) pushReason(reasons, `unsupported parameter ${p.name.getText()}`);
			}
		}
		if (this.isRecursive(h)) pushReason(reasons, 'recursive call');
		if (reasons.length) return res;

		const depth = levelOf(h.stmt);
		const r = this.convertBody(fn, depth + 1, res.uses, true);
		for (const reason of r.reasons) pushReason(reasons, reason);
		if (reasons.length) return res;
		const ind = '\t'.repeat(depth);
		const params = this.text.slice(fn.parameters.pos, fn.parameters.end).trim().replace(/,\s*$/, '');
		res.ok = true;
		res.refs = r.refs;
		res.lines = [
			...this.comments(h.stmt, depth),
			`${ind}const ${name} = async (page: Page${params ? `, ${params}` : ''}) => {`,
			...r.lines,
			`${ind}};`,
		];
		return res;
	}

	/**
	 * File/describe-level declarations a declaration needs in the output besides itself.
	 * @param {ts.Node} d
	 * @returns {Iterable<ts.Node>}
	 */
	declRefs(d) {
		const h = this.helpers.get(d);
		if (h) {
			const res = this.helperResult(h);
			return res.ok ? res.refs : [];
		}
		/** @type {ts.Node[]} */
		const out = [];
		/** @param {ts.Node} n */
		const visit = (n) => {
			if (ts.isIdentifier(n) && isReference(n)) {
				const x = this.declOf(n);
				if (x && this.isScopeConst(x)) out.push(x);
			}
			ts.forEachChild(n, visit);
		};
		const init = /** @type {ts.VariableDeclaration} */ (d).initializer;
		if (init) visit(init);
		return out;
	}

	/**
	 * Uses of file/describe-level declarations in a callback body: helpers must be called as a
	 * statement with simple values, consts must hold a simple value. Anything else is a reason.
	 * @param {ts.ArrowFunction | ts.FunctionExpression | ts.FunctionDeclaration} fn
	 * @returns {{ reasons: string[], refs: Set<ts.Node> }}
	 */
	outerUses(fn) {
		/** @type {string[]} */
		const reasons = [];
		/** @type {Set<ts.Node>} */
		const refs = new Set();
		/** @param {ts.Node} n */
		const visit = (n) => {
			if (ts.isIdentifier(n) && isReference(n)) {
				const d = this.declOf(n);
				const inside = d && d.pos >= fn.pos && d.end <= fn.end;
				if (d && !inside && this.isOuterDecl(d)) {
					const h = this.helpers.get(d);
					if (h) {
						const problem = this.callProblem(n, h);
						if (problem) pushReason(reasons, `uses helper ${n.text} (${problem})`);
						else refs.add(d);
					} else if (this.isScopeConst(d) && this.valueOf(n) !== null) {
						refs.add(d);
					} else {
						pushReason(reasons, `uses helper ${n.text}`);
					}
				}
			}
			ts.forEachChild(n, visit);
		};
		if (fn.body) visit(fn.body);
		return { reasons, refs };
	}

	/**
	 * Everything `refs` needs, following helpers to what they use.
	 * @param {Iterable<ts.Node>} refs
	 */
	closure(refs) {
		const used = new Set(refs);
		for (const d of used) for (const r of this.declRefs(d)) used.add(r);
		return used;
	}

	/**
	 * The helper or emit-able const a describe-level statement declares.
	 * @param {ts.Statement} stmt
	 * @returns {ts.Node | null}
	 */
	scopeDecl(stmt) {
		if (ts.isFunctionDeclaration(stmt)) return this.helpers.has(stmt) ? stmt : null;
		if (!ts.isVariableStatement(stmt) || stmt.declarationList.declarations.length !== 1) return null;
		const d = stmt.declarationList.declarations[0];
		return this.helpers.has(d) || this.isScopeConst(d) ? d : null;
	}

	// ---------------------------------------------------------------- structure

	/**
	 * Comment lines before a node.
	 * @param {ts.Node} node
	 * @param {number} depth
	 */
	comments(node, depth) {
		const ind = '\t'.repeat(depth);
		return leadingComments(this.text, node.pos).flatMap((c) => indentComment(c, ind));
	}

	/**
	 * Convert a describe-level statement list.
	 * @param {readonly ts.Statement[]} statements
	 * @param {Scope} parent
	 * @param {number} depth
	 * @param {number} endPos position of the closing brace (for trailing comments)
	 * @returns {{ lines: string[], refs: Set<ts.Node> }} refs: declarations the emitted code needs
	 */
	block(statements, parent, depth, endPos) {
		const ind = '\t'.repeat(depth);
		/** @type {Scope} */
		const scope = {
			describePath: parent.describePath,
			skipReasons: [...parent.skipReasons],
		};
		const kinds = statements.map((s) => classify(s));
		/** @param {ts.Expression} e */
		const simple = (e) => this.valueOf(e) !== null;

		// Pass 1: scope-wide problems. Hooks apply to every test in the describe, wherever they
		// appear, so they are checked before any test is converted.
		statements.forEach((stmt, i) => {
			if (kinds[i]) return;
			if (ts.isVariableStatement(stmt)) {
				for (const d of stmt.declarationList.declarations) {
					if (!isInert(d.initializer, simple))
						pushReason(scope.skipReasons, `describe-level statement with side effects (${d.name.getText()})`);
				}
				return;
			}
			if (
				ts.isFunctionDeclaration(stmt) ||
				ts.isImportDeclaration(stmt) ||
				ts.isInterfaceDeclaration(stmt) ||
				ts.isTypeAliasDeclaration(stmt) ||
				ts.isEmptyStatement(stmt)
			)
				return;
			if (this.nestedTests(stmt).length) return; // reported per test below
			pushReason(scope.skipReasons, `unsupported describe-level statement (${this.short(stmt)})`);
		});
		/** @type {Map<number, { lines: string[], refs: Set<ts.Node> }>} converted hooks by statement index */
		const hookOut = new Map();
		statements.forEach((stmt, i) => {
			const k = kinds[i];
			if (!k || k.kind !== 'hook') return;
			const name = /** @type {string} */ (k.name);
			if (name === 'before' || name === 'after') {
				pushReason(scope.skipReasons, `unsupported ${name} hook`);
				return;
			}
			const fn = plainCallback(k.call, 0);
			if (!fn || usesThis(fn)) {
				pushReason(scope.skipReasons, `unsupported ${name}: unsupported callback`);
				return;
			}
			const before = new Set(this.uses);
			const r = this.convertBody(fn, depth + 1, this.uses, false);
			if (r.reasons.length) {
				this.uses = before;
				pushReason(scope.skipReasons, `unsupported ${name}: ${r.reasons.join(', ')}`);
				return;
			}
			if (!r.hasStatements) {
				hookOut.set(i, { lines: [], refs: new Set() });
				return;
			}
			hookOut.set(i, {
				lines: [
					...this.comments(stmt, depth),
					`${ind}test.${name}(async (${r.usesPage ? '{ page }' : ''}) => {`,
					...r.lines,
					`${ind}});`,
				],
				refs: r.refs,
			});
		});

		// Pass 2: convert in source order. Helpers and consts wait until it is known whether
		// anything emitted uses them.
		/** @type {({ lines: string[], refs?: Set<ts.Node> } | { decl: ts.Node, stmt: ts.Statement })[]} */
		const items = [];
		statements.forEach((stmt, i) => {
			const k = kinds[i];
			if (k?.kind === 'hook') {
				const h = hookOut.get(i);
				if (h?.lines.length) items.push(h);
				return;
			}
			if (k?.kind === 'describe') {
				items.push(this.describe(stmt, k.call, k.modifier, scope, depth));
				return;
			}
			if (k?.kind === 'it') {
				items.push(this.test(stmt, k.call, k.modifier, scope, depth, []));
				return;
			}
			const decl = this.scopeDecl(stmt);
			if (decl) {
				items.push({ decl, stmt });
				return;
			}
			for (const nested of this.nestedTests(stmt)) {
				items.push(
					this.test(nested, nested, null, scope, depth, [
						`test defined inside unsupported statement (${this.short(stmt)})`,
					]),
				);
			}
		});
		/** @type {ts.Node[]} */
		const refs = [];
		for (const item of items) if ('lines' in item && item.lines.length && item.refs) refs.push(...item.refs);
		const used = this.closure(refs);

		/** @type {string[]} */
		const out = [];
		for (const item of items) {
			if ('lines' in item) {
				if (item.lines.length) out.push(...item.lines, '');
				continue;
			}
			if (!used.has(item.decl)) continue;
			const h = this.helpers.get(item.decl);
			if (h) {
				out.push(...this.helperResult(h).lines, '');
			} else {
				const trailing = trailingComments(this.text, item.stmt.end);
				out.push(
					...this.comments(item.stmt, depth),
					ind + item.stmt.getText() + (trailing.length ? ' ' + trailing.join(' ') : ''),
					'',
				);
			}
		}
		// Comments after the last statement, before the closing brace.
		const tail = leadingComments(this.text, endPos);
		if (tail.length) out.push(...tail.flatMap((c) => indentComment(c, ind)));
		while (out.length && out[out.length - 1] === '') out.pop();
		return { lines: out, refs: used };
	}

	/**
	 * Short label for a statement used in reasons.
	 * @param {ts.Statement} stmt
	 */
	short(stmt) {
		if (ts.isExpressionStatement(stmt) && ts.isCallExpression(stmt.expression))
			return calleeText(stmt.expression.expression);
		return ts.SyntaxKind[stmt.kind];
	}

	/**
	 * `it(...)` calls nested anywhere inside a statement.
	 * @param {ts.Node} stmt
	 * @returns {ts.CallExpression[]}
	 */
	nestedTests(stmt) {
		/** @type {ts.CallExpression[]} */
		const found = [];
		/** @param {ts.Node} n */
		const visit = (n) => {
			if (ts.isCallExpression(n)) {
				const p = calleeParts(n.expression);
				if (p && IT_NAMES.has(p.base) && (p.modifier === null || p.modifier === 'only' || p.modifier === 'skip')) {
					found.push(n);
					return;
				}
			}
			ts.forEachChild(n, visit);
		};
		visit(stmt);
		return found;
	}

	/**
	 * @param {ts.Statement} stmt
	 * @param {ts.CallExpression} call
	 * @param {string | null} modifier
	 * @param {Scope} scope
	 * @param {number} depth
	 * @returns {{ lines: string[], refs: Set<ts.Node> }}
	 */
	describe(stmt, call, modifier, scope, depth) {
		const ind = '\t'.repeat(depth);
		const title = call.arguments[0] ? staticString(call.arguments[0]) : null;
		const fn = plainCallback(call, 1);
		const head = this.comments(stmt, depth);
		if (title === null || !fn || !ts.isBlock(fn.body) || usesThis(fn)) {
			// Not a describe we can reproduce; still report every test inside it.
			const reason = title === null ? 'non-literal describe title' : 'unsupported describe callback';
			const inner = { ...scope, skipReasons: [...scope.skipReasons, reason] };
			const out = [...head];
			for (const t of this.nestedTests(call)) out.push(...this.test(t, t, null, inner, depth, []).lines, '');
			return { lines: out, refs: new Set() };
		}
		const inner = { ...scope, describePath: [...scope.describePath, title] };
		const opener = modifier === 'skip' ? 'test.describe.skip' : 'test.describe';
		const body = this.block(fn.body.statements, inner, depth + 1, fn.body.statements.end);
		// Every test in this group was ported by hand: a group with only hooks (or nothing) left
		// would run no test, so it is left out.
		if (!body.lines.some((line) => /^\s*test(\.fixme|\.skip)?\(/.test(line))) return { lines: [], refs: new Set() };
		this.uses.add('test');
		return {
			lines: [...head, `${ind}${opener}(${quote(title)}, () => {`, ...body.lines, `${ind}});`],
			refs: body.refs,
		};
	}

	/**
	 * @param {ts.Node} stmt node whose leading comments belong to the test
	 * @param {ts.CallExpression} call
	 * @param {string | null} modifier
	 * @param {Scope} scope
	 * @param {number} depth
	 * @param {string[]} extraReasons
	 * @returns {{ lines: string[], refs: Set<ts.Node> }}
	 */
	test(stmt, call, modifier, scope, depth, extraReasons) {
		const ind = '\t'.repeat(depth);
		const titleNode = call.arguments[0];
		const staticTitle = titleNode ? staticString(titleNode) : null;
		const title = staticTitle ?? (titleNode ? titleNode.getText() : '');
		/** @type {string[]} */
		const reasons = [...scope.skipReasons, ...extraReasons];
		if (staticTitle === null) pushReason(reasons, 'non-literal test title');
		const fn = plainCallback(call, 1);
		let lines = /** @type {string[]} */ ([]);
		let usesPage = false;
		/** @type {Set<ts.Node>} */
		let refs = new Set();
		const uses = new Set(this.uses);
		if (!fn || usesThis(fn)) {
			pushReason(reasons, 'unsupported test callback');
		} else {
			const r = this.convertBody(fn, depth + 1, this.uses, false);
			for (const reason of r.reasons) pushReason(reasons, reason);
			lines = r.lines;
			usesPage = r.usesPage;
			refs = r.refs;
		}
		const head = stmt === call ? [] : this.comments(stmt, depth);
		const describePath = scope.describePath;

		// A test with the same title in `<name>.manual.spec.ts` takes its place, whether the tool could
		// convert it or not. That is how a test whose literal translation is wrong gets corrected.
		if (staticTitle !== null && this.options.manualTitles?.has(staticTitle)) {
			this.uses = uses;
			this.tests.push({ title, describePath, status: 'ported', reasons: [] });
			return { lines: [], refs: new Set() };
		}

		if (!reasons.length) {
			this.uses.add('test');
			this.tests.push({ title, describePath, status: 'converted', reasons: [] });
			const opener = modifier === 'skip' ? 'test.skip' : 'test';
			return {
				lines: [
					...head,
					`${ind}${opener}(${quote(this.uniqueTitle(describePath, title))}, async (${usesPage ? '{ page }' : ''}) => {`,
					...lines,
					`${ind}});`,
				],
				refs,
			};
		}
		// Skipped: undo any imports only this test's conversion would have needed.
		this.uses = uses;
		this.tests.push({ title, describePath, status: 'skipped', reasons });
		this.uses.add('test');
		const original = this.originalBody(call);
		return {
			lines: [
				...head,
				`${ind}// SKIPPED by the transform: ${reasons.join('; ').replace(/\s*\n\s*/g, ' ')}`,
				`${ind}test.fixme(${quote(this.uniqueTitle(describePath, title))}, async () => {`,
				`${ind}\t/* Original Cypress code:`,
				...original.map((l) => (l ? `${ind}\t${l}` : '')),
				`${ind}\t*/`,
				`${ind}});`,
			],
			refs: new Set(),
		};
	}

	/**
	 * Source of an it() callback body, dedented, safe to place inside a block comment.
	 * @param {ts.CallExpression} call
	 * @returns {string[]}
	 */
	originalBody(call) {
		const fn = call.arguments[call.arguments.length - 1];
		let src;
		if (fn && (ts.isArrowFunction(fn) || ts.isFunctionExpression(fn))) {
			if (ts.isBlock(fn.body)) src = this.text.slice(fn.body.getStart() + 1, fn.body.end - 1);
			else src = fn.body.getText();
		} else {
			src = call.getText();
		}
		const lines = dedent(src.replace(/\*\//g, '*\\/').split('\n'));
		while (lines.length && !lines[0]) lines.shift();
		while (lines.length && !lines[lines.length - 1]) lines.pop();
		return lines;
	}

	// ---------------------------------------------------------------- bodies

	/**
	 * Convert the body of a test, hook or helper.
	 * @param {ts.ArrowFunction | ts.FunctionExpression | ts.FunctionDeclaration} fn
	 * @param {number} depth
	 * @param {Set<string>} uses support-module names the code uses (added to)
	 * @param {boolean} inHelper `if` statements are allowed
	 * @returns {BodyResult}
	 */
	convertBody(fn, depth, uses, inHelper) {
		const { reasons, refs } = this.outerUses(fn);
		const body = /** @type {ts.ConciseBody} */ (fn.body);
		const isBlock = ts.isBlock(body);
		/** @type {ts.Statement[]} */
		const statements = isBlock ? [...body.statements] : [ts.factory.createExpressionStatement(body)];
		const env = this.makeEnv(uses);
		const r = this.statementList(statements, depth, env, inHelper, isBlock ? body.statements.end : null);
		for (const reason of r.reasons) pushReason(reasons, reason);
		return { lines: r.lines, reasons, usesPage: r.usesPage, hasStatements: r.hasStatements, refs };
	}

	/**
	 * Convert a list of statements.
	 * @param {ts.Statement[]} statements
	 * @param {number} depth
	 * @param {Env} env
	 * @param {boolean} inHelper
	 * @param {number | null} endPos end of the enclosing block, for comments; null for an expression body
	 * @returns {Omit<BodyResult, 'refs'>}
	 */
	statementList(statements, depth, env, inHelper, endPos) {
		const ind = '\t'.repeat(depth);
		const withComments = endPos !== null;
		/** @type {string[]} */
		const reasons = [];
		/** @type {string[]} */
		const lines = [];
		let usesPage = false;
		let hasStatements = false;
		/** @param {ts.Identifier} id */
		const isOuter = (id) => {
			const d = this.declOf(id);
			return !!d && this.isOuterDecl(d);
		};
		for (const stmt of statements) {
			// Keep one blank line where the source had one (after the first statement).
			if (withComments && lines.length && /\n[ \t]*\r?\n/.test(this.text.slice(stmt.pos, stmt.getStart())))
				lines.push('');
			if (withComments) lines.push(...this.comments(stmt, depth));
			const trailing = withComments ? trailingComments(this.text, stmt.end) : [];
			const suffix = trailing.length ? ' ' + trailing.join(' ') : '';
			if (ts.isEmptyStatement(stmt)) continue;
			if (this.isSimpleConst(stmt)) {
				lines.push(ind + stmt.getText() + suffix);
				hasStatements = true;
				continue;
			}
			const expr = ts.isExpressionStatement(stmt) ? stmt.expression : null;
			if (expr && ts.isCallExpression(expr) && ts.isIdentifier(expr.expression)) {
				const h = this.helperOf(expr.expression);
				if (h) {
					// A problem with the call is reported by outerUses.
					if (this.callProblem(expr.expression, h) === null) {
						const args = ['page', ...expr.arguments.map((a) => a.getText())];
						lines.push(`${ind}await ${h.name}(${args.join(', ')});${suffix}`);
						usesPage = true;
						hasStatements = true;
					}
					continue;
				}
			}
			if (inHelper && ts.isIfStatement(stmt)) {
				const r = this.ifStatement(stmt, depth, env);
				for (const reason of r.reasons) pushReason(reasons, reason);
				if (r.lines.length) lines.push(...r.lines.slice(0, -1), r.lines[r.lines.length - 1] + suffix);
				usesPage ||= r.usesPage;
				hasStatements = true;
				continue;
			}
			const links = expr ? flattenCyChain(expr) : null;
			if (!links) {
				const r = statementReason(stmt, isOuter);
				if (r) pushReason(reasons, r);
				continue;
			}
			const r = convertChain(links, env);
			if (r.reason) {
				pushReason(reasons, r.reason);
				continue;
			}
			r.statements.forEach((s, i) => lines.push(ind + s + (i === r.statements.length - 1 ? suffix : '')));
			if (!r.statements.length && suffix) lines.push(ind + suffix.trim());
			if (r.statements.length) {
				usesPage = true;
				hasStatements = true;
			}
		}
		if (endPos !== null) {
			const tail = leadingComments(this.text, endPos);
			lines.push(...tail.flatMap((c) => indentComment(c, ind)));
		}
		return { lines, reasons, usesPage, hasStatements };
	}

	/**
	 * A `const` whose every declarator holds a simple value; emitted as written.
	 * @param {ts.Statement} stmt
	 */
	isSimpleConst(stmt) {
		if (!ts.isVariableStatement(stmt) || !(stmt.declarationList.flags & ts.NodeFlags.Const)) return false;
		if (stmt.modifiers?.length) return false;
		return stmt.declarationList.declarations.every(
			(d) =>
				ts.isIdentifier(d.name) &&
				!RESERVED.has(d.name.text) &&
				!!d.initializer &&
				!isFunctionInit(d.initializer) &&
				(!d.type || typeOk(d.type)) &&
				this.valueOf(d.initializer) !== null,
		);
	}

	/**
	 * `if (cond) { ... } else { ... }` inside a helper, with a plain condition.
	 * @param {ts.IfStatement} stmt
	 * @param {number} depth
	 * @param {Env} env
	 * @returns {Omit<BodyResult, 'refs' | 'hasStatements'>}
	 */
	ifStatement(stmt, depth, env) {
		const ind = '\t'.repeat(depth);
		if (!this.plainCondition(stmt.expression))
			return { lines: [], reasons: ['unsupported if condition'], usesPage: false };
		/** @param {ts.Statement} s */
		const branch = (s) =>
			ts.isBlock(s)
				? this.statementList([...s.statements], depth + 1, env, true, s.statements.end)
				: this.statementList([s], depth + 1, env, true, null);
		const then = branch(stmt.thenStatement);
		const reasons = [...then.reasons];
		let usesPage = then.usesPage;
		const lines = [`${ind}if (${stmt.expression.getText()}) {`, ...then.lines];
		const e = stmt.elseStatement;
		if (e && ts.isIfStatement(e)) {
			const sub = this.ifStatement(e, depth, env);
			for (const reason of sub.reasons) pushReason(reasons, reason);
			usesPage ||= sub.usesPage;
			if (sub.lines.length) lines.push(`${ind}} else ${sub.lines[0].trimStart()}`, ...sub.lines.slice(1));
		} else {
			if (e) {
				const b = branch(e);
				for (const reason of b.reasons) pushReason(reasons, reason);
				usesPage ||= b.usesPage;
				lines.push(`${ind}} else {`, ...b.lines);
			}
			lines.push(`${ind}}`);
		}
		return { lines, reasons, usesPage };
	}

	/**
	 * A condition built from parameters, consts and literals with property access, comparisons
	 * and logical operators. No calls, so no `cy`.
	 * @param {ts.Expression} e
	 * @returns {boolean}
	 */
	plainCondition(e) {
		if (ts.isParenthesizedExpression(e)) return this.plainCondition(e.expression);
		if (literal(e)) return true;
		if (ts.isIdentifier(e)) return this.valueOf(e) !== null;
		if (ts.isPropertyAccessExpression(e)) return ts.isIdentifier(e.name) && this.plainCondition(e.expression);
		if (ts.isPrefixUnaryExpression(e))
			return (
				[ts.SyntaxKind.ExclamationToken, ts.SyntaxKind.MinusToken, ts.SyntaxKind.PlusToken].includes(e.operator) &&
				this.plainCondition(e.operand)
			);
		if (ts.isTypeOfExpression(e)) return this.plainCondition(e.expression);
		if (ts.isBinaryExpression(e))
			return (
				CONDITION_OPERATORS.has(e.operatorToken.kind) && this.plainCondition(e.left) && this.plainCondition(e.right)
			);
		return false;
	}
}

/**
 * Transform Cypress spec source into Playwright spec source (unformatted).
 * @param {string} text
 * @param {TransformOptions} options
 * @returns {TransformResult}
 */
export function transformSource(text, options) {
	return new FileTransformer(text, options).run();
}
