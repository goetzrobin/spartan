import { Tree } from '@nx/devkit';
import { HlmRadiogroupGeneratorSchema } from './schema';
import hlmBaseGenerator from '../base/generator';

export async function hlmRadiogroupGenerator(tree: Tree, options: HlmRadiogroupGeneratorSchema) {
  options.additionalDependencies = {
    '@spartan-ng/ui-core-brain': '^0.0.1-alpha.10',
    '@spartan-ng/ui-core-helm': '^0.0.1-alpha.10',
    '@ng-icons/radix-icons': '^25.1.0',
  };
  await hlmBaseGenerator(tree, { ...options, internalName: 'ui-radio-group-helm', publicName: 'radiogroup-helm' });
}

export default hlmRadiogroupGenerator;
