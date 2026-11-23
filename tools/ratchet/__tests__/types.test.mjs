import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { countCompilerErrors, errorLines } from '../lib/types.mjs';

const escape = String.fromCharCode(27);

describe('countCompilerErrors', () => {
	it('counts TS and NG error lines and strips colors', () => {
		const output = [
			`${escape}[96mdialog/src/lib/a.ts${escape}[0m:1:2 - ${escape}[91merror${escape}[0m${escape}[90m TS2379: ${escape}[0mBad.`,
			'  Types of property are incompatible.',
			'select/src/lib/b.ts:3:4 - error NG8002: Unknown binding.',
			'select/src/lib/b.ts:3:4 - warning NG8107: Not counted.',
		].join('\n');
		assert.equal(errorLines(output).length, 2);
		assert.equal(countCompilerErrors(output, 'brain'), 2);
	});

	it('leaves out test-setup.ts and, for helm, the files it re-reports from brain', () => {
		const output = [
			'src/test-setup.ts:23:1 - error TS2304: Cannot find name.',
			'../brain/sonner/src/lib/state.ts:1:1 - error TS2379: Brain file.',
			'button/src/lib/hlm-button.ts:1:1 - error TS2379: Helm file.',
		].join('\n');
		assert.equal(countCompilerErrors(output, 'helm'), 1);
		assert.equal(countCompilerErrors(output, 'brain'), 2);
	});
});
