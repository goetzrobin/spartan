import { computed, Directive, inject, Input, signal } from '@angular/core';
import { BrnAccordionContentComponent } from '@spartan-ng/ui-accordion-brain';
import { hlm } from '@spartan-ng/ui-core';
import { ClassValue } from 'clsx';

@Directive({
	selector: '[hlmAccordionContent],brn-accordion-content[hlm]',
	standalone: true,
	host: {
		'[class]': '_computedClass()',
	},
})
export class HlmAccordionContentDirective {
	private readonly _brn = inject(BrnAccordionContentComponent, { optional: true });

	private readonly _userCls = signal<ClassValue>('');
	protected readonly _computedClass = computed(() => {
		const gridRows = this._brn?.state() === 'open' ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]';
		return hlm('text-sm transition-all grid', gridRows, this._userCls());
	});

	@Input()
	set class(userCls: ClassValue) {
		this._userCls.set(userCls);
	}

	constructor() {
		this._brn?.setClassToCustomElement('pt-1 pb-4');
	}
}
