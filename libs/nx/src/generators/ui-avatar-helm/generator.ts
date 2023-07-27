import { Tree } from '@nx/devkit';
import { HlmAvatarGeneratorSchema } from './schema';
import hlmBaseGenerator from '../base/generator';

export async function hlmAvatarGenerator(tree: Tree, options: HlmAvatarGeneratorSchema) {
  options.additionalDependencies = {
    '@spartan-ng/ui-core-brain': '^0.0.1-alpha.10',
    '@spartan-ng/ui-core-helm': '^0.0.1-alpha.10',
  };
  await hlmBaseGenerator(tree, { ...options, internalName: 'ui-avatar-helm', publicName: 'avatar-helm' });
}

export default hlmAvatarGenerator;
