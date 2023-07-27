import { Tree } from '@nx/devkit';
import { HlmTypographyGeneratorSchema } from './schema';
import hlmBaseGenerator from '../base/generator';

export async function hlmTypographyGenerator(tree: Tree, options: HlmTypographyGeneratorSchema) {
  options.additionalDependencies = {
    '@spartan-ng/ui-core-brain': '^0.0.1-alpha.10',
    '@spartan-ng/ui-core-helm': '^0.0.1-alpha.10',
  };
  await hlmBaseGenerator(tree, { ...options, internalName: 'ui-typography-helm', publicName: 'typography-helm' });
}

export default hlmTypographyGenerator;
