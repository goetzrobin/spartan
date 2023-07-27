import { Tree } from '@nx/devkit';
import { HlmSpinnerGeneratorSchema } from './schema';
import hlmBaseGenerator from '../base/generator';

export async function hlmSpinnerGenerator(tree: Tree, options: HlmSpinnerGeneratorSchema) {
  options.additionalDependencies = {
    '@spartan-ng/ui-core-brain': '^0.0.1-alpha.10',
    '@spartan-ng/ui-core-helm': '^0.0.1-alpha.10',
  };
  await hlmBaseGenerator(tree, { ...options, internalName: 'ui-spinner-helm', publicName: 'spinner-helm' });
}

export default hlmSpinnerGenerator;
