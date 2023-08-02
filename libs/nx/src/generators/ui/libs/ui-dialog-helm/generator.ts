import { Tree } from '@nx/devkit';
import { HlmBaseGeneratorSchema } from '../../../base/schema';
import hlmBaseGenerator from '../../../base/generator';

export async function generator(tree: Tree, options: HlmBaseGeneratorSchema) {
  return await hlmBaseGenerator(tree, {
    ...options,
    primitiveName: 'dialog',
    internalName: 'ui-dialog-helm',
    publicName: 'dialog-helm',
  });
}
