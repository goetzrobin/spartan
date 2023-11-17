import { Directive, effect, inject, signal } from '@angular/core';
import { BrnDialogComponent } from './brn-dialog.component';

@Directive({
	selector: '[brnDialogDescription]',
	standalone: true,
	host: {
		'[id]': '_id()',
	},
})
export class BrnDialogDescriptionDirective {
	private _dialog = inject(BrnDialogComponent);
	protected _id = signal('brn-dialog-description-' + this._dialog.dialogId);
	constructor() {
		effect(() => {
			this._dialog.setAriaDescribedBy(this._id());
		});
	}
}
