import { NgModule } from '@angular/core';

import { HlmProgressDirective } from './lib/hlm-progress.directive';
import { HlmProgressIndicatorDirective } from './lib/hlm-progress-indicator.directive';

export * from './lib/hlm-progress.directive';
export * from './lib/hlm-progress-indicator.directive';

export const HlmProgressImports = [HlmProgressDirective, HlmProgressIndicatorDirective] as const;

@NgModule({
  imports: [...HlmProgressImports],
  exports: [...HlmProgressImports],
})
export class HlmProgressModule {}
