import { computed, Directive, input } from '@angular/core';
import { BrnAccordionItemDirective } from '@spartan-ng/ui-accordion-brain';
import { hlm } from '@spartan-ng/ui-core';
import { ClassValue } from 'clsx';

@Directive({
	selector: '[hlmAccordionItem],brn-accordion-item[hlm],hlm-accordion-item',
	standalone: true,
	host: {
		'[class]': '_computedClass()',
	},
	hostDirectives: [
		{
			directive: BrnAccordionItemDirective,
			inputs: ['isOpened'],
		},
	],
})
export class HlmAccordionItemDirective {
	private readonly _userClass = input<ClassValue>('', { alias: 'class' });
	protected readonly _computedClass = computed(() =>
		hlm('flex flex-1 flex-col border-b border-border', this._userClass()),
	);
}
