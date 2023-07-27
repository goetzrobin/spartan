import { Tree } from '@nx/devkit';
import { HlmTabsGeneratorSchema } from './schema';
import hlmBaseGenerator from '../base/generator';

export async function hlmTabsGenerator(tree: Tree, options: HlmTabsGeneratorSchema) {
  await hlmBaseGenerator(tree, { ...options, internalName: 'ui-tabs-helm', publicName: 'tabs-helm' });
}

export default hlmTabsGenerator;
