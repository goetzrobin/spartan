import { Tree } from '@nx/devkit';
import hlmBaseGenerator from '../../../base/generator';
import type { HlmBaseGeneratorSchema } from '../../../base/schema';

export async function generator(tree: Tree, options: HlmBaseGeneratorSchema) {
	return await hlmBaseGenerator(tree, {
		...options,
		primitiveName: 'radiogroup',
		internalName: 'ui-radio-group-helm',
		publicName: 'ui-radiogroup-helm',
	});
}
