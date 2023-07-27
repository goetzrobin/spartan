import { Tree } from '@nx/devkit';
import { HlmMenuGeneratorSchema } from './schema';
import hlmBaseGenerator from '../base/generator';

export async function hlmMenuGenerator(tree: Tree, options: HlmMenuGeneratorSchema) {
  await hlmBaseGenerator(tree, { ...options, internalName: 'ui-menu-helm', publicName: 'menu-helm' });
}

export default hlmMenuGenerator;
