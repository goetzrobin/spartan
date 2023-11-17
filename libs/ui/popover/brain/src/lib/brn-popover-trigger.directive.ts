import { Directive, ElementRef, inject, Input } from '@angular/core';
import { BrnDialogTriggerDirective } from '@spartan-ng/ui-dialog-brain';
import { BrnPopoverComponent } from './brn-popover.component';

@Directive({
	selector: 'button[brnPopoverTrigger],button[brnPopoverTriggerFor]',
	standalone: true,
	host: {
		'[id]': '_id()',
		'(click)': 'open()',
		'aria-haspopup': 'dialog',
		'[attr.aria-expanded]': "state() === 'open' ? 'true': 'false'",
		'[attr.data-state]': 'state()',
		'[attr.aria-controls]': 'dialogId',
	},
})
export class BrnPopoverTriggerDirective extends BrnDialogTriggerDirective {
	private _host = inject(ElementRef, { host: true });
	constructor() {
		super();
		if (!this._brnDialog) return;
		this._brnDialog.attachTo = this._host.nativeElement;
	}

	@Input()
	set brnPopoverTriggerFor(brnDialog: BrnPopoverComponent) {
		brnDialog.attachTo = this._host.nativeElement;
		super.brnDialogTriggerFor = brnDialog;
	}
}
