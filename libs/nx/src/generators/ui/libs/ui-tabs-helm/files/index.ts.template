import { NgModule } from '@angular/core';

import { HlmTabsListDirective } from './lib/hlm-tabs-list.directive';
import { HlmTabsTriggerDirective } from './lib/hlm-tabs-trigger.directive';
import { HlmTabsContentDirective } from './lib/hlm-tabs-content.directive';

export * from './lib/hlm-tabs-list.directive';
export * from './lib/hlm-tabs-trigger.directive';
export * from './lib/hlm-tabs-content.directive';

export const HlmTabsImports = [HlmTabsListDirective, HlmTabsTriggerDirective, HlmTabsContentDirective] as const;

@NgModule({
  imports: [...HlmTabsImports],
  exports: [...HlmTabsImports],
})
export class HlmTabsModule {}
