import { Directive } from '@angular/core';

@Directive({
	selector: '[hlmSelectScrollDown], hlm-select-scroll-down',
	standalone: true,
	host: {
		class: 'flex cursor-default items-center justify-center py-1',
	},
})
export class HlmSelectScrollDownDirective {}
