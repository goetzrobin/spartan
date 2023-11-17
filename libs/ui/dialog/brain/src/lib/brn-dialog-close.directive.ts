import { coerceNumberProperty, NumberInput } from '@angular/cdk/coercion';
import { Directive, inject, Input } from '@angular/core';
import { BrnDialogComponent } from './brn-dialog.component';

@Directive({
	selector: 'button[brnDialogClose]',
	standalone: true,
	host: {
		'(click)': 'close()',
	},
})
export class BrnDialogCloseDirective {
	private _brnDialog = inject(BrnDialogComponent);
	private _delay: number | undefined;
	@Input()
	set delay(value: NumberInput) {
		this._delay = coerceNumberProperty(value);
	}
	close() {
		this._brnDialog.close(this._delay);
	}
}
