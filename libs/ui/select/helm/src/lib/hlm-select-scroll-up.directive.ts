import { Directive } from '@angular/core';

@Directive({
	selector: '[hlmSelectScrollUp], hlm-select-scroll-up',
	standalone: true,
	host: {
		class: 'flex cursor-default items-center justify-center py-1',
	},
})
export class HlmSelectScrollUpDirective {
	constructor() {
		console.log('hlm select');
	}
}
