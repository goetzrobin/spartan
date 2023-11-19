import { Directive, Input, computed, signal } from '@angular/core';
import { hlm } from '@spartan-ng/ui-core';
import { ClassValue } from 'clsx';

@Directive({
	selector: '[hlmAccordion],brn-accordion[hlm]',
	standalone: true,
	host: {
		'[class]': '_computedClass()',
	},
})
export class HlmAccordionDirective {
	private _userCls = signal<ClassValue>('');
	@Input()
	set class(userCls: ClassValue) {
		this._userCls.set(userCls);
	}

	protected _computedClass = computed(() => {
		return hlm('flex flex-col', this._userCls());
	});
}
