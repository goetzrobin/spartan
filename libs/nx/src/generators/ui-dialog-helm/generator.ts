import { Tree } from '@nx/devkit';
import { HlmDialogGeneratorSchema } from './schema';
import hlmBaseGenerator from '../base/generator';

export async function hlmDialogGenerator(tree: Tree, options: HlmDialogGeneratorSchema) {
  await hlmBaseGenerator(tree, { ...options, internalName: 'ui-dialog-helm', publicName: 'dialog-helm' });
}

export default hlmDialogGenerator;
