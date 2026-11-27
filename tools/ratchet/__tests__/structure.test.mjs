import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { aggregateStructure, countStructure, isLibrarySource, STRUCTURE_METRICS } from '../lib/structure.mjs';

function count(source) {
	return countStructure('libs/brain/x/src/lib/x.ts', source);
}

describe('countStructure comments', () => {
	it('does not count // inside a string or a template literal', () => {
		const source = [
			"const url = 'https://example.com';",
			'const template = `<a href="//cdn">/* not a comment */</a>`;',
			'const nested = `${url}//${template}`;',
		].join('\n');
		assert.equal(count(source).commentLines, 0);
	});

	it('counts line comments and every line of a plain block comment', () => {
		const source = ['// one', 'const a = 1; // two', '/*', ' * three', ' */', 'const b = 2;'].join('\n');
		assert.equal(count(source).commentLines, 5);
	});

	it('allows JSDoc on an exported declaration and on a class member', () => {
		const source = [
			'/** Exported. */',
			'export class Thing {',
			'\t/**',
			'\t * A member.',
			'\t */',
			'\tpublic readonly value = 1;',
			'}',
			'/** Exported function. */',
			'export function make() {}',
		].join('\n');
		assert.equal(count(source).commentLines, 0);
	});

	it('allows JSDoc on members of an exported interface or type alias, but not of a local one', () => {
		const source = [
			'export interface Options {',
			'\t/** Shown first. */',
			'\ttitle: string;',
			'\t/** Called on close. */',
			'\tclose(): void;',
			'}',
			'export type Toast = Base & {',
			'\t/** Toast id. */',
			'\tid: string;',
			'\tclassNames?: {',
			'\t\t/** Nested member. */',
			'\t\ttoast?: string;',
			'\t};',
			'};',
			'interface Local {',
			'\t/** Counted. */',
			'\tvalue: number;',
			'}',
			'type LocalAlias = {',
			'\t// plain comment on an exported-looking member',
			'\tvalue: number;',
			'};',
			'export interface Plain {',
			'\t// a plain comment still counts',
			'\tvalue: number;',
			'}',
		].join('\n');
		assert.equal(count(source).commentLines, 3);
	});

	it('counts JSDoc on a non-exported declaration and a plain comment on a class member', () => {
		const source = [
			'/** Internal helper. */',
			'function helper() {}',
			'export class Thing {',
			'\t// plain comment',
			'\tpublic value = helper();',
			'\tpublic run() {',
			'\t\t/** inside a body */',
			'\t\treturn 1;',
			'\t}',
			'}',
		].join('\n');
		assert.equal(count(source).commentLines, 3);
	});

	it('ignores directive comments and counts eslint-disable directives', () => {
		const source = [
			'// eslint-disable-next-line @typescript-eslint/no-explicit-any',
			'const a: any = 1;',
			'const b: any = 2; // eslint-disable-line @typescript-eslint/no-explicit-any',
			'/* eslint-disable */',
			'// @ts-expect-error broken on purpose',
			'const c: number = "x";',
			'// prettier-ignore',
			'const d = [1,2];',
			'// eslint-enable',
		].join('\n');
		const counts = count(source);
		assert.equal(counts.commentLines, 0);
		assert.equal(counts.lintDisables, 3);
	});

	it('counts a comment only once when it sits between tokens', () => {
		assert.equal(count('call(/* a */ 1, 2 /* b */);\nconst empty = { /* c */ };').commentLines, 2);
	});
});

describe('countStructure declarations', () => {
	it('counts cdk imports per file, classes with extends and private getters', () => {
		const source = [
			"import { Overlay } from '@angular/cdk/overlay';",
			"import { coerceBooleanProperty } from '@angular/cdk/coercion';",
			"import { Component } from '@angular/core';",
			'class Base {}',
			'export class Child extends Base implements Thing {',
			'\tprivate get secret() { return 1; }',
			'\tget #hidden() { return 2; }',
			'\tpublic get open() { return 3; }',
			'}',
			'const Mixed = class extends Base {};',
		].join('\n');
		const counts = count(source);
		assert.equal(counts.cdkImportFiles, 1);
		assert.equal(counts.classesThatExtend, 2);
		assert.equal(counts.privateGetters, 2);
	});

	it('counts files that import the 1.x overlay, once per file', () => {
		const source = [
			"import { BrnOverlay } from '@spartan-ng/brain/overlay';",
			"export type { BrnOverlayState } from '@spartan-ng/brain/overlay';",
			"import { BrnPopover } from '@spartan-ng/brain/popover';",
		].join('\n');
		assert.equal(count(source).brnOverlayImportFiles, 1);
		assert.equal(count("import { BrnPopover } from '@spartan-ng/brain/popover';").brnOverlayImportFiles, 0);
	});

	it('does not count cdk-like module names or implements clauses', () => {
		const source = ["import { a } from '@angular/cdk-experimental';", 'export class A implements B {}'].join('\n');
		const counts = count(source);
		assert.equal(counts.cdkImportFiles, 0);
		assert.equal(counts.classesThatExtend, 0);
	});

	it('flags files over 300 lines', () => {
		assert.equal(count('const a = 1;\n'.repeat(300)).filesOver300Lines, 0);
		assert.equal(count('const a = 1;\n'.repeat(301)).filesOver300Lines, 1);
	});
});

describe('isLibrarySource', () => {
	it('keeps library sources and drops tests, stories and setup files', () => {
		assert.equal(isLibrarySource('libs/brain/dialog/src/lib/brn-dialog.ts'), true);
		for (const file of [
			'libs/brain/dialog/src/lib/brn-dialog.spec.ts',
			'libs/brain/dialog/src/lib/brn-dialog.test.ts',
			'libs/helm/button/src/lib/hlm-button.stories.ts',
			'libs/brain/dialog/src/__tests__/helper.ts',
			'libs/brain/src/test-setup.ts',
			'libs/brain/src/testing/axe.ts',
			'libs/brain/vite.config.mts',
		]) {
			assert.equal(isLibrarySource(file), false, file);
		}
	});
});

describe('aggregateStructure', () => {
	it('sums per library and starts every library at zero', () => {
		const one = Object.fromEntries(STRUCTURE_METRICS.map((metric) => [metric, 1]));
		const totals = aggregateStructure(
			[
				{ library: 'brain', counts: one },
				{ library: 'brain', counts: one },
				{ library: 'other', counts: one },
			],
			['brain', 'helm'],
		);
		for (const metric of STRUCTURE_METRICS) assert.deepEqual(totals[metric], { brain: 2, helm: 0 });
	});
});
