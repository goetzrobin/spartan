import { NgModule } from '@angular/core';

import { HlmAccordionDirective } from './lib/hlm-accordion.directive';
import { HlmAccordionItemDirective } from './lib/hlm-accordion-item.directive';
import { HlmAccordionTriggerDirective } from './lib/hlm-accordion-trigger.directive';
import { HlmAccordionContentDirective } from './lib/hlm-accordion-content.directive';
import { HlmAccordionIconComponent } from './lib/hlm-accordion-icon.component';

export * from './lib/hlm-accordion.directive';
export * from './lib/hlm-accordion-item.directive';
export * from './lib/hlm-accordion-trigger.directive';
export * from './lib/hlm-accordion-content.directive';
export * from './lib/hlm-accordion-icon.component';

export const HlmAccordionImports = [
  HlmAccordionDirective,
  HlmAccordionItemDirective,
  HlmAccordionTriggerDirective,
  HlmAccordionContentDirective,
  HlmAccordionIconComponent,
] as const;

@NgModule({
  imports: [...HlmAccordionImports],
  exports: [...HlmAccordionImports],
})
export class HlmAccordionModule {}
