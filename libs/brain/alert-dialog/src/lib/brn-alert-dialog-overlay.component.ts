import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { BrnDialogOverlayComponent } from '@spartan-ng/brain/dialog';
import { provideCustomClassSettableExisting } from '@spartan-ng/ui-core';

@Component({
	selector: 'brn-alert-dialog-overlay',
	standalone: true,
	providers: [provideCustomClassSettableExisting(() => BrnAlertDialogOverlayComponent)],
	template: '',
	changeDetection: ChangeDetectionStrategy.OnPush,
	encapsulation: ViewEncapsulation.None,
})
export class BrnAlertDialogOverlayComponent extends BrnDialogOverlayComponent {}
