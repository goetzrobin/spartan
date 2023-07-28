import { NgModule } from '@angular/core';

import { HlmPopoverContentDirective } from './lib/hlm-popover-content.directive';
import { HlmPopoverCloseDirective } from './lib/hlm-popover-close.directive';

export * from './lib/hlm-popover-close.directive';
export * from './lib/hlm-popover-content.directive';

export const HlmPopoverImports = [HlmPopoverContentDirective, HlmPopoverCloseDirective] as const;

@NgModule({
  imports: [...HlmPopoverImports],
  exports: [...HlmPopoverImports],
})
export class HlmPopoverModule {}
