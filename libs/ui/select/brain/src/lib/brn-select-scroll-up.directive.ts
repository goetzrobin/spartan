import { Directive } from '@angular/core';

// TODO: Need to check if scroll up or down is possible and this determines whether they are displayed
@Directive({
	selector: '[brnSelectScrollUp], brn-select-scroll-up, hlm-select-scroll-up:not(noHlm)',
	standalone: true,
	host: {
		'aria-hidden': 'true',
	},
})
export class BrnSelectScrollUpDirective {}
