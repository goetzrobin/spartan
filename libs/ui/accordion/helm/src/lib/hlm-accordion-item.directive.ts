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
	hostDirectives: [BrnAccordionItemDirective],
})
export class HlmAccordionItemDirective {
	public readonly userClass = input<ClassValue>('', { alias: 'class' });
	protected readonly _computedClass = computed(() =>
		hlm('flex flex-1 flex-col border-b border-border', this.userClass()),
	);
}
