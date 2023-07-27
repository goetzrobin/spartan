import { Tree } from '@nx/devkit';
import { HlmCardGeneratorSchema } from './schema';
import hlmBaseGenerator from '../base/generator';

export async function hlmCardGenerator(tree: Tree, options: HlmCardGeneratorSchema) {
  await hlmBaseGenerator(tree, { ...options, internalName: 'ui-card-helm', publicName: 'card-helm' });
}

export default hlmCardGenerator;
