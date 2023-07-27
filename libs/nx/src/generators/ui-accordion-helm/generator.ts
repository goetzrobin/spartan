import { Tree } from '@nx/devkit';
import { HlmAccordionGeneratorSchema } from './schema';
import hlmBaseGenerator from '../base/generator';

export async function hlmAccordionGenerator(tree: Tree, options: HlmAccordionGeneratorSchema) {
  options.additionalDependencies = {
    '@spartan-ng/ui-core-brain': '^0.0.1-alpha.10',
    '@spartan-ng/ui-core-helm': '^0.0.1-alpha.10',
  };
  await hlmBaseGenerator(tree, { ...options, internalName: 'ui-accordion-helm', publicName: 'accordion-helm' });
}

export default hlmAccordionGenerator;
