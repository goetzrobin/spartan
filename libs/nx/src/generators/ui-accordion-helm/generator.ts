import { Tree } from '@nx/devkit';
import { HlmAccordionGeneratorSchema } from './schema';
import hlmBaseGenerator from '../base/generator';

export async function hlmAccordionGenerator(tree: Tree, options: HlmAccordionGeneratorSchema) {
  await hlmBaseGenerator(tree, { ...options, internalName: 'ui-accordion-helm', publicName: 'accordion-helm' });
}

export default hlmAccordionGenerator;
