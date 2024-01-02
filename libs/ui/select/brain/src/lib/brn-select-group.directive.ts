import { Directive, Input, signal } from '@angular/core';

@Directive({
	selector: '[brnSelectGroup]',
	standalone: true,
	host: {
		role: 'group',
		'[aria-labelledby]': '_labelledBy()',
	},
})
export class BrnSelectGroupDirective {
	/* eslint-disable-next-line @angular-eslint/no-input-rename */
	@Input('aria-labelledby')
	set labelledBy(labelledBy: string) {
		this._labelledBy.set(labelledBy);
	}
	readonly _labelledBy = signal('');
}
