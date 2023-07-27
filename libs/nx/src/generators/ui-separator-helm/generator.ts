import { Tree } from '@nx/devkit';
import { HlmSeparatorGeneratorSchema } from './schema';
import hlmBaseGenerator from '../base/generator';

export async function hlmSeparatorGenerator(tree: Tree, options: HlmSeparatorGeneratorSchema) {
  await hlmBaseGenerator(tree, { ...options, internalName: 'ui-separator-helm', publicName: 'separator-helm' });
}

export default hlmSeparatorGenerator;
