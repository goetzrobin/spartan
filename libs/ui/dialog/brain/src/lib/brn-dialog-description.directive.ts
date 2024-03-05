import { Directive, effect, inject, signal } from '@angular/core';
import { BrnDialogRef } from './brn-dialog-ref';

@Directive({
	selector: '[brnDialogDescription]',
	standalone: true,
	host: {
		'[id]': '_id()',
	},
})
export class BrnDialogDescriptionDirective {
	private readonly _brnDialogRef = inject(BrnDialogRef);

	protected _id = signal(`brn-dialog-description-${this._brnDialogRef?.dialogId}`);

	constructor() {
		effect(() => {
			this._brnDialogRef.setAriaDescribedBy(this._id());
		});
	}
}
