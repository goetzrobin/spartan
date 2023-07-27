import { Tree } from '@nx/devkit';
import { HlmIconGeneratorSchema } from './schema';
import hlmBaseGenerator from '../base/generator';

export async function hlmIconGenerator(tree: Tree, options: HlmIconGeneratorSchema) {
  await hlmBaseGenerator(tree, { ...options, internalName: 'ui-icon-helm', publicName: 'icon-helm' });
}

export default hlmIconGenerator;
