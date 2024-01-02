import { Directive } from '@angular/core';

@Directive({
	selector: '[brnSelectScrollDown]',
	standalone: true,
	host: {
		'aria-hidden': 'true',
		class: 'flex cursor-default items-center justify-center py-1',
	},
})
export class BrnSelectScrollDownDirective {}
