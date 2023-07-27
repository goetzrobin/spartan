import { Tree } from '@nx/devkit';
import { HlmLabelGeneratorSchema } from './schema';
import hlmBaseGenerator from '../base/generator';

export async function hlmLabelGenerator(tree: Tree, options: HlmLabelGeneratorSchema) {
  options.additionalDependencies = {
    '@spartan-ng/ui-core-brain': '^0.0.1-alpha.10',
    '@spartan-ng/ui-core-helm': '^0.0.1-alpha.10',
  };
  await hlmBaseGenerator(tree, { ...options, internalName: 'ui-label-helm', publicName: 'label-helm' });
}

export default hlmLabelGenerator;
