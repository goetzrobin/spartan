import { Tree } from '@nx/devkit';
import { HlmSheetGeneratorSchema } from './schema';
import hlmBaseGenerator from '../base/generator';

export async function hlmSheetGenerator(tree: Tree, options: HlmSheetGeneratorSchema) {
  options.additionalDependencies = {
    '@spartan-ng/ui-core-brain': '^0.0.1-alpha.10',
    '@spartan-ng/ui-core-helm': '^0.0.1-alpha.10',
  };
  await hlmBaseGenerator(tree, { ...options, internalName: 'ui-sheet-helm', publicName: 'sheet-helm' });
}

export default hlmSheetGenerator;
