import { NgModule } from '@angular/core';

import { BrnAccordionContentComponent } from './lib/brn-accordion-content.component';
import { BrnAccordionItemDirective } from './lib/brn-accordion-item.directive';
import { BrnAccordionTriggerComponent } from './lib/brn-accordion-trigger.component';
import { BrnAccordionDirective } from './lib/brn-accordion.directive';

export * from './lib/brn-accordion-content.component';
export * from './lib/brn-accordion-item.directive';
export * from './lib/brn-accordion-trigger.component';
export * from './lib/brn-accordion.directive';

export const BrnAccordionImports = [
	BrnAccordionDirective,
	BrnAccordionContentComponent,
	BrnAccordionItemDirective,
	BrnAccordionTriggerComponent,
] as const;

@NgModule({
	imports: [...BrnAccordionImports],
	exports: [...BrnAccordionImports],
})
export class BrnAccordionModule {}
