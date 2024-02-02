import { Directive, signal } from '@angular/core';

@Directive({
	selector: '[brnSelectGroup]',
	standalone: true,
	host: {
		role: 'group',
		'[attr.aria-labelledby]': 'labelledBy()',
	},
})
export class BrnSelectGroupDirective {
	public readonly labelledBy = signal('');
}
