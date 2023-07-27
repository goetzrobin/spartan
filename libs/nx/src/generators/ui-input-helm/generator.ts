import { Tree } from '@nx/devkit';
import { HlmInputGeneratorSchema } from './schema';
import hlmBaseGenerator from '../base/generator';

export async function hlmInputGenerator(tree: Tree, options: HlmInputGeneratorSchema) {
  await hlmBaseGenerator(tree, { ...options, internalName: 'ui-input-helm', publicName: 'input-helm' });
}

export default hlmInputGenerator;
