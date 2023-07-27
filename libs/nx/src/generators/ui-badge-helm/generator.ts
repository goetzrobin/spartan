import { Tree } from '@nx/devkit';
import { HlmBadgeGeneratorSchema } from './schema';
import hlmBaseGenerator from '../base/generator';

export async function hlmBadgeGenerator(tree: Tree, options: HlmBadgeGeneratorSchema) {
  options.additionalDependencies = {
    '@spartan-ng/ui-core-brain': '^0.0.1-alpha.10',
    '@spartan-ng/ui-core-helm': '^0.0.1-alpha.10',
  };
  await hlmBaseGenerator(tree, { ...options, internalName: 'ui-badge-helm', publicName: 'badge-helm' });
}

export default hlmBadgeGenerator;
