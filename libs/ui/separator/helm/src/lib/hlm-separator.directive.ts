import { Directive, Input, computed, input, signal } from '@angular/core';
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

	public readonly userClass = input<ClassValue>('', { alias: 'class' });
	protected _computedClass = computed(() =>
		hlm(
			'inline-flex shrink-0 border-0 bg-border',
			this._orientation() === 'horizontal' ? 'h-[1px] w-full' : 'h-full w-[1px]',
			this.userClass(),
		),
	);
}
