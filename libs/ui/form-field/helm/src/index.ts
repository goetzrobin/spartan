import { NgModule } from '@angular/core';
import { HlmErrorDirective } from './lib/directives/hlm-error.directive';
import { HlmHintDirective } from './lib/directives/hlm-hint.directive';
import { HlmFormFieldComponent } from './lib/hlm-form-field.component';

export * from './lib/hlm-form-field.component';
export * from './lib/directives/hlm-error.directive';
export * from './lib/directives/hlm-hint.directive';

@NgModule({
	imports: [HlmFormFieldComponent, HlmErrorDirective, HlmHintDirective],
	exports: [HlmFormFieldComponent, HlmErrorDirective, HlmHintDirective],
})
export class HlmFormFieldModule {}
