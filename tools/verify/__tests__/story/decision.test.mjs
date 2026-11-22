import assert from 'node:assert/strict';
import { mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { describe, it } from 'node:test';
import { buildComment, classify, countUnselected, screenshotId } from '../../decision.mjs';
import { comparePng, decodePng, diffPng, encodePng } from '../../lib/png.mjs';

const white = encodePng(8, 8, Buffer.alloc(8 * 8 * 3, 255));
const halfBlack = encodePng(8, 8, Buffer.concat([Buffer.alloc(96, 0), Buffer.alloc(96, 255)]));

function testWith(directory, key, image, extra = {}) {
	const screenshot = path.join(directory, `${key}.png`);
	writeFileSync(screenshot, image);
	return { key, component: 'badge', title: key, status: 'passed', a11y: [], screenshot, ...extra };
}

describe('png', () => {
	it('reads back what it wrote', () => {
		const image = decodePng(halfBlack);
		assert.equal(image.width, 8);
		assert.equal(image.data[0], 0);
		assert.equal(image.data[image.data.length - 1], 255);
	});

	it('marks changed pixels in the difference image', () => {
		assert.equal(comparePng(white, halfBlack).changedPixels, 32);
		const diff = decodePng(diffPng(white, halfBlack));
		assert.deepEqual([...diff.data.subarray(0, 3)], [225, 29, 72]);
		assert.deepEqual([...diff.data.subarray(diff.data.length - 3)], [255, 255, 255]);
	});
});

describe('decision', () => {
	const run = mkdtempSync(path.join(tmpdir(), 'decision-run-'));
	const baseline = mkdtempSync(path.join(tmpdir(), 'decision-base-'));
	const same = testWith(run, 'same', white);
	const changed = testWith(run, 'changed', halfBlack);
	const fresh = testWith(run, 'fresh', white);
	writeFileSync(path.join(baseline, `${screenshotId('same')}.png`), white);
	writeFileSync(path.join(baseline, `${screenshotId('changed')}.png`), white);

	it('classifies screenshots against the reference', () => {
		assert.equal(classify(same, baseline).state, 'same');
		assert.equal(classify(changed, baseline).state, 'changed');
		assert.equal(classify(fresh, baseline).state, 'new');
		assert.equal(classify({ ...same, screenshot: null }, baseline).state, 'none');
	});

	it('shows only what changed or failed above the fold', () => {
		const failed = {
			...testWith(run, 'broken', white),
			status: 'failed',
			error: 'expected 1\nmore',
			component: '_pages',
		};
		const tests = [same, changed, fresh, failed];
		const compared = tests.map((test) => ({ test, ...classify(test, baseline) }));
		const comment = buildComment({ tests, compared, baseName: 'main', imageBase: 'https://images', unselected: 2 });
		const top = comment.split('<details><summary>All results')[0];
		assert.match(top, /\*\*3 passed, 1 failed\.\*\* 1 of 4 screenshots changed against `main`\. 2 are new\./);
		assert.match(top, new RegExp(`https://images/${screenshotId('changed')}\\.diff\\.png`));
		assert.match(top, /\*\*Every page loads\*\* · broken: `expected 1`/);
		assert.doesNotMatch(top, /_pages|· same/);
		assert.match(top, /2 components were not selected/);
	});

	it('says so when nothing was compared or nothing ran', () => {
		const compared = [{ test: fresh, ...classify(fresh, null) }];
		const comment = buildComment({ tests: [fresh], compared, baseName: 'main', imageBase: '.', unselected: 0 });
		assert.match(comment, /\*\*1 passed, 0 failed\.\*\*\n/);
		assert.match(comment, /no reference screenshots for `main` yet/);
		assert.match(
			buildComment({ tests: [], compared: [], baseName: 'main', imageBase: '.', unselected: 0 }),
			/No tests ran/,
		);
	});

	it('counts the components a run did not touch', () => {
		const pages = path.join(run, 'pages.json');
		writeFileSync(
			pages,
			JSON.stringify({ pages: [{ id: 'badge--default' }, { id: 'card--default' }, { id: 'tabs--default' }] }),
		);
		const tests = [same, { ...same, component: '_pages', title: 'card--default' }];
		assert.equal(countUnselected(pages, tests), 1);
	});
});
