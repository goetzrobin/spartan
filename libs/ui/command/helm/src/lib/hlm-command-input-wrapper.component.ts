import { Component, computed, input } from '@angular/core';
import { hlm } from '@spartan-ng/ui-core';
import { ClassValue } from 'clsx';

@Component({
	selector: 'hlm-cmd-input-wrapper',
	standalone: true,
	template: '<ng-content/>',
	host: {
		'[class]': '_computedClass()',
	},
})
export class HlmCommandInputWrapperComponent {
	private readonly _userClass = input<ClassValue>('', { alias: 'class' });
	protected _computedClass = computed(() =>
		hlm('flex space-x-2 items-center border-b border-border px-3 [&_hlm-icon]:h-5 [&_hlm-icon]:w-5', this._userClass()),
	);
}
