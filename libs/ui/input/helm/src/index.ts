import { NgModule } from '@angular/core';
import { HlmInputDirective } from './lib/hlm-input.directive';
import { HlmInputErrorDirective } from './lib/hlm-input-error.directive';

export * from './lib/hlm-input.directive';
export * from './lib/hlm-input-error.directive';

@NgModule({
  imports: [HlmInputDirective, HlmInputErrorDirective],
  exports: [HlmInputDirective, HlmInputErrorDirective],
})
export class HlmInputModule {}
