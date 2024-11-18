import { Tree, readProjectConfiguration } from '@nx/devkit';
import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';

import { brainSecondaryEntrypointGenerator } from './generator';
import { BrainSecondaryEntrypointGeneratorSchema } from './schema';

describe('brain-secondary-entrypoint generator', () => {
	let tree: Tree;
	const options: BrainSecondaryEntrypointGeneratorSchema = { name: 'test' };

	beforeEach(() => {
		tree = createTreeWithEmptyWorkspace();
	});

	it('should run successfully', async () => {
		await brainSecondaryEntrypointGenerator(tree, options);
		const config = readProjectConfiguration(tree, 'test');
		expect(config).toBeDefined();
	});
});
