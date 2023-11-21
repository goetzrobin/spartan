import { Directive, Input, computed, signal } from '@angular/core';
import { hlm } from '@spartan-ng/ui-core';
import { ClassValue } from 'clsx';

export const hlmH1 = 'scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl';

@Directive({
	selector: '[hlmH1]',
	standalone: true,
	host: {
		'[class]': '_computedClass()',
	},
})
export class HlmH1Directive {
	private readonly _userCls = signal<ClassValue>('');
	@Input()
	set class(userCls: ClassValue) {
		this._userCls.set(userCls);
	}

	protected _computedClass = computed(() => this._generateClass());
	private _generateClass() {
		return hlm(hlmH1, this._userCls());
	}
}
