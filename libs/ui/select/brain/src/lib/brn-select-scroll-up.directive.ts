import { Directive } from '@angular/core';

// TODO: Need to check if scroll up or down is possible and this determines whether they are displayed
@Directive({
	selector: '[brnSelectScrollUp]',
	standalone: true,
	host: {
		'aria-hidden': 'true',
		class: 'flex cursor-default items-center justify-center py-1',
	},
})
export class BrnSelectScrollUpDirective {}
