import { Directive, Input, computed, signal } from '@angular/core';
import { hlm } from '@spartan-ng/ui-core';
import { ClassValue } from 'clsx';

export type HlmSeparatorOrientation = 'horizontal' | 'vertical';
@Directive({
	selector: '[hlmSeparator],brn-separator[hlm]',
	standalone: true,
	host: {
		'[class]': '_computedClass()',
	},
})
export class HlmSeparatorDirective {
	private readonly _orientation = signal<HlmSeparatorOrientation>('horizontal');
	@Input()
	set orientation(value: HlmSeparatorOrientation) {
		this._orientation.set(value);
	}

	private readonly _userCls = signal<ClassValue>('');
	@Input()
	set class(userCls: ClassValue) {
		this._userCls.set(userCls);
	}

	protected _computedClass = computed(() => this._generateClass());
	private _generateClass() {
		return hlm(
			'inline-flex shrink-0 border-0 bg-border',
			this._orientation() === 'horizontal' ? 'h-[1px] w-full' : 'h-full w-[1px]',
			this._userCls(),
		);
	}
}
