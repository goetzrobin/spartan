import { Tree } from '@nx/devkit';
import { HlmCommandGeneratorSchema } from './schema';
import hlmBaseGenerator from '../base/generator';

export async function hlmCommandGenerator(tree: Tree, options: HlmCommandGeneratorSchema) {
  options.additionalDependencies = {
    '@spartan-ng/ui-core-brain': '^0.0.1-alpha.10',
    '@spartan-ng/ui-core-helm': '^0.0.1-alpha.10',
  };
  await hlmBaseGenerator(tree, { ...options, internalName: 'ui-command-helm', publicName: 'command-helm' });
}

export default hlmCommandGenerator;
