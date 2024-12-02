import { type Tree, readProjectConfiguration } from '@nx/devkit';
import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';

import replaceUiVersionGenerator from './generator';

describe('replace-cli-version generator', () => {
	let tree: Tree;

	beforeEach(() => {
		tree = createTreeWithEmptyWorkspace();
	});

	it.skip('should run successfully', async () => {
		await replaceUiVersionGenerator(tree);
		const config = readProjectConfiguration(tree, 'test');
		expect(config).toBeDefined();
	});
});
