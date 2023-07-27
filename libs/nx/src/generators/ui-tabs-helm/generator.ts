import { Tree } from '@nx/devkit';
import { HlmTabsGeneratorSchema } from './schema';
import hlmBaseGenerator from '../base/generator';

export async function hlmTabsGenerator(tree: Tree, options: HlmTabsGeneratorSchema) {
  options.additionalDependencies = {
    '@spartan-ng/ui-core-brain': '^0.0.1-alpha.10',
    '@spartan-ng/ui-core-helm': '^0.0.1-alpha.10',
  };
  await hlmBaseGenerator(tree, { ...options, internalName: 'ui-tabs-helm', publicName: 'tabs-helm' });
}

export default hlmTabsGenerator;
