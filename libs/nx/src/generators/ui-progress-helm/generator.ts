import { Tree } from '@nx/devkit';
import { HlmProgressGeneratorSchema } from './schema';
import hlmBaseGenerator from '../base/generator';

export async function hlmProgressGenerator(tree: Tree, options: HlmProgressGeneratorSchema) {
  options.additionalDependencies = {
    '@spartan-ng/ui-core-brain': '^0.0.1-alpha.10',
    '@spartan-ng/ui-core-helm': '^0.0.1-alpha.10',
  };
  await hlmBaseGenerator(tree, { ...options, internalName: 'ui-progress-helm', publicName: 'progress-helm' });
}

export default hlmProgressGenerator;
