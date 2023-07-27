import { Tree } from '@nx/devkit';
import { HlmIconGeneratorSchema } from './schema';
import hlmBaseGenerator from '../base/generator';

export async function hlmIconGenerator(tree: Tree, options: HlmIconGeneratorSchema) {
  options.additionalDependencies = {
    '@spartan-ng/ui-core-brain': '^0.0.1-alpha.10',
    '@spartan-ng/ui-core-helm': '^0.0.1-alpha.10',
    '@ng-icons/core': '^25.1.0',
  };
  await hlmBaseGenerator(tree, { ...options, internalName: 'ui-icon-helm', publicName: 'icon-helm' });
}

export default hlmIconGenerator;
