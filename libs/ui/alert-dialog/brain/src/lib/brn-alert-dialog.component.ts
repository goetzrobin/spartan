import { ChangeDetectionStrategy, Component, forwardRef, ViewEncapsulation } from '@angular/core';
import { BrnDialogComponent } from '@spartan-ng/ui-dialog-brain';

@Component({
	selector: 'brn-alert-dialog',
	standalone: true,
	template: `
		<ng-content />
	`,
	providers: [
		{
			provide: BrnDialogComponent,
			useExisting: forwardRef(() => BrnAlertDialogComponent),
		},
	],
	changeDetection: ChangeDetectionStrategy.OnPush,
	encapsulation: ViewEncapsulation.None,
	exportAs: 'brnAlertDialog',
})
export class BrnAlertDialogComponent extends BrnDialogComponent {
	constructor() {
		super();
		this._options.role = 'alertdialog';
		this._options.closeOnBackdropClick = false;
		this._options.closeOnOutsidePointerEvents = false;
	}
}
