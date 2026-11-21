import ts from 'typescript';
import { convertChain, flattenCyChain } from './chain.mjs';
import {
	calleeText,
	dedent,
	indentComment,
	leadingComments,
	literal,
	pushReason,
	quote,
	staticString,
	trailingComments,
} from './util.mjs';

/**
 * @typedef {object} TestRecord
 * @property {string} title static title, or the raw source of a non-static title
 * @property {string[]} describePath
 * @property {'converted' | 'skipped' | 'ported'} status
 * @property {string[]} reasons
 */

/**
 * @typedef {object} TransformResult
 * @property {string} code unformatted Playwright source
 * @property {TestRecord[]} tests
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
 * @property {Set<string>} helpers names declared at file or describe level in enclosing scopes
 * @property {string[]} skipReasons reasons that skip every test in the scope
 */

const SUPPORT_NAMES = ['STORY_ROOT', 'byText', 'checkA11y', 'expect', 'forceClick', 'gotoStory', 'test'];
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
 * Names bound by a declaration statement (variables, functions, classes, imports).
 * @param {ts.Statement} stmt
 * @returns {string[]}
 */
function declaredNames(stmt) {
	/** @type {string[]} */
	const names = [];
	/** @param {ts.BindingName} n */
	const bind = (n) => {
		if (ts.isIdentifier(n)) names.push(n.text);
		else for (const el of n.elements) if (!ts.isOmittedExpression(el)) bind(el.name);
	};
	if (ts.isVariableStatement(stmt)) for (const d of stmt.declarationList.declarations) bind(d.name);
	else if ((ts.isFunctionDeclaration(stmt) || ts.isClassDeclaration(stmt) || ts.isEnumDeclaration(stmt)) && stmt.name)
		names.push(stmt.name.text);
	else if (ts.isImportDeclaration(stmt) && stmt.importClause) {
		const c = stmt.importClause;
		if (c.name) names.push(c.name.text);
		const nb = c.namedBindings;
		if (nb && ts.isNamespaceImport(nb)) names.push(nb.name.text);
		else if (nb) for (const el of nb.elements) names.push(el.name.text);
	}
	return names;
}

/**
 * An initializer is inert when evaluating it at definition time has no effect on the page:
 * functions, literals and literal containers.
 * @param {ts.Expression | undefined} e
 * @returns {boolean}
 */
function isInert(e) {
	if (!e) return true;
	if (ts.isArrowFunction(e) || ts.isFunctionExpression(e)) return true;
	if (literal(e) || staticString(e) !== null) return true;
	if (ts.isAsExpression(e) || ts.isSatisfiesExpression(e) || ts.isParenthesizedExpression(e))
		return isInert(e.expression);
	if (ts.isArrayLiteralExpression(e)) return e.elements.every((x) => !ts.isSpreadElement(x) && isInert(x));
	if (ts.isObjectLiteralExpression(e))
		return e.properties.every((p) => (ts.isPropertyAssignment(p) ? isInert(p.initializer) : ts.isMethodDeclaration(p)));
	return false;
}

/**
 * Identifiers referenced in `node` that are helper names from enclosing scopes and not
 * declared inside `node` itself. Returned in order of first appearance.
 * @param {ts.Node} node
 * @param {Set<string>} helpers
 * @returns {string[]}
 */
