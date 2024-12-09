import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { BrnDialogOverlayComponent } from '@spartan-ng/brain/dialog';
import { provideCustomClassSettableExisting } from '@spartan-ng/ui-core';

@Component({
	selector: 'brn-sheet-overlay',
	standalone: true,
	providers: [provideCustomClassSettableExisting(() => BrnSheetOverlayComponent)],
	template: '',
	changeDetection: ChangeDetectionStrategy.OnPush,
	encapsulation: ViewEncapsulation.None,
})
export class BrnSheetOverlayComponent extends BrnDialogOverlayComponent {}
