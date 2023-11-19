import { Directive, Input, computed, signal } from '@angular/core';
import { hlm } from '@spartan-ng/ui-core';
import { ClassValue } from 'clsx';

@Directive({
	selector: '[hlmAccordionItem],brn-accordion-item[hlm]',
	standalone: true,
	host: {
		'[class]': '_generatedClasses()',
	},
})
export class HlmAccordionItemDirective {
	private _userCls = signal<ClassValue>('');
	protected _generatedClasses = computed(() => {
		return hlm('flex flex-1 flex-col border-b border-border', this._userCls());
	});

	@Input()
	set class(userCls: ClassValue) {
		this._userCls.set(userCls);
	}
}
