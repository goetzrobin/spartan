import { Tree } from '@nx/devkit';
import hlmBaseGenerator from '../../../base/generator';
import { HlmBaseGeneratorSchema } from '../../../base/schema';

export async function generator(tree: Tree, options: HlmBaseGeneratorSchema) {
	return await hlmBaseGenerator(tree, {
		...options,
		primitiveName: 'spinner',
		internalName: 'ui-spinner-helm',
		publicName: 'ui-spinner-helm',
	});
}
