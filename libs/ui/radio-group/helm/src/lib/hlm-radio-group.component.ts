import { Component, computed, forwardRef, input } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { hlm } from '@spartan-ng/ui-core';
import { BrnRadioGroupComponent } from '@spartan-ng/ui-radiogroup-brain';
import type { ClassValue } from 'clsx';

export const BRN_RADIO_GROUP_CONTROL_VALUE_ACCESSOR = {
	provide: NG_VALUE_ACCESSOR,
	useExisting: forwardRef(() => BrnRadioGroupComponent),
	multi: true,
};

@Component({
	selector: 'hlm-radio-group',
	template: `
		<ng-content></ng-content>
	`,
	providers: [
		BRN_RADIO_GROUP_CONTROL_VALUE_ACCESSOR,
		{
			provide: BrnRadioGroupComponent,
			useExisting: forwardRef(() => HlmRadioGroupComponent),
		},
	],
	standalone: true,
	host: {
		'[class]': '_computedClass()',
	},
})
export class HlmRadioGroupComponent extends BrnRadioGroupComponent {
	public readonly userClass = input<ClassValue>('', { alias: 'class' });
	protected _computedClass = computed(() => hlm('block', this.userClass()));
}
