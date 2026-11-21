import ts from 'typescript';

/**
 * Serialise a string as a single-quoted JS string literal. Deterministic and independent of
 * how the value was written in the source.
 * @param {string} value
 * @returns {string}
 */
export function quote(value) {
	let out = "'";
	for (const ch of value) {
		const code = ch.codePointAt(0) ?? 0;
		if (ch === '\\') out += '\\\\';
		else if (ch === "'") out += "\\'";
		else if (ch === '\n') out += '\\n';
		else if (ch === '\r') out += '\\r';
		else if (ch === '\t') out += '\\t';
		else if (code < 0x20 || code === 0x2028 || code === 0x2029 || code === 0x7f)
			out += '\\u' + code.toString(16).padStart(4, '0');
		else out += ch;
	}
	return out + "'";
}

/**
 * Evaluate a node to a string when it is a static string: a string literal, a template without
 * substitutions, or a `+` concatenation of those. Returns null otherwise.
 * @param {ts.Node} node
 * @returns {string | null}
 */
export function staticString(node) {
	if (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node)) return node.text;
	if (ts.isParenthesizedExpression(node)) return staticString(node.expression);
	if (ts.isBinaryExpression(node) && node.operatorToken.kind === ts.SyntaxKind.PlusToken) {
		const left = staticString(node.left);
		const right = staticString(node.right);
		return left === null || right === null ? null : left + right;
	}
	return null;
}

/**
 * @typedef {{ kind: 'string' | 'number' | 'regex' | 'boolean' | 'null' | 'undefined', value: unknown, text: string }} Literal
 */

/**
 * Looks up the initializer of a `const` an identifier refers to. A plain Map works (by name);
 * the transform passes an object that resolves the identifier node to its real declaration.
 * @typedef {{ get(name: string, node?: ts.Identifier): ts.Expression | undefined }} ConstLookup
 */

/**
 * Resolve a node to a literal. Identifiers naming an emitted `const` with a literal initializer
 * resolve to that literal's value but keep the identifier as emitted text.
 * @param {ts.Node | undefined} node
 * @param {ConstLookup} [localConsts]
 * @returns {Literal | null}
 */
export function literal(node, localConsts) {
	if (!node) return null;
	if (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node)) {
		return { kind: 'string', value: node.text, text: node.getText() };
	}
	if (ts.isNumericLiteral(node)) return { kind: 'number', value: Number(node.text), text: node.getText() };
	if (
		ts.isPrefixUnaryExpression(node) &&
		node.operator === ts.SyntaxKind.MinusToken &&
		ts.isNumericLiteral(node.operand)
	) {
		return { kind: 'number', value: -Number(node.operand.text), text: node.getText() };
	}
	if (ts.isRegularExpressionLiteral(node)) return { kind: 'regex', value: node.text, text: node.getText() };
	if (node.kind === ts.SyntaxKind.TrueKeyword) return { kind: 'boolean', value: true, text: 'true' };
	if (node.kind === ts.SyntaxKind.FalseKeyword) return { kind: 'boolean', value: false, text: 'false' };
	if (node.kind === ts.SyntaxKind.NullKeyword) return { kind: 'null', value: null, text: 'null' };
	if (ts.isIdentifier(node)) {
		if (node.text === 'undefined') return { kind: 'undefined', value: undefined, text: 'undefined' };
		const init = localConsts?.get(node.text, node);
		if (init) {
			const resolved = literal(init);
			if (resolved) return { ...resolved, text: node.text };
		}
	}
	return null;
}

/**
 * True when the node is a literal, or an object/array literal built only from literals.
 * Identifiers (other than `undefined`), spreads, shorthand properties and computed keys are rejected.
 * @param {ts.Node} node
 * @returns {boolean}
 */
export function isLiteralTree(node) {
	if (literal(node)) return true;
	if (ts.isArrayLiteralExpression(node)) return node.elements.every((e) => isLiteralTree(e));
	if (ts.isObjectLiteralExpression(node)) {
		return node.properties.every(
			(p) =>
				ts.isPropertyAssignment(p) &&
				(ts.isIdentifier(p.name) || ts.isStringLiteral(p.name)) &&
				isLiteralTree(p.initializer),
		);
	}
	return false;
}

/**
 * Name of a property key that is an identifier or string literal, else null.
 * @param {ts.PropertyName} name
 */
export function propName(name) {
	if (ts.isIdentifier(name) || ts.isStringLiteral(name)) return name.text;
	return null;
}

/**
 * Comments that sit before `node` on their own lines (TypeScript's "leading" comments).
 * Directives meant for the Cypress source are dropped: `// prettier-ignore`, and eslint comments
 * that name a `cypress/` rule (the rule does not exist where the Playwright tests are linted).
 * @param {string} text full source text
 * @param {number} pos
 * @returns {string[]}
 */
export function leadingComments(text, pos) {
	const ranges = ts.getLeadingCommentRanges(text, pos) ?? [];
	return ranges
		.map((r) => text.slice(r.pos, r.end))
		.filter((c) => c.trim() !== '// prettier-ignore' && !/eslint-(disable|enable)[^\n]*\bcypress\//.test(c));
}

/**
 * Comments on the same line after `end`.
 * @param {string} text
 * @param {number} end
 * @returns {string[]}
 */
export function trailingComments(text, end) {
	const ranges = ts.getTrailingCommentRanges(text, end) ?? [];
	return ranges.map((r) => text.slice(r.pos, r.end));
}

/**
 * Re-indent a (possibly multi-line) comment so every line starts at `indent`. Lines of block
 * comments keep their relative indentation.
 * @param {string} comment
 * @param {string} indent
 * @returns {string[]}
 */
export function indentComment(comment, indent) {
	const lines = comment.split('\n');
	if (lines.length === 1) return [indent + comment];
	return [indent + lines[0], ...dedent(lines.slice(1)).map((l) => (l ? indent + l : ''))];
}

/**
 * Remove the common leading whitespace of non-empty lines.
 * @param {string[]} lines
 * @returns {string[]}
 */
export function dedent(lines) {
	let min = Infinity;
	for (const line of lines) {
		if (!line.trim()) continue;
		const ws = /^[\t ]*/.exec(line)?.[0].length ?? 0;
		min = Math.min(min, ws);
	}
	if (min === Infinity) min = 0;
	return lines.map((l) => (l.trim() ? l.slice(min).replace(/\s+$/, '') : ''));
}

/**
 * Text of a call's callee for messages, e.g. `stories.forEach`.
 * @param {ts.Expression} expr
 * @returns {string}
 */
export function calleeText(expr) {
	if (ts.isIdentifier(expr)) return expr.text;
	if (ts.isPropertyAccessExpression(expr)) return `${calleeText(expr.expression)}.${expr.name.text}`;
	if (ts.isCallExpression(expr)) return `${calleeText(expr.expression)}()`;
	return ts.SyntaxKind[expr.kind];
}

/**
 * Add `reason` to `list` unless already present (keeps first-seen order).
 * @param {string[]} list
 * @param {string} reason
 */
export function pushReason(list, reason) {
	if (!list.includes(reason)) list.push(reason);
}
