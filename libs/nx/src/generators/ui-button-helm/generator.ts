import { Tree } from '@nx/devkit';
import { HlmButtonGeneratorSchema } from './schema';
import hlmBaseGenerator from '../base/generator';

export async function hlmButtonGenerator(tree: Tree, options: HlmButtonGeneratorSchema) {
  await hlmBaseGenerator(tree, { ...options, internalName: 'ui-button-helm', publicName: 'button-helm' });
}

export default hlmButtonGenerator;
