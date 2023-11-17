import { Directive, forwardRef, inject } from '@angular/core';
import { EXPOSES_SIDE_TOKEN, EXPOSES_STATE_TOKEN } from '@spartan-ng/ui-core';
import { BrnDialogContentDirective } from '@spartan-ng/ui-dialog-brain';
import { BrnSheetComponent } from './brn-sheet.component';

@Directive({
	selector: '[brnSheetContent]',
	standalone: true,
	providers: [
		{
			provide: EXPOSES_STATE_TOKEN,
			useExisting: forwardRef(() => BrnSheetContentDirective),
		},
		{
			provide: EXPOSES_SIDE_TOKEN,
			useExisting: forwardRef(() => BrnSheetContentDirective),
		},
	],
})
export class BrnSheetContentDirective<T> extends BrnDialogContentDirective<T> {
	public readonly side = inject(BrnSheetComponent).side;
}
