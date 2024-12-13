import { ChangeDetectionStrategy, Component, ViewEncapsulation, forwardRef } from '@angular/core';
import { BrnAlertDialogComponent, BrnAlertDialogOverlayComponent } from '@spartan-ng/brain/alert-dialog';
import { BrnDialogComponent } from '@spartan-ng/brain/dialog';
import { HlmAlertDialogOverlayDirective } from './hlm-alert-dialog-overlay.directive';

@Component({
	selector: 'hlm-alert-dialog',
	standalone: true,
	template: `
		<brn-alert-dialog-overlay hlm />
		<ng-content />
	`,
	providers: [
		{
			provide: BrnDialogComponent,
			useExisting: forwardRef(() => HlmAlertDialogComponent),
		},
	],
	changeDetection: ChangeDetectionStrategy.OnPush,
	encapsulation: ViewEncapsulation.None,
	exportAs: 'hlmAlertDialog',
	imports: [BrnAlertDialogOverlayComponent, HlmAlertDialogOverlayDirective],
})
export class HlmAlertDialogComponent extends BrnAlertDialogComponent {
	constructor() {
		super();
		this.closeDelay = 100;
	}
}
