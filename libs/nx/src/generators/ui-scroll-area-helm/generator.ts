import { Tree } from '@nx/devkit';
import { HlmScrollareaGeneratorSchema } from './schema';
import hlmBaseGenerator from '../base/generator';

export async function hlmScrollareaGenerator(tree: Tree, options: HlmScrollareaGeneratorSchema) {
  options.additionalDependencies = {
    '@spartan-ng/ui-core-brain': '^0.0.1-alpha.10',
    '@spartan-ng/ui-core-helm': '^0.0.1-alpha.10',
    'ngx-scrollbar': '^13.0.1',
  };
  await hlmBaseGenerator(tree, { ...options, internalName: 'ui-scroll-area-helm', publicName: 'scrollarea-helm' });
}

export default hlmScrollareaGenerator;
