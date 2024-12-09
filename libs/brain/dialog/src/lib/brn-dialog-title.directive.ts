import { Directive, effect, inject, signal } from '@angular/core';
import { BrnDialogRef } from './brn-dialog-ref';

@Directive({
	selector: '[brnDialogTitle]',
	standalone: true,
	host: {
		'[id]': '_id()',
	},
})
export class BrnDialogTitleDirective {
	private readonly _brnDialogRef = inject(BrnDialogRef);

	protected _id = signal(`brn-dialog-title-${this._brnDialogRef?.dialogId}`);

	constructor() {
		effect(() => {
			this._brnDialogRef.setAriaLabelledBy(this._id());
		});
	}
}
