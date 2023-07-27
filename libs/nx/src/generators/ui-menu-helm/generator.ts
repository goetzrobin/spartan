import { Tree } from '@nx/devkit';
import { HlmMenuGeneratorSchema } from './schema';
import hlmBaseGenerator from '../base/generator';

export async function hlmMenuGenerator(tree: Tree, options: HlmMenuGeneratorSchema) {
  options.additionalDependencies = {
    '@angular/cdk': '^16.0.0',
    '@spartan-ng/ui-core-brain': '^0.0.1-alpha.10',
    '@spartan-ng/ui-core-helm': '^0.0.1-alpha.10',
    '@ng-icons/radix-icons': '^25.1.0',
  };
  await hlmBaseGenerator(tree, { ...options, internalName: 'ui-menu-helm', publicName: 'menu-helm' });
}

export default hlmMenuGenerator;
