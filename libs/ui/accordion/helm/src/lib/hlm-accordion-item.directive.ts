import { Directive, Input, computed, signal } from '@angular/core';
import { hlm } from '@spartan-ng/ui-core';
import { ClassValue } from 'clsx';

@Directive({
	selector: '[hlmAccordionItem],brn-accordion-item[hlm]',
	standalone: true,
	host: {
		'[class]': '_computedClass()',
	},
})
export class HlmAccordionItemDirective {
	private _userCls = signal<ClassValue>('');
	@Input()
	set class(userCls: ClassValue) {
		this._userCls.set(userCls);
	}

	protected _computedClass = computed(() => {
		return hlm('flex flex-1 flex-col border-b border-border', this._userCls());
	});
}
