import { Tree } from '@nx/devkit';
import { HlmToggleGeneratorSchema } from './schema';
import hlmBaseGenerator from '../base/generator';

export async function hlmToggleGenerator(tree: Tree, options: HlmToggleGeneratorSchema) {
  options.additionalDependencies = {
    '@spartan-ng/ui-core-brain': '^0.0.1-alpha.10',
    '@spartan-ng/ui-core-helm': '^0.0.1-alpha.10',
  };
  await hlmBaseGenerator(tree, { ...options, internalName: 'ui-toggle-helm', publicName: 'toggle-helm' });
}

export default hlmToggleGenerator;
