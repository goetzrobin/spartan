import { Directive, Input, computed, signal } from '@angular/core';
import { hlm } from '@spartan-ng/ui-core';
import { ClassValue } from 'clsx';

@Directive({
	selector: '[hlmCmdEmpty]',
	standalone: true,
	host: {
		'[class]': '_computedClass()',
	},
})
export class HlmCommandEmptyDirective {
	private readonly _userCls = signal<ClassValue>('');
	@Input()
	set class(userCls: ClassValue) {
		this._userCls.set(userCls);
	}

	protected _computedClass = computed(() => this._generateClass());
	private _generateClass() {
		return hlm('py-6 text-center text-sm', this._userCls());
	}
}
