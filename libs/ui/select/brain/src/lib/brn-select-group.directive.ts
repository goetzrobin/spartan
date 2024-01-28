import { Directive, Input, signal } from '@angular/core';

@Directive({
	selector: '[brnSelectGroup]',
	standalone: true,
	host: {
		role: 'group',
		'[attr.aria-labelledby]': '_labelledBy()',
	},
})
export class BrnSelectGroupDirective {
	/* eslint-disable-next-line @angular-eslint/no-input-rename */
	@Input('aria-labelledby')
	set labelledBy(labelledBy: string) {
		this._labelledBy.set(labelledBy);
	}
	get labelledBy() {
		return this._labelledBy();
	}
	readonly _labelledBy = signal('');
}
