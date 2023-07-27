import { Tree } from '@nx/devkit';
import { HlmSkeletonGeneratorSchema } from './schema';
import hlmBaseGenerator from '../base/generator';

export async function hlmSkeletonGenerator(tree: Tree, options: HlmSkeletonGeneratorSchema) {
  await hlmBaseGenerator(tree, { ...options, internalName: 'ui-skeleton-helm', publicName: 'skeleton-helm' });
}

export default hlmSkeletonGenerator;
