import { Tree } from '@nx/devkit';
import { HlmScrollareaGeneratorSchema } from './schema';
import hlmBaseGenerator from '../base/generator';

export async function hlmScrollareaGenerator(tree: Tree, options: HlmScrollareaGeneratorSchema) {
  await hlmBaseGenerator(tree, { ...options, internalName: 'ui-scroll-area-helm', publicName: 'scrollarea-helm' });
}

export default hlmScrollareaGenerator;
