import { Tree } from '@nx/devkit';
import { HlmButtonGeneratorSchema } from './schema';
import hlmBaseGenerator from '../base/generator';

export async function hlmButtonGenerator(tree: Tree, options: HlmButtonGeneratorSchema) {
  options.additionalDependencies = {
    '@spartan-ng/ui-core-brain': '^0.0.1-alpha.10',
    '@spartan-ng/ui-core-helm': '^0.0.1-alpha.10',
  };
  await hlmBaseGenerator(tree, { ...options, internalName: 'ui-button-helm', publicName: 'button-helm' });
}

export default hlmButtonGenerator;
