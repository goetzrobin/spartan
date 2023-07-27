import { Tree } from '@nx/devkit';
import { HlmAspectratioGeneratorSchema } from './schema';
import hlmBaseGenerator from '../base/generator';

export async function hlmAspectratioGenerator(tree: Tree, options: HlmAspectratioGeneratorSchema) {
  await hlmBaseGenerator(tree, { ...options, internalName: 'ui-aspect-ratio-helm', publicName: 'aspectratio-helm' });
}

export default hlmAspectratioGenerator;
