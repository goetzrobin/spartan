import { Tree } from '@nx/devkit';
import { HlmBaseGeneratorSchema } from '../../../base/schema';
import hlmBaseGenerator from '../../../base/generator';

export async function generator(tree: Tree, options: HlmBaseGeneratorSchema) {
  return await hlmBaseGenerator(tree, {
    ...options,
    primitiveName: 'progress',
    internalName: 'ui-progress-helm',
    publicName: 'progress-helm',
  });
}
