import { Tree } from '@nx/devkit';
import { HlmSwitchGeneratorSchema } from './schema';
import hlmBaseGenerator from '../base/generator';

export async function hlmSwitchGenerator(tree: Tree, options: HlmSwitchGeneratorSchema) {
  await hlmBaseGenerator(tree, { ...options, internalName: 'ui-switch-helm', publicName: 'switch-helm' });
}

export default hlmSwitchGenerator;
