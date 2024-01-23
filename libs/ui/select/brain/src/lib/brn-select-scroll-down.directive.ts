import { Directive } from '@angular/core';

@Directive({
	selector: '[brnSelectScrollDown], brn-select-scroll-down, hlm-select-scroll-down:not(noHlm)',
	standalone: true,
	host: {
		'aria-hidden': 'true',
		// class: 'flex cursor-default items-center justify-center py-1',
	},
})
export class BrnSelectScrollDownDirective {}
