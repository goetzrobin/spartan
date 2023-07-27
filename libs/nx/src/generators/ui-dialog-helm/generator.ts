import { Tree } from '@nx/devkit';
import { HlmDialogGeneratorSchema } from './schema';
import hlmBaseGenerator from '../base/generator';

export async function hlmDialogGenerator(tree: Tree, options: HlmDialogGeneratorSchema) {
  options.additionalDependencies = {
    '@spartan-ng/ui-core-brain': '^0.0.1-alpha.10',
    '@spartan-ng/ui-core-helm': '^0.0.1-alpha.10',
  };
  await hlmBaseGenerator(tree, { ...options, internalName: 'ui-dialog-helm', publicName: 'dialog-helm' });
}

export default hlmDialogGenerator;
