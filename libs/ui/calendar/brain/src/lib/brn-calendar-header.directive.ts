import { Directive, input } from '@angular/core';

let uniqueId = 0;

@Directive({
	selector: '[brnCalendarHeader]',
	standalone: true,
	host: {
		'[id]': 'id()',
		'aria-live': 'polite',
		role: 'presentation',
	},
})
export class BrnCalendarHeaderDirective {
	/** The unique id for the header */
	public readonly id = input(`brn-calendar-header-${uniqueId++}`);
}
