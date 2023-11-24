import { NgModule } from '@angular/core';

import { BrnAccordionContentComponent } from './lib/brn-accordion-content.component';
import { BrnAccordionItemComponent } from './lib/brn-accordion-item.component';
import { BrnAccordionTriggerDirective } from './lib/brn-accordion-trigger.directive';
import { BrnAccordionDirective } from './lib/brn-accordion.directive';

export * from './lib/brn-accordion-content.component';
export * from './lib/brn-accordion-item.component';
export * from './lib/brn-accordion-trigger.directive';
export * from './lib/brn-accordion.directive';

export const BrnAccordionImports = [
	BrnAccordionDirective,
	BrnAccordionContentComponent,
	BrnAccordionItemComponent,
	BrnAccordionTriggerDirective,
] as const;

@NgModule({
	imports: [...BrnAccordionImports],
	exports: [...BrnAccordionImports],
})
export class BrnAccordionModule {}
