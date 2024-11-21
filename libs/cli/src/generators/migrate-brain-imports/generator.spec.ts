import { Tree, readProjectConfiguration } from '@nx/devkit';
import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';

import { migrateBrainImportsGenerator } from './generator';
import { MigrateBrainImportsGeneratorSchema } from './schema';

describe('migrate-brain-imports generator', () => {
	let tree: Tree;
	const options: MigrateBrainImportsGeneratorSchema = { name: 'test' };

	beforeEach(() => {
		tree = createTreeWithEmptyWorkspace();
	});

	it('should run successfully', async () => {
		await migrateBrainImportsGenerator(tree, options);
		const config = readProjectConfiguration(tree, 'test');
		expect(config).toBeDefined();
	});
});
