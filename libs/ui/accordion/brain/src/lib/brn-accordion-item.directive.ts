import { Directive, computed, inject } from '@angular/core';
import { BrnAccordionDirective } from './brn-accordion.directive';

let itemIdGenerator = 0;

@Directive({
	selector: '[brnAccordionItem]',
	standalone: true,
	host: {
		'[attr.data-state]': 'state()',
	},
})
export class BrnAccordionItemDirective {
	private _accordion = inject(BrnAccordionDirective);

	public id = itemIdGenerator++;
	public state = computed(() => (this._accordion.openItemIds().includes(this.id) ? 'open' : 'closed'));

	constructor() {
		if (!this._accordion) {
			throw Error('Accordion trigger can only be used inside an Accordion. Add brnAccordion to ancestor.');
		}
	}
}
