import { Tree } from '@nx/devkit';
import { HlmSheetGeneratorSchema } from './schema';
import hlmBaseGenerator from '../base/generator';

export async function hlmSheetGenerator(tree: Tree, options: HlmSheetGeneratorSchema) {
  await hlmBaseGenerator(tree, { ...options, internalName: 'ui-sheet-helm', publicName: 'sheet-helm' });
}

export default hlmSheetGenerator;
