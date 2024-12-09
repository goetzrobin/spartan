import { type NumberInput, coerceNumberProperty } from '@angular/cdk/coercion';
import { Directive, Input, inject } from '@angular/core';
import { BrnDialogRef } from './brn-dialog-ref';

@Directive({
	selector: 'button[brnDialogClose]',
	standalone: true,
	host: {
		'(click)': 'close()',
	},
})
export class BrnDialogCloseDirective {
	private readonly _brnDialogRef = inject(BrnDialogRef);

	private _delay: number | undefined;

	@Input()
	public set delay(value: NumberInput) {
		this._delay = coerceNumberProperty(value);
	}

	public close() {
		this._brnDialogRef.close(undefined, this._delay);
	}
}
