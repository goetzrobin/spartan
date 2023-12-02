import { NgModule } from '@angular/core';

import { BrnAccordionContentComponent } from './lib/brn-accordion-content.component';
import { BrnAccordionItemDirective } from './lib/brn-accordion-item.directive';
import { BrnAccordionTriggerDirective } from './lib/brn-accordion-trigger.directive';
import { BrnAccordionDirective } from './lib/brn-accordion.directive';

export * from './lib/brn-accordion-content.component';
export * from './lib/brn-accordion-item.directive';
export * from './lib/brn-accordion-trigger.directive';
export * from './lib/brn-accordion.directive';

export const BrnAccordionImports = [
	BrnAccordionDirective,
	BrnAccordionContentComponent,
	BrnAccordionItemDirective,
	BrnAccordionTriggerDirective,
] as const;

@NgModule({
	imports: [...BrnAccordionImports],
	exports: [...BrnAccordionImports],
})
export class BrnAccordionModule {}
