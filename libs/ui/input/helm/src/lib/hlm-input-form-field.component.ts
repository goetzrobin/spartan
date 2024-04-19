import { NgClass } from '@angular/common';
import { Component, ContentChild, Input } from '@angular/core';
import { HlmLabelDirective } from '@spartan-ng/ui-label-helm';
import { HlmInputPrefixDirective } from './hlm-input-prefix.directive';
import { HlmInputSuffixDirective } from './hlm-input-suffix.directive';
import { HlmInputDirective } from './hlm-input.directive';

@Component({
	standalone: true,
	selector: 'hlm-input-form-field',
	imports: [HlmInputDirective, HlmInputSuffixDirective, HlmInputPrefixDirective, HlmLabelDirective, NgClass],
	templateUrl: './hlm-input-form-field.component.html',
})
export class HlmInputFormFieldComponent {
	@ContentChild(HlmInputDirective) input: HlmInputDirective | undefined;
	@ContentChild(HlmLabelDirective) label: HlmLabelDirective | undefined;
	@ContentChild(HlmInputSuffixDirective) suffix: HlmInputSuffixDirective | undefined;
	@ContentChild(HlmInputPrefixDirective) prefix: HlmInputPrefixDirective | undefined;
	@Input() class = '';

	get hasSuffix(): boolean {
		return !!this.suffix;
	}

	get hasPrefix(): boolean {
		return !!this.prefix;
	}

	get hasLabel(): boolean {
		return !!this.label;
	}
}
