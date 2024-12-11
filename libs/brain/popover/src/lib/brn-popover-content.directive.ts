import { Directive } from '@angular/core';
import { BrnDialogContentDirective } from '@spartan-ng/brain/dialog';
import { provideExposesStateProviderExisting } from '@spartan-ng/ui-core';

@Directive({
	selector: '[brnPopoverContent]',
	standalone: true,
	providers: [provideExposesStateProviderExisting(() => BrnPopoverContentDirective)],
})
export class BrnPopoverContentDirective<T> extends BrnDialogContentDirective<T> {}
