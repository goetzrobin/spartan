import { Directive, inject } from '@angular/core';
import { BrnDialogContentDirective } from '@spartan-ng/brain/dialog';
import {
	type ExposesSide,
	provideExposedSideProviderExisting,
	provideExposesStateProviderExisting,
} from '@spartan-ng/ui-core';
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
