import { Directive, ElementRef, Input, computed, inject, signal } from '@angular/core';
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
	private readonly elementref = inject(ElementRef).nativeElement;
	private readonly _userCls = signal<ClassValue>('');
	@Input()
	set class(userCls: ClassValue) {
		this._userCls.set(userCls);
	}

	protected _computedClass = computed(() => this._generateClass());
	private _generateClass() {
		const disabled = this.elementref.getAttribute('data-disabled') === 'true';
		console.log(this.elementref, disabled);
		return hlm(
			'group inline-flex border border-foreground shrink-0 cursor-pointer items-center rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring' +
				' focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=unchecked]:bg-background',
			disabled ? 'cursor-not-allowed opacity-50' : '',
			this._userCls(),
		);
	}
}