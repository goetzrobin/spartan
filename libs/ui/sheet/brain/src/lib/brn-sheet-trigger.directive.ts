import { Directive, Input, inject } from '@angular/core';
import { BrnDialogTriggerDirective } from '@spartan-ng/ui-dialog-brain';
import { BrnSheetComponent } from './brn-sheet.component';

@Directive({
	selector: 'button[brnSheetTrigger]',
	standalone: true,
})
export class BrnSheetTriggerDirective extends BrnDialogTriggerDirective {
	private readonly _sheet = inject(BrnSheetComponent, { optional: true });
	@Input()
	public side: 'top' | 'bottom' | 'left' | 'right' | undefined;

	override open() {
		if (this._sheet && this.side) {
			this._sheet.setSide = this.side;
		}
		super.open();
	}
}
