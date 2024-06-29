import { Component, Signal, computed, contentChild, contentChildren } from '@angular/core';

import { HlmErrorDirective } from './directives/hlm-error.directive';
import { BrnFormFieldControl } from '@spartan-ng/ui-form-field-brain';

@Component({
	selector: 'hlm-form-field',
	template: `
		<ng-content></ng-content>

		@switch (hasDisplayedMessage()) {
			@case ('error') {
				<ng-content select="hlm-error"></ng-content>
			}
			@default {
				<ng-content select="hlm-hint"></ng-content>
			}
		}
	`,
	standalone: true,
	host: {
		class: 'space-y-2 block',
	},
})
export class HlmFormFieldComponent {
	control = contentChild.required(BrnFormFieldControl);

	errorChildren = contentChildren(HlmErrorDirective);

	hasDisplayedMessage: Signal<'error' | 'hint'> = computed(() => {
		return this.errorChildren() && this.errorChildren().length > 0 && this.control().errorState() ? 'error' : 'hint';
	});
}
