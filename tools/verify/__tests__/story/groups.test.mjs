import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { groupUnits, joinResults } from '../../lib/groups.mjs';

describe('groupUnits', () => {
	const units = [
		{ name: 'a', pages: 30 },
		{ name: 'b', pages: 30 },
		{ name: 'c', pages: 10 },
		{ name: 'd', pages: 90 },
		{ name: 'e', pages: 5 },
	];
	const names = (groups) => groups.map((group) => group.map((unit) => unit.name).join(''));

	it('keeps the order and starts a new group when the next unit would pass the limit', () => {
		assert.deepEqual(names(groupUnits(units, 60)), ['ab', 'c', 'd', 'e']);
		assert.deepEqual(names(groupUnits(units, 70)), ['abc', 'd', 'e']);
	});

	it('gives a unit larger than the limit a group to itself', () => {
		assert.deepEqual(names(groupUnits([units[3]], 60)), ['d']);
	});

	it('makes one group when there is no usable limit', () => {
		for (const limit of [0, NaN, Infinity]) assert.deepEqual(names(groupUnits(units, limit)), ['abcde']);
		assert.deepEqual(groupUnits([], 60), []);
	});
});

describe('joinResults', () => {
	it('joins suites and adds up the counts', () => {
		const joined = joinResults([
			{ config: { x: 1 }, suites: [{ title: 'a' }], errors: [], stats: { expected: 2, unexpected: 1, duration: 10 } },
			{ suites: [{ title: 'b' }], errors: [{ message: 'm' }], stats: { expected: 3, skipped: 4, duration: 5 } },
		]);
		assert.deepEqual(
			joined.suites.map((suite) => suite.title),
			['a', 'b'],
		);
		assert.deepEqual(joined.errors, [{ message: 'm' }]);
		assert.deepEqual(joined.stats, { expected: 5, unexpected: 1, duration: 15, skipped: 4, flaky: 0 });
		assert.deepEqual(joined.config, { x: 1 });
	});

	it('gives an empty report for no runs', () => {
		assert.deepEqual(joinResults([]).suites, []);
	});
});
