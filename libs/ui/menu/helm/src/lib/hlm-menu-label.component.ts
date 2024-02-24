import { Component, Input, booleanAttribute, computed, input, signal } from '@angular/core';
import { hlm } from '@spartan-ng/ui-core';
import { ClassValue } from 'clsx';

@Component({
	selector: 'hlm-menu-label',
	standalone: true,
	template: `
		<ng-content />
	`,
	host: {
		'[class]': '_computedClass()',
	},
})
export class HlmMenuLabelComponent {
	private readonly _userClass = input<ClassValue>('', { alias: 'class' });
	protected _computedClass = computed(() =>
		hlm('block px-2 py-1.5 text-sm font-semibold', this._inset() && 'pl-8', this._userClass()),
	);

	private readonly _inset = signal<ClassValue>(false);
	@Input({ transform: booleanAttribute })
	set inset(value: boolean) {
		this._inset.set(value);
	}
}
