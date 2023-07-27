import { Tree } from '@nx/devkit';
import { HlmBadgeGeneratorSchema } from './schema';
import hlmBaseGenerator from '../base/generator';

export async function hlmBadgeGenerator(tree: Tree, options: HlmBadgeGeneratorSchema) {
  await hlmBaseGenerator(tree, { ...options, internalName: 'ui-badge-helm', publicName: 'badge-helm' });
}

export default hlmBadgeGenerator;
