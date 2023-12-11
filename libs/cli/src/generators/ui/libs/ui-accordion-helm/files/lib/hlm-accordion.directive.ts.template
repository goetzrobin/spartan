import { computed, Directive, inject, Input, signal } from '@angular/core';
import { BrnAccordionDirective } from '@spartan-ng/ui-accordion-brain';
import { hlm } from '@spartan-ng/ui-core';
import { ClassValue } from 'clsx';

@Directive({
	selector: '[hlmAccordion]',
	standalone: true,
	host: {
		'[class]': '_computedClass()',
	},
	hostDirectives: [BrnAccordionDirective],
})
export class HlmAccordionDirective {
	private readonly _brn = inject(BrnAccordionDirective);

	private readonly _userCls = signal<ClassValue>('');
	protected readonly _computedClass = computed(() =>
		hlm('flex', this._brn.orientation === 'horizontal' ? 'flex-row' : 'flex-col', this._userCls()),
	);

	@Input()
	set class(userCls: ClassValue) {
		this._userCls.set(userCls);
	}
}
