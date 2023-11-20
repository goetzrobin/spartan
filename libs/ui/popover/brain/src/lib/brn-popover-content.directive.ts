import { Directive } from '@angular/core';
import { provideExposesStateProviderExisting } from '@spartan-ng/ui-core';
import { BrnDialogContentDirective } from '@spartan-ng/ui-dialog-brain';

@Directive({
	selector: '[brnPopoverContent]',
	standalone: true,
	providers: [provideExposesStateProviderExisting(() => BrnPopoverContentDirective)],
})
export class BrnPopoverContentDirective<T> extends BrnDialogContentDirective<T> {}
