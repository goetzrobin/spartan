import assert from 'node:assert/strict';
import path from 'node:path';
import { describe, it } from 'node:test';
import { fileURLToPath } from 'node:url';
import { deflateSync } from 'node:zlib';
import { affectedComponents, closureOf, listComponents, parseStatus } from '../../lib/affected.mjs';
import { comparePng, decodePng } from '../../lib/png.mjs';

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

describe('parseStatus', () => {
	it('keeps the first path whole when its line starts with a space', () => {
		const output =
			' M libs/brain/dialog/src/lib/brn-dialog.service.ts\n?? apps/new file.ts\nR  old.ts -> libs/new.ts\n';
		assert.deepEqual(parseStatus(output), [
			'libs/brain/dialog/src/lib/brn-dialog.service.ts',
			'apps/new file.ts',
			'libs/new.ts',
		]);
	});
});

describe('png comparison', () => {
	/** A PNG of one colour per pixel, built by hand: RGBA, filter 0 on every row. */
	const png = (width, height, pixel) => {
		const chunk = (type, body) => {
			const out = Buffer.alloc(12 + body.length);
			out.writeUInt32BE(body.length, 0);
			out.write(type, 4, 'latin1');
			body.copy(out, 8);
			return out; // the checksum is not read by the decoder
		};
		const header = Buffer.alloc(13);
		header.writeUInt32BE(width, 0);
		header.writeUInt32BE(height, 4);
		header.set([8, 6, 0, 0, 0], 8);
		const rows = Buffer.alloc(height * (1 + width * 4));
		for (let y = 0; y < height; y++) {
			for (let x = 0; x < width; x++) rows.set(pixel(x, y), y * (1 + width * 4) + 1 + x * 4);
		}
		return Buffer.concat([
			Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
			chunk('IHDR', header),
			chunk('IDAT', deflateSync(rows)),
			chunk('IEND', Buffer.alloc(0)),
		]);
	};
	const white = () => [255, 255, 255, 255];

	it('decodes size and pixels', () => {
		const image = decodePng(png(3, 2, (x, y) => [x * 10, y * 20, 7, 255]));
		assert.deepEqual([image.width, image.height, image.channels], [3, 2, 4]);
		assert.deepEqual([...image.data.subarray(16, 20)], [10, 20, 7, 255]);
	});

	it('ignores a one-shade difference and counts a real one', () => {
		const base = png(10, 10, white);
		const noise = png(10, 10, (x) => (x === 0 ? [254, 255, 255, 255] : white()));
		const change = png(10, 10, (x, y) => (y < 3 ? [0, 0, 0, 255] : white()));
		assert.equal(comparePng(base, noise).changedPixels, 0);
		assert.equal(comparePng(base, change).changedPixels, 30);
		assert.equal(comparePng(base, png(5, 10, white)).sameSize, false);
	});
});
