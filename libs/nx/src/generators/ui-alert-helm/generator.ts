import { Tree } from '@nx/devkit';
import { HlmAlertGeneratorSchema } from './schema';
import hlmBaseGenerator from '../base/generator';

export async function hlmAlertGenerator(tree: Tree, options: HlmAlertGeneratorSchema) {
  options.additionalDependencies = {
    '@spartan-ng/ui-core-brain': '^0.0.1-alpha.10',
    '@spartan-ng/ui-core-helm': '^0.0.1-alpha.10',
  };
  await hlmBaseGenerator(tree, { ...options, internalName: 'ui-alert-helm', publicName: 'alert-helm' });
}

export default hlmAlertGenerator;
