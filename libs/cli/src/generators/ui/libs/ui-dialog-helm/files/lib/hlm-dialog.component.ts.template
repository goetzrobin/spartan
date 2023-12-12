import { ChangeDetectionStrategy, Component, forwardRef, ViewEncapsulation } from '@angular/core';
import { BrnDialogComponent, BrnDialogOverlayComponent, provideBrnDialog } from '@spartan-ng/ui-dialog-brain';
import { HlmDialogOverlayDirective } from './hlm-dialog-overlay.directive';

@Component({
	selector: 'hlm-dialog',
	standalone: true,
	imports: [BrnDialogComponent, BrnDialogOverlayComponent, HlmDialogOverlayDirective],
	providers: [
		provideBrnDialog(),
		{
			provide: BrnDialogComponent,
			useExisting: forwardRef(() => HlmDialogComponent),
		},
	],
	template: `
		<brn-dialog-overlay hlm />
		<ng-content />
	`,
	changeDetection: ChangeDetectionStrategy.OnPush,
	encapsulation: ViewEncapsulation.None,
	exportAs: 'hlmDialog',
})
export class HlmDialogComponent extends BrnDialogComponent {
	constructor() {
		super();
		this.closeDelay = 100;
	}
}
