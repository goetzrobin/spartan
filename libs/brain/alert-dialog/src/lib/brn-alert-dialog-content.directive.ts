import { Directive } from '@angular/core';
import { BrnDialogContentDirective } from '@spartan-ng/brain/dialog';
import { provideExposesStateProviderExisting } from '@spartan-ng/ui-core';

@Directive({
	selector: '[brnAlertDialogContent]',
	standalone: true,
	providers: [provideExposesStateProviderExisting(() => BrnAlertDialogContentDirective)],
})
export class BrnAlertDialogContentDirective<T> extends BrnDialogContentDirective<T> {}
