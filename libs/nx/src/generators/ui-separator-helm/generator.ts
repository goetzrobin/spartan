import { Tree } from '@nx/devkit';
import { HlmSeparatorGeneratorSchema } from './schema';
import hlmBaseGenerator from '../base/generator';

export async function hlmSeparatorGenerator(tree: Tree, options: HlmSeparatorGeneratorSchema) {
  options.additionalDependencies = {
    '@spartan-ng/ui-core-brain': '^0.0.1-alpha.10',
    '@spartan-ng/ui-core-helm': '^0.0.1-alpha.10',
  };
  await hlmBaseGenerator(tree, { ...options, internalName: 'ui-separator-helm', publicName: 'separator-helm' });
}

export default hlmSeparatorGenerator;
