import { ChangeDetectionStrategy, Component, forwardRef, ViewEncapsulation } from '@angular/core';
import { BrnDialogComponent, provideBrnDialog } from '@spartan-ng/ui-dialog-brain';
import { BrnSheetComponent, BrnSheetOverlayComponent } from '@spartan-ng/ui-sheet-brain';
import { HlmSheetOverlayDirective } from './hlm-sheet-overlay.directive';

@Component({
	selector: 'hlm-sheet',
	standalone: true,
	imports: [BrnSheetOverlayComponent, HlmSheetOverlayDirective],
	providers: [
		provideBrnDialog(),
		{
			provide: BrnDialogComponent,
			useExisting: forwardRef(() => BrnSheetComponent),
		},
		{
			provide: BrnSheetComponent,
			useExisting: forwardRef(() => HlmSheetComponent),
		},
	],
	template: `
		<brn-sheet-overlay hlm />
		<ng-content />
	`,
	encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.OnPush,
	exportAs: 'hlmSheet',
})
export class HlmSheetComponent extends BrnSheetComponent {
	constructor() {
		super();
		this.closeDelay = 100;
	}
}
