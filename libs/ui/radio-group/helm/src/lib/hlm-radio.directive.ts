import { Directive, computed, input } from '@angular/core';
import { hlm } from '@spartan-ng/ui-core';
import { ClassValue } from 'clsx';

@Directive({
	selector: 'brn-radio[hlm],[hlmRadio]',
	standalone: true,
	host: {
		'[class]': '_computedClass()',
	},
})
export class HlmRadioDirective {
	private readonly _userClass = input<ClassValue>('', { alias: 'class' });
	protected _computedClass = computed(() =>
		hlm('group [&.brn-radio-disabled]:text-muted-foreground flex items-center space-x-2', this._userClass()),
	);
}
