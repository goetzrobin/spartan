import { Tree } from '@nx/devkit';
import { HlmAvatarGeneratorSchema } from './schema';
import hlmBaseGenerator from '../base/generator';

export async function hlmAvatarGenerator(tree: Tree, options: HlmAvatarGeneratorSchema) {
  await hlmBaseGenerator(tree, { ...options, internalName: 'ui-avatar-helm', publicName: 'avatar-helm' });
}

export default hlmAvatarGenerator;
