import { Tree } from '@nx/devkit';
import { HlmSpinnerGeneratorSchema } from './schema';
import hlmBaseGenerator from '../base/generator';

export async function hlmSpinnerGenerator(tree: Tree, options: HlmSpinnerGeneratorSchema) {
  await hlmBaseGenerator(tree, { ...options, internalName: 'ui-spinner-helm', publicName: 'spinner-helm' });
}

export default hlmSpinnerGenerator;
