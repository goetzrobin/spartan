import { Tree } from '@nx/devkit';
import { HlmAlertdialogGeneratorSchema } from './schema';
import hlmBaseGenerator from '../base/generator';

export async function hlmAlertdialogGenerator(tree: Tree, options: HlmAlertdialogGeneratorSchema) {
  options.additionalDependencies = {
    '@spartan-ng/ui-core-brain': '^0.0.1-alpha.10',
    '@spartan-ng/ui-core-helm': '^0.0.1-alpha.10',
  };
  await hlmBaseGenerator(tree, { ...options, internalName: 'ui-alert-dialog-helm', publicName: 'alertdialog-helm' });
}

export default hlmAlertdialogGenerator;
