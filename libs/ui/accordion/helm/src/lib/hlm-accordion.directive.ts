import { computed, Directive, inject, input } from '@angular/core';
import { BrnAccordionDirective } from '@spartan-ng/ui-accordion-brain';
import { hlm } from '@spartan-ng/ui-core';
import { ClassValue } from 'clsx';

@Directive({
	selector: '[hlmAccordion], hlm-accordion',
	standalone: true,
	host: {
		'[class]': '_computedClass()',
	},
	hostDirectives: [BrnAccordionDirective],
})
export class HlmAccordionDirective {
	private readonly _brn = inject(BrnAccordionDirective);

	private readonly _userClass = input<ClassValue>('', { alias: 'class' });
	protected readonly _computedClass = computed(() =>
		hlm('flex', this._brn.orientation === 'horizontal' ? 'flex-row' : 'flex-col', this._userClass()),
	);
}
