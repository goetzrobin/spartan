import { NgModule } from '@angular/core';
import { HlmFormFieldComponent } from './lib/hlm-form-field.component';
import { HlmErrorDirective } from './lib/directives/hlm-error.directive';
import { HlmHintDirective } from './lib/directives/hlm-hint.directive';

export * from './lib/hlm-form-field.component';
export * from './lib/directives/hlm-error.directive';
export * from './lib/directives/hlm-hint.directive';
export * from './lib/hlm-form-field-control';
export * from './lib/directives/error-state-tracker';
export * from './lib/directives/error-options';

@NgModule({
	imports: [HlmFormFieldComponent, HlmErrorDirective, HlmHintDirective],
	exports: [HlmFormFieldComponent, HlmErrorDirective, HlmHintDirective],
})
export class HlmFormFieldModule {}