function helperRefs(node, helpers) {
	/** @type {Set<string>} */
	const local = new Set();
	/** @param {ts.Node} n */
	const collectLocal = (n) => {
		if ((ts.isVariableDeclaration(n) || ts.isParameter(n) || ts.isBindingElement(n)) && ts.isIdentifier(n.name))
			local.add(n.name.text);
		if ((ts.isFunctionDeclaration(n) || ts.isFunctionExpression(n)) && n.name) local.add(n.name.text);
		ts.forEachChild(n, collectLocal);
	};
	collectLocal(node);
	/** @type {string[]} */
	const refs = [];
	/** @param {ts.Node} n */
	const visit = (n) => {
		if (ts.isIdentifier(n) && helpers.has(n.text) && !local.has(n.text) && isReference(n) && !refs.includes(n.text))
			refs.push(n.text);
		ts.forEachChild(n, visit);
	};
	visit(node);
	return refs;
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
 * Describe a statement that is not a supported cy chain, for the skip reason.
 * @param {ts.Statement} stmt
 * @param {Set<string>} helpers
 */
function statementReason(stmt, helpers) {
	if (ts.isExpressionStatement(stmt)) {
		let e = stmt.expression;
		while (ts.isCallExpression(e) || ts.isPropertyAccessExpression(e)) {
			if (ts.isIdentifier(e.expression)) {
				const name = e.expression.text;
				if (helpers.has(name)) return null; // reported as "uses helper"
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
 * A test-local `const` that is a plain literal and may be emitted verbatim.
 * @param {ts.Statement} stmt
 */
function isLiteralConst(stmt) {
	if (!ts.isVariableStatement(stmt)) return false;
	if (!(stmt.declarationList.flags & ts.NodeFlags.Const)) return false;
	return stmt.declarationList.declarations.every(
		(d) => ts.isIdentifier(d.name) && !d.type && d.initializer && literal(d.initializer) !== null,
	);
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
		/** @type {Set<string>} */
		this.uses = new Set();
		/** @type {TestRecord[]} */
		this.tests = [];
		/** @type {Map<string, number>} */
		this.titleCounts = new Map();
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
		const scope = { describePath: [], helpers: new Set(), skipReasons: [] };
		const body = this.block(this.sf.statements, scope, 0, this.sf.endOfFileToken.pos);
		const { sourcePath, basename } = this.options;
		const names = SUPPORT_NAMES.filter((n) => this.uses.has(n));
		const header = [
			`// @generated by tools/verify/cypress-to-playwright.mjs from ${sourcePath}`,
			`// Do not edit. Port skipped tests by hand in ${basename}.manual.spec.ts (same test title), then re-run the tool.`,
		];
		if (names.length) header.push(`import { ${names.join(', ')} } from '../support';`);
		const code = [...header, '', ...body]
			.join('\n')
			.replace(/\n{3,}/g, '\n\n')
			.replace(/\n*$/, '\n');
		return { code, tests: this.tests };
	}

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
	 * @returns {string[]}
	 */
	block(statements, parent, depth, endPos) {
		const ind = '\t'.repeat(depth);
		/** @type {Scope} */
		const scope = {
			describePath: parent.describePath,
			helpers: new Set(parent.helpers),
			skipReasons: [...parent.skipReasons],
		};
		const kinds = statements.map((s) => classify(s));

		// Pass 1: helpers and scope-wide problems. Hooks apply to every test in the describe,
		// wherever they appear, so they are checked before any test is converted.
		statements.forEach((stmt, i) => {
			for (const n of declaredNames(stmt)) scope.helpers.add(n);
			if (kinds[i]) return;
			if (ts.isVariableStatement(stmt)) {
				for (const d of stmt.declarationList.declarations) {
					if (!isInert(d.initializer))
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
		/** @type {Map<number, string[]>} converted hook output by statement index */
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
			const r = this.body(fn, scope, depth + 1);
			if (r.reasons.length) {
				this.uses = before;
				pushReason(scope.skipReasons, `unsupported ${name}: ${r.reasons.join(', ')}`);
				return;
			}
			if (!r.hasStatements) {
				hookOut.set(i, []);
				return;
			}
			hookOut.set(i, [
				...this.comments(stmt, depth),
				`${ind}test.${name}(async (${r.usesPage ? '{ page }' : ''}) => {`,
				...r.lines,
				`${ind}});`,
			]);
		});

		// Pass 2: emit in source order.
		/** @type {string[]} */
		const out = [];
		statements.forEach((stmt, i) => {
			const k = kinds[i];
			if (k?.kind === 'hook') {
				const lines = hookOut.get(i);
				if (lines?.length) out.push(...lines, '');
				return;
			}
			if (k?.kind === 'describe') {
				out.push(...this.describe(stmt, k.call, k.modifier, scope, depth), '');
				return;
			}
			if (k?.kind === 'it') {
				out.push(...this.test(stmt, k.call, k.modifier, scope, depth, []), '');
				return;
			}
			for (const nested of this.nestedTests(stmt)) {
				out.push(
					...this.test(nested, nested, null, scope, depth, [
						`test defined inside unsupported statement (${this.short(stmt)})`,
					]),
					'',
				);
			}
		});
		// Comments after the last statement, before the closing brace.
		const tail = leadingComments(this.text, endPos);
		if (tail.length) out.push(...tail.flatMap((c) => indentComment(c, ind)));
		while (out.length && out[out.length - 1] === '') out.pop();
		return out;
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
	 * @returns {string[]}
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
			for (const t of this.nestedTests(call)) out.push(...this.test(t, t, null, inner, depth, []), '');
			return out;
		}
		const inner = { ...scope, describePath: [...scope.describePath, title] };
		const opener = modifier === 'skip' ? 'test.describe.skip' : 'test.describe';
		const body = this.block(fn.body.statements, inner, depth + 1, fn.body.statements.end);
		// Every test in this group was ported by hand: a group with only hooks (or nothing) left
		// would run no test, so it is left out.
		if (!body.some((line) => /^\s*test(\.fixme|\.skip)?\(/.test(line))) return [];
		this.uses.add('test');
		return [...head, `${ind}${opener}(${quote(title)}, () => {`, ...body, `${ind}});`];
	}

	/**
	 * @param {ts.Node} stmt node whose leading comments belong to the test
	 * @param {ts.CallExpression} call
	 * @param {string | null} modifier
	 * @param {Scope} scope
	 * @param {number} depth
	 * @param {string[]} extraReasons
	 * @returns {string[]}
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
		const uses = new Set(this.uses);
		if (!fn || usesThis(fn)) {
			pushReason(reasons, 'unsupported test callback');
		} else {
			const r = this.body(fn, scope, depth + 1);
			for (const reason of r.reasons) pushReason(reasons, reason);
			lines = r.lines;
			usesPage = r.usesPage;
		}
		const head = stmt === call ? [] : this.comments(stmt, depth);
		const describePath = scope.describePath;

		if (!reasons.length) {
			this.uses.add('test');
			this.tests.push({ title, describePath, status: 'converted', reasons: [] });
			const opener = modifier === 'skip' ? 'test.skip' : 'test';
			return [
				...head,
				`${ind}${opener}(${quote(this.uniqueTitle(describePath, title))}, async (${usesPage ? '{ page }' : ''}) => {`,
				...lines,
				`${ind}});`,
			];
		}
		// Skipped: undo any imports only this test's conversion would have needed.
		this.uses = uses;
		if (staticTitle !== null && this.options.manualTitles?.has(staticTitle)) {
			this.tests.push({ title, describePath, status: 'ported', reasons: [] });
			return [];
		}
		this.tests.push({ title, describePath, status: 'skipped', reasons });
		this.uses.add('test');
		const original = this.originalBody(call);
		return [
			...head,
			`${ind}// SKIPPED by the transform: ${reasons.join('; ').replace(/\s*\n\s*/g, ' ')}`,
			`${ind}test.fixme(${quote(this.uniqueTitle(describePath, title))}, async () => {`,
			`${ind}\t/* Original Cypress code:`,
			...original.map((l) => (l ? `${ind}\t${l}` : '')),
			`${ind}\t*/`,
			`${ind}});`,
		];
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

	/**
	 * Convert the body of a test or hook callback.
	 * @param {ts.ArrowFunction | ts.FunctionExpression} fn
	 * @param {Scope} scope
	 * @param {number} depth
	 * @returns {{ lines: string[], reasons: string[], usesPage: boolean, hasStatements: boolean }}
	 */
	body(fn, scope, depth) {
		const ind = '\t'.repeat(depth);
		/** @type {string[]} */
		const reasons = [];
		for (const h of helperRefs(fn.body, scope.helpers)) pushReason(reasons, `uses helper ${h}`);
		/** @type {ts.Statement[]} */
		const statements = ts.isBlock(fn.body) ? [...fn.body.statements] : [ts.factory.createExpressionStatement(fn.body)];
		const isBlock = ts.isBlock(fn.body);
		/** @type {Map<string, ts.Expression>} */
		const localConsts = new Map();
		const env = { localConsts, uses: this.uses };
		/** @type {string[]} */
		const lines = [];
		let usesPage = false;
		let hasStatements = false;
		for (const stmt of statements) {
			// Keep one blank line where the source had one (after the first statement).
			if (isBlock && lines.length && /\n[ \t]*\r?\n/.test(this.text.slice(stmt.pos, stmt.getStart()))) lines.push('');
			if (isBlock) lines.push(...this.comments(stmt, depth));
			const trailing = isBlock ? trailingComments(this.text, stmt.end) : [];
			const suffix = trailing.length ? ' ' + trailing.join(' ') : '';
			if (ts.isEmptyStatement(stmt)) continue;
			if (isLiteralConst(stmt)) {
				for (const d of /** @type {ts.VariableStatement} */ (stmt).declarationList.declarations)
					localConsts.set(/** @type {ts.Identifier} */ (d.name).text, /** @type {ts.Expression} */ (d.initializer));
				lines.push(ind + stmt.getText() + suffix);
				hasStatements = true;
				continue;
			}
			const expr = ts.isExpressionStatement(stmt) ? stmt.expression : null;
			const links = expr ? flattenCyChain(expr) : null;
			if (!links) {
				const r = statementReason(stmt, scope.helpers);
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
		if (isBlock) {
			const tail = leadingComments(this.text, /** @type {ts.Block} */ (fn.body).statements.end);
			lines.push(...tail.flatMap((c) => indentComment(c, ind)));
		}
		return { lines, reasons, usesPage, hasStatements };
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
