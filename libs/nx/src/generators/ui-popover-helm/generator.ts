import { Tree } from '@nx/devkit';
import { HlmPopoverGeneratorSchema } from './schema';
import hlmBaseGenerator from '../base/generator';

export async function hlmPopoverGenerator(tree: Tree, options: HlmPopoverGeneratorSchema) {
  options.additionalDependencies = {
    '@spartan-ng/ui-core-brain': '^0.0.1-alpha.10',
    '@spartan-ng/ui-core-helm': '^0.0.1-alpha.10',
  };
  await hlmBaseGenerator(tree, { ...options, internalName: 'ui-popover-helm', publicName: 'popover-helm' });
}

export default hlmPopoverGenerator;
