import { Tree } from '@nx/devkit';
import { HlmSwitchGeneratorSchema } from './schema';
import hlmBaseGenerator from '../base/generator';

export async function hlmSwitchGenerator(tree: Tree, options: HlmSwitchGeneratorSchema) {
  options.additionalDependencies = {
    '@spartan-ng/ui-core-brain': '^0.0.1-alpha.10',
    '@spartan-ng/ui-core-helm': '^0.0.1-alpha.10',
  };
  await hlmBaseGenerator(tree, { ...options, internalName: 'ui-switch-helm', publicName: 'switch-helm' });
}

export default hlmSwitchGenerator;
