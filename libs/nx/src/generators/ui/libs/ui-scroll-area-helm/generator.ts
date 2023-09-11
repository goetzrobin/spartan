import { Tree } from '@nx/devkit';
import { HlmBaseGeneratorSchema } from '../../../base/schema';
import hlmBaseGenerator from '../../../base/generator';

export async function generator(tree: Tree, options: HlmBaseGeneratorSchema) {
  return await hlmBaseGenerator(tree, {
    ...options,
    primitiveName: 'scrollarea',
    internalName: 'ui-scroll-area-helm',
    publicName: 'ui-scrollarea-helm',
  });
}
