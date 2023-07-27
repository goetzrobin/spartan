import { Tree } from '@nx/devkit';
import { HlmCardGeneratorSchema } from './schema';
import hlmBaseGenerator from '../base/generator';

export async function hlmCardGenerator(tree: Tree, options: HlmCardGeneratorSchema) {
  options.additionalDependencies = {
    '@spartan-ng/ui-core-brain': '^0.0.1-alpha.10',
    '@spartan-ng/ui-core-helm': '^0.0.1-alpha.10',
  };
  await hlmBaseGenerator(tree, { ...options, internalName: 'ui-card-helm', publicName: 'card-helm' });
}

export default hlmCardGenerator;
