import { Tree } from '@nx/devkit';
import { HlmLabelGeneratorSchema } from './schema';
import hlmBaseGenerator from '../base/generator';

export async function hlmLabelGenerator(tree: Tree, options: HlmLabelGeneratorSchema) {
  await hlmBaseGenerator(tree, { ...options, internalName: 'ui-label-helm', publicName: 'label-helm' });
}

export default hlmLabelGenerator;
