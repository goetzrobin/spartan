import { Component, Input, computed, signal } from '@angular/core';
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
	private readonly _userCls = signal<ClassValue>('');
	@Input()
	set class(userCls: ClassValue) {
		this._userCls.set(userCls);
	}

	protected _computedClass = computed(() => this._generateClass());
	private _generateClass() {
		return hlm(
			'flex space-x-2 items-center border-b border-border px-3 [&_hlm-icon]:h-5 [&_hlm-icon]:w-5',
			this._userCls(),
		);
	}
}
