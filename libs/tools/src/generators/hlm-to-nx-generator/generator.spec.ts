import { readProjectConfiguration, Tree } from '@nx/devkit';
import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';

import { hlmToNxGeneratorGenerator } from './generator';
import { HlmToNxGeneratorGeneratorSchema } from './schema';

describe('hlm-to-nx-generator generator', () => {
	let tree: Tree;
	const options: HlmToNxGeneratorGeneratorSchema = {};

	beforeEach(() => {
		tree = createTreeWithEmptyWorkspace();
	});

	it.skip('should run successfully', async () => {
		await hlmToNxGeneratorGenerator(tree, options);
		const config = readProjectConfiguration(tree, 'test');
		expect(config).toBeDefined();
	});
});
