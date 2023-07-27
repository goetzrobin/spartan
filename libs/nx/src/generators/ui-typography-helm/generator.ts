import { Tree } from '@nx/devkit';
import { HlmTypographyGeneratorSchema } from './schema';
import hlmBaseGenerator from '../base/generator';

export async function hlmTypographyGenerator(tree: Tree, options: HlmTypographyGeneratorSchema) {
  await hlmBaseGenerator(tree, { ...options, internalName: 'ui-typography-helm', publicName: 'typography-helm' });
}

export default hlmTypographyGenerator;
