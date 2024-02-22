import { Directive, Input, inject, signal } from '@angular/core';
import { BrnAccordionDirective } from './brn-accordion.directive';

let itemIdGenerator = 0;

@Directive({
	selector: '[brnAccordionItem]',
	standalone: true,
	host: {
		'[attr.data-state]': '_state()',
	},
})
export class BrnAccordionItemDirective {
	private readonly _accordion = inject(BrnAccordionDirective);

	public readonly id = itemIdGenerator++;

	public readonly _state = signal<'open' | 'closed'>('closed');
	@Input()
	set state(value: 'open' | 'closed') {
		this._state.set(value);
	}
	get state() {
		return this._state();
	}

	constructor() {
		if (!this._accordion) {
			throw Error('Accordion trigger can only be used inside an Accordion. Add brnAccordion to ancestor.');
		}
	}

	toggle() {
		this.setState(this.state === 'open' ? 'closed' : 'open');
		console.log('toggle', this.id, this.state);
	}

	setState(state: 'open' | 'closed') {
		this._state.set(state);
	}
}
