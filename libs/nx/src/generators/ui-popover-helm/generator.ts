import { Tree } from '@nx/devkit';
import { HlmPopoverGeneratorSchema } from './schema';
import hlmBaseGenerator from '../base/generator';

export async function hlmPopoverGenerator(tree: Tree, options: HlmPopoverGeneratorSchema) {
  await hlmBaseGenerator(tree, { ...options, internalName: 'ui-popover-helm', publicName: 'popover-helm' });
}

export default hlmPopoverGenerator;
