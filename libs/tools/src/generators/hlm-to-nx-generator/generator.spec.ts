import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';
import { Tree, readProjectConfiguration } from '@nx/devkit';

import { hlmToNxGeneratorGenerator } from './generator';
import { HlmToNxGeneratorGeneratorSchema } from './schema';

describe('hlm-to-nx-generator generator', () => {
  let tree: Tree;
  const options: HlmToNxGeneratorGeneratorSchema = { name: 'test' };

  beforeEach(() => {
    tree = createTreeWithEmptyWorkspace();
  });

  it('should run successfully', async () => {
    await hlmToNxGeneratorGenerator(tree, options);
    const config = readProjectConfiguration(tree, 'test');
    expect(config).toBeDefined();
  });
});
