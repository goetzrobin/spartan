import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { provideCustomClassSettableExisting } from '@spartan-ng/ui-core';
import { BrnDialogOverlayComponent } from '@spartan-ng/ui-dialog-brain';

@Component({
	selector: 'brn-sheet-overlay',
	standalone: true,
	providers: [provideCustomClassSettableExisting(() => BrnSheetOverlayComponent)],
	template: '',
	changeDetection: ChangeDetectionStrategy.OnPush,
	encapsulation: ViewEncapsulation.None,
})
export class BrnSheetOverlayComponent extends BrnDialogOverlayComponent {}
