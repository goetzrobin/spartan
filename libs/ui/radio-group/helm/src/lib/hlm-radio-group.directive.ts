import { Directive, computed, input } from '@angular/core';
import { hlm } from '@spartan-ng/ui-core';
import type { ClassValue } from 'clsx';

@Directive({
	selector: 'brn-radio-group[hlm],[hlmRadioGroup]',
	standalone: true,
	host: {
		'[class]': '_computedClass()',
	},
})
export class HlmRadioGroupDirective {
	public readonly userClass = input<ClassValue>('', { alias: 'class' });
	protected _computedClass = computed(() => hlm('block', this.userClass()));
}
