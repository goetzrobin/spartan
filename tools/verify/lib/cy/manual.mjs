import { existsSync, readFileSync } from 'node:fs';
import ts from 'typescript';

/**
 * The tests declared in a hand-written `*.manual.spec.ts` file, each as the JSON text of its full
 * title: the titles of the `test.describe` blocks around it, then its own. Covers
 * `test('title', ...)` and `test.only`/`test.skip`/`test.fixme`, where every title on the way is
 * a string literal or a template literal without substitutions. A test title with substitutions
 * is kept as its source text.
 *
 * The full title is what identifies a test: two groups may each have a test called
 * "should pass accessibility checks", and porting one must not remove the other.
 * @param {string} file
 * @returns {Set<string>}
 */
export function readManualTitles(file) {
	/** @type {Set<string>} */
	const titles = new Set();
	if (!existsSync(file)) return titles;
	const sf = ts.createSourceFile(file, readFileSync(file, 'utf8'), ts.ScriptTarget.Latest, true, ts.ScriptKind.TS);
	/** @param {ts.Expression | undefined} t */
	const literal = (t) => (t && (ts.isStringLiteral(t) || ts.isNoSubstitutionTemplateLiteral(t)) ? t.text : null);
	/**
	 * @param {ts.Node} n
	 * @param {string[] | null} path the describe titles around `n`, or null inside a describe whose title is not fixed
	 */
	const visit = (n, path) => {
		if (ts.isCallExpression(n) && n.arguments.length) {
			const c = n.expression;
			const onTest = ts.isPropertyAccessExpression(c) && ts.isIdentifier(c.expression) && c.expression.text === 'test';
			const onDescribe =
				ts.isPropertyAccessExpression(c) &&
				ts.isPropertyAccessExpression(c.expression) &&
				ts.isIdentifier(c.expression.expression) &&
				c.expression.expression.text === 'test' &&
				c.expression.name.text === 'describe';
			const isDescribe = (onTest && c.name.text === 'describe') || onDescribe;
			const isTest =
				(ts.isIdentifier(c) && c.text === 'test') || (onTest && ['only', 'skip', 'fixme'].includes(c.name.text));
			const first = n.arguments[0];
			// A title built in a loop (`should render ${story}`) has no fixed text. It is identified by
			// how it is written, so the hand-written loop has to spell it the way the original does.
			const title = isTest && ts.isTemplateExpression(first) ? first.getText() : literal(first);
			if (isDescribe) {
				const inner = path && title !== null ? [...path, title] : null;
				ts.forEachChild(n, (child) => visit(child, inner));
				return;
			}
			if (isTest && title !== null && path) titles.add(manualKey(path, title));
		}
		ts.forEachChild(n, (child) => visit(child, path));
	};
	visit(sf, []);
	return titles;
}

/**
 * @param {string[]} describePath
 * @param {string} title
 */
export function manualKey(describePath, title) {
	return JSON.stringify([...describePath, title]);
}
