import { Tree } from '@nx/devkit';
import { HlmCoreGeneratorSchema } from './schema';
import hlmBaseGenerator from '../base/generator';

export async function hlmCoreGenerator(tree: Tree, options: HlmCoreGeneratorSchema) {
  await hlmBaseGenerator(tree, { ...options, internalName: 'ui-core-helm', publicName: 'core-helm' });
}

export default hlmCoreGenerator;
