import { existsSync, readFileSync } from 'node:fs';
import ts from 'typescript';

/**
 * Titles of tests declared in a hand-written `*.manual.spec.ts` file: every `test('title', ...)`
 * (also `test.only`/`test.skip`/`test.fixme`) whose title is a string literal or a template literal
 * without substitutions.
 * @param {string} file
 * @returns {Set<string>}
 */
export function readManualTitles(file) {
	/** @type {Set<string>} */
	const titles = new Set();
	if (!existsSync(file)) return titles;
	const sf = ts.createSourceFile(file, readFileSync(file, 'utf8'), ts.ScriptTarget.Latest, true, ts.ScriptKind.TS);
	/** @param {ts.Node} n */
	const visit = (n) => {
		if (ts.isCallExpression(n) && n.arguments.length) {
			const c = n.expression;
			const isTest =
				(ts.isIdentifier(c) && c.text === 'test') ||
				(ts.isPropertyAccessExpression(c) &&
					ts.isIdentifier(c.expression) &&
					c.expression.text === 'test' &&
					['only', 'skip', 'fixme'].includes(c.name.text));
			const t = n.arguments[0];
			if (isTest && (ts.isStringLiteral(t) || ts.isNoSubstitutionTemplateLiteral(t))) titles.add(t.text);
		}
		ts.forEachChild(n, visit);
	};
	visit(sf);
	return titles;
}
