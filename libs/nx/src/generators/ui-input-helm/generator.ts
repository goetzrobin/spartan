import { Tree } from '@nx/devkit';
import { HlmInputGeneratorSchema } from './schema';
import hlmBaseGenerator from '../base/generator';

export async function hlmInputGenerator(tree: Tree, options: HlmInputGeneratorSchema) {
  options.additionalDependencies = {
    '@spartan-ng/ui-core-brain': '^0.0.1-alpha.10',
    '@spartan-ng/ui-core-helm': '^0.0.1-alpha.10',
  };
  await hlmBaseGenerator(tree, { ...options, internalName: 'ui-input-helm', publicName: 'input-helm' });
}

export default hlmInputGenerator;
