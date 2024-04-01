import { NgModule } from '@angular/core';
import { HlmInputErrorDirective } from './lib/hlm-input-error.directive';
import { HlmInputFormFieldComponent } from './lib/hlm-input-form-field.component';
import { HlmInputPrefixDirective } from './lib/hlm-input-prefix.directive';
import { HlmInputSuffixDirective } from './lib/hlm-input-suffix.directive';
import { HlmInputDirective } from './lib/hlm-input.directive';

export * from './lib/hlm-input-error.directive';
export * from './lib/hlm-input.directive';

@NgModule({
	imports: [
		HlmInputDirective,
		HlmInputErrorDirective,
		HlmInputFormFieldComponent,
		HlmInputSuffixDirective,
		HlmInputPrefixDirective,
	],
	exports: [
		HlmInputDirective,
		HlmInputErrorDirective,
		HlmInputFormFieldComponent,
		HlmInputSuffixDirective,
		HlmInputPrefixDirective,
	],
})
export class HlmInputModule {}
