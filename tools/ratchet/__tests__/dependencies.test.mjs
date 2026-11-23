import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { countDependencies, lowestMajor, requirementChanges, requirements } from '../lib/dependencies.mjs';

describe('lowestMajor', () => {
	const cases = [
		['>=21.0.0 <23.0.0', 21],
		['^0.7.0', 0],
		['7.5.4', 7],
		['~7.8.1', 7],
		['>=6.6.0', 6],
		['^19.1.5 || ^20.0.0', 19],
		['>=5.0.0 <7.0.0', 5],
	];
	for (const [range, major] of cases) {
		it(`reads ${major} from ${range}`, () => {
			assert.equal(lowestMajor(range), major);
		});
	}

	it('returns undefined for a range with no version', () => {
		assert.equal(lowestMajor('workspace:*'), undefined);
	});
});

describe('requirements', () => {
	it('merges dependencies and peers and leaves out the own scope', () => {
		const manifest = {
			dependencies: { nx: '>=21.0.0' },
			peerDependencies: { '@spartan-ng/brain': '1.10.0', tslib: '^2.3.0' },
		};
		assert.deepEqual(requirements(manifest), { nx: 21, tslib: 2 });
	});
});

describe('requirementChanges', () => {
	it('reports a new requirement and a raised lowest major', () => {
		const changes = requirementChanges({ nx: 21, tslib: 2 }, { nx: 22, tslib: 2, zod: 4 });
		assert.deepEqual(changes, ['nx: lowest major 21 became 22', 'zod is new (lowest major 4)']);
	});

	it('ignores a removed requirement and a wider upper bound', () => {
		assert.deepEqual(requirementChanges({ nx: 21, zod: 3 }, { nx: lowestMajor('>=21.0.0 <24.0.0') }), []);
	});
});

describe('countDependencies', () => {
	const manifest = (dependencies, peerDependencies) => ({ dependencies, peerDependencies });
	const manifests = {
		brain: manifest(undefined, { rxjs: '>=6.6.0' }),
		helm: manifest(undefined, { rxjs: '^7.8.0' }),
		cli: manifest({ nx: '>=21.0.0', semver: '7.5.4' }, { tslib: '^2.3.0' }),
		mcp: manifest({ zod: '^3.25.76' }),
		trpc: manifest(undefined, {}),
		registry: manifest({ tslib: '^2.8.1' }),
	};

	it('counts what each library installs and what changed against the accepted list', () => {
		const accepted = { brain: { rxjs: 6 }, helm: { rxjs: 6 }, cli: { nx: 21, semver: 7, tslib: 2 } };
		const { counts, changes } = countDependencies(manifests, accepted);
		assert.deepEqual(counts.installedPackages, { brain: 0, helm: 0, cli: 2, mcp: 1, trpc: 0, registry: 1 });
		assert.deepEqual(counts.requirementChanges, { brain: 0, helm: 1, cli: 0 });
		assert.deepEqual(changes.helm, ['rxjs: lowest major 6 became 7']);
	});
});
