import { Tree } from '@nx/devkit';
import { HlmSkeletonGeneratorSchema } from './schema';
import hlmBaseGenerator from '../base/generator';

export async function hlmSkeletonGenerator(tree: Tree, options: HlmSkeletonGeneratorSchema) {
  options.additionalDependencies = {
    '@spartan-ng/ui-core-brain': '^0.0.1-alpha.10',
    '@spartan-ng/ui-core-helm': '^0.0.1-alpha.10',
  };
  await hlmBaseGenerator(tree, { ...options, internalName: 'ui-skeleton-helm', publicName: 'skeleton-helm' });
}

export default hlmSkeletonGenerator;
