import { NgModule } from '@angular/core';

import { HlmAccordionContentDirective } from './lib/hlm-accordion-content.directive';
import { HlmAccordionIconDirective } from './lib/hlm-accordion-icon.directive';
import { HlmAccordionItemDirective } from './lib/hlm-accordion-item.directive';
import { HlmAccordionTriggerDirective } from './lib/hlm-accordion-trigger.directive';
import { HlmAccordionDirective } from './lib/hlm-accordion.directive';

export * from './lib/hlm-accordion-content.directive';
export * from './lib/hlm-accordion-icon.directive';
export * from './lib/hlm-accordion-item.directive';
export * from './lib/hlm-accordion-trigger.directive';
export * from './lib/hlm-accordion.directive';

export const HlmAccordionImports = [
	HlmAccordionDirective,
	HlmAccordionItemDirective,
	HlmAccordionTriggerDirective,
	HlmAccordionContentDirective,
	HlmAccordionIconDirective,
] as const;

@NgModule({
	imports: [...HlmAccordionImports],
	exports: [...HlmAccordionImports],
})
export class HlmAccordionModule {}
