import { NgModule } from '@angular/core';

import { BrnCollapsibleComponent } from './lib/brn-collapsible.component';
import { BrnCollapsibleTriggerDirective } from './lib/brn-collapsible-trigger.directive';
import { BrnCollapsibleContentComponent } from './lib/brn-collapsible-content.component';

export * from './lib/brn-collapsible.component';
export * from './lib/brn-collapsible-trigger.directive';
export * from './lib/brn-collapsible-content.component';

export const BrnCollapsibleImports = [
  BrnCollapsibleComponent,
  BrnCollapsibleTriggerDirective,
  BrnCollapsibleContentComponent,
] as const;

@NgModule({
  imports: [...BrnCollapsibleImports],
  exports: [...BrnCollapsibleImports],
})
export class BrnCollapsibleModule {}
