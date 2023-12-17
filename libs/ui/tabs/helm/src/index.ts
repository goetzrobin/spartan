import { NgModule } from '@angular/core';

import { HlmTabsContentDirective } from './lib/hlm-tabs-content.directive';
import { HlmTabsListComponent } from './lib/hlm-tabs-list.component';
import { HlmTabsTriggerDirective } from './lib/hlm-tabs-trigger.directive';

export * from './lib/hlm-tabs-content.directive';
export * from './lib/hlm-tabs-list.component';
export * from './lib/hlm-tabs-trigger.directive';

export const HlmTabsImports = [HlmTabsListComponent, HlmTabsTriggerDirective, HlmTabsContentDirective] as const;

@NgModule({
	imports: [...HlmTabsImports],
	exports: [...HlmTabsImports],
})
export class HlmTabsModule {}
