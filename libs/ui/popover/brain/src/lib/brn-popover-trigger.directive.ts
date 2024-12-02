import { Directive, effect, ElementRef, inject, input } from '@angular/core';
import { BrnDialogTriggerDirective } from '@spartan-ng/ui-dialog-brain';
import type { BrnPopoverComponent } from './brn-popover.component';

@Directive({
	selector: 'button[brnPopoverTrigger],button[brnPopoverTriggerFor]',
	standalone: true,
	host: {
		'[id]': 'id()',
		'aria-haspopup': 'dialog',
		'[attr.aria-expanded]': "state() === 'open' ? 'true': 'false'",
		'[attr.data-state]': 'state()',
		'[attr.aria-controls]': 'dialogId',
	},
})
export class BrnPopoverTriggerDirective extends BrnDialogTriggerDirective {
	private readonly _host = inject(ElementRef, { host: true });

	constructor() {
		super();
		if (!this._brnDialog) return;
		this._brnDialog.attachToState().set(this._host.nativeElement);
		this._brnDialog.closeOnOutsidePointerEventsState().set(true);
	}

	public readonly brnPopoverTriggerFor = input<BrnPopoverComponent | undefined>(undefined, {
		alias: 'brnPopoverTriggerFor',
	});
	private readonly _brnPopoverTriggerForEffect = effect(
		() => {
			const brnDialog = this.brnPopoverTriggerFor();
			if (!brnDialog) return;
			brnDialog.attachToState().set(this._host.nativeElement);
			brnDialog.closeOnOutsidePointerEventsState().set(true);
			this.brnDialogTriggerForState().set(brnDialog);
		},
		{ allowSignalWrites: true },
	);
}
