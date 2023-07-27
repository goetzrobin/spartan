import { Tree } from '@nx/devkit';
import { HlmAspectratioGeneratorSchema } from './schema';
import hlmBaseGenerator from '../base/generator';

export async function hlmAspectratioGenerator(tree: Tree, options: HlmAspectratioGeneratorSchema) {
  options.additionalDependencies = {
    '@angular/cdk': '^16.0.0',
    '@spartan-ng/ui-core-brain': '^0.0.1-alpha.10',
    '@spartan-ng/ui-core-helm': '^0.0.1-alpha.10',
  };
  await hlmBaseGenerator(tree, { ...options, internalName: 'ui-aspect-ratio-helm', publicName: 'aspectratio-helm' });
}

export default hlmAspectratioGenerator;
