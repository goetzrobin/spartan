import assert from 'node:assert/strict';
import path from 'node:path';
import { describe, it } from 'node:test';
import { fileURLToPath } from 'node:url';
import { affectedComponents, closureOf, listComponents } from '../../lib/affected.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../../..');

describe('affected components (against this repo)', () => {
	it('lists the components that have tests', () => {
		const components = listComponents(root);
		assert.ok(components.includes('dialog') && components.includes('popover'));
		assert.ok(!components.includes('support'));
	});

	it('follows imports from a test page into brain and helm', () => {
		const closure = closureOf(root, 'popover');
		assert.ok(closure.has('libs/helm/popover/src/index.ts'));
		assert.ok(closure.has('libs/brain/popover/src/index.ts'));
		assert.ok(closure.has('libs/brain/overlay/src/index.ts'), 'popover is built on the shared overlay');
	});

	it('selects only the components a library change reaches', () => {
		const result = affectedComponents(root, ['libs/brain/dialog/src/lib/brn-dialog.ts']);
		assert.equal(result.all, false);
		assert.ok(result.components.includes('dialog'));
		assert.ok(!result.components.includes('popover'));
	});

	it('selects nothing for a change no test reaches', () => {
		assert.deepEqual(affectedComponents(root, ['README.md', 'libs/mcp/src/index.ts']).components, []);
	});

	it('selects everything when shared test setup changes', () => {
		const result = affectedComponents(root, ['apps/ui-e2e/src/support/index.ts']);
		assert.equal(result.all, true);
		assert.deepEqual(result.components, listComponents(root));
	});

	it('selects a component when its own page or test changes', () => {
		assert.deepEqual(affectedComponents(root, ['apps/ui-e2e/src/popover/popover.manual.spec.ts']).components, [
			'popover',
		]);
	});
});
