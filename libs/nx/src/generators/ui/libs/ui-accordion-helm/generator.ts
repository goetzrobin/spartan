import { Tree } from '@nx/devkit';
import hlmBaseGenerator from '../../../base/generator';
import { HlmBaseGeneratorSchema } from '../../../base/schema';

export async function generator(tree: Tree, options: HlmBaseGeneratorSchema) {
	return await hlmBaseGenerator(tree, {
		...options,
		primitiveName: 'accordion',
		internalName: 'ui-accordion-helm',
		publicName: 'ui-accordion-helm',
	});
}
