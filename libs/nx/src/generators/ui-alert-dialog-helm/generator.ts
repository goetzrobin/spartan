import { Tree } from '@nx/devkit';
import { HlmAlertdialogGeneratorSchema } from './schema';
import hlmBaseGenerator from '../base/generator';

export async function hlmAlertdialogGenerator(tree: Tree, options: HlmAlertdialogGeneratorSchema) {
  await hlmBaseGenerator(tree, { ...options, internalName: 'ui-alert-dialog-helm', publicName: 'alertdialog-helm' });
}

export default hlmAlertdialogGenerator;
