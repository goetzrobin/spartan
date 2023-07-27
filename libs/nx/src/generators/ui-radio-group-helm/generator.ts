import { Tree } from '@nx/devkit';
import { HlmRadiogroupGeneratorSchema } from './schema';
import hlmBaseGenerator from '../base/generator';

export async function hlmRadiogroupGenerator(tree: Tree, options: HlmRadiogroupGeneratorSchema) {
  await hlmBaseGenerator(tree, { ...options, internalName: 'ui-radio-group-helm', publicName: 'radiogroup-helm' });
}

export default hlmRadiogroupGenerator;
