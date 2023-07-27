import { Tree } from '@nx/devkit';
import { HlmProgressGeneratorSchema } from './schema';
import hlmBaseGenerator from '../base/generator';

export async function hlmProgressGenerator(tree: Tree, options: HlmProgressGeneratorSchema) {
  await hlmBaseGenerator(tree, { ...options, internalName: 'ui-progress-helm', publicName: 'progress-helm' });
}

export default hlmProgressGenerator;
