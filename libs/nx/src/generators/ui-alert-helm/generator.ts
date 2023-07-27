import { Tree } from '@nx/devkit';
import { HlmAlertGeneratorSchema } from './schema';
import hlmBaseGenerator from '../base/generator';

export async function hlmAlertGenerator(tree: Tree, options: HlmAlertGeneratorSchema) {
  await hlmBaseGenerator(tree, { ...options, internalName: 'ui-alert-helm', publicName: 'alert-helm' });
}

export default hlmAlertGenerator;
