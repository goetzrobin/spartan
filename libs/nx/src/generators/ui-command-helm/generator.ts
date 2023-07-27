import { Tree } from '@nx/devkit';
import { HlmCommandGeneratorSchema } from './schema';
import hlmBaseGenerator from '../base/generator';

export async function hlmCommandGenerator(tree: Tree, options: HlmCommandGeneratorSchema) {
  await hlmBaseGenerator(tree, { ...options, internalName: 'ui-command-helm', publicName: 'command-helm' });
}

export default hlmCommandGenerator;
