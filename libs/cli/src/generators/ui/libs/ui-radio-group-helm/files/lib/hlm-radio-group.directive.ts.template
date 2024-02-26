import { Directive, computed, input } from '@angular/core';
import { hlm } from '@spartan-ng/ui-core';
import { ClassValue } from 'clsx';

@Directive({
	selector: 'brn-radio-group[hlm],[hlmRadioGroup]',
	standalone: true,
	host: {
		'[class]': '_computedClass()',
	},
})
export class HlmRadioGroupDirective {
	private readonly _userClass = input<ClassValue>('', { alias: 'class' });
	protected _computedClass = computed(() => hlm('block', this._userClass()));
}
