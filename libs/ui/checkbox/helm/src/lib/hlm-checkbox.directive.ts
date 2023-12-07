import { computed, Directive, inject, Input, signal } from '@angular/core';
import { BrnCheckboxComponent } from '@spartan-ng/ui-checkbox-brain';
import { hlm } from '@spartan-ng/ui-core';
import { ClassValue } from 'clsx';

@Directive({
	selector: 'brn-checkbox[hlm],[hlmCheckbox]',
	standalone: true,
	host: {
		'[class]': '_computedClass()',
	},
})
export class HlmCheckboxDirective {
	private readonly _brnCheckbox = inject(BrnCheckboxComponent);
	private readonly _userCls = signal<ClassValue>('');
	@Input()
	set class(userCls: ClassValue) {
		this._userCls.set(userCls);
	}

	protected _computedClass = computed(() => this._generateClass());
	private _generateClass() {
		return hlm(
			'group inline-flex border border-foreground shrink-0 cursor-pointer items-center rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring' +
				' focus-visible:ring-offset-2 focus-visible:ring-offset-background data-[state=checked]:text-background data-[state=unchecked]:bg-foreground data-[state=checked]:bg-primary data-[state=unchecked]:bg-background',
			this._brnCheckbox.disabled ? 'cursor-not-allowed opacity-50' : '',
			this._userCls(),
		);
	}
}
