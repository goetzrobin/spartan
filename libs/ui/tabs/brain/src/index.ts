import { NgModule } from '@angular/core';

import { BrnTabsComponent } from './lib/brn-tabs.component';
import { BrnTabsListComponent } from './lib/brn-tabs-list.component';
import { BrnTabsTriggerDirective } from './lib/brn-tabs-trigger.directive';
import { BrnTabsContentDirective } from './lib/brn-tabs-content.directive';

export * from './lib/brn-tabs.component';
export * from './lib/brn-tabs-list.component';
export * from './lib/brn-tabs-trigger.directive';
export * from './lib/brn-tabs-content.directive';

export const BrnTabsImports = [
  BrnTabsComponent,
  BrnTabsListComponent,
  BrnTabsTriggerDirective,
  BrnTabsContentDirective,
] as const;

@NgModule({
  imports: [...BrnTabsImports],
  exports: [...BrnTabsImports],
})
export class BrnTabsModule {}
