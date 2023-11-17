import { NgModule } from '@angular/core';

import { BrnAccordionContentComponent } from './lib/brn-accordion-content.component';
import { BrnAccordionItemComponent } from './lib/brn-accordion-item.component';
import { BrnAccordionTriggerComponent } from './lib/brn-accordion-trigger.component';
import { BrnAccordionComponent } from './lib/brn-accordion.component';

export * from './lib/brn-accordion-content.component';
export * from './lib/brn-accordion-item.component';
export * from './lib/brn-accordion-trigger.component';
export * from './lib/brn-accordion.component';

export const BrnAccordionImports = [
	BrnAccordionComponent,
	BrnAccordionContentComponent,
	BrnAccordionItemComponent,
	BrnAccordionTriggerComponent,
] as const;

@NgModule({
	imports: [...BrnAccordionImports],
	exports: [...BrnAccordionImports],
})
export class BrnAccordionModule {}
