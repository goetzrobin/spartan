import { NgModule } from '@angular/core';

import { BrnTabsListDirective } from './lib/brn-tabs-list.directive';
import { BrnTabsContentDirective, BrnTabsDirective, BrnTabsTriggerDirective } from './lib/brn-tabs-trigger.directive';

export * from './lib/brn-tabs-list.directive';
export * from './lib/brn-tabs-paginated-list.directive';
export * from './lib/brn-tabs-trigger.directive';

export const BrnTabsImports = [
	BrnTabsDirective,
	BrnTabsListDirective,
	BrnTabsTriggerDirective,
	BrnTabsContentDirective,
] as const;

@NgModule({
	imports: [...BrnTabsImports],
	exports: [...BrnTabsImports],
})
export class BrnTabsModule {}
