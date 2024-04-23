import { Directive, inject } from '@angular/core';
import {
	provideExposedSideProviderExisting,
	provideExposesStateProviderExisting,
	type ExposesSide,
} from '@spartan-ng/ui-core';
import { BrnDialogContentDirective } from '@spartan-ng/ui-dialog-brain';
import { BrnSheetComponent } from './brn-sheet.component';

@Directive({
	selector: '[brnSheetContent]',
	standalone: true,
	providers: [
		provideExposesStateProviderExisting(() => BrnSheetContentDirective),
		provideExposedSideProviderExisting(() => BrnSheetContentDirective),
	],
})
export class BrnSheetContentDirective<T> extends BrnDialogContentDirective<T> implements ExposesSide {
	public readonly side = inject(BrnSheetComponent).side;
}
