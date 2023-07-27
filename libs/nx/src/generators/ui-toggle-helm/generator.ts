import { Tree } from '@nx/devkit';
import { HlmToggleGeneratorSchema } from './schema';
import hlmBaseGenerator from '../base/generator';

export async function hlmToggleGenerator(tree: Tree, options: HlmToggleGeneratorSchema) {
  await hlmBaseGenerator(tree, { ...options, internalName: 'ui-toggle-helm', publicName: 'toggle-helm' });
}

export default hlmToggleGenerator;
